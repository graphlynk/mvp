import { useState } from 'react';
import { Plus, FileText, ExternalLink, Edit, Trash2, Eye, Clock } from 'lucide-react';
import { Tier } from '@/types/graphlynk';
import { SuggestedTopics } from './SuggestedTopics';
import { BlogEditor } from './BlogEditor';

interface BlogContentProps {
  tier: Tier;
}

interface BlogPost {
  id: number;
  title: string;
  status: 'published' | 'draft';
  views: number;
  date: string;
  slug: string;
}

const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'How to Optimize Your Knowledge Graph for Google',
    status: 'published',
    views: 1243,
    date: '2024-10-28',
    slug: 'optimize-knowledge-graph',
  },
  {
    id: 2,
    title: 'Entity SEO: The Future of Search Optimization',
    status: 'draft',
    views: 0,
    date: '2024-10-30',
    slug: 'entity-seo-future',
  },
  {
    id: 3,
    title: 'Schema Markup Best Practices for 2024',
    status: 'published',
    views: 892,
    date: '2024-10-25',
    slug: 'schema-markup-2024',
  },
];

export function BlogContent({ tier }: BlogContentProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);

  const handlePublish = (newPost: { title: string; content: string; coverImage: string }) => {
    const post: BlogPost = {
      id: Date.now(),
      title: newPost.title || 'Untitled Post',
      status: 'published',
      views: 0,
      date: new Date().toISOString().split('T')[0],
      slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    
    setPosts([post, ...posts]);
    setIsEditorOpen(false);
  };

  if (isEditorOpen) {
    return (
      <BlogEditor 
        onBack={() => setIsEditorOpen(false)}
        onPublish={handlePublish}
      />
    );
  }

  return (
    <div className="p-8 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 dark:text-white mb-1">Blog Management</h1>
          <p className="text-gray-600 dark:text-[#98A2B3]">Manage your blog posts and short links</p>
        </div>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0b3d84] text-white rounded-lg hover:bg-[#0a3470] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card-light dark:glass-card border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-[#0b3d84]" />
          </div>
          <div className="text-2xl text-gray-900 dark:text-white mb-1">{posts.length}</div>
          <div className="text-xs text-gray-600 dark:text-[#98A2B3]">Total Posts</div>
        </div>
        
        <div className="glass-card-light dark:glass-card border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div className="text-2xl text-gray-900 dark:text-white mb-1">8.4K</div>
          <div className="text-xs text-gray-600 dark:text-[#98A2B3]">Total Views</div>
        </div>

        <div className="glass-card-light dark:glass-card border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ExternalLink className="w-5 h-5 text-[#60A5FA]" />
          </div>
          <div className="text-2xl text-gray-900 dark:text-white mb-1">24</div>
          <div className="text-xs text-gray-600 dark:text-[#98A2B3]">Short Links</div>
        </div>

        <div className="glass-card-light dark:glass-card border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {posts.filter(p => p.status === 'draft').length}
          </div>
          <div className="text-xs text-gray-600 dark:text-[#98A2B3]">Drafts</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blog Posts List */}
        <div className="lg:col-span-2">
          <div className="glass-card-light dark:glass-card border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white">Recent Posts</h2>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-[#1a1f24] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-900 dark:text-[#E6E9EE] font-medium">{post.title}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            post.status === 'published'
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-[#98A2B3]">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} views
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">/{post.slug}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 dark:text-[#98A2B3] hover:text-gray-900 dark:hover:text-[#E6E9EE] hover:bg-gray-100 dark:hover:bg-[#1a1f24] rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-[#98A2B3] hover:text-gray-900 dark:hover:text-[#E6E9EE] hover:bg-gray-100 dark:hover:bg-[#1a1f24] rounded transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-[#98A2B3] hover:text-[#EF4444] hover:bg-gray-100 dark:hover:bg-[#1a1f24] rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Topics */}
        <div>
          <SuggestedTopics tier={tier} />
        </div>
      </div>
    </div>
  );
}
