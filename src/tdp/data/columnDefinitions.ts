// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { Employee } from './mockEmployees';

export type ColumnKey = keyof Employee | 'competencyScore' | 'commitmentScore' | 'contributionScore' | 'aspectScore';

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  isCustom?: boolean;
  customType?: 'text' | 'numerical' | 'categorical';
  categories?: string[]; // For categorical columns
  cluster?: 'competency' | 'commitment' | 'contribution' | 'aspect' | 'custom'; // For custom columns
}
