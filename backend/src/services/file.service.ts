import path, { join } from 'path';
import { mkdirSync, existsSync, unlinkSync, promises } from 'fs';
import { promises as fs } from 'fs';
import { format } from 'date-fns';
import crypto from 'crypto';
import { EntityType, File, FileType } from '@prisma/client';
import { IFileRepository } from '../repositories/file/IFileRepository';
import { FileCreateDTO } from '../dtos/file.dto';
import { FileOrderByInput } from '../models/file.model';
import { PaginatedResult, PaginationOptions } from '../common/types';
import { logger } from '../logger/logger';
import { UserFileUploadFailedError } from '../errors/user.errors';

export class FileService {

  constructor(private fileRepository: IFileRepository) {}

  static allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt'];

  static getUploadPath(type: string): string {
    const base = process.env.UPLOAD_FOLDER || 'uploads';
    const now = new Date();
    const yearMonth = format(now, 'yyyy/MM');
    const fullPath = join(base, type, yearMonth);
    this.ensureFolderExists(fullPath);
    return fullPath;
  }

  static getRelativePath(type: string, filename: string): string {
    const now = new Date();
    const yearMonth = format(now, 'yyyy/MM');
    const relativePath = path.join( type, yearMonth, filename);

    return relativePath.replace(/\\/g, '/');
  }

  static getPublicUrl(type: string, filename: string): string {
    const relative = this.getRelativePath(type, filename);
    return `/${process.env.UPLOAD_FOLDER || 'uploads'}/${relative}`.replace(/\\/g, '/');
  }

  static ensureFolderExists(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  static deleteFile(path: string): void {
    try {
      if (existsSync(path)) unlinkSync(path);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }

  static generateUniqueFilename(originalName: string): string {
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    const hash = crypto.randomUUID();
    return `${hash}${ext}`;
  }

  static isExtensionAllowed(filename: string): boolean {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return this.allowedExtensions.includes(ext);
  }

  static async safeUnlink(path: string): Promise<void> {
    try {
      await fs.unlink(path);
      console.log(`File successfully deleted: ${path}`);
    } catch (error) {
      console.error(`Failed to delete file: ${path}`, error);
    }
  }

  async fileUpdateUpload(
    fileType: FileType,
    entityType: EntityType,
    entityId: string,
    newFile: Express.Multer.File,
  ): Promise<File> {

    const currentFile = await this.findByEntity(entityType, entityId, fileType);

  if (currentFile) {
    try {
      const fileExists = await promises.access(currentFile.path).then(() => true).catch(() => false);
      if (fileExists) {
        await FileService.safeUnlink(currentFile.path);
        await this.delete(currentFile.id);
      } else {
        logger.warn(`File does not exist: ${currentFile.path}`);
      }
    } catch (error) {
        logger.error(`Error occurred while deleting old file: ${currentFile.path}`, error);
        throw new Error(`Failed to delete old file: ${currentFile.path}`);
      }
    }

    const fileRecord = await this.create({
      label: newFile.filename,
      path: newFile.path,
      fileType: fileType,
      entityType: entityType,
      entityId: entityId,
    });

    if (!fileRecord) {
      throw new UserFileUploadFailedError(entityId);
    }

    return fileRecord;
  }
  
  async create(file: FileCreateDTO): Promise<File> {
    const normalizedPath = file.path.replace(/\\/g, '/');
    file.path = normalizedPath;
    return this.fileRepository.create(file);
  }

  async delete(fileId: string): Promise<File> {
    return this.fileRepository.delete(fileId);
  }

  async findAll(
    orderBy?: FileOrderByInput,
    paginationOptions?: Partial<PaginationOptions>,
    select?: any,
  ): Promise<PaginatedResult<File> | File[]> {
    return this.fileRepository.findAll(orderBy, paginationOptions, select);
  }

  async findByEntity(
    entityType: EntityType,
    entityId: string,
    fileType: FileType): Promise<File | null> {
      const result = await this.fileRepository.find(
        { entityType, entityId, fileType }
      );
    
      const files = Array.isArray(result) ? result : result.data;
    
      return files.length > 0 ? files[0] : null;
  }
}