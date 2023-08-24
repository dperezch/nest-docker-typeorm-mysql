import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly  breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto) {

    const breed = await this.breedRepository.findOneBy({name: createCatDto.breed});

    if (!breed) {
      throw new BadRequestException('Breed not found')
    }
    //const cat = this.catRepository.create(createCatDto);
    //return await this.catRepository.save(createCatDto); //
    return await this.catRepository.save({
      ...createCatDto,
      breed,
    });
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findOne(id: number) {
    return await this.catRepository.findOneBy({id});
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    //return await this.catRepository.update(id, updateCatDto);
    return
  }

  async remove(id: number) {
    return await this.catRepository.softDelete({id}); // se le pasa id 
    // return await this.catRepository.softRemove({id}); // se le pasa la instancia
  }
}
