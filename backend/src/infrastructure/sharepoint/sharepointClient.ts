export interface SharePointListMapper<TDomain, TListItem> {
  readonly listName: string;
  toDomain(item: TListItem): TDomain;
  toListItem(domain: TDomain): TListItem;
}

export class SharePointGateway {
  constructor(private readonly baseUrl: string) {}

  async getItems<TDomain, TListItem>(
    mapper: SharePointListMapper<TDomain, TListItem>,
  ): Promise<TDomain[]> {
    void this.baseUrl;
    void mapper;
    return [];
  }
}
