import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';

type findParams = {
  where?: {
    id: string;
    email: string;
    name: string;
  };
};

export abstract class UserRepository {
  abstract create(user: CreateUserDto);
  abstract findOne({ where }: findParams);
  abstract update(user);
}
