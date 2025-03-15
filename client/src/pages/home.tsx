import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ImageUploader from "@/components/ImageUploader";
import ProcessingArea from "@/components/ProcessingArea";
import ResultsArea from "@/components/ResultsArea";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { useState } from "react";
import { GeneratedFavicon } from "@/types/favicon";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([]);
  const [showUploader, setShowUploader] = useState(true);
  const queryClient = useQueryClient();

  // Query for job status when a job is in progress
  const { data: jobStatus } = useQuery({
    queryKey: ['/api/processing-jobs', currentJobId],
    queryFn: async () => {
      if (!currentJobId) return null;
      const response = await fetch(`/api/processing-jobs/${currentJobId}`);
      if (!response.ok) throw new Error('Failed to fetch job status');
      return await response.json();
    },
    enabled: !!currentJobId && isProcessing,
    refetchInterval: isProcessing ? 1000 : false
  });

  // Update progress when job status changes
  if (jobStatus && isProcessing) {
    const newProgress = Math.floor((jobStatus.completedImages / jobStatus.totalImages) * 100);
    if (progress !== newProgress) {
      setProgress(newProgress);
    }
    
    // When job is completed, fetch results
    if (jobStatus.status === 'completed') {
      // Set progress to 100% when completed (in case there was a mismatch)
      if (progress !== 100) {
        setProgress(100);
      }
      setIsProcessing(false);
      setShowUploader(false);
      // Results will be shown separately via the results query
    } else if (jobStatus.status === 'failed') {
      // Handle failed jobs
      console.error('Job failed:', jobStatus.error);
      setIsProcessing(false);
      // Keep the uploader visible so user can try again
      setShowUploader(true);
    }
  }

  // Query for favicon sets
  const { data: faviconSets, refetch } = useQuery({
    queryKey: ['/api/favicon-sets'],
    queryFn: async () => {
      const response = await fetch('/api/favicon-sets');
      if (!response.ok) throw new Error('Failed to fetch favicon sets');
      return await response.json();
    },
    // Only enabled after processing is complete to fetch the latest results
    enabled: !isProcessing && currentJobId !== null,
  });

  // Function to handle reset and convert more
  const handleReset = () => {
    setShowUploader(true);
    queryClient.invalidateQueries({ queryKey: ['/api/favicon-sets'] });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Features />
      <section id="tool" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Convert Your Images to Favicons</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Upload your images below and we'll convert them to favicon format in multiple sizes. 
              You can upload multiple files at once.
            </p>
          </div>
          
          {!isProcessing && showUploader && (
            <ImageUploader 
              onUploadStart={(totalFiles) => {
                setIsProcessing(true);
                setProgress(0);
              }}
              onJobCreated={(jobId) => {
                setCurrentJobId(jobId);
              }}
            />
          )}
          
          {isProcessing && (
            <ProcessingArea 
              progress={progress} 
              totalFiles={jobStatus?.totalImages || 0}
              processedFiles={jobStatus?.completedImages || 0}
            />
          )}
          
          {!isProcessing && !showUploader && faviconSets && faviconSets.length > 0 && (
            <ResultsArea 
              faviconSets={faviconSets}
              onReset={handleReset}
            />
          )}
        </div>
      </section>
      <FAQ />
      <About />
      <Footer />
    </div>
  );
}
