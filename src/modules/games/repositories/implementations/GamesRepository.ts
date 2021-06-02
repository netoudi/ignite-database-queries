import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // Complete usando query builder
    return this.repository
      .createQueryBuilder('game')
      .where('game.title ILIKE :param', { param: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    // Complete usando raw query
    return this.repository.query(
      `SELECT count(*)
       FROM games`,
    );
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Complete usando query builder
    const games = await this.repository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.users', 'users')
      .where('game.id = :id', { id })
      .getMany();

    return games.reduce((acc, cur) => [...acc, ...cur.users], [] as User[]);
  }
}
