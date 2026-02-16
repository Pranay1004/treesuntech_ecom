import { useState, useMemo } from 'react';
import { products, getFilterOptions, type Product } from '@/lib/data/products';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductCard from '@/components/products/ProductCard';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortKey = 'newest' | 'popular' | 'az' | 'za' | 'price-asc' | 'price-desc';

const ITEMS_PER_PAGE = 9;

export default function Products() {
  const filters = getFilterOptions();
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const totalActive = Object.values(activeFilters).flat().length;

  function handleFilterChange(category: string, value: string) {
    setActiveFilters((prev) => {
      const current = prev[category] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
    setCurrentPage(1);
  }

  function clearAllFilters() {
    setActiveFilters({});
    setCurrentPage(1);
  }

  const filtered = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (activeFilters.material?.length) {
      result = result.filter((p) => activeFilters.material.includes(p.material));
    }
    if (activeFilters.technology?.length) {
      result = result.filter((p) => activeFilters.technology.includes(p.technology));
    }
    if (activeFilters.industry?.length) {
      result = result.filter((p) =>
        p.industry.some((ind) => activeFilters.industry.includes(ind))
      );
    }
    if (activeFilters.size?.length) {
      result = result.filter((p) => activeFilters.size.includes(p.size));
    }
    if (activeFilters.finish?.length) {
      result = result.filter((p) => activeFilters.finish.includes(p.finish));
    }

    // Sort
    switch (sortBy) {
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [activeFilters, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-surface-950 pt-24">
      {/* Header */}
      <div className="container-custom mb-10">
        <ScrollReveal>
          <div>
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Catalog
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-3">
              Our Products
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Precision manufactured parts across industries. Browse our catalog or
              filter by your requirements.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="container-custom pb-20">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              totalActive={totalActive}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 glass-card text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {totalActive > 0 && (
                    <span className="bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalActive}
                    </span>
                  )}
                </button>

                <p className="text-slate-500 text-sm">
                  {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary-500/50 appearance-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Popular</option>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      viewMode === 'grid'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      viewMode === 'list'
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {paginated.length > 0 ? (
              <div
                className={cn(
                  'grid gap-5',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {paginated.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <SlidersHorizontal size={32} className="text-slate-600" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  No products match your filters
                </h3>
                <p className="text-slate-400 mb-6">
                  Try adjusting your filters or clearing them to see all products.
                </p>
                <button onClick={clearAllFilters} className="btn-primary text-sm">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg glass text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-10 h-10 rounded-lg text-sm font-medium transition-all',
                      page === currentPage
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'glass text-slate-400 hover:text-white'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg glass text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface-950 border-l border-white/10 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-white font-semibold">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                totalActive={totalActive}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
