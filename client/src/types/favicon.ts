export interface FaviconSize {
  size: number;
  url: string;
  blob?: Blob;
}

export interface FaviconSet {
  id: number;
  originalName: string;
  originalFormat: string;
  sizes: Record<string, string>;
  createdAt: string;
}

export interface ProcessingJob {
  id: number;
  totalImages: number;
  completedImages: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
}

export interface GeneratedFavicon {
  id: string;
  originalName: string;
  previewUrl: string;
  sizes: FaviconSize[];
}
