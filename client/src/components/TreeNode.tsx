import { useState } from "react";
import { listDirectory } from "../api/files";
import type { FileEntry } from "../types";
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from 'lucide-react'

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


    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}</div>;
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
            <div className={`tree-node ${highlight ? 'tree-node-active' : ''}`}>
                {open ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                {isdir ? (open ? <FolderOpen size = {16}/> : <Folder size = {16}/>) : <File size = {16}/>}
                {entry.name}
            </div>
            {open && isdir && (<ul className="tree-list">
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