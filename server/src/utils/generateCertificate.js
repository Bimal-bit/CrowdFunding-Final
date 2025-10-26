import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Certificate Border
      doc.lineWidth(8)
         .strokeColor('#3b82f6')
         .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .stroke();

      doc.lineWidth(2)
         .strokeColor('#10b981')
         .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
         .stroke();

      // Decorative corners
      const cornerSize = 40;
      doc.lineWidth(3)
         .strokeColor('#f59e0b');
      
      // Top-left corner
      doc.moveTo(50, 50 + cornerSize).lineTo(50, 50).lineTo(50 + cornerSize, 50).stroke();
      // Top-right corner
      doc.moveTo(doc.page.width - 50 - cornerSize, 50).lineTo(doc.page.width - 50, 50).lineTo(doc.page.width - 50, 50 + cornerSize).stroke();
      // Bottom-left corner
      doc.moveTo(50, doc.page.height - 50 - cornerSize).lineTo(50, doc.page.height - 50).lineTo(50 + cornerSize, doc.page.height - 50).stroke();
      // Bottom-right corner
      doc.moveTo(doc.page.width - 50 - cornerSize, doc.page.height - 50).lineTo(doc.page.width - 50, doc.page.height - 50).lineTo(doc.page.width - 50, doc.page.height - 50 - cornerSize).stroke();

      let yPos = 80;

      // Header
      doc.fontSize(42)
         .font('Helvetica-Bold')
         .fillColor('#1e40af')
         .text('CERTIFICATE', 0, yPos, { align: 'center', width: doc.page.width });

      yPos += 50;

      doc.fontSize(18)
         .font('Helvetica')
         .fillColor('#64748b')
         .text('OF CONTRIBUTION', 0, yPos, { align: 'center', width: doc.page.width });

      yPos += 40;

      // Divider
      doc.moveTo(doc.page.width / 2 - 150, yPos)
         .lineTo(doc.page.width / 2 + 150, yPos)
         .lineWidth(2)
         .strokeColor('#3b82f6')
         .stroke();

      yPos += 30;

      // Main Content
      doc.fontSize(15)
         .font('Helvetica')
         .fillColor('#475569')
         .text('This is to certify that', 0, yPos, { align: 'center', width: doc.page.width });

      yPos += 28;

      // Creator Name
      doc.fontSize(30)
         .font('Helvetica-Bold')
         .fillColor('#1e293b')
         .text(creator.name, 0, yPos, { align: 'center', width: doc.page.width });

      yPos += 38;

      // Campaign Details
      doc.fontSize(15)
         .font('Helvetica')
         .fillColor('#475569')
         .text('has successfully Launched the campaign', 0, yPos, { align: 'center', width: doc.page.width });

      yPos += 28;

      // Campaign Title
      doc.fontSize(22)
         .font('Helvetica-Bold')
         .fillColor('#3b82f6')
         .text(`"${campaignRequest.title}"`, 100, yPos, { 
           align: 'center', 
           width: doc.page.width - 200 
         });

      yPos += 40;

      // Additional Details
      doc.fontSize(13)
         .font('Helvetica')
         .fillColor('#64748b')
         .text(`Category: ${campaignRequest.category} | Goal: ₹${campaignRequest.goal.toLocaleString()}`, 0, yPos, { 
           align: 'center', 
           width: doc.page.width 
         });

      yPos += 35;

      // Approval Date
      const approvalDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });

      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#64748b')
         .text(`Approved on ${approvalDate}`, 0, yPos, { align: 'center', width: doc.page.width });

      // Footer Section - Fixed position from bottom
      yPos = doc.page.height - 120;

      // Signature Line
      const signatureY = yPos;
      const leftX = 150;
      const rightX = doc.page.width - 250;

      doc.moveTo(leftX, signatureY)
         .lineTo(leftX + 150, signatureY)
         .lineWidth(1)
         .strokeColor('#cbd5e1')
         .stroke();

      doc.moveTo(rightX, signatureY)
         .lineTo(rightX + 150, signatureY)
         .stroke();

      yPos += 15;

      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('#475569')
         .text('Campaign ID', leftX, yPos, { width: 150, align: 'center' })
         .text('FundRise Platform', rightX, yPos, { width: 150, align: 'center' });

      yPos += 15;

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#94a3b8')
         .text(campaignRequest._id.toString().substring(0, 12).toUpperCase(), leftX, yPos, { width: 150, align: 'center' })
         .text('Authorized Signature', rightX, yPos, { width: 150, align: 'center' });

      // Bottom Footer
      yPos = doc.page.height - 60;

      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#3b82f6')
         .text('🎉 Congratulations! You\'re Part of Something Special 🎉', 0, yPos, { 
           align: 'center', 
           width: doc.page.width 
         });

      yPos += 20;

      doc.fontSize(7)
         .font('Helvetica')
         .fillColor('#64748b')
         .text('FundRise - Where Every Campaign Gets a Certificate, Admin-Approved Quality, and Real-Time Analytics', 0, yPos, { 
           align: 'center', 
           width: doc.page.width 
         });

      yPos += 12;

      doc.fontSize(7)
         .font('Helvetica')
         .fillColor('#94a3b8')
         .text('© 2025 FundRise - Empowering Innovation Together', 0, yPos, { 
           align: 'center', 
           width: doc.page.width 
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
