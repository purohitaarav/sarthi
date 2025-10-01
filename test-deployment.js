#!/usr/bin/env node

/**
 * Render Deployment Diagnostic Script
 * Tests the musl/glibc fix and database connection
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Render Deployment Diagnostic\n');

// Test 1: Check if our fix is applied
console.log('1. Checking if Render fix is applied...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const installScript = packageJson.scripts.install;
  
  if (installScript && installScript.includes('@libsql/linux-x64-gnu')) {
    console.log('✅ Fix applied: Custom install script found');
    console.log(`   Script: ${installScript}`);
  } else {
    console.log('❌ Fix not found: Custom install script missing');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Test 2: Check render.yaml configuration
console.log('\n2. Checking render.yaml configuration...');
try {
  const renderYaml = fs.readFileSync('render.yaml', 'utf8');
  if (renderYaml.includes('npm run install')) {
    console.log('✅ render.yaml: Using custom install script');
  } else {
    console.log('❌ render.yaml: Not using custom install script');
  }
} catch (error) {
  console.log('❌ Error reading render.yaml:', error.message);
}

// Test 3: Check Dockerfile
console.log('\n3. Checking Dockerfile configuration...');
try {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  if (dockerfile.includes('node:18-bullseye')) {
    console.log('✅ Dockerfile: Using Debian base image (glibc compatible)');
  } else {
    console.log('❌ Dockerfile: Not using Debian base image');
  }
} catch (error) {
  console.log('❌ Error reading Dockerfile:', error.message);
}

// Test 4: Test @libsql/client import
console.log('\n4. Testing @libsql/client import...');
try {
  const { createClient } = require('@libsql/client');
  console.log('✅ @libsql/client: Successfully imported');
  
  // Test 5: Test database connection
  console.log('\n5. Testing database connection...');
  try {
    const client = createClient({ 
      url: 'file:./server/database/gita.db' 
    });
    console.log('✅ Database: Turso client created successfully');
  } catch (dbError) {
    console.log('⚠️  Database: Connection test failed (this is normal if database file doesn\'t exist)');
    console.log(`   Error: ${dbError.message}`);
  }
} catch (libsqlError) {
  console.log('❌ @libsql/client: Import failed');
  console.log(`   Error: ${libsqlError.message}`);
}

// Test 6: Check Git status
console.log('\n6. Checking Git status...');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️  Git: Uncommitted changes detected');
    console.log(`   Changes:\n${status}`);
  } else {
    console.log('✅ Git: Working directory clean');
  }
} catch (error) {
  console.log('❌ Git: Error checking status');
}

// Test 7: Check latest commits
console.log('\n7. Checking latest commits...');
try {
  const commits = execSync('git log --oneline -3', { encoding: 'utf8' });
  console.log('✅ Git: Latest commits:');
  console.log(`   ${commits.trim().replace(/\n/g, '\n   ')}`);
} catch (error) {
  console.log('❌ Git: Error getting commits');
}

console.log('\n🎯 Diagnostic Complete!');
console.log('\n📋 Next Steps:');
console.log('1. If all checks pass, try deploying to Render again');
console.log('2. If any checks fail, review the specific error');
console.log('3. Check Render logs for detailed build information');
console.log('4. Consider using "Clear build cache" option in Render');

console.log('\n🚀 For Render Support:');
console.log('- Dashboard: https://dashboard.render.com');
console.log('- Service: sarthi-backend');
console.log('- Logs: Check build tab for detailed errors');

console.log('\n🙏 May your deployment be successful! ✨');
