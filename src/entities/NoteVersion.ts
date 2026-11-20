import { createEntityStore } from '@/lib/localStorageStore';
import type { NoteVersionRecord } from './types';

export const NoteVersion = createEntityStore<NoteVersionRecord>('note_versions');
export default NoteVersion;
