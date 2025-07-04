
import { useState } from 'react';
import { BudgetForm } from '@/components/BudgetForm';
import { AdminPanel } from '@/components/AdminPanel';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  console.log('Index page rendered, current view:', currentView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vello-gray-light to-vello-gray">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'public' ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-vello-black mb-6">
                Ajudamos e-commerces a
                <span className="text-vello-orange block mt-2">vender mais e crescer</span>
              </h1>
              <p className="text-xl text-vello-blue max-w-3xl mx-auto leading-relaxed mb-8">
                Somos um ecossistema de empresas com uma missão clara: impulsionar o crescimento do seu e-commerce com lucratividade. 
                Atuamos em 4 verticais – tecnologia, serviços, educação e marcas próprias – impactando mais de 3 mil lojistas em todo o Brasil.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-vello-gray max-w-2xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3">
                    <div className="text-2xl font-bold text-vello-orange">3k+</div>
                    <div className="text-sm text-vello-blue">Lojistas</div>
                  </div>
                  <div className="p-3">
                    <div className="text-2xl font-bold text-vello-orange">4</div>
                    <div className="text-sm text-vello-blue">Verticais</div>
                  </div>
                  <div className="p-3">
                    <div className="text-2xl font-bold text-vello-orange">100%</div>
                    <div className="text-sm text-vello-blue">Foco</div>
                  </div>
                  <div className="p-3">
                    <div className="text-2xl font-bold text-vello-orange">Brasil</div>
                    <div className="text-sm text-vello-blue">Todo</div>
                  </div>
                </div>
              </div>
            </div>
            <BudgetForm />
          </div>
        ) : (
          <AdminPanel />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
