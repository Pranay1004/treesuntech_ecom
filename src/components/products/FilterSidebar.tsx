import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: {
    materials: string[];
    technologies: string[];
    industries: string[];
    sizes: readonly string[];
    finishes: string[];
  };
  activeFilters: Record<string, string[]>;
  onFilterChange: (category: string, value: string) => void;
  onClearAll: () => void;
  totalActive: number;
}

interface FilterGroupProps {
  title: string;
  options: readonly string[];
  selected: string[];
  onChange: (value: string) => void;
}

function FilterGroup({ title, options, selected, onChange }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-white text-sm font-semibold uppercase tracking-wider">
          {title}
          {selected.length > 0 && (
            <span className="ml-2 text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-slate-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <div className="space-y-2">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 py-1 cursor-pointer group"
            >
              <div
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200',
                  selected.includes(opt)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-slate-600 group-hover:border-slate-400'
                )}
              >
                {selected.includes(opt) && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className={cn(
                  'text-sm transition-colors',
                  selected.includes(opt) ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                )}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  totalActive,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="glass-card p-5 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold font-display">Filters</h3>
          {totalActive > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Clear All ({totalActive})
            </button>
          )}
        </div>

        <FilterGroup
          title="Material"
          options={filters.materials}
          selected={activeFilters.material || []}
          onChange={(v) => onFilterChange('material', v)}
        />
        <FilterGroup
          title="Technology"
          options={filters.technologies}
          selected={activeFilters.technology || []}
          onChange={(v) => onFilterChange('technology', v)}
        />
        <FilterGroup
          title="Industry"
          options={filters.industries}
          selected={activeFilters.industry || []}
          onChange={(v) => onFilterChange('industry', v)}
        />
        <FilterGroup
          title="Size"
          options={filters.sizes}
          selected={activeFilters.size || []}
          onChange={(v) => onFilterChange('size', v)}
        />
        <FilterGroup
          title="Finish"
          options={filters.finishes}
          selected={activeFilters.finish || []}
          onChange={(v) => onFilterChange('finish', v)}
        />
      </div>
    </aside>
  );
}
