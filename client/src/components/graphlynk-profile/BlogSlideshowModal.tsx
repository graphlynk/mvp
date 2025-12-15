import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Calendar } from 'lucide-react';
import { useEffect, useCallback } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  url: string;
  isPinned: boolean;
}

interface BlogSlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  startIndex: number;
  onIndexChange: (index: number) => void;
}

export function BlogSlideshowModal({ 
  isOpen, 
  onClose, 
  posts, 
  startIndex,
  onIndexChange 
}: BlogSlideshowModalProps) {
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onIndexChange((startIndex - 1 + posts.length) % posts.length);
      }
      if (e.key === 'ArrowRight') {
        onIndexChange((startIndex + 1) % posts.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, startIndex, posts.length, onIndexChange]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Content */}
          <motion.div
            layoutId={`post-${posts[startIndex].id}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl bg-white dark:bg-[#1A1F26] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-2/3 relative bg-black flex items-center justify-center group">
              <motion.img
                key={posts[startIndex].coverImage}
                src={posts[startIndex].coverImage}
                alt={posts[startIndex].title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover max-h-[50vh] md:max-h-full"
              />
              
              {/* Navigation Buttons (Desktop Overlay) */}
              <div className="absolute inset-x-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndexChange((startIndex - 1 + posts.length) % posts.length);
                  }}
                  className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndexChange((startIndex + 1) % posts.length);
                  }}
                  className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/3 p-8 flex flex-col bg-white dark:bg-[#1A1F26] border-l border-gray-200 dark:border-white/10">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#98A2B3] mb-4">
                  <Calendar className="w-4 h-4" />
                  {posts[startIndex].date}
                </div>
                
                <motion.h2 
                  key={`title-${startIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  {posts[startIndex].title}
                </motion.h2>
                
                <motion.p 
                  key={`excerpt-${startIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 dark:text-[#E6E9EE] leading-relaxed mb-8"
                >
                  {posts[startIndex].excerpt}
                </motion.p>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-white/10 mt-auto">
                <a 
                  href={posts[startIndex].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#0b3d84] hover:bg-[#0a3470] text-white rounded-xl transition-colors font-medium"
                >
                  Read Full Story
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
