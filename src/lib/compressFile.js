const COMPRESSIBLE = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

/**
 * Client-side image compression via canvas (no extra deps).
 * Non-images are returned unchanged; GIF/SVG skipped.
 */
export async function compressFile(file, { quality = 0.82, maxWidth = 1920, maxHeight = 1920 } = {}) {
  const originalSize = file.size;

  if (!file.type || !COMPRESSIBLE.has(file.type.toLowerCase())) {
    return {
      file,
      compressed: false,
      originalSize,
      newSize: originalSize,
      ratio: 1,
    };
  }

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const mime = file.type === 'image/png' ? 'image/webp' : file.type;
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Compression failed'))),
        mime === 'image/png' ? 'image/webp' : mime,
        quality
      );
    });

    const ext = mime.includes('webp') ? '.webp' : file.name.match(/\.[^.]+$/)?.[0] || '';
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const outName = mime.includes('webp') && !file.name.endsWith('.webp') ? `${baseName}.webp` : file.name;

    const compressedFile = new File([blob], outName, {
      type: blob.type,
      lastModified: Date.now(),
    });

    const saved = originalSize > compressedFile.size;

    return {
      file: saved ? compressedFile : file,
      compressed: saved,
      originalSize,
      newSize: saved ? compressedFile.size : originalSize,
      ratio: saved ? compressedFile.size / originalSize : 1,
    };
  } catch (err) {
    console.warn('[compressFile]', err);
    return { file, compressed: false, originalSize, newSize: originalSize, ratio: 1 };
  }
}

export function formatCompressionNote(result) {
  if (!result.compressed) return null;
  const pct = Math.round((1 - result.ratio) * 100);
  return `Compressed ${pct}% smaller (${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)})`;
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${['B', 'KB', 'MB', 'GB'][i]}`;
}
