export interface SelectOption<TValue extends string = string> {
  readonly label: string
  readonly value: TValue
}

export interface Paging {
  readonly page: number
  readonly pageSize: number
}

export interface DateRange {
  readonly from: string
  readonly to: string
}
