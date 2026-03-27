import type { Initiative } from '../common/types.js';

export class InitiativeRepository {
  private readonly initiatives = new Map<string, Initiative>();

  findAll(): Initiative[] {
    return [...this.initiatives.values()];
  }

  findById(id: string): Initiative | undefined {
    return this.initiatives.get(id);
  }

  save(initiative: Initiative): Initiative {
    this.initiatives.set(initiative.id, initiative);
    return initiative;
  }

  delete(id: string): boolean {
    return this.initiatives.delete(id);
  }
}
