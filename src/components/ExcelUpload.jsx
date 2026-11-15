import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Layers,
  Info
} from 'lucide-react';
import { parseExcelWorkbook } from '../utils/excelParser';

export default function ExcelUpload({
  isOpen,
  onClose,
  onWorkbookLoaded,
  onResetToDefault,
  currentSheetData
}) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const processFile = async (file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      setError('Invalid file type. Please upload a Microsoft Excel workbook (.xlsx or .xls).');
      setStatusMessage(null);
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage('Reading Excel workbook and analyzing worksheets in browser...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Parse with our custom in-browser SheetJS parser
      const parsed = parseExcelWorkbook(arrayBuffer);

      if (!parsed.schedules || parsed.schedules.length === 0) {
        throw new Error(
          'No valid schedule records could be detected. Please ensure the workbook contains sheets with columns such as CourseCode, Subject, Date, Time, and Section.'
        );
      }

      onWorkbookLoaded({
        ...parsed,
        fileName: file.name,
        isCustom: true
      });

      setStatusMessage(
        `Success! Imported ${parsed.totalGroupedSchedules} schedules across ${parsed.sheets.length} worksheets.`
      );
      setLoading(false);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Workbook parse error:', err);
      setError(err.message || 'Failed to read workbook. Please check file format.');
      setStatusMessage(null);
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <FileSpreadsheet className="modal-title-icon" size={24} />
            <div>
              <h3 id="modal-title" className="modal-heading">
                Upload Excel Schedule Workbook
              </h3>
              <p className="modal-subheading">
                Direct client-side parsing with SheetJS. No data is sent to external servers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Drag & Drop Zone */}
          <div
            className={`dropzone ${dragOver ? 'dropzone-active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".xlsx, .xls"
              className="hidden-file-input"
            />
            <div className="dropzone-content">
              <UploadCloud size={44} className="dropzone-icon" />
              <div className="dropzone-text">
                <strong>Click to browse</strong> or drag & drop Excel workbook here
              </div>
              <div className="dropzone-hint">
                Supports .xlsx and .xls (Y25 II, Y24 III, Y23 IV B.Tech sheets)
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="status-box status-success">
              <CheckCircle2 size={18} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="status-box status-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="loading-state-box">
              <RefreshCw size={20} className="spinning" />
              <span>Processing worksheets and normalizing schedules...</span>
            </div>
          )}

          {/* Current Loaded Information */}
          {currentSheetData && currentSheetData.sheets && (
            <div className="loaded-sheets-summary">
              <div className="loaded-summary-title">
                <Layers size={16} />
                <span>Active Worksheets in Memory:</span>
              </div>
              <ul className="sheet-list">
                {currentSheetData.sheets.map((sh, idx) => (
                  <li key={idx} className="sheet-list-item">
                    <span className="sheet-name">{sh.name}</span>
                    <span className="sheet-badge">{sh.academicYear}</span>
                    <span className="sheet-rows">{sh.recordCount} rows</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Banner */}
          <div className="privacy-notice">
            <Info size={16} className="notice-icon" />
            <div>
              <strong>Privacy Guaranteed:</strong> Student register numbers and personal
              names are automatically grouped into anonymous student counts and never shown
              in search results.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onResetToDefault}
            className="btn-link"
            title="Reload official 2026-27 preloaded schedule"
          >
            <RefreshCw size={15} />
            <span>Restore Default KL Schedule</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
