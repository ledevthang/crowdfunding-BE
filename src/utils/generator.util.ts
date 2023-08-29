type S3Subject = 'avatars';

export function generateS3ObjectKey(subject: S3Subject, userId: number) {
  return `${subject}/${userId}`;
}

export function generateS3UrlObject(key: string) {
  return `${process.env.AWS_S3_HOST}/${key}`;
}
