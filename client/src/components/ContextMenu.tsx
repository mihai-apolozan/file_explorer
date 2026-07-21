import type { FileEntry } from "../types";
import { deleteEntry, renameEntry } from "../api/files";

interface Props {
    entry: FileEntry;
    x: number;
    y: number;
    onRefresh: () => void;
}

export function ContextMenu({ entry, x, y, onRefresh}: Props) {

    
    return (
        <div className="context-menu" style = {{position: 'fixed', top: y, left: x}}>
            <button onClick={async () => {const name = prompt(); if (name) {await renameEntry(entry.path, name); onRefresh();}}}>Rename</button>
            <button onClick={async () => {const yes = confirm(); if(yes) {await deleteEntry(entry.path); onRefresh();}}}>Delete</button>
        </div>
    )
}