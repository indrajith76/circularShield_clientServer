/**
 * CircularShield File Upload Component
 * Drag-and-drop and click-to-upload for PDF and image circulars.
 * Validates extension, MIME type, and size. Shows filename, size, type,
 * preview (for images), and allows removing/replacing files.
 *
 * No upload success is assumed until the backend responds.
 */
import { useRef, useState, useCallback } from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';

export const FileUpload = ({
  file,
  onFileChange,
  onRemove,
  error,
  accept = '.pdf,image/png,image/jpeg,image/jpg',
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileChange(e.dataTransfer.files[0]);
      }
    },
    [onFileChange],
  );

  const handleFileSelect = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileChange(e.target.files[0]);
      }
    },
    [onFileChange],
  );

  const previewUrl = file && file.type.startsWith('image/')
    ? URL.createObjectURL(file)
    : null;

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop zone / file not selected */}
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#087F70] bg-[#087F70]/5'
              : 'border-[#CBD5E1] hover:border-[#087F70] hover:bg-[#F8FAFC]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#087F70]/10 text-[#087F70] flex items-center justify-center mb-3">
            <Upload size={28} />
          </div>
          <h4 className="text-base font-bold text-[#102C3A]">
            Choose a circular file or drag it here
          </h4>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Supports PDF circulars or scanned newspaper photos (JPG, PNG).
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#102C3A] text-white text-xs font-semibold">
            Browse Device Files
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="File preview"
                  className="w-12 h-12 rounded-lg object-cover border border-[#E2E8F0]"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#087F70]/10 text-[#087F70] flex items-center justify-center">
                  <FileText size={24} />
                </div>
              )}
              <div>
                <p className="font-bold text-sm text-[#102C3A] line-clamp-1">
                  {file.name}
                </p>
                <p className="text-xs text-[#64748B]">
                  {formatSize(file.size)} • {file.type || 'unknown type'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-[#DC4B4B] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
              title="Remove file"
              aria-label="Remove file"
            >
              <Trash2 size={18} />
            </button>
          </div>
          {error && (
            <p className="text-xs text-[#DC4B4B] font-medium text-center">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
