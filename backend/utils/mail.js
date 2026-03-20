const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    // Standard Gmail/SMTP config
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,
        socketTimeout: 5000
    });

    const mailOptions = {
        from: `PawSafe <${process.env.SMTP_USER || 'no-reply@pawsafe.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        if (process.env.NODE_ENV === 'development') {
            if (!process.env.SMTP_USER) {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            } else {
                console.log('📧 Email sent to:', options.email);
            }
        }
        return info;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ Email failed to send, falling back to development logging:', error.message);
            console.log('-----------------------------------------');
            console.log('📧 FOR TESTING PURPOSES:');
            console.log('TO:', options.email);
            console.log('STATUS: Email simulated (content hidden for security)');
            console.log('-----------------------------------------');
            return { messageId: 'dev-fallback-id', fallback: true };
        }
        throw error;
    }
};

module.exports = sendEmail;
