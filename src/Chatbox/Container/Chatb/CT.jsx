import DOMPurify from 'dompurify';

function CT({userInput, hast}) {
    const sanitizedHTML = DOMPurify.sanitize(userInput);

    const replaceURLsWithLinks = (html) => {
        return html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="link link-primary" target="_blank">$1</a>');
    };

    const finalHTML = replaceURLsWithLinks(sanitizedHTML);

    return (
        <div title={`${hast ? sanitizedHTML : ''}`} dangerouslySetInnerHTML={{ __html: finalHTML }} />
    );
}

export default CT
