import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReceipt = async (payment, user, project) => {
  return new Promise((resolve, reject) => {
    try {
      const receiptsDir = path.join(__dirname, '../../receipts');
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }

      const fileName = `receipt_${payment._id}.pdf`;
      const filePath = path.join(receiptsDir, fileName);

      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header Background (smaller)
      doc.rect(0, 0, doc.page.width, 90).fill('#3b82f6');

      // Company Logo/Name
      doc.fontSize(26)
         .font('Helvetica-Bold')
         .fillColor('#ffffff')
         .text('FundRise', 50, 30);
      
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#e0f2fe')
         .text('Empowering Innovation Together', 50, 60);

      // Receipt Title
      doc.fontSize(22)
         .font('Helvetica-Bold')
         .fillColor('#1e293b')
         .text('PAYMENT RECEIPT', 50, 110);

      // Receipt ID Box
      doc.roundedRect(doc.page.width - 220, 110, 170, 35, 5)
         .fillAndStroke('#dbeafe', '#3b82f6');
      
      doc.fontSize(9)
         .fillColor('#1e40af')
         .text('Receipt ID', doc.page.width - 210, 118);
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(payment._id.toString().substring(0, 12).toUpperCase(), doc.page.width - 210, 132);

      // Divider Line
      doc.moveTo(50, 165)
         .lineTo(doc.page.width - 50, 165)
         .lineWidth(2)
         .strokeColor('#e5e7eb')
         .stroke();

      // Receipt Details Section
      let yPos = 185;

      // Date
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('#64748b')
         .text('Date & Time:', 50, yPos);
      
      doc.font('Helvetica')
         .fillColor('#1e293b')
         .text(date, 180, yPos);

      yPos += 22;

      // Backer Details
      doc.font('Helvetica-Bold')
         .fillColor('#64748b')
         .text('Backer Name:', 50, yPos);
      
      doc.font('Helvetica')
         .fillColor('#1e293b')
         .text(user.name, 180, yPos);

      yPos += 20;

      doc.font('Helvetica-Bold')
         .fillColor('#64748b')
         .text('Email:', 50, yPos);
      
      doc.font('Helvetica')
         .fillColor('#1e293b')
         .text(user.email, 180, yPos);

      yPos += 30;

      // Project Details Box (smaller)
      doc.roundedRect(50, yPos, doc.page.width - 100, 60, 8)
         .fillAndStroke('#f0f9ff', '#3b82f6');

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#1e40af')
         .text('Project Backed', 70, yPos + 12);

      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1e293b')
         .text(project.title, 70, yPos + 32, {
           width: doc.page.width - 140,
           ellipsis: true
         });

      yPos += 80;

      // Payment Details Section
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1e293b')
         .text('Payment Details', 50, yPos);

      yPos += 25;

      // Table Header (smaller)
      doc.rect(50, yPos, doc.page.width - 100, 28)
         .fill('#f1f5f9');

      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#475569')
         .text('Description', 70, yPos + 8)
         .text('Amount', doc.page.width - 150, yPos + 8);

      yPos += 28;

      // Contribution Amount Row
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#1e293b')
         .text('Contribution Amount', 70, yPos + 8);

      doc.font('Helvetica-Bold')
         .fillColor('#16a34a')
         .text(`${payment.amount}`, doc.page.width - 150, yPos + 8);

      yPos += 28;

      // Processing Fee Row
      const processingFee = Math.round(payment.amount * 0.029 + 0.30);
      
      doc.font('Helvetica')
         .fillColor('#64748b')
         .text('Processing Fee (2.9% + 0.30)', 70, yPos + 8);

      doc.fillColor('#64748b')
         .text(`${processingFee}`, doc.page.width - 150, yPos + 8);

      yPos += 32;

      // Total Line
      doc.moveTo(50, yPos)
         .lineTo(doc.page.width - 50, yPos)
         .lineWidth(1)
         .strokeColor('#cbd5e1')
         .stroke();

      yPos += 15;

      // Total Amount
      const totalAmount = payment.amount + processingFee;

      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1e293b')
         .text('Total Paid', 70, yPos);

      doc.fontSize(16)
         .fillColor('#16a34a')
         .text(`${totalAmount}`, doc.page.width - 150, yPos);

      yPos += 35;

      // Payment Method
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#64748b')
         .text('Payment Method: Credit/Debit Card', 50, yPos);

      doc.text(`Transaction ID: ${payment.stripePaymentId}`, 50, yPos + 18, {
        width: doc.page.width - 100,
        ellipsis: true
      });

      // Footer Section
      yPos = doc.page.height - 120;

      doc.moveTo(50, yPos)
         .lineTo(doc.page.width - 50, yPos)
         .lineWidth(1)
         .strokeColor('#e5e7eb')
         .stroke();

      yPos += 20;

      // Thank You Message
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#3b82f6')
         .text('Thank You for Your Support!', 50, yPos, { align: 'center', width: doc.page.width - 100 });

      yPos += 18;

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#64748b')
         .text('This is a computer-generated receipt and does not require a signature.', 50, yPos, { 
           align: 'center', 
           width: doc.page.width - 100 
         });

      yPos += 15;

      doc.text('For any queries, contact us at support@fundrise.com', 50, yPos, { 
        align: 'center', 
        width: doc.page.width - 100 
      });

      // Footer Background
      doc.rect(0, doc.page.height - 35, doc.page.width, 35).fill('#f8fafc');

      doc.fontSize(8)
         .fillColor('#94a3b8')
         .text('© 2025 FundRise. All rights reserved.', 0, doc.page.height - 22, { 
           align: 'center', 
           width: doc.page.width 
         });

      doc.end();

      stream.on('finish', () => {
        resolve(`receipts/${fileName}`);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
