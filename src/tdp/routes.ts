// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { createMemoryRouter } from 'react-router';
import Root from './components/Root';
import Screener from './components/Screener';
import DecisionSummary from './components/DecisionSummary';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ImportAIAnalysis from './components/ImportAIAnalysis';
import ImportReviewTable from './components/ImportReviewTable';

// In-memory router: TDP is embedded as a native island under the Next /tdp-view
// route, so its routing stays internal and never touches the browser URL.
export const router = createMemoryRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Screener },
      { path: 'decisions', Component: DecisionSummary },
    ],
  },
  { path: '/analytics', Component: AnalyticsDashboard },
  { path: '/import', Component: ImportAIAnalysis },
  { path: '/import-review', Component: ImportReviewTable },
]);
