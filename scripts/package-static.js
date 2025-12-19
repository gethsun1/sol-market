#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'out');
const ZIP_FILE = path.join(ROOT_DIR, 'solmarket-cpanel.zip');

console.log('📦 Creating cPanel deployment package...\n');

if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ Error: out/ directory not found. Run "npm run build" first.');
  process.exit(1);
}

const htaccess = `RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

<FilesMatch "\\.(html|js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>`;

fs.writeFileSync(path.join(OUT_DIR, '.htaccess'), htaccess);

const output = fs.createWriteStream(ZIP_FILE);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log('✅ Package created: ' + path.basename(ZIP_FILE));
  console.log('📊 Size: ' + (archive.pointer() / 1024 / 1024).toFixed(2) + ' MB\n');
  console.log('📤 Upload to cPanel and extract to public_html\n');
});

archive.on('error', (err) => { throw err; });
archive.pipe(output);
archive.directory(OUT_DIR, false);
archive.finalize();
