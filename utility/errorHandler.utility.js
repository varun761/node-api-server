const fs = require('fs');
const path = require('path');

class ErrorHandler {
  constructor() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    this.filename = `log_error_${currentDay}_${currentMonth}_${currentYear}`;
  }

  static newLineAddedMessage(label, value) {
    return `${label} : ${value}\r\n`;
  }

  static stringifyParamters(param) {
    if (!param) return '';
    return typeof param === 'object' ? JSON.stringify(param) : param;
  }

  static requestPath(reqParam) {
    return reqParam.baseUrl + reqParam.path;
  }

  formattedErrorMessage(request, errorMessage = null, errorStack = null) {
    let message = '';
    if (request.path) {
      message += this.newLineAddedMessage('Path', this.stringifyParamters(this.requestPath(request)));
    }
    if (request.body) {
      message += this.newLineAddedMessage('Body', this.stringifyParamters(request.body));
    }
    if (request.params) {
      message += this.newLineAddedMessage('Params', this.stringifyParamters(request.params));
    }
    if (errorMessage) {
      message += this.newLineAddedMessage('Message', errorMessage);
    }
    if (errorStack) {
      message += this.newLineAddedMessage('Stack', errorStack);
    }
    return `${message}\r\n`;
  }

  writeError(request, errorObject) {
    const filePath = path.join(__dirname, '../logs');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    fs.appendFileSync(`${filePath}/${this.filename}.txt`, this.formattedErrorMessage(request, errorObject.message));
    return true;
  }
}

module.exports = ErrorHandler;
