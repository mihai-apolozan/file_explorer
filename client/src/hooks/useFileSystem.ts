import { useState, useEffect, useCallback } from "react";
import { listDirectory } from "../api/files";
import type { FileEntry } from "../types";

export function useFileSystem() {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>(['/']);
    const currentPath = history[history.length -1 ];

    const fetchDirectory = useCallback(
        async (path: string) => {
            setLoading(true);
            setError(null);
            try {
                const data = await listDirectory(path);
                setEntries(data.entries);
            }
            catch {
                setError('Failed to load directory');
            }
            finally {
                setLoading(false);
            }
        },[]
    )

    
    const popHistory = () => {
        if(history.length>1)
            {setHistory(prev => prev.slice(0,-1));}
    }


    useEffect(() => {
        fetchDirectory(currentPath);
    }, [currentPath, fetchDirectory]);

    const navigate = useCallback(
        (path:string) => {setHistory(prev => [...prev, path]);}, []
    );

    const refresh = useCallback(
        () => fetchDirectory(currentPath),
        [currentPath, fetchDirectory]
    );

    const goBack = () => {
        popHistory();
    };
    return { currentPath, entries, loading, error, navigate, refresh, goBack };
}