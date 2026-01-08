import { Link } from 'react-router-dom';
import { Menu, Search, ChevronDown, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryCounts } from '@/hooks/useCategoryFilters';
import { useProducts } from '@/hooks/useProducts';
import { Separator } from './ui/separator';

interface HeaderProps {
  onSearchOpen?: () => void;
}

const Header = ({ onSearchOpen }: HeaderProps) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false); // Новое состояние для анимации иконки магазина

  const { data: categories } = useCategories();
  const { data: categoryCounts } = useCategoryCounts(categories);
  const { data: products } = useProducts({}); // Получаем все продукты для подсчета

  const mainCategories = categories?.filter(c => !c.parent_id) || [];

  const electronicCount = products?.filter(product => {
    const cat = categories?.find(c => c.id === product.category_id);
    return cat?.product_type === 'electronic' && product.is_active;
  }).length || 0;

  const tobaccoCount = products?.filter(product => {
    const cat = categories?.find(c => c.id === product.category_id);
    return cat?.product_type === 'tobacco' && product.is_active;
  }).length || 0;

  const totalCount = categoryCounts ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <header className="sticky top-0 z-50">
      {/* Верхняя темная полоса */}
      <div className="header-dark">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Меню бургер */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-secondary/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-secondary text-secondary-foreground p-0">
                <div className="p-6">
                  <nav>
                    <Link to="/promotions" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Акции
                    </Link>
                    <Separator />
                    <Link to="/jop" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Работа
                    </Link>
                    <Separator />
                    <Link to="/contacts" className="block py-2 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Контакты
                    </Link>
                  </nav>

                </div>

              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-header-foreground tracking-wider">
                <span className="text-primary">SMOKE</span>
                <span className="italic ml-1">STORE</span>
              </h1>
              <span className="hidden md:block text-xs text-muted-foreground ml-3 border-l border-muted-foreground/30 pl-3">
                КАЛЬЯНЫ • ТАБАК • ВЕЙП
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-header-foreground hover:bg-secondary/80 "
                onClick={onSearchOpen}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Вторая полоса - Каталог */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center justify-between">
            <button
              className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            >
              <Menu className="h-5 w-5" />
              Каталог
              <ChevronDown className={`h-4 w-4 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
            </button>


          </div>
        </div>

        {/* Выпадающий каталог */}
        {isCatalogOpen && (
          <div className="absolute left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/catalog"
                  className="p-4 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all font-medium"
                  onClick={() => setIsCatalogOpen(false)}
                >
                  Все категории
                </Link>
                {mainCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalog?category=${cat.slug}`}
                    className="p-4 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all font-medium"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}

              </div>
            </div>
          </div>
        )}
      </div>


      <div className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <Link to="/contacts"
            className="flex items-center gap-2 py-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            onClick={() => setIsStoreOpen(!isStoreOpen)}
          >
            Магазин по адресу ул. Жука, д. 4
            <ChevronDown className={`h-4 w-4 transition-transform ${isStoreOpen ? '' : 'rotate-180'}`} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;