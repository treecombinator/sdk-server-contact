/**
 * The contract of the contact domain — a contact/support endpoint (site + app).
 */
export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  meta?: Record<string, unknown>;
}

export interface Contact {
  submit(message: ContactMessage): Promise<void>;
}
