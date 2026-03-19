import { motion } from 'framer-motion';
import { PartyPopper, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SalesSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2, rotate: 360 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.5)]"
          >
            <CheckCircle2 className="h-12 w-12 text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary rounded-full scale-110"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            Paraéns! <PartyPopper className="text-primary h-8 w-8" />
          </h1>
          <p className="text-gray-400 text-lg">
            Sua vaga no Pizza Prático CRM está garantida. <br />
            Estamos ansiosos para impulsionar suas vendas!
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-center gap-3 text-sm font-bold text-primary uppercase">
            <ShoppingBag className="h-4 w-4" />
            Próximos Passos
          </div>
          <p className="text-sm text-gray-300">
            Agora precisamos de alguns dados básicos da sua pizzaria para configurar seu painel e liberar seu acesso exclusivo.
          </p>
        </div>

        <Button 
          onClick={() => navigate('/venda/onboarding')}
          className="w-full h-14 text-lg font-bold gradient-primary group shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          CONFIGURAR MEUS DADOS
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-xs text-gray-600">
          Você receberá um e-mail de confirmação em instantes.
        </p>
      </motion.div>
    </div>
  );
}
