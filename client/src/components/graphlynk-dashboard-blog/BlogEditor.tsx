import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Image as ImageIcon, X, ArrowLeft, MoreHorizontal, 
  Plus, Video, Code, Minus, Search, Type, List, Link as LinkIcon,
  Share, History, Settings, Twitter, Globe, Move, Check,
  Undo, Redo, Bold, Italic, Strikethrough, Code as CodeIcon,
  Quote, ListOrdered, AlignLeft, Headphones, ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface BlogEditorProps {
  onBack: () => void;
  onPublish: (post: { title: string; content: string; coverImage: string }) => void;
  initialData?: {
    title: string;
    content: string;
    coverImage: string;
  };
}

type BlockType = 'text' | 'image' | 'video' | 'divider' | 'code' | 'button' | 'audio';

interface Block {
  id: string;
  type: BlockType;
  content: string; // content or url
  metadata?: any;
}

export function BlogEditor({ onBack, onPublish, initialData }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [coverImagePosition, setCoverImagePosition] = useState(50);
  const [isRepositioning, setIsRepositioning] = useState(false);
  
  // Initialize blocks
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (initialData?.content) {
      return [{ id: '1', type: 'text', content: initialData.content }];
    }
    return [{ id: '1', type: 'text', content: '' }];
  });

  // History for Undo/Redo
  const [history, setHistory] = useState<Block[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const initialPosRef = useRef<number>(50);
  const activeTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Helper to generate IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Save history on change
  const saveToHistory = useCallback((newBlocks: Block[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    // Limit history size
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory(blocks);
    }
  }, []);

  const updateBlocksWithHistory = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    saveToHistory(newBlocks);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setCoverImagePosition(50);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRepositioning) return;
    e.preventDefault();
    dragStartRef.current = e.clientY;
    initialPosRef.current = coverImagePosition;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartRef.current === null || !isRepositioning) return;
    e.preventDefault();
    
    const deltaY = dragStartRef.current - e.clientY;
    const containerHeight = e.currentTarget.clientHeight;
    const sensitivity = 1.5;
    const percentageDelta = (deltaY / containerHeight) * 100 * sensitivity; 
    
    const newPos = Math.min(100, Math.max(0, initialPosRef.current + percentageDelta));
    setCoverImagePosition(newPos);
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
  };

  const saveReposition = () => {
    setIsRepositioning(false);
    dragStartRef.current = null;
  };

  const cancelReposition = () => {
    setCoverImagePosition(initialPosRef.current);
    setIsRepositioning(false);
    dragStartRef.current = null;
  };

  const updateBlock = (id: string, content: string) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, content } : b);
    setBlocks(newBlocks); // Don't save to history on every keystroke for performance
  };

  const addBlock = (type: BlockType, afterId: string, content: string = '') => {
    const newBlock: Block = { id: generateId(), type, content };
    const index = blocks.findIndex(b => b.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocksWithHistory(newBlocks);
    setActiveBlockId(newBlock.id);
    setShowPlusMenu(false);
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    const index = blocks.findIndex(b => b.id === id);
    const newBlocks = blocks.filter(b => b.id !== id);
    updateBlocksWithHistory(newBlocks);
    if (index > 0) setActiveBlockId(newBlocks[index - 1].id);
    else setActiveBlockId(newBlocks[0].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('text', id);
    }
    if (e.key === 'Backspace') {
      const block = blocks.find(b => b.id === id);
      if (block && block.content === '' && blocks.length > 1) {
        e.preventDefault();
        removeBlock(id);
      }
    }
    // Save history on pause (simplified)
    if (e.key === 'Enter') {
        saveToHistory(blocks);
    }
  };

  // --- Toolbar Helpers ---
  const insertMarkdown = (startTag: string, endTag: string = '') => {
    if (!activeBlockId || !activeTextareaRef.current) return;
    
    const textarea = activeTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);
    
    const newValue = before + startTag + selected + endTag + after;
    updateBlock(activeBlockId, newValue);
    
    // Restore focus and selection (with offset)
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const insertPrefix = (prefix: string) => {
    if (!activeBlockId || !activeTextareaRef.current) return;
    const textarea = activeTextareaRef.current;
    const value = textarea.value;
    
    // Check if already exists at start of line/content
    if (value.startsWith(prefix)) {
        updateBlock(activeBlockId, value.substring(prefix.length));
    } else {
        updateBlock(activeBlockId, prefix + value);
    }
    textarea.focus();
  };

  const handleToolbarAction = (action: string) => {
    if (!activeBlockId) return;

    switch (action) {
        case 'bold': insertMarkdown('**', '**'); break;
        case 'italic': insertMarkdown('_', '_'); break;
        case 'strike': insertMarkdown('~~', '~~'); break;
        case 'code': insertMarkdown('`', '`'); break;
        case 'link': 
            const url = prompt("Enter URL:");
            if (url) insertMarkdown('[', `](${url})`);
            break;
        case 'h1': insertPrefix('# '); break;
        case 'h2': insertPrefix('## '); break;
        case 'quote': insertPrefix('> '); break;
        case 'bullet': insertPrefix('- '); break;
        case 'number': insertPrefix('1. '); break;
        case 'image': 
            const imgUrl = prompt("Enter image URL:");
            if (imgUrl) addBlock('image', activeBlockId, imgUrl);
            break;
        case 'video':
            const vidUrl = prompt("Enter video URL (YouTube/Vimeo):");
            if (vidUrl) addBlock('video', activeBlockId, vidUrl);
            break;
        case 'divider':
            addBlock('divider', activeBlockId);
            break;
        case 'button':
            addBlock('button', activeBlockId, 'Subscribe Now');
            break;
        case 'audio':
             addBlock('audio', activeBlockId, '');
             break;
    }
  };

  const getFullContent = () => {
    return blocks.map(b => {
      if (b.type === 'text') return b.content;
      if (b.type === 'image') return `![Image](${b.content})`;
      if (b.type === 'divider') return '---';
      if (b.type === 'button') return `[BUTTON: ${b.content}]`;
      return '';
    }).join('\n\n');
  };

  return (
    <div className="bg-white dark:bg-[#0F1115] min-h-screen animate-in fade-in duration-300 absolute inset-0 z-50 overflow-y-auto">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 lg:px-12 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-md z-[60]">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-600 dark:text-gray-400 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Draft in <span className="text-gray-900 dark:text-white font-medium">GraphLynk</span>
            </span>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => onPublish({ title, content: getFullContent(), coverImage })}
                className="px-4 py-1.5 bg-[#0b3d84] hover:bg-[#0a3470] text-white text-sm font-medium rounded-full transition-colors"
            >
                Publish
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors outline-none">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-[#1A1F26] border-gray-200 dark:border-white/10">
                 <DropdownMenuItem>Share draft link</DropdownMenuItem>
                 <DropdownMenuItem>Share to X</DropdownMenuItem>
                 <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </nav>

      {/* Substack-style Toolbar */}
      <div className="sticky top-[60px] z-[50] bg-white dark:bg-[#0F1115] border-b border-gray-100 dark:border-white/5 px-4 py-2 flex items-center justify-center gap-1 lg:gap-2 overflow-x-auto no-scrollbar shadow-sm">
         <div className="flex items-center gap-1 pr-2 border-r border-gray-200 dark:border-white/10">
            <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30"><Undo className="w-4 h-4" /></button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30"><Redo className="w-4 h-4" /></button>
         </div>
         
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                    Style <ChevronDown className="w-3 h-3" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleToolbarAction('h1')}><span className="text-xl font-bold">Heading 1</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToolbarAction('h2')}><span className="text-lg font-bold">Heading 2</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToolbarAction('normal')}>Normal Text</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
         
         <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />
         
         <button onClick={() => handleToolbarAction('bold')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Bold"><Bold className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('italic')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Italic"><Italic className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('strike')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Strikethrough"><Strikethrough className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('code')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Code"><CodeIcon className="w-4 h-4" /></button>
         
         <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />
         
         <button onClick={() => handleToolbarAction('link')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Link"><LinkIcon className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('image')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Image"><ImageIcon className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('audio')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Audio"><Headphones className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('video')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Video"><Video className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('quote')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Quote"><Quote className="w-4 h-4" /></button>
         
         <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />

         <button onClick={() => handleToolbarAction('bullet')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Bullet List"><List className="w-4 h-4" /></button>
         <button onClick={() => handleToolbarAction('number')} className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
         
         <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />
         
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                    Button <ChevronDown className="w-3 h-3" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleToolbarAction('button')}>Subscribe Button</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleToolbarAction('button')}>Share Button</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12 pb-32">
        {/* Cover Image Section (Same as before) */}
        <div className="group relative mb-8 select-none">
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            
            {coverImage ? (
                <div 
                  className={`relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 ${isRepositioning ? 'cursor-move' : ''}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                    <img 
                      src={coverImage} 
                      alt="Cover" 
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ objectPosition: `center ${coverImagePosition}%` }}
                    />
                    
                    {isRepositioning ? (
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <span className="inline-block px-4 py-2 bg-black/50 text-white rounded-full backdrop-blur-sm text-sm font-medium">
                          Drag to reposition
                        </span>
                      </div>
                    ) : null}

                    {/* Controls Overlay */}
                    <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-200 ${isRepositioning ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {isRepositioning ? (
                        <>
                          <button 
                              onClick={saveReposition}
                              className="flex items-center gap-2 px-4 py-2 bg-[#0b3d84] text-white rounded-full shadow-lg hover:bg-[#0a3470] transition-colors"
                          >
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Save</span>
                          </button>
                          <button 
                              onClick={cancelReposition}
                              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1F26] text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-[#252b36] transition-colors"
                          >
                              <X className="w-4 h-4" />
                              <span className="text-sm font-medium">Cancel</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                              onClick={() => {
                                setIsRepositioning(true);
                                initialPosRef.current = coverImagePosition;
                              }}
                              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                              title="Reposition"
                          >
                              <Move className="w-4 h-4" />
                          </button>
                          <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                              title="Change Image"
                          >
                              <ImageIcon className="w-4 h-4" />
                          </button>
                          <button 
                              onClick={() => setCoverImage('')}
                              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                              title="Remove Image"
                          >
                              <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 mb-4 group">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer p-2 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-2 pr-4"
                    >
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Add cover image</span>
                    </button>
                </div>
            )}
        </div>

        {/* Title */}
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl lg:text-5xl font-serif font-bold text-gray-900 dark:text-[#E6E9EE] placeholder-gray-300 dark:placeholder-gray-700 bg-transparent border-none outline-none mb-8"
        />

        {/* Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="relative group/block">
              {/* Plus Menu Trigger (Retained for quick access) */}
              {block.type === 'text' && block.content === '' && activeBlockId === block.id && (
                <div className="absolute -left-12 top-1.5 z-10">
                  <button 
                      onClick={() => setShowPlusMenu(!showPlusMenu)}
                      className={`p-1 rounded-full border transition-all duration-200 ${showPlusMenu ? 'rotate-45 border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-gray-300 dark:border-gray-600 text-gray-400 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      <Plus className="w-5 h-5" />
                  </button>
                  {showPlusMenu && (
                      <div className="absolute left-10 top-0 flex items-center gap-2 animate-in slide-in-from-left-2 duration-200 bg-white dark:bg-[#1A1F26] p-1 rounded-full shadow-lg border border-gray-100 dark:border-white/10">
                         <button onClick={() => handleToolbarAction('image')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ImageIcon className="w-4 h-4" /></button>
                         <button onClick={() => handleToolbarAction('video')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><Video className="w-4 h-4" /></button>
                         <button onClick={() => handleToolbarAction('divider')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><Minus className="w-4 h-4" /></button>
                      </div>
                  )}
                </div>
              )}

              {/* Block Content */}
              <div className="min-h-[24px]">
                {block.type === 'text' && (
                  <TextareaAutosize 
                    value={block.content}
                    onChange={(val) => updateBlock(block.id, val)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    onFocus={(e) => {
                      setActiveBlockId(block.id);
                      activeTextareaRef.current = e.target;
                      setShowPlusMenu(false);
                    }}
                    placeholder={blocks.indexOf(block) === 0 ? "Tell your story..." : ""}
                    autoFocus={activeBlockId === block.id}
                  />
                )}
                
                {block.type === 'image' && (
                  <div className="relative group/image my-8">
                    <img src={block.content} alt="Post content" className="w-full rounded-lg" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                      <button onClick={() => removeBlock(block.id)} className="p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"><X className="w-4 h-4" /></button>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2 italic">Image Caption</p>
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="relative group/video my-8 aspect-video bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                     <div className="text-gray-500">Video Embed Placeholder: {block.content}</div>
                     <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 opacity-0 group-hover/video:opacity-100"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {block.type === 'audio' && (
                  <div className="relative group/audio my-6 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#0b3d84] flex items-center justify-center text-white"><Headphones className="w-5 h-5" /></div>
                     <div className="flex-1">
                        <div className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-[#0b3d84]" /></div>
                     </div>
                     <button onClick={() => removeBlock(block.id)} className="p-1.5 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {block.type === 'button' && (
                  <div className="relative group/button my-8 flex justify-center">
                     <button className="px-8 py-3 bg-[#0b3d84] text-white font-medium rounded-full hover:bg-[#0a3470] transition-colors">
                        {block.content}
                     </button>
                     <button onClick={() => removeBlock(block.id)} className="absolute top-0 right-1/3 translate-x-12 p-1.5 bg-gray-100 dark:bg-white/10 rounded-full opacity-0 group-hover/button:opacity-100 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {block.type === 'divider' && (
                  <div className="flex items-center justify-center py-8 group/divider cursor-pointer" onClick={() => setActiveBlockId(block.id)}>
                    <div className="flex gap-4 text-gray-300 dark:text-gray-700">
                      <div className="w-1 h-1 rounded-full bg-current" />
                      <div className="w-1 h-1 rounded-full bg-current" />
                      <div className="w-1 h-1 rounded-full bg-current" />
                    </div>
                    <div className="absolute right-0 opacity-0 group-hover/divider:opacity-100">
                       <button onClick={() => removeBlock(block.id)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Helper component for auto-resizing textarea
function TextareaAutosize({ value, onChange, onKeyDown, onFocus, placeholder, autoFocus }: any) {
  const ref = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      placeholder={placeholder}
      className="w-full text-xl font-serif leading-relaxed text-gray-800 dark:text-[#B0B8C4] placeholder-gray-300 dark:placeholder-gray-700 bg-transparent border-none outline-none resize-none p-0 focus:ring-0 overflow-hidden"
      rows={1}
    />
  );
}
