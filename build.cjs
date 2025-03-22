// CommonJS module to handle building the app
// This is required since we use ESM in package.json but need CommonJS for Express
const { execSync } = require('child_process');

try {
  console.log('Building the React app...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 