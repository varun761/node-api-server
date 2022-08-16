const { verify } = require("jsonwebtoken")
const { userModel } = require("../database/models")
require('dotenv').config()

const unauthResponseMessage = { message: 'Unauthorized'}

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'] || null
        if (!authorization) return res.status(400).json(unauthResponseMessage)
        const token = authorization.replace('Bearer', '').trim()
        if (!token) return res.status(400).json()
        verify(token, process.env.JWT_SECRET, {
            // audience: process.env.JWT_CONSUMER,
            // issuer: process.env.JWT_ISSUER
        }, function (err, decode) {
            if (err) return res.status(400).json({ message: err.message})
            const { subject } = decode
            if (!subject) return res.status(400).json(unauthResponseMessage)
            userModel.findOne({
                email: subject
            }).exec(function (execError, execData) {
                if (execError) return res.status(500).json({ message: execError.message})
                if (!execData) return res.status(400).json(unauthResponseMessage)
                req.authorized = execData._id
                return next()
            })
        })
    } catch(e) {
        return res.status(500).json({ message: e.message})
    }
    
}