import type { FileEntry } from "../types";

interface Props {
    entry: FileEntry;
    onNavigate: (path: string) => void;
}

function formatSize(bytes: number): string {
    if (bytes === 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes)/Math.log(1024));
    const value = bytes/Math.pow(1024, i);
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// 1. Initialize the formatter once in memory
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric', 
  month: 'short', 
  day: 'numeric',
  hour: '2-digit', 
  minute: '2-digit',
});

function formatDate(iso: string): string {
  // 2. Reuse the cached formatter
  return dateFormatter.format(new Date(iso));
}

export function FileListItem({ entry, onNavigate } : Props) {
    const isdir = entry.type === 'directory';

    return (
        <tr
        onClick = {() => isdir && onNavigate(entry.path)}
        style = {{ cursor: isdir ? 'pointer' : 'default'}}
        >
            <td>{isdir ? '📁' : '📄'} {entry.name}</td>
            <td>{formatSize(entry.size)}</td>
            <td>{formatDate(entry.modified)}</td>
        </tr>
    );
}