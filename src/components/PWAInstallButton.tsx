import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as installed standalone PWA, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={compact 
          ? "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-xs font-black shadow-md active:scale-95 transition-all cursor-pointer"
          : "w-full py-2.5 px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
        }
      >
        <Download size={compact ? 14 : 16} className="text-slate-950" />
        <span>{compact ? "Cài App" : "Cài Đặt App Về Máy (Chơi Offline)"}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={compact 
            ? "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold active:scale-95 transition-all cursor-pointer"
            : "w-full py-2.5 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 font-bold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          }
        >
          <Download size={compact ? 14 : 16} />
          <span>{compact ? "Cài trên iOS" : "Cài App Vào Màn Hình iPhone / iPad"}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-yellow-500/70 p-5 shadow-2xl text-left text-white relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-extrabold text-yellow-400 mb-3 flex items-center gap-2">
                <Download size={18} /> Cài Đặt Vào iPhone / iPad
              </h3>

              <div className="space-y-3 text-xs md:text-sm text-blue-100 mb-5 leading-relaxed bg-blue-950/60 p-3.5 rounded-2xl border border-blue-500/30">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    Nhấn vào nút <strong className="text-yellow-300 inline-flex items-center gap-1"><Share2 size={13} /> Chia sẻ</strong> (biểu tượng mũi tên hướng lên ở thanh công cụ Safari).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    Cuộn xuống và chọn <strong className="text-yellow-300 inline-flex items-center gap-1"><PlusSquare size={13} /> Thêm vào MH chính</strong> (Add to Home Screen).
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    Nhấn <strong className="text-emerald-400">Thêm (Add)</strong> ở góc phải trên. Giờ bạn có thể mở ứng dụng ngay trên màn hình chính và chơi mượt mà kể cả khi không có Wifi!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 py-2.5 text-xs md:text-sm font-bold text-white transition-colors cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
