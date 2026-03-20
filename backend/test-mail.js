const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const sendEmail = require('./utils/mail');

async function testMail() {
    console.log('Testing email with:', process.env.SMTP_USER);
    try {
        const info = await sendEmail({
            email: 'pawsafe7@gmail.com',
            subject: 'Test Email',
            message: 'This is a test email from PawSafe backend script.'
        });
        console.log('✅ Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('❌ Email failed:', error);
    }
}

testMail();
