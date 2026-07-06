import type { Contact, ContactMessage } from "./port";

export type { Contact, ContactMessage } from "./port";

export interface ContactConfig {
  /** Delivers the assembled email — the app wires its email adapter here. */
  send: (message: {
    to: string;
    from?: string;
    replyTo?: string;
    subject: string;
    text: string;
  }) => Promise<void>;
  /** Support inbox that receives the messages. */
  to: string;
  from?: string;
  /** Optional: persist each message — the app wires its storage adapter here. */
  store?: (key: string, data: string, contentType: string) => Promise<void>;
  storagePrefix?: string;
}

/** Contact domain — composes delivery (+ optional persistence) by injection. No external provider. */
export function createContact(config: ContactConfig): Contact {
  return {
    async submit(message) {
      // Form fields feed the subject/replyTo headers — strip CR/LF to block header injection.
      const clean = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
      const name = clean(message.name);
      const email = clean(message.email);
      const subject = `[contact] ${clean(message.subject ?? "New message")} — ${name}`;
      const text = `From: ${name} <${email}>\n\n${message.message}`;
      await config.send({ to: config.to, from: config.from, replyTo: email, subject, text });

      if (config.store) {
        const key = `${config.storagePrefix ?? "contact"}/${Date.now()}-${crypto.randomUUID()}.json`;
        await config.store(
          key,
          JSON.stringify({ ...message, at: new Date().toISOString() }),
          "application/json",
        );
      }
    },
  };
}
