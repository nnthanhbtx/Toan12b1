import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  HelpCircle, 
  Send, 
  CloudCheck, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  APPS_SCRIPT_SOURCE_CODE, 
  getGoogleSheetsUrl, 
  setGoogleSheetsUrl, 
  testGoogleSheetsConnection, 
  flushPendingRecords 
} from '../services/googleSheets';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess
}) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'code' | 'vercel'>('setup');

  useEffect(() => {
    if (isOpen) {
      setUrl(getGoogleSheetsUrl());
      setTestResult(null);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_SOURCE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Không thể sao chép tự động', err);
    }
  };

  const handleSaveAndTest = async () => {
    const cleanUrl = url.trim();
    setGoogleSheetsUrl(cleanUrl);
    
    if (!cleanUrl) {
      setTestResult({ success: false, message: 'Đã xóa cấu hình URL.' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    const result = await testGoogleSheetsConnection(cleanUrl);
    setTesting(false);
    setTestResult(result);

    if (result.success) {
      // Đẩy luôn bản ghi chờ
      await flushPendingRecords();
      if (onSyncSuccess) onSyncSuccess();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.25)] text-white overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  Tự động lưu điểm vào Google Sheets
                </h3>
                <p className="text-xs text-emerald-300">
                  Đồng bộ điểm thi thời gian thực khi đưa app lên Vercel
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 px-5 pt-2 bg-slate-950/40 gap-2">
            <button
              onClick={() => setActiveTab('setup')}
              className={`pb-2.5 px-3 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'setup'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={16} /> Hướng dẫn cài đặt
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`pb-2.5 px-3 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Copy size={16} /> Mã Apps Script (Mã.gs)
            </button>
            <button
              onClick={() => setActiveTab('vercel')}
              className={`pb-2.5 px-3 text-xs md:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'vercel'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudCheck size={16} /> Cấu hình Vercel
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1 text-xs md:text-sm">
            {activeTab === 'setup' && (
              <div className="space-y-4">
                {/* 1-Click Copy Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      JS
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Mã nguồn Google Apps Script chuẩn</div>
                      <div className="text-xs text-emerald-300/90">Đã tối ưu hóa chống nghẽn và tự động format bảng tính</div>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 text-xs md:text-sm"
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="text-slate-950" />
                        <span>ĐÃ SAO CHÉP MÃ!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>SAO CHÉP MÃ CODE</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" /> 4 bước kết nối chỉ trong 2 phút:
                  </h4>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </span>
                      <div className="leading-relaxed">
                        <span className="font-bold text-white">Mở Google Sheets:</span> Tạo một trang tính Google mới (hoặc có sẵn), bấm vào menu{' '}
                        <strong className="text-yellow-400">Tiện ích mở rộng (Extensions)</strong> &rarr;{' '}
                        <strong className="text-yellow-400">Apps Script</strong>.
                      </div>
                    </div>

                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </span>
                      <div className="leading-relaxed">
                        <span className="font-bold text-white">Dán mã code:</span> Xóa sạch nội dung cũ trong file{' '}
                        <code className="text-emerald-300 font-mono bg-slate-900 px-1 py-0.5 rounded">Mã.gs</code> (như trong ảnh bạn tải lên), sau đó bấm nút{' '}
                        <span className="text-emerald-300 font-semibold">"Sao chép mã code"</span> ở trên và dán (Ctrl+V) vào, rồi nhấn{' '}
                        <strong className="text-yellow-400">Lưu (Ctrl + S)</strong>.
                      </div>
                    </div>

                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </span>
                      <div className="leading-relaxed">
                        <span className="font-bold text-white">Triển khai (Deploy):</span>
                        <div className="mt-1 space-y-1 text-slate-300">
                          <div>&bull; Bấm nút <strong className="text-blue-400">Triển khai (Deploy)</strong> ở góc trên bên phải &rarr; <strong className="text-blue-400">Tùy chọn triển khai mới (New deployment)</strong>.</div>
                          <div>&bull; Bấm vào biểu tượng bánh răng bên cạnh "Chọn loại", chọn <strong className="text-yellow-300">Ứng dụng web (Web app)</strong>.</div>
                          <div>&bull; <strong>Thực thi dưới dạng (Execute as):</strong> Chọn <span className="text-white font-semibold">Tôi (Me - email của bạn)</span>.</div>
                          <div className="text-amber-300 font-bold bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/30">
                            &bull; Ai có quyền truy cập (Who has access): Chọn "BẤT KỲ AI" (Anyone)
                            <span className="block text-[11px] font-normal text-amber-200 mt-0.5">
                              (Rất quan trọng! Nếu để người dùng chỉ trong miền, app trên Vercel sẽ bị Google chặn gửi dữ liệu).
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        4
                      </span>
                      <div className="leading-relaxed">
                        <span className="font-bold text-white">Lấy URL ứng dụng web:</span> Sau khi nhấn Triển khai, Google sẽ cung cấp cho bạn một đường dẫn (kết thúc bằng <code className="text-emerald-300 font-mono">/exec</code>). Hãy dán vào ô bên dưới:
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Input Box */}
                <div className="p-4 bg-slate-950 rounded-2xl border-2 border-slate-700 space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                    URL Ứng dụng Web Google Apps Script
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono placeholder:text-slate-500"
                    />
                    <button
                      onClick={handleSaveAndTest}
                      disabled={testing}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 text-xs md:text-sm shadow-md"
                    >
                      {testing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Đang thử...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Lưu & Kiểm tra</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Test Feedback */}
                  {testResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                        testResult.success
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-950/70 border-red-500/50 text-red-200'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{testResult.success ? 'KẾT NỐI THÀNH CÔNG!' : 'CHƯA THỂ KẾT NỐI'}</div>
                        <div className="mt-0.5 opacity-90">{testResult.message}</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    Toàn bộ mã nguồn tệp <strong className="text-emerald-400">Mã.gs</strong>:
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Đã sao chép' : 'Sao chép mã'}
                  </button>
                </div>
                <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed max-h-[50vh] overflow-y-auto text-emerald-300/90 whitespace-pre no-scrollbar select-all">
                  {APPS_SCRIPT_SOURCE_CODE}
                </div>
              </div>
            )}

            {activeTab === 'vercel' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700/70 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <CloudCheck size={18} className="text-blue-400" /> Triển khai trên Vercel tự động nhận biến môi trường
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Khi đưa dự án lên <strong>Vercel</strong>, bạn có thể thiết lập biến môi trường để toàn bộ người chơi (ở bất kỳ máy tính, điện thoại nào truy cập link Vercel) đều tự động lưu điểm về trang tính của bạn mà không cần phải nhập link thủ công:
                  </p>
                  
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="text-slate-400">// Tên biến môi trường trên Vercel Dashboard:</div>
                    <div className="flex items-center justify-between text-yellow-300 font-bold bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                      <span>VITE_GOOGLE_SHEETS_API_URL</span>
                      <span className="text-[10px] text-slate-400 font-normal">Key</span>
                    </div>
                    <div className="text-slate-400 mt-2">// Giá trị (Value):</div>
                    <div className="text-emerald-400 break-all bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                      {url || 'https://script.google.com/macros/s/AKfycb.../exec'}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div>1. Vào Vercel Dashboard &rarr; Chọn Project của bạn.</div>
                    <div>2. Vào tab <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Environment Variables</strong>.</div>
                    <div>3. Nhập Key là <code className="text-yellow-300 font-mono">VITE_GOOGLE_SHEETS_API_URL</code> và Value là URL Web App của bạn.</div>
                    <div>4. Nhấn <strong>Save</strong> và Redeploy lại là xong!</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Trạng thái: {url ? <span className="text-emerald-400 font-semibold">&bull; Đã cấu hình</span> : <span className="text-amber-400">&bull; Chưa kết nối</span>}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
