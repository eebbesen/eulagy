"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectKeyPhrases = exports.detectSentiment = void 0;
const client_comprehend_1 = require("@aws-sdk/client-comprehend");
const comprehendClient = new client_comprehend_1.ComprehendClient({});
function detectSentiment(text) {
    if (text == null) {
        throw new Error('Empty text');
    }
    const command = new client_comprehend_1.DetectSentimentCommand({
        LanguageCode: 'en',
        Text: text[0]
    });
    return comprehendClient.send(command);
}
exports.detectSentiment = detectSentiment;
;
function detectKeyPhrases(text) {
    if (text == null) {
        throw new Error('Empty text');
    }
    const command = new client_comprehend_1.DetectKeyPhrasesCommand({
        LanguageCode: 'en',
        Text: text[0]
    });
    return comprehendClient.send(command);
}
exports.detectKeyPhrases = detectKeyPhrases;
;
//# sourceMappingURL=comprehendUtils.js.map