import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

const sendEmail = async (options) => {

    const timestamp = new Date().toLocaleTimeString();
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: `${options.subject} (${timestamp})`,
        html: options.text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Email error: ${error.message}`);
        throw error;
    }
};

export default sendEmail;
