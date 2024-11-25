import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateSlugPipe implements PipeTransform {
  transform(value: string) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      throw new BadRequestException('Invalid slug format');
    }
    return value;
  }
}
