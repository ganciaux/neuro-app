import path, { join } from 'path';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { format } from 'date-fns';
import crypto from 'crypto';

export class FileService {
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
}
