import type { FileEntry } from "../types";
import { FileListItem } from "./FileListItem";
import { createEntry } from "../api/files";


interface Props {
    currentPath: string;
    entries: FileEntry[];
    loading: boolean;
    error: string | null;
    onNavigate: (path: string) => void;
    onFileClick: (path: string) => void;
    onRightClick: (entry: FileEntry, x: number, y: number) => void;
    onRefresh: () => void;
    searchMode: boolean;
}

export function FileList({currentPath, entries, loading, error, onNavigate, onFileClick, onRightClick, onRefresh, searchMode}: Props) {
    if(loading) return <p>Loading...</p>;
    if(error) return <p style = {{color: 'red'}}>{error}</p>;
    //if(entries.length === 0) return <p>Empty directory</p>;

    const sorted = [...entries].sort((a,b) => {
        if(a.type !== b.type)
            return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Modified</th>
                    <th><button onClick={async () => {
                        const name = prompt(); if (name) {await createEntry(currentPath + '/' + name, 'directory'); onRefresh()};
                        }
                    }>📁➕</button></th>
                    <th><button onClick={async () => {
                        const name = prompt(); if (name) {await createEntry(currentPath + '/' + name, 'file'); onRefresh()};
                        }
                    }>📄➕</button></th>
                </tr>
            </thead>
            <tbody>
                {sorted.map((entry) => {
                    return <FileListItem
                    key = {entry.path}
                    entry = {entry}
                    onNavigate={onNavigate}
                    onFileClick={onFileClick}
                    onRightClick={onRightClick}
                    searchMode={searchMode}
                    />
                })}
            </tbody>
        </table>
    );
}