const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
        // Use Ethereal for local testing if no real credentials
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('📧 Ethereal email configured for development');
    } else {
        // Standard Gmail/SMTP config
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    const mailOptions = {
        from: `PawSafe <${process.env.EMAIL_USER || 'no-reply@pawsafe.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
};

module.exports = sendEmail;
