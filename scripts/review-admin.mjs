// Local browser smoke check. Start Chrome with remote debugging on port 9224 first.
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const tabs = await (await fetch("http://127.0.0.1:9224/json")).json();
const socket = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let next = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++next;
    pending.set(id, (message) => (message.error ? reject(message.error) : resolve(message.result)));
    socket.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result
    .value;
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: "http://127.0.0.1:5175/admin/" });
for (let i = 0; i < 40; i++) {
  if (await evaluate('!!document.querySelector(".admin-nav")')) break;
  await new Promise((r) => setTimeout(r, 250));
}
const links = await evaluate(
  'Array.from(document.querySelectorAll(".admin-nav > .admin-nav-group > ul > li > a")).map(a => ({hash:a.getAttribute("href"), label:a.textContent.trim()}))',
);
for (const link of links) {
  await evaluate(`document.querySelector('.admin-nav a[href="${link.hash}"]').click()`);
  await new Promise((r) => setTimeout(r, 100));
  console.log(
    JSON.stringify({
      ...link,
      heading: await evaluate('document.querySelector("main h1")?.textContent'),
      hash: await evaluate("location.hash"),
    }),
  );
}
await evaluate('document.querySelector(".admin-nav a[href=\"#service-pages\"]").click()');
await new Promise((r) => setTimeout(r, 150));
await evaluate(
  'document.querySelector(".admin-page-links a[href=\"#service-pages/cybershield\"]").click()',
);
await new Promise((r) => setTimeout(r, 150));
const desktop = join(tmpdir(), "sentinel-admin-desktop.png");
writeFileSync(
  desktop,
  Buffer.from((await send("Page.captureScreenshot", { format: "png" })).data, "base64"),
);
console.log("Screenshot: " + desktop);
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
const mobile = join(tmpdir(), "sentinel-admin-mobile.png");
writeFileSync(
  mobile,
  Buffer.from((await send("Page.captureScreenshot", { format: "png" })).data, "base64"),
);
console.log("Screenshot: " + mobile);
console.log(
  "Mobile overflow: " + (await evaluate("document.documentElement.scrollWidth > innerWidth")),
);
socket.close();
