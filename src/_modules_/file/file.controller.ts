import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Auth } from 'decorators/auth.decorator';
import { User } from 'decorators/user.decorator';
import { Claims } from 'types/auth.type';
import { AvatarUpload, BaseFileUploadDto } from './file.dto';
import { FileService } from './file.service';

@Controller('files')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Patch('avatar')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({ type: AvatarUpload })
  @Auth('INVESTOR')
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1_024_000 }),
          new FileTypeValidator({
            fileType: new RegExp('^image/(jpeg|png|jpg)$')
          })
        ]
      })
    )
    file: Express.Multer.File,
    @User() user: Claims
  ) {
    return this.fileService.handleAvatar(file, user);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: BaseFileUploadDto })
  upload(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1_024_000 }),
          new FileTypeValidator({
            fileType: new RegExp('^image/(jpeg|png|jpg)$')
          })
        ]
      })
    )
    file: Express.Multer.File,
    @Body() baseFileUploadDto: BaseFileUploadDto
  ) {
    return this.fileService.upload(file, baseFileUploadDto);
  }
}
