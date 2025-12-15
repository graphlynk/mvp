import { FileText, Plus, Calendar, Eye, Edit } from 'lucide-react';

export function BlogManagementContent() {
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Knowledge Graphs',
      status: 'Published',
      date: 'Nov 1, 2024',
      views: 1234,
    },
    {
      id: 2,
      title: 'Building Semantic Connections',
      status: 'Draft',
      date: 'Nov 2, 2024',
      views: 0,
    },
    {
      id: 3,
      title: 'Advanced GraphLynk Features',
      status: 'Published',
      date: 'Oct 28, 2024',
      views: 892,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-white mb-2">Blog Management</h2>
          <p className="text-white/70">Create and manage your blog posts</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Posts List */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h3 className="text-white mb-6">Recent Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-all"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 backdrop-blur-xl rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                  <FileText className="w-6 h-6 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-1">{post.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    {post.status === 'Published' && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views} views
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${
                    post.status === 'Published'
                      ? 'bg-green-400/20 text-green-300 border-green-400/30'
                      : 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30'
                  }`}
                >
                  {post.status}
                </span>
                <button className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
