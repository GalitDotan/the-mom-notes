import { createEntityStore } from '@/lib/localStorageStore';
import type { DashboardShareRecord } from './types';

export const DashboardShare = createEntityStore<DashboardShareRecord>('dashboard_shares');
export default DashboardShare;
