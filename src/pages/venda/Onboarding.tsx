import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Clock, Bike, Send, ArrowLeft, UtensilsCrossed, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    logo: '🍕',
    deliveryFee: '',
    prepTime: '',
    openTime: '18:00',
    closeTime: '23:30',
    street: '',
    number: '',
    neighborhood: '',
    zip: '',
    city: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `🍕 *NOVO ONBOARDING - PIZZA PRÁTICO*

📋 *DADOS DA EMPRESA*
- Nome: ${formData.name}
- WhatsApp: ${formData.whatsapp}
- Logo: ${formData.logo}

⚙️ *CONFIGURAÇÕES*
- Taxa de Entrega: R$ ${formData.deliveryFee}
- Tempo Preparo: ${formData.prepTime} min
- Horário: ${formData.openTime} às ${formData.closeTime}

📍 *ENDEREÇO*
- Rua: ${formData.street}, ${formData.number}
- Bairro: ${formData.neighborhood}
- CEP: ${formData.zip}
- Cidade: ${formData.city}

✅ *Assinatura: R$ 189,97/mês (Setup Incluso)*
✅ *Pagamento Confirmado via Asaas.*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511910008164?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/venda/sucesso')}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold">Configuração da sua Pizzaria</h1>
          <p className="text-gray-400">Preencha os dados abaixo para ativarmos seu sistema.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Sessão 1: Identidade */}
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold border-b border-white/5 pb-4">
              <Store className="h-5 w-5" />
              Identidade do Negócio
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Nome da Pizzaria</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Pizzaria Atlantas"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">WhatsApp para Pedidos</label>
                <input 
                  required
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sessão 2: Operacional */}
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold border-b border-white/5 pb-4">
              <Clock className="h-5 w-5" />
              Operação e Logística
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Taxa Entrega</label>
                <input 
                  required
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  placeholder="6,00"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Tempo Preparo</label>
                <input 
                  required
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  placeholder="35 min"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Abertura</label>
                <input 
                  type="time"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Fechamento</label>
                <input 
                  type="time"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sessão 3: Endereço */}
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold border-b border-white/5 pb-4">
              <MapPin className="h-5 w-5" />
              Endereço Físico
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Rua / Logradouro</label>
                <input 
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Número</label>
                <input 
                  required
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Bairro</label>
                <input 
                  required
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">CEP</label>
                <input 
                  required
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-500">Cidade</label>
                <input 
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full h-16 text-lg font-bold gradient-primary group shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            ENVIAR PARA ATIVAÇÃO NO WHATSAPP
            <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>

          <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Dados protegidos e enviados via canal oficial de suporte.
          </p>

        </form>
      </div>
    </div>
  );
}
