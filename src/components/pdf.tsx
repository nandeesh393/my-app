import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUpload: React.FC = () => {
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [showPdf, setShowPdf] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfName(file.name);
      setPdfUrl(URL.createObjectURL(file));
      setPdfSize(file.size);
      setShowPdf(false);
      setCurrentPage(1);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleShowPdf = () => {
    setShowPdf(true);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdfName && (
        <div>
          <h2>PDF Name: {pdfName}</h2>
          <h3>File Size: {(pdfSize ? (pdfSize / 1024).toFixed(2) : 0)} KB</h3>
          {pdfUrl && (
            <div>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Open PDF</a>
              <button onClick={handleShowPdf} style={{ marginLeft: '10px' }}>Show PDF</button>
            </div>
          )}
          {showPdf && pdfUrl && (
            <div style={{ display: 'flex', marginTop: '20px' }}>
              <div style={{ width: '20%', paddingRight: '10px', borderRight: '1px solid #ccc' }}>
                <h3>Pages</h3>
                <ul>
                  {Array.from(new Array(numPages), (el, index) => (
                    <li 
                      key={index} 
                      style={{ cursor: 'pointer', fontWeight: currentPage === index + 1 ? 'bold' : 'normal' }} 
                      onClick={() => goToPage(index + 1)}
                    >
                      Page {index + 1}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ width: '80%', marginLeft: '10px' }}>
                <Document 
                  file={pdfUrl} 
                  onLoadSuccess={onDocumentLoadSuccess} 
                  onLoadError={(error) => {
                    console.error('Error loading PDF:', error);
                    alert('Failed to load PDF. Please try a different file.');
                  }}
                >
                  <Page pageNumber={currentPage} width={600} />
                </Document>
                <p>Page {currentPage} of {numPages}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
