import { UserEntity } from '../entities/user.entity';

export interface UsersRepository {
  create(data: { name: string; email: string }): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
}
