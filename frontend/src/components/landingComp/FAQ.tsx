import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I start saving links?",
    answer:
      "Install our browser extension and click the Second icon whenever you want to save a link. You can also manually add links through our web interface.",
  },
  {
    question: "What platforms are supported?",
    answer:
      "We currently support YouTube and Twitter, with LinkedIn and Pinterest integration coming soon. You can save links from any website!",
  },
  {
    question: "Can I share my collections with others?",
    answer:
      "Yes! You can share individual links or entire collections with anyone, even if they don't have a Second account.",
  },
  {
    question: "Is there a limit to how many links I can save?",
    answer:
      "Free accounts can save up to 100 links per month. Pro and Enterprise plans have unlimited link saving capabilities.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white animate__animated animate__fadeIn">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-purple-600/80 to-purple-400/90  text-transparent bg-clip-text">
              Questions
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Everything you need to know about Second
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-xl overflow-hidden animate__animated animate__fadeInUp"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <button
                className="faq-button w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-white font-medium">{faq.question}</span>
                <svg
                  className={`faq-icon w-6 h-6 text-gray-400 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`faq-answer px-6 py-4 bg-neutral-700/50 ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
