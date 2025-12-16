export const highlightText = (text: string, query: string) => {
    if (!query) return text;
        
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="marked-highlight">
                {part}
            </mark>
        ) : (
            part
        )
    );
};