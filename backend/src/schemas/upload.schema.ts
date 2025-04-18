import { z } from 'zod';
import { UtilsValidator } from '../validators/utils.validator';

export const uploadGenericSchema = z.object({
    type: z.enum(['user','any'], {
      errorMap: () => ({ message: 'Invalid type' }),
    }),
    entityId: z.string().refine(
        value => UtilsValidator.validateId(value),
        { message: 'The ID must be a valid UUID.' }
      ),
  });