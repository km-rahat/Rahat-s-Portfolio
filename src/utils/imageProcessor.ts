/**
 * Client-side browser image processing utility.
 * Resizes images so the longest dimension is <= maxDimension,
 * checks for transparency in the alpha channel,
 * and converts to a lightweight data URI (PNG if transparent, else JPEG quality 0.9).
 */
export function processImageFile(file: File, maxDimension = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const imgData = ctx.getImageData(0, 0, width, height).data;
          let hasTransparency = false;

          // Check alpha channel (every 4th byte)
          for (let i = 3; i < imgData.length; i += 4) {
            if (imgData[i] < 245) {
              hasTransparency = true;
              break;
            }
          }

          if (hasTransparency) {
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(canvas.toDataURL('image/jpeg', 0.9));
          }
        } catch {
          // Fallback to data URL if getImageData encounters security issues
          resolve(canvas.toDataURL('image/png'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.src = src;
    };

    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}
