'use strict';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a = require("@aws-sdk/client-comprehend"), ComprehendClient = _a.ComprehendClient, DetectSentimentCommand = _a.DetectSentimentCommand, DetectKeyPhrasesCommand = _a.DetectKeyPhrasesCommand;
var _b = require("@aws-sdk/client-polly"), PollyClient = _b.PollyClient, SynthesizeSpeechCommand = _b.SynthesizeSpeechCommand;
var comprehendClient = new ComprehendClient({
    apiVersion: '2017-11-27',
    region: 'us-east-1'
});
var pollyClient = new PollyClient({
    signatureVersion: 'v4',
    region: 'us-east-1'
});
var s3Helper = require('./lib/bucket_utils');
var handler = function (event) {
    var rec = event.Records[0];
    var fileName = rec.s3.object.key;
    var text;
    var createDetails;
    return s3Helper.downloadFile(fileName)
        .then(function (data) {
        return data.Body.toString();
    })
        .then(function (eulaText) {
        text = eulaText;
        var chunks = eulaText.match(/[\s\S]{1,2999}/g);
        return synthesizeSpeech(chunks[0]);
    })
        .then(function (mp3) {
        return s3Helper
            .uploadFile("uploaded/".concat(fileName.replace('txt', 'mp3')), mp3.AudioStream);
    })
        .then(function (cd) {
        createDetails = cd;
        try {
            s3Helper
                .deleteFile(fileName);
        }
        catch (err) {
            console.log("EULAGY:: Issue deleting ".concat(fileName));
        }
    })
        .then(function () {
        var chunks = text.match(/[\s\S]{1,4900}/g);
        var input = {
            Text: chunks,
            LanguageCode: "en"
        };
        return detectKeyPhrases(chunks[0]);
    })
        .then(function (kp) {
        var vals = sortEntriesByValues(kp.KeyPhrases);
        var csv = mapToCsv(vals);
        return s3Helper
            .uploadFile("uploaded/".concat(fileName.replace('txt', 'csv')), csv);
    })
        .then(function () {
        return createDetails;
    });
};
// returns a promise to create an mp3 from text
var synthesizeSpeech = function (text) {
    var params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Kimberly'
    };
    var command = new SynthesizeSpeechCommand(params);
    return pollyClient.send(command);
};
var detectSentiment = function (text) {
    var params = {
        LanguageCode: 'en',
        Text: text
    };
    var command = new DetectSentimentCommand(params);
    return comprehendClient.send(command);
};
var detectKeyPhrases = function (text) {
    var params = {
        LanguageCode: 'en',
        Text: text
    };
    var command = new DetectKeyPhrasesCommand(params);
    return comprehendClient.send(command);
};
// count and sort map by count of key (lower case)
var sortEntriesByValues = function (arr) {
    var occ = arr.reduce(function (occ, val) { return occ.set(val.Text.toLowerCase(), 1 + (occ.get(val.Text.toLowerCase()) || 0)); }, new Map());
    return new Map(__spreadArray([], occ.entries(), true).sort(function (a, b) { return b[1] - a[1]; }));
};
var mapToCsv = function (map) {
    var text = '';
    map.forEach(function (v, k, m) {
        text += "".concat(k, ",").concat(v, "\n");
    });
    return text;
};
module.exports.handler = handler;
module.exports.detectKeyPhrases = detectKeyPhrases;
module.exports.detectSentiment = detectSentiment;
module.exports.mapToCsv = mapToCsv;
module.exports.sortEntriesByValues = sortEntriesByValues;
module.exports.synthesizeSpeech = synthesizeSpeech;
