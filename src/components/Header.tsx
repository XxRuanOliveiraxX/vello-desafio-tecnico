
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
}

export const Header = ({ currentView, setCurrentView }: HeaderProps) => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-vello-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vello Group</h1>
              <p className="text-sm text-gray-600">Soluções Tecnológicas</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button
              variant={currentView === 'public' ? 'default' : 'outline'}
              onClick={() => setCurrentView('public')}
              className="transition-all duration-200"
            >
              Orçamentos
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'outline'}
              onClick={() => setCurrentView('admin')}
              className="transition-all duration-200 flex items-center gap-2"
            >
              {user && isAdmin && <Shield className="w-4 h-4" />}
              Painel Admin
              {user && isAdmin && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  Autenticado
                </Badge>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
