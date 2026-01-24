import crypto from 'crypto';

const generateOTP = () => {
    // Generate a random 6-digit number
    // crypto.randomInt is available in Node.js 14.10+
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp;
};

export default generateOTP;
