const { verify } = require("jsonwebtoken")
const { userModel } = require("../database/models")
const { apiResponse, responseCodes } = require("../utility/commonUtility")
require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'] || null
        if (!authorization) return apiResponse(res, responseCodes.UNAUTHORIZED, 'Bearer Token is required.')
        const token = authorization.replace('Bearer', '').trim()
        if (!token) return apiResponse(res, responseCodes.UNAUTHORIZED, 'Bearer Token is required.')
        verify(token, process.env.JWT_REFRESH_SECRET, {
            // audience: process.env.JWT_CONSUMER,
            // issuer: process.env.JWT_ISSUER
        }, function (err, decode) {
            if (err) return apiResponse(res, responseCodes.UNAUTHORIZED, err.message)
            const { subject } = decode
            if (!subject) return apiResponse(res, responseCodes.UNAUTHORIZED, 'Unauthorized')
            userModel.findOne({
                email: subject
            }).exec(function (execError, execData) {
                if (execError) return apiResponse(res, responseCodes.SERVER_ERROR, execError.message)
                if (!execData) return apiResponse(res, responseCodes.UNAUTHORIZED, "Unauthorized")
                req.authorized = execData._id
                return next()
            })
        })
    } catch(e) {
        return apiResponse(res, responseCodes.SERVER_ERROR, e.message)
    }
    
}