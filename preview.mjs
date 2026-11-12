import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('./kb-export/support-kb/build/', import.meta.url));
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res) => {
  try {
    const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + (route === '/' ? '/kb/' : route));
    if (!file.startsWith(root)) {res.writeHead(403).end();return;}
    if (fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    res.writeHead(200, {'Content-Type':mime[path.extname(file)] ?? 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4174, '127.0.0.1', () => console.log('KB preview: http://127.0.0.1:4174/kb/'));
