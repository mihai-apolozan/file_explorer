import { api } from './client';
import type { DirectoryListing, FileContent, FileEntry } from '../types';


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


export async function createEntry(
    path: string,
    type: string,
): Promise<FileEntry> {
    const response = await api.post<FileEntry>('/files/create', {path, type});
    return response.data;
}

export async function renameEntry(
    path: string,
    newName: string
): Promise<FileEntry> {
    const response = await api.patch<FileEntry>('/files/rename', {path, newName});
    return response.data;
}

export async function deleteEntry(
    path:string
): Promise<string> {
    const response = await api.delete<string>('/files/delete', {
        params: {path},
    });
    return response.data;
}

export async function searchServer(
    q:string,
    path:string
): Promise<FileEntry[]> {
    const response = await api.get<FileEntry[]>('/files/search', {
        params: { q, path},
    });
    return response.data;
}