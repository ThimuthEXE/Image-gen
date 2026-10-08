'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 transition-all animate-scale-up ${
              isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100'
                : isError
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-100'
                : 'bg-slate-900/90 border-slate-700 text-slate-100'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <h5 className="font-semibold text-sm leading-tight">{t.title}</h5>
              {t.description && <p className="mt-1 opacity-90 leading-normal">{t.description}</p>}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
