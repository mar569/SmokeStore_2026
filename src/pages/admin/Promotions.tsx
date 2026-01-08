
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

const AdminPromotions = () => {
  const promotions = [
    { id: 1, name: '1000 бонусов при регистрации', active: true, startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 2, name: 'Жёлтая цена', active: true, startDate: '2024-01-01', endDate: null },
    { id: 3, name: 'Скидка 15% на Darkside', active: true, startDate: '2024-06-01', endDate: '2024-06-30' },
    { id: 4, name: 'Бесплатный уголь', active: false, startDate: '2024-03-01', endDate: '2024-03-31' },
  ];

  return (
    <AdminLayout title="Управление акциями">
      <div className="flex justify-end mb-6">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-5 w-5" />
          Создать акцию
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Название</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Статус</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Период</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{promo.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${promo.active ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                    }`}>
                    {promo.active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {promo.active ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">
                  {promo.startDate} - {promo.endDate || 'бессрочно'}
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

export default AdminPromotions;
