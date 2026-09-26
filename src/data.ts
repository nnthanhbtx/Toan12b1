import { MathDiagram } from './components/MathGraphic';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  solution: string;
  level?: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  diagram?: MathDiagram;
  tikz?: string;
}

// Utility to dynamically shuffle question options while maintaining correct answer index
export function shuffleQuestionOptions(q: Question): Question {
  const originalCorrectAnswer = q.options[q.correctAnswerIndex];
  const indexedOptions = q.options.map((opt, idx) => ({ opt, originalIndex: idx }));
  
  // Fisher-Yates shuffle
  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
  }
  
  const newOptions = indexedOptions.map(item => item.opt);
  const newCorrectIndex = newOptions.indexOf(originalCorrectAnswer);
  
  return {
    ...q,
    options: newOptions,
    correctAnswerIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
  };
}

export const questionSets: Question[][] = [
  // =========================================================================
  // BỘ ĐỀ 1: CĂN BẢN & ĐỊNH NGHĨA TÍNH ĐƠN ĐIỆU CỦA HÀM SỐ
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Kí hiệu $K$ là một khoảng, một đoạn hoặc một nửa khoảng. Hàm số $y = f(x)$ được gọi là đồng biến trên $K$ nếu thỏa mãn điều kiện nào sau đây?",
      options: [
        "Với mọi $x_1, x_2 \\in K$, $x_1 < x_2 \\Rightarrow f(x_1) > f(x_2)$.",
        "Với mọi $x_1, x_2 \\in K$, $x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.",
        "Với mọi $x_1, x_2 \\in K$, $x_1 < x_2 \\Rightarrow f(x_1) = f(x_2)$.",
        "Với mọi $x_1, x_2 \\in K$, $f(x_1) \\le f(x_2)$."
      ],
      correctAnswerIndex: 1,
      solution: "Theo SGK Toán 12 (Kết nối tri thức, trang 6): Hàm số $y = f(x)$ được gọi là đồng biến trên $K$ nếu với mọi $x_1, x_2 \\in K$, $x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $K$. Nếu $f'(x) > 0$ với mọi $x \\in K$ thì khẳng định nào sau đây là đúng?",
      options: [
        "Hàm số $f(x)$ nghịch biến trên khoảng $K$.",
        "Hàm số $f(x)$ không đổi trên khoảng $K$.",
        "Hàm số $f(x)$ đồng biến trên khoảng $K$.",
        "Hàm số $f(x)$ đạt cực trị trên khoảng $K$."
      ],
      correctAnswerIndex: 2,
      solution: "Định lí về dấu đạo hàm (SGK Toán 12 KNTT trang 7): Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $K$. Nếu $f'(x) > 0$ với mọi $x \\in K$ thì hàm số $f(x)$ đồng biến trên khoảng $K$."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $K$. Khẳng định nào sau đây là đúng về định lí mở rộng dấu đạo hàm?",
      options: [
        "Nếu $f'(x) \\ge 0$ với mọi $x \\in K$ và $f'(x) = 0$ chỉ tại một số hữu hạn điểm thì hàm số đồng biến trên $K$.",
        "Nếu $f'(x) \\ge 0$ với mọi $x \\in K$ thì hàm số chắc chắn là hàm hằng trên $K$.",
        "Nếu $f'(x) = 0$ tại vô số điểm thì hàm số luôn luôn đồng biến trên $K$.",
        "Nếu hàm số đồng biến trên $K$ thì bắt buộc $f'(x) > 0$ tại mọi điểm thuộc $K$."
      ],
      correctAnswerIndex: 0,
      solution: "Chú ý mở rộng (SGK Toán 12 KNTT trang 7): Nếu $f'(x) \\ge 0$ (hoặc $f'(x) \\le 0$) với mọi $x \\in K$ và $f'(x) = 0$ chỉ tại một số hữu hạn điểm của $K$ thì hàm số $f(x)$ đồng biến (hoặc nghịch biến) trên khoảng $K$."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Tìm khoảng đồng biến của hàm số $y = -x^2 + 2x + 3$ (Luyện tập 2 SGK trang 7).",
      options: [
        "$(1; +\\infty)$",
        "$(-\\infty; 1)$",
        "$(-\\infty; 2)$",
        "$(0; 2)$"
      ],
      correctAnswerIndex: 1,
      solution: "Ta có tập xác định $D = \\mathbb{R}$. Đạo hàm $y' = -2x + 2$. Ta có $y' > 0 \\Leftrightarrow -2x + 2 > 0 \\Leftrightarrow x < 1$. Do đó hàm số đồng biến trên khoảng $(-\\infty; 1)$ và nghịch biến trên khoảng $(1; +\\infty)$."
    },
    {
      id: 5,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có bảng biến thiên dưới đây. Hàm số nghịch biến trên khoảng nào?",
      options: [
        "$(-\\infty; -1)$",
        "$(2; +\\infty)$",
        "$(-1; 2)$",
        "$(-\\infty; 2)$"
      ],
      correctAnswerIndex: 2,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = f(x)',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '-1', yPrimeAt: '0', val: '4', pos: 'top' },
          { x: '2', yPrimeAt: '0', val: '-2', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: "Dấu của y' mang dấu (-) trên khoảng (-1; 2)"
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.2]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $-1$, $2$, $+\\infty$}
\\tkzTabLine{,+,0,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $4$, -/ $-2$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Dựa vào bảng biến thiên, trên khoảng $(-1; 2)$ ta thấy $y' < 0$ và mũi tên đi xuống, do đó hàm số nghịch biến trên khoảng $(-1; 2)$."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Hàm số $y = x^3 - 3x^2 + 2$ (Luyện tập 1 SGK trang 6) nghịch biến trên khoảng nào sau đây?",
      options: [
        "$(0; 2)$",
        "$(-\\infty; 0)$",
        "$(2; +\\infty)$",
        "$(-\\infty; 2)$"
      ],
      correctAnswerIndex: 0,
      solution: "Tập xác định $D = \\mathbb{R}$. Đạo hàm $y' = 3x^2 - 6x = 3x(x - 2)$. Ta có $y' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Bảng xét dấu: $y' < 0 \\Leftrightarrow x \\in (0; 2)$. Do đó hàm số nghịch biến trên khoảng $(0; 2)$."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Xét chiều biến thiên của hàm số $y = \\frac{x - 2}{x + 1}$ (Ví dụ 4 SGK trang 8). Khẳng định nào sau đây là chuẩn xác nhất?",
      options: [
        "Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{-1\\}$.",
        "Hàm số đồng biến trên $(-\\infty; -1) \\cup (-1; +\\infty)$.",
        "Hàm số đồng biến trên các khoảng $(-\\infty; -1)$ và $(-1; +\\infty)$.",
        "Hàm số nghịch biến trên các khoảng $(-\\infty; -1)$ và $(-1; +\\infty)$."
      ],
      correctAnswerIndex: 2,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = \\frac{x - 2}{x + 1}',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '1', pos: 'bottom' },
          { 
            x: '-1', 
            yPrimeAt: '||', 
            isAsymptote: true, 
            leftVal: '+\\infty', 
            leftPos: 'top', 
            rightVal: '-\\infty', 
            rightPos: 'bottom' 
          },
          { x: '+\\infty', val: '1', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Hàm số đồng biến trên từng khoảng (-\\infty; -1) và (-1; +\\infty)'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.5]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $-1$, $+\\infty$}
\\tkzTabLine{,+,d,+,}
\\tkzTabVar{-/ $1$, +D-/ $+\\infty$ / $-\\infty$, +/ $1$}
\\end{tikzpicture}`,
      solution: "Tập xác định $D = \\mathbb{R} \\setminus \\{-1\\}$. Đạo hàm $y' = \\frac{1(1) - (-2)(1)}{(x+1)^2} = \\frac{3}{(x+1)^2} > 0, \\forall x \\ne -1$. Theo quy tắc kết luận tính đơn điệu của SGK Toán 12, ta phải ghi rõ: hàm số đồng biến trên các khoảng $(-\\infty; -1)$ và $(-1; +\\infty)$ (tuyệt đối không dùng kí hiệu $\\cup$ hay dấu trừ tập hợp)."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Hàm số $y = \\frac{2x - 1}{x + 2}$ (Bài 1.3a SGK trang 13) đồng biến trên những khoảng nào?",
      options: [
        "$(-\\infty; 2)$ và $(2; +\\infty)$",
        "$(-\\infty; -2)$ và $(-2; +\\infty)$",
        "$(-\\infty; +\\infty)$",
        "$(-2; 2)$"
      ],
      correctAnswerIndex: 1,
      solution: "TXĐ: $D = \\mathbb{R} \\setminus \\{-2\\}$. Đạo hàm: $y' = \\frac{2(2) - (-1)(1)}{(x+2)^2} = \\frac{5}{(x+2)^2} > 0, \\forall x \\ne -2$. Do đó hàm số đồng biến trên từng khoảng $(-\\infty; -2)$ và $(-2; +\\infty)$."
    },
    {
      id: 9,
      level: 'Thông hiểu',
      question: "Tìm các khoảng nghịch biến của hàm số $y = \\frac{1}{3}x^3 - 2x^2 + 3x + 1$ (Bài 1.2a SGK trang 13).",
      options: [
        "$(1; 3)$",
        "$(-\\infty; 1)$ và $(3; +\\infty)$",
        "$(0; 3)$",
        "$(-3; -1)$"
      ],
      correctAnswerIndex: 0,
      solution: "TXĐ: $D = \\mathbb{R}$. Đạo hàm: $y' = x^2 - 4x + 3 = (x - 1)(x - 3)$. Cho $y' = 0 \\Leftrightarrow x = 1$ hoặc $x = 3$. Vì $a = 1 > 0$ nên trong khoảng hai nghiệm $(1; 3)$, $y' < 0$. Do đó hàm số nghịch biến trên khoảng $(1; 3)$."
    },
    {
      id: 10,
      level: 'Thông hiểu',
      question: "Hàm số phân thức $y = \\frac{x^2 - 2x + 5}{x - 1}$ (Ví dụ 3 SGK trang 8) đồng biến trên những khoảng nào?",
      options: [
        "$(-1; 1)$ và $(1; 3)$",
        "$(-\\infty; -1)$ và $(3; +\\infty)$",
        "$(-\\infty; 1)$ và $(1; +\\infty)$",
        "$(-1; 3)$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = \\frac{x^2 - 2x + 5}{x - 1}',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '-1', yPrimeAt: '0', val: '-4', pos: 'top' },
          { 
            x: '1', 
            yPrimeAt: '||', 
            isAsymptote: true, 
            leftVal: '-\\infty', 
            leftPos: 'bottom', 
            rightVal: '+\\infty', 
            rightPos: 'top' 
          },
          { x: '3', yPrimeAt: '0', val: '4', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Đồng biến trên (-\\infty; -1) và (3; +\\infty); nghịch biến trên (-1; 1) và (1; 3)'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=1.8]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $-1$, $1$, $3$, $+\\infty$}
\\tkzTabLine{,+,0,-,d,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $-4$, -D+/ $-\\infty$ / $+\\infty$, -/ $4$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "TXĐ: $D = \\mathbb{R} \\setminus \\{1\\}$. Đạo hàm $y' = \\frac{(2x-2)(x-1) - (x^2-2x+5)}{(x-1)^2} = \\frac{x^2 - 2x - 3}{(x-1)^2}$. Cho $y' = 0 \\Leftrightarrow x = -1$ hoặc $x = 3$. Lập bảng biến thiên ta thấy $y' > 0$ trên $(-\\infty; -1)$ và $(3; +\\infty)$. Vậy hàm số đồng biến trên các khoảng $(-\\infty; -1)$ và $(3; +\\infty)$."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Hàm số căn thức $y = \\sqrt{4 - x^2}$ (Bài 1.4a SGK trang 13) đồng biến trên khoảng nào sau đây?",
      options: [
        "$(0; 2)$",
        "$(-2; 0)$",
        "$(-2; 2)$",
        "$(-\\infty; 0)$"
      ],
      correctAnswerIndex: 1,
      solution: "Tập xác định: $D = [-2; 2]$. Với mọi $x \\in (-2; 2)$, đạo hàm $y' = \\frac{-2x}{2\\sqrt{4 - x^2}} = \\frac{-x}{\\sqrt{4 - x^2}}$. Ta có $y' = 0 \\Leftrightarrow x = 0$. Vì mẫu số luôn dương trên $(-2; 2)$ nên dấu của $y'$ là dấu của $-x$: khi $x \\in (-2; 0)$ thì $y' > 0$; khi $x \\in (0; 2)$ thì $y' < 0$. Vậy hàm số đồng biến trên khoảng $(-2; 0)$."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Hàm số nào sau đây nghịch biến trên toàn bộ tập số thực $\\mathbb{R}$? (Bài tập 1.31 SGK trang 42)",
      options: [
        "$y = -x^3 + x + 1$",
        "$y = \\frac{x - 1}{x - 2}$",
        "$y = -x^3 + 3x^2 - 9x$",
        "$y = 2x^2 + 3x + 2$"
      ],
      correctAnswerIndex: 2,
      solution: "Xét $y = -x^3 + 3x^2 - 9x$: Tập xác định $\\mathbb{R}$. Đạo hàm $y' = -3x^2 + 6x - 9 = -3(x^2 - 2x + 3) = -3[(x-1)^2 + 2] < 0$ với mọi $x \\in \\mathbb{R}$. Vì $y' < 0, \\forall x \\in \\mathbb{R}$ nên hàm số nghịch biến trên $\\mathbb{R}$."
    },
    {
      id: 13,
      level: 'Vận dụng',
      question: "Một chất điểm chuyển động trên một trục số nằm ngang với phương trình vị trí $s(t) = t^3 - 9t^2 + 15t$ với $t \\ge 0$ ($s$ tính bằng mét, $t$ tính bằng giây) (Vận dụng 1 SGK trang 9). Chất điểm chuyển động sang phải (theo chiều dương) trong những khoảng thời gian nào?",
      options: [
        "$1 < t < 5$",
        "$0 \\le t < 1$ và $t > 5$",
        "$t > 3$",
        "$0 \\le t < 3$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'graph',
        title: 'Chuyển động của chất điểm trên trục số s(t)',
        graphKind: 'motion_line',
        notes: 'Chất điểm chuyển động sang phải khi v(t) = s\'(t) > 0'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.9]\n\\draw[->, thick] (0,0) -- (7.5,0) node[below] {$s$};\n\\filldraw[yellow] (1.5,0) circle (2.5pt) node[below=3pt] {$O$};\n\\filldraw[cyan] (4.5,0) circle (2.5pt) node[below=3pt] {$s(t)$};\n\\draw[->, very thick, teal] (4.5,0.4) -- (6,0.4) node[midway, above] {$v(t) = s'(t) > 0$};\n\\node[above] at (3.75,-1) {\\textit{Chất điểm chuyển động sang phải khi $v(t) > 0$}};
\\end{tikzpicture}`,
      solution: "Vận tốc tức thời của chất điểm là $v(t) = s'(t) = 3t^2 - 18t + 15 = 3(t - 1)(t - 5)$. Chất điểm chuyển động sang phải khi $v(t) > 0 \\Leftrightarrow (t - 1)(t - 5) > 0$. Kết hợp điều kiện $t \\ge 0$, ta được $0 \\le t < 1$ hoặc $t > 5$."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m + 2)x - 5$ đồng biến trên toàn bộ $\\mathbb{R}$.",
      options: [
        "$-1 \\le m \\le 2$",
        "$m < -1$ hoặc $m > 2$",
        "$-2 \\le m \\le 1$",
        "$m \\ge 2$"
      ],
      correctAnswerIndex: 0,
      solution: "Đạo hàm: $y' = x^2 - 2mx + (m + 2)$. Hàm số đồng biến trên $\\mathbb{R} \\Leftrightarrow y' \\ge 0, \\forall x \\in \\mathbb{R}$ (và $y'=0$ chỉ tại hữu hạn điểm). Vì hệ số $a = 1 > 0$ nên điều này tương đương $\\Delta' = (-m)^2 - 1(m + 2) \\le 0 \\Leftrightarrow m^2 - m - 2 \\le 0 \\Leftrightarrow -1 \\le m \\le 2$."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Giả sử số dân của một thị trấn sau $t$ năm kể từ năm 2000 được mô tả bởi hàm số $N(t) = \\frac{25t + 10}{t + 5}$ ($t \\ge 0$, đơn vị: nghìn người) (Bài tập 1.5 SGK trang 13). Nhận định nào sau đây là chính xác về sự thay đổi dân số?",
      options: [
        "Số dân luôn giảm dần theo thời gian vì mẫu số $t + 5$ tăng nhanh hơn.",
        "Số dân đạt cực đại sau 5 năm rồi bắt đầu suy giảm dần.",
        "Số dân luôn tăng theo thời gian nhưng sẽ không vượt quá ngưỡng 25 nghìn người.",
        "Số dân luôn tăng và sẽ vượt quá 50 nghìn người sau 10 năm."
      ],
      correctAnswerIndex: 2,
      solution: "Đạo hàm: $N'(t) = \\frac{25(t+5) - (25t+10)}{(t+5)^2} = \\frac{115}{(t+5)^2} > 0, \\forall t \\ge 0$. Do $N'(t) > 0$ nên số dân $N(t)$ luôn luôn tăng theo thời gian. Mặt khác, $\\lim_{t \\to +\\infty} N(t) = \\lim_{t \\to +\\infty} \\frac{25t+10}{t+5} = 25$ nghìn người, do đó số dân thị trấn không bao giờ vượt quá ngưỡng 25 nghìn người."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 2: CỰC TRỊ CỦA HÀM SỐ & BẢNG BIẾN THIÊN
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ xác định và liên tục trên khoảng $(a; b)$ chứa điểm $x_0$. Điểm $x_0$ được gọi là một điểm cực đại của hàm số nếu:",
      options: [
        "Tồn tại số $h > 0$ sao cho $f(x) < f(x_0)$ với mọi $x \\in (x_0 - h; x_0 + h) \\subset (a; b)$ và $x \\ne x_0$.",
        "Tồn tại số $h > 0$ sao cho $f(x) > f(x_0)$ với mọi $x \\in (x_0 - h; x_0 + h) \\subset (a; b)$ và $x \\ne x_0$.",
        "$f(x) \\le f(x_0)$ với mọi $x \\in \\mathbb{R}$.",
        "$f'(x_0) = 0$ và $f''(x_0) = 0$."
      ],
      correctAnswerIndex: 0,
      solution: "Theo định nghĩa cực trị hàm số (SGK Toán 12 KNTT trang 9): Điểm $x_0$ được gọi là một điểm cực đại của hàm số nếu tồn tại $h > 0$ sao cho $f(x) < f(x_0)$ với mọi $x \\in (x_0 - h; x_0 + h) \\setminus \\{x_0\\}$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Nếu hàm số $y = f(x)$ đạt cực đại tại điểm $x_0$ thì giá trị $f(x_0)$ được gọi là gì?",
      options: [
        "Điểm cực đại của đồ thị hàm số.",
        "Điểm cực đại của hàm số.",
        "Giá trị cực đại (hoặc cực đại) của hàm số.",
        "Điểm uốn của đồ thị hàm số."
      ],
      correctAnswerIndex: 2,
      solution: "Theo SGK trang 9: $x_0$ gọi là điểm cực đại của hàm số; $f(x_0)$ gọi là giá trị cực đại (hay cực đại) của hàm số; còn điểm $M_0(x_0; f(x_0))$ gọi là điểm cực đại của đồ thị hàm số."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Giả sử hàm số $y = f(x)$ liên tục trên khoảng $(a; b)$ chứa điểm $x_0$ và có đạo hàm trên các khoảng $(a; x_0)$ và $(x_0; b)$. Nếu $f'(x) > 0$ trên $(a; x_0)$ và $f'(x) < 0$ trên $(x_0; b)$ thì:",
      options: [
        "$x_0$ là một điểm cực tiểu của hàm số $f(x)$.",
        "$x_0$ là một điểm cực đại của hàm số $f(x)$.",
        "Hàm số không có cực trị tại $x_0$.",
        "Giá trị $f(x_0)$ là giá trị nhỏ nhất của hàm số trên $\\mathbb{R}$."
      ],
      correctAnswerIndex: 1,
      solution: "Định lí quy tắc tìm cực trị (SGK trang 10): Nếu qua $x_0$ đạo hàm $f'(x)$ đổi dấu từ dương sang âm (khi $x$ tăng dần) thì $x_0$ là một điểm cực đại của hàm số $f(x)$."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có bảng biến thiên dưới đây (Ví dụ 6 SGK trang 11). Giá trị cực đại của hàm số bằng bao nhiêu?",
      options: [
        "$1$",
        "$34$",
        "$3$",
        "$30$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = x^3 - 6x^2 + 9x + 30',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '1', yPrimeAt: '0', val: '34', pos: 'top' },
          { x: '3', yPrimeAt: '0', val: '30', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Tại x = 1, hàm số đạt cực đại với y_{\\text{CD}} = 34'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.2]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $1$, $3$, $+\\infty$}
\\tkzTabLine{,+,0,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $34$, -/ $30$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Dựa vào bảng biến thiên, hàm số đạt cực đại tại $x = 1$ và giá trị cực đại là $y_{\\text{CD}} = f(1) = 34$."
    },
    {
      id: 5,
      level: 'Nhận biết',
      question: "Cho hàm số $y = x^3$ có đạo hàm $y' = 3x^2 \\ge 0, \\forall x \\in \\mathbb{R}$ và $y'(0) = 0$ (Chú ý SGK trang 11). Khẳng định nào sau đây là đúng?",
      options: [
        "$x = 0$ là điểm cực đại của hàm số.",
        "$x = 0$ là điểm cực tiểu của hàm số.",
        "$x = 0$ không phải là điểm cực trị của hàm số vì đạo hàm không đổi dấu khi qua $x = 0$.",
        "Hàm số đạt giá trị nhỏ nhất bằng 0 tại $x = 0$."
      ],
      correctAnswerIndex: 2,
      solution: "Theo Chú ý SGK trang 11: Nếu $f'(x_0) = 0$ nhưng $f'(x)$ không đổi dấu khi $x$ qua $x_0$ thì $x_0$ không phải là điểm cực trị của hàm số. Với $y = x^3$, $y' = 3x^2 \\ge 0$ luôn cùng dấu dương ở cả hai phía của 0 nên $x = 0$ không là cực trị."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Tìm điểm cực đại của hàm số $y = x^3 - 3x^2 + 2$.",
      options: [
        "$x = 2$",
        "$x = 0$",
        "$x = -2$",
        "$x = 1$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = x^3 - 3x^2 + 2',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '0', yPrimeAt: '0', val: '2', pos: 'top' },
          { x: '2', yPrimeAt: '0', val: '-2', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Hàm số đạt cực đại tại x = 0 với y_{\\text{CD}} = 2 và cực tiểu tại x = 2 với y_{\\text{CT}} = -2'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.2]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $0$, $2$, $+\\infty$}
\\tkzTabLine{,+,0,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $2$, -/ $-2$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Tập xác định $\\mathbb{R}$. Đạo hàm $y' = 3x^2 - 6x = 3x(x - 2) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$. Qua $x = 0$, $y'$ đổi dấu từ dương sang âm, do đó hàm số đạt cực đại tại $x = 0$ (với $y_{\\text{CD}} = 2$)."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Toạ độ các điểm cực tiểu của đồ thị hàm số $y = x^4 - 4x^2 + 2$ (Bài tập 1.7b SGK trang 14) là:",
      options: [
        "$(0; 2)$",
        "$(-\\sqrt{2}; -2)$ và $(\\sqrt{2}; -2)$",
        "$(-\\sqrt{2}; 2)$ và $(\\sqrt{2}; 2)$",
        "$(2; -2)$ và $(-2; -2)$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = x^4 - 4x^2 + 2',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '+\\infty', pos: 'top' },
          { x: '-\\sqrt{2}', yPrimeAt: '0', val: '-2', pos: 'bottom' },
          { x: '0', yPrimeAt: '0', val: '2', pos: 'top' },
          { x: '\\sqrt{2}', yPrimeAt: '0', val: '-2', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Hai điểm cực tiểu là (-\\sqrt{2}; -2) và (\\sqrt{2}; -2)'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.4,espcl=1.8]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $-\\sqrt{2}$, $0$, $\\sqrt{2}$, $+\\infty$}
\\tkzTabLine{,-,0,+,0,-,0,+,}
\\tkzTabVar{+/ $+\\infty$, -/ $-2$, +/ $2$, -/ $-2$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Đạo hàm $y' = 4x^3 - 8x = 4x(x^2 - 2) = 0 \\Leftrightarrow x = 0$ hoặc $x = \\pm\\sqrt{2}$. Lập bảng biến thiên, hàm số đạt cực tiểu tại $x = \\pm\\sqrt{2}$. Giá trị cực tiểu $y(\\pm\\sqrt{2}) = (\\sqrt{2})^4 - 4(\\sqrt{2})^2 + 2 = 4 - 8 + 2 = -2$. Vậy toạ độ các điểm cực tiểu của đồ thị là $(-\\sqrt{2}; -2)$ và $(\\sqrt{2}; -2)$."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Hàm số nào dưới đây không có điểm cực trị? (Bài tập 1.32 SGK trang 42)",
      options: [
        "$y = |x|$",
        "$y = x^4$",
        "$y = -x^3 + x$",
        "$y = \\frac{2x - 1}{x + 1}$"
      ],
      correctAnswerIndex: 3,
      solution: "Hàm phân thức bậc nhất trên bậc nhất $y = \\frac{2x - 1}{x + 1}$ có đạo hàm $y' = \\frac{3}{(x+1)^2} > 0, \\forall x \\ne -1$. Do đạo hàm không triệt tiêu và không đổi dấu trên từng khoảng xác định nên hàm số không có cực trị. (Trong khi đó $y = |x|$ đạt cực tiểu tại $x = 0$, $y = x^4$ đạt cực tiểu tại $x = 0$, $y = -x^3 + x$ có 2 cực trị)."
    },
    {
      id: 9,
      level: 'Thông hiểu',
      question: "Cho hàm số phân thức $y = \\frac{x^2 - 2x + 9}{x - 2}$ (Ví dụ 7 SGK trang 12). Khẳng định nào sau đây là đúng về cực trị của hàm số?",
      options: [
        "Giá trị cực đại $y_{\\text{CD}} = -4$ và giá trị cực tiểu $y_{\\text{CT}} = 8$.",
        "Giá trị cực đại $y_{\\text{CD}} = 8$ và giá trị cực tiểu $y_{\\text{CT}} = -4$.",
        "Hàm số không có điểm cực trị.",
        "Hàm số chỉ có 1 điểm cực tiểu tại $x = 2$."
      ],
      correctAnswerIndex: 0,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = \\frac{x^2 - 2x + 9}{x - 2}',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '-1', yPrimeAt: '0', val: '-4', pos: 'top' },
          { 
            x: '2', 
            yPrimeAt: '||', 
            isAsymptote: true, 
            leftVal: '-\\infty', 
            leftPos: 'bottom', 
            rightVal: '+\\infty', 
            rightPos: 'top' 
          },
          { x: '5', yPrimeAt: '0', val: '8', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Giá trị cực đại y_{\\text{CD}} = -4 tại x = -1; giá trị cực tiểu y_{\\text{CT}} = 8 tại x = 5'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=1.8]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $-1$, $2$, $5$, $+\\infty$}
\\tkzTabLine{,+,0,-,d,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $-4$, -D+/ $-\\infty$ / $+\\infty$, -/ $8$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Tập xác định $D = \\mathbb{R} \\setminus \\{2\\}$. Đạo hàm $y' = \\frac{(2x-2)(x-2) - (x^2-2x+9)}{(x-2)^2} = \\frac{x^2 - 4x - 5}{(x-2)^2} = 0 \\Leftrightarrow x = -1$ hoặc $x = 5$. Lập bảng biến thiên: hàm số đạt cực đại tại $x = -1$ với $y_{\\text{CD}} = -4$; đạt cực tiểu tại $x = 5$ với $y_{\\text{CT}} = 8$. Chú ý hiện tượng đặc biệt của hàm phân thức: giá trị cực đại có thể nhỏ hơn giá trị cực tiểu!"
    },
    {
      id: 10,
      level: 'Thông hiểu',
      question: "Cho hàm số $y = |x|$ (Bài tập 1.8 SGK trang 14). Khẳng định nào sau đây là đúng về cực trị của hàm số?",
      options: [
        "Hàm số không đạt cực trị tại $x = 0$ vì không có đạo hàm tại điểm này.",
        "Hàm số đạt cực đại tại $x = 0$ với giá trị cực đại bằng 0.",
        "Hàm số đạt cực tiểu tại $x = 0$ với giá trị cực tiểu $y_{\\text{CT}} = 0$.",
        "Hàm số không xác định tại $x = 0$."
      ],
      correctAnswerIndex: 2,
      diagram: {
        type: 'graph',
        title: 'Đồ thị hàm số y = |x| (Hình 1.4 SGK)',
        graphKind: 'abs_min',
        notes: 'Hàm số đạt cực tiểu tại O(0; 0) dù đạo hàm không tồn tại tại x = 0'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.8]\n\\draw[->] (-3,0) -- (3,0) node[below] {$x$};\n\\draw[->] (0,-0.8) -- (0,3.5) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=-2.5:2.5, samples=100] plot (\\x, {abs(\\x)});\n\\filldraw[yellow] (0,0) circle (2.5pt) node[below=5pt] {Cực tiểu $(0;0)$};\n\\node[cyan, right] at (1.5, 2) {$y = |x|$};\n\\end{tikzpicture}`,
      solution: "Theo định nghĩa cực trị (SGK trang 9 & Bài 1.8 trang 14): Với mọi $x \\ne 0$ trong lân cận điểm 0, ta luôn có $f(x) = |x| > 0 = f(0)$. Do đó theo đúng định nghĩa, hàm số đạt cực tiểu tại $x = 0$ với $y_{\\text{CT}} = 0$. Cực trị không đòi hỏi hàm số phải có đạo hàm tại điểm đó, chỉ cần hàm số liên tục và giá trị tại đó bé hơn các điểm xung quanh."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Tìm cực trị của hàm số căn thức $y = \\sqrt{4x - 2x^2}$ (Bài tập 1.7d SGK trang 14).",
      options: [
        "Hàm số đạt cực tiểu tại $x = 1$ với $y_{\\text{CT}} = \\sqrt{2}$.",
        "Hàm số đạt cực đại tại $x = 1$ với $y_{\\text{CD}} = \\sqrt{2}$.",
        "Hàm số đạt cực đại tại $x = 2$ với $y_{\\text{CD}} = 0$.",
        "Hàm số không có cực trị trên tập xác định."
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = \\sqrt{4x - 2x^2} trên [0; 2]',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '0', val: '0', pos: 'bottom' },
          { x: '1', yPrimeAt: '0', val: '\\sqrt{2}', pos: 'top' },
          { x: '2', val: '0', pos: 'bottom' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' }
        ],
        notes: 'Hàm số đạt cực đại tại x = 1 với y_{\\text{CD}} = \\sqrt{2}'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.5]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$0$, $1$, $2$}
\\tkzTabLine{,+,0,-,}
\\tkzTabVar{-/ $0$, +/ $\\sqrt{2}$, -/ $0$}
\\end{tikzpicture}`,
      solution: "Tập xác định: $4x - 2x^2 \\ge 0 \\Leftrightarrow 0 \\le x \\le 2$. Với $x \\in (0; 2)$, đạo hàm $y' = \\frac{4 - 4x}{2\\sqrt{4x - 2x^2}} = \\frac{2(1 - x)}{\\sqrt{4x - 2x^2}}$. Cho $y' = 0 \\Leftrightarrow x = 1$. Khi $x$ qua 1, $y'$ đổi dấu từ dương sang âm, do đó hàm số đạt cực đại tại $x = 1$ với $y_{\\text{CD}} = \\sqrt{4(1) - 2(1)^2} = \\sqrt{2}$."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Tìm giá trị cực tiểu của hàm số $y = x^2 \\ln x$ trên khoảng $(0; +\\infty)$ (Bài tập 1.33 SGK trang 42).",
      options: [
        "$-\\frac{1}{2e}$",
        "$\\frac{1}{e}$",
        "$-\\frac{1}{e}$",
        "$\\frac{1}{2e}$"
      ],
      correctAnswerIndex: 0,
      solution: "TXĐ: $(0; +\\infty)$. Đạo hàm: $y' = 2x \\ln x + x^2 \\cdot \\frac{1}{x} = x(2\\ln x + 1)$. Với $x > 0$, cho $y' = 0 \\Leftrightarrow 2\\ln x + 1 = 0 \\Leftrightarrow \\ln x = -\\frac{1}{2} \\Leftrightarrow x = e^{-1/2} = \\frac{1}{\\sqrt{e}}$. Qua $x = e^{-1/2}$, $y'$ đổi dấu từ âm sang dương nên hàm số đạt cực tiểu tại $x = e^{-1/2}$. Giá trị cực tiểu $y\\left(e^{-1/2}\\right) = (e^{-1/2})^2 \\ln(e^{-1/2}) = e^{-1} \\left(-\\frac{1}{2}\\right) = -\\frac{1}{2e}$."
    },
    {
      id: 13,
      level: 'Vận dụng',
      question: "Một vật được phóng thẳng đứng lên trên từ độ cao 2 m với vận tốc ban đầu $24{,}5$ m/s, bỏ qua sức cản không khí thì độ cao $h$ (mét) của vật sau $t$ giây được cho bởi công thức $h(t) = 2 + 24{,}5t - 4{,}9t^2$ (Vận dụng 2 SGK trang 12). Sau bao nhiêu giây vật đạt độ cao lớn nhất?",
      options: [
        "$5{,}0$ giây",
        "$2{,}0$ giây",
        "$2{,}5$ giây",
        "$4{,}9$ giây"
      ],
      correctAnswerIndex: 2,
      solution: "Đạo hàm: $h'(t) = 24{,}5 - 9{,}8t$. Cho $h'(t) = 0 \\Leftrightarrow 9{,}8t = 24{,}5 \\Leftrightarrow t = \\frac{24{,}5}{9{,}8} = 2{,}5$ giây. Vì $h''(t) = -9{,}8 < 0$ nên hàm số đạt cực đại tại $t = 2{,}5$ s với độ cao cực đại $h(2{,}5) = 2 + 24{,}5(2{,}5) - 4{,}9(2{,}5)^2 = 32{,}625$ mét."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1$ đạt cực đại tại điểm $x = 1$.",
      options: [
        "$m = 2$",
        "$m = 0$",
        "$m = 1$",
        "$m = -2$"
      ],
      correctAnswerIndex: 0,
      solution: "Đạo hàm: $y' = 3x^2 - 6mx + 3(m^2 - 1) = 3[x^2 - 2mx + m^2 - 1] = 3[x - (m - 1)][x - (m + 1)]$. Phương trình $y' = 0$ có 2 nghiệm phân biệt là $x_1 = m - 1$ và $x_2 = m + 1$ (do $x_1 < x_2$). Vì hệ số $a = 3 > 0$ nên hàm số đạt cực đại tại nghiệm nhỏ hơn là $x_1 = m - 1$. Để hàm số đạt cực đại tại $x = 1$ thì $m - 1 = 1 \\Leftrightarrow m = 2$."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Phương trình đường thẳng đi qua hai điểm cực trị của đồ thị hàm số $y = x^3 - 3x^2 - 9x + 2$ là:",
      options: [
        "$y = -8x - 1$",
        "$y = -8x + 2$",
        "$y = 8x - 1$",
        "$y = -4x + 1$"
      ],
      correctAnswerIndex: 0,
      solution: "Ta có $y' = 3x^2 - 6x - 9$. Thực hiện phép chia đa thức $y$ cho $y'$: $x^3 - 3x^2 - 9x + 2 = (3x^2 - 6x - 9)\\left(\\frac{1}{3}x - \\frac{1}{3}\\right) + (-8x - 1)$. Tại các điểm cực trị thì $y' = 0$, do đó $y = -8x - 1$. Vậy đường thẳng đi qua hai điểm cực trị của đồ thị hàm số có phương trình là $y = -8x - 1$."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 3: NHẬN DIỆN ĐỒ THỊ, HÀM PHÂN THỨC & CĂN THỨC
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Nếu hàm số $y = f(x)$ đồng biến trên khoảng $K = (a; b)$ thì đồ thị của hàm số trên khoảng đó có dạng như thế nào? (Chú ý SGK trang 6)",
      options: [
        "Đi xuống từ trái sang phải.",
        "Đi lên từ trái sang phải.",
        "Là một đường thẳng song song với trục hoành.",
        "Là một đường parabol có bề lõm hướng xuống dưới."
      ],
      correctAnswerIndex: 1,
      solution: "Theo Chú ý SGK trang 6: Nếu hàm số đồng biến trên $K$ thì đồ thị của hàm số đó đi lên từ trái sang phải. Nếu hàm số nghịch biến trên $K$ thì đồ thị của hàm số đó đi xuống từ trái sang phải."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Đồ thị hàm số bậc hai $y = ax^2 + bx + c$ ($a > 0$) có đỉnh $I\\left(-\\frac{b}{2a}; -\\frac{\\Delta}{4a}\\right)$. Điểm $x = -\\frac{b}{2a}$ là:",
      options: [
        "Điểm cực đại của hàm số.",
        "Điểm cực tiểu của hàm số.",
        "Điểm uốn của đồ thị hàm số.",
        "Giao điểm của đồ thị với trục tung."
      ],
      correctAnswerIndex: 1,
      solution: "Với $a > 0$, parabol quay bề lõm lên trên, hàm số giảm trên $(-\\infty; -b/(2a))$ và tăng trên $(-b/(2a); +\\infty)$. Do đó hàm số đạt cực tiểu tại $x = -\\frac{b}{2a}$."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Một hàm số bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \\ne 0$) có thể có bao nhiêu điểm cực trị?",
      options: [
        "Luôn luôn có đúng 1 điểm cực trị.",
        "Có 0 điểm cực trị hoặc có đúng 2 điểm cực trị.",
        "Có thể có 3 điểm cực trị.",
        "Luôn luôn có đúng 2 điểm cực trị."
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'graph',
        title: 'Đồ thị chuẩn của hàm số bậc ba',
        graphKind: 'cubic_standard',
        notes: 'Hàm số bậc ba có đạo hàm bậc hai, do đó có tối đa 2 điểm cực trị'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.8]\n\\draw[->] (-3,0) -- (3.5,0) node[below] {$x$};\n\\draw[->] (0,-2.5) -- (0,3) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=-2.2:3.2, samples=100] plot (\\x, {0.3*(\\x)^3 - 0.5*(\\x)^2 - 1.2*(\\x) + 1});\n\\filldraw[yellow] (-0.8, 1.6) circle (2.5pt) node[above left] {Cực đại};\n\\filldraw[teal] (1.9, -1.3) circle (2.5pt) node[below right] {Cực tiểu};\n\\end{tikzpicture}`,
      solution: "Đạo hàm của hàm bậc ba là một tam thức bậc hai $y' = 3ax^2 + 2bx + c$. Phương trình bậc hai này có tối đa 2 nghiệm phân biệt và đổi dấu. Nếu $\\Delta' > 0$ thì có 2 cực trị; nếu $\\Delta' \\le 0$ thì phương trình vô nghiệm hoặc nghiệm kép, khi đó hàm số không có cực trị (0 cực trị)."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Quan sát đồ thị hàm số ở Hình 1.8 (SGK trang 10). Hàm số đã cho có tổng cộng bao nhiêu điểm cực trị?",
      options: [
        "$1$ điểm cực trị",
        "$2$ điểm cực trị",
        "$3$ điểm cực trị",
        "$4$ điểm cực trị"
      ],
      correctAnswerIndex: 2,
      diagram: {
        type: 'graph',
        title: 'Đồ thị hàm số y = f(x) (Hình 1.8 SGK trang 10)',
        graphKind: 'quartic_fig18',
        notes: 'Hàm số có 2 điểm cực tiểu tại x = ±1 và 1 điểm cực đại tại x = 0'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.85]\n\\draw[->] (-3,0) -- (3,0) node[below] {$x$};\n\\draw[->] (0,-0.5) -- (0,4) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=-1.8:1.8, samples=100] plot (\\x, {(\\x)^4 - 2*(\\x)^2 + 3});\n\\filldraw[teal] (-1, 2) circle (2pt) node[below=2pt] {$(-1; 2)$};\n\\filldraw[yellow] (0, 3) circle (2pt) node[above right] {$(0; 3)$};\n\\filldraw[teal] (1, 2) circle (2pt) node[below=2pt] {$(1; 2)$};\n\\draw[dashed] (-1,0) node[below] {$-1$} -- (-1,2) -- (0,2) node[left] {$2$};\n\\draw[dashed] (1,0) node[below] {$1$} -- (1,2);\n\\node[cyan, right] at (1.2, 3.5) {$y = f(x)$};\n\\end{tikzpicture}`,
      solution: "Từ đồ thị Hình 1.8 (SGK trang 10), hàm số đạt cực tiểu tại $x = -1$ và $x = 1$ (với $y_{\\text{CT}} = 2$), và đạt cực đại tại $x = 0$ (với $y_{\\text{CD}} = 3$). Do đó hàm số có tổng cộng 3 điểm cực trị."
    },
    {
      id: 5,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ xác định trên $\\mathbb{R}$ và có bảng xét dấu của đạo hàm $f'(x)$ như sau. Hàm số có bao nhiêu điểm cực tiểu?",
      options: [
        "$1$",
        "$2$",
        "$3$",
        "$0$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng xét dấu đạo hàm f\'(x)',
        xLabel: 'x',
        yPrimeLabel: "f'(x)",
        yLabel: 'f(x)',
        points: [
          { x: '-\\infty', val: '+\\infty', pos: 'top' },
          { x: '-2', yPrimeAt: '0', val: '-3', pos: 'bottom' },
          { x: '0', yPrimeAt: '0', val: '5', pos: 'top' },
          { x: '2', yPrimeAt: '0', val: '-3', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: "Đạo hàm đổi dấu từ (-) sang (+) tại x = -2 và x = 2"
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=1.8]{$x$ /0.8, $f'(x)$ /0.8, $f(x)$ /2}{$-\\infty$, $-2$, $0$, $2$, $+\\infty$}
\\tkzTabLine{,-,0,+,0,-,0,+,}
\\tkzTabVar{+/ $+\\infty$, -/ $-3$, +/ $5$, -/ $-3$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Đạo hàm $f'(x)$ đổi dấu từ âm sang dương khi qua $x = -2$ và khi qua $x = 2$. Do đó hàm số có đúng 2 điểm cực tiểu (tại $x = -2$ và $x = 2$)."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Xét tính đơn điệu của hàm số $y = -x^3 + 2x^2 - 5x + 3$ (Bài tập 1.2b SGK trang 13).",
      options: [
        "Hàm số đồng biến trên $\\mathbb{R}$.",
        "Hàm số nghịch biến trên khoảng $(-\\infty; +\\infty)$.",
        "Hàm số đồng biến trên $(-1; 2)$.",
        "Hàm số có 2 khoảng đồng biến và 1 khoảng nghịch biến."
      ],
      correctAnswerIndex: 1,
      solution: "TXĐ: $\\mathbb{R}$. Đạo hàm $y' = -3x^2 + 4x - 5$. Ta có $\\Delta' = 2^2 - (-3)(-5) = 4 - 15 = -11 < 0$ và hệ số $a = -3 < 0$. Suy ra $y' < 0$ với mọi $x \\in \\mathbb{R}$. Do đó hàm số nghịch biến trên khoảng $(-\\infty; +\\infty)$."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Tìm các điểm cực trị của hàm số phân thức $y = \\frac{x^2 - 2x + 3}{x - 1}$ (Bài tập 1.7c SGK trang 14).",
      options: [
        "$x = 1 \\pm \\sqrt{2}$",
        "$x = 1$ và $x = 3$",
        "$x = 0$ và $x = 2$",
        "Hàm số không có cực trị."
      ],
      correctAnswerIndex: 0,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = \\frac{x^2 - 2x + 3}{x - 1}',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '1 - \\sqrt{2}', yPrimeAt: '0', val: '2 - 2\\sqrt{2}', pos: 'top' },
          { 
            x: '1', 
            yPrimeAt: '||', 
            isAsymptote: true, 
            leftVal: '-\\infty', 
            leftPos: 'bottom', 
            rightVal: '+\\infty', 
            rightPos: 'top' 
          },
          { x: '1 + \\sqrt{2}', yPrimeAt: '0', val: '2 + 2\\sqrt{2}', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Hàm số đạt cực đại tại x = 1 - \\sqrt{2} và cực tiểu tại x = 1 + \\sqrt{2}'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=1.8]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $1-\\sqrt{2}$, $1$, $1+\\sqrt{2}$, $+\\infty$}
\\tkzTabLine{,+,0,-,d,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $2-2\\sqrt{2}$, -D+/ $-\\infty$ / $+\\infty$, -/ $2+2\\sqrt{2}$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "TXĐ: $D = \\mathbb{R} \\setminus \\{1\\}$. Viết $y = x - 1 + \\frac{2}{x - 1}$. Đạo hàm $y' = 1 - \\frac{2}{(x-1)^2} = \\frac{(x-1)^2 - 2}{(x-1)^2}$. Cho $y' = 0 \\Leftrightarrow (x - 1)^2 = 2 \\Leftrightarrow x - 1 = \\pm\\sqrt{2} \\Leftrightarrow x = 1 \\pm \\sqrt{2}$. Qua hai điểm này đạo hàm đổi dấu nên hàm số đạt cực trị tại $x = 1 - \\sqrt{2}$ và $x = 1 + \\sqrt{2}$."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Hàm số $y = \\frac{x}{x^2 + 1}$ (Bài tập 1.4b SGK trang 13) đồng biến trên khoảng nào?",
      options: [
        "$(-\\infty; -1)$ và $(1; +\\infty)$",
        "$(-1; 1)$",
        "$(0; +\\infty)$",
        "$(-\\infty; 0)$"
      ],
      correctAnswerIndex: 1,
      solution: "TXĐ: $\\mathbb{R}$. Đạo hàm: $y' = \\frac{1(x^2+1) - x(2x)}{(x^2+1)^2} = \\frac{1 - x^2}{(x^2+1)^2}$. Ta có $y' > 0 \\Leftrightarrow 1 - x^2 > 0 \\Leftrightarrow -1 < x < 1$. Vậy hàm số đồng biến trên khoảng $(-1; 1)$."
    },
    {
      id: 9,
      level: 'Thông hiểu',
      question: "Hàm số trùng phương $y = ax^4 + bx^2 + c$ ($a \\ne 0$) có đúng 3 điểm cực trị khi và chỉ khi:",
      options: [
        "$ab > 0$",
        "$ab < 0$",
        "$b^2 - 4ac > 0$",
        "$a > 0$ và $b > 0$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'graph',
        title: 'Đồ thị hàm trùng phương có 3 cực trị (dạng chữ W)',
        graphKind: 'quartic_w',
        notes: 'Khi a > 0, b < 0 (ab < 0), hàm số có 2 cực tiểu và 1 cực đại'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.8]\n\\draw[->] (-3,0) -- (3,0) node[below] {$x$};\n\\draw[->] (0,-2) -- (0,3) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=-2.2:2.2, samples=100] plot (\\x, {0.5*(\\x)^4 - 2*(\\x)^2 + 1});\n\\filldraw[yellow] (0, 1) circle (2.5pt) node[above right] {Cực đại $(0; c)$};\n\\filldraw[teal] (-1.414, -1) circle (2.5pt) node[below] {Cực tiểu 1};\n\\filldraw[teal] (1.414, -1) circle (2.5pt) node[below] {Cực tiểu 2};\n\\end{tikzpicture}`,
      solution: "Ta có $y' = 4ax^3 + 2bx = 2x(2ax^2 + b) = 0 \\Leftrightarrow x = 0$ hoặc $x^2 = -\\frac{b}{2a}$. Hàm số có 3 điểm cực trị khi và chỉ khi phương trình $y' = 0$ có 3 nghiệm phân biệt, tức là $-\\frac{b}{2a} > 0 \\Leftrightarrow \\frac{b}{a} < 0 \\Leftrightarrow ab < 0$."
    },
    {
      id: 10,
      level: 'Thông hiểu',
      question: "Tìm các khoảng nghịch biến của hàm số $y = \\frac{x^2 + x + 4}{x - 3}$ (Bài tập 1.3b SGK trang 13).",
      options: [
        "$(-1; 3)$ và $(3; 7)$",
        "$(-\\infty; -1)$ và $(7; +\\infty)$",
        "$(-1; 7)$",
        "$(3; +\\infty)$"
      ],
      correctAnswerIndex: 0,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = \\frac{x^2 + x + 4}{x - 3}',
        xLabel: 'x',
        yPrimeLabel: "y'",
        yLabel: 'y',
        points: [
          { x: '-\\infty', val: '-\\infty', pos: 'bottom' },
          { x: '-1', yPrimeAt: '0', val: '-1', pos: 'top' },
          { 
            x: '3', 
            yPrimeAt: '||', 
            isAsymptote: true, 
            leftVal: '-\\infty', 
            leftPos: 'bottom', 
            rightVal: '+\\infty', 
            rightPos: 'top' 
          },
          { x: '7', yPrimeAt: '0', val: '15', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' },
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: 'Hàm số nghịch biến trên (-1; 3) và (3; 7)'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=1.8]{$x$ /0.8, $y'$ /0.8, $y$ /2}{$-\\infty$, $-1$, $3$, $7$, $+\\infty$}
\\tkzTabLine{,+,0,-,d,-,0,+,}
\\tkzTabVar{-/ $-\\infty$, +/ $-1$, -D+/ $-\\infty$ / $+\\infty$, -/ $15$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "TXĐ: $D = \\mathbb{R} \\setminus \\{3\\}$. Đạo hàm $y' = \\frac{(2x+1)(x-3) - (x^2+x+4)}{(x-3)^2} = \\frac{x^2 - 6x - 7}{(x-3)^2} = \\frac{(x+1)(x-7)}{(x-3)^2}$. Cho $y' = 0 \\Leftrightarrow x = -1$ hoặc $x = 7$. Ta có $y' < 0 \\Leftrightarrow -1 < x < 7$ và $x \\ne 3$. Vậy hàm số nghịch biến trên các khoảng $(-1; 3)$ và $(3; 7)$."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Cho hàm số $y = x^3 - \\frac{3}{2}x^2$ có đồ thị như Hình 1.11 (SGK trang 13). Khẳng định nào sau đây là đúng?",
      options: [
        "Hàm số đồng biến trên khoảng $(0; 1)$.",
        "Hàm số nghịch biến trên khoảng $(0; 1)$.",
        "Hàm số đạt cực tiểu tại $x = 0$.",
        "Hàm số nghịch biến trên $(1; +\\infty)$."
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'graph',
        title: 'Đồ thị hàm số y = x³ - 3/2 x² (Hình 1.11 SGK trang 13)',
        graphKind: 'cubic_111',
        notes: 'Hàm số nghịch biến trên khoảng (0; 1) do đồ thị đi xuống từ trái sang phải'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.85]\n\\draw[->] (-1.5,0) -- (2.8,0) node[below] {$x$};\n\\draw[->] (0,-1.5) -- (0,2.5) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=-0.8:2.2, samples=100] plot (\\x, {(\\x)^3 - 1.5*(\\x)^2});\n\\filldraw[yellow] (0,0) circle (2pt) node[above left] {Cực đại $(0;0)$};\n\\filldraw[teal] (1, -0.5) circle (2pt) node[below] {Cực tiểu $(1; -0.5)$};\n\\draw[dashed] (1,0) node[above] {$1$} -- (1,-0.5) -- (0,-0.5) node[left] {$-\frac{1}{2}$};\n\\node[cyan, right] at (1.5, 1.8) {$y = x^3 - \\frac{3}{2}x^2$};\n\\end{tikzpicture}`,
      solution: "Đạo hàm: $y' = 3x^2 - 3x = 3x(x - 1)$. Cho $y' = 0 \\Leftrightarrow x = 0$ hoặc $x = 1$. Trong khoảng $(0; 1)$, $y' < 0$ và đồ thị đi xuống từ trái sang phải. Do đó hàm số nghịch biến trên khoảng $(0; 1)$."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Cho hàm số $y = \\sqrt[3]{(x^2 - 4)^2}$ có đồ thị như Hình 1.12 (SGK trang 13). Hàm số đạt cực tiểu tại các điểm nào?",
      options: [
        "$x = 0$",
        "$x = -2$ và $x = 2$",
        "$x = -4$ và $x = 4$",
        "Hàm số không có cực tiểu."
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'graph',
        title: 'Đồ thị hàm số y = ∛(x² - 4)² (Hình 1.12 SGK trang 13)',
        graphKind: 'cusp_fig12',
        notes: 'Hai điểm cực tiểu là x = -2 và x = 2 với giá trị cực tiểu y = 0'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.8]\n\\draw[->] (-3.5,0) -- (3.5,0) node[below] {$x$};\n\\draw[->] (0,-0.5) -- (0,3.5) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=-3:3, samples=120] plot (\\x, {(abs((\\x)^2 - 4))^(2/3)});\n\\filldraw[teal] (-2, 0) circle (2.5pt) node[below] {$-2$};\n\\filldraw[teal] (2, 0) circle (2.5pt) node[below] {$2$};\n\\filldraw[yellow] (0, 2.52) circle (2.5pt) node[above right] {Cực đại $(0; \\sqrt[3]{16})$};\n\\node[cyan, right] at (1.5, 3) {$y = \\sqrt[3]{(x^2 - 4)^2}$};\n\\end{tikzpicture}`,
      solution: "Vì $(x^2 - 4)^2 \\ge 0, \\forall x$ nên $y = \\sqrt[3]{(x^2 - 4)^2} \\ge 0$. Dấu bằng xảy ra khi $x^2 - 4 = 0 \\Leftrightarrow x = \\pm 2$. Tại $x = \\pm 2$, giá trị của hàm số là $y = 0$, nhỏ hơn mọi điểm lân cận. Đồ thị tại đây tạo thành các điểm nhọn tiếp xúc với trục hoành hướng lên trên. Vậy hàm số đạt cực tiểu tại hai điểm $x = -2$ và $x = 2$."
    },
    {
      id: 13,
      level: 'Vận dụng',
      question: "Tìm tất cả các giá trị của tham số $m$ để hàm phân thức $y = \\frac{x - m}{x + 1}$ đồng biến trên từng khoảng xác định của nó.",
      options: [
        "$m > -1$",
        "$m \\ge -1$",
        "$m < -1$",
        "$m > 1$"
      ],
      correctAnswerIndex: 0,
      solution: "TXĐ: $D = \\mathbb{R} \\setminus \\{-1\\}$. Đạo hàm $y' = \\frac{1(1) - (-m)(1)}{(x+1)^2} = \\frac{1 + m}{(x+1)^2}$. Để hàm số đồng biến trên từng khoảng xác định thì $y' > 0, \\forall x \\ne -1 \\Leftrightarrow 1 + m > 0 \\Leftrightarrow m > -1$ (chú ý với hàm phân thức bậc nhất/bậc nhất không lấy dấu bằng vì $m = -1$ hàm số suy biến thành hàm hằng $y = 1$)."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Cho hàm số $y = f(x)$ liên tục trên $\\mathbb{R}$ và có bảng biến thiên dưới đây. Khẳng định nào sau đây là đúng?",
      options: [
        "Hàm số không đạt cực trị tại $x = 0$ vì đạo hàm không xác định tại $x = 0$.",
        "Hàm số đạt cực tiểu tại điểm $x = 0$ với giá trị cực tiểu $y_{\\text{CT}} = -3$.",
        "Hàm số đạt cực đại tại điểm $x = 0$.",
        "Điểm $x = 0$ là tiệm cận đứng của đồ thị hàm số."
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số f(x) liên tục tại x = 0',
        xLabel: 'x',
        yPrimeLabel: "f'(x)",
        yLabel: 'f(x)',
        points: [
          { x: '-\\infty', val: '+\\infty', pos: 'top' },
          { x: '0', yPrimeAt: '||', val: '-3', pos: 'bottom' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' }
        ],
        notes: "f(x) liên tục tại x = 0, f'(x) đổi dấu từ (-) sang (+), đạt cực tiểu tại x = 0 với y_{\\text{CT}} = -3"
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.5]{$x$ /0.8, $f'(x)$ /0.8, $f(x)$ /2}{$-\\infty$, $0$, $+\\infty$}
\\tkzTabLine{,-,d,+,}
\\tkzTabVar{+/ $+\\infty$, -/ $-3$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Theo định nghĩa SGK trang 9: Do hàm số liên tục tại $x = 0$, đạo hàm đổi dấu từ âm sang dương khi qua $x = 0$ nên $x = 0$ là điểm cực tiểu của hàm số và giá trị cực tiểu là $y_{\\text{CT}} = -3$. Đạo hàm tại $x_0$ không cần phải tồn tại (chỉ cần hàm số liên tục và $f(x)$ lớn hơn $f(x_0)$ trong lân cận)."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = x^4 - 2(m - 1)x^2 + m - 2$ có đúng một điểm cực tiểu và không có điểm cực đại.",
      options: [
        "$m \\le 1$",
        "$m < 1$",
        "$m \\ge 1$",
        "$m > 1$"
      ],
      correctAnswerIndex: 0,
      solution: "Hàm số trùng phương có hệ số $a = 1 > 0$ và $b = -2(m - 1)$. Để hàm số chỉ có đúng một điểm cực trị (và là cực tiểu) thì $ab \\ge 0 \\Leftrightarrow 1 \\cdot [-2(m - 1)] \\ge 0 \\Leftrightarrow m - 1 \\le 0 \\Leftrightarrow m \\le 1$."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 4: ĐỒ THỊ ĐẠO HÀM f'(x) & BÀI TOÁN THAM SỐ m
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có đạo hàm trên khoảng $(a; b)$ chứa điểm $x_0$. Điều kiện cần và đủ để $x_0$ là một điểm cực trị của hàm số là:",
      options: [
        "$f'(x_0) = 0$.",
        "$f'(x_0) = 0$ và đạo hàm $f'(x)$ đổi dấu khi $x$ đi qua $x_0$.",
        "$f''(x_0) > 0$.",
        "$f(x_0) = 0$."
      ],
      correctAnswerIndex: 1,
      solution: "Theo quy tắc tìm cực trị (SGK trang 10-11): $f'(x_0) = 0$ là điều kiện cần. Để $x_0$ là điểm cực trị thì $f'(x)$ phải đổi dấu khi $x$ đi qua $x_0$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Cho đồ thị hàm số đạo hàm $y = f'(x)$ cắt trục hoành tại điểm $x_0$. Nếu đồ thị $y = f'(x)$ đi từ dưới trục hoành lên phía trên trục hoành khi qua $x_0$ thì điểm $x_0$ là:",
      options: [
        "Điểm cực tiểu của hàm số $y = f(x)$.",
        "Điểm cực đại của hàm số $y = f(x)$.",
        "Điểm uốn của hàm số $y = f(x)$.",
        "Không xác định được."
      ],
      correctAnswerIndex: 0,
      solution: "Khi đồ thị $y = f'(x)$ đi từ dưới trục hoành lên trên trục hoành thì $f'(x)$ đổi dấu từ âm sang dương, suy ra $x_0$ là điểm cực tiểu của hàm số $y = f(x)$."
    },
    {
      id: 3,
      level: 'Thông hiểu',
      question: "Đồ thị của đạo hàm bậc nhất $y = f'(x)$ của hàm số $f(x)$ được cho trong Hình 1.13 (SGK trang 14) cắt trục hoành tại $x = 2, 4, 6$. Hàm số $f(x)$ đồng biến trên những khoảng nào?",
      options: [
        "$(2; 4)$ và $(6; +\\infty)$",
        "$(0; 2)$ và $(4; 6)$",
        "$(-\\infty; 2)$ và $(4; 6)$",
        "$(2; 6)$"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'graph',
        title: 'Đồ thị đạo hàm y = f\'(x) (Hình 1.13 SGK trang 14)',
        graphKind: 'fprime_roots',
        notes: "f'(x) > 0 trên các khoảng (0; 2) và (4; 6)"
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.85]\n\\draw[->] (-0.5,0) -- (7.5,0) node[below] {$x$};\n\\draw[->] (0,-2) -- (0,2.5) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=0.5:6.8, samples=120] plot (\\x, {0.2*(\\x-2)*(\\x-4)*(\\x-6) + 0.3*sin(\\x*50)});\n\\filldraw[yellow] (2,0) circle (2pt) node[below=2pt] {$2$};\n\\filldraw[yellow] (4,0) circle (2pt) node[above=2pt] {$4$};\n\\filldraw[yellow] (6,0) circle (2pt) node[below=2pt] {$6$};\n\\node[teal, font=\\bfseries] at (1, 1) {$(+)$};\n\\node[red, font=\\bfseries] at (3, -1) {$(-)$};\n\\node[teal, font=\\bfseries] at (5, 1) {$(+)$};\n\\node[cyan, font=\\bfseries] at (3.5, 2.2) {$y = f'(x)$};\n\\end{tikzpicture}`,
      solution: "Dựa vào đồ thị Hình 1.13 (SGK trang 14): Trên các khoảng $(0; 2)$ và $(4; 6)$, đồ thị $y = f'(x)$ nằm phía trên trục hoành nên $f'(x) > 0$. Do đó hàm số $y = f(x)$ đồng biến trên các khoảng $(0; 2)$ và $(4; 6)$."
    },
    {
      id: 4,
      level: 'Thông hiểu',
      question: "Dựa vào đồ thị của đạo hàm $y = f'(x)$ ở Hình 1.13 (SGK trang 14), hàm số $y = f(x)$ đạt cực đại tại điểm nào?",
      options: [
        "$x = 2$",
        "$x = 4$",
        "$x = 6$",
        "$x = 0$"
      ],
      correctAnswerIndex: 0,
      diagram: {
        type: 'graph',
        title: 'Đồ thị đạo hàm y = f\'(x) (Hình 1.13 SGK trang 14)',
        graphKind: 'fprime_roots',
        notes: "Qua x = 2, f'(x) đổi dấu từ dương sang âm nên đạt cực đại"
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.85]\n\\draw[->] (-0.5,0) -- (7.5,0) node[below] {$x$};\n\\draw[->] (0,-2) -- (0,2.5) node[left] {$y$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=0.5:6.8, samples=120] plot (\\x, {0.2*(\\x-2)*(\\x-4)*(\\x-6) + 0.3*sin(\\x*50)});\n\\filldraw[yellow] (2,0) circle (2pt) node[below=2pt] {$2$};\n\\filldraw[yellow] (4,0) circle (2pt) node[above=2pt] {$4$};\n\\filldraw[yellow] (6,0) circle (2pt) node[below=2pt] {$6$};\n\\node[teal, font=\\bfseries] at (1, 1) {$(+)$};\n\\node[red, font=\\bfseries] at (3, -1) {$(-)$};\n\\node[teal, font=\\bfseries] at (5, 1) {$(+)$};\n\\node[cyan, font=\\bfseries] at (3.5, 2.2) {$y = f'(x)$};\n\\end{tikzpicture}`,
      solution: "Tại $x = 2$, khi $x$ tăng qua 2 thì đồ thị $f'(x)$ đi từ trên trục hoành xuống dưới trục hoành (tức $f'(x)$ đổi dấu từ $+$ sang $-$). Do đó hàm số $y = f(x)$ đạt cực đại tại điểm $x = 2$."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = (x - 1)^2 (x + 3)$. Hàm số $y = f(x)$ có bao nhiêu điểm cực trị?",
      options: [
        "$2$ điểm cực trị",
        "$1$ điểm cực trị",
        "$3$ điểm cực trị",
        "$0$ điểm cực trị"
      ],
      correctAnswerIndex: 1,
      diagram: {
        type: 'bbt',
        title: "Bảng xét dấu đạo hàm f'(x) = (x - 1)²(x + 3)",
        xLabel: 'x',
        yPrimeLabel: "f'(x)",
        yLabel: 'f(x)',
        points: [
          { x: '-\\infty', val: '+\\infty', pos: 'top' },
          { x: '-3', yPrimeAt: '0', val: 'y(-3)', pos: 'bottom' },
          { x: '1', yPrimeAt: '0', val: 'y(1)', pos: 'mid' },
          { x: '+\\infty', val: '+\\infty', pos: 'top' }
        ],
        intervals: [
          { sign: '-', arrow: 'down' },
          { sign: '+', arrow: 'up' },
          { sign: '+', arrow: 'up' }
        ],
        notes: "f'(x) đổi dấu từ (-) sang (+) qua x = -3 (cực tiểu), không đổi dấu qua x = 1 (nghiệm kép)"
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.0]{$x$ /0.8, $f'(x)$ /0.8, $f(x)$ /2}{$-\\infty$, $-3$, $1$, $+\\infty$}
\\tkzTabLine{,-,0,+,0,+,}
\\tkzTabVar{+/ $+\\infty$, -/ $y(-3)$, +/ $y(1)$, +/ $+\\infty$}
\\end{tikzpicture}`,
      solution: "Phương trình $f'(x) = 0 \\Leftrightarrow x = 1$ hoặc $x = -3$. Vì $(x - 1)^2 \\ge 0$ với mọi $x$ nên khi qua $x = 1$, $f'(x)$ không đổi dấu. Khi qua $x = -3$, thừa số $(x + 3)$ đổi dấu từ âm sang dương. Do đó hàm số chỉ có đúng 1 điểm cực trị (tại $x = -3$ là điểm cực tiểu)."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Tìm tất cả các giá trị của tham số $m$ để hàm số $y = x^3 - 3x^2 + mx - 1$ đồng biến trên toàn bộ $\\mathbb{R}$.",
      options: [
        "$m \\ge 3$",
        "$m > 3$",
        "$m \\le 3$",
        "$m < 3$"
      ],
      correctAnswerIndex: 0,
      solution: "Đạo hàm: $y' = 3x^2 - 6x + m$. Hàm số đồng biến trên $\\mathbb{R} \\Leftrightarrow y' \\ge 0, \\forall x \\in \\mathbb{R} \\Leftrightarrow \\Delta' = (-3)^2 - 3m = 9 - 3m \\le 0 \\Leftrightarrow 3m \\ge 9 \\Leftrightarrow m \\ge 3$."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Tìm tất cả các giá trị của tham số $m$ để hàm số $y = -x^3 + 3mx^2 - 3(2m - 1)x + 1$ nghịch biến trên $\\mathbb{R}$.",
      options: [
        "$m = 1$",
        "$m \\le 1$",
        "$m \\ge 1$",
        "Không có giá trị m nào."
      ],
      correctAnswerIndex: 0,
      solution: "Đạo hàm: $y' = -3x^2 + 6mx - 3(2m - 1) = -3[x^2 - 2mx + 2m - 1]$. Để hàm số nghịch biến trên $\\mathbb{R}$ thì $x^2 - 2mx + 2m - 1 \\ge 0, \\forall x \\in \\mathbb{R} \\Leftrightarrow \\Delta' = m^2 - (2m - 1) = (m - 1)^2 \\le 0$. Vì bình phương luôn không âm nên $(m - 1)^2 \\le 0 \\Leftrightarrow m - 1 = 0 \\Leftrightarrow m = 1$."
    },
    {
      id: 8,
      level: 'Vận dụng',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để hàm số $y = \\frac{mx + 4}{x + m}$ nghịch biến trên khoảng $(1; +\\infty)$.",
      options: [
        "$-2 < m < 2$",
        "$-1 \\le m < 2$",
        "$m > 2$",
        "$-2 < m \\le -1$"
      ],
      correctAnswerIndex: 1,
      solution: "Điều kiện xác định: $x \\ne -m$. Để hàm số xác định trên khoảng $(1; +\\infty)$ thì điểm gián đoạn $-m$ không được thuộc $(1; +\\infty) \\Leftrightarrow -m \\le 1 \\Leftrightarrow m \\ge -1$. Đạo hàm: $y' = \\frac{m^2 - 4}{(x + m)^2}$. Để hàm số nghịch biến thì $y' < 0 \\Leftrightarrow m^2 - 4 < 0 \\Leftrightarrow -2 < m < 2$. Kết hợp hai điều kiện ta được: $-1 \\le m < 2$."
    },
    {
      id: 9,
      level: 'Vận dụng',
      question: "Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = x^3 (x - 2)^2 (x + 1)^5$. Hàm số $y = f(x)$ có bao nhiêu điểm cực trị?",
      options: [
        "$3$ điểm cực trị",
        "$2$ điểm cực trị",
        "$1$ điểm cực trị",
        "$0$ điểm cực trị"
      ],
      correctAnswerIndex: 1,
      solution: "Phương trình $f'(x) = 0$ có 3 nghiệm: $x = 0$ (bậc 3 - bậc lẻ $\\Rightarrow$ đổi dấu), $x = 2$ (bậc 2 - bậc chẵn $\\Rightarrow$ không đổi dấu), $x = -1$ (bậc 5 - bậc lẻ $\\Rightarrow$ đổi dấu). Do đó $f'(x)$ chỉ đổi dấu khi qua $x = 0$ và $x = -1$. Vậy hàm số có đúng 2 điểm cực trị."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Tìm tất cả các giá trị của tham số $m$ để hàm số $y = x^3 - 3x^2 + 3mx + 1$ có hai điểm cực trị.",
      options: [
        "$m < 1$",
        "$m \\le 1$",
        "$m > 1$",
        "$m \\ne 1$"
      ],
      correctAnswerIndex: 0,
      solution: "Đạo hàm $y' = 3x^2 - 6x + 3m$. Để hàm số có 2 điểm cực trị thì phương trình $y' = 0$ phải có 2 nghiệm phân biệt $\\Leftrightarrow \\Delta' = (-3)^2 - 3(3m) = 9 - 9m > 0 \\Leftrightarrow 9m < 9 \\Leftrightarrow m < 1$."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Tìm tất cả các giá trị của tham số $m$ để hàm số $y = \\frac{1}{3}x^3 - (m - 1)x^2 + (m^2 - 3m + 2)x$ đạt cực tiểu tại điểm $x = 0$.",
      options: [
        "$m = 1$",
        "$m = 2$",
        "Không có giá trị m nào thỏa mãn",
        "$m = 1$ hoặc $m = 2$"
      ],
      correctAnswerIndex: 2,
      solution: "Đạo hàm: $y' = x^2 - 2(m-1)x + (m^2 - 3m + 2)$. Điều kiện cần để đạt cực trị tại $x = 0$ là $y'(0) = 0 \\Leftrightarrow m^2 - 3m + 2 = 0 \\Leftrightarrow m = 1$ hoặc $m = 2$. Với $m = 1$: $y' = x^2 \\ge 0, \\forall x$ nên hàm số không có cực trị. Với $m = 2$: $y' = x^2 - 2x = x(x - 2)$; qua $x = 0$ đạo hàm đổi dấu từ dương sang âm nên $x = 0$ là điểm cực đại (không phải cực tiểu). Do đó không có giá trị nào của $m$ thỏa mãn."
    },
    {
      id: 12,
      level: 'Vận dụng cao',
      question: "Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = (x - 1)(x - 2)(x - 3)$. Hỏi hàm số $g(x) = f(x^2)$ có bao nhiêu điểm cực trị?",
      options: [
        "$3$",
        "$5$",
        "$7$",
        "$6$"
      ],
      correctAnswerIndex: 2,
      solution: "Đạo hàm: $g'(x) = (x^2)' \\cdot f'(x^2) = 2x(x^2 - 1)(x^2 - 2)(x^2 - 3) = 2x(x - 1)(x + 1)(x - \\sqrt{2})(x + \\sqrt{2})(x - \\sqrt{3})(x + \\sqrt{3})$. Phương trình $g'(x) = 0$ có 7 nghiệm đơn phân biệt: $0, \\pm 1, \\pm\\sqrt{2}, \\pm\\sqrt{3}$. Qua mỗi nghiệm đơn này, $g'(x)$ đều đổi dấu. Vậy hàm số $g(x)$ có đúng 7 điểm cực trị."
    },
    {
      id: 13,
      level: 'Vận dụng cao',
      question: "Tìm điều kiện của tham số $m$ để hai điểm cực trị của đồ thị hàm số $y = x^3 - 3mx^2 + 4m^3$ đối xứng nhau qua gốc tọa độ $O(0; 0)$.",
      options: [
        "$m = 1$",
        "$m = -1$",
        "Không tồn tại giá trị m",
        "$m = 2$"
      ],
      correctAnswerIndex: 2,
      solution: "Đạo hàm: $y' = 3x^2 - 6mx = 3x(x - 2m) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2m$. Để có 2 cực trị thì $m \\ne 0$. Hai điểm cực trị là $A(0; 4m^3)$ và $B(2m; 0)$. Trung điểm của $AB$ là $I(m; 2m^3)$. Để $A, B$ đối xứng qua $O(0; 0)$ thì $I \\equiv O \\Leftrightarrow m = 0$ và $2m^3 = 0 \\Leftrightarrow m = 0$, mâu thuẫn với điều kiện $m \\ne 0$. Vậy không tồn tại giá trị $m$ nào thỏa mãn."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Cho hàm số $y = f(x)$ có đồ thị $y = f'(x)$ cắt trục hoành tại ba điểm $-1, 1, 4$ với $f'(x) > 0$ trên $(-1; 1)$ và $(4; +\\infty)$. Hàm số $g(x) = f(2 - x)$ đồng biến trên những khoảng nào sau đây?",
      options: [
        "$(-2; 1)$ và $(3; +\\infty)$",
        "$(1; 3)$",
        "$(-\\infty; -2)$",
        "$(-1; 4)$"
      ],
      correctAnswerIndex: 0,
      solution: "Ta có $g'(x) = -f'(2 - x)$. Hàm số $g(x)$ đồng biến $\\Leftrightarrow g'(x) > 0 \\Leftrightarrow -f'(2 - x) > 0 \\Leftrightarrow f'(2 - x) < 0$. Theo giả thiết, $f'(u) < 0$ khi $u < -1$ hoặc $1 < u < 4$. Do đó $2 - x < -1 \\Leftrightarrow x > 3$, hoặc $1 < 2 - x < 4 \\Leftrightarrow -2 < x < 1$. Vậy hàm số $g(x)$ đồng biến trên khoảng $(-2; 1)$ và $(3; +\\infty)$."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để đồ thị hàm số $y = x^3 - 3mx^2 + 2$ có hai điểm cực trị $A, B$ sao cho tam giác $OAB$ có diện tích bằng $4$ (với $O$ là gốc tọa độ).",
      options: [
        "$m = \\pm 2$",
        "$m = 2$",
        "$m = \\pm 1$",
        "$m = \\pm 4$"
      ],
      correctAnswerIndex: 0,
      solution: "Ta có $y' = 3x^2 - 6mx = 3x(x - 2m) = 0 \\Leftrightarrow x = 0$ hoặc $x = 2m$. Để có 2 cực trị thì $m \\ne 0$. Hai điểm cực trị là $A(0; 2)$ và $B(2m; 2 - 4m^3)$. Điểm $A$ nằm trên trục $Oy$ nên đoạn $OA = |2| = 2$. Khoảng cách từ $B$ đến trục tung $Oy$ là $d(B; Oy) = |x_B| = |2m|$. Do đó diện tích tam giác $OAB$ là: $S_{OAB} = \\frac{1}{2} OA \\cdot d(B; Oy) = \\frac{1}{2} \\cdot 2 \\cdot |2m| = 2|m|$. Để diện tích bằng $4$ thì $2|m| = 4 \\Leftrightarrow |m| = 2 \\Leftrightarrow m = \\pm 2$."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 5: ỨNG DỤNG THỰC TẾ, VẬT LÍ & VẬN TỐC TỨC THỜI
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Một vật chuyển động thẳng có phương trình tọa độ $s = s(t)$ theo thời gian $t$. Vận tốc tức thời $v(t)$ của vật tại thời điểm $t$ được xác định bởi công thức nào?",
      options: [
        "$v(t) = s'(t)$",
        "$v(t) = s''(t)$",
        "$v(t) = \\frac{s(t)}{t}$",
        "$v(t) = [s'(t)]^2$"
      ],
      correctAnswerIndex: 0,
      solution: "Theo ý nghĩa cơ học của đạo hàm (SGK Toán 12 KNTT trang 9 & trang 33): Vận tốc tức thời của chuyển động tại thời điểm $t$ chính là đạo hàm cấp một của hàm số vị trí: $v(t) = s'(t)$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Trong chuyển động thẳng dọc theo một trục tọa độ, chất điểm chuyển động theo chiều dương khi và chỉ khi:",
      options: [
        "Vận tốc tức thời $v(t) > 0$.",
        "Vận tốc tức thời $v(t) < 0$.",
        "Tọa độ $s(t) = 0$.",
        "Gia tốc $a(t) = 0$."
      ],
      correctAnswerIndex: 0,
      solution: "Theo quy ước cơ học (SGK trang 9): Chiều chuyển động của chất điểm phụ thuộc vào dấu của vận tốc. Chất điểm chuyển động theo chiều dương khi $v(t) > 0$ và chuyển động theo chiều âm (ngược chiều dương) khi $v(t) < 0$."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Gia tốc tức thời $a(t)$ của một chất điểm chuyển động theo phương trình tọa độ $s = s(t)$ là:",
      options: [
        "Đạo hàm cấp hai của quãng đường: $a(t) = s''(t) = v'(t)$.",
        "Đạo hàm cấp một của quãng đường: $a(t) = s'(t)$.",
        "Tỉ số giữa vận tốc và thời gian: $a(t) = \\frac{v(t)}{t}$.",
        "Đạo hàm cấp ba của quãng đường: $a(t) = s'''(t)$."
      ],
      correctAnswerIndex: 0,
      solution: "Theo định nghĩa vật lí (SGK trang 33): Gia tốc tức thời tại thời điểm $t$ là đạo hàm cấp một của vận tốc và là đạo hàm cấp hai của phương trình tọa độ: $a(t) = v'(t) = s''(t)$."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Một vật chuyển động theo phương trình $s(t) = 3t^2 - 12t + 5$ ($t \\ge 0$, $s$ tính bằng mét, $t$ tính bằng giây). Vận tốc của vật tại thời điểm $t = 3$ giây bằng bao nhiêu?",
      options: [
        "$6$ m/s",
        "$18$ m/s",
        "$12$ m/s",
        "$0$ m/s"
      ],
      correctAnswerIndex: 0,
      solution: "Vận tốc tức thời: $v(t) = s'(t) = 6t - 12$. Tại thời điểm $t = 3$ s: $v(3) = 6(3) - 12 = 18 - 12 = 6$ m/s."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Một quả bóng được ném thẳng đứng lên cao từ mặt đất với phương trình độ cao $h(t) = 20t - 5t^2$ (m) ($t \\ge 0$, giây). Quả bóng đang bay lên cao (chuyển động hướng lên) trong khoảng thời gian nào?",
      options: [
        "$0 \\le t < 2$ giây",
        "$t > 2$ giây",
        "$2 < t < 4$ giây",
        "$0 \\le t \\le 4$ giây"
      ],
      correctAnswerIndex: 0,
      solution: "Vận tốc tức thời $v(t) = h'(t) = 20 - 10t$. Quả bóng bay lên cao khi độ cao $h(t)$ tăng, tức là $v(t) > 0 \\Leftrightarrow 20 - 10t > 0 \\Leftrightarrow t < 2$ giây. Kết hợp điều kiện bắt đầu từ $t = 0$, ta có $0 \\le t < 2$ giây."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Dân số của một thị trấn sau $t$ năm kể từ năm 2000 là $N(t) = \\frac{25t + 10}{t + 5}$ (nghìn người, $t \\ge 0$) (Bài 1.5 SGK trang 13). Tốc độ tăng dân số tại thời điểm năm 2005 ($t = 5$) bằng:",
      options: [
        "$1{,}15$ nghìn người/năm (1150 người/năm)",
        "$2{,}5$ nghìn người/năm (2500 người/năm)",
        "$0{,}5$ nghìn người/năm (500 người/năm)",
        "$11{,}5$ nghìn người/năm"
      ],
      correctAnswerIndex: 0,
      solution: "Tốc độ tăng dân số chính là đạo hàm $N'(t) = \\frac{115}{(t + 5)^2}$. Tại $t = 5$ (năm 2005): $N'(5) = \\frac{115}{(5 + 5)^2} = \\frac{115}{100} = 1{,}15$ nghìn người/năm (tức 1150 người/năm)."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Xét chuyển động của chất điểm $s(t) = t^3 - 9t^2 + 15t$ với $t \\ge 0$ (Vận dụng 1 SGK trang 9). Vận tốc tức thời của chất điểm bằng 0 (triệt tiêu) tại các thời điểm nào?",
      options: [
        "$t = 1$ s và $t = 5$ s",
        "$t = 3$ s",
        "$t = 0$ s và $t = 9$ s",
        "$t = 2$ s và $t = 4$ s"
      ],
      correctAnswerIndex: 0,
      solution: "Vận tốc tức thời $v(t) = s'(t) = 3t^2 - 18t + 15 = 3(t^2 - 6t + 5) = 3(t - 1)(t - 5)$. Cho $v(t) = 0 \\Leftrightarrow t = 1$ s hoặc $t = 5$ s. Đây chính là các thời điểm chất điểm dừng lại tức thời để đổi chiều chuyển động."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Nồng độ một loại kháng sinh trong máu người bệnh sau khi tiêm $t$ giờ được xác định bởi công thức $C(t) = \\frac{2t}{t^2 + 1}$ ($mg/L$, $t \\ge 0$). Sau bao nhiêu giờ thì nồng độ kháng sinh đạt giá trị cao nhất?",
      options: [
        "$1$ giờ",
        "$2$ giờ",
        "$0{,}5$ giờ",
        "$4$ giờ"
      ],
      correctAnswerIndex: 0,
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm nồng độ C(t) = \\frac{2t}{t^2 + 1} trên [0; +\\infty)',
        xLabel: 't',
        yPrimeLabel: "C'(t)",
        yLabel: 'C(t)',
        points: [
          { x: '0', val: '0', pos: 'bottom' },
          { x: '1', yPrimeAt: '0', val: '1', pos: 'top' },
          { x: '+\\infty', val: '0', pos: 'bottom' }
        ],
        intervals: [
          { sign: '+', arrow: 'up' },
          { sign: '-', arrow: 'down' }
        ],
        notes: 'Nồng độ kháng sinh đạt cực đại sau 1 giờ với C_{\\max} = 1 mg/L'
      },
      tikz: `\\begin{tikzpicture}
\\tkzTabInit[lgt=1.2,espcl=2.5]{$t$ /0.8, $C'(t)$ /0.8, $C(t)$ /2}{$0$, $1$, $+\\infty$}
\\tkzTabLine{,+,0,-,}
\\tkzTabVar{-/ $0$, +/ $1$, -/ $0$}
\\end{tikzpicture}`,
      solution: "Đạo hàm: $C'(t) = \\frac{2(t^2+1) - 2t(2t)}{(t^2+1)^2} = \\frac{2 - 2t^2}{(t^2+1)^2}$. Cho $C'(t) = 0 \\Leftrightarrow 2 - 2t^2 = 0 \\Leftrightarrow t = 1$ (vì $t \\ge 0$). Lập bảng biến thiên ta thấy $C'(t) > 0$ khi $0 \\le t < 1$ và $C'(t) < 0$ khi $t > 1$. Vậy nồng độ kháng sinh đạt cực đại sau 1 giờ."
    },
    {
      id: 9,
      level: 'Thông hiểu',
      question: "Doanh số của một sản phẩm mới theo thời gian $t$ (năm) tuân theo quy luật logistic $f(t) = \\frac{5000}{1 + 5e^{-t}}$ ($t \\ge 0$, sản phẩm) (Bài tập 1.9 SGK trang 14). Tốc độ bán hàng được biểu thị bởi đại lượng nào?",
      options: [
        "Đạo hàm cấp một $f'(t)$",
        "Chính giá trị $f(t)$",
        "Đạo hàm cấp hai $f''(t)$",
        "Tích phân của $f(t)$"
      ],
      correctAnswerIndex: 0,
      solution: "Theo Bài tập 1.9 SGK trang 14: Khi $f(t)$ biểu thị doanh số (tổng số sản phẩm bán ra), thì đạo hàm cấp một $f'(t)$ biểu thị tốc độ thay đổi tức thời của doanh số, tức là tốc độ bán hàng tại thời điểm $t$."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Với mô hình logistic $f(t) = \\frac{5000}{1 + 5e^{-t}}$ ($t \\ge 0$) ở Bài tập 1.9 (SGK trang 14), sau khi phát hành khoảng bao nhiêu năm thì tốc độ bán hàng $f'(t)$ là lớn nhất? (Làm tròn đến 2 chữ số thập phân).",
      options: [
        "$\\ln 5 \\approx 1{,}61$ năm",
        "$5$ năm",
        "$2{,}50$ năm",
        "$\\ln 2 \\approx 0{,}69$ năm"
      ],
      correctAnswerIndex: 0,
      diagram: {
        type: 'graph',
        title: 'Đồ thị tốc độ bán hàng f\'(t) theo thời gian',
        graphKind: 'parabola_max',
        notes: 'Tốc độ bán hàng đạt cực đại tại t = \\ln 5 \\approx 1{,}61 năm'
      },
      tikz: `\\begin{tikzpicture}[>=stealth, scale=0.8]\n\\draw[->] (-0.5,0) -- (5.5,0) node[below] {$t$ (năm)};\n\\draw[->] (0,-0.5) -- (0,3.5) node[left] {$f'(t)$};\n\\draw (0,0) node[below left] {$O$};\n\\draw[thick, cyan, domain=0:5, samples=100] plot (\\x, {3.2 * (5*exp(-\\x)) / ((1 + 5*exp(-\\x))^2)});\n\\filldraw[yellow] (1.61, 0.8) circle (2.5pt);\n\\draw[dashed, yellow] (1.61,0) -- (1.61,0.8) node[above=2pt] {Cực đại tại $t = \\ln 5 \\approx 1{,}61$};
\\end{tikzpicture}`,
      solution: "Đặt $u = e^{-t} > 0$. Ta có $f'(t) = 5000 \\cdot \\frac{-5(-e^{-t})}{(1+5e^{-t})^2} = 25000 \\frac{e^{-t}}{(1+5e^{-t})^2} = 25000 \\frac{u}{(1+5u)^2}$. Khảo sát $g(u) = \\frac{u}{(1+5u)^2}$ trên $(0; 1]$: $g'(u) = \\frac{1(1+5u)^2 - u \\cdot 2(1+5u) \\cdot 5}{(1+5u)^4} = \\frac{1 - 5u}{(1+5u)^3} = 0 \\Leftrightarrow u = \\frac{1}{5}$. Vì $g'(u)$ đổi dấu từ $+$ sang $-$ qua $u = 1/5$ nên $g(u)$ đạt cực đại tại $u = 1/5 \\Leftrightarrow e^{-t} = 1/5 \\Leftrightarrow t = \\ln 5 \\approx 1{,}61$ năm."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Xét chuyển động của chất điểm $s(t) = t^3 - 9t^2 + 15t$ ($t \\ge 0$, đơn vị: mét, giây). Quãng đường chất điểm đã đi được trong khoảng thời gian từ $t = 0$ đến $t = 3$ giây là:",
      options: [
        "$23$ mét",
        "$9$ mét",
        "$7$ mét",
        "$16$ mét"
      ],
      correctAnswerIndex: 0,
      solution: "Chất điểm xuất phát tại $s(0) = 0$. Vận tốc $v(t) = 3(t - 1)(t - 5)$. Trên $[0; 3]$, vận tốc triệt tiêu và đổi dấu tại $t = 1$. Tại $t = 1$: $s(1) = 1 - 9 + 15 = 7$ m (chất điểm đi sang phải 7 m). Từ $t = 1$ đến $t = 3$: chất điểm đi sang trái. Tại $t = 3$: $s(3) = 27 - 81 + 45 = -9$ m. Quãng đường đi được từ $t = 1$ đến $t = 3$ là $|s(3) - s(1)| = |-9 - 7| = 16$ m. Tổng quãng đường đi được: $S = 7 + 16 = 23$ mét."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Một công ty có hàm tổng chi phí sản xuất $x$ tấn sản phẩm là $C(x) = x^3 - 6x^2 + 15x + 50$ (triệu đồng, $x \\ge 0$). Chi phí biên $C'(x)$ đạt giá trị nhỏ nhất khi sản xuất bao nhiêu tấn sản phẩm?",
      options: [
        "$2$ tấn",
        "$3$ tấn",
        "$1$ tấn",
        "$4$ tấn"
      ],
      correctAnswerIndex: 0,
      solution: "Hàm chi phí biên là đạo hàm của tổng chi phí: $C'(x) = 3x^2 - 12x + 15 = 3(x^2 - 4x + 4) + 3 = 3(x - 2)^2 + 3$. Vì $(x - 2)^2 \\ge 0$ với mọi $x$ nên $C'(x) \\ge 3$. Dấu bằng xảy ra khi $x = 2$. Do đó chi phí biên đạt cực tiểu khi sản xuất $2$ tấn sản phẩm."
    },
    {
      id: 13,
      level: 'Vận dụng',
      question: "Một hạt chuyển động trên một trục thẳng đứng có toạ độ tại thời điểm $t$ giây là $y(t) = t^3 - 12t + 3$ ($t \\ge 0$, đơn vị: mét) (Bài tập 1.26 SGK trang 40). Hạt chuyển động đi xuống dưới trong khoảng thời gian nào?",
      options: [
        "$0 \\le t < 2$ giây",
        "$t > 2$ giây",
        "$0 \\le t < 4$ giây",
        "$t > 4$ giây"
      ],
      correctAnswerIndex: 0,
      solution: "Chiều dương trục đứng hướng lên trên. Hạt chuyển động đi xuống dưới khi vận tốc $v(t) = y'(t) < 0$. Ta có $y'(t) = 3t^2 - 12 < 0 \\Leftrightarrow t^2 < 4 \\Leftrightarrow -2 < t < 2$. Vì thời gian $t \\ge 0$, khoảng thời gian hạt chuyển động đi xuống là $0 \\le t < 2$ giây."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Một máy bay hạ cánh theo một đường cong mượt mà mô tả bởi hàm số bậc ba $y = ax^3 + bx^2 + cx + d$ nối từ vị trí ban đầu $(10; 3)$ (khoảng cách ngang 10 km, độ cao 3 km) đến điểm tiếp đất tại gốc tọa độ $(0; 0)$ với vận tốc theo phương đứng triệt tiêu tại cả hai điểm đầu và cuối ($y'(0) = 0$ và $y'(10) = 0$). Hàm số quỹ đạo hạ cánh là $y = -0{,}006x^3 + 0{,}09x^2$. Tại khoảng cách ngang $x = 5$ km, độ cao của máy bay bằng bao nhiêu?",
      options: [
        "$1{,}5$ km",
        "$1{,}25$ km",
        "$2{,}0$ km",
        "$1{,}75$ km"
      ],
      correctAnswerIndex: 0,
      solution: "Thay $x = 5$ vào hàm số quỹ đạo: $y(5) = -0{,}006 \\cdot 5^3 + 0{,}09 \\cdot 5^2 = -0{,}006 \\cdot 125 + 0{,}09 \\cdot 25 = -0{,}75 + 2{,}25 = 1{,}5$ km. Chú ý đạo hàm $y' = -0{,}018x^2 + 0{,}18x = -0{,}018x(x - 10) \\ge 0$ trên $[0; 10]$, do đó hàm số liên tục giảm khi máy bay tiến về phía sân bay từ 10 km về 0 km."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Một công ty sản xuất máy xay sinh tố xác định hàm lợi nhuận hàng tháng khi bán $x$ chiếc máy là $P(x) = -0{,}3x^3 + 36x^2 + 1800x - 48000$ (nghìn đồng, $x \\ge 0$) (Ví dụ 7 SGK trang 39). Để lợi nhuận đạt giá trị cực đại thì công ty nên sản xuất và bán bao nhiêu chiếc máy mỗi tháng?",
      options: [
        "$100$ chiếc máy",
        "$80$ chiếc máy",
        "$120$ chiếc máy",
        "$200$ chiếc máy"
      ],
      correctAnswerIndex: 0,
      solution: "Đạo hàm: $P'(x) = -0{,}9x^2 + 72x + 1800 = -0{,}9(x^2 - 80x - 2000) = -0{,}9(x - 100)(x + 20)$. Cho $P'(x) = 0 \\Leftrightarrow x = 100$ (do số sản phẩm $x \\ge 0$). Khi $x$ qua 100, đạo hàm $P'(x)$ đổi dấu từ dương sang âm, do đó hàm lợi nhuận đạt cực đại tại $x = 100$. Khi đó mức lợi nhuận lớn nhất thu được là $P(100) = 192000$ nghìn đồng (192 triệu đồng). Công ty nên sản xuất 100 chiếc máy mỗi tháng."
    }
  ]
];
