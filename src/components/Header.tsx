
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
}

export const Header = ({ currentView, setCurrentView }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-vello-gray">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/49e0e3b0-23ea-45fd-8b99-fd1b0c418e46.png" 
                alt="Vello Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-vello-black">Vello E-commerce</h1>
              <p className="text-sm text-vello-blue">Ecossistema de Soluções</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button
              variant={currentView === 'public' ? 'default' : 'outline'}
              onClick={() => setCurrentView('public')}
              className="transition-all duration-200 bg-vello-orange hover:bg-vello-orange/90 text-white border-vello-orange"
            >
              Orçamentos
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'outline'}
              onClick={() => setCurrentView('admin')}
              className="transition-all duration-200 bg-vello-blue hover:bg-vello-blue/90 text-white border-vello-blue"
            >
              Painel Admin
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
