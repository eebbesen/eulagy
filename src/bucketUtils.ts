import {
  S3Client,
  CreateBucketCommand,
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  GetObjectCommand,
  type GetObjectCommandOutput,
  ListBucketsCommand,
  type ListBucketsCommandOutput,
  ListObjectsCommand,
  type ListObjectsCommandOutput,
  PutObjectCommand,
  type PutObjectCommandOutput
} from '@aws-sdk/client-s3'
import * as Utils from './utils'
import { log4TSProvider } from './config/LogConfig'

const log = log4TSProvider.getLogger('BucketUtils')
const client = new S3Client({})

export async function listBuckets (): Promise<ListBucketsCommandOutput> {
  return await client.send(new ListBucketsCommand({}))
};

export function createBucket (name: string): void {
  const bucketName = (name.length > 0) ? name : Utils.bucketProperty()

  listBuckets()
    .then(bs => {
      bs.Buckets?.forEach(b => {
        if (b.Name === bucketName) {
          log.warn(`${bucketName} already exists!`)
          return true
        }
      })

      log.info(`Will create ${bucketName}`)
    })
    .then(async () => {
      const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName })

      return await client.send(createBucketCommand)
    })
    .catch((error: Error) => {
      log.error(error.message)
    })
};

// lists files in S3 bucket
export async function listBucketFiles (name: string): Promise<ListObjectsCommandOutput> {
  const bucketName = (name.length > 0) ? name : Utils.bucketProperty()
  const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName })
  return await client.send(listObjectsCommand)
};

export async function downloadFile (name: string): Promise<GetObjectCommandOutput> {
  const getObjectCommand = new GetObjectCommand({ Bucket: Utils.bucketProperty(), Key: name, RequestPayer: 'requester' })
  return await client.send(getObjectCommand)
}

export async function deleteFile (name: string): Promise<DeleteObjectCommandOutput> {
  const deleteObjectCommand = new DeleteObjectCommand({ Bucket: Utils.bucketProperty(), Key: name })
  return await client.send(deleteObjectCommand)
};

// uploads one file to S3 bucket
export async function uploadFile (name: string, data: string): Promise<PutObjectCommandOutput> {
  log.debug(`file ${name} size is ${data.length}`)
  const putObjectCommand = new PutObjectCommand({ Bucket: Utils.bucketProperty(), Key: name, Body: data, ContentLength: data.length })
  return await client.send(putObjectCommand)
}
