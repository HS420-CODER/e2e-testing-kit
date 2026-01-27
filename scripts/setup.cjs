#!/usr/bin/env node

/**
 * E2E Testing Kit - Setup Script
 *
 * Integrates the testing kit into an existing project.
 *
 * Usage: node setup.cjs [target-directory]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = process.argv[2] || process.cwd();
const kitDir = path.join(__dirname, '..');

console.log('\n🧪 E2E Testing Kit Setup\n');
console.log(`Target directory: ${targetDir}\n`);

// Files to copy
const filesToCopy = [
  { src: 'playwright.config.ts', dest: 'playwright.config.ts' },
  { src: 'scripts/generate-pdf-report.cjs', dest: 'scripts/generate-pdf-report.cjs' },
  { src: 'e2e/example.spec.ts', dest: 'e2e/example.spec.ts' },
];

// Directories to create
const dirsToCreate = ['e2e', 'scripts', 'specs'];

// Create directories
console.log('📁 Creating directories...');
for (const dir of dirsToCreate) {
  const fullPath = path.join(targetDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`   Created: ${dir}/`);
  }
}

// Copy files
console.log('\n📄 Copying files...');
for (const file of filesToCopy) {
  const srcPath = path.join(kitDir, file.src);
  const destPath = path.join(targetDir, file.dest);

  // Create parent directory if needed
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(srcPath)) {
    // Don't overwrite if file exists
    if (fs.existsSync(destPath)) {
      console.log(`   Skipped (exists): ${file.dest}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`   Copied: ${file.dest}`);
    }
  }
}

// Update package.json
console.log('\n📦 Updating package.json...');
const packageJsonPath = path.join(targetDir, 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Add scripts
  const scriptsToAdd = {
    'test:e2e': 'playwright test',
    'test:e2e:ui': 'playwright test --ui',
    'test:e2e:headed': 'playwright test --headed',
    'allure:generate': 'allure generate allure-results --clean -o allure-report',
    'allure:open': 'allure open allure-report',
    'allure:report': 'npm run allure:generate && npm run allure:open',
    'report:pdf': 'node scripts/generate-pdf-report.cjs',
  };

  pkg.scripts = pkg.scripts || {};
  let addedScripts = 0;
  for (const [name, cmd] of Object.entries(scriptsToAdd)) {
    if (!pkg.scripts[name]) {
      pkg.scripts[name] = cmd;
      addedScripts++;
    }
  }
  console.log(`   Added ${addedScripts} npm scripts`);

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
} else {
  console.log('   No package.json found, skipping script injection');
}

// Update .gitignore
console.log('\n📝 Updating .gitignore...');
const gitignorePath = path.join(targetDir, '.gitignore');
const gitignoreEntries = [
  '',
  '# E2E Testing',
  'playwright-report/',
  'test-results/',
  'allure-results/',
  'allure-report/',
  'test-report.pdf',
];

if (fs.existsSync(gitignorePath)) {
  let content = fs.readFileSync(gitignorePath, 'utf8');
  if (!content.includes('allure-results')) {
    content += gitignoreEntries.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, content);
    console.log('   Added testing entries to .gitignore');
  } else {
    console.log('   .gitignore already configured');
  }
} else {
  fs.writeFileSync(gitignorePath, gitignoreEntries.join('\n') + '\n');
  console.log('   Created .gitignore with testing entries');
}

// Print next steps
console.log('\n✅ Setup complete!\n');
console.log('📋 Next steps:\n');
console.log('   1. Install dependencies:');
console.log('      npm install -D @playwright/test allure-playwright allure-commandline pdfkit\n');
console.log('   2. Install browsers:');
console.log('      npx playwright install\n');
console.log('   3. Update playwright.config.ts with your BASE_URL\n');
console.log('   4. Write your tests in e2e/ directory\n');
console.log('   5. Run tests:');
console.log('      npm run test:e2e\n');
console.log('   6. Generate reports:');
console.log('      npm run allure:report   # HTML report');
console.log('      npm run report:pdf      # PDF report\n');
