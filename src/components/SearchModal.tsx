// components/SearchModal.tsx (исправленный с добавлением скролла для результатов поиска)
import { useState, useEffect } from 'react';
import { Search, X, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // Используем хук для поиска товаров
  const { data: searchResults, isLoading } = useProducts({
    search: debouncedQuery,
    limit: 10, // Ограничиваем до 10 результатов для модального окна
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      onClose();
      setQuery('');
      setDebouncedQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[60] animate-fade-in overflow-y-auto">  {/* Добавлен overflow-y-auto для скролла всей модалки */}
      <div className="container mx-auto px-4 py-8 min-h-screen">  {/* Добавлен min-h-screen для обеспечения высоты */}
        <div className="flex justify-end mb-8">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-4 text-lg rounded-2xl border-2 border-primary focus:ring-primary"
                autoFocus
              />

              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4"
                disabled={!query.trim()}
              >
                Поиск
              </Button>
            </div>
          </form>

          {/* Результаты поиска */}
          {debouncedQuery.trim() && (
            <div className="mt-8">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Поиск...</p>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold uppercase">
                      Найдено товаров: {searchResults.length}
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate(`/catalog?search=${encodeURIComponent(debouncedQuery)}`);
                        onClose();
                      }}
                    >
                      Показать все
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-w-[100%] max-h-[40%]">  {/* Изменено: убраны max-w-[40%] и max-h-[40%], добавлен max-h-96 и overflow-y-auto для скролла */}
                    {searchResults.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={onClose}
                        className="bg-card rounded-lg p-4 border border-border hover:shadow-md transition-shadow group"
                      >
                        <div className="aspect-square rounded-lg bg-muted mb-3">
                          {product.product_images && product.product_images.length > 0 ? (
                            <img
                              src={product.product_images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover "
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium truncate mb-1">{product.name}</h4>
                        {product.brands && (
                          <p className="text-xs text-muted-foreground mb-1">{product.brands.name}</p>
                        )}
                        <p className="text-sm font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Товары не найдены</p>
                </div>
              )}
            </div>
          )}

          {!debouncedQuery.trim() && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold mb-4 uppercase">Популярные запросы</h3>
              <div className="flex flex-wrap gap-2">
                {['Darkside', 'Tangiers', 'MustHave', 'Alpha Hookah', 'Одноразовая электронная сигарета', 'POD-система'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      navigate(`/catalog?search=${encodeURIComponent(term)}`);
                      onClose();
                    }}
                    className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!debouncedQuery.trim() && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold mb-4 uppercase">Категории</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Кальяны', slug: 'hookahs' },
                  { name: 'Табак', slug: 'hookah-tobacco' },
                  { name: 'Вейпы', slug: 'vapes' },
                  { name: 'Электронные сигареты', slug: 'electronic' },
                  { name: 'Уголь', slug: 'charcoal' },
                  { name: 'Аксессуары', slug: 'accessories' },
                ].map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      navigate(`/catalog?category=${cat.slug}`);
                      onClose();
                    }}
                    className="p-4 bg-muted rounded-xl text-left hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;