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
      const customerRes = await fetch(`${ASAAS_API_URL}/customers?email=${encodeURIComponent(email)}`, {
        headers: { access_token: ASAAS_API_KEY }
      });
      
      const customerData = await customerRes.json();
      const customer = customerData.data?.[0];

      if (!customer) return false;

      const subsRes = await fetch(`${ASAAS_API_URL}/subscriptions?customer=${customer.id}`, {
        headers: { access_token: ASAAS_API_KEY }
      });
      
      const subsData = await subsRes.json();
      const subscriptions = subsData.data as AsaasSubscription[];

      return subscriptions.some(s => s.status === 'ACTIVE');

    } catch (error) {
      console.error("Erro ao validar assinatura no Asaas:", error);
      return false;
    }
  },

  /**
   * Cria ou recupera um cliente pelo Email/CPF
   */
  async createCustomer(data: { name: string, email: string, cpfCnpj: string }) {
    if (!ASAAS_API_KEY) return { id: 'mock-cust-1' };

    try {
      // Tenta buscar primeiro para evitar duplicidade
      const existRes = await fetch(`${ASAAS_API_URL}/customers?email=${encodeURIComponent(data.email)}`, {
        headers: { access_token: ASAAS_API_KEY }
      });
      const existData = await existRes.json();
      if (existData.data?.[0]) return existData.data[0];

      // Se não existe, cria
      const res = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          access_token: ASAAS_API_KEY 
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (error) {
      console.error("Erro ao criar cliente no Asaas:", error);
      throw error;
    }
  },

  /**
   * Cria uma assinatura mensal
   */
  async createSubscription(customerId: string, value: number) {
    if (!ASAAS_API_KEY) return { invoiceUrl: '/venda/sucesso' };

    try {
      const res = await fetch(`${ASAAS_API_URL}/subscriptions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          access_token: ASAAS_API_KEY 
        },
        body: JSON.stringify({
          customer: customerId,
          billingType: 'UNDEFINED', // Permite Cartão, Pix ou Boleto
          value: value,
          cycle: 'MONTHLY',
          description: 'Assinatura Mensal - Pizza Prático (Setup Incluso)',
          nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Vencimento amanhã para liberar logo
        })
      });
      
      const subData = await res.json();
      
      // Busca a primeira cobrança da assinatura para pegar o invoiceUrl
      if (subData.id) {
        const paymentsRes = await fetch(`${ASAAS_API_URL}/payments?subscription=${subData.id}`, {
          headers: { access_token: ASAAS_API_KEY }
        });
        const paymentsData = await paymentsRes.json();
        return paymentsData.data?.[0] || subData;
      }
      
      return subData;
    } catch (error) {
      console.error("Erro ao criar assinatura no Asaas:", error);
      throw error;
    }
  }
};
