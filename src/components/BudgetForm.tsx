
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFields } from './BudgetForm/FormFields';
import { SubmissionButton } from './BudgetForm/SubmissionButton';
import { SuccessState } from './BudgetForm/SuccessState';
import { useBudgetForm } from '@/hooks/useBudgetForm';

export const BudgetForm = () => {
  const {
    formData,
    isSubmitting,
    submitSuccess,
    errors,
    urgencyAnalysis,
    handleInputChange,
    handleSubmit
  } = useBudgetForm();

  if (submitSuccess) {
    return <SuccessState />;
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
          Solicite seu Orçamento
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Conte-nos sobre seu projeto e receba uma proposta personalizada
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormFields
            formData={formData}
            errors={errors}
            urgencyAnalysis={urgencyAnalysis}
            onInputChange={handleInputChange}
          />
          <SubmissionButton isSubmitting={isSubmitting} />
        </form>
      </CardContent>
    </Card>
  );
};
