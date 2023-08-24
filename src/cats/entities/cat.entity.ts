import { Breed } from "src/breeds/entities/breed.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne } from "typeorm";

@Entity()
export class Cat {

    @Column({ primary: true , generated: true })
    //@PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne( ()=> Breed, (breed) => breed.id, {
        eager: true, //para que traiga las razas al hacer un findOne
    })
    breed: Breed;
}
