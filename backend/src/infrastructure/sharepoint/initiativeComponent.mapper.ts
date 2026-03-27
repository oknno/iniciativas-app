import type { InitiativeComponent } from '../../common/types.js';
import type { SharePointListMapper } from './sharepointClient.js';

type InitiativeComponentListItem = {
  ID: string;
  InitiativeId: string;
  ComponentCode: string;
  Value: number;
  Unit: string;
  Created: string;
};

export class InitiativeComponentMapper
  implements SharePointListMapper<InitiativeComponent, InitiativeComponentListItem>
{
  readonly listName = 'Initiative_Component';

  toDomain(item: InitiativeComponentListItem): InitiativeComponent {
    return {
      id: item.ID,
      initiativeId: item.InitiativeId,
      componentCode: item.ComponentCode,
      value: item.Value,
      unit: item.Unit,
      createdAt: item.Created,
    };
  }

  toListItem(domain: InitiativeComponent): InitiativeComponentListItem {
    return {
      ID: domain.id,
      InitiativeId: domain.initiativeId,
      ComponentCode: domain.componentCode,
      Value: domain.value,
      Unit: domain.unit,
      Created: domain.createdAt,
    };
  }
}
