import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, File, Image as ImageIcon, FileText, Film, Music, Archive } from 'lucide-react';

export default function DropZone({ onDrop, accept = '*', maxSize = 10 * 1024 * 1024, multiple = true }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...validFiles] : [validFiles[0]]);
      onDrop && onDrop(validFiles);
    }
  }, [onDrop, maxSize, multiple]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...validFiles] : [validFiles[0]]);
      onDrop && onDrop(validFiles);
    }
  }, [onDrop, maxSize, multiple]);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
    if (type.startsWith('video/')) return <Film className="w-8 h-8" />;
    if (type.startsWith('audio/')) return <Music className="w-8 h-8" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-8 h-8" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? '#3b82f6' : 'rgba(255,255,255,0.1)',
          backgroundColor: isDragging ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer hover:border-blue-400/50 transition-all"
        onClick={() => document.getElementById('file-input').click()}
      >
        {/* Animated background effect */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-sky-400/10 rounded-3xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Drop icon with animation */}
        <motion.div
          animate={isDragging ? { y: [0, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-sky-400/20 mb-4">
            <UploadCloud className="w-10 h-10 text-blue-400" />
          </div>
        </motion.div>

        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            or click to browse your files
          </p>
          <p className="text-slate-500 text-xs">
            Maximum file size: {formatFileSize(maxSize)}
          </p>
        </div>

        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  {getFileIcon(file)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
