import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How to create a Google knowledge graph?",
    answer: "Create a Google Knowledge Graph by building an authoritative online presence with schema.org markup, verified social profiles, Wikipedia entries, and consistent citations across the web. Graphlynk automates this process with SEO-optimized profiles, JSON-LD schema generation, and knowledge graph metrics tracking."
  },
  {
    question: "Does Google have a knowledge graph?",
    answer: "Yes, Google's Knowledge Graph is a knowledge base that enhances search results with semantic information gathered from various sources. It powers the information panels you see on the right side of search results for people, places, organizations, and things."
  },
  {
    question: "Is Google Knowledge Graph API free?",
    answer: "Google's Knowledge Graph Search API has a free tier with limited queries per day. For production applications and higher query volumes, paid plans are available. Graphlynk provides built-in search tracking and knowledge graph monitoring without requiring direct API access."
  },
  {
    question: "How to create a Google graph?",
    answer: "To appear in Google's Knowledge Graph, establish a strong digital footprint with: verified social media profiles, structured data markup (JSON-LD), authoritative backlinks, Wikipedia presence, and consistent NAP (Name, Address, Phone) information. Graphlynk simplifies this with automated schema markup, profile optimization, and SEO tools designed specifically for Knowledge Graph visibility."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-8 text-primary-foreground bg-primary" data-testid="section-faq">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-normal" data-testid="text-faq-title">
            People also ask
          </h2>
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="More options"
            data-testid="button-faq-options"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>

        <div className="space-y-0">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-gray-600 last:border-b-0"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-5 flex items-center justify-between gap-4 px-4 -mx-4 text-justify relative overflow-hidden group transition-all duration-300"
                data-testid={`faq-question-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b3d84]/10 to-[#9FF2FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="text-base font-normal flex-1 relative z-10 group-hover:text-white transition-colors duration-200">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-all duration-200 relative z-10 group-hover:text-[#9FF2FF] ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div 
                  className="pb-5 px-4 -mx-4 animate-in fade-in slide-in-from-top-2 duration-200"
                  data-testid={`faq-answer-${index}`}
                >
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
