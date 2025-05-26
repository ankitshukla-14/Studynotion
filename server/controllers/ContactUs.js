const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            message,
            phoneNo, 
            countryCode
        } = req.body
        console.log(req.body)
        const mailRes = await mailSender(
            email,
            "Your Data send successfully",
            contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
        )
        console.log("Email res..", mailRes)
        return res.status(200).json({
            success: true,
            message: "Email send successfully"
        })
    } catch(error) {
        console.log("Error..", error) 
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}