require('dotenv').config()
const { userModel } = require('../database/models/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const errorMessages = {
    'INVALID_EMAIL_PASSWORD': 'Incorrect email or password'
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.findOne({
            email
        })
        if (!user) {
            return res.status(403).json({
                message: errorMessages.INVALID_EMAIL_PASSWORD
            })
        }
        const validatePassword = await bcrypt.compare(password, user.password)

        if (!validatePassword) {
            return res.status(403).json({
                message: errorMessages.INVALID_EMAIL_PASSWORD
            })
        }

        const token = jwt.sign({
            subject: user.email,
            // issuer: process.env.JWT_ISSUER,
            // audience: process.env.JWT_CONSUMER,
            algorithm:  "RS256"
        }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

        await userModel.findOneAndUpdate({
            email
        }, {
            $set: {
                token
            }
        })
        return res.status(200).json({
            token,
            message: 'Valid user.'
        })
    } catch(e) {
        return res.status(500).json({
            message: e.message
        })
    }
}