
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Brands = () => {
  const brands = [
    { id: 1, name: 'Darkside', productsCount: 89 },
    { id: 2, name: 'Tangiers', productsCount: 67 },
    { id: 3, name: 'Must Have', productsCount: 45 },
    { id: 4, name: 'Alpha Hookah', productsCount: 23 },
    { id: 5, name: 'Element', productsCount: 56 },
    { id: 6, name: 'Burn', productsCount: 34 },
  ];

  return (
    <AdminLayout title="Управление брендами">
      <div className="flex justify-end mb-6">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-5 w-5" />
          Добавить бренд
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Название</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Количество товаров</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{brand.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{brand.productsCount} товаров</td>
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

export default Brands;
