import {
  PollyClient,
  SynthesizeSpeechCommand,
  SynthesizeSpeechCommandOutput,
  StartSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommandOutput
} from '@aws-sdk/client-polly';

const pollyClient = new PollyClient({});

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
export function startSynthesizeSpeech(text: RegExpMatchArray | null): Promise<StartSpeechSynthesisTaskCommandOutput> | null {
  if (!text) {
    return null;
  }
  const command = new StartSpeechSynthesisTaskCommand({
    OutputFormat: 'mp3',
    Text: text[0],
    VoiceId: 'Kimberly',
    OutputS3BucketName: 'eulagy',
    OutputS3KeyPrefix: `uploaded/eulagy-${Date.now()}`,
  });
  return pollyClient.send(command);
};
