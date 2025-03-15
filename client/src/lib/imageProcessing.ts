import { GeneratedFavicon, FaviconSize } from "../types/favicon";

// Create a client-side preview of the favicon
export async function createFaviconPreview(file: File): Promise<GeneratedFavicon> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          return reject(new Error('Failed to read file'));
        }
        
        const img = new Image();
        img.src = e.target.result as string;
        
        img.onload = async () => {
          // Generate preview for different sizes
          const sizes: FaviconSize[] = await Promise.all([16, 32, 48].map(async (size) => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }
            
            // Draw image to canvas at the required size
            ctx.drawImage(img, 0, 0, size, size);
            
            // Convert to blob
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to create blob'));
                }
              }, 'image/png');
            });
            
            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            
            return { size, url, blob };
          }));
          
          // Return the generated favicon preview
          resolve({
            id: Date.now().toString(),
            originalName: file.name,
            previewUrl: sizes[1].url, // Use 32x32 as preview
            sizes
          });
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

// Converts a File to a FormData object for uploading
export function prepareFormData(files: File[]): FormData {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  return formData;
}

// Downloads a blob as a file
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
