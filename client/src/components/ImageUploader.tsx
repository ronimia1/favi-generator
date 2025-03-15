import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImageUploaderProps {
  onUploadStart: (totalFiles: number) => void;
  onJobCreated: (jobId: number) => void;
}

export default function ImageUploader({ onUploadStart, onJobCreated }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter out any files that aren't images
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast({
        title: "Some files were skipped",
        description: "Only image files are supported",
        variant: "destructive"
      });
    }
    
    if (imageFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Please upload JPG, PNG, GIF or SVG files",
        variant: "destructive"
      });
      return;
    }
    
    // Add to existing files instead of replacing
    setFiles(prevFiles => [...prevFiles, ...imageFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/svg+xml': []
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 20,
    noClick: true, // Disable click on the entire area to avoid double-click issues
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      // Create FormData and add each file
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      console.log('Uploading files:', files.length);
      
      // Use a direct fetch call with appropriate content-type handling
      const response = await fetch('/api/process-images', {
        method: 'POST',
        body: formData,
        // No Content-Type header, let the browser set it with boundary
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.jobId) {
        onJobCreated(data.jobId);
      } else {
        toast({
          title: "Upload successful",
          description: "Your images are being processed"
        });
      }
    },
    onError: (error) => {
      console.error("Upload error:", error);
      let errorMessage = "An error occurred during upload";
      
      if (error instanceof Error) {
        // Extract more useful information from the error
        const message = error.message;
        if (message.includes("400")) {
          errorMessage = "Server couldn't process the files. Make sure they are valid images.";
        } else if (message.includes("413")) {
          errorMessage = "Files are too large. Maximum total size is limited.";
        } else if (message.includes("415")) {
          errorMessage = "Unsupported file type. Use JPG, PNG, GIF or SVG files.";
        } else {
          errorMessage = message;
        }
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image file",
        variant: "destructive"
      });
      return;
    }
    
    onUploadStart(files.length);
    uploadMutation.mutate(files);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8 max-w-3xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition duration-200 ${
          isDragActive ? 'border-primary bg-primary-50' : 'border-gray-300'
        }`}
      >
        <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">
          {isDragActive ? "Drop your images here" : "Drag and drop your images here"}
        </h3>
        <p className="text-gray-500 mb-4">or</p>
        <button 
          type="button"
          onClick={open} 
          className="inline-block bg-primary text-white font-medium px-5 py-2 rounded-lg cursor-pointer hover:bg-primary-600 transition duration-200"
        >
          Browse Files
        </button>
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500 mt-4">Supported formats: JPG, PNG, GIF, SVG</p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Selected Files ({files.length})</h4>
            <button 
              onClick={() => setFiles([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="truncate flex-1">{file.name}</span>
                  <span className="text-gray-400 ml-2">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="w-full mt-4 bg-primary text-white font-medium py-3 px-4 rounded-lg hover:bg-primary-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? "Uploading..." : "Convert Images"}
          </button>
        </div>
      )}
    </div>
  );
}
