const ASAAS_API_URL = import.meta.env.VITE_ASAAS_API_URL || 'https://api.asaas.com/v3';
const ASAAS_API_KEY = import.meta.env.VITE_ASAAS_API_KEY;

export interface AsaasSubscription {
  id: string;
  customer: string;
  value: number;
  status: 'ACTIVE' | 'EXPIRED' | 'OVERDUE' | string;
  nextDueDate: string;
}

export const AsaasService = {
  /**
   * Mock ou chamada real para verificar se o email informado possui Assinatura ativa.
   * Em um cenario ideal de SaaS, o email consultaria o \`/customers\` e \`/subscriptions\` do Asaas.
   */
  async verifyActiveSubscription(email: string): Promise<boolean> {
    if (!ASAAS_API_KEY) {
      console.warn("Chave do Asaas ausente. Simulando sucesso para fins de desenvolvimento.");
      return true;
    }

    try {
      // Passo 1: Buscar o "customer" pelo email no Asaas
      const customerRes = await fetch(`${ASAAS_API_URL}/customers?email=${encodeURIComponent(email)}`, {
        headers: { access_token: ASAAS_API_KEY }
      });
      
      const customerData = await customerRes.json();
      const customer = customerData.data?.[0];

      if (!customer) {
        // Se não existir cliente com esse email no ASAAS, consideramos que não tem plano
        return false;
      }

      // Passo 2: Buscar assinaturas do cliente
      const subsRes = await fetch(`${ASAAS_API_URL}/subscriptions?customer=${customer.id}`, {
        headers: { access_token: ASAAS_API_KEY }
      });
      
      const subsData = await subsRes.json();
      const subscriptions = subsData.data as AsaasSubscription[];

      // Passo 3: Tem assinatura "ACTIVE"?
      const activeSub = subscriptions.find(s => s.status === 'ACTIVE');
      return !!activeSub;

    } catch (error) {
      console.error("Erro ao validar assinatura no Asaas:", error);
      // Failsafe: Não deixa entrar em caso de erro da API a não ser que o app seja debug
      return false;
    }
  }
};
