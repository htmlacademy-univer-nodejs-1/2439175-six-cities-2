import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as crypto from 'node:crypto';

export const createSHA256 = (line: string, salt: string): string => {
    const shaHasher = crypto.createHmac('sha256', salt);
    return shaHasher.update(line).digest('hex');
};

export function createDTOfromRDO<DTO, RDO> (dto: ClassConstructor<DTO>, rdo: RDO) {
  return plainToInstance(dto, rdo, {excludeExtraneousValues: true});
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}