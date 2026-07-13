import { api } from './client';
import type { DirectoryListing, FileContent } from '../types';

export async function listDirectory(
    path: string
): Promise<DirectoryListing> {
    const response = await api.get<DirectoryListing>('/files', {
        params: { path },
    });
    return response.data;
}

export async function readFile(
    path: string
): Promise<FileContent> {
    const response = await api.get<FileContent>('/files/read', {
        params: { path },
    });
    return response.data;
}