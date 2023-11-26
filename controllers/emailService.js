const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sabesofteng@gmail.com', // Gmail email 
    pass: '0509769273', // Your Gmail password
  },
});

module.exports = transporter;
