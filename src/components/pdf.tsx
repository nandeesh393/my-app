import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// Set the worker source manually by referring to a CDN or local file
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const PdfViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const renderPage = async (pageNumber: number) => {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    try {
      const page = await pdfDocument.getPage(pageNumber);
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
        await renderTaskRef.current.promise;
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
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages);
          await renderPage(1); // Render the first page
        };
        fileReader.readAsArrayBuffer(file);
      }
    };

    loadPdf(); // Call loadPdf when file changes

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setCurrentPage(1); // Reset to first page when a new file is loaded
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