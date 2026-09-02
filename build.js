import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('==============================================');
  console.log('🚀 Starting NoteNest Full-Stack Production Build');
  console.log('==============================================\n');

  console.log('1/3 📦 Installing Backend dependencies...');
  execSync('npm install', {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
  });

  console.log('\n2/3 📦 Installing Frontend dependencies...');
  execSync('npm install', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });

  console.log('\n3/3 ⚡ Building Frontend with Vite...');
  execSync('npm run build', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
  });

  console.log('\n==============================================');
  console.log('✅ Build completed successfully!');
  console.log('==============================================\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
