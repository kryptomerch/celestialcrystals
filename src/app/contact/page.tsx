'use client';

import { useState } from 'react';
import { Mail, Send, MessageCircle, HelpCircle, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ContactPage() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl font-light mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us</h1>
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-600'}`}>
            We're here to help you on your crystal journey. Get in touch with any questions or guidance you need.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="celestial-card p-8">
            <h2 className={`text-2xl font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send us a Message</h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
                  <Send className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                <p className={`mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className={`font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 transition-colors ${isDark
                        ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                        }`}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 transition-colors ${isDark
                        ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                        }`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 transition-colors ${isDark
                      ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                      }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="crystal-guidance">Crystal Guidance</option>
                    <option value="order-inquiry">Order Inquiry</option>
                    <option value="product-question">Product Question</option>
                    <option value="shipping">Shipping & Returns</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 border focus:outline-none focus:ring-1 transition-colors resize-none ${isDark
                      ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500 focus:border-purple-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-gray-400 focus:border-gray-400'
                      }`}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="celestial-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="celestial-card p-8">
              <h2 className={`text-2xl font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Mail className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Us</h3>
                    <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>hello@thecelestial.xyz</p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <MessageCircle className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Chat Support</h3>
                    <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>Available on our website</p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Real-time assistance for your crystal journey</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Heart className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Crystal Guidance</h3>
                    <p className={`${isDark ? 'text-white' : 'text-gray-600'}`}>Personalized crystal recommendations</p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Let us help you find your perfect crystal match</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="celestial-card p-8">
              <h2 className={`text-2xl font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Help</h2>

              <div className="space-y-4">
                <a
                  href="/faq"
                  className={`flex items-center space-x-3 p-3 transition-colors group ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <HelpCircle className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`${isDark ? 'text-white group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-900'}`}>Frequently Asked Questions</span>
                </a>

                <a
                  href="/shipping"
                  className={`flex items-center space-x-3 p-3 transition-colors group ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <MessageCircle className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`${isDark ? 'text-white group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-900'}`}>Shipping & Returns</span>
                </a>

                <a
                  href="/birthdate-guide"
                  className={`flex items-center space-x-3 p-3 transition-colors group ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <Heart className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`${isDark ? 'text-white group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-900'}`}>Crystal Guidance</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="celestial-card p-8">
              <h2 className={`text-2xl font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Follow Our Journey</h2>
              <p className={`mb-6 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                Join our community for daily crystal wisdom, healing tips, and exclusive offers.
              </p>

              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/zenwithcelestial/profilecard/?igsh=MWRscW9sbmk2MGFsZw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  title="Follow us on Instagram"
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>ig</span>
                </a>
                <a
                  href="https://x.com/Celesti95282006?t=6LRLq3UIPAT-xinuQfw8yw&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  title="Follow us on Twitter/X"
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>x</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
