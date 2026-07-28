//import type { FileContent } from "../types";
import { readFile } from "../api/files";
import { useEffect, useState, useMemo } from "react";
import type { FileEntry } from "../types";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import { marked } from "marked";

interface Props {
    entry: FileEntry;
    onClose: () => void;
}

export function FilePreview({ entry, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');
    const isImage = entry.mimeType?.startsWith('image/');
    const isText = entry.mimeType?.startsWith('text/');
    const isMD = entry.name.endsWith('.md');

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

    const md = useMemo(() => {
        if(isText && isMD && content) return marked.parse(content);
        return '';
    }, [content, isText, isMD])
    const highlighted = useMemo(() => {
        if (isText && content) return hljs.highlightAuto(content).value;
        return '';
    }, [content, isText]);

    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}</div>;
    if(isImage) return (
        <div >
            <button onClick={onClose} className="preview-close">Close</button>
            <img src = {`http://localhost:8000/api/files/raw?path=${entry.path}`} style={{maxWidth: '100%'}}/>
        </div>
    )


    if(isMD) {
        return (
            <div>
                <button onClick={onClose} className="preview-close">Close</button>
                <pre>
                    <div dangerouslySetInnerHTML={{ __html: md }}></div>
                </pre>
            </div>
        )
    }

    if(isText) {
        return (
            <div >
                <button onClick={onClose} className="preview-close">Close</button>
                <pre>
                    <code dangerouslySetInnerHTML={{ __html: highlighted }}/>
                </pre>
            </div>
        );
    }
    return (
        <div>
            <button onClick={onClose} className="preview-close">Close</button>
            <div className="no-preview">No preview available</div>
        </div>
    )
}