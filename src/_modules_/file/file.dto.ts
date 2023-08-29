import { ApiProperty } from '@nestjs/swagger';

export class AvatarUpload {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  avatar: Express.Multer.File;
}
