import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
  constructor(token: string) {
    this.token = token;
  }

  @ApiProperty()
  token: string;
}
