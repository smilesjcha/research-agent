import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import assist from "./api/assist.js";

const root = new URL(".", import.meta.url).pathname;
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml" };

createServer(async (req, res) => {
  if (req.url === "/api/assist" && req.method === "POST") {
    let raw = ""; for await (const chunk of req) raw += chunk;
    try { req.body = JSON.parse(raw || "{}"); } catch { req.body = {}; }
    const proxy = { status(code) { res.statusCode = code; return proxy; }, json(value) { res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(value)); } };
    return assist(req, proxy);
  }
  const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const safePath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  try {
    const file = await readFile(join(root, safePath));
    res.setHeader("Content-Type", types[extname(safePath)] || "application/octet-stream");
    res.end(file);
  } catch { res.statusCode = 404; res.end("Not found"); }
}).listen(port, "127.0.0.1", () => console.log(`KEDI lab: http://127.0.0.1:${port}`));
