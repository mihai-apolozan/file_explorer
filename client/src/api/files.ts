import { api } from './client';
import type { DirectoryListing } from '../types';

export async function listDirectory(
    path: string
): Promise<DirectoryListing> {
    const response = await api.get<DirectoryListing>('/files', {
        params: { path },
    });
    return response.data;
}