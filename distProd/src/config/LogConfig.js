"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log4TSProvider = void 0;
const typescript_logging_1 = require("typescript-logging");
const typescript_logging_log4ts_style_1 = require("typescript-logging-log4ts-style");
exports.log4TSProvider = typescript_logging_log4ts_style_1.Log4TSProvider.createProvider('Log4TSProvider', {
    level: typescript_logging_1.LogLevel.Info,
    groups: [{
            expression: new RegExp('.+'),
        }]
});
//# sourceMappingURL=LogConfig.js.map