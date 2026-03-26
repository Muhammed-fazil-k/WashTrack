const twilio = require('twilio');

class OTPService {
  // Lazy initialization of Twilio client
  static getTwilioClient() {
    if (!this.client && process.env.NODE_ENV !== 'development') {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
    return this.client;
  }

  // Generate a 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via SMS
  static async sendOTP(mobileNumber, otp) {
    try {
      if (process.env.NODE_ENV === 'development') {
        // In development, just log the OTP
        console.log(`\n🔐 [DEV MODE] OTP for ${mobileNumber}: ${otp}\n`);
        return { success: true, dev: true };
      }

      const client = this.getTwilioClient();
      const message = await client.messages.create({
        body: `Your WashTrack verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobileNumber
      });

      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('Failed to send OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  // Calculate expiry time
  static getExpiryTime() {
    const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}

module.exports = OTPService;
