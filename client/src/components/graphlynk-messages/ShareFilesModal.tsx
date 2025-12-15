import { useState, useRef } from 'react';
import { X, Upload, File, Trash2, FileText, FileImage, FileVideo, FileAudio } from 'lucide-react';

interface ShareFilesModalProps {
  onClose: () => void;
  participantName: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export function ShareFilesModal({ onClose, participantName }: ShareFilesModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('audio/')) return FileAudio;
    return FileText;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle file sharing
    console.log('Sharing files:', files, 'with message:', message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card-light dark:glass-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between sticky top-0 glass-card-light dark:glass-card z-10">
          <div>
            <h2 className="text-xl text-gray-900 dark:text-white">Share Files</h2>
            <p className="text-sm text-gray-600 dark:text-[#98A2B3] mt-1">
              Send files to {participantName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* File Upload Area */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all glass-card-light dark:glass-card group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Click to select files
                  </p>
                  <p className="text-xs text-gray-600 dark:text-[#98A2B3] mt-1">
                    or drag and drop files here
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-gray-700 dark:text-[#98A2B3] block">
                Selected Files ({files.length})
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <FileIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-[#98A2B3]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-[#98A2B3] group-hover:text-red-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="text-sm text-gray-700 dark:text-[#98A2B3] mb-2 block">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message about these files..."
              rows={3}
              className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={files.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Share {files.length > 0 && `${files.length} File${files.length > 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 glass-card-light dark:glass-card text-black dark:text-white rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
