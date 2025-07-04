
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmissionButtonProps {
  isSubmitting: boolean;
}

export const SubmissionButton = ({ isSubmitting }: SubmissionButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-4 text-lg font-semibold bg-vello-orange hover:bg-vello-orange/90 transition-all duration-300 transform hover:scale-[1.02]"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Salvando orçamento...
        </>
      ) : (
        'Solicitar Orçamento Gratuito'
      )}
    </Button>
  );
};
