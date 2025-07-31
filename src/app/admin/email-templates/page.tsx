'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, Send, Edit, RefreshCw, X, Save } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  variables: string[];
  subject?: string;
  html?: string;
}

interface TemplatePreview {
  type: string;
  subject: string;
  html: string;
  text: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [message, setMessage] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showBulkSender, setShowBulkSender] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const previewTemplateHandler = async (templateId: string) => {
    try {
      setPreviewLoading(true);
      const response = await fetch(`/api/admin/email-templates?type=${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setPreviewTemplate(data.template);
      }
    } catch (error) {
      console.error('Error previewing template:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const sendTestEmail = async (templateType: string) => {
    if (!testEmail) {
      setMessage('Please enter a test email address');
      return;
    }

    try {
      setSendingTest(true);
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateType,
          testEmail
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(`✅ Test email sent to ${testEmail}`);
      } else {
        setMessage(`❌ Failed to send test email: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage('Error sending test email');
    } finally {
      setSendingTest(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const editTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEmailSubject(template.subject || '');
    setEmailContent(template.html || '');
    setShowEditor(true);
  };

  const saveTemplate = async () => {
    if (!editingTemplate) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          html: emailContent,
        }),
      });

      if (response.ok) {
        setMessage('✅ Template updated successfully!');
        setShowEditor(false);
        fetchTemplates();
      } else {
        setMessage('❌ Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      setMessage('❌ Error updating template');
    }
  };

  const sendBulkEmail = async () => {
    if (!emailSubject || !emailContent) {
      setMessage('❌ Please enter subject and content');
      return;
    }

    try {
      const response = await fetch('/api/admin/email-templates/bulk-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          html: emailContent,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Bulk email sent to ${result.count} recipients!`);
        setShowBulkSender(false);
      } else {
        setMessage(`❌ Failed to send bulk email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending bulk email:', error);
      setMessage('❌ Error sending bulk email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .email-preview-container {
          /* Email container styling */
          position: relative;
          overflow: hidden;
        }
        .email-preview-container * {
          box-sizing: border-box;
        }
        .email-preview-container img {
          max-width: 100% !important;
          height: auto !important;
          display: block;
        }
        .email-preview-container table {
          width: 100% !important;
          border-collapse: collapse;
        }
        /* Fix celestial header margins */
        .email-preview-container .celestial-header {
          margin: -20px -20px 20px -20px !important;
          border-radius: 8px 8px 0 0 !important;
        }
        /* Fix discount box margins */
        .email-preview-container .discount-box {
          margin: 20px 0 !important;
        }
        /* Override problematic negative margins from email templates */
        .email-preview-container [style*="margin: -40px"] {
          margin: -20px -20px 20px -20px !important;
        }
        /* Ensure email content uses full width */
        .email-preview-container > div {
          width: 100% !important;
          max-width: none !important;
        }
        /* Override ALL email template width constraints */
        .email-preview-container body {
          max-width: none !important;
          width: 100% !important;
        }
        .email-preview-container .email-container {
          max-width: none !important;
          width: 100% !important;
        }
        .email-preview-container [style*="max-width: 600px"] {
          max-width: none !important;
        }
        .email-preview-container [style*="max-width:600px"] {
          max-width: none !important;
        }
        .email-preview-container table {
          width: 100% !important;
          max-width: none !important;
        }
        /* Ensure proper spacing for email elements */
        .email-preview-container > div:first-child {
          margin-top: 0 !important;
        }
        .email-preview-container > div:last-child {
          margin-bottom: 0 !important;
        }
        /* Fix grid layouts in email */
        .email-preview-container [style*="display: grid"] {
          display: block !important;
          width: 100% !important;
        }
        .email-preview-container [style*="grid-template-columns"] > div {
          display: block !important;
          width: 100% !important;
          margin: 10px 0 !important;
          vertical-align: top;
        }
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .email-preview-container {
            padding: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .email-preview-container [style*="grid-template-columns"] > div {
            width: 100% !important;
            display: block !important;
          }
          .email-preview-container {
            padding: 12px !important;
            font-size: 14px !important;
          }
        }
        /* Scrollbar styling for preview */
        .email-preview-container::-webkit-scrollbar {
          width: 6px;
        }
        .email-preview-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .email-preview-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .email-preview-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
                <p className="mt-2 text-gray-600">Create, preview, and test your email campaigns</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowBulkSender(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Bulk Email</span>
                </button>
                <div className="bg-green-50 px-3 py-1 rounded-full">
                  <span className="text-green-700 text-sm font-medium">{templates.length} Templates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 py-8">

          {message && (
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {message.includes('✅') ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✅</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">❌</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-800 font-medium">{message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Templates List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your automated email campaigns</p>
                </div>

                <div className="p-6">
                  <div className="grid gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {template.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {template.variables.length} variables
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {template.variables.map((variable) => (
                              <span key={variable} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                <span className="mr-1">$</span>{variable}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => previewTemplateHandler(template.id)}
                            disabled={previewLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => editTemplate(template)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => sendTestEmail(template.id)}
                            disabled={sendingTest || !testEmail}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                            <span>{sendingTest ? 'Sending...' : 'Send Test'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Test Email Input */}
                  <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Send className="w-4 h-4 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Test Email</h3>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Enter email address to send test emails
                    </label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="admin@thecelestial.xyz"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Template Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8 min-h-[600px]">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                      <p className="text-sm text-gray-600 mt-1">Live template preview</p>
                    </div>
                    {previewTemplate && (
                      <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => setPreviewMode('desktop')}
                          className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${previewMode === 'desktop'
                            ? 'bg-white text-gray-900 shadow-sm transform scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                          🖥️ Desktop
                        </button>
                        <button
                          onClick={() => setPreviewMode('mobile')}
                          className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${previewMode === 'mobile'
                            ? 'bg-white text-gray-900 shadow-sm transform scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                          📱 Mobile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {previewLoading ? (
                    <div className="text-center py-12">
                      <div className="relative">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading preview...</p>
                      <p className="text-gray-400 text-sm mt-1">Generating email template</p>
                    </div>
                  ) : previewTemplate ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-gray-900 font-medium">{previewTemplate.subject}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
                        <div className="border rounded-lg bg-gray-50 max-h-[500px] lg:max-h-[700px] overflow-y-auto shadow-inner">
                          <div className="bg-white rounded shadow-sm">
                            {/* Mock Email Client Header */}
                            <div className="bg-gray-100 px-4 py-3 rounded-t-lg border-b border-gray-200 mb-0">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">C</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">CELESTIAL</div>
                                    <div className="text-gray-500 text-xs">noreply@thecelestial.xyz</div>
                                  </div>
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {new Date().toLocaleDateString()}
                                </div>
                              </div>
                              <div className="mt-2 font-medium text-gray-900">
                                {previewTemplate.subject}
                              </div>
                            </div>

                            {/* Email Content */}
                            <div
                              className="email-preview-container"
                              style={{
                                padding: '20px',
                                margin: '0',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#333',
                                backgroundColor: '#ffffff',
                                minHeight: '400px',
                                borderRadius: '0 0 8px 8px',
                                width: '100%',
                                transition: 'all 0.3s ease'
                              }}
                              dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <Mail className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Selected</h3>
                      <p className="text-gray-600 mb-4">Click "Preview" on any template to see it here</p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span>Desktop and mobile views available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Template Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Email Template</h2>
              <button
                onClick={() => setShowEditor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email subject..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content (HTML)
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter HTML content..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Sender Modal */}
      {showBulkSender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Send Bulk Email</h2>
              <button
                onClick={() => setShowBulkSender(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    This will send the email to all registered users and newsletter subscribers.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email subject..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content (HTML)
                  </label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter HTML content..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowBulkSender(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendBulkEmail}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send to All Users</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
