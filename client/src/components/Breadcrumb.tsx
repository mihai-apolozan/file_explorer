interface Props {
    path: string;
    onNavigate: (path: string) => void;
}

export function Breadcrumb({path, onNavigate}: Props) {
    const segments = path.split('/').filter(Boolean);

    return (
        <nav>
            <span
                onClick = {() => onNavigate('/')}
                className="breadcrumb-home"
            >
                Home
            </span>

            {segments.map(
                (segment, i) => {
                    const segmentPath = '/' + segments.slice(0,i+1).join('/');
                    const isLast = i === segments.length -1;

                    return (
                        <span key = {segmentPath}>
                            {' / '}
                            {
                                isLast ? (
                                    <span>{segment}</span>
                                ) : (
                                    <span
                                    onClick = {() => onNavigate(segmentPath)}
                                    className="breadcrumb-link">
                                        {segment}
                                    </span>
                                )
                            }
                        </span>
                    )
                }
            )}
        </nav>
    );
}