# AGENTS.md — @treecombinator/sdk-server-contact

Contact/support domain of the Tree Combinator SDK. Turns an inbound contact message into a
delivered support email, with optional persistence. Composes delivery (+ optional storage) by
injecting plain functions — no provider, no external dependency.

## Use

```ts
import { createContact } from "@treecombinator/sdk-server-contact";

const contact = createContact({
  to: "support@example.com",
  send: (m) => myEmailAdapter.send(m),      // the app wires its email here
  store: (k, d, ct) => myStorage.save(k, d, ct), // optional persistence
});
await contact.submit({ name, email, subject, message });
```

`createContact({ to, send, from?, store?, storagePrefix? })` → `submit(message)`.

## Notes
- `send(message)` (required) and `store(key, data, contentType)` (optional) are injected functions —
  no runtime dependency on an email or storage package. `send` receives the email domain's
  `EmailMessage` (type imported from `@treecombinator/sdk-server-email`, inlined at build).
- This package owns the wire contract: `ContactMessage`, `Contact` — the client imports them from here.
- `submit` never throws on its own; it propagates any error from the injected functions. Zero dependencies.
