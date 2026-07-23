import type { FileEntry } from "../types";
import { FileListItem } from "./FileListItem";
import { createEntry } from "../api/files";
import { FilePlus, FolderPlus } from "lucide-react";


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
    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}<button onClick={onRefresh}>Try again</button></div>;
    const empty = entries.length === 0;

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
                        const name = prompt("Folder name:"); if (name) { try { await createEntry(currentPath + '/' + name, 'directory'); onRefresh(); } catch (e: any) { alert("Failed to create folder: " + e.message); }}
                        }
                    }><FolderPlus size={16}/></button></th>
                    <th><button onClick={async () => {
                        const name = prompt("File name:"); if (name) { try { await createEntry(currentPath + '/' + name, 'file'); onRefresh(); } catch (e: any) { alert("Failed to create file: " + e.message); }}
                        }
                    }><FilePlus size={16}/></button></th>
                </tr>
            </thead>
            <tbody>
                { empty && <tr className = 'empty'><td colSpan={5}>Empty directory</td></tr>}
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