import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { PizzeriaConfig } from '@/types';

export default function AdminSettings() {
  const { config, updateConfig } = useApp();
  const [form, setForm] = useState<PizzeriaConfig>(config);

  useEffect(() => { setForm(config); }, [config]);

  const handleSave = () => {
    updateConfig(form);
    toast.success('Configurações salvas!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>

        <div className="bg-card rounded-xl border p-6 shadow-card space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Nome da Pizzaria</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Logo (emoji)</label>
            <input
              value={form.logo}
              onChange={e => setForm({ ...form, logo: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Abertura</label>
              <input
                type="time"
                value={form.openingHours}
                onChange={e => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Fechamento</label>
              <input
                type="time"
                value={form.closingHours}
                onChange={e => setForm({ ...form, closingHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Endereço da Pizzaria</label>
            <input
              value={form.pizzeriaAddress}
              onChange={e => setForm({ ...form, pizzeriaAddress: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Endereço para calcular rotas de entrega"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Tempo Médio de Preparo (min)</label>
            <input
              type="number"
              value={form.avgPrepTime}
              onChange={e => setForm({ ...form, avgPrepTime: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Delivery Fee Config */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-foreground mb-3">💰 Configuração de Taxa de Entrega</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Taxa base (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  value={form.deliveryFeeConfig.baseDeliveryFee}
                  onChange={e => setForm({
                    ...form,
                    deliveryFee: parseFloat(e.target.value) || 0,
                    deliveryFeeConfig: { ...form.deliveryFeeConfig, baseDeliveryFee: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Km inclusos na base</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.deliveryFeeConfig.baseFeeKm}
                  onChange={e => setForm({
                    ...form,
                    deliveryFeeConfig: { ...form.deliveryFeeConfig, baseFeeKm: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-foreground block mb-1">R$ por km extra (acima de {form.deliveryFeeConfig.baseFeeKm} km)</label>
              <input
                type="number"
                step="0.10"
                value={form.deliveryFeeConfig.extraKmRate}
                onChange={e => setForm({
                  ...form,
                  deliveryFeeConfig: { ...form.deliveryFeeConfig, extraKmRate: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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

          <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-bold">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
