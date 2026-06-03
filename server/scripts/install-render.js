const { execSync } = require('child_process');

if (process.env.SKIP_INSTALL_HOOK) {
  console.log('[Render Build] Skipping install lifecycle hook to prevent recursive loop.');
  process.exit(0);
}

console.log('[Render Build] Starting Sarthi backend build process...');
try {
  console.log('[Render Build] Installing npm packages...');
  execSync('npm install', {
    env: { ...process.env, SKIP_INSTALL_HOOK: '1' },
    stdio: 'inherit'
  });

  console.log('[Render Build] Installing @libsql/linux-x64-gnu...');
  execSync('npm install @libsql/linux-x64-gnu --save-optional', {
    env: { ...process.env, SKIP_INSTALL_HOOK: '1' },
    stdio: 'inherit'
  });

  console.log('[Render Build] Build completed successfully!');
} catch (error) {
  console.error('[Render Build] Build failed:', error.message);
  process.exit(1);
}
