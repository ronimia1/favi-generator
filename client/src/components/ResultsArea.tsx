import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { FaviconSet } from "@/types/favicon";
import { useToast } from "@/hooks/use-toast";

interface ResultsAreaProps {
  faviconSets: FaviconSet[];
  onReset: () => void;
}

export default function ResultsArea({ faviconSets, onReset }: ResultsAreaProps) {
  const { toast } = useToast();

  const handleDownloadSingle = async (id: number) => {
    try {
      toast({
        title: "Preparing download",
        description: "Creating zip file for the selected favicon set..."
      });
      
      const response = await fetch(`/api/download/${id}`);
      if (!response.ok) {
        toast({
          title: "Download failed",
          description: "There was an error downloading the favicon files",
          variant: "destructive"
        });
        throw new Error('Download failed');
      }
      
      // Check if we got a valid blob back
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/zip')) {
        toast({
          title: "Download failed",
          description: "The server returned an invalid file format",
          variant: "destructive"
        });
        throw new Error('Invalid file format received');
      }
      
      const blob = await response.blob();
      if (blob.size === 0) {
        toast({
          title: "Download failed",
          description: "The generated zip file is empty",
          variant: "destructive"
        });
        throw new Error('Empty file received');
      }
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favicon_${id}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: "Your favicon files have been downloaded"
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDownloadAll = async () => {
    try {
      toast({
        title: "Preparing download",
        description: "Creating zip file with all favicon sets..."
      });
      
      const response = await fetch('/api/download-all');
      if (!response.ok) {
        toast({
          title: "Download failed",
          description: "There was an error downloading the favicon files",
          variant: "destructive"
        });
        throw new Error('Download failed');
      }
      
      // Check if we got a valid blob back
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/zip')) {
        toast({
          title: "Download failed",
          description: "The server returned an invalid file format",
          variant: "destructive"
        });
        throw new Error('Invalid file format received');
      }
      
      const blob = await response.blob();
      if (blob.size === 0) {
        toast({
          title: "Download failed",
          description: "The generated zip file is empty",
          variant: "destructive"
        });
        throw new Error('Empty file received');
      }
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all_favicons.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: "All favicon files have been downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Generated Favicons</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset} className="bg-white">
            <RefreshCw className="mr-2 h-4 w-4" />
            Convert More Images
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {faviconSets.map((faviconSet) => (
          <div 
            key={faviconSet.id} 
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-200"
          >
            <div className="p-4 border-b">
              <h4 className="font-medium truncate">{faviconSet.originalName}</h4>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="grid grid-cols-3 gap-4 mb-6 w-full">
                {Object.entries(faviconSet.sizes).map(([size, url]) => (
                  <div key={size} className="flex flex-col items-center">
                    <div className="border border-gray-200 rounded-md p-2 flex items-center justify-center h-16 w-16 mb-2">
                      <img 
                        src={url} 
                        alt={`${size}x${size} favicon preview`} 
                        className={`w-${parseInt(size) / 4} h-${parseInt(size) / 4}`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{size}x{size}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center" 
                onClick={() => handleDownloadSingle(faviconSet.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          className="bg-primary hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          onClick={handleDownloadAll}
        >
          <Download className="mr-2 h-4 w-4" />
          Download All Favicons (.zip)
        </Button>
      </div>
    </div>
  );
}
