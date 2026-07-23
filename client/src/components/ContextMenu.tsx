import type { FileEntry } from "../types";
import { deleteEntry, renameEntry } from "../api/files";
import { Pencil, Trash2 } from 'lucide-react'

interface Props {
    entry: FileEntry;
    x: number;
    y: number;
    onRefresh: () => void;
}

export function ContextMenu({ entry, x, y, onRefresh}: Props) {

    
    return (
        <div className="context-menu" style = {{position: 'fixed', top: y, left: x}}>
            <button onClick={async () => {const name = prompt("New name:", entry.name); if (name) { try { await renameEntry(entry.path, name); onRefresh(); } catch (e: any) { alert("Failed to rename: " + e.message); }}}}>
                <Pencil/>Rename
            </button>
            <button onClick={async () => {const yes = confirm("Delete " + entry.name + "?"); if(yes) { try { await deleteEntry(entry.path); onRefresh(); } catch (e: any) { alert("Failed to delete: " + e.message); }}}}>
                <Trash2/>Delete
            </button>
        </div>
    )
}