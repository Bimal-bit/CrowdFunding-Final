import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- DESIGN CONSTANTS ---
const PRIMARY_COLOR = '#003366'; // Deep Navy Blue (Professional)
const ACCENT_COLOR = '#FF9900'; // Vibrant Gold/Orange (Premium/Highlight)
const TEXT_COLOR_MAIN = '#333333'; // Darker Text
const TEXT_COLOR_SUBTLE = '#666666'; // Subtler Text

// Define a professional font (assuming you have access to a font file like 'Roboto-Bold.ttf' or 'Lato-Regular.ttf'
// For simplicity and dependency-free use, we will primarily stick to built-in fonts (Helvetica/Times),
// but define variables to simulate custom fonts for better structure.
const FONT_BOLD = 'Helvetica-Bold';
const FONT_REGULAR = 'Helvetica';
const FONT_ITALIC = 'Helvetica-Oblique';
// If you want to use custom fonts, you would need to register them:
// doc.registerFont('Custom-Bold', 'path/to/font.ttf');

export const generateCertificate = async (campaignRequest, creator) => {
  return new Promise((resolve, reject) => {
    try {
      const certificatesDir = path.join(__dirname, '../../certificates');
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const fileName = `certificate_${campaignRequest._id}.pdf`;
      const filePath = path.join(certificatesDir, fileName);

      const doc = new PDFDocument({ 
        size: 'A4',
        layout: 'landscape',
        margins: { top: 72, bottom: 72, left: 72, right: 72 } // Increased margins for breathing room
      });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // --- 1. MODERN BORDER & ACCENTS ---
      
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const effectiveWidth = pageWidth - 144; // 72*2
      const effectiveHeight = pageHeight - 144; // 72*2
      const borderPadding = 36; // Inner border offset

      // Primary Border (Thin and subtle)
      doc.lineWidth(1)
         .strokeColor(PRIMARY_COLOR)
         .rect(72, 72, effectiveWidth, effectiveHeight)
         .stroke();

      // Inner Accent Lines (More subtle and modern)
      doc.lineWidth(0.5)
         .strokeColor(ACCENT_COLOR)
         .rect(72 + borderPadding, 72 + borderPadding, effectiveWidth - 2 * borderPadding, effectiveHeight - 2 * borderPadding)
         .stroke();

      // Corner Flair (Simple, elegant geometric shape)
      const flairSize = 40;
      doc.lineWidth(3).strokeColor(ACCENT_COLOR);

      // Top-Left: Small L shape
      doc.moveTo(72, 72 + flairSize).lineTo(72, 72).lineTo(72 + flairSize, 72).stroke();
      // Bottom-Right: Small L shape
      doc.moveTo(pageWidth - 72, pageHeight - 72 - flairSize).lineTo(pageWidth - 72, pageHeight - 72).lineTo(pageWidth - 72 - flairSize, pageHeight - 72).stroke();


      let yPos = 120; // Starting Y position

      // --- 2. HEADER SECTION ---

      // Platform Logo/Name placeholder (can be replaced with a real image or logo text)
      doc.fontSize(14)
         .font(FONT_BOLD)
         .fillColor(PRIMARY_COLOR)
         .text('FundRise', 0, yPos, { align: 'center', width: pageWidth });
      
      yPos += 40;

      // Certificate Title
      doc.fontSize(20)
         .font(FONT_REGULAR)
         .fillColor(TEXT_COLOR_SUBTLE)
         .text('AWARDED FOR OUTSTANDING CONTRIBUTION', 0, yPos, { align: 'center', width: pageWidth });

      yPos += 30;

      doc.fontSize(60)
         .font(FONT_BOLD)
         .fillColor(PRIMARY_COLOR)
         .text('CERTIFICATE', 0, yPos, { align: 'center', width: pageWidth });

      yPos += 90; // Large space after title

      // --- 3. MAIN CONTENT ---
      
      // Statement introduction
      doc.fontSize(16)
         .font(FONT_REGULAR)
         .fillColor(TEXT_COLOR_MAIN)
         .text('This distinguished honor is presented to', 0, yPos, { align: 'center', width: pageWidth });

      yPos += 35;

      // Creator Name (The most prominent element after the title)
      doc.fontSize(44)
         .font(FONT_BOLD)
         .fillColor(ACCENT_COLOR)
         .text(creator.name.toUpperCase(), 0, yPos, { align: 'center', width: pageWidth });

      yPos += 60;

      // Campaign Details Statement
      doc.fontSize(16)
         .font(FONT_REGULAR)
         .fillColor(TEXT_COLOR_MAIN)
         .text('For the successful **Launch & Leadership** of the campaign:', 0, yPos, { 
           align: 'center', 
           width: pageWidth,
           // Use continued text to style 'Launch & Leadership' if custom fonts were registered
           // For now, we rely on the line above.
         });

      yPos += 35;
      
      // Campaign Title (Centered and slightly offset from the main text)
      doc.fontSize(28)
         .font(FONT_ITALIC)
         .fillColor(PRIMARY_COLOR)
         .text(`“${campaignRequest.title}”`, 0, yPos, { 
           align: 'center', 
           width: pageWidth 
         });

      yPos += 50;

      // Divider Line (Short, centered, and modern)
      doc.moveTo(pageWidth / 2 - 50, yPos)
         .lineTo(pageWidth / 2 + 50, yPos)
         .lineWidth(3)
         .lineCap('round') // Rounded ends for a modern look
         .strokeColor(ACCENT_COLOR)
         .stroke();

      yPos += 25;

      // Campaign Metrics/Details
      doc.fontSize(14)
         .font(FONT_REGULAR)
         .fillColor(TEXT_COLOR_SUBTLE)
         .text(`Category: ${campaignRequest.category} | Goal: ₹${campaignRequest.goal.toLocaleString()} | ID: ${campaignRequest._id.toString().substring(0, 8).toUpperCase()}`, 0, yPos, { 
           align: 'center', 
           width: pageWidth 
         });

      // --- 4. SIGNATURE & DATE FOOTER ---

      const signatureY = pageHeight - 160;
      const leftX = 150;
      const middleX = pageWidth / 2;
      const rightX = pageWidth - 300; // 150 + 150

      // Date of Approval
      const approvalDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });

      doc.fontSize(16)
         .font(FONT_REGULAR)
         .fillColor(TEXT_COLOR_SUBTLE)
         .text(`Date: ${approvalDate}`, middleX - 75, signatureY - 30, { width: 150, align: 'center' });


      // Signature Lines
      doc.lineWidth(1.5).strokeColor(TEXT_COLOR_SUBTLE);
      
      // Signature 1 (Campaign ID / Reference)
      doc.moveTo(leftX, signatureY)
         .lineTo(leftX + 200, signatureY)
         .stroke();

      // Signature 2 (Authority)
      doc.moveTo(rightX, signatureY)
         .lineTo(rightX + 200, signatureY)
         .stroke();

      let sigTextY = signatureY + 15;

      doc.fontSize(12)
         .font(FONT_BOLD)
         .fillColor(TEXT_COLOR_MAIN);

      doc.text('Campaign Reference', leftX, sigTextY, { width: 200, align: 'center' })
         .text('Authorized Platform Signature', rightX, sigTextY, { width: 200, align: 'center' });

      // --- 5. BOTTOM BRANDING ---
      
      let bottomY = pageHeight - 60;

      doc.fontSize(10)
         .font(FONT_BOLD)
         .fillColor(PRIMARY_COLOR)
         .text('FundRise - Empowering Visionaries | Integrity. Innovation. Impact.', 0, bottomY, { 
           align: 'center', 
           width: pageWidth 
         });

      bottomY += 15;

      doc.fontSize(8)
         .font(FONT_REGULAR)
         .fillColor(TEXT_COLOR_SUBTLE)
         .text('This certificate is digitally secured and verifiable via our platform. © 2025 FundRise', 0, bottomY, { 
           align: 'center', 
           width: pageWidth 
         });

      doc.end();

      stream.on('finish', () => {
        resolve(`certificates/${fileName}`);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};