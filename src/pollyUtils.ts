import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
  type StartSpeechSynthesisTaskCommandOutput
} from '@aws-sdk/client-polly'

const pollyClient = new PollyClient({})

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
export async function startSynthesizeSpeech (text: RegExpMatchArray | null): Promise<StartSpeechSynthesisTaskCommandOutput> {
  if (text == null) {
    throw new Error('No text detected in startSynthesizeSpeech')
  }
  const command = new StartSpeechSynthesisTaskCommand({
    OutputFormat: 'mp3',
    Text: text[0],
    VoiceId: 'Kimberly',
    OutputS3BucketName: 'eulagy',
    OutputS3KeyPrefix: `uploaded/eulagy-${Date.now()}`
  })
  return await pollyClient.send(command)
};