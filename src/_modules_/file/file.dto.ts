import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class AvatarUpload {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  avatar: Express.Multer.File;
}

export class BaseFileUploadDto {
  @ApiProperty({ type: 'number', required: true })
  objectId: number;

  @ApiProperty({ enum: FileType, required: true })
  @IsEnum(FileType)
  fileType: FileType;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: Express.Multer.File;
}

export class KycImagesUpload {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    isArray: true
  })
  images: Express.Multer.File[];
}

export class FindFileDto {
  objectId: number;
  fileType: FileType;
}
