import DOMPurify from 'dompurify';

function CT({userInput, hast, className, title}) {
    const sanitizedHTML = DOMPurify.sanitize(userInput);

    const replaceURLsWithLinks = (html) => {
        const regex = /(https?:\/\/[^\s'"]+)|(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)|(\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b)/g;
        return html.replace(regex, (match) => {
            if (/^https?:\/\//i.test(match)) {
                return `<a href='${match.split(/<\s*br\s*\/?>|<\s*a[^>]*>.*?<\s*\/\s*a\s*>/gi).join('')}' target='_blank' class='link link-primary'>${match.split(/<\s*br\s*\/?>|<\s*a[^>]*>.*?<\s*\/\s*a\s*>/gi).join('')}</a>`;
            }
            else if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(match)) {
                return `<a href='mailto:${match.split(/<\s*br\s*\/?>|<\s*a[^>]*>.*?<\s*\/\s*a\s*>/gi).join('')}' class='link link-primary'>${match.split(/<\s*br\s*\/?>|<\s*a[^>]*>.*?<\s*\/\s*a\s*>/gi).join('')}</a>`;
            }
            else if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(match)) {
                return `<a href='tel:${match.split(/<\s*br\s*\/?>|<\s*a[^>]*>.*?<\s*\/\s*a\s*>/gi).join('')}' class='link link-primary'>${match.split(/<\s*br\s*\/?>|<\s*a[^>]*>.*?<\s*\/\s*a\s*>/gi).join('')}</a>`;
            }
            return match;
        });
    };

    const finalHTML = replaceURLsWithLinks(sanitizedHTML);

    return (
        <div className={className} title={`${hast ? sanitizedHTML : ''}`} dangerouslySetInnerHTML={{ __html: finalHTML }} />
    );
}

export default CT;
