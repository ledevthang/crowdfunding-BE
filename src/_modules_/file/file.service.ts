import { Injectable } from '@nestjs/common';
import { PrismaService } from '_modules_/prisma/prisma.service';
import { InjectS3, S3 } from 'nestjs-s3';
import { Claims } from 'types/auth.type';
import { generateS3ObjectKey, generateS3UrlObject } from 'utils/generator.util';
import { BaseFileUploadDto, FindFileDto } from './file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly prisma: PrismaService
  ) {}

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

  async upload(
    image: Express.Multer.File,
    baseFileUploadDto: BaseFileUploadDto
  ) {
    const { objectId, fileType } = baseFileUploadDto;
    const key = `${fileType}/${(new Date()).getTime()}`;
    const url = await this.uploadToS3(image.buffer, key);
    await this.prisma.fileStorage.create({
      data: {
        url,
        objectId: +objectId,
        fileType
      }
    });
    return { url };
  }

  async find(findFileDto: FindFileDto) {
    const { objectId, fileType } = findFileDto;
    const files = await this.prisma.fileStorage.findMany({
      where: {
        objectId,
        fileType
      },
      select: {
        url: true
      }
    });
    return files.map(item => item.url)
  }

  async findOne(findFileDto: FindFileDto) {
    const { objectId, fileType } = findFileDto;
    const file = await this.prisma.fileStorage.findFirst({
      where: {
        objectId,
        fileType
      },
      select: {
        url: true
      },
      orderBy: {
        uploadAt: "desc"
      }
    });
    console.log('findOne', findFileDto, file?.url || '')
    return file?.url || ''
  }
}
