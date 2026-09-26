import { PlayerRecord } from '../components/LeaderboardModal';

export const GOOGLE_SHEETS_STORAGE_KEY = 'ai_la_trieu_phu_google_sheets_url_v1';
export const PENDING_SYNC_KEY = 'ai_la_trieu_phu_pending_sync_v1';

export const APPS_SCRIPT_SOURCE_CODE = `/**
 * ==============================================================================
 * DỰ ÁN: AI LÀ TRIỆU PHÚ TOÁN 12 - TỰ ĐỘNG LƯU KẾT QUẢ VÀO GOOGLE SHEETS
 * Tác giả: Dành cho trường THPT & Giáo viên Toán 12
 * Tương thích: Vercel, Netlify, Github Pages, Mobile Web
 * ==============================================================================
 * HƯỚNG DẪN CÀI ĐẶT NHANH (3 BƯỚC):
 * 1. Mở file Google Sheets của bạn -> Menu "Tiện ích mở rộng" -> "Apps Script".
 * 2. Xóa hết code trong file Mã.gs (Code.gs), dán toàn bộ nội dung này vào và nhấn Lưu (Ctrl+S).
 * 3. Nhấn "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment):
 *    - Chọn loại: Ứng dụng web (Web app)
 *    - Thực thi dưới dạng: Tôi (Me)
 *    - Ai có quyền truy cập: Bất kỳ ai (Anyone)  <-- BẮT BUỘC để Vercel gửi được!
 *    - Nhấn "Triển khai" và sao chép URL ứng dụng web (kết thúc bằng /exec).
 * ==============================================================================
 */

var SHEET_NAME = 'BangVang_TrieuPhu12';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Chờ tối đa 10s tránh xung đột ghi đồng thời từ nhiều học sinh
    lock.waitLock(10000);
    
    var sheet = getOrCreateSheet();
    var data = null;
    
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter;
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    if (!data) {
      return createJsonResponse({ status: 'error', message: 'Không có dữ liệu gửi lên' });
    }
    
    // Nếu là test kết nối
    if (data.action === 'ping' || data.isTest) {
      return createJsonResponse({
        status: 'success',
        message: 'Kết nối Google Apps Script thành công! Sẵn sàng đồng bộ kết quả.',
        spreadsheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }

    var recordTime = data.date || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var playerName = data.name || 'Thí sinh ẩn danh';
    var playerClass = data.playerClass || '12';
    var score = (data.score !== undefined) ? Number(data.score) : 0;
    var prize = data.prize || '0 VNĐ';
    var timeFormatted = data.timeFormatted || '00:00';
    var setNumber = (data.setIndex !== undefined) ? ('Bộ đề ' + (Number(data.setIndex) + 1)) : 'Tất cả';
    var resultStatus = (data.isVictory || score === 15) ? 'CHIẾN THẮNG 15/15 🏆' : ('Đạt ' + score + '/15 câu');
    var recordId = data.id || ('rec_' + new Date().getTime());
    var note = data.note || '';

    // Ghi hàng mới vào Google Sheet
    sheet.appendRow([
      recordTime,
      playerName,
      playerClass,
      score,
      prize,
      timeFormatted,
      setNumber,
      resultStatus,
      recordId,
      note
    ]);

    var lastRow = sheet.getLastRow();
    if (data.isVictory || score === 15) {
      sheet.getRange(lastRow, 1, 1, 10).setBackground('#ecfdf5'); // Highlight xanh ngọc cho người chiến thắng
    }

    return createJsonResponse({
      status: 'success',
      message: 'Đã lưu điểm học sinh: ' + playerName + ' (' + score + '/15 câu) vào Google Sheet thành công!',
      rowNumber: lastRow
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: 'Lỗi server Apps Script: ' + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return createJsonResponse({ status: 'success', records: [] });
    }
    
    var values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
    var records = [];
    
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      if (!row[1]) continue;
      
      var recDate = row[0];
      if (recDate instanceof Date) {
        recDate = Utilities.formatDate(recDate, "GMT+7", "dd/MM/yyyy HH:mm");
      } else {
        recDate = String(recDate);
      }
      
      records.push({
        id: String(row[8] || ('rec_' + i)),
        date: recDate,
        name: String(row[1]),
        playerClass: String(row[2]),
        score: Number(row[3]) || 0,
        prize: String(row[4]),
        timeFormatted: String(row[5]),
        setIndex: parseSetIndex(row[6]),
        isVictory: String(row[7]).indexOf('CHIẾN THẮNG') !== -1
      });
    }

    records.sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return 0;
    });

    return createJsonResponse({
      status: 'success',
      total: records.length,
      records: records
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    
    var headers = [
      'Thời gian nộp bài',
      'Họ và tên thí sinh',
      'Lớp',
      'Điểm số (/15)',
      'Tiền thưởng đạt được',
      'Thời gian làm bài',
      'Bộ đề ôn tập',
      'Kết quả xếp loại',
      'Mã bản ghi',
      'Ghi chú hệ thống'
    ];
    
    sheet.appendRow(headers);
    
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1e3a8a');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);
    
    sheet.getRange("A:A").setHorizontalAlignment('center');
    sheet.getRange("C:D").setHorizontalAlignment('center');
    sheet.getRange("E:E").setHorizontalAlignment('right');
    sheet.getRange("F:H").setHorizontalAlignment('center');
    
    for (var c = 1; c <= headers.length; c++) {
      sheet.autoResizeColumn(c);
    }
  }
  
  return sheet;
}

function parseSetIndex(str) {
  if (!str) return 0;
  var m = String(str).match(/\\d+/);
  return m ? (parseInt(m[0], 10) - 1) : 0;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function testChayThu() {
  var mock = {
    postData: {
      contents: JSON.stringify({
        isTest: true,
        name: 'Nguyễn Văn Minh',
        playerClass: '12A1',
        score: 15,
        prize: '85.000.000 VNĐ',
        timeFormatted: '03:45',
        setIndex: 0,
        isVictory: true
      })
    }
  };
  var res = doPost(mock);
  Logger.log("Kết quả kiểm tra: " + res.getContent());
}
`;

/**
 * Lấy URL Google Apps Script được cấu hình (Ưu tiên localStorage, sau đó là biến môi trường VITE)
 */
export function getGoogleSheetsUrl(): string {
  try {
    const saved = localStorage.getItem(GOOGLE_SHEETS_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
    
    // Hỗ trợ biến môi trường khi build trên Vercel
    const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEETS_API_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
      return envUrl.trim();
    }
  } catch (e) {
    // Ignore error
  }
  return '';
}

/**
 * Lưu URL Google Apps Script vào LocalStorage
 */
export function setGoogleSheetsUrl(url: string): void {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem(GOOGLE_SHEETS_STORAGE_KEY);
    } else {
      localStorage.setItem(GOOGLE_SHEETS_STORAGE_KEY, url.trim());
    }
  } catch (e) {
    console.error('Cannot save Google Sheets URL to localStorage', e);
  }
}

/**
 * Gửi bản ghi kết quả của học sinh lên Google Sheets
 * Sử dụng Content-Type text/plain để tránh CORS preflight (OPTIONS) bị Google chặn
 */
export async function sendRecordToGoogleSheets(record: PlayerRecord): Promise<{ success: boolean; message: string }> {
  const url = getGoogleSheetsUrl();
  if (!url) {
    // Không có URL thì lưu vào hàng đợi chờ nếu người dùng thiết lập sau
    queuePendingRecord(record);
    return { success: false, message: 'Chưa cấu hình URL Google Apps Script' };
  }

  try {
    // Gửi bằng text/plain;charset=utf-8 để bypass CORS preflight
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      queuePendingRecord(record);
      return { success: false, message: `Lỗi kết nối máy chủ Google (${response.status})` };
    }

    const data = await response.json();
    if (data.status === 'success') {
      // Đã gửi thành công, thử gửi luôn các bản ghi tồn đọng (nếu có)
      flushPendingRecords();
      return { success: true, message: data.message || 'Đã lưu vào Google Sheet!' };
    } else {
      queuePendingRecord(record);
      return { success: false, message: data.message || 'Không thể ghi dữ liệu' };
    }
  } catch (err: any) {
    console.warn('Lỗi gửi dữ liệu Google Sheet, đưa vào hàng đợi offline:', err);
    queuePendingRecord(record);
    return { success: false, message: 'Đã lưu trên máy (sẽ tự động đồng bộ khi có mạng)' };
  }
}

/**
 * Kiểm tra kết nối thử nghiệm tới Google Apps Script URL
 */
export async function testGoogleSheetsConnection(url: string): Promise<{ success: boolean; message: string }> {
  if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
    return { 
      success: false, 
      message: 'URL không hợp lệ. Phải bắt đầu bằng: https://script.google.com/macros/s/.../exec' 
    };
  }

  try {
    const testPayload = {
      isTest: true,
      action: 'ping',
      name: 'Kiểm tra kết nối hệ thống',
      playerClass: '12',
      date: new Date().toLocaleString('vi-VN')
    };

    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(testPayload)
    });

    if (!res.ok) {
      return { 
        success: false, 
        message: `Máy chủ Google phản hồi mã lỗi ${res.status}. Hãy kiểm tra xem bạn đã chọn "Ai có quyền truy cập: Bất kỳ ai" (Anyone) chưa.` 
      };
    }

    const json = await res.json();
    if (json.status === 'success') {
      return { 
        success: true, 
        message: json.message || 'Kết nối Google Apps Script thành công 100%!' 
      };
    } else {
      return { 
        success: false, 
        message: json.message || 'Google Sheet từ chối nhận dữ liệu.' 
      };
    }
  } catch (e: any) {
    return { 
      success: false, 
      message: 'Không thể kết nối! Hãy đảm bảo khi Triển khai (Deploy), bạn đã chọn "Ai có quyền truy cập: Bất kỳ ai (Anyone)".' 
    };
  }
}

/**
 * Lấy dữ liệu Bảng Vàng trực tiếp từ Google Sheets
 */
export async function fetchLeaderboardFromGoogleSheets(): Promise<PlayerRecord[] | null> {
  const url = getGoogleSheetsUrl();
  if (!url) return null;

  try {
    const res = await fetch(`${url}?action=get_records`, {
      method: 'GET',
      mode: 'cors'
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.records)) {
      return json.records;
    }
  } catch (err) {
    console.warn('Không thể tải Bảng Vàng từ Google Sheet:', err);
  }
  return null;
}

// --- Hỗ trợ lưu trữ offline và đồng bộ tự động khi có mạng ---
function queuePendingRecord(record: PlayerRecord) {
  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    const list: PlayerRecord[] = raw ? JSON.parse(raw) : [];
    // Tránh trùng lặp id
    if (!list.some(r => r.id === record.id)) {
      list.push(record);
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(list));
    }
  } catch (e) {
    // Ignore
  }
}

export async function flushPendingRecords() {
  const url = getGoogleSheetsUrl();
  if (!url) return;

  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    if (!raw) return;
    const list: PlayerRecord[] = JSON.parse(raw);
    if (!list.length) return;

    const remaining: PlayerRecord[] = [];
    for (const rec of list) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(rec)
        });
        const json = await res.json();
        if (json.status !== 'success') {
          remaining.push(rec);
        }
      } catch (err) {
        remaining.push(rec);
      }
    }

    if (remaining.length) {
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(PENDING_SYNC_KEY);
    }
  } catch (e) {
    // Ignore
  }
}
