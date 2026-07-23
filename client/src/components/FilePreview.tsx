//import type { FileContent } from "../types";
import { readFile } from "../api/files";
import { useEffect, useState } from "react";

interface Props {
    path: string;
    onClose: () => void;
}

export function FilePreview({ path, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');
    
    useEffect(() => {
        async function fetchFile(path: string) {
            try {
                setLoading(true);
                const data = await readFile(path);
                setContent(data.content);
            }
            catch {
                setError('cannot open file');
            }
            finally {
                setLoading(false);
            }
        }
        fetchFile(path);
    },[path])


    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}</div>;
    return (
        <div >
            <button onClick={onClose} className="preview-close">Close</button>
            <pre>{content}</pre>
        </div>
    );
}