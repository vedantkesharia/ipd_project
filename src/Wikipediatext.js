import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WikipediaText() {
  const [wikipediaText, setWikipediaText] = useState('');

  useEffect(() => {
    // Fetch the Wikipedia page content from the proxy server
    axios.get('/wikipedia')
      .then(response => {
        // Use the response data as needed
        setWikipediaText(response.data);
      })
      .catch(error => {
        console.error('Error fetching Wikipedia content:', error);
      });
  }, []);

  return (
    <div>
      <h2>Wikipedia Text</h2>
      <p>{wikipediaText}</p>
    </div>
  );
}

export default WikipediaText;

