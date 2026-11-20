import { createEntityStore } from '@/lib/localStorageStore';
import type { DashboardRecord } from './types';

export const Dashboard = createEntityStore<DashboardRecord>('dashboards');
export default Dashboard;
