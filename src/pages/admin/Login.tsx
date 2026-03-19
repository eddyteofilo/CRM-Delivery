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
          <div className="pt-4 border-t space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Acesso para Teste (Demo)</p>
              <div className="space-y-1 mb-3">
                <p className="text-[11px] text-muted-foreground">Email: <span className="text-foreground font-mono">demo@pizzapratico.com</span></p>
                <p className="text-[11px] text-muted-foreground">Senha: <span className="text-foreground font-mono">123456</span> (ou qualquer uma)</p>
              </div>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setEmail('demo@pizzapratico.com');
                  setPassword('123456');
                }}
                className="w-full h-10 rounded-lg text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
              >
                Preencher Dados Demo
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Não tem uma conta? <a href="/landing" className="text-primary hover:underline font-medium">Conheça nossos planos</a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

