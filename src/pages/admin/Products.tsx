import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Pizza } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function AdminProducts() {
  const { pizzas, addPizza, updatePizza, deletePizza, config, updateConfig } = useApp();
  const [editing, setEditing] = useState<Pizza | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const openNew = () => {
    setIsNew(true);
    setEditing({
      id: `prod-${Date.now()}`,
      name: '',
      description: '',
      image: '',
      category: config.categories && config.categories.length > 0 ? config.categories[0] : 'Tradicionais',
      sizes: [{ name: 'Único', price: 0 }],
      flavors: [],
      additionals: [],
      available: true,
      allowHalfHalf: false,
    });
  };

  const handleSave = () => {
    if (!editing || !editing.name.trim()) {
      toast.error('Informe o nome da pizza');
      return;
    }
    if (isNew) {
      addPizza(editing);
      toast.success('Produto adicionado!');
    } else {
      updatePizza(editing.id, editing);
      toast.success('Produto atualizado!');
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Produto',
      message: `Tem certeza que deseja excluir o produto "${name}"? Essa ação não pode ser desfeita.`,
      onConfirm: () => {
        deletePizza(id);
        toast.success('Produto removido!');
      }
    });
  };

  const addSize = () => {
    if (!editing) return;
    setEditing({ ...editing, sizes: [...editing.sizes, { name: '', price: 0 }] });
  };

  const updateSize = (idx: number, field: 'name' | 'price', value: string | number) => {
    if (!editing) return;
    const sizes = [...editing.sizes];
    sizes[idx] = { ...sizes[idx], [field]: value };
    setEditing({ ...editing, sizes });
  };

  const removeSize = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, sizes: editing.sizes.filter((_, i) => i !== idx) });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
          <Button onClick={openNew} className="gradient-primary text-primary-foreground rounded-xl gap-2">
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{isNew ? 'Novo Produto' : 'Editar Produto'}</h2>
                <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-2 hover:bg-muted rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  placeholder="Nome do produto"
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  placeholder="Descrição"
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <div className="flex gap-2">
                  <select
                    value={editing.category}
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl bg-background border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {config.categories?.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setNewCategoryName('');
                        setIsNewCategoryModalOpen(true);
                      }}
                      className="rounded-xl px-3"
                      title="Adicionar nova categoria"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {(config.categories && config.categories.length > 1) && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Excluir Categoria',
                            message: `Tem certeza que deseja excluir a categoria "${editing.category}"?`,
                            onConfirm: () => {
                              const updatedCategories = config.categories!.filter(c => c !== editing.category);
                              updateConfig({ categories: updatedCategories });
                              setEditing({ ...editing, category: updatedCategories[0] || 'Tradicionais' });
                              toast.success('Categoria excluída!');
                            }
                          });
                        }}
                        className="rounded-xl px-3 text-destructive hover:bg-destructive/10 border-destructive/20"
                        title="Excluir categoria selecionada"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Tamanhos</p>
                    <button onClick={addSize} className="text-xs text-primary hover:underline">+ Adicionar</button>
                  </div>
                  {editing.sizes.map((size, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        placeholder="Tamanho"
                        value={size.name}
                        onChange={e => updateSize(idx, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Preço"
                        value={size.price}
                        onChange={e => updateSize(idx, 'price', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button onClick={() => removeSize(idx)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.available}
                      onChange={e => setEditing({ ...editing, available: e.target.checked })}
                      className="rounded accent-primary w-4 h-4"
                    />
                    Disponível no cardápio
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.allowHalfHalf || false}
                      onChange={e => setEditing({ ...editing, allowHalfHalf: e.target.checked })}
                      className="rounded accent-primary w-4 h-4"
                    />
                    Permitir Meio a Meio (2 sabores)
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => { setEditing(null); setIsNew(false); }} variant="outline" className="flex-1 rounded-xl">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="flex-1 gradient-primary text-primary-foreground rounded-xl">
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-3">
          {pizzas.map(pizza => (
            <div key={pizza.id} className="bg-card rounded-xl border p-4 shadow-card flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{pizza.name}</h3>
                  {!pizza.available && <span className="text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">Indisponível</span>}
                </div>
                <p className="text-sm text-muted-foreground">{pizza.category}</p>
                <p className="text-sm text-primary font-medium mt-1">
                  {pizza.sizes.map(s => `${s.name}: R$ ${s.price.toFixed(2).replace('.', ',')}`).join(' • ')}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(pizza); setIsNew(false); }} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(pizza.id, pizza.name)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Category Modal */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] bg-foreground/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border w-full max-w-sm p-6 space-y-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Nova Categoria</h2>
              <button 
                onClick={() => setIsNewCategoryModalOpen(false)} 
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <input
                autoFocus
                placeholder="Nome da categoria (ex: Bebidas)"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    e.preventDefault();
                    const updatedCategories = [...(config.categories || []), newCategoryName.trim()];
                    updateConfig({ categories: updatedCategories });
                    if (editing) {
                      setEditing({ ...editing, category: newCategoryName.trim() });
                    }
                    setIsNewCategoryModalOpen(false);
                    setNewCategoryName('');
                    toast.success('Categoria adicionada!');
                  }
                }}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => setIsNewCategoryModalOpen(false)} 
                variant="outline" 
                className="flex-1 rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (newCategoryName.trim()) {
                    const updatedCategories = [...(config.categories || []), newCategoryName.trim()];
                    updateConfig({ categories: updatedCategories });
                    if (editing) {
                      setEditing({ ...editing, category: newCategoryName.trim() });
                    }
                    setIsNewCategoryModalOpen(false);
                    setNewCategoryName('');
                    toast.success('Categoria adicionada!');
                  }
                }} 
                disabled={!newCategoryName.trim()}
                className="flex-1 gradient-primary text-primary-foreground rounded-xl"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

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
