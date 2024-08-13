import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { PersonService } from './person.service';
import { PersonEntity } from '../../model/person.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard, Public } from '../../auth.guard';
import { AccessToken } from '../../model/accessToken';
import { ItemEntity } from '../../model/item.entity';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Controller('person')
@ApiBearerAuth()
export class PersonController {
  private inMemoryCartBySessionId = new Map<string, PersonEntity>();
  constructor(
    private readonly service: PersonService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @ApiCreatedResponse({ type: PersonEntity })
  public async getAuthenticatedUser(@Req() request: Request) {
    return this.service.loadUser(this.getUserFromAuthentication(request), [
      'addresses',
    ]);
  }
  @Put()
  public async update(@Req() request: Request, @Body() person: PersonEntity) {
    await this.service.update(this.getUserFromAuthentication(request), person);
  }
  @Public()
  @Post()
  @ApiCreatedResponse({ type: PersonEntity })
  public async add(@Body() person: PersonEntity) {
    return this.service.add(person);
  }

  @Public()
  @HttpCode(200)
  @Post('authenticate')
  public async authenticate(@Body() person: PersonEntity) {
    const personToAuthenticate: PersonEntity[] = await this.service.findByEmail(
      person.email,
    );
    if (
      personToAuthenticate.length == 0 ||
      personToAuthenticate[0].password !== person.password
    ) {
      throw new UnauthorizedException();
    }
    const payload = { sub: person.id, person: personToAuthenticate[0] };
    return new AccessToken(await this.jwtService.signAsync(payload));
  }

  @Get('cart')
  @ApiCreatedResponse({ type: PersonEntity })
  @Public()
  public async getCart(
    @Req() request: Request,
    @Session() session: Record<string, any>,
  ) {
    return this.getPersonWithCart(request, session);
  }

  @Put('cart')
  @Public()
  public async addItem(
    @Req() request: Request,
    @Session() session: Record<string, any>,
    @Body() item: ItemEntity,
  ) {
    const person = await this.getPersonWithCart(request, session);
    person.cartItems.push(item);
    if (person.isStoredInDatabase()) {
      await this.service.save(person);
    }
  }

  private async getPersonWithCart(
    request: Request,
    session: Record<string, any>,
  ) {
    if (AuthGuard.isNotAuthenticated(request) && session['cartId']) {
      return this.inMemoryCartBySessionId.get(session['cartId']);
    }
    const person = await this.service.loadUser(
      this.getUserFromAuthentication(request),
      ['cartItems'],
    );
    if (!person.isStoredInDatabase()) {
      session['cartId'] = uuidv4().toString();
      this.inMemoryCartBySessionId.set(session['cartId'], person);
    }
    return person;
  }

  private getUserFromAuthentication(request: Request): PersonEntity {
    if (!request.headers.authorization) {
      const person = new PersonEntity();
      person.cartItems = [];
      return person;
    }
    const decode = this.jwtService.decode(
      AuthGuard.extractTokenFromHeader(request),
    );
    return decode.person;
  }
}
