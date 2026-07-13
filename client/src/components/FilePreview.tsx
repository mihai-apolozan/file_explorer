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


    if(loading) return (<div>Loading</div>);
    if(error) return (<div>{ error }</div>)
    return (
        <div >
            <button onClick={onClose} style={{padding: '8px 16px', fontSize: '16px', cursor: 'pointer', marginBottom: '12px'}}>Close</button>
            <pre>{content}</pre>
        </div>
    );
}