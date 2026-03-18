import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Bike } from 'lucide-react';

export default function DriverLogin() {
  const { driverLogin, config } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverLogin(phone)) {
      toast.success('Login realizado!');
      navigate('/entregador');
    } else {
      toast.error('Telefone não encontrado. Verifique com a pizzaria.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center mb-4">
            <Bike className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{config.name}</h1>
          <p className="text-muted-foreground">Painel do Entregador</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-xl border p-6 shadow-card space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Telefone cadastrado</label>
            <input
              type="tel"
              placeholder="(11) 91111-2222"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              required
            />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground h-12 rounded-xl font-bold">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
