"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSynthesizeSpeech = void 0;
const client_polly_1 = require("@aws-sdk/client-polly");
const pollyClient = new client_polly_1.PollyClient({});
// issues with this after transitioning to v3 sdk
// export function synthesizeSpeech(text: RegExpMatchArray | null ): Promise<SynthesizeSpeechCommandOutput> | null {
//   if (!text) {
//     return null;
//   }
//   const command = new SynthesizeSpeechCommand({
//     OutputFormat: 'mp3',
//     Text: text[0],
//     VoiceId: 'Kimberly'
//   });
//   return pollyClient.send(command);
// };
// uploads directly to S3 bucket
function startSynthesizeSpeech(text) {
    if (text == null) {
        throw new Error('No text detected');
    }
    const command = new client_polly_1.StartSpeechSynthesisTaskCommand({
        OutputFormat: 'mp3',
        Text: text[0],
        VoiceId: 'Kimberly',
        OutputS3BucketName: 'eulagy',
        OutputS3KeyPrefix: `uploaded/eulagy-${Date.now()}`
    });
    return pollyClient.send(command);
}
exports.startSynthesizeSpeech = startSynthesizeSpeech;
;
//# sourceMappingURL=pollyUtils.js.map