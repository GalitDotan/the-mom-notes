import { createEntityStore } from '@/lib/localStorageStore';
import type { NoteShareRecord } from './types';

export const Share = createEntityStore<NoteShareRecord>('shares');
export default Share;
