import { api } from './client';
import type { FileEntry } from '../types';

export interface IndexResult {
    files: number;
    chunks: number;
}

export interface SemanticResult {
    entry: FileEntry;
    distances: number;
    documents: string;
}

export async function indexDirectory(path: string): Promise<IndexResult> {
    const response = await api.post<IndexResult>('/rag/index', null, {
        params: { path },
    });
    return response.data;
}

export async function semanticSearch(q: string, n: number = 5): Promise<SemanticResult[]> {
    const response = await api.get<SemanticResult[]>('/rag/search', {
        params: { q, n },
    });
    return response.data;
}
