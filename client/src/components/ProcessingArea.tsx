import { Progress } from "@/components/ui/progress";

interface ProcessingAreaProps {
  progress: number;
  totalFiles: number;
  processedFiles: number;
}

export default function ProcessingArea({ progress, totalFiles, processedFiles }: ProcessingAreaProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8 max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Converting Images</h3>
      <Progress value={progress} className="h-2.5 mb-4" />
      <p className="text-sm text-gray-600">
        Processing {processedFiles} of {totalFiles} images...
      </p>
    </div>
  );
}
