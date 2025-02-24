import { Injectable } from '@nestjs/common';
import { UpdateScaleDto } from './dto/update-scale.dto';

@Injectable()
export class ScaleService {
  async create(data) {
    const idGroupScale = data.idGroupScale;

    return 'This action adds a new scale';
  }

  findAll() {
    return `This action returns all scale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scale`;
  }

  update(id: number, updateScaleDto: UpdateScaleDto) {
    return `This action updates a #${id} scale`;
  }

  remove(id: number) {
    return `This action removes a #${id} scale`;
  }
}
