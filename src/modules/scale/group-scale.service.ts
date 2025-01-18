import { Injectable } from '@nestjs/common';
import { getWednesdaysAndSundaysInMonth } from './utils/getDaysOfMonth';

@Injectable()
export class GroupScaleService {
  create() {
    const date = new Date();
    const days = getWednesdaysAndSundaysInMonth(date);
  }

  findAll() {
    return `This action returns all groupScale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupScale`;
  }

  update(id: number, updateGroupScaleDto) {
    return `This action updates a #${id} groupScale`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupScale`;
  }
}
