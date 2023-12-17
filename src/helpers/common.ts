import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import * as crypto from 'node:crypto';
import { ValidationErrorField } from '../types/validation-error-fields.js';
import { ServiceError } from '../types/service-error.type.js';
import { UnknownRecord } from '../types/params.js';
import { DEFAULT_STATIC_IMAGES } from '../modules/app-constatnts.js';

export const createSHA256 = (line: string, salt: string): string => {
    const shaHasher = crypto.createHmac('sha256', salt);
    return shaHasher.update(line).digest('hex');
};

export function createDTOfromRDO<DTO, RDO>(dto: ClassConstructor<DTO>, rdo: RDO) {
    return plainToInstance(dto, rdo, { excludeExtraneousValues: true });
}

export function createErrorObject(serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) {
    return {
        errorType: serviceError,
        message,
        details: [...details]
    };
}

export function transformErrors(errors: ValidationError[]): ValidationErrorField[] {
    return errors.map(({ property, value, constraints }) => ({
        property,
        value,
        messages: constraints ? Object.values(constraints) : []
    }));
}

export function getFullServerPath(host: string, port: number) {
    return `http://${host}:${port}`;
}

function isObject(value: unknown) {
    return typeof value === 'object' && value !== null;
}

export function transformProperty(
    property: string,
    someObject: UnknownRecord,
    transformFn: (object: UnknownRecord) => void
) {
    return Object.keys(someObject)
        .forEach((key) => {
            if (key === property) {
                transformFn(someObject);
            } else if (isObject(someObject[key])) {
                transformProperty(property, someObject[key] as UnknownRecord, transformFn);
            }
        });
}

export function transformObject(properties: string[], staticPath: string, uploadPath: string, data: UnknownRecord) {
    return properties
        .forEach((property) => {
            transformProperty(property, data, (target: UnknownRecord) => {
                const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
                target[property] = `${rootPath}/${target[property]}`;
            });
        });
}