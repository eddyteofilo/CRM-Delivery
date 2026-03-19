import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Store, 
  MapPin, 
  Smartphone, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  ChevronDown,
  Star,
  Navigation,
  Globe,
  Users,
  ChevronLeft,
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Importando screenshots reais para o Tour (Caminhos Relativos para redundância)
import adminProducts from '../assets/tour-screens/admin_products.png';
import adminOrders from '../assets/tour-screens/admin_orders.png';
import adminSettings from '../assets/tour-screens/admin_settings.png';
import customerTracking from '../assets/tour-screens/customer_tracking.png';
import customerMenu from '../assets/tour-screens/customer_menu.png';

export default function Landing() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Basic SEO
    document.title = "Pizza Prático CRM - O Sistema de Delivery que Escala sua Pizzaria";
    
    const metaTags = [
      { name: 'description', content: 'Recupere sua margem de lucro com o Pizza Prático CRM. Cardápio inteligente, rastreio ao vivo via Google Maps e gestão profissional completa sem taxas abusivas por pedido.' },
      { name: 'keywords', content: 'crm delivery, sistema para pizzaria, cardápio digital, rastreio motoboy, pizza prático, gestão delivery' },
      { property: 'og:title', content: 'Pizza Prático CRM - Venda mais sem pagar comissões' },
      { property: 'og:description', content: 'Ecossistema completo de vendas diretas para pizzarias. Cardápio inteligente e rastreio ao vivo.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://pizzapratico.com.br/og-image.jpg' }
    ];

    metaTags.forEach(tag => {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (tag.name) el.setAttribute('name', tag.name);
        if (tag.property) el.setAttribute('property', tag.property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', tag.content);
    });

    // Structured Data (JSON-LD)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Pizza Prático CRM",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "149.87",
        "priceCurrency": "BRL"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "540"
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 100);
    });
  }, [scrollY]);

  const features = [
    {
      title: 'Cardápio Digital Inteligente',
      desc: 'Um catálogo deslumbrante que converte visitantes em clientes em segundos. Zero atrito na compra.',
      icon: Store,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Rastreio em Tempo Real',
      desc: 'Integração real de rotas com Google Maps. Seu cliente acompanha a entrega ao vivo e sem ansiedade.',
      icon: MapPin,
      gradient: 'from-red-500 to-purple-600'
    },
    {
      title: 'Gestão Profissional',
      desc: 'Painel exclusivo para motoboys com roteirização automática e controle total de produtividade.',
      icon: Navigation,
      gradient: 'from-purple-600 to-blue-600'
    },
  ];

  const benefits = [
    'Sem taxas abusivas por pedido',
    'Pedidos ilimitados mensais',
    'Suporte VIP via WhatsApp',
    'Gestão completa de clientes',
    'Relatórios financeiros automáticos'
  ];

  const faqs = [
    { q: 'Preciso instalar algo no meu computador?', a: 'Não! O Pizza Prático é 100% cloud. Você acessa de qualquer navegador no PC, Tablet ou Smartphone.' },
    { q: 'Como funciona o rastreio para o cliente?', a: 'Assim que o entregador sai, o cliente recebe um link (via Zap ou Order Page) onde vê o motoboy se movendo no mapa em tempo real.' },
    { q: 'O setup realmente inclui tudo?', a: 'Sim! No setup, nós configuramos seu cardápio, integramos sua conta e treinamos sua equipe para que você comece a vender no mesmo dia.' },
    { q: 'Posso cancelar a assinatura se não gostar?', a: 'Com certeza. Não temos fidelidade. Queremos que você fique conosco pelo valor que entregamos, não por um contrato.' },
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-orange-500/30 selection:text-white font-sans overflow-x-hidden">
      
      {/* Background Polish */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none -z-10" />

      {/* Navbar with Sticky Logic */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
              <span className="text-2xl">🍕</span>
            </div>
            <span className="text-xl font-black tracking-tighter">Pizza Prático <span className="text-orange-500 italic">CRM</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Funcionalidades</a>
            <a href="#pricing" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">Preços</a>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/venda/checkout')}
              className="text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5"
            >
              Logar no Painel
            </Button>
            <Button 
              onClick={() => navigate('/venda/checkout')}
              className="gradient-primary rounded-full px-8 font-black text-[10px] h-11 shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]"
            >
              GARANTIR MEU SISTEMA
            </Button>
          </div>
          <Button 
            onClick={() => navigate('/venda/checkout')}
            className="gradient-primary rounded-xl px-6 font-bold text-[10px] h-10 lg:hidden"
          >
            COMEÇAR
          </Button>
        </div>
      </nav>

      <main>
        {/* Hero Section - High Conversion Format */}
        <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-32 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-orange-400 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] mb-4">
              <Users className="h-4 w-4" /> Confiado por +500 Pizzarias
            </div>
            
            <h1 className="text-6xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] lg:leading-[0.8]">
              Venda mais sem <br/>pagar <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">comissões.</span>
            </h1>
            
            <p className="text-gray-400 text-lg lg:text-3xl max-w-4xl mx-auto leading-relaxed font-medium">
              Recupere sua margem de lucro com um ecossistema completo de vendas diretas. Cardápio inteligente, rastreio ao vivo e gestão automática.
            </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              onClick={() => navigate('/venda/checkout')}
              size="lg"
              className="px-12 py-8 text-xl font-black gradient-primary rounded-2xl shadow-[0_20px_50px_-15px_rgba(239,68,68,0.6)] hover:scale-105 transition-all w-full sm:w-auto overflow-hidden group relative"
            >
              <span className="relative z-10">GARANTIR MEU SISTEMA AGORA</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
            <Button 
              onClick={() => navigate('/venda/checkout')}
              variant="outline"
              size="lg"
              className="px-12 py-8 text-xl font-bold border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-2xl w-full sm:w-auto backdrop-blur-sm"
            >
              Ver Demo Online
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-3 pt-12">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
              ))}
            </div>
            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Avaliado em 5/5 por donos de pizzarias</p>
          </div>
        </motion.div>

          {/* Product Visual Mockup - Platform Tour */}
          <PlatformTour />
        </section>

      {/* Problems Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-end">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-7xl font-black leading-none tracking-tighter">
                O iFood é sócio <br/>do seu <span className="text-red-500">lucro?</span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                Manter um delivery hoje é lutar contra taxas abusivas, falta de dados dos clientes e entregas desorganizadas. Nós resolvemos isso de ponta a ponta.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               {[
                 { t: 'Taxas Abusivas', d: 'Recupere até 30% da sua margem em cada pedido direto.' },
                 { t: 'Dados Perdidos', d: 'Saiba quem é seu cliente e faça marketing direto (WhatsApp).' },
                 { t: 'Caos Logístico', d: 'Elimine erros no preparo e acompanhe entregas em tempo real.' },
                 { t: 'Falta de Controle', d: 'Relatórios financeiros que realmente mostram onde está o dinheiro.' },
               ].map((p, i) => (
                 <div key={i} className="p-6 rounded-2xl border border-white/5 bg-black/40">
                   <h4 className="font-bold text-white mb-2">{p.t}</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">{p.d}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32" id="features">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter">A plataforma <span className="text-orange-500 italic">mais completa</span> do Brasil.</h2>
            <p className="text-gray-400 text-lg">Tudo o que uma grande rede de pizzarias usa, agora disponível para você.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feat.gradient} opacity-0 group-hover:opacity-10 blur-[60px] transition-opacity duration-700`} />
                <div className="relative p-12 rounded-[3.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all h-full text-left">
                  <div className={`h-20 w-20 rounded-[1.5rem] bg-gradient-to-r ${feat.gradient} flex items-center justify-center mb-10 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.5)]`}>
                    <feat.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black mb-6 tracking-tight">{feat.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">{feat.desc}</p>
                  <Button variant="link" className="text-orange-500 p-0 font-bold hover:gap-3 transition-all">Ver detalhes <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - 3 Easy Steps */}
      <section className="py-32 bg-[#0a0a0b] relative">
        <div className="container mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter">Coloque no ar hoje.</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Lines */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />
              
              {[
                { n: '01', t: 'Configuração VIP', d: 'Nossa equipe faz o setup completo: cardápio, fotos e integrações. Você não se preocupa com nada.' },
                { n: '02', t: 'Ativação Logística', d: 'Cadastramos seus entregadores e configuramos as rotas inteligentes do Google Maps.' },
                { n: '03', t: 'Lucro no Bolso', d: 'Comece a receber pedidos. O dinheiro cai direto na sua conta, sem descontos abusivos.' },
              ].map((step, i) => (
                <div key={i} className="relative z-10 text-center space-y-6">
                   <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto backdrop-blur-lg">
                      <span className="text-4xl font-black text-orange-500">{step.n}</span>
                   </div>
                   <h4 className="text-2xl font-black">{step.t}</h4>
                   <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">{step.d}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Pricing Section - SaaS Focus */}
      <section className="py-32" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <div className="inline-flex px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest uppercase mb-4">Economize até R$ 5.000/mês</div>
             <h2 className="text-5xl lg:text-7xl font-black tracking-tighter">Transparência Total.</h2>
             <p className="text-gray-400 text-lg">Investimento inteligente que se paga na primeira semana.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
             <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-purple-600 blur-[100px] opacity-10 pointer-events-none" />
                <div className="relative bg-[#0d0d0f] border-2 border-orange-500/30 rounded-[3rem] p-10 lg:p-16 shadow-2xl overflow-hidden backdrop-blur-2xl">
                   
                   <div className="absolute top-0 right-0 bg-orange-500 text-black px-10 py-3 rounded-bl-[2rem] text-xs font-black tracking-widest uppercase shadow-lg">SOLUÇÃO COMPLETA</div>
                   
                   <div className="grid lg:grid-cols-2 gap-16 items-center">
                      <div className="space-y-8">
                         <div className="space-y-2">
                            <h3 className="text-4xl font-black tracking-tighter italic">BUSINESS PLAN</h3>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tudo liberado. Sem limites.</p>
                         </div>
                         
                         <div className="space-y-4">
                            {benefits.map((b, i) => (
                              <div key={i} className="flex items-center gap-4 group">
                                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
                                   <CheckCircle2 className="h-4 w-4 text-orange-500 group-hover:text-black transition-colors" />
                                </div>
                                <span className="text-gray-300 font-bold">{b}</span>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-black/40 rounded-[2.5rem] p-10 border border-white/5 text-center flex flex-col items-center">
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Assinatura Mensal</span>
                         <div className="flex items-start justify-center gap-2 mb-8">
                            <span className="text-2xl font-black text-gray-500 mt-4 leading-none">R$</span>
                            <span className="text-8xl lg:text-[9rem] font-black text-white leading-[0.8]">189</span>
                            <div className="text-left mt-6">
                               <p className="text-2xl font-black text-gray-500">,87</p>
                               <p className="text-[10px] font-black text-gray-600 tracking-wider">/MÊS</p>
                            </div>
                         </div>
                         
                         <div className="w-full h-px bg-white/5 mb-8" />
                         
                         <div className="flex flex-col items-center gap-2">
                             <div className="flex items-baseline gap-2">
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Setup:</span>
                                <span className="text-2xl font-black text-white">GRÁTIS</span>
                             </div>
                             <p className="text-[10px] text-orange-500 font-black uppercase underline decoration-2 underline-offset-4">Implementação Total Inclusa</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-16 space-y-6">
                      <Button 
                         onClick={() => navigate('/venda/checkout')}
                         className="w-full py-12 text-2xl font-black gradient-primary rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(239,68,68,0.5)] hover:scale-[1.02] transition-all"
                      >
                         QUERO MEU SISTEMA AGORA
                         <ArrowRight className="ml-4 h-8 w-8" />
                      </Button>
                      <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                         <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Pagamento Seguro</span>
                         <span className="flex items-center gap-2"><Zap className="h-3 w-3" /> Acesso Imediato</span>
                         <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Sem Fidelidade</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ - Object Destruction Focus */}
      <section className="py-32 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter">Ainda tem dúvidas?</h2>
              <p className="text-gray-500">Respondemos o que a maioria dos donos de pizzaria pergunta.</p>
           </div>
           <div className="grid gap-4">
             {faqs.map((f, i) => (
               <div key={i} className={`border rounded-[1.5rem] transition-all duration-300 ${activeFaq === i ? 'border-orange-500/50 bg-white/[0.04]' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]'}`}>
                 <button 
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                   className="w-full p-8 flex items-center justify-between text-left"
                 >
                   <span className="font-black text-xl lg:text-2xl pr-8">{f.q}</span>
                   <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all ${activeFaq === i ? 'bg-orange-500 text-black rotate-180' : 'bg-white/5 text-gray-500'}`}>
                      <ChevronDown className="h-6 w-6" />
                   </div>
                 </button>
                 {activeFaq === i && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="px-8 pb-8 text-gray-400 text-lg leading-relaxed max-w-2xl"
                   >
                     {f.a}
                   </motion.div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-red-600/20 blur-[120px] pointer-events-none" />
         <div className="container mx-auto px-6 text-center space-y-12">
            <h2 className="text-5xl lg:text-8xl font-black leading-none tracking-tighter max-w-5xl mx-auto">
               Pare de lutar sozinho. <br/>Escala seu <span className="text-orange-500 italic">delivery.</span>
            </h2>
            <Button 
               onClick={() => navigate('/venda/checkout')}
               size="lg"
               className="px-16 py-10 text-2xl font-black gradient-primary rounded-[2rem] shadow-2xl hover:scale-110 hover:-rotate-1 transition-all"
            >
               COMEÇAR AGORA
            </Button>
            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Transformação Digital • Pizza Prático CRM</p>
         </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#030303]">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
              <div className="flex items-center gap-3">
                 <div className="h-12 w-12 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl">🍕</div>
                 <div>
                    <span className="block text-2xl font-black tracking-tighter uppercase leading-none">Pizza Prático</span>
                    <span className="text-[10px] font-black text-orange-500 tracking-[0.5em] uppercase">Ecossistema Profissional</span>
                 </div>
              </div>
              <div className="flex gap-12">
                 <div className="space-y-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Produto</p>
                    <ul className="space-y-2 text-sm font-bold text-gray-400">
                       <li className="hover:text-white cursor-pointer transition-colors">Funcionalidades</li>
                       <li className="hover:text-white cursor-pointer transition-colors">Modo Demo</li>
                       <li className="hover:text-white cursor-pointer transition-colors">Preços</li>
                    </ul>
                 </div>
                 <div className="space-y-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Empresa</p>
                    <ul className="space-y-2 text-sm font-bold text-gray-400">
                       <li className="hover:text-white cursor-pointer transition-colors">Sobre</li>
                       <li className="hover:text-white cursor-pointer transition-colors">Suporte</li>
                       <li className="hover:text-white cursor-pointer transition-colors">Termos</li>
                    </ul>
                 </div>
              </div>
           </div>
           <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
              <p>© 2026 Pizza Prático CRM. Desenvolvido para máxima conversão.</p>
              <div className="flex gap-8">
                 <span className="flex items-center gap-2"><Globe className="h-3 w-3" /> Brasil</span>
                 <span>Feito com ❤️ por Especialistas</span>
              </div>
           </div>
        </div>
      </footer>

    </div>
  );
}

function PlatformTour() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: 'Gestão de Cardápio Admin',
      desc: 'Controle preços, tamanhos e categorias em uma interface intuitiva.',
      img: adminProducts
    },
    {
      title: 'Painel de Pedidos & Rastreio',
      desc: 'Monitore pedidos em tempo real e a localização exata dos motoboys.',
      img: adminOrders
    },
    {
      title: 'Configurações do Delivery',
      desc: 'Personalize horários, taxas de entrega e dados da sua pizzaria.',
      img: adminSettings
    },
    {
      title: 'Status para o Cliente',
      desc: 'Seu cliente acompanha a entrega com mapa vivo e previsão de chegada.',
      img: customerTracking
    },
    {
      title: 'Cardápio Digital Premium',
      desc: 'Venda direta pelo WhatsApp com um catálogo deslumbrante e sem taxas.',
      img: customerMenu
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="mt-20 lg:mt-32 relative max-w-7xl mx-auto"
    >
      <div className="relative rounded-[2rem] lg:rounded-[3rem] border border-white/10 bg-black/40 p-2 lg:p-4 backdrop-blur-xl shadow-[0_0_100px_-20px_rgba(249,115,22,0.2)] overflow-hidden">
        <div className="aspect-[16/10] lg:aspect-[21/9] bg-[#0c0c0e] rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden relative border border-white/5 group">
          
          {/* Internal Content (Active Slide) */}
          <div className="absolute inset-0">
            {slides.map((slide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === idx ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black"
              >
                {/* Blurred Background for Premium Look */}
                <div 
                  className="absolute inset-0 opacity-30 blur-3xl scale-110"
                  style={{ 
                    backgroundImage: `url(${slide.img})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                  }} 
                />
                
                <img 
                  src={slide.img} 
                  className="relative z-10 max-h-full max-w-full object-contain shadow-2xl"
                  alt={slide.title}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
                
                <div className="absolute bottom-10 lg:bottom-16 left-10 lg:left-16 text-left max-w-2xl space-y-2 z-30">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: currentSlide === idx ? 0 : 20, opacity: currentSlide === idx ? 1 : 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-1 w-8 bg-orange-500 rounded-full" />
                    <span className="text-orange-500 font-black uppercase tracking-widest text-[10px]">Review do Sistema</span>
                  </motion.div>
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: currentSlide === idx ? 0 : 20, opacity: currentSlide === idx ? 1 : 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl lg:text-5xl font-black tracking-tighter"
                  >
                    {slide.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: currentSlide === idx ? 0 : 20, opacity: currentSlide === idx ? 1 : 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg lg:text-xl font-medium"
                  >
                    {slide.desc}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="absolute top-10 right-10 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-12 bg-orange-500' : 'w-4 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Interactive Floating Element */}
      <div className="absolute -top-10 -left-6 hidden xl:block p-6 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)]">
               <Zap className="h-6 w-6 text-black fill-black" />
            </div>
            <div className="text-left">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Status do Sistema</p>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-bold text-white tracking-tight">Servidores Online</p>
               </div>
            </div>
         </div>
      </div>

      {/* Decorative floating card */}
      <div className="absolute -bottom-10 -right-6 hidden lg:block p-8 rounded-[2rem] border border-white/10 bg-black/90 backdrop-blur-2xl shadow-2xl max-w-[280px] text-left scale-110 origin-bottom-right">
         <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
               <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Economia em taxas</p>
              <p className="text-2xl font-black text-white">+ R$ 4.250,00</p>
            </div>
         </div>
         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: '85%' }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full bg-gradient-to-r from-green-500 to-emerald-400" 
            />
         </div>
         <p className="text-[10px] font-bold text-gray-600 text-center">ROI Médio: 15x por mês</p>
      </div>
    </motion.div>
  );
}
