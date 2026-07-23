import { listDirectory } from "../api/files";
import type { FileEntry } from "../types";
import { TreeNode } from "./TreeNode";
import { useState, useEffect } from "react";

interface Props {
    currentPath: string;
    onNavigate: (path:string) => void;
    onClose: () => void;
    token: number;
}

export function FolderTree({ currentPath, onNavigate, onClose, token }: Props) {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchRoot() {
        setLoading(true);
        setError(null);
        try {
            const data = await listDirectory('/');
            setEntries(data.entries);
        }
        catch {
            setError('Failed to load directory');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(
        () => {
            fetchRoot();
            }
    ,[token]);

    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}<button onClick={fetchRoot}>Try again</button></div>;
    return (
        <ul className="tree-list">
            {entries.map((entry) => {
                if(entry.type === 'file') return;
                return (
                    <li
                    key = {entry.path}>                    
                        <TreeNode
                        entry = {entry}
                        depth = {0}
                        currentPath = {currentPath}
                        onNavigate = {onNavigate}
                        onClose={onClose}/>
                    </li>
                )
            })}
        </ul>
    );
}