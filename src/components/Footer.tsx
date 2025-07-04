
export const Footer = () => {
  return (
    <footer className="bg-vello-blue border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                <img 
                  src="/lovable-uploads/49e0e3b0-23ea-45fd-8b99-fd1b0c418e46.png" 
                  alt="Vello Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Vello E-commerce</h3>
                <p className="text-sm text-vello-gray">Ecossistema de Soluções</p>
              </div>
            </div>
            <p className="text-vello-gray text-sm leading-relaxed mb-6">
              Somos um ecossistema de empresas com uma missão clara: ajudar e-commerces a vender mais e crescer com lucratividade. 
              Atuamos em 4 verticais com soluções que impactam mais de 3 mil lojistas em todo o Brasil.
            </p>
            <div className="bg-vello-blue-dark rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-vello-orange">3.000+</div>
                  <div className="text-xs text-vello-gray">Lojistas Atendidos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-vello-orange">4</div>
                  <div className="text-xs text-vello-gray">Verticais de Atuação</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Nossas Verticais</h4>
            <ul className="space-y-2 text-sm text-vello-gray">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-vello-orange rounded-full mr-2"></span>
                Tecnologia
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-vello-orange rounded-full mr-2"></span>
                Serviços
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-vello-orange rounded-full mr-2"></span>
                Educação
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-vello-orange rounded-full mr-2"></span>
                Marcas Próprias
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-vello-gray">
              <li>contato@velloecommerce.com</li>
              <li>+55 (11) 9999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-vello-blue-dark mt-8 pt-8 text-center text-sm text-vello-gray">
          <p>&copy; 2024 Vello E-commerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
