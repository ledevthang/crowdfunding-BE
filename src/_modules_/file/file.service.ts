import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { Claims } from 'types/auth.type';
import { generateS3ObjectKey, generateS3UrlObject } from 'utils/generator.util';

@Injectable()
export class FileService {
  constructor(@InjectS3() private readonly s3: S3) {}

  async handleAvatar(avatar: Express.Multer.File, user: Claims) {
    const { id } = user;
    const key = generateS3ObjectKey('avatars', id);
    const url = await this.uploadToS3(avatar.buffer, key);

    return { url };
  }

  private async uploadToS3(file: Buffer, key: string) {
    await this.s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ACL: 'public-read',
      Body: file
    });
    const url = generateS3UrlObject(key);

    return url;
  }
}
