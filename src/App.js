import React from 'react';
import PdfUpload from './components/pdf.tsx'; // Ensure this path is correct

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>PDF Viewer</h1>
      <PdfUpload />
    </div>
  );
};

export default App;