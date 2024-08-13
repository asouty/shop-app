import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from '../../model/person.entity';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly repository: Repository<PersonEntity>,
  ) {}

  public async getByEmail(email: string) {
    const persons = await this.findByEmail(email);
    if (persons.length == 0) {
      throw new HttpException('missing profil for ' + email, 400);
    }
    return persons[0];
  }
  public async add(person: PersonEntity) {
    const existedPersons = await this.findByEmail(person.email);
    if (existedPersons.length > 0) {
      throw new HttpException(
        'email already linked to an account please, please log in',
        400,
      );
    }
    return await this.save(this.repository.create(person));
  }

  public async findByEmail(email: string) {
    return await this.repository.findBy({ email: email });
  }

  public async update(authenticatedUser: PersonEntity, person: PersonEntity) {
    if (authenticatedUser.id == person.id) {
      await this.repository.save(person);
    }
  }

  public async loadUser(user: PersonEntity, relations: string[]) {
    const persons = await this.repository.find({
      where: {
        email: user.email,
      },
      relations: relations,
    });
    if (persons.length == 0) {
      throw new HttpException('missing profil for ' + user.email, 400);
    }
    return persons[0];
  }

  public async save(person: PersonEntity) {
    return await this.repository.save(person);
  }
}
