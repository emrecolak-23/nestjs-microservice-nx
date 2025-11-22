import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UPLOAD_FILE_PATH } from './upload';
import { Express } from 'express';

@Controller('uploads')
export class UploadsController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_FILE_PATH,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${file.fieldname}-${uniqueSuffix}.json`;
          cb(null, fileName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype !== 'application/json') {
          return cb(new BadRequestException('Only json files allowed'), null);
        }
        cb(null, true);
      },
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      fileName: file.filename,
    };
  }
}
