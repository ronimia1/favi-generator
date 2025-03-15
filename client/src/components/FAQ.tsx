import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is a favicon?",
    answer: "A favicon is a small icon associated with a website or webpage. It appears in browser tabs, bookmarks, and history lists to help users identify a site visually. Favicons are typically 16x16, 32x32, or 48x48 pixels in size."
  },
  {
    question: "Which image formats can I convert to favicon?",
    answer: "Our tool supports JPG, JPEG, PNG, GIF, and SVG formats for conversion to favicon. For best results, we recommend using images with a 1:1 aspect ratio."
  },
  {
    question: "How many images can I convert at once?",
    answer: "You can convert up to 20 images at once with our bulk converter. Each image will be processed and converted to favicons in multiple sizes (16x16, 32x32, and 48x48 pixels)."
  },
  {
    question: "How do I add a favicon to my website?",
    answer: (
      <div>
        <p className="text-gray-700">After downloading your favicon, upload it to your website's root directory. Then add the following code in your HTML's &lt;head&gt; section:</p>
        <pre className="bg-gray-800 text-gray-200 p-3 rounded-md mt-2 text-sm overflow-x-auto">
          <code>&lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;</code>
        </pre>
        <p className="text-gray-700 mt-3">You can also specify different sizes:</p>
        <pre className="bg-gray-800 text-gray-200 p-3 rounded-md mt-2 text-sm overflow-x-auto">
          <code>&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;</code>
        </pre>
      </div>
    )
  },
  {
    question: "Is there a file size limit?",
    answer: "Yes, each image must be under 5MB in size. This limit ensures optimal performance while still allowing high-quality favicon generation."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible defaultValue="item-0">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-50 text-gray-700">
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
