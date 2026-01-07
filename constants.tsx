import React from 'react';
import { AnalysisRow } from './types';

export const ANALYSIS_DATA: AnalysisRow[] = [
  {
    path: 'AFBPlaySolution/Entities/',
    type: 'Data Models (Source of Truth)',
    insight: 'Identified core C# class definitions (e.g., afbGameProvider, afbBankView). Contains strict type definitions and nullable fields.',
    actionability: 'High',
    outcome: 'Can be auto-converted to TypeScript Interfaces (.d.ts) to prevent Type Errors.'
  },
  {
    path: 'AFBPlaySolution/AFBPlayGameAPI/',
    type: 'API Contract Source',
    insight: 'Detected Controller classes handling HTTP endpoints. Analyzed return types and request parameters.',
    actionability: 'High',
    outcome: 'Can be used to auto-generate Swagger docs and Mock JSON Data for zero-wait development.'
  },
  {
    path: 'AFBPlaySolution/BusinessComponent/',
    type: 'Business Logic Layer',
    insight: 'Contains complex rules for CMS display (ShowCMSBC.cs). Hard-coded logic detected.',
    actionability: 'Medium',
    outcome: 'AI can extract logic explanations to help Frontend devs understand hidden rules.'
  },
  {
    path: 'AFBPlaySolution/Repository/',
    type: 'Data Access Layer',
    insight: 'Handles direct database interactions and validation rules.',
    actionability: 'Low',
    outcome: 'Internal Backend use only (Ignored by Frontend pipeline).'
  },
  {
    path: 'AFBPlaySolution/AFBPlay.sln',
    type: 'Solution Configuration',
    insight: 'Root entry point. Successfully mapped the dependency graph between API, Entities, and Business Logic.',
    actionability: 'N/A',
    outcome: 'Used by AI to understand project context.'
  }
];