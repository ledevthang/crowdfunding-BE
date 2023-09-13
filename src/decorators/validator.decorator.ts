import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';

/* eslint-disable-next-line */
export function IsBool(target: Object, propertyKey: string | symbol) {
  Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })(target, propertyKey);
  IsBoolean()(target, propertyKey);
}

export function OptionalProperty(
  options?: ApiPropertyOptions
): PropertyDecorator {
  /* eslint-disable-next-line */
  return (target: Object, propertyKey: string | symbol) => {
    ApiPropertyOptional(options)(target, propertyKey);
    IsOptional()(target, propertyKey);
  };
}

/* eslint-disable-next-line */
export function IsInterger(target: Object, propertyKey: string | symbol) {
  Type(() => Number)(target, propertyKey);
  IsInt()(target, propertyKey);
}

/* eslint-disable-next-line */
export function IsFloat(target: Object, propertyKey: string | symbol) {
  Type(() => Number)(target, propertyKey);
  IsNumber()(target, propertyKey);
}

export class MultipleMaxFilesSizeValidator extends MaxFileSizeValidator {
  isValid(files: any): boolean {
    return (files as Express.Multer.File[]).every(f => super.isValid(f));
  }
}

export class MultipleFilesTypeSizeValidator extends FileTypeValidator {
  isValid(files: any): boolean {
    return (files as Express.Multer.File[]).every(f => super.isValid(f));
  }
}
