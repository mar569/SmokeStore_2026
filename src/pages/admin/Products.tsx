
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Моковые данные товаров
  const products = [
    { id: 1, name: 'Darkside Core 100g', category: 'Табак', brand: 'Darkside', price: 850, stock: 45 },
    { id: 2, name: 'Alpha Hookah Model X', category: 'Кальяны', brand: 'Alpha Hookah', price: 15000, stock: 8 },
    { id: 3, name: 'Inflaye Mini 1000', category: 'Электронные сигареты', brand: 'Inflaye', price: 450, stock: 120 },
  ];

  return (
    <AdminLayout title="Управление товарами">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-5 w-5" />
          Добавить товар
        </Button>
      </div>

      {/* Products table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Название</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Категория</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Бренд</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Цена</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Остаток</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{product.brand}</td>
                <td className="px-4 py-3">{product.price.toLocaleString()} ₽</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {product.stock} шт
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Products;
