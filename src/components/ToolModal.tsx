import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import { Tool, ToolType } from '../types';
import { fileNames } from './sharedFiles';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: Tool) => void;
  tool: Tool | null;
  viewMode?: boolean;
}

Modal.setAppElement('#root');

const toolTypes: ToolType[] = [
  'postgres',
  'pdf',
  'csv',
  'txt',
  'json',
  'xml',
  'docx',
  'mdx',
  'browser',
  'website-search',
  'scrape-website',
  'scrape-element',
  'firecrawl-search',
  'firecrawl-crawl',
  'firecrawl-scrape',
  'dalle',
  'vision',
  'code-interpreter',
  'code-docs',
  'github',
  'youtube-channel',
  'youtube-video',
  'rag',
  'exa',
  'directory',
  'directory-read'
];

export default function ToolModal({ isOpen, onClose, onSave, tool, viewMode }: ToolModalProps) {
  const [formData, setFormData] = useState<Partial<Tool>>({
    name: '',
    description: '',
    type: 'postgres'
  });

  const [selectedFiles, setSelectedFiles] = useState<number[]>(
    tool?.type === 'rag' ? tool.config?.selectedFiles || [] : []
  );

  useEffect(() => {
    if (tool) {
      setFormData(tool);
    } else {
      setFormData({ name: '', description: '', type: 'postgres' });
    }
  }, [tool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Tool);
  };

  const renderToolSpecificFields = () => {
    switch (formData.type) {
      case 'postgres':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <input
                type="text"
                value={formData.config?.host || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, host: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input
                type="number"
                value={formData.config?.port || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, port: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
              <input
                type="text"
                value={formData.config?.database || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, database: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.config?.username || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, username: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.config?.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, password: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
          </>
        );

      case 'rag':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
              <select
                value={selectedFiles.map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                  setSelectedFiles(selected);
                  setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      selectedFiles: selected
                    }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={viewMode}
              >
                {fileNames.map((fileName, index) => (
                  <option key={index} value={index}>
                    {fileName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fetch Chunk Size</label>
              <input
                type="number"
                value={formData.config?.fetchChunkSize || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    fetchChunkSize: parseInt(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
          </>
        );

      case 'pdf':
      case 'csv':
      case 'txt':
      case 'json':
      case 'xml':
      case 'docx':
      case 'mdx':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
              <input
                type="number"
                value={formData.config?.maxFileSize || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, maxFileSize: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Extensions</label>
              <input
                type="text"
                value={formData.config?.allowedExtensions?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    allowedExtensions: e.target.value.split(',').map(ext => ext.trim())
                  }
                })}
                placeholder="e.g., .pdf, .txt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
          </>
        );

      case 'dalle':
      case 'vision':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={formData.config?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, apiKey: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                value={formData.config?.model || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, model: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                value={formData.config?.maxTokens || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, maxTokens: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={viewMode}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl outline-none max-h-[90vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex flex-col h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {viewMode ? 'View Tool' : tool ? 'Edit Tool' : 'Create New Tool'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={viewMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={viewMode}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tool Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({
                  ...formData,
                  type: e.target.value as "directory" | "directory-read",
                  config: {} // Reset config when type changes
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={viewMode}
              >
                {toolTypes.map(type => (
                  <option key={type} value={type}>
                    {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {renderToolSpecificFields()}
          </form>
        </div>

        {!viewMode && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {tool ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}