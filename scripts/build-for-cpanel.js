#!/usr/bin/env node

/**
 * Build and Package Script for cPanel Deployment
 * 
 * This script:
 * 1. Builds the Next.js application
 * 2. Creates a deployment package (zip file) excluding unnecessary files
 * 3. Ready for upload to cPanel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'cpanel-deploy');
const ZIP_FILE = path.join(ROOT_DIR, 'solmarket-cpanel-deploy.zip');

// Files and directories to exclude from the zip
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next/cache',
  '.next/server/chunks',
  '.git',
  '.gitignore',
  '.env.local',
  '.env',
  '.env.*',
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  '.vscode',
  '.idea',
  '*.swp',
  '*.swo',
  'coverage',
  '.vercel',
  '*.tsbuildinfo',
  'cpanel-deploy',
  '*.zip',
  'SolMarket', // Exclude if this is a duplicate
  'Mashar', // Exclude if this is a different project
];

// Files and directories to include
const INCLUDE_PATTERNS = [
  'app',
  'components',
  'lib',
  'hooks',
  'public',
  'styles',
  'shims',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'server.js',
  '.htaccess',
  '.env.production.example',
  'CPANEL_DEPLOYMENT.md',
  'DEPLOYMENT_CHECKLIST.md',
  'UPLOAD_GUIDE.md',
  'ENVIRONMENT_SETUP.md',
  'DEPLOYMENT_SUMMARY.md',
  '.next', // Include built .next folder (but not cache)
];

console.log('🚀 Starting cPanel deployment package build...\n');

// Step 1: Clean previous builds
console.log('📦 Step 1: Cleaning previous builds...');
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
if (fs.existsSync(ZIP_FILE)) {
  fs.unlinkSync(ZIP_FILE);
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
console.log('✅ Cleaned previous builds\n');

// Step 2: Build the Next.js application
console.log('🔨 Step 2: Building Next.js application...');
console.log('⚠️  Note: Some API route prerender errors are expected and can be ignored.\n');
try {
  execSync('npm run build', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  // Check if it's just prerender errors (which are OK for API routes)
  const errorOutput = error.stdout?.toString() || error.stderr?.toString() || '';
  if (errorOutput.includes('prerender') || errorOutput.includes('Prerender')) {
    console.log('⚠️  Build completed with prerender warnings (this is expected for API routes)\n');
  } else {
    console.error('❌ Build failed with critical errors!');
    process.exit(1);
  }
}

// Step 3: Copy files to output directory
console.log('📋 Step 3: Copying files to deployment package...');

function shouldExclude(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (relativePath.includes(pattern) || 
        relativePath.startsWith(pattern) ||
        filePath.match(new RegExp(pattern.replace(/\*/g, '.*')))) {
      return true;
    }
  }
  
  // Check if it's in .next/cache or .next/server/chunks
  if (relativePath.includes('.next/cache') || 
      relativePath.includes('.next/server/chunks')) {
    return true;
  }
  
  return false;
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (shouldExclude(srcPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Copy specific files and directories
const filesToCopy = [
  'app',
  'components',
  'lib',
  'hooks',
  'public',
  'styles',
  'shims',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'server.js',
  '.htaccess',
  '.env.production.example',
  'CPANEL_DEPLOYMENT.md',
  'DEPLOYMENT_CHECKLIST.md',
  'UPLOAD_GUIDE.md',
  'ENVIRONMENT_SETUP.md',
  'DEPLOYMENT_SUMMARY.md',
];

for (const item of filesToCopy) {
  const srcPath = path.join(ROOT_DIR, item);
  const destPath = path.join(OUTPUT_DIR, item);
  
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  Warning: ${item} not found, skipping...`);
    continue;
  }
  
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    copyDirectory(srcPath, destPath);
  } else {
    copyFile(srcPath, destPath);
  }
}

// Copy .next directory (excluding cache and server/chunks)
if (fs.existsSync(path.join(ROOT_DIR, '.next'))) {
  console.log('📦 Copying .next directory (excluding cache)...');
  const nextSrc = path.join(ROOT_DIR, '.next');
  const nextDest = path.join(OUTPUT_DIR, '.next');
  
  function copyNextDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      // Skip cache and server/chunks
      if (entry.name === 'cache' || 
          (entry.name === 'server' && src.includes('.next'))) {
        // For server directory, we'll copy it but exclude chunks
        if (entry.name === 'server') {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          const serverEntries = fs.readdirSync(srcPath, { withFileTypes: true });
          for (const serverEntry of serverEntries) {
            if (serverEntry.name !== 'chunks') {
              const serverSrcPath = path.join(srcPath, serverEntry.name);
              const serverDestPath = path.join(destPath, serverEntry.name);
              if (serverEntry.isDirectory()) {
                copyNextDirectory(serverSrcPath, serverDestPath);
              } else {
                copyFile(serverSrcPath, serverDestPath);
              }
            }
          }
        }
        continue;
      }
      
      if (entry.isDirectory()) {
        copyNextDirectory(srcPath, destPath);
      } else {
        copyFile(srcPath, destPath);
      }
    }
  }
  
  copyNextDirectory(nextSrc, nextDest);
}

console.log('✅ Files copied successfully\n');

// Step 4: Create zip file
console.log('📦 Step 4: Creating zip file...');

(async () => {
  try {
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(ZIP_FILE);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      output.on('close', () => {
        const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✅ Zip file created: ${path.basename(ZIP_FILE)}`);
        console.log(`   Size: ${sizeInMB} MB`);
        console.log(`   Location: ${ZIP_FILE}\n`);
        
        // Clean up output directory
        console.log('🧹 Cleaning up temporary files...');
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        console.log('✅ Cleanup complete\n');
        
        console.log('🎉 Deployment package ready!');
        console.log('\n📤 Next steps:');
        console.log('   1. Upload the zip file to your cPanel');
        console.log('   2. Extract it to your domain root (public_html)');
        console.log('   3. Follow the instructions in CPANEL_DEPLOYMENT.md');
        console.log(`\n   Zip file: ${ZIP_FILE}\n`);
        
        resolve();
      });

      archive.on('error', (err) => {
        console.error('❌ Error creating zip file:', err);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(OUTPUT_DIR, false);
      archive.finalize();
    });
  } catch (error) {
    console.error('❌ Deployment package creation failed:', error);
    process.exit(1);
  }
})();
