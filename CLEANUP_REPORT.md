# Cleanup Report

## Removed
- Legacy mock artifacts under `src/app/pages/InitiativesPage/mocks/` that were no longer imported or referenced by the SharePoint flow.
- Unused UI component: `src/app/pages/InitiativesPage/components/InitiativeMetricsPanel.tsx`.
- Unused DTO/type aliases and domain entities not participating in current execution paths:
  - `src/application/dto/calculation/CalculationDetailDto.ts`
  - `src/domain/initiatives/entities/InitiativeStage.ts`
  - `src/domain/values/entities/ComponentValue.ts`
  - `src/domain/values/entities/KpiValue.ts`
  - `src/types/api.ts`, `src/types/common.ts`, `src/types/ui.ts`
- Unused domain constants and error subclasses with no references:
  - `src/domain/shared/constants/stages.ts`
  - `src/domain/shared/constants/statuses.ts`
  - `src/domain/shared/errors/ValidationError.ts`
  - `src/domain/shared/errors/ConfigurationError.ts`
  - `src/domain/shared/errors/CalculationError.ts`
- Unused calculation helper: `src/domain/calculation/engine/FormulaResolver.ts`.
- Unused template leftovers: `src/App.css`, `src/assets/react.svg`.

## Simplified
- `package.json` build script simplified to remove obsolete manifest copy step that referenced a non-existent file.
- Removed `cpy-cli` from `devDependencies` (no longer needed after build script cleanup).

## Intentionally Kept
- SharePoint list APIs/repositories and adapters, including compatibility logic and lookup handling, were retained because they are part of the active production path.
- Wizard composition, initiative value mappers, and calculation engine were retained as they are in active use through current page and modal flows.

## Suspicious but Not Safely Removable
- `react-refresh/only-export-components` warning in `ToastProvider.tsx` indicates a file-level structure smell, but changing it would be a structural refactor rather than pure cleanup.
- Some SharePoint API fallbacks may look redundant; they were not removed without endpoint-level validation to avoid integration regressions.
