'use client';

import React, { useState, useRef, useEffect } from 'react';
import '../styles/editor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
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
  X,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo
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
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize title input
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title]);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-2',
        'data-placeholder': 'Start writing your blog post...',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  // Toolbar button handlers
  const addImage = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter the URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
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
        // Insert image into editor
        addImage(data.imageUrl);
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
    if (!editor) return;
    const content = editor.getHTML();
    const excerpt = generateExcerpt(content);
    onSave?.({ title, content, excerpt });
  };

  const handlePreview = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const excerpt = generateExcerpt(content);
    onPreview?.({ title, content, excerpt });
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

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
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          {/* Undo/Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
              }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
              }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
              }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('underline') ? 'bg-gray-200' : ''
              }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''
              }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Quote and Code */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''
              }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''
              }`}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
              }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
              }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
              }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Media */}
          <button
            onClick={() => setShowImageUpload(true)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            onClick={editor.isActive('link') ? removeLink : addLink}
            className={`p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 ${editor.isActive('link') ? 'bg-gray-200' : ''
              }`}
            title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
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
        <div className="min-h-[400px] border border-gray-200 rounded-lg">
          <EditorContent
            editor={editor}
            className="min-h-[400px] text-gray-800 leading-relaxed"
          />
        </div>
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
