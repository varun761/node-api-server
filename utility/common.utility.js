exports.responseCodes = {
    SUCCESS: 200,
    CREATED_OK: 201,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    SERVER_ERROR: 500
}
exports.apiResponse = (response, status, message = null, data = null) => {
    let jsonResposne = {}
    if (data) jsonResposne = data
    if (message) jsonResposne.message = message
    return response.status(status).json(jsonResposne)
}