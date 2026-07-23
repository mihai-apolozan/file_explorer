//import type { FileContent } from "../types";
import { readFile } from "../api/files";
import { useEffect, useState } from "react";
import type { FileEntry } from "../types";

interface Props {
    entry: FileEntry;
    onClose: () => void;
}

export function FilePreview({ entry, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');
    const isImage = entry.mimeType?.startsWith('image/');
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
        if(entry.mimeType?.startsWith('text/')) {fetchFile(entry.path);}
        
    },[entry.path])


    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}</div>;
    if(isImage) return (
        <div >
            <button onClick={onClose} className="preview-close">Close</button>
            <img src = {`http://localhost:8000/api/files/raw?path=${entry.path}`}/>
        </div>
    )
    return (
        <div >
            <button onClick={onClose} className="preview-close">Close</button>
            <pre>{content}</pre>
        </div>
    );
}