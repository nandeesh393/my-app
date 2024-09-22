import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

const PdfViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null); // State to hold the selected file
  const [pdfDocument, setPdfDocument] = useState<any>(null); // To store the loaded PDF document
  const [currentPage, setCurrentPage] = useState<number>(1); // State for the current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Function to load and render a specific page
  const renderPage = async (pageNumber: number) => {
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      try {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages); // Set total number of pages
          await renderPage(1); // Render the first page initially
        };

        if (file) {
          fileReader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
        }
      } catch (error) {
        console.error('Error loading PDF document:', error);
      }
    };

    if (pdfDocument) {
      renderPage(currentPage);
    }

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDocument, currentPage]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setCurrentPage(1); // Reset to the first page
      setPdfDocument(null); // Reset the document to reload
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  // Handle showing the PDF in the same window
  const handleShowPdf = () => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages); // Set total number of pages
        setCurrentPage(1); // Render the first page
      };
      fileReader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    }
  };

  return (
    <div>
      <div>
        {/* File input to select PDF */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
        {/* Button to toggle PDF display */}
        <button onClick={handleShowPdf} disabled={!file}>
          Show PDF
        </button>
      </div>

      {/* Display PDF Viewer only if pdfDocument is loaded */}
      {pdfDocument && totalPages > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px', // Some padding
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }} disabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }} disabled={currentPage === totalPages}>
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
              borderRadius: '18px',
              background: '#b0b0b0',
              boxShadow: '6px 6px 8px #929292,  -6px -6px 8px #cecece',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
