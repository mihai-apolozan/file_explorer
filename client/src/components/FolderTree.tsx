import { listDirectory } from "../api/files";
import type { FileEntry } from "../types";
import { TreeNode } from "./TreeNode";
import { useState, useEffect } from "react";

interface Props {
    currentPath: string;
    onNavigate: (path:string) => void;
    onClose: () => void;
}

export function FolderTree({ currentPath, onNavigate, onClose }: Props) {
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
    ,[]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p style = {{color: 'red'}}>{error}</p>;
    return (
        <ul style = {{listStyle: 'none', border: '0px', padding:'0px'}}>
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