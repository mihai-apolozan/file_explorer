//import type { FileContent } from "../types";
import { readFile, writeFile } from "../api/files";
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
    const [editing, setEditing] = useState(false);
    const [feedback, setFeedback] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [savedContent, setSavedContent] = useState(content);
    const isDirty = content !== savedContent;
    useEffect(() => {
        async function fetchFile(path: string) {
            try {
                setLoading(true);
                const data = await readFile(path);
                setContent(data.content);
                setSavedContent(data.content);
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                setFeedback('saving');
                writeFile(entry.path, content)
                .then(() => {
                    setFeedback('saved');
                    setTimeout(() => setFeedback('idle'), 2000);
                    setSavedContent(content);
                })
                .catch(() => setFeedback('error'));
            }    
        }
        addEventListener('keydown', handleKeyDown);
        return () => {
            removeEventListener('keydown', handleKeyDown);
        }
    }, [content, entry.path])



    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}</div>;
    if(isImage) return (
        <div >
            <button onClick={onClose} className="preview-close">Close</button>
            <img src = {`http://localhost:8000/api/files/raw?path=${entry.path}`} style={{maxWidth: '100%'}}/>
        </div>
    )


    if(isText) {
        return (
            <div>
                <button onClick={() => {if(!isDirty || window.confirm('Unsaved changes! Proceed?')) onClose();}}
                className="preview-close">Close</button>
                <button onClick={() => setEditing(!editing)} className="preview-edit">{editing ? 'Preview' : 'Edit'}</button>
                {feedback !== 'idle' && <span className="save-feedback">{feedback === 'saving' ? 'Saving...' : feedback === 'saved' ? 'Saved!' : 'Error saving'}</span>}
                {editing
                    ? <textarea value={content} onChange={(e) => setContent(e.target.value)} className="editor-textarea" />
                    : isMD
                        ? <div dangerouslySetInnerHTML={{ __html: md }}></div>
                        : <pre><code dangerouslySetInnerHTML={{ __html: highlighted }}/></pre>
                }
                {isDirty && <span className="dirty-indicator">Unsaved changes</span>}
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