import type { FileEntry } from "../types";
import { deleteEntry, renameEntry } from "../api/files";

interface Props {
    entry: FileEntry;
    x: number;
    y: number;
}

export function ContextMenu({ entry, x, y}: Props) {

    
    return (
        <div style = {{position: 'fixed', top: y, left: x}}>
            <button onClick={() => {}}>Rename</button>
            <button onClick={() => {}}>Delete</button>
        </div>
    )
}