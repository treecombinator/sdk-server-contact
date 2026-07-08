# @treecombinator/sdk-server-contact

---

> Developed by Danthur Lice.\
> Copyright © 2026 Tree Combinator.\
> Contact: dev (at) treecombinator.com

---

The **contact** domain of the Tree Combinator SDK — turns inbound contact-form messages into a
delivered support email, with optional persistence of each message. It composes delivery (and
optionally storage) by injecting plain functions rather than depending on any provider, so it
carries zero runtime dependencies.

## Install

```bash
givo add @treecombinator/sdk-server-contact
```

## Use

```ts
import { createContact } from "@treecombinator/sdk-server-contact";

const contact = createContact({
  to: "support@example.com",
  send: (msg) => email.send(msg),                          // wire your email adapter here
  store: (key, data, contentType) =>                       // optional: persist each message
    storage.save(key, data, contentType),
});

await contact.submit({
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello",
  message: "I love this product.",
});
```

`createContact(config)` returns the contact API:

- `submit(message)` — assembles the support email (subject `"[contact] … — <name>"`, body with a
  `reply-to` set to the sender) and delivers it via the injected `send`; when `store` is provided,
  it also persists the message as a JSON object under a generated key.

Config: `{ to, send, from?, store?, storagePrefix? }`.

- `to` — the support inbox that receives every message.
- `send(message)` — injected delivery; receives an `EmailMessage` (the contract of
  `@treecombinator/sdk-server-email` — wire `email.send` here). The type is imported from the email
  domain and inlined into this package's declarations at build, so the shape has one source of
  truth and consumers install nothing extra.
- `from` — optional sender address passed through to `send`.
- `store(key, data, contentType)` — optional injected persistence; receives the generated key, the
  JSON string body and `"application/json"`.
- `storagePrefix` — key prefix for stored messages (default `"contact"`).

The wire contract `ContactMessage` (and the `Contact` type) is exported for the client.

## Notes

- `send` (and optional `store`) are injected functions — the app wires its own email and storage
  adapters; this package depends on no provider. `send`'s message shape IS the email domain's
  `EmailMessage` (types-only dev dependency, zero runtime dependencies).
- `submit` does not catch: a delivery or persistence failure propagates the error from the injected
  function to the caller.
- Persisted keys are `"<storagePrefix>/<timestamp>-<uuid>.json"`, so each message lands at a unique
  path.
