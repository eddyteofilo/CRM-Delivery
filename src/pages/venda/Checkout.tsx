import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Lock, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AsaasService } from '@/lib/asaas';
import { toast } from 'sonner';

export default function SalesCheckout() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpfCnpj: ''
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.cpfCnpj) {
      toast.error('Preencha todos os campos para continuar.');
      return;
    }

    setLoading(true);
    try {
      // 1. Criar/Recuperar Cliente
      const customer = await AsaasService.createCustomer(formData);
      
      if (!customer?.id) {
        throw new Error('Falha ao registrar cliente.');
      }

      // 2. Criar Assinatura (R$ 189,97 mensal)
      const payment = await AsaasService.createSubscription(customer.id, 189.97);
      
      if (payment?.invoiceUrl) {
        // Redireciona para o checkout do Asaas
        window.location.href = payment.invoiceUrl;
      } else {
        throw new Error('Falha ao gerar link de pagamento.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Lado Esquerdo: Benefícios e Confiança */}
        <div className="space-y-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
            >
              <Zap className="h-3 w-3" />
              Acesso Imediato
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              A escolha certa para escalar sua <span className="text-primary text-glow">Pizzaria.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Adquira agora o ecossistema completo. Sem taxas de setup ocultas, apenas um valor mensal justo.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Suporte prioritário na implementação',
              'Configuração completa de cardápio e taxas',
              'Treinamento para sua equipe de entregadores',
              'Sem taxas por pedido ou comissões',
              'Setup Totalmente Incluso'
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-gray-300"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-bold">Garantia de Satisfação</p>
              <p className="text-sm text-gray-400 font-mono italic">"Seu sistema pronto ou seu dinheiro de volta."</p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário e Checkout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]"
        >
          <div className="mb-8 border-b border-white/5 pb-8">
            <h2 className="text-xl font-bold mb-6">Dados de Faturamento</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo / Razão Social</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Pizzaria Bella Napoli" 
                  className="bg-white/5 border-white/10 h-12"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail para Acesso</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="bg-white/5 border-white/10 h-12"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
                  <Input 
                    id="cpfCnpj" 
                    placeholder="000.000.000-00" 
                    className="bg-white/5 border-white/10 h-12"
                    value={formData.cpfCnpj}
                    onChange={e => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Total Mensal</p>
                    <p className="text-xs text-primary font-bold">Setup Incluso</p>
                  </div>
                  <span className="text-4xl font-bold text-primary font-mono tabular-nums">R$ 189,97</span>
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-bold gradient-primary group shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      FINALIZAR E PAGAR
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="flex items-center gap-4">
              <CreditCard className="h-5 w-5" />
              <Lock className="h-4 w-4" />
              <span className="text-xs uppercase tracking-widest font-bold text-center">Pagamento Seguro via Asaas</span>
            </div>
            <p className="text-[10px] text-center opacity-40">
              Sua assinatura será processada pelo Asaas. Você poderá cancelar a qualquer momento.<br/>
              Ao clicar em Finalizar, você concorda com nossos termos.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
