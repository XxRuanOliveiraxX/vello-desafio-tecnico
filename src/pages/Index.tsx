
import { useState } from 'react';
import { BudgetForm } from '@/components/BudgetForm';
import { AdminPanel } from '@/components/AdminPanel';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  console.log('Index page rendered, current view:', currentView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'public' ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Transforme sua visão em
                <span className="text-vello-blue block mt-2">realidade digital</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Na Vello Group, desenvolvemos soluções tecnológicas personalizadas para impulsionar seu negócio. 
                Solicite seu orçamento e descubra como podemos ajudar você.
              </p>
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
