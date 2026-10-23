import type { FormFieldDefinition } from "../types/content";

// Resolve dependencies recursively so a hidden controller cannot expose a child.
export function isFieldVisible(
  field: FormFieldDefinition,
  fields: FormFieldDefinition[],
  values: Record<string, string>,
  visited = new Set<string>(),
): boolean {
  if (!field.showWhen) return true;
  if (visited.has(field.name)) return false;
  visited.add(field.name);
  const controller = fields.find((item) => item.name === field.showWhen?.field);
  return (
    !!controller &&
    isFieldVisible(controller, fields, values, visited) &&
    field.showWhen.equals.includes(values[controller.name] ?? "")
  );
}

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * The custom validation message for a field, or "" when it is valid. Fed to
 * setCustomValidity, so the browser's own validation blocks the submit and
 * shows the message. Required/empty is left to the native `required` check.
 */
export function fieldError(
  field: FormFieldDefinition,
  values: Record<string, string>,
): string {
  const value = values[field.name] ?? "";
  if (!value) return "";
  const rule = field.pattern;
  if (
    rule &&
    (!rule.when || rule.when.equals.includes(values[rule.when.field] ?? "")) &&
    !new RegExp(rule.regex, "i").test(value.trim())
  )
    return rule.message;
  const words = countWords(value);
  if (field.minWords && words < field.minWords)
    return `Please write at least ${field.minWords} words (you have ${words}).`;
  if (field.maxWords && words > field.maxWords)
    return `Please keep this to ${field.maxWords} words or fewer (you have ${words}).`;
  return "";
}
