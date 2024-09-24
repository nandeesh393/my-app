import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set the worker source manually by referring to a CDN or local file
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const PdfViewer = () => {
  const [file, setFile] = useState(null); // State to hold the selected file
  const [pdfDocument, setPdfDocument] = useState(null); // State to hold the loaded PDF document
  const [currentPage, setCurrentPage] = useState(1); // State for the current page number
  const [totalPages, setTotalPages] = useState(0); // State for total pages in the PDF
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Function to load and render a specific page
  const renderPage = async (pageNumber) => {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel(); // Cancel any ongoing render task
    }

    try {
      const page = await pdfDocument.getPage(pageNumber); // Get the specified page
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (canvas && context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise; // Wait for rendering to complete
      }
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  useEffect(() => {
    const loadPdf = async () => {
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages); // Set the total number of pages
          await renderPage(1); // Render the first page
        };
        fileReader.readAsArrayBuffer(file);
      }
    };

    loadPdf(); // Call loadPdf when the file changes

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setCurrentPage(1); // Reset to the first page when a new file is loaded
      setPdfDocument(null); // Reset pdfDocument to trigger loading
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  return (
    <div>
      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        <button onClick={() => pdfDocument && renderPage(currentPage)} disabled={!file}>
          Show PDF
        </button>
      </div>

      {pdfDocument && totalPages > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginRight: '20px' }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: currentPage === index + 1 ? '#4CAF50' : '#f1f1f1',
                  color: currentPage === index + 1 ? '#fff' : '#000',
                }}
                onClick={() => {
                  setCurrentPage(index + 1);
                  renderPage(index + 1);
                }}
              >
                Page {index + 1}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <p>
              Page{' '}
              <input
                type="number"
                value={currentPage}
                min={1}
                max={totalPages}
                onChange={(e) => {
                  const page = parseInt(e.target.value, 10);
                  if (page > 0 && page <= totalPages) {
                    setCurrentPage(page);
                    renderPage(page); // Render the selected page immediately
                  }
                }}
                style={{ width: '50px' }}
              />{' '}
              of {totalPages}
            </p>
          </div>
          <canvas
            ref={canvasRef}
            style={{
              width: '80%',
              marginLeft: '150px',
              borderRadius: '16px',
              background: '#b0b0b0',
              boxShadow: '6px 6px 8px #929292, -6px -6px 8px #cecece',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
