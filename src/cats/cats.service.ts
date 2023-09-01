import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly  breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {

    const breed = await this.validateBreed(createCatDto.breed)
    //const cat = this.catRepository.create(createCatDto);
    //return await this.catRepository.save(createCatDto); //
    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });
  }

  async findAll(user: UserActiveInterface) {

    if(user.role === Role.ADMIN) {
      return await this.catRepository.find()
    }

    return await this.catRepository.find({
      where: {userEmail: user.email}
    });
  }

  async findOne(id: number, user: UserActiveInterface) {

    const cat = await this.catRepository.findOneBy({id});

    if(!cat) throw new BadRequestException('Cat not found');

    //if(user.role !== Role.ADMIN && cat.userEmail !== user.email) throw new UnauthorizedException();
    this.validateOwnership(cat, user)
    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterface) {
    //return await this.catRepository.update(id, updateCatDto);

    await this.findOne(id, user);

    return await this.catRepository.update({id},{
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email,
    })
    return
  }

  async remove(id: number, user: UserActiveInterface) {
    
    await this.findOne(id, user);

    return await this.catRepository.softDelete({id}); // se le pasa id 
    // return await this.catRepository.softRemove({id}); // se le pasa la instancia
  }

  private validateOwnership(cat: Cat, user: UserActiveInterface) {
    if(user.role !== Role.ADMIN && cat.userEmail !== user.email) throw new UnauthorizedException();
  }

  private async validateBreed(breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({name: breed});

    if (!breedEntity) {
      throw new BadRequestException('Breed not found')
    }

    return breedEntity;
  }
}
