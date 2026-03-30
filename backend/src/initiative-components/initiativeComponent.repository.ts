import type { InitiativeComponent } from '../common/types.js';

export class InitiativeComponentRepository {
  private readonly components = new Map<string, InitiativeComponent>();

  findByInitiativeId(initiativeId: string): InitiativeComponent[] {
    return [...this.components.values()].filter((component) => component.initiativeId === initiativeId);
  }

  save(component: InitiativeComponent): InitiativeComponent {
    this.components.set(component.id, component);
    return component;
  }

  deleteByIdAndInitiative(id: string, initiativeId: string): boolean {
    const component = this.components.get(id);
    if (!component || component.initiativeId !== initiativeId) {
      return false;
    }

    return this.components.delete(id);
  }
}
