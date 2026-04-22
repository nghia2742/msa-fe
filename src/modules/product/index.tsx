import {
    useCreateProductMutation,
    useProductsQuery,
    ProductSchema
} from '@/shared/core/generated/graphql';
import { useState, useMemo } from 'react';
import { 
    Plus, 
    Search, 
    Package, 
    DollarSign, 
    Tag, 
    X, 
    Loader2, 
    ShoppingBag, 
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

type TProductInput = {
    productName: string;
    price: number;
    description: string;
};

// --- Components ---

const StatusBadge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        className
    )}>
        {children}
    </span>
);

const SkeletonCard = () => (
    <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="pt-4 flex justify-between items-center">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        </div>
    </div>
);

const ProductCard = ({ product }: { product: ProductSchema }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <StatusBadge className="bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                    In Stock
                </StatusBadge>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Package size={24} />
            </div>

            <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {product.productName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                    {product.description || "No description provided for this product."}
                </p>
            </div>

            <div className="pt-6 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                        {formatter.format(product.price)}
                    </span>
                </div>
                
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-colors shadow-lg shadow-black/5">
                    <ArrowRight size={18} />
                </button>
            </div>
        </motion.div>
    );
};

const CreateProductModal = ({ 
    isOpen, 
    onClose, 
    onSubmit 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onSubmit: (data: TProductInput) => void 
}) => {
    const [form, setForm] = useState<TProductInput>({ productName: '', price: 0, description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10"
            >
                <div className="px-8 pt-8 pb-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">New Product</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Fill in the details to expand your catalog.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form className="p-8 space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    onSubmit(form);
                }}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Tag size={14} className="text-indigo-500" />
                                Product Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Premium Wireless Headphones"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                value={form.productName}
                                onChange={e => setForm({...form, productName: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <DollarSign size={14} className="text-emerald-500" />
                                Price (USD)
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                value={form.price || ''}
                                onChange={e => setForm({...form, price: parseFloat(e.target.value)})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <MessageSquare size={14} className="text-blue-500" />
                                Description
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe the key features and benefits..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none"
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                            Create Product
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// --- Main Module ---

function ProductModule() {
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, loading, refetch } = useProductsQuery();
    const [sendRequest] = useCreateProductMutation({
        onCompleted: () => {
            setIsOpenForm(false);
            refetch();
        },
        onError: (error) => {
            console.error('Failed to create product:', error);
            alert('Failed to create product. Please try again.');
        },
    });

    const filteredProducts = useMemo(() => {
        if (!data?.products) return [];
        return data.products.filter(p => 
            p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        );
    }, [data, searchQuery]);

    const handleSubmit = (formData: TProductInput) => {
        sendRequest({
            variables: {
                input: formData,
            },
        });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                            <ShoppingBag size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Products</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and monitor your entire product catalog from one place.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find products..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsOpenForm(true)}
                        className="px-6 py-3 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Add Product</span>
                    </button>
                </div>
            </div>

            {/* Grid Section */}
            <div>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonCard key={n} />)}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <Package size={40} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No products found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                {searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "Your catalog is empty. Start by adding your first product!"}
                            </p>
                        </div>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsOpenForm(true)}
                                className="mt-4 px-6 py-3 rounded-xl font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                            >
                                Add your first product
                            </button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpenForm && (
                    <CreateProductModal 
                        isOpen={isOpenForm} 
                        onClose={() => setIsOpenForm(false)} 
                        onSubmit={handleSubmit} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default ProductModule;
