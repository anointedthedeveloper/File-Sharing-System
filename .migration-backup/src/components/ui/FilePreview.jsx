import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, FileText, File as FileIcon } from 'lucide-react';

export default function FilePreview({ file, url, type, name, className = '', maxHeight = 280 }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const mime = type || file?.type || '';
  const src = url || objectUrl;

  useEffect(() => {
    if (url || !file) {
      setObjectUrl(null);
      return undefined;
    }
    const blobUrl = URL.createObjectURL(file);
    setObjectUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [file, url]);

  if (!src && !file) return null;

  const containerClass = `rounded-2xl overflow-hidden border flex items-center justify-center ${className}`;
  const style = { borderColor: 'var(--border)', maxHeight, background: 'var(--bg-muted)' };

  if (mime.startsWith('image/')) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={containerClass}
        style={style}
      >
        <img
          src={src}
          alt={name || 'Preview'}
          className="w-full h-auto object-contain"
          style={{ maxHeight }}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    );
  }

  if (mime.startsWith('video/')) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`${containerClass} w-full`}
        style={style}
      >
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          className="w-full object-contain"
          style={{ maxHeight }}
        >
          <track kind="captions" />
        </video>
      </motion.div>
    );
  }

  if (mime.startsWith('audio/')) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${containerClass} w-full p-4 gap-3 flex-col`}
        style={style}
      >
        <Music className="w-8 h-8" style={{ color: 'var(--accent)' }} />
        <audio src={src} controls className="w-full" preload="metadata" />
      </motion.div>
    );
  }

  const Icon = mime.startsWith('text/') ? FileText : mime.includes('pdf') ? FileText : FileIcon;

  return (
    <div className={`${containerClass} p-8 flex-col gap-2`} style={style}>
      <Icon className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
      <p className="text-xs font-medium truncate max-w-full px-2" style={{ color: 'var(--text-secondary)' }}>
        {name || 'File selected'}
      </p>
      {!mime.startsWith('image/') && !mime.startsWith('video/') && (
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Preview available after download
        </p>
      )}
    </div>
  );
}

export function canPreviewType(mime) {
  if (!mime) return false;
  return mime.startsWith('image/') || mime.startsWith('video/') || mime.startsWith('audio/');
}
