import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { PizzeriaConfig } from '@/types';

export default function AdminSettings() {
  const { config, updateConfig, isDemo } = useApp();
  const [form, setForm] = useState<PizzeriaConfig>(config);

  useEffect(() => { setForm(config); }, [config]);

  const handleSave = () => {
    // Monta o endereço completo automaticamente para uso no Google Maps
    const parts = [
      form.addressStreet,
      form.addressNumber,
      form.addressNeighborhood,
      form.addressCity,
    ].filter(Boolean);
    
    const fullAddress = parts.length > 0 
      ? `${parts.join(', ')}, Brasil`
      : form.pizzeriaAddress;

    updateConfig({ ...form, pizzeriaAddress: fullAddress });
    toast.success(isDemo ? 'Simulação: Configurações "salvas" (não enviado ao banco)' : 'Configurações salvas!');
  };


  const inputClass = "w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";
  const labelClass = "text-sm font-medium text-foreground block mb-1";

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>

        {/* Dados da Pizzaria */}
        <div className="bg-card rounded-xl border p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-foreground text-lg">🍕 Dados da Pizzaria</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome da Pizzaria</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Logo (emoji)</label>
              <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Telefone / WhatsApp</label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Abertura</label>
                <input type="time" value={form.openingHours} onChange={e => setForm({ ...form, openingHours: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Fechamento</label>
                <input type="time" value={form.closingHours} onChange={e => setForm({ ...form, closingHours: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Endereço da Pizzaria */}
        <div className="bg-card rounded-xl border p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-foreground text-lg">
            📍 Endereço da Pizzaria{' '}
            <span className="text-xs text-primary font-normal">(usado no Google Maps para calcular rotas)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Rua / Logradouro</label>
              <input
                placeholder="Ex: Rua das Flores"
                value={form.addressStreet || ''}
                onChange={e => setForm({ ...form, addressStreet: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Número</label>
              <input
                placeholder="Ex: 1234"
                value={form.addressNumber || ''}
                onChange={e => setForm({ ...form, addressNumber: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CEP</label>
              <input
                placeholder="Ex: 01310-100"
                value={form.addressCep || ''}
                onChange={e => setForm({ ...form, addressCep: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bairro</label>
              <input
                placeholder="Ex: Centro"
                value={form.addressNeighborhood || ''}
                onChange={e => setForm({ ...form, addressNeighborhood: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Cidade</label>
              <input
                placeholder="Ex: São Paulo"
                value={form.addressCity || ''}
                onChange={e => setForm({ ...form, addressCity: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          {(form.addressStreet || form.addressCity) && (
            <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
              🗺️ Rota irá partir de:{' '}
              <span className="text-foreground font-medium">
                {[form.addressStreet, form.addressNumber, form.addressNeighborhood, form.addressCity].filter(Boolean).join(', ')}
              </span>
            </p>
          )}
        </div>

        {/* Tempo e Entrega */}
        <div className="bg-card rounded-xl border p-6 shadow-card space-y-4">
          <h2 className="font-semibold text-foreground text-lg">⏱️ Tempo e Entrega</h2>
          <div>
            <label className={labelClass}>Tempo Médio de Preparo (min)</label>
            <input
              type="number"
              value={form.avgPrepTime}
              onChange={e => setForm({ ...form, avgPrepTime: parseInt(e.target.value) || 0 })}
              className={inputClass}
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-foreground mb-3">💰 Taxa de Entrega por Distância</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Taxa base (R$)</label>
                <input
                  type="number" step="0.50"
                  value={form.deliveryFeeConfig.baseDeliveryFee}
                  onChange={e => setForm({
                    ...form,
                    deliveryFee: parseFloat(e.target.value) || 0,
                    deliveryFeeConfig: { ...form.deliveryFeeConfig, baseDeliveryFee: parseFloat(e.target.value) || 0 }
                  })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Km inclusos na base</label>
                <input
                  type="number" step="0.5"
                  value={form.deliveryFeeConfig.baseFeeKm}
                  onChange={e => setForm({
                    ...form,
                    deliveryFeeConfig: { ...form.deliveryFeeConfig, baseFeeKm: parseFloat(e.target.value) || 0 }
                  })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>R$ por km extra (acima de {form.deliveryFeeConfig.baseFeeKm} km)</label>
              <input
                type="number" step="0.10"
                value={form.deliveryFeeConfig.extraKmRate}
                onChange={e => setForm({
                  ...form,
                  deliveryFeeConfig: { ...form.deliveryFeeConfig, extraKmRate: parseFloat(e.target.value) || 0 }
                })}
                className={inputClass}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Exemplo: até {form.deliveryFeeConfig.baseFeeKm} km = R$ {form.deliveryFeeConfig.baseDeliveryFee.toFixed(2).replace('.', ',')} | 
              8 km = R$ {(form.deliveryFeeConfig.baseDeliveryFee + Math.max(0, 8 - form.deliveryFeeConfig.baseFeeKm) * form.deliveryFeeConfig.extraKmRate).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={e => setForm({ ...form, isOpen: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-foreground">Pizzaria aberta para pedidos</span>
          </label>
        </div>

        <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-bold">
          {isDemo ? 'Simular Salvamento' : 'Salvar Configurações'}
        </Button>
      </div>
    </AdminLayout>
  );
}
