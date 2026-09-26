import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Search, Trash2, RotateCcw, XCircle, Award, Calendar, Clock, BookOpen, User, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  sendRecordToGoogleSheets, 
  fetchLeaderboardFromGoogleSheets, 
  getGoogleSheetsUrl 
} from '../services/googleSheets';
import { GoogleSheetsModal } from './GoogleSheetsModal';

export interface PlayerRecord {
  id: string;
  name: string;
  playerClass: string;
  score: number; // 0-15
  prize: string;
  timeSpent: number; // in seconds
  timeFormatted: string;
  setIndex: number; // 0 to 4
  date: string;
  isVictory: boolean;
}

export const INITIAL_LEADERBOARD: PlayerRecord[] = [
  {
    id: 'rec-1',
    name: 'Nguyễn Hoàng Nam',
    playerClass: '12A1',
    score: 15,
    prize: '85.000.000 VNĐ',
    timeSpent: 215,
    timeFormatted: '03:35',
    setIndex: 0,
    date: '18/08/2026 08:30',
    isVictory: true
  },
  {
    id: 'rec-2',
    name: 'Trần Mai Anh',
    playerClass: '12A2',
    score: 15,
    prize: '85.000.000 VNĐ',
    timeSpent: 248,
    timeFormatted: '04:08',
    setIndex: 1,
    date: '18/08/2026 09:15',
    isVictory: true
  },
  {
    id: 'rec-3',
    name: 'Lê Quốc Bảo',
    playerClass: '12A1',
    score: 14,
    prize: '60.000.000 VNĐ',
    timeSpent: 195,
    timeFormatted: '03:15',
    setIndex: 2,
    date: '17/08/2026 15:40',
    isVictory: false
  },
  {
    id: 'rec-4',
    name: 'Phạm Thu Trang',
    playerClass: '12A3',
    score: 13,
    prize: '40.000.000 VNĐ',
    timeSpent: 210,
    timeFormatted: '03:30',
    setIndex: 3,
    date: '17/08/2026 16:20',
    isVictory: false
  },
  {
    id: 'rec-5',
    name: 'Võ Minh Đạt',
    playerClass: '12A2',
    score: 12,
    prize: '30.000.000 VNĐ',
    timeSpent: 180,
    timeFormatted: '03:00',
    setIndex: 4,
    date: '16/08/2026 10:10',
    isVictory: false
  },
  {
    id: 'rec-6',
    name: 'Đặng Thanh Thảo',
    playerClass: '12A4',
    score: 10,
    prize: '14.000.000 VNĐ',
    timeSpent: 165,
    timeFormatted: '02:45',
    setIndex: 0,
    date: '16/08/2026 14:05',
    isVictory: false
  }
];

const STORAGE_KEY = 'ai_la_trieu_phu_toan12_bang_vang_v2';

export function getStoredRecords(): PlayerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
      return INITIAL_LEADERBOARD;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LEADERBOARD;
  }
}

export function savePlayerRecord(record: Omit<PlayerRecord, 'id' | 'date'>) {
  try {
    const current = getStoredRecords();
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newRecord: PlayerRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      date: formattedDate
    };

    const updated = [newRecord, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Tự động đồng bộ lên Google Sheets (Apps Script Web App)
    sendRecordToGoogleSheets(newRecord).then(res => {
      if (res.success) {
        console.log('Đã tự động lưu kết quả vào Google Sheet thành công:', res.message);
      }
    }).catch(e => {
      console.warn('Lỗi gửi kết quả Google Sheet:', e);
    });

    return newRecord;
  } catch (e) {
    console.error('Error saving record', e);
  }
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightRecordId?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  highlightRecordId
}) => {
  const [records, setRecords] = useState<PlayerRecord[]>(() => getStoredRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSet, setFilterSet] = useState<number | 'all'>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isFetchingSheets, setIsFetchingSheets] = useState(false);
  const hasSheetConfigured = Boolean(getGoogleSheetsUrl());

  // Reload records whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setRecords(getStoredRecords());
      setIsConfirmingClear(false);
    }
  }, [isOpen]);

  const handleFetchFromSheets = async () => {
    setIsFetchingSheets(true);
    try {
      const remote = await fetchLeaderboardFromGoogleSheets();
      if (remote && remote.length > 0) {
        const current = getStoredRecords();
        const existingIds = new Set(current.map(r => r.id));
        const combined = [...current];
        remote.forEach(r => {
          if (!existingIds.has(r.id)) {
            combined.push(r);
            existingIds.add(r.id);
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        setRecords(combined);
      }
    } catch (e) {
      console.warn('Lỗi tải từ Google Sheet', e);
    } finally {
      setIsFetchingSheets(false);
    }
  };

  const distinctClasses = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.playerClass) set.add(r.playerClass.toUpperCase());
    });
    return Array.from(set).sort();
  }, [records]);

  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter(r => {
        const matchesQuery = 
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.playerClass.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSet = filterSet === 'all' || r.setIndex === filterSet;
        const matchesClass = filterClass === 'all' || r.playerClass.toUpperCase() === filterClass;
        return matchesQuery && matchesSet && matchesClass;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeSpent - b.timeSpent; // Faster time wins on tie
        } else {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [records, searchQuery, filterSet, filterClass, sortBy]);

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecords([]);
    setIsConfirmingClear(false);
  };

  const handleResetSample = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    setRecords(INITIAL_LEADERBOARD);
    setIsConfirmingClear(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-yellow-500/60 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.25)] w-full max-w-4xl max-h-[90vh] flex flex-col relative text-white overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] border border-yellow-300">
              <Trophy size={26} className="text-slate-950" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 uppercase tracking-wide">
                Bảng Vàng Triệu Phú Toán 12
              </h2>
              <p className="text-xs md:text-sm text-blue-300">
                Chủ đề: Giá trị lớn nhất & Giá trị nhỏ nhất của hàm số — SGK Toán 12 Kết nối tri thức
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGoogleSheetsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all border border-emerald-400/50 shadow-md active:scale-95"
              title="Cấu hình Google Sheets để tự động lưu điểm khi đưa app lên Vercel"
            >
              <FileSpreadsheet size={16} />
              <span className="hidden sm:inline">Google Sheets</span>
              {hasSheetConfigured && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              )}
            </button>
            <button
              onClick={handleFetchFromSheets}
              disabled={isFetchingSheets}
              className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all border border-slate-700 disabled:opacity-50"
              title="Đồng bộ danh sách từ Google Sheets"
            >
              <RefreshCw size={14} className={isFetchingSheets ? 'animate-spin' : ''} />
              <span className="hidden md:inline">Đồng bộ</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <XCircle size={28} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-blue-900/40 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc lớp..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-blue-500/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Set Filter */}
            <select
              value={filterSet}
              onChange={e => setFilterSet(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-800 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-blue-200 focus:outline-none focus:border-yellow-400"
            >
              <option value="all">Tất cả bộ đề</option>
              <option value="0">Bộ 1 (Định nghĩa & Tính đơn điệu)</option>
              <option value="1">Bộ 2 (Cực trị & Bảng biến thiên)</option>
              <option value="2">Bộ 3 (Đồ thị, Phân thức & Căn thức)</option>
              <option value="3">Bộ 4 (Đồ thị đạo hàm f'(x) & Tham số m)</option>
              <option value="4">Bộ 5 (Toán thực tế, Vật lí & Vận tốc)</option>
            </select>

            {/* Class Filter */}
            {distinctClasses.length > 0 && (
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="bg-slate-800 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-blue-200 focus:outline-none focus:border-yellow-400"
              >
                <option value="all">Tất cả các lớp</option>
                {distinctClasses.map(cls => (
                  <option key={cls} value={cls}>Lớp {cls}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-800 p-1 border border-blue-500/30 text-xs">
              <button
                onClick={() => setSortBy('score')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  sortBy === 'score'
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Top Điểm Cao
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  sortBy === 'recent'
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Gần Đây
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-3">
          {filteredAndSortedRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award size={48} className="mx-auto mb-3 opacity-30 text-yellow-400" />
              <p className="text-lg font-medium">Chưa có kết quả nào phù hợp.</p>
              <p className="text-xs text-slate-500 mt-1">Hãy tham gia chơi để ghi tên mình vào Bảng Vàng!</p>
            </div>
          ) : (
            filteredAndSortedRecords.map((item, index) => {
              const isHighlight = item.id === highlightRecordId;
              const isGold = index === 0;
              const isSilver = index === 1;
              const isBronze = index === 2;

              let rankBadge = (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-sm border border-slate-700">
                  {index + 1}
                </div>
              );

              let cardBorder = 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/70';
              if (isGold) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-base shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                    🥇 1
                  </div>
                );
                cardBorder = 'border-yellow-500/60 bg-gradient-to-r from-yellow-950/30 via-slate-900 to-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.15)]';
              } else if (isSilver) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black flex items-center justify-center text-base shadow-[0_0_12px_rgba(226,232,240,0.5)]">
                    🥈 2
                  </div>
                );
                cardBorder = 'border-slate-400/50 bg-gradient-to-r from-slate-800/60 via-slate-900 to-slate-900';
              } else if (isBronze) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black flex items-center justify-center text-base shadow-[0_0_12px_rgba(180,83,9,0.5)]">
                    🥉 3
                  </div>
                );
                cardBorder = 'border-amber-700/50 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900';
              }

              if (isHighlight) {
                cardBorder += ' ring-2 ring-yellow-400 animate-pulse';
              }

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border ${cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">{rankBadge}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-white tracking-wide">
                          {item.name}
                        </span>
                        <span className="bg-blue-600/30 text-blue-300 border border-blue-400/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          Lớp {item.playerClass}
                        </span>
                        {item.isVictory && (
                          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            👑 Triệu phú Toán
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen size={13} className="text-blue-400" /> Bộ đề {item.setIndex + 1}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-amber-400" /> {item.timeFormatted}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400" /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-12 md:pl-0">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-400 uppercase font-medium">Số câu đúng</div>
                      <div className="text-xl font-extrabold text-yellow-400">
                        {item.score} <span className="text-sm font-normal text-slate-400">/ 15</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase font-medium">Mức thưởng</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {item.prize}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-blue-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSample}
              className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={13} /> Nạp dữ liệu mẫu
            </button>
            {isConfirmingClear ? (
              <div className="flex items-center gap-1.5 bg-red-950/60 p-1 rounded-lg border border-red-500/50">
                <span className="text-[11px] text-red-300 pl-1">Chắc chắn xóa?</span>
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-1 rounded transition-colors"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setIsConfirmingClear(false)}
                  className="text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingClear(true)}
                className="text-xs text-red-400/80 hover:text-red-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 transition-colors"
              >
                <Trash2 size={13} /> Xóa lịch sử
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg ml-auto"
          >
            Đóng
          </button>
        </div>
      </motion.div>

      {/* Google Sheets Apps Script Setup Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        onSyncSuccess={handleFetchFromSheets}
      />
    </div>
  );
};
