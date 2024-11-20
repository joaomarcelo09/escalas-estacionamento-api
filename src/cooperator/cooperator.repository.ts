import { CreateCooperatorDto } from "./dto/create-cooperator-dto";

export abstract class CooperatorRepository {
  abstract create(data: CreateCooperatorDto);
  abstract delete(id: string);
  abstract findAll();
}
