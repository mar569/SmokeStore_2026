
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Кальяны', slug: 'hookahs', productsCount: 154 },
    { id: 2, name: 'Табак для кальяна', slug: 'hookah-tobacco', productsCount: 423 },
    { id: 3, name: 'Электронные сигареты', slug: 'e-cigarettes', productsCount: 245 },
    { id: 4, name: 'Вейпы', slug: 'vapes', productsCount: 189 },
    { id: 5, name: 'Жевательный табак', slug: 'chewing-tobacco', productsCount: 67 },
    { id: 6, name: 'Уголь', slug: 'charcoal', productsCount: 34 },
    { id: 7, name: 'Аксессуары', slug: 'accessories', productsCount: 122 },
  ];

  return (
    <AdminLayout title="Управление категориями">
      <div className="flex justify-end mb-6">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-5 w-5" />
          Добавить категорию
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">/{category.slug}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {category.productsCount} товаров
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Categories;
