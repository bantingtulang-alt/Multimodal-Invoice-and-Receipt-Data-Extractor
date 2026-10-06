/**
 * Utility to convert SVG data URIs to standard PNG base64 strings
 * for Gemini vision compatibility.
 */
export async function convertSvgToPngBase64(svgUrl: string): Promise<string> {
  return new Promise((resolve) => {
    // If already a standard raster base64, return as is
    if (svgUrl.startsWith('data:image/png;base64,') || 
        svgUrl.startsWith('data:image/jpeg;base64,') || 
        svgUrl.startsWith('data:image/webp;base64,')) {
      resolve(svgUrl);
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          // High resolution for clean text OCR
          const width = img.naturalWidth || img.width || 600;
          const height = img.naturalHeight || img.height || 800;
          canvas.width = Math.max(width, 600);
          canvas.height = Math.max(height, 800);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve('');
            return;
          }

          // Solid white background for financial documents
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const pngDataUrl = canvas.toDataURL('image/png', 0.95);
          resolve(pngDataUrl);
        } catch (e) {
          console.warn('Canvas export error:', e);
          resolve('');
        }
      };

      img.onerror = (err) => {
        console.warn('Image load error during SVG conversion:', err);
        resolve('');
      };

      img.src = svgUrl;
    } catch (e) {
      console.warn('Error in convertSvgToPngBase64:', e);
      resolve('');
    }
  });
}
