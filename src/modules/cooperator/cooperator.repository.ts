import { CreateCooperatorDto } from './dto/create-cooperator-dto';
import { UpdateCooperatorDto } from './dto/update-cooperator-dto';

export abstract class CooperatorRepository {
  abstract create(data: CreateCooperatorDto);
  abstract createPinnedException(data);
  abstract update(id: string, data: UpdateCooperatorDto);
  abstract delete(id: string);
  abstract findAll({where, include});
  abstract findOne({ where, include });
  abstract updatePinnedException(id: string, data);
  abstract deletePinnedException(id: string);
}
