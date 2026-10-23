export interface FormFieldDefinition {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  autocomplete?: string;
  rows?: number;
  options?: string[];
  group?: string;
  showWhen?: { field: string; equals: string[] };
  /** Word limits for free-text answers; a counter shows under the box. */
  minWords?: number;
  maxWords?: number;
  /** Value must match `regex` (case-insensitive), optionally only when another field has one of `when.equals`. */
  pattern?: {
    regex: string;
    message: string;
    hint?: string;
    when?: { field: string; equals: string[] };
  };
}

export interface PaymentOption {
  value: string;
  label: string;
  url: string;
  note: string;
}

export interface FormDefinition {
  fields: FormFieldDefinition[];
  action: string;
  demoMode?: boolean;
  submitLabel: string;
  /** Shown in place of the form once it is sent; {name} and {email} are filled in. */
  success?: { title: string; message: string };
  payment?: { options: PaymentOption[] };
}

export interface Testimonial {
  rotate: string;
  featured: boolean;
  badge: string;
  image: string;
  alt: string;
  quote: string;
  initials: string;
  name: string;
  university: string;
}

export interface Program {
  name: string;
  teaser: string;
  description: string;
  image: string;
}
