'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Bot,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  Save,
  X,
  AlertCircle,
  Wand2,
  FileText,
  Calendar,
  Tag
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIBlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: 'draft' | 'review' | 'published';
  createdAt: string;
  isAIGenerated?: boolean;
}

export default function AIContentManager() {
  const { isDark } = useTheme();
  const [aiPosts, setAiPosts] = useState<AIBlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<AIBlogPost | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'preview' | 'edit'>('preview');
  const [editedPost, setEditedPost] = useState<AIBlogPost | null>(null);
  const [message, setMessage] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    fetchAIPosts();
  }, []);

  const fetchAIPosts = async () => {
    try {
      const response = await fetch('/api/admin/ai-content');
      if (response.ok) {
        const data = await response.json();
        setAiPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching AI posts:', error);
    }
  };

  const generateNewPost = async (useCustomPrompt = false) => {
    setLoading(true);
    setMessage('');

    try {
      const requestBody = useCustomPrompt && customPrompt
        ? {
          customPrompt,
          type: 'blog'
        }
        : {
          topic: 'crystal healing and properties',
          type: 'educational'
        };

      const response = await fetch('/api/admin/ai-content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setAiPosts(prev => [data.post, ...prev]);
        setMessage('✨ New AI blog post generated successfully!');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('❌ Failed to generate blog post');
      }
    } catch (error) {
      setMessage('❌ Error generating blog post');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this AI-generated post?')) return;

    try {
      const response = await fetch(`/api/admin/ai-content/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAiPosts(prev => prev.filter(p => p.id !== postId));
        setMessage('🗑️ Post deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error deleting post');
    }
  };

  const publishPost = async (post: AIBlogPost) => {
    try {
      const response = await fetch('/api/admin/ai-content/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.tags
        }),
      });

      if (response.ok) {
        setAiPosts(prev => prev.map(p =>
          p.id === post.id ? { ...p, status: 'published' } : p
        ));
        setMessage('🚀 Post published to blog successfully!');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage('❌ Error publishing post');
    }
  };

  const saveEditedPost = async () => {
    if (!editedPost) return;

    try {
      const response = await fetch(`/api/admin/ai-content/${editedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPost),
      });

      if (response.ok) {
        setAiPosts(prev => prev.map(p =>
          p.id === editedPost.id ? editedPost : p
        ));
        setSelectedPost(editedPost);
        setMessage('💾 Post updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error saving post');
    }
  };

  const openModal = (post: AIBlogPost, mode: 'preview' | 'edit') => {
    setSelectedPost(post);
    setEditedPost({ ...post });
    setModalMode(mode);
    setShowModal(true);
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    published: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusIcons = {
    draft: Clock,
    review: AlertCircle,
    published: CheckCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Content Manager
          </h2>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Generate, edit, and publish AI-created blog posts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
          >
            <Edit className="w-4 h-4" />
            <span>Custom Prompt</span>
          </button>

          <button
            onClick={() => generateNewPost(false)}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${isDark
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>🤖 Generate with DeepSeek AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border ${message.includes('❌')
          ? isDark
            ? 'bg-red-900/50 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-700'
          : isDark
            ? 'bg-green-900/50 border-green-700 text-green-300'
            : 'bg-green-50 border-green-200 text-green-700'
          }`}>
          {message}
        </div>
      )}

      {/* Custom Prompt Section */}
      {showCustomPrompt && (
        <div className={`p-6 rounded-2xl shadow-sm border ${isDark
          ? 'bg-gray-800/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
          }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🎯 Custom AI Prompt
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Describe what you want the AI to write about:
              </label>
              <textarea
                rows={4}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Example: Write a comprehensive guide about using crystals for meditation, including specific techniques for different crystals and how to create a crystal meditation space..."
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                  ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => generateNewPost(true)}
                disabled={loading || !customPrompt.trim()}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${isDark
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Custom Content</span>
              </button>
              <button
                onClick={() => {
                  setShowCustomPrompt(false);
                  setCustomPrompt('');
                }}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiPosts.map((post) => {
          const StatusIcon = statusIcons[post.status];
          return (
            <div
              key={post.id}
              className={`p-6 rounded-2xl shadow-sm border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${isDark
                ? 'bg-gray-800/80 border-gray-700/50 shadow-purple-900/20'
                : 'bg-white/80 border-gray-200/50 shadow-blue-900/10'
                }`}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bot className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[post.status]}`}>
                    <StatusIcon className="w-3 h-3 inline mr-1" />
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <h3 className={`font-semibold text-lg mb-3 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                {post.title}
              </h3>

              <p className={`text-sm mb-4 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 text-xs rounded-full ${isDark
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(post, 'preview')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${isDark
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => openModal(post, 'edit')}
                  className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${isDark
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${isDark
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Publish Button */}
              {post.status !== 'published' && (
                <button
                  onClick={() => publishPost(post)}
                  className={`w-full mt-3 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${isDark
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Blog</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {aiPosts.length === 0 && (
        <div className={`text-center py-12 ${isDark
          ? 'bg-gray-800/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/50'
          } rounded-2xl border`}>
          <Bot className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No AI content yet
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Generate your first AI blog post to get started
          </p>
        </div>
      )}

      {/* Preview/Edit Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
            } border`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
              <div className="flex items-center space-x-3">
                <Bot className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {modalMode === 'edit' ? 'Edit AI Post' : 'Preview AI Post'}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setModalMode(modalMode === 'edit' ? 'preview' : 'edit')}
                  className={`p-2 rounded-lg transition-colors ${isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {modalMode === 'edit' ? <Eye className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isDark
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalMode === 'preview' ? (
                <div className="space-y-6">
                  <div>
                    <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPost.title}
                    </h1>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(selectedPost.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bot className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={`text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                          AI Generated
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => (
                          <img
                            {...props}
                            className="w-full h-auto rounded-lg shadow-lg my-8"
                            loading="lazy"
                          />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 {...props} className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 {...props} className={`text-3xl font-semibold mb-4 mt-8 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className={`text-2xl font-medium mb-3 mt-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul {...props} className={`mb-4 pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className={`mb-4 pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="list-disc" />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong {...props} className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote {...props} className={`border-l-4 border-purple-500 pl-4 italic my-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                        ),
                      }}
                    >
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-sm rounded-full ${isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={editedPost?.title || ''}
                      onChange={(e) => setEditedPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Excerpt
                    </label>
                    <textarea
                      rows={3}
                      value={editedPost?.excerpt || ''}
                      onChange={(e) => setEditedPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Content
                    </label>
                    <textarea
                      rows={12}
                      value={editedPost?.content || ''}
                      onChange={(e) => setEditedPost(prev => prev ? { ...prev, content: e.target.value } : null)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editedPost?.tags.join(', ') || ''}
                      onChange={(e) => setEditedPost(prev => prev ? {
                        ...prev,
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      } : null)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${isDark
                        ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      placeholder="crystal healing, meditation, chakras"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`flex justify-end space-x-4 p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
              <button
                onClick={() => setShowModal(false)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
              >
                Close
              </button>
              {modalMode === 'edit' && (
                <button
                  onClick={saveEditedPost}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                    }`}
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              )}
              {selectedPost.status !== 'published' && (
                <button
                  onClick={() => publishPost(selectedPost)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isDark
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Publish to Blog</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
