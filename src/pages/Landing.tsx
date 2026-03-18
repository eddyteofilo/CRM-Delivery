import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Store, MapPin, Smartphone, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Cardápio Digital Elegante',
      desc: 'Um catálogo de produtos deslumbrante, pensado para converter em segundos.',
      icon: Store,
    },
    {
      title: 'Rastreio em Tempo Real',
      desc: 'Integração real de rotas e entrega. O cliente sabe exatamente onde a pizza está.',
      icon: MapPin,
    },
    {
      title: 'Totalmente Web & Mobile',
      desc: 'Funciona nativamente no celular ou PC, sem quebrar o layout.',
      icon: Smartphone,
    },
  ];

  const steps = [
    'Sem taxas por pedido.',
    'Pedidos ilimitados no mês.',
    'Suporte técnico dedicado.',
    'Servidor de altíssima performance.'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30">
      
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl drop-shadow-lg">🍕</span>
            <span className="text-xl font-bold tracking-tight text-white">Pizza Prático <span className="text-primary">CRM</span></span>
          </div>
          <button 
            onClick={() => navigate('/admin/login')}
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Já sou assinante
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white">
              Sua pizzaria na <span className="text-transparent bg-clip-text gradient-primary">era digital.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Assuma o hipercontrole do seu delivery. Dashboard inteligente, rotas reais com o Google Maps, e zero pagamento de taxas abusivas aos aplicativos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/admin/login')}
                className="group relative px-8 py-4 gradient-primary text-white rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_60px_-15px_rgba(239,68,68,0.7)] transition-all flex items-center gap-2"
              >
                Acessar Demonstração Grautita
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground/60">Não requer cartão de crédito • Acesso Imediato</p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-t border-white/5 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">Tecnologia Feita Para Crescer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm hover:border-primary/20 transition-colors"
               >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-card border border-primary/20 rounded-[2.5rem] p-8 lg:p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
            
            {/* Glow Effect */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/30 blur-[100px] rounded-full" />
            
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">Mude hoje para o sistema próprio.</h2>
              <div className="space-y-4">
                {steps.map(step => (
                  <div key={step} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-[350px] bg-background/80 backdrop-blur border border-white/10 rounded-3xl p-8 text-center">
              <p className="text-primary font-bold mb-4">ASSINATURA PREMIUM</p>
              <div className="flex items-end justify-center gap-1 mb-8">
                <span className="text-3xl font-bold text-muted-foreground">R$</span>
                <span className="text-6xl font-black text-white">97</span>
                <span className="text-muted-foreground mb-2">/mês</span>
              </div>
              <button className="w-full py-4 gradient-primary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
                Assinar Plano Agora
              </button>
              <p className="text-xs text-muted-foreground mt-4">Cobrança processada com segurança via Asaas.</p>
            </div>

          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-muted-foreground">
        <p>© 2026 Pizza Prático CRM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
