import DOMPurify from 'dompurify';

function CT({userInput, hast}) {
    const sanitizedHTML = DOMPurify.sanitize(userInput);
    return (
        <div title={`${hast ? sanitizedHTML : ''}`} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    );
}

export default CT
