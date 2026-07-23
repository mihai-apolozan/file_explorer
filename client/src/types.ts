export interface FileEntry {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size: number;
    modified: string;
    mimeType: string | null;
}

export interface DirectoryListing {
    path: string;
    entries: FileEntry[];
}

export interface FileContent {
    path: string;
    content: string;
}

