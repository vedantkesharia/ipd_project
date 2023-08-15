import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/get_summary', { title });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  return (
    <div>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={handleSubmit}>Get Summary</button>
      {summary && <p>{summary}</p>}
    </div>
  );
}

export default App;












// import React, { useState, useEffect } from 'react';
// // import './App.css';

// function App() {
//   const [summary, setSummary] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:5000/get_summary')  
//       .then(response => response.json())
//       .then(data =>{
//         console.log(data);
//         setSummary(data.summary)
//       })
//       .catch(error => console.error('Error fetching summary:', error));
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Taj Mahal Summary</h1>
//         <p>{summary}</p>
//       </header>
//     </div>
//   );
// }

// export default App;

