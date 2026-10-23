import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ContentForm from "../components/ContentForm";
import { countWords, fieldError, isFieldVisible } from "../lib/forms";
import applyForm from "../data/applyForm.json";
import supportForm from "../data/supportForm.json";
import type { FormDefinition } from "../types/content";

const minimal: FormDefinition = {
  action: "",
  submitLabel: "Send",
  fields: [{ name: "email", label: "Email", type: "email", required: true }],
  success: { title: "Received", message: "We will write to {email}." },
};
const done = { label: "Done", onClick: () => {} };

describe("conditional forms", () => {
  it("disables hidden application fields and retains values when switching branches", async () => {
    const { container } = render(
      <ContentForm
        id="apply"
        definition={applyForm}
        done={done}
      />,
    );
    const motivation = screen.getByLabelText(/Why do you want to join/);
    expect(motivation).toBeDisabled();
    expect(motivation).not.toBeVisible();
    const branch = screen.getByLabelText(/What are you applying for/);
    await userEvent.selectOptions(branch, "Join CIReN");
    await userEvent.type(motivation, "Build research skills");
    expect(motivation).toBeRequired();
    await userEvent.selectOptions(branch, "Host a campus club");
    expect(motivation).toBeDisabled();
    expect(
      new FormData(container.querySelector("form")!).has("motivation"),
    ).toBe(false);
    await userEvent.selectOptions(branch, "Join CIReN");
    expect(motivation).toHaveValue("Build research skills");
  });

  it("hides payment panels when their parent branch is no longer active", async () => {
    render(
      <ContentForm
        id="support"
        definition={supportForm}
        done={done}
      />,
    );
    const branch = screen.getByLabelText(/How would you like to support/);
    await userEvent.selectOptions(branch, "A financial contribution");
    await userEvent.selectOptions(
      screen.getByLabelText(/Which would you prefer/),
      "Paystack",
    );
    expect(
      screen.getByRole("link", { name: /Give via Paystack/ }),
    ).toHaveAttribute("href", supportForm.payment.options[0].url);
    await userEvent.selectOptions(branch, "Another kind of support");
    expect(
      screen.queryByRole("link", { name: /Give via Paystack/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Which would you prefer/)).toBeDisabled();
    expect(
      screen.getByLabelText(/Tell us how you would like to help/),
    ).toBeEnabled();
  });

  it("resolves chained conditions and rejects cycles", () => {
    const fields = [
      {
        name: "a",
        label: "A",
        type: "text",
        showWhen: { field: "b", equals: ["yes"] },
      },
      {
        name: "b",
        label: "B",
        type: "text",
        showWhen: { field: "a", equals: ["yes"] },
      },
    ];
    expect(isFieldVisible(fields[0], fields, { a: "yes", b: "yes" })).toBe(
      false,
    );
  });
});

describe("form submissions", () => {
  it("does not submit invalid required fields", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(
      <ContentForm
        id="test"
        definition={{ ...minimal, action: "https://example.com/form" }}
        done={done}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Send/ }));
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([true, false])(
    "handles an empty endpoint with demoMode=%s",
    async (demoMode) => {
      const fetch = vi.fn();
      vi.stubGlobal("fetch", fetch);
      render(
        <ContentForm
          id="test"
          definition={{ ...minimal, demoMode }}
          done={done}
        />,
      );
      await userEvent.type(
        screen.getByLabelText(/Email/),
        "person@example.com",
      );
      await userEvent.click(screen.getByRole("button", { name: /Send/ }));
      expect(screen.getByRole("status")).toHaveTextContent(
        demoMode ? "Received" : "Your details have not been sent",
      );
      expect(fetch).not.toHaveBeenCalled();
      if (demoMode) expect(screen.queryByLabelText(/Email/)).toBeNull();
      else expect(screen.getByLabelText(/Email/)).toHaveValue("person@example.com");
    },
  );

  it("posts URL-encoded fields, blocks duplicate requests, and confirms after success", async () => {
    let finish!: (value: { ok: boolean; json: () => Promise<unknown> }) => void;
    const fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetch);
    const { container } = render(
      <ContentForm
        id="test"
        definition={{ ...minimal, action: "https://example.com/form" }}
        done={done}
      />,
    );
    await userEvent.type(screen.getByLabelText(/Email/), "person@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Send/ }));
    expect(screen.getByRole("button", { name: /Sending/ })).toBeDisabled();
    fireEvent.submit(container.querySelector("form")!);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/form",
      expect.objectContaining({
        method: "POST",
        body: expect.any(URLSearchParams),
      }),
    );
    const body = (fetch.mock.calls[0] as unknown[])[1] as { body: URLSearchParams };
    expect(body.body.get("email")).toBe("person@example.com");
    expect(body.body.get("_gotcha")).toBe("");
    finish({ ok: true, json: async () => ({ ok: true }) });
    expect(
      await screen.findByRole("heading", { name: "Received" }),
    ).toHaveFocus();
    expect(screen.getByText("We will write to person@example.com.")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Email/)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
  });

  it.each(["http", "network", "receiver"])(
    "retains entered data after a %s error",
    async (failure) => {
      vi.stubGlobal(
        "fetch",
        failure === "http"
          ? vi.fn().mockResolvedValue({ ok: false, status: 500 })
          : failure === "receiver"
            ? vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ ok: false, error: "Sheet not found" }),
              })
            : vi.fn().mockRejectedValue(new Error("offline")),
      );
      render(
        <ContentForm
          id="test"
          definition={{ ...minimal, action: "https://example.com/form" }}
          done={done}
        />,
      );
      await userEvent.type(
        screen.getByLabelText(/Email/),
        "person@example.com",
      );
      await userEvent.click(screen.getByRole("button", { name: /Send/ }));
      expect(await screen.findByRole("status")).toHaveTextContent(
        "Something went wrong",
      );
      expect(screen.getByLabelText(/Email/)).toHaveValue("person@example.com");
      expect(screen.getByRole("button", { name: /Send/ })).toBeEnabled();
    },
  );
});

describe("application rules", () => {
  const email = applyForm.fields.find((field) => field.name === "email")!;
  const motivation = applyForm.fields.find((f) => f.name === "motivation")!;
  const journey = applyForm.fields.find((f) => f.name === "tech_journey")!;
  const words = (n: number) => Array(n).fill("word").join(" ");

  it.each([
    ["ama@school.edu", true],
    ["ama@st.school.edu", true],
    ["ama@st.ug.edu.gh", true],
    ["kofi@ashesi.edu.gh", true],
    ["zola@uni.ac.za", true],
    ["ama@gmail.com", false],
    ["ama@yahoo.co.uk", false],
    ["ama@edu.gh", false],
    ["ama@school.education", false],
  ])("students: %s accepted=%s", (address, ok) => {
    expect(fieldError(email, { role: "Student", email: address }) === "").toBe(ok);
  });

  it("only restricts the email domain for students", () => {
    expect(fieldError(email, { role: "Researcher", email: "ama@gmail.com" })).toBe("");
  });

  it("limits the motivation to 50-200 words and the journey to at least 50", () => {
    expect(countWords("  one two\nthree  ")).toBe(3);
    expect(fieldError(motivation, { motivation: words(49) })).toMatch(/at least 50/);
    expect(fieldError(motivation, { motivation: words(150) })).toBe("");
    expect(fieldError(motivation, { motivation: words(201) })).toMatch(/200 words or fewer/);
    expect(fieldError(journey, { tech_journey: words(49) })).toMatch(/at least 50/);
    expect(fieldError(journey, { tech_journey: words(2000) })).toBe("");
    expect(journey.label).toBe("Tell us about your tech/research journey so far");
  });

  it("blocks sending a student application with a personal email", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<ContentForm id="apply" definition={applyForm} done={done} />);
    await userEvent.selectOptions(screen.getByLabelText(/I am applying as/), "Student");
    const input = screen.getByLabelText(/Email Address/);
    await userEvent.type(input, "ama@gmail.com");
    expect((input as HTMLInputElement).validationMessage).toMatch(/university email/);
    expect(screen.getByText(/Use your student email/)).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "ama@st.ug.edu.gh");
    expect((input as HTMLInputElement).validationMessage).toBe("");
  });
});
