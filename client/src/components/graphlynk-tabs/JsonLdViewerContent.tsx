import { Code, Copy, Download, Eye } from 'lucide-react';

export function JsonLdViewerContent() {
  const sampleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "John Smith",
    "url": "https://graphlynk.com/johnsmith",
    "sameAs": [
      "https://twitter.com/johnsmith",
      "https://linkedin.com/in/johnsmith"
    ],
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "GraphLynk"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-white mb-2">JSON-LD Viewer</h2>
        <p className="text-white/70">View and manage your structured data markup</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* JSON Editor */}
        <div className="lg:col-span-2 backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Schema Markup</h3>
            <div className="flex gap-2">
              <button className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="backdrop-blur-xl bg-black/40 rounded-xl p-4 overflow-x-auto border border-white/10">
            <pre className="text-sm text-gray-100 font-mono">
              {JSON.stringify(sampleJsonLd, null, 2)}
            </pre>
          </div>
        </div>

        {/* Info */}
        <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-white mb-6">Schema Info</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-200">Status</span>
              </div>
              <p className="text-sm text-blue-100">Valid Schema</p>
            </div>

            <div className="p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20">
              <p className="text-sm text-white/70 mb-1">Schema Type</p>
              <p className="text-white">Person</p>
            </div>

            <div className="p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20">
              <p className="text-sm text-white/70 mb-1">Properties</p>
              <p className="text-white">6 fields</p>
            </div>

            <div className="p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20">
              <p className="text-sm text-white/70 mb-1">Last Updated</p>
              <p className="text-white">Nov 2, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
