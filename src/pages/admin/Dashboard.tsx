import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Tag, 
  Percent, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Панель управления', icon: LayoutDashboard, path: '/admin' },
    { name: 'Товары', icon: Package, path: '/admin/products' },
    { name: 'Категории', icon: FolderTree, path: '/admin/categories' },
    { name: 'Бренды', icon: Tag, path: '/admin/brands' },
    { name: 'Акции', icon: Percent, path: '/admin/promotions' },
    { name: 'Правила цен', icon: DollarSign, path: '/admin/price-rules' },
    { name: 'Настройки', icon: Settings, path: '/admin/settings' },
  ];

  const stats = [
    { label: 'Всего товаров', value: '1,234' },
    { label: 'Категорий', value: '12' },
    { label: 'Брендов', value: '45' },
    { label: 'Активных акций', value: '5' },
  ];

  return (
    <div className="min-h-screen bg-background flex dark">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-sidebar border-r border-sidebar-border transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <h1 className="font-display text-xl font-bold text-sidebar-foreground">
                <span className="text-primary">PITER</span> Smoke
              </h1>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sidebar-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Выйти</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-bold mb-8 uppercase">Панель управления</h1>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 border border-border">
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-display text-xl font-bold mb-4 uppercase">Быстрые действия</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/products">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Добавить товар
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="outline" className="w-full">
                Управление категориями
              </Button>
            </Link>
            <Link to="/admin/promotions">
              <Button variant="outline" className="w-full">
                Создать акцию
              </Button>
            </Link>
            <Link to="/admin/price-rules">
              <Button variant="outline" className="w-full">
                Массовые цены
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
