import { Router } from 'express';
import { uploadGenericFile } from '../../controllers/upload.controller';
import { multerMiddleware } from '../../middlewares/multer.middleware';

const router = Router();

router.post('/', multerMiddleware('user').single('file'), uploadGenericFile);

export default router;
