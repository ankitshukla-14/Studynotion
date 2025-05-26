const User = require("../models/user");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// signup
exports.signup = async (req, res) => {
    
    try{
        // data fetch
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;
        // validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
              });
        }
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                  "Password and Confirm Password do not match. Please try again.",
              });
        }
        const userExist = await User.findOne({email});
        if(userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
              });
        }
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(response);
        if(response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
            });
        } else if(otp !== response[0].otp) {
            // invalid otp
            return res.status(400).json({
                success: false,
                message: "OTP does not match",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
          })
          const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
          }) 
          return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
          });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
            error : err.message
        });
    }
}

exports.login = async (req, res) => {
    try{ 
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
              });
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: `User is not registered with us`,
              });
        }
        if(await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    email: user.email,
                    id: user._id,
                    accountType: user.accountType
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }            
            )
            user.token = token; 
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

            return res.cookie("token", token, options).json({
                success: true,
                token, 
                user,
                message:"User Login success",
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }        
    } catch(error) {
        console.error(error)
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
}

exports.sendotp = async (req, res) =>{
    try{
        const {email} = req.body;
        const userPresent = await User.findOne({email});
        if(userPresent) {
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            })
        }
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const result = await OTP.findOne({otp: otp}) 
        console.log("OTP", otp)
        console.log("Result", result)
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
        }
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("Otp Body", otpBody);
        return res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false, 
            error: error.message 
        });
      }
}

exports.changePassword = async (req, res) => {
    try{
        const userId = req.user.id;
        
        const userDetails = await User.findById(userId);

        const {oldPassword, newPassword} = req.body;

        const passwordMatched = await bcrypt.compare(oldPassword, userDetails.password);

        if(!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "Old password does not match",
            });
        }

        const sameNewPassword = await bcrypt.compare(newPassword, userDetails.password)
        if(sameNewPassword) {
            return res.status(401).json({
                success: false,
                message: "Old password and new password cannot be same",
            });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        
        userDetails.password = encryptedPassword;

        await userDetails.save();

        try{
            const mailResponse = await mailSender(userDetails.email, 
                "Password for your account has been updated",
                passwordUpdated(
                    userDetails.email,
                    `Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}`
                )
            );
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error occured while sending mail",
                error: error.message,
            });
        }
        
        return res.status(200).json({
            success: true,
            message:"Password updated successfully",
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occured while updating password",
            error: error.message,
        });
    }
}

