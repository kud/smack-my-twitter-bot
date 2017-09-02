'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logService = {
  message: function message(opt) {
    var title = opt.title || 'Message';

    console.log(_chalk2.default.bgBlack(_chalk2.default.white(' ' + title + ' ')), opt.subtitle ? _chalk2.default.bgWhite(_chalk2.default.black(' ' + opt.subtitle + ' ')) : '', '\n\n', '' + opt.message, '\n');
  },
  info: function info(opt) {
    var title = opt.title || 'Info';

    console.log(_chalk2.default.bgBlue(_chalk2.default.white(' ' + title + ' ')), opt.subtitle ? _chalk2.default.bgWhite(_chalk2.default.black(' ' + opt.subtitle + ' ')) : '', '\n\n', '' + opt.message, '\n');
  },
  success: function success(opt) {
    var title = opt.title || 'Success';

    console.log(_chalk2.default.bgGreen(_chalk2.default.white(' ' + title + ' ')), opt.subtitle ? _chalk2.default.bgWhite(_chalk2.default.black(' ' + opt.subtitle + ' ')) : '', '\n\n', '' + opt.message, '\n');
  },
  error: function error(opt) {
    var title = opt.title || 'Error';

    console.log(_chalk2.default.bgRed(_chalk2.default.white(' ' + title + ' ')), opt.subtitle ? _chalk2.default.bgWhite(_chalk2.default.black(' ' + opt.subtitle + ' ')) : '', '\n\n', '' + opt.message, '\n');
  }
};

exports.default = logService;