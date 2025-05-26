const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emaiVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60,
    }
});

async function sendVerificationMail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification email from StudyNotion", otpTemplate(otp));
        console.log("Mail sent successfully", mailResponse);
    } catch(err) { 
        console.log("Error occured while sending mail", err);
        throw err;
    }
}

otpSchema.pre("save", async function(next) {
    console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationMail(this.email, this.otp);
	}
	next();
})

module.exports = mongoose.model("OTP", otpSchema);


