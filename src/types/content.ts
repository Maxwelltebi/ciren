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
