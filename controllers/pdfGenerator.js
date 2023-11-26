const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = async (userId, startDate, endDate) => {
  try {
    const doc = new PDFDocument();
    const filename = 'expense_report.pdf';
    const stream = fs.createWriteStream(filename);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    doc.pipe(stream);
    doc.fontSize(16).text('Expense Report', { align: 'center' });

    expenses.forEach((expense, index) => {
      doc.fontSize(12).text(`Expense #${index + 1}:`);
      doc.fontSize(10).text(`Description: ${expense.description}`);
      doc.fontSize(10).text(`Amount: ${expense.amount}`);
      doc.fontSize(10).text(`Category: ${expense.category}`);
      doc.fontSize(10).text(`Date: ${expense.date}`);
      doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error('Failed to generate PDF');
  }
};

module.exports = {
  generatePDF,
};
