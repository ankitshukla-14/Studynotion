const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
    try{
        // fetch email
        const {email} = req.body;
        // chk for user presence
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }
        // creating token
        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,
            },
            {new: true},
        );

        console.log("Details", updatedDetails);
        console.log("Details", token);

        // url creation
        const url = `https://studynotion-kohl.vercel.app/update-password/${token}`;

        // send url to mail
        await mailSender(email, 
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});

    } catch(error) {
        return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
    }
}

exports.resetPassword = async (req, res) => {
    try{
        // data fetch
        const {password, confirmPassword, token} = req.body;
        console.log("api called")
        console.log("token...", token)

        if(password !== confirmPassword) {
            return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
        }

        const userDetails = await User.findOne({token: token});
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Invalid Token",
            });
        }

        const sameNewPassword = await bcrypt.compare(confirmPassword, userDetails.password)
        if(sameNewPassword) {
            return res.status(401).json({
                success: false,
                message: "Old password and new password cannot be same",
            });
        }

        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate a new Token`,
			});
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            {token: token},
            {password: encryptedPassword},
            {new: true},
        );
        res.json({
			success: true,
			message: `Password Reset Successful`,
		});

    } catch(error) {
        return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
    }
}