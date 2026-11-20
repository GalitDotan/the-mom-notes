interface Window {
  DEBUG?: unknown;
}

declare const window: Window & typeof globalThis;
declare const document: Document;
