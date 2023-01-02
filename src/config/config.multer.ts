import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname, sep } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

type Limits = {
  /** Max field name size (Default: 100 bytes) */
  fieldNameSize?: number;
  /** Max field value size (Default: 1MB) */
  fieldSize?: number;
  /** Max number of non- file fields (Default: Infinity) */
  fields?: number;
  /** For multipart forms, the max file size (in bytes)(Default: Infinity) */
  fileSize?: number;
  /** For multipart forms, the max number of file fields (Default: Infinity) */
  files?: number;
  /** For multipart forms, the max number of parts (fields + files)(Default: Infinity) */
  parts?: number;
  /** For multipart forms, the max number of header key=> value pairs to parse Default: 2000(same as node's http). */
  headerPairs?: number;
};
@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  private readonly logger = new Logger(MulterConfig.name);

  constructor(private readonly config: ConfigService) {}
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const fileFilter = (request, file, callback) => {
      callback(null, true);
      // if (file.mimetype.match(/\/(jpg|jpeg|png|plain|document)$/)) {
      //   // 이미지 형식은 jpg, jpeg, png만 허용합니다.
      //   callback(null, true)
      // } else {
      //   callback(new UnsupportedMediaTypeException(`'${file.mimetype}' 은(는) 지원하지 않는 형식 입니다.`), false)
      // }
    };
    // 파일 저장소 정의
    const storage = diskStorage({
      destination: (request, file, callback) => {
        const [filetype] = file.mimetype?.split('/');
        const savePath = `${this.config.get(
          'resource.savePath',
        )}${sep}${filetype}`;

        if (!existsSync(savePath)) {
          mkdirSync(savePath, { recursive: true });
        }
        callback(null, savePath);
      },
      filename: (request, file, callback) => {
        callback(
          null,
          `${uuid()}${extname(file.originalname).toLocaleLowerCase()}`,
        );
      },
    });

    // 제약 사항 정의
    const limits: Limits = {
      fileSize: 50 * 1024 * 1024, // 50MB
    };

    return {
      fileFilter,
      storage,
      limits,
    };
  }
}
