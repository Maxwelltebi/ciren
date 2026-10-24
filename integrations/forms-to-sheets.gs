/**
 * CIReN website forms -> Google Sheets, with an email alert for every entry.
 *
 * Lives in the CIReN leaders' workspace spreadsheet (Extensions -> Apps Script)
 * and is deployed as a web app. The website posts each form to the web app URL
 * with ?form=apply or ?form=support. Setup steps: README, "Form submissions".
 *
 * Alert addresses are NOT in this file (the repo is public). Set them under
 * Project Settings -> Script properties:
 *   ALERT_EMAILS = first@example.com, second@example.com
 */

const FORMS = {
  apply: { tab: 'JOIN CIReN', title: 'New CIReN application' },
  support: { tab: 'SUPPORT CIReN', title: 'New CIReN support request' },
};
const TIMESTAMP = 'Submitted';

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const form = FORMS[params.form];
    if (!form) {
      console.warn(`Rejected: unknown form "${params.form}"`);
      return reply({ ok: false, error: 'Unknown form' });
    }
    // Honeypot filled in: probably a bot, but browser autofill can do it too.
    // Save the entry flagged rather than drop it, and send no alert email.
    const suspected = Boolean(params._gotcha);

    const fields = Object.keys(params).filter(
      (key) => key !== 'form' && !key.startsWith('_'),
    );
    if (suspected) {
      params.spam_check = 'Hidden anti-spam field was filled: check before replying';
      fields.push('spam_check');
      console.warn(`Flagged as possible spam (${form.tab})`);
    }
    // One writer at a time, so two entries never race for the same row or header.
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    let sheet;
    try {
      sheet = findTab(params.form, form.tab);
      appendEntry(sheet, fields, params);
    } finally {
      lock.releaseLock();
    }
    console.log(`Saved to ${sheet.getName()}`);
    // The entry is saved by now; a failed email must not fail the submission.
    try {
      if (!suspected) notify(form, sheet, fields, params);
    } catch (err) {
      console.error('Alert email failed', err);
    }
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: String((err && err.message) || err) });
  }
}

// Opening the web app URL in a browser shows this, which confirms the deploy.
function doGet() {
  return ContentService.createTextOutput('CIReN form receiver is running.');
}

/**
 * Run once from the editor (select it, press Run). It asks for permission to
 * use the sheet and send email, and checks both tabs and the alert addresses.
 */
function checkSetup() {
  Object.keys(FORMS).forEach((key) => {
    const sheet = findTab(key, FORMS[key].tab);
    console.log(`${key}: writing to tab "${sheet.getName()}"`);
  });
  const emails = alertEmails();
  if (!emails.length) throw new Error('Add ALERT_EMAILS under Project Settings -> Script properties.');
  console.log(`Alerts go to: ${emails.join(', ')}`);
  MailApp.getRemainingDailyQuota(); // Triggers the email permission prompt.
}

// Finds a tab by its remembered ID first, so renaming the tab later is safe.
function findTab(key, name) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty(`TAB_ID_${key}`);
  let sheet = savedId
    ? book.getSheets().find((tab) => String(tab.getSheetId()) === savedId)
    : null;
  if (!sheet) sheet = book.getSheetByName(name);
  if (!sheet) throw new Error(`Tab "${name}" not found`);
  props.setProperty(`TAB_ID_${key}`, String(sheet.getSheetId()));
  return sheet;
}

// Columns are matched by header text, so leaders can add or reorder columns
// (Status, Assigned to, Notes...) as long as row 1 stays the header row.
function appendEntry(sheet, fields, params) {
  const lastColumn = sheet.getLastColumn();
  const headers = lastColumn
    ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String)
    : [];
  const wanted = [TIMESTAMP, ...fields.map(headerFor)];
  const missing = wanted.filter((header) => !headers.includes(header));
  if (missing.length) {
    sheet
      .getRange(1, headers.length + 1, 1, missing.length)
      .setValues([missing])
      .setFontWeight('bold');
    headers.push(...missing);
    sheet.setFrozenRows(1);
  }
  const row = headers.map(() => '');
  row[headers.indexOf(TIMESTAMP)] = new Date();
  fields.forEach((field) => {
    row[headers.indexOf(headerFor(field))] = safeCell(params[field]);
  });
  sheet.appendRow(row);
}

function notify(form, sheet, fields, params) {
  const emails = alertEmails();
  if (!emails.length) return;
  const link = `${sheet.getParent().getUrl()}#gid=${sheet.getSheetId()}`;
  const rows = fields
    .filter((field) => params[field])
    .map(
      (field) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#526157"><b>${escapeHtml(headerFor(field))}</b></td>` +
        `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(params[field])}</td></tr>`,
    )
    .join('');
  const who = params.full_name ? `: ${params.full_name}` : '';
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email || '') ? params.email : undefined;
  MailApp.sendEmail({
    to: emails.join(','),
    subject: `${form.title}${who}`,
    name: 'CIReN Website',
    ...(replyTo && { replyTo }),
    htmlBody:
      `<p>${escapeHtml(form.title)} from the website.</p>` +
      `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>` +
      `<p><a href="${link}">Open the "${escapeHtml(sheet.getName())}" tab</a>` +
      (replyTo ? ' - reply to this email to answer them directly.' : '') +
      '</p>',
  });
}

function alertEmails() {
  return (PropertiesService.getScriptProperties().getProperty('ALERT_EMAILS') || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

function headerFor(field) {
  return field
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Text starting with = + - or @ would run as a spreadsheet formula. The
// leading apostrophe keeps it as plain text and is not shown in the cell.
function safeCell(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
