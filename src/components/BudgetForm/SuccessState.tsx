
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const SuccessState = () => {
  return (
    <Card className="max-w-2xl mx-auto animate-pulse-success">
      <CardContent className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">Orçamento Enviado!</h3>
        <p className="text-gray-600 mb-4">
          Obrigado pelo seu interesse. Seus dados foram salvos com segurança em nosso banco de dados.
        </p>
        <p className="text-sm text-gray-500">
          Nossa equipe entrará em contato em até 24 horas.
        </p>
      </CardContent>
    </Card>
  );
};
