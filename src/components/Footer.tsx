
export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-vello-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Vello Group</h3>
                <p className="text-sm text-gray-600">Soluções Tecnológicas</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Transformamos ideias em soluções digitais inovadoras. 
              Nossa equipe especializada está pronta para impulsionar seu negócio com tecnologia de ponta.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Desenvolvimento Web</li>
              <li>Aplicativos Mobile</li>
              <li>Marketing Digital</li>
              <li>UI/UX Design</li>
              <li>Análise de Dados</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>contato@vellogroup.com</li>
              <li>+55 (11) 9999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 Vello Group. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
