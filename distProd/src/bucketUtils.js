"use strict";
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
exports.uploadFile = exports.deleteFile = exports.downloadFile = exports.listBucketFiles = exports.createBucket = exports.listBuckets = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const LogConfig_1 = require("./config/LogConfig");
const log = LogConfig_1.log4TSProvider.getLogger('BucketUtils');
const client = new client_s3_1.S3Client({});
function listBuckets() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.send(new client_s3_1.ListBucketsCommand({}));
    });
}
exports.listBuckets = listBuckets;
;
function createBucket(name) {
    const bucketName = (name.length > 0) ? name : 'eulagy';
    listBuckets()
        .then(bs => {
        var _a;
        (_a = bs.Buckets) === null || _a === void 0 ? void 0 : _a.forEach(b => {
            if (b.Name === bucketName) {
                log.warn(`${bucketName} already exists!`);
                return true;
            }
        });
        log.info(`Will create ${bucketName}`);
    })
        .then(() => __awaiter(this, void 0, void 0, function* () {
        const createBucketCommand = new client_s3_1.CreateBucketCommand({ Bucket: bucketName });
        return yield client.send(createBucketCommand);
    }))
        .catch((error) => {
        log.error(error);
    });
}
exports.createBucket = createBucket;
;
// lists files in S3 bucket
function listBucketFiles(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const bucketName = (name.length > 0) ? name : 'eulagy';
        const listObjectsCommand = new client_s3_1.ListObjectsCommand({ Bucket: bucketName });
        return yield client.send(listObjectsCommand);
    });
}
exports.listBucketFiles = listBucketFiles;
;
function downloadFile(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const getObjectCommand = new client_s3_1.GetObjectCommand({ Bucket: 'eulagy', Key: name, RequestPayer: 'requester' });
        return yield client.send(getObjectCommand);
    });
}
exports.downloadFile = downloadFile;
function deleteFile(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({ Bucket: 'eulagy', Key: name });
        return yield client.send(deleteObjectCommand);
    });
}
exports.deleteFile = deleteFile;
;
// uploads one file to S3 bucket
function uploadFile(name, data) {
    return __awaiter(this, void 0, void 0, function* () {
        log.debug(`file ${name} size is ${data.readableLength}`);
        const putObjectCommand = new client_s3_1.PutObjectCommand({ Bucket: 'eulagy', Key: name, Body: data, ContentLength: data.readableLength });
        return yield client.send(putObjectCommand);
    });
}
exports.uploadFile = uploadFile;
//# sourceMappingURL=bucketUtils.js.map