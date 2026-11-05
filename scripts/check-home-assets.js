import http from "node:http";

function get(p) {
  return new Promise((resolve) => {
    http
      .get("http://localhost:3000" + p, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ s: res.statusCode, d }));
      })
      .on("error", (e) => resolve({ s: 0, d: String(e) }));
  });
}

const home = (await get("/")).d;
const urls = [...home.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => !/^https?:|^mailto:|^tel:|^#|^data:/i.test(u));

const uniq = [...new Set(urls)];
for (const u of uniq) {
  const path = (u.startsWith("/") ? u : "/" + u).split("#")[0];
  const r = await get(path);
  if (r.s >= 400) console.log("FAIL", r.s, path);
}
console.log("checked", uniq.length);
