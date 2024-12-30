import { useState } from 'react';
import { Input, List } from 'antd';
import Fuse from 'fuse.js';
import 'antd/dist/reset.css'; // Include Ant Design styles
import './App.css';

// Import the JSON data
import data from './sample_data/message_subject_lists'; // Replace with the actual path

const { Search } = Input;

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const messageData = data['messages'];
  const subjectData = data['subjects'];

  // Combine the message and subject data (if searching across both)
  const combinedData = [...messageData, ...subjectData];

  // Dynamic key extraction for large JSON objects
  const fuseOptions = {
    keys: [
      'title',
      'description',
      'createdby.name',
      'subjectName',
      'subjectDescription',
      // Add additional keys here based on JSON structure
    ],
    threshold: 0.4, // Adjust for desired fuzzy matching sensitivity
    ignoreLocation: true, // Allow matches anywhere in the string
  };

  const fuse = new Fuse(combinedData, fuseOptions);

  const handleSearch = (value: string) => {
    setQuery(value);
    const result = fuse.search(value).map((res) => res.item); // Extract matched items
    setResults(result);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-5">Fuzzy Search with Fuse.js</h1>
      <div className="mb-5">
        <Search
          placeholder="Search messages or subjects..."
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-lg mx-auto"
        />
      </div>
      <div
        className="results-container w-full max-w-lg mx-auto"
        style={{
          maxHeight: '400px', // Restrict height for scrollbar
          overflowY: 'auto', // Enable vertical scrolling
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <List
          bordered
          dataSource={results}
          renderItem={(item) => (
            <List.Item>
              <div>
                <h3 className="font-bold text-lg">{item.title || item.subjectName}</h3>
                <p className="text-sm">{item.description || item.subjectDescription}</p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default App;
