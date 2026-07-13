import { useState, useEffect, useCallback } from "react";
import { listDirectory } from "../api/files";
import type { FileEntry } from "../types";

export function useFileSystem() {
    const [currentPath, setCurrentPath] = useState('/');
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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


    useEffect(() => {
        fetchDirectory(currentPath);
    }, [currentPath, fetchDirectory]);

    const navigate = useCallback(
        (path:string) => setCurrentPath(path), []
    );

    const refresh = useCallback(
        () => fetchDirectory(currentPath),
        [currentPath, fetchDirectory]
    );
    
    return { currentPath, entries, loading, error, navigate, refresh };
}