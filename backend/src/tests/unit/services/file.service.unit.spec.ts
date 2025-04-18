import path from 'path';
import { FileService } from '../../../services/file.service';

jest.mock('date-fns', () => ({
  format: jest.fn(() => '2025/01'),
}));

describe('FileService', () => {
  describe('getRelativePath', () => {
    it('should generate a correct relative path', () => {
      const type = 'user';
      const filename = 'avatar.jpg';
      const expectedPath = `user/2025/01/avatar.jpg`;

      const result = FileService.getRelativePath(type, filename);
      expect(result).toBe(expectedPath);
    });
  });

  describe('getPublicUrl', () => {
    it('devrait générer une URL publique correcte', () => {
      const type = 'user';
      const filename = 'avatar.jpg';
      const expectedUrl = `/uploads/user/2025/01/avatar.jpg`;

      const result = FileService.getPublicUrl(type, filename);
      expect(result).toBe(expectedUrl);
    });
  });
});
