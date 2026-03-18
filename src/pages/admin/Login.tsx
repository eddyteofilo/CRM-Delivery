import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await adminLogin(email, password);
    setLoading(false);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Assinatura não encontrada ou falha no login.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <span className="text-5xl">🍕</span>
          <h1 className="text-2xl font-bold text-foreground mt-4">Área Administrativa</h1>
          <p className="text-muted-foreground text-sm mt-1">Faça login para gerenciar sua pizzaria</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border p-6 shadow-card space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@pizzaria.com"
              className="w-full px-4 py-3 rounded-xl bg-background border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-background border focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground h-12 rounded-xl font-bold shadow-md">
            {loading ? 'Verificando Assinatura...' : 'Entrar no Painel'}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Não tem uma conta? <a href="/landing" className="text-primary hover:underline">Conheça nossos planos</a>
          </p>
          <p className="text-[10px] text-center text-muted-foreground">Demo: demo@pizzapratico.com / qualquer senha</p>
        </form>
      </motion.div>
    </div>
  );
}
