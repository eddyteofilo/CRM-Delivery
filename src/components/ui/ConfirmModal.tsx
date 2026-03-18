import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
}

export function ConfirmModal({
  isOpen,
  title = 'Confirmação',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'destructive'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-foreground/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border w-full max-w-sm p-6 space-y-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-foreground">
          {message}
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="flex-1 rounded-xl"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onCancel();
            }} 
            className={`flex-1 rounded-xl ${variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'gradient-primary text-primary-foreground'}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
