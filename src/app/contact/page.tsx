'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Heart } from 'lucide-react';

export default function ContactPage() {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-light mb-4 text-gray-900">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We're here to help you on your crystal journey. Get in touch with any questions or guidance you need.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="celestial-card p-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Send us a Message</h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors resize-none"
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
              <h2 className="text-2xl font-medium text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">hello@celestialcrystals.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">123 Crystal Lane<br />Healing Heights, CA 90210</p>
                    <p className="text-sm text-gray-500">By appointment only</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9AM - 6PM EST</p>
                    <p className="text-gray-600">Saturday: 10AM - 4PM EST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="celestial-card p-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">Quick Help</h2>

              <div className="space-y-4">
                <a
                  href="/faq"
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors group"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600 group-hover:text-gray-900">Frequently Asked Questions</span>
                </a>

                <a
                  href="/shipping"
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors group"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600 group-hover:text-gray-900">Shipping & Returns</span>
                </a>

                <a
                  href="/birthdate-guide"
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors group"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600 group-hover:text-gray-900">Crystal Guidance</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="celestial-card p-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Follow Our Journey</h2>
              <p className="mb-6 text-gray-600">
                Join our community for daily crystal wisdom, healing tips, and exclusive offers.
              </p>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-600">f</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-600">ig</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-600">p</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
