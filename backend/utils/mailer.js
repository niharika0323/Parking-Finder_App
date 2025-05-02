// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendBookingEmail(to, { name, bookingId, spotName, city, date, time }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Parking Spot Booking Confirmation',
    text: `
Hello ${name},

✅ Your parking spot has been successfully booked!

📍 Spot Name: ${spotName}
🏙️ City: ${city}
📅 Date: ${date}
⏰ Time: ${time}
🔐 Booking ID: ${bookingId}

Thank you for using AI Parking Finder!

Regards,  
AI Parking Finder Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

module.exports = sendBookingEmail;
