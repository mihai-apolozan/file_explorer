import type { FileEntry } from "../types";
import { FileListItem } from "./FileListItem";

interface Props {
    entries: FileEntry[];
    loading: boolean;
    error: string | null;
    onNavigate: (path: string) => void;
    onFileClick: (path: string) => void;
}

export function FileList({entries, loading, error, onNavigate, onFileClick}: Props) {
    if(loading) return <p>Loading...</p>;
    if(error) return <p style = {{color: 'red'}}>{error}</p>;
    if(entries.length === 0) return <p>Empty directory</p>;

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
                </tr>
            </thead>
            <tbody>
                {sorted.map((entry) => {
                    return <FileListItem
                    key = {entry.path}
                    entry = {entry}
                    onNavigate={onNavigate}
                    onFileClick={onFileClick}
                    />
                })}
            </tbody>
        </table>
    );
}