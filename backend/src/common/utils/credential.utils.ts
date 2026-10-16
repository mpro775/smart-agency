import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

export function credentialError(code: string, message: string): never {
  throw new BadRequestException({ code, message });
}
export function credentialNotFound(code: string, message: string): never {
  throw new NotFoundException({ code, message });
}
export function objectId(id: string, code: string): Types.ObjectId {
  if (!/^[a-f0-9]{24}$/i.test(id)) credentialNotFound(code, 'Record not found');
  return new Types.ObjectId(id);
}
export function literalSearch(search: string): RegExp {
  return new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}
