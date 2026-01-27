/**
 * E2E Testing Kit - PDF Report Generator
 *
 * Generates a professional PDF report from Allure test results.
 * Includes test statistics, status badges, and screenshots.
 *
 * Usage: node scripts/generate-pdf-report.cjs
 *
 * Environment variables:
 *   REPORT_TITLE - Custom report title (default: "E2E Test Report")
 *   OUTPUT_FILE  - Output PDF path (default: "test-report.pdf")
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Configuration
const ALLURE_RESULTS_DIR = path.join(__dirname, '..', 'allure-results');
const OUTPUT_PDF = process.env.OUTPUT_FILE || path.join(__dirname, '..', 'test-report.pdf');
const REPORT_TITLE = process.env.REPORT_TITLE || 'E2E Test Report';

// Colors
const COLORS = {
  primary: '#059669',
  success: '#10b981',
  failed: '#ef4444',
  skipped: '#f59e0b',
  text: '#1f2937',
  lightGray: '#f3f4f6',
  white: '#ffffff',
};

function readAllureResults() {
  if (!fs.existsSync(ALLURE_RESULTS_DIR)) {
    console.error('Error: allure-results directory not found.');
    console.error('Run tests first: npm test');
    process.exit(1);
  }

  const results = [];
  const files = fs.readdirSync(ALLURE_RESULTS_DIR);

  for (const file of files) {
    if (file.endsWith('-result.json')) {
      const content = fs.readFileSync(path.join(ALLURE_RESULTS_DIR, file), 'utf8');
      const data = JSON.parse(content);
      results.push(data);
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

function getScreenshots() {
  const files = fs.readdirSync(ALLURE_RESULTS_DIR);
  return files.filter(f => f.endsWith('-attachment.png'));
}

function formatDuration(ms) {
  if (!ms) return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function generatePDF() {
  const results = readAllureResults();

  if (results.length === 0) {
    console.error('Error: No test results found in allure-results/');
    process.exit(1);
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const stream = fs.createWriteStream(OUTPUT_PDF);
  doc.pipe(stream);

  // Calculate statistics
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const total = results.length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Get screenshots
  const screenshots = getScreenshots();

  // ===== HEADER =====
  doc.rect(0, 0, doc.page.width, 120).fill(COLORS.primary);

  doc.fillColor(COLORS.white)
    .fontSize(28)
    .font('Helvetica-Bold')
    .text(REPORT_TITLE, 50, 40);

  doc.fontSize(12)
    .font('Helvetica')
    .text(`Date: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 50, 75);

  doc.text(`Environment: ${process.env.BASE_URL || 'http://localhost:3000'}`, 50, 92);

  // ===== STATISTICS =====
  const statsY = 150;
  const statsWidth = 150;
  const statsGap = 20;
  const startX = (doc.page.width - (3 * statsWidth + 2 * statsGap)) / 2;

  // Passed box
  doc.rect(startX, statsY, statsWidth, 80).fill(COLORS.lightGray);
  doc.fillColor(COLORS.success)
    .fontSize(36)
    .font('Helvetica-Bold')
    .text(passed.toString(), startX, statsY + 15, { width: statsWidth, align: 'center' });
  doc.fillColor(COLORS.text)
    .fontSize(12)
    .font('Helvetica')
    .text('Tests Passed', startX, statsY + 55, { width: statsWidth, align: 'center' });

  // Failed box
  doc.rect(startX + statsWidth + statsGap, statsY, statsWidth, 80).fill(COLORS.lightGray);
  doc.fillColor(failed > 0 ? COLORS.failed : COLORS.text)
    .fontSize(36)
    .font('Helvetica-Bold')
    .text(failed.toString(), startX + statsWidth + statsGap, statsY + 15, { width: statsWidth, align: 'center' });
  doc.fillColor(COLORS.text)
    .fontSize(12)
    .font('Helvetica')
    .text('Tests Failed', startX + statsWidth + statsGap, statsY + 55, { width: statsWidth, align: 'center' });

  // Pass rate box
  doc.rect(startX + 2 * (statsWidth + statsGap), statsY, statsWidth, 80).fill(COLORS.lightGray);
  doc.fillColor(passRate === 100 ? COLORS.success : passRate >= 80 ? COLORS.skipped : COLORS.failed)
    .fontSize(36)
    .font('Helvetica-Bold')
    .text(`${passRate}%`, startX + 2 * (statsWidth + statsGap), statsY + 15, { width: statsWidth, align: 'center' });
  doc.fillColor(COLORS.text)
    .fontSize(12)
    .font('Helvetica')
    .text('Pass Rate', startX + 2 * (statsWidth + statsGap), statsY + 55, { width: statsWidth, align: 'center' });

  // ===== TEST RESULTS SECTION =====
  doc.fillColor(COLORS.text)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Test Results with Screenshots', 50, 260);

  doc.moveTo(50, 285).lineTo(doc.page.width - 50, 285).stroke(COLORS.primary);

  let yPosition = 300;
  let testIndex = 1;

  for (const result of results) {
    // Check if we need a new page
    if (yPosition > doc.page.height - 200) {
      doc.addPage();
      yPosition = 50;
    }

    // Test ID and status
    const testId = `TC-${String(testIndex).padStart(3, '0')}`;
    const status = result.status.toUpperCase();
    let statusColor = COLORS.success;
    if (result.status === 'failed') statusColor = COLORS.failed;
    if (result.status === 'skipped') statusColor = COLORS.skipped;

    // Draw test row
    doc.rect(50, yPosition, doc.page.width - 100, 30).fill(COLORS.lightGray);

    doc.fillColor(COLORS.text)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(testId, 60, yPosition + 9);

    // Test name (truncate if too long)
    let testName = result.name;
    if (testName.length > 55) {
      testName = testName.substring(0, 52) + '...';
    }

    doc.font('Helvetica')
      .text(testName, 115, yPosition + 9);

    // Duration
    const duration = formatDuration(result.stop - result.start);
    doc.fontSize(9)
      .fillColor('#6b7280')
      .text(duration, doc.page.width - 180, yPosition + 10);

    // Status badge
    const statusWidth = 65;
    const statusX = doc.page.width - 50 - statusWidth - 10;
    doc.rect(statusX, yPosition + 5, statusWidth, 20).fill(statusColor);
    doc.fillColor(COLORS.white)
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(status, statusX, yPosition + 10, { width: statusWidth, align: 'center' });

    yPosition += 40;

    // Add screenshot if available
    const screenshotFile = screenshots[testIndex - 1];
    if (screenshotFile) {
      const screenshotPath = path.join(ALLURE_RESULTS_DIR, screenshotFile);
      if (fs.existsSync(screenshotPath)) {
        try {
          if (yPosition > doc.page.height - 220) {
            doc.addPage();
            yPosition = 50;
          }

          doc.image(screenshotPath, 70, yPosition, {
            width: doc.page.width - 140,
            height: 160
          });
          yPosition += 170;
        } catch (e) {
          // Skip if image can't be loaded
        }
      }
    }

    yPosition += 15;
    testIndex++;
  }

  // ===== SUMMARY FOOTER =====
  doc.addPage();

  doc.fillColor(COLORS.text)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Test Summary', 50, 50);

  doc.moveTo(50, 75).lineTo(doc.page.width - 50, 75).stroke(COLORS.primary);

  const summaryY = 100;
  const summaryData = [
    ['Total Tests', total.toString()],
    ['Passed', passed.toString()],
    ['Failed', failed.toString()],
    ['Skipped', skipped.toString()],
    ['Pass Rate', `${passRate}%`],
    ['Report Generated', new Date().toLocaleString()],
  ];

  summaryData.forEach(([label, value], index) => {
    const y = summaryY + index * 30;
    doc.fillColor(COLORS.text)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(label + ':', 50, y);
    doc.font('Helvetica')
      .text(value, 200, y);
  });

  // Footer
  doc.fillColor('#9ca3af')
    .fontSize(10)
    .font('Helvetica')
    .text(
      'Generated by E2E Testing Kit (Playwright + Allure)',
      50,
      doc.page.height - 50,
      { align: 'center', width: doc.page.width - 100 }
    );

  doc.end();

  stream.on('finish', () => {
    console.log(`\n✅ PDF Report generated: ${OUTPUT_PDF}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Pass Rate: ${passRate}%`);
  });
}

// Run
generatePDF();
