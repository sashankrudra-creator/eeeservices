import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function imageUploadPlugin() {
  const handler = (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end('Method Not Allowed');
    }
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(chunks);
        let ext = 'jpg';
        let fileBuffer = buffer;

        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          const json = JSON.parse(buffer.toString('utf-8'));
          const match = json.dataUrl?.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            ext = match[1] === 'jpeg' ? 'jpg' : match[1];
            fileBuffer = Buffer.from(match[2], 'base64');
          }
        } else if (contentType.includes('png')) {
          ext = 'png';
        } else if (contentType.includes('webp')) {
          ext = 'webp';
        }

        const uploadDir = path.resolve(process.cwd(), 'public/images/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `ad-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        fs.writeFileSync(path.join(uploadDir, fileName), fileBuffer);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ url: `/images/uploads/${fileName}`, path: `public/images/uploads/${fileName}` }));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  };

  return {
    name: 'image-upload-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/upload-image', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/upload-image', handler);
    },
  };
}

function spaFallbackPlugin() {
  return {
    name: 'spa-fallback-plugin',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const htmlContent = fs.readFileSync(indexPath, 'utf-8');
      const routes = [
        'admineeeservices12',
        'admin',
        'about',
        'services',
        'operations-maintenance',
        'resources',
        'projects',
        'manpower',
        'gallery',
        'clients',
        'blog',
        'contact',
      ];

      routes.forEach((route) => {
        const routeDir = path.join(distDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), imageUploadPlugin(), spaFallbackPlugin()],
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 5173, allowedHosts: true },
});
