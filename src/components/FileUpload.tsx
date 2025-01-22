// import React, { useState, useEffect } from 'react';
// import { Upload, X, FileText } from 'lucide-react';

// interface FileUploadProps {
//   onFileNamesChange: (fileNames: string[]) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onFileNamesChange }) => {
//   const [files, setFiles] = useState<Array<{
//     name: string;
//     size: string;
//     type: string;
//     id: string;
//   }>>([]);
//   const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
//   const [fileNames, setFileNames] = useState<string[]>([]);

//   useEffect(() => {
//     const names = files.map(file => file.name);
//     setFileNames(names);
//     if (onFileNamesChange) {
//       onFileNamesChange(names);
//     }
//   }, [files, onFileNamesChange]);

//   const simulateFileUpload = (fileId: string) => {
//     setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
//     const interval = setInterval(() => {
//       setUploadProgress(prev => {
//         const newProgress = (prev[fileId] || 0) + 10;
//         if (newProgress >= 100) {
//           clearInterval(interval);
//         }
//         return { ...prev, [fileId]: Math.min(newProgress, 100) };
//       });
//     }, 300);
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.currentTarget.classList.add('bg-blue-50');
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.currentTarget.classList.remove('bg-blue-50');
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.currentTarget.classList.remove('bg-blue-50');
//     handleFiles(Array.from(e.dataTransfer.files));
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       handleFiles(Array.from(e.target.files));
//     }
//   };

//   const handleFiles = (newFiles: File[]) => {
//     const validFiles = newFiles.filter(file => 
//       file.type === 'application/pdf' || file.type === 'text/plain'
//     );
    
//     const newFileEntries = validFiles.map(file => ({
//       name: file.name,
//       size: (file.size / 1024).toFixed(2),
//       type: file.type,
//       id: Math.random().toString(36).substring(7)
//     }));

//     setFiles(prev => [...prev, ...newFileEntries]);
//     newFileEntries.forEach(file => simulateFileUpload(file.id));
//   };

//   const removeFile = (fileId: string) => {
//     setFiles(files.filter(file => file.id !== fileId));
//     setUploadProgress(prev => {
//       const newProgress = { ...prev };
//       delete newProgress[fileId];
//       return newProgress;
//     });
//   };

//   const getFileIcon = (fileType: string) => {
//     return fileType === 'application/pdf' ? 'PDF' : 'TXT';
//   };

//   return (
//     <div className="h-screen flex">
//       {/* Left Side - Upload Area */}
//       <div className="w-1/2 border-r bg-gray-50 p-8 flex flex-col items-center justify-center">
//         <h1 className="text-2xl font-bold mb-8">Upload Your RAG Files</h1>
//         <div 
//           className="w-full max-w-md border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 bg-white"
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//         >
//           <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
//           <p className="text-lg mb-2">Drag and Drop file</p>
//           <p className="text-gray-500 mb-4">or</p>
//           <label className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
//             Browse
//             <input
//               type="file"
//               className="hidden"
//               accept=".pdf,.txt"
//               multiple
//               onChange={handleFileSelect}
//             />
//           </label>
//           <p className="mt-4 text-sm text-gray-500">Supported files: PDF, TXT</p>
//         </div>
//       </div>

//       {/* Right Side - File List */}
//       <div className="w-1/2 p-8">
//         <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
//         <div className="h-[calc(100vh-8rem)] overflow-y-auto">
//           {files.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400">
//               <FileText className="w-16 h-16 mb-4" />
//               <p className="text-lg">No files uploaded yet</p>
//             </div>
//           ) : (
//             files.map(file => (
//               <div 
//                 key={file.id}
//                 className="bg-white p-4 rounded-lg shadow-sm mb-3 border"
//               >
//                 <div className="flex items-center gap-3 mb-2">
//                   <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
//                     {getFileIcon(file.type)}
//                   </span>
//                   <div className="flex-1 min-w-0">
//                     <p className="truncate font-medium">{file.name}</p>
//                     <p className="text-sm text-gray-500">{file.size} KB</p>
//                   </div>
//                   <button 
//                     onClick={() => removeFile(file.id)}
//                     className="p-1.5 rounded-full hover:bg-gray-100"
//                   >
//                     <X className="w-5 h-5 text-gray-500" />
//                   </button>
//                 </div>
//                 {uploadProgress[file.id] < 100 && (
//                   <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//                     <div 
//                       className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${uploadProgress[file.id]}%` }}
//                     />
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileUpload;