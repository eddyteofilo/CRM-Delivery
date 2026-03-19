import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import { Trash2, Plus, UserCheck, UserX } from 'lucide-react';
import { Driver } from '@/types';

export default function AdminDrivers() {
  const { drivers, addDriver, updateDriver, deleteDriver, isDemo } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', cpf: '', phone: '', vehicleType: 'moto' as 'moto' | 'carro',
    plate: '', pix: '',
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const handleAdd = () => {
    if (!form.name || !form.cpf || !form.phone || !form.plate || !form.pix) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    const driver: Driver = {
      id: `drv-${Date.now()}`,
      ...form,
      available: true,
      createdAt: new Date().toISOString(),
    };
    addDriver(driver);
    toast.success(isDemo ? 'Simulação: Entregador "cadastrado" (não salvo no banco)' : 'Entregador cadastrado!');
    setForm({ name: '', cpf: '', phone: '', vehicleType: 'moto', plate: '', pix: '' });
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Entregadores</h1>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 gradient-primary text-primary-foreground rounded-xl">
            <Plus className="h-4 w-4" />
            Novo Entregador
          </Button>
        </div>

        {showForm && (
          <div className="bg-card rounded-xl border p-6 shadow-card space-y-3">
            <h2 className="font-semibold text-foreground">Cadastrar Entregador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Nome completo *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
              <input placeholder="CPF *" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })}
                className="px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
              <input placeholder="Telefone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
              <select value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value as 'moto' | 'carro' })}
                className="px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="moto">🏍️ Moto</option>
                <option value="carro">🚗 Carro</option>
              </select>
              <input placeholder="Placa do veículo *" value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })}
                className="px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
              <input placeholder="Chave PIX *" value={form.pix} onChange={e => setForm({ ...form, pix: e.target.value })}
                className="px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gradient-primary text-primary-foreground rounded-xl">Cadastrar</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancelar</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {drivers.map(driver => (
            <div key={driver.id} className="bg-card rounded-xl border p-4 shadow-card flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{driver.vehicleType === 'moto' ? '🏍️' : '🚗'}</span>
                  <h3 className="font-semibold text-foreground">{driver.name}</h3>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    driver.available ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {driver.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{driver.phone} • {driver.plate} • PIX: {driver.pix}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateDriver(driver.id, { available: !driver.available })}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title={driver.available ? 'Desativar' : 'Ativar'}
                >
                  {driver.available ? <UserX className="h-5 w-5 text-muted-foreground" /> : <UserCheck className="h-5 w-5 text-success" />}
                </button>
                <button 
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Excluir Entregador',
                      message: `Tem certeza que deseja excluir o entregador "${driver.name}"?`,
                      onConfirm: () => {
                        deleteDriver(driver.id);
                        toast.success(isDemo ? 'Simulação: Entregador "removido" (não salvo no banco)' : 'Entregador removido');
                      }
                    });
                  }}
                  className={`p-2 rounded-lg transition-colors ${isDemo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-destructive/10 text-destructive'}`}>
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          {drivers.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">Nenhum entregador cadastrado</p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </AdminLayout>
  );
}
