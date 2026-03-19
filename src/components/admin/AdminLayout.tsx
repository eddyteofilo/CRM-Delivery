import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Pizza, Settings, LogOut, Menu, X, Bike } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { to: '/admin/produtos', icon: Pizza, label: 'Produtos' },
  { to: '/admin/entregadores', icon: Bike, label: 'Entregadores' },
  { to: '/admin/config', icon: Settings, label: 'Configurações' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { config, adminLogout, isDemo } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.logo}</span>
            <div>
              <h2 className="font-bold text-sm text-sidebar-foreground">{config.name}</h2>
              <p className="text-xs text-sidebar-foreground/60">Painel Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent w-full transition-colors">
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-card border-b">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.logo}</span>
            <span className="font-bold text-sm">{config.name}</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {mobileOpen && (
          <div className="md:hidden bg-card border-b p-4 space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted w-full">
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {isDemo && (
            <div className="mb-6 bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="text-sm font-bold text-primary">Modo de Demonstração Ativo</p>
                  <p className="text-xs text-muted-foreground">Você pode navegar e testar, mas as alterações <b>não serão salvas</b> no banco de dados.</p>
                </div>
              </div>
              <Link to="/landing" className="hidden sm:block text-xs font-bold text-primary hover:underline">
                Assinar Agora →
              </Link>
            </div>
          )}
          {children}
        </main>

      </div>
    </div>
  );
}
