import type { Initiative } from '../../common/types.js';
import type { SharePointListMapper } from './sharepointClient.js';

type InitiativesListItem = {
  ID: string;
  Title: string;
  Description?: string;
  KPIId: string;
  Modified: string;
  Created: string;
};

export class InitiativesMapper implements SharePointListMapper<Initiative, InitiativesListItem> {
  readonly listName = 'Initiatives';

  toDomain(item: InitiativesListItem): Initiative {
    return {
      id: item.ID,
      name: item.Title,
      description: item.Description,
      kpiId: item.KPIId,
      createdAt: item.Created,
      updatedAt: item.Modified,
    };
  }

  toListItem(domain: Initiative): InitiativesListItem {
    return {
      ID: domain.id,
      Title: domain.name,
      Description: domain.description,
      KPIId: domain.kpiId,
      Created: domain.createdAt,
      Modified: domain.updatedAt,
    };
  }
}
