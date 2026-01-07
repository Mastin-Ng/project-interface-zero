import React from 'react';

export interface AnalysisRow {
  path: string;
  type: string;
  insight: string;
  actionability: 'High' | 'Medium' | 'Low' | 'N/A';
  outcome: string;
}

export interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  metric?: string;
  color: 'blue' | 'green' | 'cyan';
}

export enum Section {
  HERO = 'hero',
  PAIN = 'pain',
  SOLUTION = 'solution',
  ANALYSIS = 'analysis',
  IMPACT = 'impact',
  COMPARISON = 'comparison'
}