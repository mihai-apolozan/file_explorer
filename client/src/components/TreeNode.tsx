import { useState } from "react";
import { listDirectory } from "../api/files";
import type { FileEntry } from "../types";

interface Props {
    entry: FileEntry;
    depth: number;
    currentPath: string;
    onNavigate: (path:string) => void;
    onClose: () => void;
}

export function TreeNode( { entry, depth, currentPath, onNavigate, onClose }: Props) {
    const isdir = entry.type === 'directory';
    const [open, setOpen] = useState(false);
    const [kids, setKids] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [opened, setOpened] = useState(false);
    const highlight = currentPath === entry.path;
    async function fetchKids(path: string) {
            setLoading(true);
            setError(null);
            try {
                const data = await listDirectory(path);
                setKids(data.entries);
            }
            catch {
                setError('Failed to load directory');
            }
            finally {
                setLoading(false);
            }
        }


    if(loading) return <p>Loading...</p>;
    if(error) return <p style = {{color: 'red'}}>{error}</p>;
    if(!isdir) return;
    return (
        <div style = {{paddingLeft: depth * 16 + 'px'}}onClick = { (e:React.MouseEvent) => {
            onClose();
            onNavigate(entry.path);
            e.stopPropagation();
            if(!opened) {
                fetchKids(entry.path);
                setOpened(true);
                setOpen(true);
            }
            else
            {
                setOpen(!open);
            }
        } }>
            <div style = {highlight ? { backgroundColor: '#e6f2ff', fontWeight: 'bold' , cursor: 'pointer'} : {cursor: 'pointer'}}>
                {isdir ? '📁' : '📄'} {entry.name}
            </div>
            {open && isdir && (<ul style = {{listStyle:'none', padding: 0, margin: 0}}>
                {
                    kids.map((kid) => {
                            if (kid.type === 'file') return;
                            return (
                                <li key = {kid.path}>
                                    <TreeNode
                                    entry = {kid}
                                    depth = {depth + 1}
                                    currentPath = {currentPath}
                                    onNavigate = {onNavigate}
                                    onClose={onClose}/>
                                </li>
                            );
                        })
                }
            </ul>)}
        </div>
    )
}