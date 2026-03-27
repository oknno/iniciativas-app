# Backend de iniciativas

Estrutura inicial criada com módulos:

- `initiatives`
- `initiative-components`
- `kpis`
- `conversions`
- `formulas`
- `calculation`
- `results`
- `infrastructure/sharepoint`

## Contratos REST iniciais

- `GET /initiatives`
- `POST /initiatives`
- `PUT /initiatives/:id`
- `DELETE /initiatives/:id`
- `GET /initiatives/:id/components`
- `POST /initiatives/:id/components`
- `DELETE /initiatives/:id/components/:componentId`
- `POST /initiatives/:id/calculate`
- `GET /initiatives/:id/results`

## Erros funcionais

Os erros de regra de negócio retornam:

```json
{
  "error": {
    "code": "MISSING_CONVERSION",
    "message": "Conversão ausente para x -> y.",
    "details": {}
  }
}
```

Status HTTP:

- `422`: validação/regra de negócio
- `404`: entidade não encontrada

## Persistência de cálculo

O resultado do cálculo é persistido no repositório `CalculationResultRepository` (equivalente ao conceito `Calculation_Result`).
