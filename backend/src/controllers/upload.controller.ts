import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async.handler.middleware';
import { FileService } from '../services/file.service';
import { uploadGenericSchema } from '../schemas/upload.schema';

export const uploadGenericFile = asyncHandler(
  async (request: Request, response: Response) => {
    if (!request.file) {
        return response.status(400).json({ message: 'No file uploaded' });
      }
  
      const parseResult = uploadGenericSchema.safeParse(request.body);
      if (!parseResult.success) {
        return response.status(400).json({ errors: parseResult.error.format() });
      }
  
      const { type, entityId } = parseResult.data;
  
      const relativePath = FileService.getRelativePath(type, request.file.filename);
      const publicUrl = FileService.getPublicUrl(type, request.file.filename);
  
      response.status(200).json({
        message: 'File uploaded successfully',
        type,
        entityId,
        file: {
          originalName: request.file.originalname,
          mimeType: request.file.mimetype,
          size: request.file.size,
          path: relativePath,
          url: publicUrl,
        },
      });
    }
);
