import { useState, useEffect } from 'react';
import { Tier } from '@/types/graphlynk';
import { 
  ShoppingBag, 
  Plus, 
  ExternalLink, 
  MoreHorizontal, 
  TrendingUp, 
  Eye, 
  MousePointer2, 
  DollarSign,
  Search,
  Filter,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Loader2,
  Globe,
  Smartphone,
  Box,
  Zap,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface ProductsContentProps {
  tier: Tier;
}

type ProductPlatform = 'shopify' | 'etsy' | 'gumroad' | 'amazon' | 'custom' | 'stripe';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  link: string;
  platform: ProductPlatform;
  category: 'digital' | 'physical' | 'service' | 'course';
  status: 'active' | 'draft' | 'archived';
  stats: {
    views: string;
    clicks: string;
    revenue: string;
    conversion: string;
  };
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Ultimate SaaS Dashboard Kit',
    price: 49.00,
    currency: '$',
    image: 'https://images.unsplash.com/photo-1636868240132-442d20fd00e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    link: 'https://gumroad.com/l/dashboard-kit',
    platform: 'gumroad',
    category: 'digital',
    status: 'active',
    stats: {
      views: '12.5k',
      clicks: '3.2k',
      revenue: '$15,680',
      conversion: '4.2%'
    }
  },
  {
    id: '2',
    title: 'Minimalist Workspace Setup Guide',
    price: 19.00,
    currency: '$',
    image: 'https://images.unsplash.com/photo-1753802865383-3d4909bfbec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    link: 'https://etsy.com/shop/minimalist',
    platform: 'etsy',
    category: 'digital',
    status: 'active',
    stats: {
      views: '8.2k',
      clicks: '1.8k',
      revenue: '$4,250',
      conversion: '3.8%'
    }
  },
  {
    id: '3',
    title: 'Abstract Design Assets Vol. 2',
    price: 29.00,
    currency: '$',
    image: 'https://images.unsplash.com/photo-1684297281470-7f4e3d1799ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    link: 'https://creativemarket.com/abstract',
    platform: 'custom',
    category: 'digital',
    status: 'active',
    stats: {
      views: '5.1k',
      clicks: '950',
      revenue: '$2,100',
      conversion: '2.9%'
    }
  },
  {
    id: '4',
    title: 'Smart Watch UI Kit',
    price: 59.00,
    currency: '$',
    image: 'https://images.unsplash.com/photo-1673997303871-178507ca875a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    link: 'https://ui8.net/smart-watch',
    platform: 'shopify',
    category: 'digital',
    status: 'draft',
    stats: {
      views: '0',
      clicks: '0',
      revenue: '$0',
      conversion: '0%'
    }
  }
];

export function ProductsContent({ tier }: ProductsContentProps) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'digital' | 'physical'>('all');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || p.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    toast.success('Product added successfully', {
      description: `${newProduct.title} is now active on your dashboard.`
    });
  };

  return (
    <div className="p-8 space-y-8 pb-24">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Digital Products</h1>
          <p className="text-gray-600 dark:text-[#98A2B3]">Manage and track your multi-platform inventory</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value="$24,150" 
          change="+12.5%" 
          icon={DollarSign} 
          trend="up" 
          color="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-500"
        />
        <StatsCard 
          title="Total Views" 
          value="45.2k" 
          change="+8.2%" 
          icon={Eye} 
          trend="up" 
          color="from-blue-500/20 to-cyan-500/20"
          iconColor="text-blue-500"
        />
        <StatsCard 
          title="Link Clicks" 
          value="12.8k" 
          change="+15.3%" 
          icon={MousePointer2} 
          trend="up" 
          color="from-purple-500/20 to-pink-500/20"
          iconColor="text-purple-500"
        />
        <StatsCard 
          title="Conversion Rate" 
          value="3.2%" 
          change="-1.1%" 
          icon={TrendingUp} 
          trend="down" 
          color="from-orange-500/20 to-red-500/20"
          iconColor="text-orange-500"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#12161A] p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2 p-2 w-full sm:w-auto">
          {['all', 'digital', 'physical'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                filter === f 
                  ? 'bg-gray-100 dark:bg-white/10 text-[#0b3d84] dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-[#98A2B3] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-transparent focus:border-[#0b3d84]/30 rounded-xl outline-none text-sm text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Add New Placeholder Card */}
          <motion.button
            layout
            onClick={() => setIsAddModalOpen(true)}
            className="group relative min-h-[400px] rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]" />
            </div>
            <p className="text-gray-500 dark:text-[#98A2B3] font-medium group-hover:text-gray-900 dark:group-hover:text-white">Add New Product</p>
          </motion.button>
        </AnimatePresence>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddProduct}
      />
    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, trend, color, iconColor }: any) {
  return (
    <div className="relative p-6 glass-card-light dark:glass-card rounded-3xl border border-gray-200/50 dark:border-white/5 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
            trend === 'up' 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}>
            {change}
          </span>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-[#98A2B3] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white dark:bg-[#12161A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <ImageWithFallback 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
          <a 
            href={product.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Platform Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1.5 shadow-lg">
            {getPlatformIcon(product.platform)}
            <span className="capitalize">{product.platform}</span>
          </span>
        </div>

        {/* Quick Status Badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            product.status === 'active' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {product.status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
            {product.title}
          </h3>
          <span className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">
            {product.currency}{product.price}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 dark:text-[#98A2B3] uppercase tracking-wide">Views</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.stats.views}</p>
          </div>
          <div className="text-center border-l border-gray-100 dark:border-white/5">
            <p className="text-[10px] text-gray-500 dark:text-[#98A2B3] uppercase tracking-wide">Clicks</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{product.stats.clicks}</p>
          </div>
          <div className="text-center border-l border-gray-100 dark:border-white/5">
            <p className="text-[10px] text-gray-500 dark:text-[#98A2B3] uppercase tracking-wide">Conv.</p>
            <p className="text-sm font-semibold text-emerald-500">{product.stats.conversion}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddProductModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (p: Product) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    image: '',
    platform: 'custom',
    currency: '$'
  });

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setUrl('');
      setFormData({ title: '', price: 0, image: '', platform: 'custom', currency: '$' });
    }
  }, [isOpen]);

  const handleAnalyzeLink = async () => {
    if (!url) return;
    setIsLoading(true);
    
    // Simulate AI/Scraper analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock extracted data
    setFormData({
      title: 'Imported Product Title (AI Detected)',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
      link: url,
      platform: detectPlatform(url),
      category: 'digital',
      status: 'active',
      stats: {
        views: '0',
        clicks: '0',
        revenue: '$0',
        conversion: '0%'
      }
    });
    
    setIsLoading(false);
    setStep(2);
  };

  const handleSubmit = () => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData as Product,
      link: url,
    };
    onAdd(newProduct);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#12161A] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
      >
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Digital Product</h2>
            <p className="text-sm text-gray-500 dark:text-[#98A2B3]">Import from any platform via link</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <LinkIcon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paste Product Link</h3>
                <p className="text-sm text-gray-500 dark:text-[#98A2B3] max-w-sm mx-auto">
                  We'll automatically extract product details, images, and pricing from your Gumroad, Etsy, or Shopify link.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://gumroad.com/l/your-product"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#0b3d84] outline-none text-gray-900 dark:text-white transition-all"
                />
              </div>

              <button
                onClick={handleAnalyzeLink}
                disabled={!url || isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Link...
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <Zap className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="aspect-square rounded-2xl overflow-hidden relative group bg-gray-100 dark:bg-white/5">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs">No image detected</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors">
                      Change Image
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-500/20">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(formData.platform as ProductPlatform)}
                    <div>
                      <p className="text-xs text-gray-500 dark:text-blue-200 uppercase font-bold tracking-wider">Platform</p>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 capitalize">{formData.platform}</p>
                    </div>
                  </div>
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#E6E9EE] mb-1">Product Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#0b3d84] outline-none text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#E6E9EE] mb-1">Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{formData.currency}</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#0b3d84] outline-none text-gray-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#E6E9EE] mb-1">Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full px-4 py-3 bg-black text-white border border-transparent rounded-xl focus:ring-2 focus:ring-[#0b3d84] outline-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02] appearance-none cursor-pointer"
                      >
                        <option value="digital">Digital Product</option>
                        <option value="physical">Physical Good</option>
                        <option value="service">Service</option>
                        <option value="course">Course</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#E6E9EE] mb-1">Custom Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#0b3d84] outline-none text-gray-900 dark:text-white transition-all text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-4 bg-[#0b3d84] text-white rounded-xl font-medium hover:bg-[#0b3d84]/90 transition-colors shadow-lg shadow-[#0b3d84]/20"
                  >
                    Confirm & Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function detectPlatform(url: string): ProductPlatform {
  if (url.includes('gumroad')) return 'gumroad';
  if (url.includes('etsy')) return 'etsy';
  if (url.includes('shopify')) return 'shopify';
  if (url.includes('amazon')) return 'amazon';
  return 'custom';
}

function getPlatformIcon(platform: ProductPlatform) {
  switch (platform) {
    case 'shopify':
      return <ShoppingBag className="w-4 h-4 text-[#96bf48]" />;
    case 'etsy':
      return <span className="text-[#F1641E] font-serif font-bold text-xs">E</span>;
    case 'gumroad':
      return <span className="text-[#ff90e8] font-bold text-xs">G</span>;
    case 'amazon':
      return <span className="text-[#FF9900] font-bold text-xs">a</span>;
    default:
      return <Globe className="w-4 h-4 text-gray-400" />;
  }
}
