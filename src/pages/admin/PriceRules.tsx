
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';

const PriceRules = () => {
  const priceRules = [
    { id: 1, brand: 'Darkside', weight: '100g', price: 850 },
    { id: 2, brand: 'Darkside', weight: '250g', price: 1900 },
    { id: 3, brand: 'Tangiers', weight: '100g', price: 950 },
    { id: 4, brand: 'Must Have', weight: '125g', price: 800 },
  ];

  return (
    <AdminLayout title="Правила массового ценообразования">
      <div className="bg-card rounded-2xl p-6 border border-border mb-6">
        <h2 className="font-display text-xl font-bold mb-4 uppercase">Добавить правило</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Бренд</label>
            <Input placeholder="Выберите бренд" className="rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Вес</label>
            <Input placeholder="100g, 250g..." className="rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Цена</label>
            <Input type="number" placeholder="0" className="rounded-xl" />
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-5 w-5" />
              Добавить
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Бренд</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Вес</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Цена</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {priceRules.map((rule) => (
              <tr key={rule.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{rule.brand}</td>
                <td className="px-4 py-3 text-muted-foreground">{rule.weight}</td>
                <td className="px-4 py-3">{rule.price.toLocaleString()} ₽</td>
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

      <div className="mt-6 bg-muted rounded-2xl p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Как это работает:</strong> Правила ценообразования автоматически применяются ко всем товарам
          указанного бренда и веса. При добавлении нового товара цена будет установлена автоматически.
        </p>
      </div>
    </AdminLayout>
  );
};

export default PriceRules;
