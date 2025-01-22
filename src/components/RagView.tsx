import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload, X, Pencil, Trash2 } from 'lucide-react';
import { fileNames } from './sharedFiles';

interface RAGFile {
  id: number;
  knowledgeBaseName: string;
  description: string;
  fileName: string;
  uploadDate: string;
}

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}

function DeleteConfirmation({ isOpen, onClose, onConfirm, fileName }: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90%]">
        <h2 className="text-xl font-semibold mb-4">Delete Confirmation</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{fileName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: Omit<RAGFile, 'id' | 'uploadDate'>) => void;
  editFile?: RAGFile;
}


export default function RAGComponent() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<RAGFile | undefined>();
  const [files, setFiles] = useState<RAGFile[]>(() => {
    const savedFiles = localStorage.getItem('ragFiles');
    return savedFiles ? JSON.parse(savedFiles) : [
      {
        id: 1,
        knowledgeBaseName: 'Company Policies',
        description: 'Internal company policies and procedures',
        fileName: 'policies.pdf',
        uploadDate: '2024-02-20'
      },
      {
        id: 2,
        knowledgeBaseName: 'Technical Documentation',
        description: 'API documentation and technical guides',
        fileName: 'tech-docs.pdf',
        uploadDate: '2024-02-19'
      }
    ];
  });

  useEffect(() => {
    fileNames.length = 0; // Clear the array
    files.forEach(file => fileNames.push(file.knowledgeBaseName));
    localStorage.setItem('ragFiles', JSON.stringify(files));
  }, [files]);

  const handleUpload = (data: Omit<RAGFile, 'id' | 'uploadDate'>) => {
    if (editingFile) {
      // Update existing file
      setFiles(files.map(file => 
        file.id === editingFile.id
          ? { ...file, ...data }
          : file
      ));
    } else {
      // Add new file
      const newFile: RAGFile = {
        ...data,
        id: files.length + 1,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setFiles([...files, newFile]);
    }
    setEditingFile(undefined);
  };

  const handleEdit = (file: RAGFile) => {
    setEditingFile(file);
    setIsUploadModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setEditingFile(undefined);
  };

  return (
    <div className="bg-gray">
      <div className="bg-gray">
        <h1 className="text-2xl font-bold text-gray-800">RAG</h1>
      </div>
      <RAGList
        files={files}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onEditFile={handleEdit}
        onDeleteFile={handleDelete}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModal}
        onUpload={handleUpload}
        editFile={editingFile}
      />
    </div>
  );
}


function UploadModal({ isOpen, onClose, onUpload, editFile }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [knowledgeBaseName, setKnowledgeBaseName] = useState(editFile?.knowledgeBaseName || '');
  const [description, setDescription] = useState(editFile?.description || '');
  const [existingFileName, setExistingFileName] = useState(editFile?.fileName || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editFile) {
      setKnowledgeBaseName(editFile.knowledgeBaseName);
      setDescription(editFile.description);
      setExistingFileName(editFile.fileName);
    }
  }, [editFile]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
      setFile(droppedFile);
      setExistingFileName('');
    }
  };

  const handleSubmit = () => {
    if ((file || existingFileName) && knowledgeBaseName && description) {
      onUpload({
        fileName: file ? file.name : existingFileName,
        knowledgeBaseName,
        description
      });
      onClose();
      setFile(null);
      setKnowledgeBaseName('');
      setDescription('');
      setExistingFileName('');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExistingFileName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editFile ? 'Edit RAG File' : 'Upload RAG File'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed border-blue-300 rounded-lg p-8 mb-4 text-center ${
            !file && !existingFileName ? 'block' : 'hidden'
          }`}
        >
          <Upload className="mx-auto mb-2 text-blue-500" size={32} />
          <p className="text-gray-600 mb-2">Drag and Drop file</p>
          <p className="text-gray-400 mb-2">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Browse
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.txt"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setExistingFileName('');
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">Supported files: PDF, TXT</p>
        </div>

        {(file || existingFileName) && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <span className="text-gray-700">
              {file ? file.name : existingFileName}
            </span>
            <button
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Knowledge Base Name
            </label>
            <input
              type="text"
              value={knowledgeBaseName}
              onChange={(e) => setKnowledgeBaseName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter knowledge base name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={(!file && !existingFileName) || !knowledgeBaseName || !description}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {editFile ? 'Save Changes' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RAGListProps {
  files: RAGFile[];
  onUploadClick: () => void;
  onEditFile: (file: RAGFile) => void;
  onDeleteFile: (id: number) => void;
}

function RAGList({ files, onUploadClick, onEditFile, onDeleteFile }: RAGListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToDelete, setFileToDelete] = useState<RAGFile | null>(null);

  const filteredFiles = files.filter(
    (file) =>
      file.knowledgeBaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-9">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-[300px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Upload size={20} />
          Upload
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Knowledge Base Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.knowledgeBaseName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{file.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.fileName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.uploadDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => onEditFile(file)}
                    className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setFileToDelete(file)}
                    className="text-red-500 hover:text-red-700 inline-flex items-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmation
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={() => {
          if (fileToDelete) {
            onDeleteFile(fileToDelete.id);
            setFileToDelete(null);
          }
        }}
        fileName={fileToDelete?.fileName || ''}
      />
    </div>
  );
}
