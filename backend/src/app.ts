import { randomUUID } from 'node:crypto';
import express from 'express';
import { FunctionalError, NotFoundError } from './common/errors.js';
import type { Initiative, InitiativeComponent } from './common/types.js';
import { CalculationService } from './calculation/calculation.service.js';
import { ConversionRepository } from './conversions/conversion.repository.js';
import { FormulaRepository } from './formulas/formula.repository.js';
import { InitiativeComponentRepository } from './initiative-components/initiativeComponent.repository.js';
import { InitiativeRepository } from './initiatives/initiative.repository.js';
import { KpiRepository } from './kpis/kpi.repository.js';
import { CalculationResultRepository } from './results/calculationResult.repository.js';

const initiativeRepository = new InitiativeRepository();
const componentRepository = new InitiativeComponentRepository();
const resultRepository = new CalculationResultRepository();
const calculationService = new CalculationService(
  new KpiRepository(),
  new FormulaRepository(),
  new ConversionRepository(),
  resultRepository,
);

export const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/initiatives', (_req, res) => {
  res.json(initiativeRepository.findAll());
});

app.post('/initiatives', (req, res, next) => {
  try {
    const payload = req.body as Pick<Initiative, 'name' | 'description' | 'kpiId'>;
    if (!payload?.name || !payload?.kpiId) {
      throw new FunctionalError('Campos obrigatórios: name e kpiId.', 'VALIDATION_ERROR', 422);
    }

    const now = new Date().toISOString();
    const initiative: Initiative = {
      id: randomUUID(),
      name: payload.name,
      description: payload.description,
      kpiId: payload.kpiId,
      createdAt: now,
      updatedAt: now,
    };

    res.status(201).json(initiativeRepository.save(initiative));
  } catch (error) {
    next(error);
  }
});

app.put('/initiatives/:id', (req, res, next) => {
  try {
    const existing = initiativeRepository.findById(req.params.id);
    if (!existing) {
      throw new NotFoundError('Iniciativa', req.params.id);
    }

    const payload = req.body as Partial<Pick<Initiative, 'name' | 'description' | 'kpiId'>>;
    const updated: Initiative = {
      ...existing,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    res.json(initiativeRepository.save(updated));
  } catch (error) {
    next(error);
  }
});

app.delete('/initiatives/:id', (req, res, next) => {
  try {
    const deleted = initiativeRepository.delete(req.params.id);
    if (!deleted) {
      throw new NotFoundError('Iniciativa', req.params.id);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/initiatives/:id/components', (req, res, next) => {
  try {
    const initiative = initiativeRepository.findById(req.params.id);
    if (!initiative) {
      throw new NotFoundError('Iniciativa', req.params.id);
    }

    res.json(componentRepository.findByInitiativeId(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post('/initiatives/:id/components', (req, res, next) => {
  try {
    const initiative = initiativeRepository.findById(req.params.id);
    if (!initiative) {
      throw new NotFoundError('Iniciativa', req.params.id);
    }

    const payload = req.body as Pick<InitiativeComponent, 'componentCode' | 'value' | 'unit'>;
    if (!payload?.componentCode || payload.value === undefined || !payload.unit) {
      throw new FunctionalError(
        'Campos obrigatórios: componentCode, value e unit.',
        'VALIDATION_ERROR',
        422,
      );
    }

    const component: InitiativeComponent = {
      id: randomUUID(),
      initiativeId: req.params.id,
      componentCode: payload.componentCode,
      value: payload.value,
      unit: payload.unit.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(componentRepository.save(component));
  } catch (error) {
    next(error);
  }
});

app.delete('/initiatives/:id/components/:componentId', (req, res, next) => {
  try {
    const deleted = componentRepository.deleteByIdAndInitiative(req.params.componentId, req.params.id);
    if (!deleted) {
      throw new NotFoundError('Componente da iniciativa', req.params.componentId);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/initiatives/:id/calculate', (req, res, next) => {
  try {
    const initiative = initiativeRepository.findById(req.params.id);
    if (!initiative) {
      throw new NotFoundError('Iniciativa', req.params.id);
    }

    const components = componentRepository.findByInitiativeId(req.params.id);
    if (components.length === 0) {
      throw new FunctionalError('A iniciativa não possui componentes para cálculo.', 'NO_COMPONENTS', 422);
    }

    const result = calculationService.calculate(initiative, components);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/initiatives/:id/results', (req, res, next) => {
  try {
    const initiative = initiativeRepository.findById(req.params.id);
    if (!initiative) {
      throw new NotFoundError('Iniciativa', req.params.id);
    }

    res.json(resultRepository.findByInitiativeId(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response) => {
  if (error instanceof FunctionalError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro inesperado no backend.',
    },
  });
});
