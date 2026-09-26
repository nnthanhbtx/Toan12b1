import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3 py-2 text-xs font-bold text-slate-950 shadow-2xl border border-amber-300 animate-pulse">
      <WifiOff size={16} className="text-slate-950 shrink-0" />
      <span className="flex-1">
        Đang ở chế độ Offline — Toàn bộ câu hỏi & âm thanh sẵn sàng không cần mạng!
      </span>
    </div>
  );
};
