import { Check, Download, Settings, Layers } from "lucide-react";

const features = [
  {
    title: "Bulk Processing",
    description: "Convert multiple images at once, saving you time and effort.",
    icon: Layers
  },
  {
    title: "Multiple Sizes",
    description: "Generate icons in 16x16, 32x32, and 48x48 pixel sizes automatically.",
    icon: Settings
  },
  {
    title: "One-Click Download",
    description: "Download all generated favicons together in a convenient zip file.",
    icon: Download
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Generator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary rounded-full mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
