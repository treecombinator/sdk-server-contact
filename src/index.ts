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
      const subject = `[contact] ${message.subject ?? "New message"} — ${message.name}`;
      const text = `From: ${message.name} <${message.email}>\n\n${message.message}`;
      await config.send({ to: config.to, from: config.from, replyTo: message.email, subject, text });

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
