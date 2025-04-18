import multer from 'multer';
import { Request } from 'express';
import { FileService } from '../services/file.service';

export const multerMiddleware = (type: string) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const path = FileService.getUploadPath(type);
      cb(null, path);
    },
    filename: (_req, file, cb) => {
      const uniqueName = FileService.generateUniqueFilename(file.originalname);
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!FileService.isExtensionAllowed(file.originalname)) {
      return cb(new Error('File type not allowed'));
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
  });
};
