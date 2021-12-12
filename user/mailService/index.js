const nodemailer = require('nodemailer');
const option = {
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.PASSWORD_SECRET_GMAIL
    }
};
transporter = nodemailer.createTransport(option);
module.exports = { transporter };

