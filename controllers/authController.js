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
        // token
        const token = jwt.sign({
            subject: user.email,
            // issuer: process.env.JWT_ISSUER,
            // audience: process.env.JWT_CONSUMER,
            algorithm:  "RS256"
        }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        // refresh token
        const refreshToken = jwt.sign({
            subject: user.email,
            algorithm:  "RS256"
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: 60 * 60 * 60})

        return res.status(200).json({
            token,
            refreshToken,
            message: 'Valid user.'
        })
    } catch(e) {
        return res.status(500).json({
            message: e.message
        })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const user = await userModel.findOne({
            _id: req.authorized
        })
        // generate token
        const token = jwt.sign({
            subject: user.email,
            // issuer: process.env.JWT_ISSUER,
            // audience: process.env.JWT_CONSUMER,
            algorithm:  "RS256"
        }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        // generate refresh token
        const refreshToken = jwt.sign({
            subject: user.email,
            algorithm:  "RS256"
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: 60 * 60 * 60})
        return res.status(200).json({
            token,
            refreshToken,
            message: 'Token updated succssfully.'
        })
    } catch(e) {
        return res.status(500).json({
            message: e.message
        })
    }
}