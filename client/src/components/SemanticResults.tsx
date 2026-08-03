import type { SemanticResult } from '../api/rag';
import type { FileEntry } from '../types';

interface Props {
    results: SemanticResult[];
    onFileClick: (entry: FileEntry) => void;
    loading: boolean;
    error: string;
}

export function SemanticResults({ results, onFileClick, loading, error }: Props) {
    if(loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if(error) return <div className="error-box">{error}</div>;
    if (results.length === 0) {
        return <div className="empty-state">No semantic matches found</div>;
    }

    return (
        <div className="semantic-results">
            {results.map((result, i) => (
                <div
                    key={i}
                    className="semantic-result"
                    onClick={() => onFileClick(result.entry)}
                >
                    <div className="semantic-result-header">
                        <span className="semantic-result-name">{result.entry.name}</span>
                        <span className="semantic-result-score">
                            {((1 - result.distances / 2) * 100).toFixed(0)}% match
                        </span>
                    </div>
                    <div className="semantic-result-path">{result.entry.path}</div>
                    <div className="semantic-result-snippet">{result.documents}</div>
                </div>
            ))}
        </div>
    );
}
