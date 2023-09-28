type S3Subject = 'avatars' | 'kyc' | 'campaign';

export function generateS3ObjectKey(
  subject: S3Subject,
  subjectId: number | string,
  includetime = false
) {
  if (includetime) return `${subject}/${subjectId}/${Date.now()}`;

  return `${subject}/${subjectId}`;
}

export function generateS3UrlObject(key: string) {
  return `${process.env.AWS_S3_HOST}/${key}`;
}
