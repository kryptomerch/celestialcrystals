'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Quote,
  List,
  ListOrdered,
  Code,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  Eye,
  Upload,
  X
} from 'lucide-react';

interface BlogEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave?: (content: { title: string; content: string; excerpt: string }) => void;
  onPreview?: (content: { title: string; content: string; excerpt: string }) => void;
}

export default function BlogEditor({ 
  initialContent = '', 
  initialTitle = '',
  onSave,
  onPreview 
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize title input
  const titleRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Insert image into content
        const imageHtml = `<div class="image-container my-6">
          <img src="${data.imageUrl}" alt="Blog image" class="w-full rounded-lg shadow-sm" />
        </div>`;
        
        if (contentRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createRange().createContextualFragment(imageHtml));
          } else {
            contentRef.current.innerHTML += imageHtml;
          }
          setContent(contentRef.current.innerHTML);
        }
        setShowImageUpload(false);
      } else {
        alert('Failed to upload image: ' + data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const generateExcerpt = (content: string): string => {
    // Remove HTML tags and get first 160 characters
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 160 ? textContent.substring(0, 160) + '...' : textContent;
  };

  const handleSave = () => {
    const excerpt = generateExcerpt(content);
    onSave?.({ title, content, excerpt });
  };

  const handlePreview = () => {
    const excerpt = generateExcerpt(content);
    onPreview?.({ title, content, excerpt });
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
      {/* Toolbar */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Blog Editor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center space-x-1 flex-wrap">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => executeCommand(button.command, button.value)}
              className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <button
            onClick={() => setShowImageUpload(true)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              const url = prompt('Enter link URL:');
              if (url) executeCommand('createLink', url);
            }}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>

          <select
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-sm"
            defaultValue=""
          >
            <option value="">Format</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Paragraph</option>
          </select>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6">
        {/* Title Input */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none overflow-hidden mb-6"
          rows={1}
        />

        {/* Content Editor */}
        <div
          ref={contentRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          className="min-h-[400px] text-gray-800 leading-relaxed outline-none prose prose-lg max-w-none"
          style={{ 
            fontSize: '18px',
            lineHeight: '1.6'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
          suppressContentEditableWarning={true}
        />

        {content.length === 0 && (
          <div className="absolute top-32 left-6 text-gray-400 text-lg pointer-events-none">
            Start writing your blog post...
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Image</h3>
              <button
                onClick={() => setShowImageUpload(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Click to upload an image</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {isUploading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-blue-600">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
