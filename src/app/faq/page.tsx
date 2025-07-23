'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles, Shield, Truck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: 'Crystal Information',
      icon: Sparkles,
      faqs: [
        {
          question: 'Are your crystals authentic and natural?',
          answer: 'Yes, all our crystals are 100% authentic and natural. We source directly from trusted suppliers and each crystal is carefully inspected for quality and authenticity before being added to our collection.'
        },
        {
          question: 'How do I choose the right crystal for me?',
          answer: 'You can choose crystals based on your birthdate using our personalized guide, by the properties you\'re seeking (like protection or love), or simply by what you\'re drawn to intuitively. Trust your instincts - the right crystal often chooses you!'
        },
        {
          question: 'How do I cleanse and charge my crystals?',
          answer: 'There are several methods: moonlight (especially full moon), sunlight (avoid for fade-prone crystals), sage smoke, running water, or placing them on selenite. Choose the method that feels right for you and your crystal.'
        },
        {
          question: 'Do crystals really work for healing?',
          answer: 'Crystals are used as complementary tools for spiritual and emotional well-being. While not scientifically proven to cure medical conditions, many people find them helpful for meditation, intention-setting, and personal growth. They should not replace medical treatment.'
        }
      ]
    },
    {
      title: 'Orders & Shipping',
      icon: Truck,
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 3-7 business days within the US. Express shipping (1-3 business days) is available for an additional fee. International shipping takes 7-14 business days.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free standard shipping on all orders over $75 within the United States. For orders under $75, shipping is $5.99.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package\'s progress on our website or the carrier\'s site.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. International shipping rates and times vary by destination. Please note that customs fees and import duties are the responsibility of the customer.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: Shield,
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your purchase, you can return it for a full refund or exchange within 30 days of delivery.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Contact our customer service team to initiate a return. We\'ll provide you with a prepaid return label and instructions. Items must be in original condition with all packaging.'
        },
        {
          question: 'Are there any items that cannot be returned?',
          answer: 'Custom or personalized items cannot be returned unless they arrive damaged or defective. All other items are eligible for return within our 30-day policy.'
        },
        {
          question: 'How long does it take to process a refund?',
          answer: 'Once we receive your returned item, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 business days.'
        }
      ]
    }
  ];

  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className={`w-12 h-12 mr-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />
            <h1 className={`text-4xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>Frequently Asked Questions</h1>
          </div>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-600'}`}>
            Find answers to common questions about our crystals, orders, and services.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 flex items-center justify-center mr-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <IconComponent className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h2 className={`text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const itemIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openItems.includes(itemIndex);

                  return (
                    <div
                      key={faqIndex}
                      className="celestial-card overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(itemIndex)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                      >
                        <span className={`font-medium pr-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                        ) : (
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-4">
                          <div className={`border-t pt-4 ${isDark ? 'border-gray-600' : 'border-gray-100'}`}>
                            <p className={`leading-relaxed ${isDark ? 'text-white' : 'text-gray-600'}`}>{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Contact Section */}
        <div className="celestial-card p-8 text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our friendly customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="celestial-button inline-flex items-center justify-center"
            >
              Contact Us
            </a>
            <a
              href="mailto:hello@celestialcrystals.com"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm uppercase tracking-wide"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
