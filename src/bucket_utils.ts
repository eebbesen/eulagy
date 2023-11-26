import { S3Client,
        CreateBucketCommand,
        DeleteObjectCommand,
        DeleteObjectCommandOutput,
        GetObjectCommand,
        GetObjectCommandOutput,
        ListBucketsCommand,
        ListBucketsCommandOutput,
        ListObjectsCommand,
        ListObjectsCommandOutput,
        PutObjectCommand,
        PutObjectCommandOutput } from '@aws-sdk/client-s3';
import FsPromises from 'fs/promises';

const client = new S3Client({});

export function listBuckets(): Promise<ListBucketsCommandOutput>  {
  return client.send(new ListBucketsCommand({}));
};

export function createBucket(name: string): void {
  const bucketName = name || 'eulagy';

  listBuckets()
    .then(bs => {
      bs['Buckets']?.forEach( b => {
        if(b['Name'] === bucketName) {
          console.log(`${bucketName} already exists!`);
          return true;
        }
      });

      console.log(`Will create ${bucketName}`);
    })
    .then(() => {
      const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });

      client.send(createBucketCommand);
    })
    .catch((error: any) => {
      console.log(error);
    });
};

// lists files in S3 bucket
export function listBucketFiles(name: string): Promise<ListObjectsCommandOutput> {
  const bucketName = name || 'eulagy';
  const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
  return client.send(listObjectsCommand);
};

export function downloadFile(name: string): Promise<GetObjectCommandOutput> {
  const getObjectCommand = new GetObjectCommand({ Bucket: 'eulagy', Key: name });
  return client.send(getObjectCommand);
}

export function deleteFile(name: string): Promise<DeleteObjectCommandOutput> {
  const deleteObjectCommand = new DeleteObjectCommand({ Bucket: 'eulagy', Key: name });
  return client.send(deleteObjectCommand);
};

// uploads one file to S3 bucket
export function uploadFile(name: string, data: any): Promise<PutObjectCommandOutput> {
  const putObjectCommand = new PutObjectCommand({ Bucket: 'eulagy', Key: name, Body: data, ContentLength: data.readableLength });
  return client.send(putObjectCommand);
}

// uploads all files in a dir to S3 bucket
export function uploadFiles(): Promise<void | string[]> {
  return FsPromises.readdir('output')
    .then((files: any) => {
      files.forEach((f: any) => {
        FsPromises.readFile(`output/${f}`)
          .then((buffer: Buffer) => {
            uploadFile(f, buffer)
              .then(() => { console.log(`Uploaded ${f}`); });
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
    });
};