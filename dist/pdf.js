"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var pdfjsLib = __importStar(require("pdfjs-dist/build/pdf"));
require("pdfjs-dist/web/pdf_viewer.css");
// Set the worker source manually by referring to a CDN or local file
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
var PdfViewer = function () {
    var _a = (0, react_1.useState)(null), file = _a[0], setFile = _a[1];
    var _b = (0, react_1.useState)(null), pdfDocument = _b[0], setPdfDocument = _b[1];
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var _d = (0, react_1.useState)(0), totalPages = _d[0], setTotalPages = _d[1];
    var canvasRef = (0, react_1.useRef)(null);
    var renderTaskRef = (0, react_1.useRef)(null);
    var renderPage = function (pageNumber) { return __awaiter(void 0, void 0, void 0, function () {
        var page, scale, viewport, canvas, context, renderContext, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (renderTaskRef.current) {
                        renderTaskRef.current.cancel();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, pdfDocument.getPage(pageNumber)];
                case 2:
                    page = _a.sent();
                    scale = 1.5;
                    viewport = page.getViewport({ scale: scale });
                    canvas = canvasRef.current;
                    context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
                    if (!(canvas && context)) return [3 /*break*/, 4];
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    renderTaskRef.current = page.render(renderContext);
                    return [4 /*yield*/, renderTaskRef.current.promise];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error rendering page:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        var loadPdf = function () { return __awaiter(void 0, void 0, void 0, function () {
            var fileReader;
            return __generator(this, function (_a) {
                if (file) {
                    fileReader = new FileReader();
                    fileReader.onload = function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var typedArray, pdf;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        typedArray = new Uint8Array(this.result);
                                        return [4 /*yield*/, pdfjsLib.getDocument(typedArray).promise];
                                    case 1:
                                        pdf = _a.sent();
                                        setPdfDocument(pdf);
                                        setTotalPages(pdf.numPages);
                                        return [4 /*yield*/, renderPage(1)];
                                    case 2:
                                        _a.sent(); // Render the first page
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    fileReader.readAsArrayBuffer(file);
                }
                return [2 /*return*/];
            });
        }); };
        loadPdf(); // Call loadPdf when file changes
        return function () {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [file]);
    var handleFileChange = function (event) {
        var _a;
        var selectedFile = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setCurrentPage(1); // Reset to first page when a new file is loaded
            setPdfDocument(null); // Reset pdfDocument to trigger loading
        }
        else {
            alert('Please select a valid PDF file.');
        }
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", null,
            react_1.default.createElement("input", { type: "file", accept: "application/pdf", onChange: handleFileChange, style: { marginBottom: '10px' } }),
            react_1.default.createElement("button", { onClick: function () { return pdfDocument && renderPage(currentPage); }, disabled: !file }, "Show PDF")),
        pdfDocument && totalPages > 0 && (react_1.default.createElement("div", { style: { marginTop: '20px' } },
            react_1.default.createElement("div", { style: { marginRight: '20px' } }, Array.from({ length: totalPages }, function (_, index) { return (react_1.default.createElement("button", { key: index + 1, style: {
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: currentPage === index + 1 ? '#4CAF50' : '#f1f1f1',
                    color: currentPage === index + 1 ? '#fff' : '#000',
                }, onClick: function () {
                    setCurrentPage(index + 1);
                    renderPage(index + 1);
                } },
                "Page ",
                index + 1)); })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("button", { onClick: function () { return currentPage > 1 && setCurrentPage(currentPage - 1); }, disabled: currentPage === 1 }, "Previous"),
                react_1.default.createElement("button", { onClick: function () { return currentPage < totalPages && setCurrentPage(currentPage + 1); }, disabled: currentPage === totalPages }, "Next"),
                react_1.default.createElement("p", null,
                    "Page",
                    ' ',
                    react_1.default.createElement("input", { type: "number", value: currentPage, min: 1, max: totalPages, onChange: function (e) {
                            var page = parseInt(e.target.value, 10);
                            if (page > 0 && page <= totalPages) {
                                setCurrentPage(page);
                                renderPage(page); // Render the selected page immediately
                            }
                        }, style: { width: '50px' } }),
                    ' ',
                    "of ",
                    totalPages)),
            react_1.default.createElement("canvas", { ref: canvasRef, style: {
                    width: '80%',
                    marginLeft: '150px',
                    borderRadius: '16px',
                    background: '#b0b0b0',
                    boxShadow: '6px 6px 8px #929292, -6px -6px 8px #cecece',
                } })))));
};
exports.default = PdfViewer;
