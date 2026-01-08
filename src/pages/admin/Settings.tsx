
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AdminLayout } from '@/components/admin/AdminLayout';

const Settings = () => {
  const [telegramBot, setTelegramBot] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения успешно применены',
    });
  };

  return (
    <AdminLayout title="Настройки">
      <div className="max-w-2xl space-y-6">
        {/* Telegram уведомления */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-xl font-bold mb-4 uppercase">Telegram уведомления</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Получайте уведомления о новых заказах и обращениях в Telegram
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bot Token</label>
              <Input
                type="text"
                value={telegramBot}
                onChange={(e) => setTelegramBot(e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chat ID</label>
              <Input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="-100123456789"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Email уведомления */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-xl font-bold mb-4 uppercase">Email уведомления</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Укажите email для получения уведомлений
          </p>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pitersmoke.ru"
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Безопасность */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-xl font-bold mb-4 uppercase">Безопасность</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Новый пароль</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Подтверждение пароля</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          Сохранить настройки
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Settings;
