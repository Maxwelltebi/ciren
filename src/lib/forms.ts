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
