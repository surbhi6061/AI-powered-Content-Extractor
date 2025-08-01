import React, { useState } from 'react';

function URLInput({ onSubmit, loading }) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url) onSubmit(url);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter public article URL" />
            <button type="submit" disabled={loading}>Extract</button>
        </form>
    );
}

export default URLInput;
