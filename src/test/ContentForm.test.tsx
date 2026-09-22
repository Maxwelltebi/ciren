import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ContentForm from "../components/ContentForm";
import { isFieldVisible } from "../lib/forms";
import applyForm from "../data/applyForm.json";
import supportForm from "../data/supportForm.json";
import type { FormDefinition } from "../types/content";

const minimal: FormDefinition = {
  action: "",
  submitLabel: "Send",
  fields: [{ name: "email", label: "Email", type: "email", required: true }],
};

describe("conditional forms", () => {
  it("disables hidden application fields and retains values when switching branches", async () => {
    const { container } = render(
      <ContentForm
        id="apply"
        definition={applyForm}
        successMessage="Received"
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
        successMessage="Received"
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
        successMessage="Received"
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
          successMessage="Received"
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
      expect(screen.getByLabelText(/Email/)).toHaveValue(
        demoMode ? "" : "person@example.com",
      );
    },
  );

  it("posts FormData, blocks duplicate requests, and resets after success", async () => {
    let finish!: (value: { ok: boolean }) => void;
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
        successMessage="Received"
      />,
    );
    await userEvent.type(screen.getByLabelText(/Email/), "person@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Send/ }));
    expect(screen.getByRole("button", { name: /Sending/ })).toBeDisabled();
    fireEvent.submit(container.querySelector("form")!);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/form",
      expect.objectContaining({ method: "POST", body: expect.any(FormData) }),
    );
    finish({ ok: true });
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Received"),
    );
    expect(screen.getByLabelText(/Email/)).toHaveValue("");
  });

  it.each(["http", "network"])(
    "retains entered data after a %s error",
    async (failure) => {
      vi.stubGlobal(
        "fetch",
        failure === "http"
          ? vi.fn().mockResolvedValue({ ok: false, status: 500 })
          : vi.fn().mockRejectedValue(new Error("offline")),
      );
      render(
        <ContentForm
          id="test"
          definition={{ ...minimal, action: "https://example.com/form" }}
          successMessage="Received"
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
