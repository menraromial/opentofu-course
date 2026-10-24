// Screenshot of a page of the site served locally, to check a rendering.
// Chrome must run with --remote-debugging-port=9334:
//   google-chrome --headless=new --remote-debugging-port=9334 --window-size=1400,1800 about:blank &
// Usage: node tools/screenshot.mjs URL output.png [CSS selector] [dark]
import {writeFileSync} from 'node:fs';

const [url, output, selector, theme] = process.argv.slice(2);
const target = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method: 'PUT'})).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const call = (method, params = {}) => new Promise((r) => {
  const i = ++id; pending.set(i, r); ws.send(JSON.stringify({id: i, method, params}));
});
await new Promise((r) => (ws.onopen = r));
await call('Emulation.setDeviceMetricsOverride', {width: 1400, height: 1800, deviceScaleFactor: 1, mobile: false});
if (theme === 'dark') {
  await call('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: 'dark'}]});
}
await call('Page.navigate', {url});
await new Promise((r) => setTimeout(r, 3500));
if (selector) {
  await call('Runtime.evaluate', {expression:
    `document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block: 'start'}); window.scrollBy(0, -70);`});
  await new Promise((r) => setTimeout(r, 800));
}
const res = await call('Page.captureScreenshot', {format: 'png'});
writeFileSync(output, Buffer.from(res.result.data, 'base64'));
await fetch('http://127.0.0.1:9334/json/close/' + target.id);
ws.close();
process.exit(0);
