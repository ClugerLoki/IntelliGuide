#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Setting up HTTPS for development...');

// Check if mkcert is installed
try {
  execSync('mkcert --version', { stdio: 'ignore' });
  console.log('✅ mkcert is installed');
} catch (error) {
  console.log('❌ mkcert is not installed');
  console.log('Please install mkcert:');
  console.log('  Windows: https://github.com/FiloSottile/mkcert#windows');
  console.log('  macOS: brew install mkcert');
  console.log('  Linux: https://github.com/FiloSottile/mkcert#linux');
  process.exit(1);
}

// Create certificates directory
const certsDir = path.join(process.cwd(), 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Generate certificates
try {
  console.log('Generating certificates...');
  execSync(`mkcert -install`, { stdio: 'inherit' });
  execSync(`mkcert -key-file ${path.join(certsDir, 'key.pem')} -cert-file ${path.join(certsDir, 'cert.pem')} localhost 127.0.0.1 ::1`, { stdio: 'inherit' });
  console.log('✅ Certificates generated successfully');
} catch (error) {
  console.error('❌ Failed to generate certificates:', error.message);
  process.exit(1);
}

console.log('\n🎉 HTTPS setup complete!');
console.log('You can now run the server with HTTPS support.'); 