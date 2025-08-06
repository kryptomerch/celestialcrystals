'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import { ArrowLeft, Save, Eye, Globe } from 'lucide-react';

export default function BlogEditorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'General',
    tags: '',
    featuredImage: '',
    status: 'draft'
  });

  // Load existing blog post if editing
  useEffect(() => {
    if (editId) {
      loadBlogPost(editId);
    }
  }, [editId]);

  const loadBlogPost = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/blog-posts/preview/${id}`);
      const data = await response.json();

      if (data.success) {
        setBlogData({
          title: data.post.title,
          content: data.post.content,
          excerpt: data.post.excerpt,
          category: data.post.category,
          tags: data.post.tags?.join(', ') || '',
          featuredImage: data.post.featuredImage || '',
          status: data.post.status
        });
      } else {
        alert('Failed to load blog post');
        router.push('/admin/blog-editor');
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      alert('Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (editorData: { title: string; content: string; excerpt: string }) => {
    setIsSaving(true);
    try {
      const postData = {
        ...blogData,
        ...editorData,
        tags: blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        author: session?.user?.firstName || session?.user?.email || 'Admin',
        isAIGenerated: false
      };

      const url = editId ? `/api/admin/blog-posts/${editId}` : '/api/admin/blog-posts';
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Blog post ${editId ? 'updated' : 'created'} successfully!`);
        if (!editId) {
          router.push(`/admin/blog-editor?edit=${data.post.id}`);
        }
      } else {
        alert(`Failed to ${editId ? 'update' : 'create'} blog post: ${data.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to ${editId ? 'update' : 'create'} blog post`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = (editorData: { title: string; content: string; excerpt: string }) => {
    setPreviewData({
      ...blogData,
      ...editorData
    });
    setShowPreview(true);
  };

  const handlePublish = async () => {
    if (!editId) {
      alert('Please save the blog post first');
      return;
    }

    try {
      const response = await fetch('/api/admin/blog-posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: editId,
          action: blogData.status === 'published' ? 'unpublish' : 'publish'
        })
      });

      const data = await response.json();

      if (data.success) {
        setBlogData(prev => ({
          ...prev,
          status: data.post.status
        }));
        alert(`Blog post ${data.post.status === 'published' ? 'published' : 'unpublished'} successfully!`);
      } else {
        alert(`Failed to ${blogData.status === 'published' ? 'unpublish' : 'publish'} post: ${data.error}`);
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to update post status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/ai-blog-automation')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {editId ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {editId && (
                <button
                  onClick={handlePublish}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${blogData.status === 'published'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{blogData.status === 'published' ? 'Unpublish' : 'Publish'}</span>
                </button>
              )}

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${blogData.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}>
                {blogData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor */}
          <div className="lg:col-span-3">
            <BlogEditor
              initialTitle={blogData.title}
              initialContent={blogData.content}
              onSave={handleSave}
              onPreview={handlePreview}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={blogData.category}
                    onChange={(e) => setBlogData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Crystal Guides">Crystal Guides</option>
                    <option value="Chakra Healing">Chakra Healing</option>
                    <option value="Seasonal Healing">Seasonal Healing</option>
                    <option value="How-To Guides">How-To Guides</option>
                    <option value="Birthstone Guides">Birthstone Guides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={blogData.tags}
                    onChange={(e) => setBlogData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="crystal healing, meditation, wellness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={blogData.featuredImage}
                    onChange={(e) => setBlogData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Status</h3>
              <div className="flex items-center space-x-2">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Ready to save</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 px-6 py-4 border-b bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                  {previewData.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {previewData.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {previewData.excerpt}
              </p>

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: previewData.content }}
              />

              {previewData.tags && (
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {previewData.tags.split(',').map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
