
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';

type SortOption = 'name' | 'price_asc' | 'price_desc';

interface CatalogToolbarProps {
    filtersCollapsed: boolean;
    setFiltersCollapsed: (collapsed: boolean) => void;
    sortBy: SortOption;
    setSortBy: (value: SortOption) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export default function CatalogToolbar({
    filtersCollapsed,
    setFiltersCollapsed,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
}: CatalogToolbarProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <Button
                variant="outline"
                className="md:hidden gap-2"
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            >
                <Filter className="h-4 w-4" />
                Фильтры
            </Button>

            <div className="flex items-center gap-4">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-40 px-3 py-2 border border-border rounded-lg bg-background"
                >
                    <option value="name">По названию</option>
                    <option value="price_asc">Сначала дешевле</option>
                    <option value="price_desc">Сначала дороже</option>
                </select>

                <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}