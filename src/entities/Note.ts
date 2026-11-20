import { createEntityStore } from '@/lib/localStorageStore';
import type { NoteRecord } from './types';

export const Note = createEntityStore<NoteRecord>('notes');
export default Note;
