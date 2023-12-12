import { NextFunction, Request, Response } from "express";
import { MiddlewareInterface } from "./middleware-interface";
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extension } from "mime-types";

export class UploadFileMiddleware implements MiddlewareInterface {
    constructor(
      private uploadDirectory: string,
      private fieldName: string,
    ) {}
  
    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
      const storage = diskStorage({
        destination: this.uploadDirectory,
        filename: (_req, file, callback) => {
          const fileExtentions = extension(file.mimetype);
          const filename = nanoid();
          callback(null, `${filename}.${fileExtentions}`);
        }
      });
  
      const uploadSingleFileMiddleware = multer({storage})
        .single(this.fieldName);
  
      uploadSingleFileMiddleware(req, res, next);
    }
  }