import React, { useState } from 'react';

const KeywordFilter = () => {
  const [keywords, setKeywords] = useState('');

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the keywords to the backend
    fetch('/api/set-keywords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={keywords}
        onChange={handleKeywordsChange}
        placeholder="Enter keywords"
      />
      <button type="submit">Set Keywords</button>
    </form>
  );
};

export default KeywordFilter;
