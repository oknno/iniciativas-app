export interface Initiative {
  id: string;
  name: string;
  description?: string;
  kpiId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeComponent {
  id: string;
  initiativeId: string;
  componentCode: string;
  value: number;
  unit: string;
  createdAt: string;
}

export interface Kpi {
  id: string;
  code: string;
  name: string;
  formulaId: string;
}

export interface Conversion {
  id: string;
  fromUnit: string;
  toUnit: string;
  factor: number;
}

export interface Formula {
  id: string;
  code: string;
  expression: string;
}

export interface CalculationResult {
  id: string;
  initiativeId: string;
  result: number;
  unit: string;
  inputs: Array<{ componentCode: string; value: number; unit: string }>;
  calculatedAt: string;
}
