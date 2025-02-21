import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { MoreThan } from 'typeorm';
import { Token, TokenType } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async generateToken(
    email: string,
    name: string,
    type: TokenType,
    entity?: any,
    validityHours: number = 48,
  ): Promise<Token> {
    const token = crypto.randomBytes(20).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + validityHours);

    const tokenEntity = this.tokenRepository.create({
      token,
      email,
      name,
      type,
      expiryDate,
      ...(type === TokenType.CANDIDATE
        ? { candidate: entity }
        : { employee: entity }),
    });

    await this.tokenRepository.save(tokenEntity);
    return tokenEntity;
  }

  async findValidToken(token: string): Promise<Token> {
    return this.tokenRepository.findOne({
      where: {
        token,
        expiryDate: MoreThan(new Date()),
      },
      relations: ['candidate', 'employee'],
    });
  }

  async deleteToken(token: string): Promise<void> {
    await this.tokenRepository.delete({ token });
  }
}
