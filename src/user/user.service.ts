import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    return await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: number) {
    const userExist = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
