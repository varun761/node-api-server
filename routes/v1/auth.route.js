const express = require('express');
const { validate } = require('express-validation');
const { loginValidation } = require('../../validations/v1/authValidation');
const { login, refreshToken } = require('../../controllers/v1/auth.controller');
const verifyRefreshToken = require('../../middleware/verifyRefreshToken');

const authRoute = express();
/**
 * @openapi
 * /auth/:
 *   post:
 *     summary: Authentication
 *     tags: ['Auth']
 *     description: Authenticate user by email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *           examples:
 *             user:
 *               value: { email: test@gail.com, password: admin@123 }
 *     responses:
 *       200:
 *         description: Returns a JSON object containing token , refreshToken and expiresIn.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 */
authRoute.post('/', validate(loginValidation), login);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     security:
 *       bearerAuth: []
 *     summary: Get refresh token
 *     tags: ['Auth']
 *     description: Get refresh token if expires
 *     responses:
 *       200:
 *         description: Returns a JSON object containing token , refreshToken and expiresIn.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 */
authRoute.post('/refresh-token', verifyRefreshToken, refreshToken);

module.exports = authRoute;
