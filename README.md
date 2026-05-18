# chrome-extension-webpack-react

> A Chrome extension boilerplate for **Manifest V3 (MV3)** — webpack 5 +
> React + TypeScript, with live reload powered by
> [`webpack-ext-reloader-next`](https://github.com/graybearo/webpack-ext-reloader-next),
> typed message passing, and a service-worker keepalive baked in.

<p>
  <img src="https://img.shields.io/badge/manifest-v3-blue" alt="MV3">
  <img src="https://img.shields.io/badge/webpack-5-2b3a42" alt="webpack 5">
  <img src="https://img.shields.io/badge/react-18-cyan" alt="React 18">
  <img src="https://img.shields.io/badge/typescript-5-3178c6" alt="TS 5">
</p>

A modern, opinionated **webpack-based** starter for building **Chrome
extensions** (and Edge / Firefox / browser extensions in general) on
**Manifest V3**. If you're more comfortable with webpack than Vite, or your
existing toolchain is webpack-based, this is the starter you want.

## What's in the box

- 🔧 **Webpack 5 + ts-loader** (`transpileOnly: true`) — fast cold builds,
  filesystem cache for warm rebuilds.
- ⚛️ **React 18 + TypeScript (strict)** — popup and options are real React
  apps with full TS support.
- 🔁 **Live reload** via [`webpack-ext-reloader-next`](https://github.com/graybearo/webpack-ext-reloader-next)
  — rebuild triggers an automatic extension reload. No manual `Reload` clicks.
- 📡 **Typed messaging** via [`mv3-message-router`](https://github.com/graybearo/mv3-message-router)
  — one `Messages` interface, end-to-end typing in SW + popup + content.
- ⏰ **Durable scheduling** via [`mv3-keepalive`](https://github.com/graybearo/mv3-keepalive)
  — `chrome.alarms` that survive SW termination.
- 📦 **`pnpm zip`** — packs `dist/` into a ready-to-upload `.zip`.

## Quick start

```bash
git clone https://github.com/graybearo/chrome-extension-webpack-react my-extension
cd my-extension
pnpm install
pnpm dev
```

Then in Chrome:

1. Open `chrome://extensions/`
2. Toggle **Developer mode** on
3. Click **Load unpacked**
4. Select the `dist/` folder

Edit any file in `src/`; the extension reloads automatically.

## Layout

```
src/
├── background/index.ts     # service worker — router + alarms live here
├── content/index.ts        # injected into every https:// page
├── popup/                  # React popup (action.default_popup)
├── options/                # React options page
├── shared/
│   ├── messages.ts         # typed message contract
│   └── storage.ts          # thin chrome.storage wrapper
└── manifest.json           # MV3 manifest (Chrome / Edge)
```

## How messaging works

Declare your messages once:

```ts
// src/shared/messages.ts
export interface Messages {
  GET_STATE: { input: void; output: { count: number } };
  INCREMENT: { input: { by: number }; output: { count: number } };
}
```

Register handlers in the SW:

```ts
// src/background/index.ts
const router = createRouter<Messages>();
router.on("INCREMENT", async ({ by }) => { /* ... */ });
router.listen();
```

Call from popup / content / options:

```ts
const client = createClient<Messages>();
const { count } = await client.send("INCREMENT", { by: 1 });
//      ^? number
```

No untyped `chrome.runtime.sendMessage`, no `return true` foot-guns, no
manual error serialization.

## Building

```bash
pnpm dev             # watch mode + live reload
pnpm build           # production bundle into dist/
pnpm zip             # zip dist/ for web-store upload
```

## Adding an icon set

Drop `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png` into
`public/icons/` and reference them in `src/manifest.json`. Everything in
`public/` is copied verbatim to `dist/`.

## Why webpack and not Vite?

Choose based on your team's stack:

- **Webpack** — mature, huge plugin ecosystem, integrates with existing
  webpack-based build infrastructure. This starter.
- **Vite** — faster HMR, smaller config. See
  [`chrome-extension-vite-react`](https://github.com/graybearo/chrome-extension-vite-react).

Both starters share the same `src/` layout and use the same
[`mv3-keepalive`](https://github.com/graybearo/mv3-keepalive) +
[`mv3-message-router`](https://github.com/graybearo/mv3-message-router)
packages, so you can switch between them without rewriting your app code.

## Related packages

Part of a small **MV3 toolkit** for Chrome / Edge / Firefox extensions by
[@graybearo](https://github.com/graybearo):

- [`webpack-ext-reloader-next`](https://github.com/graybearo/webpack-ext-reloader-next) — live reload (used here)
- [`mv3-keepalive`](https://github.com/graybearo/mv3-keepalive) — service-worker keepalive + durable alarms
- [`mv3-message-router`](https://github.com/graybearo/mv3-message-router) — type-safe message passing
- [`mv3-content-bridge`](https://github.com/graybearo/mv3-content-bridge) — content-script ↔ page-context typed bridge
- [`mv3-storage`](https://github.com/graybearo/mv3-storage) — typed `chrome.storage` wrapper
- [`mv3-wait-for-element`](https://github.com/graybearo/mv3-wait-for-element) — `waitForElement` for content scripts
- [`chrome-extension-vite-react`](https://github.com/graybearo/chrome-extension-vite-react) — Vite version of this starter
- [`chrome-extension-vite-svelte`](https://github.com/graybearo/chrome-extension-vite-svelte) — Svelte + Vite starter
- [`chrome-extension-side-panel`](https://github.com/graybearo/chrome-extension-side-panel) — Side Panel API starter (Chrome 114+)
- [`awesome-mv3`](https://github.com/graybearo/awesome-mv3) — curated list of MV3 tools, libraries, and resources

## License

MIT — see [LICENSE](LICENSE).
