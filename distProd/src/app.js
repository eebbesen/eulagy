"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const BucketUtils = __importStar(require("./bucketUtils"));
const Utils = __importStar(require("./utils"));
const PollyUtils = __importStar(require("./pollyUtils"));
const ComprehendUtils = __importStar(require("./comprehendUtils"));
const LogConfig_1 = require("./config/LogConfig");
const log = LogConfig_1.log4TSProvider.getLogger('App');
function handler(event) {
    return __awaiter(this, void 0, void 0, function* () {
        log.info('incoming event', JSON.stringify(event));
        const rec = event.Records[0];
        const fileName = rec.s3.object.key;
        log.info('processing file', fileName);
        let text;
        let createDetailsMp3;
        let createDetailsCsv;
        return yield BucketUtils.downloadFile(fileName)
            .then((data) => {
            var _a;
            return (_a = data === null || data === void 0 ? void 0 : data.Body) === null || _a === void 0 ? void 0 : _a.transformToString();
        })
            .then((eulaText) => __awaiter(this, void 0, void 0, function* () {
            log.debug('EULA text is', eulaText);
            if ((eulaText === null || eulaText === void 0 ? void 0 : eulaText.length) === 0) {
                throw new Error(`No content for file ${fileName}`);
            }
            text = eulaText;
            // raise Exception unless eulaText has value
            // const chunks: RegExpMatchArray | null | undefined = eulaText?.match(/[\s\S]{1,2999}/g)
            const chunks = eulaText === null || eulaText === void 0 ? void 0 : eulaText.match(/[\s\S]{1,2999}/g);
            return yield PollyUtils.startSynthesizeSpeech(chunks);
        }))
            .then((mp3Generation) => {
            createDetailsMp3 = mp3Generation;
            log.debug('mp3 file location', JSON.stringify(mp3Generation));
        })
            .then((ret) => __awaiter(this, void 0, void 0, function* () {
            const chunks = text === null || text === void 0 ? void 0 : text.match(/[\s\S]{1,4900}/g);
            // raise error if chunks has no value
            return yield ComprehendUtils.detectKeyPhrases(chunks);
        }))
            .then((kp) => __awaiter(this, void 0, void 0, function* () {
            const vals = Utils.sortEntriesByValues(kp === null || kp === void 0 ? void 0 : kp.KeyPhrases);
            const csv = Utils.mapToCsv(vals);
            return yield BucketUtils
                .uploadFile(`uploaded/${fileName.replace('txt', 'csv')}`, csv);
        }))
            .then((uploadCsv) => __awaiter(this, void 0, void 0, function* () {
            createDetailsCsv = uploadCsv;
            log.debug('uploaded CSV file', JSON.stringify(uploadCsv));
            return yield BucketUtils.deleteFile(fileName);
        }))
            .then((cdMp3) => {
            console.log('mp3 file details', JSON.stringify(createDetailsMp3));
            console.log('CSV file details', JSON.stringify(createDetailsCsv));
            return createDetailsMp3;
        });
    });
}
exports.handler = handler;
;
//# sourceMappingURL=app.js.map