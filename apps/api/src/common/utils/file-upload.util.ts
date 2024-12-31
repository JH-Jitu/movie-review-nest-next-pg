// src/common/utils/file-upload.util.ts
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import { extname } from 'path';
import { CloudinaryResponse } from '../interfaces/cloudinary-response.interface';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  // Multer configuration for local storage
  static createMulterOptions(destination: string = './uploads') {
    return {
      storage: multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
          // const uniqueSuffix =
          //   Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.originalname}`,
            // `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  // Cloudinary upload
  async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  // Universal upload function that can use either Cloudinary or local storage
  async uploadFile(
    file: Express.Multer.File,
    options: {
      useCloudinary?: boolean;
      folder?: string;
      destination?: string;
    } = {},
  ) {
    const {
      useCloudinary = false, //TODO: will be true - cloudinary login
      folder = 'movies',
      destination = './uploads/avatars',
    } = options;

    if (useCloudinary) {
      return this.uploadToCloudinary(file, folder);
    }

    // If not using Cloudinary, file will already be saved locally by Multer
    return {
      url: `${destination}/${file.originalname}`,
      public_id: file.originalname,
    };
  }
}
