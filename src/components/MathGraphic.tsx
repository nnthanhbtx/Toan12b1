import React, { useState } from 'react';
import katex from 'katex';
import { Eye, Code, Copy, Check } from 'lucide-react';

export const KaTeXMath: React.FC<{ math: string; className?: string }> = ({ math, className = '' }) => {
  if (!math) return null;
  let expr = math.trim();
  if (expr.startsWith('$') && expr.endsWith('$') && expr.length > 2) {
    expr = expr.slice(1, -1);
  }
  try {
    const html = katex.renderToString(expr, {
      throwOnError: false,
      displayMode: false,
    });
    return <span className={`inline-block ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span className={className}>{math}</span>;
  }
};

export const KaTeXText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <KaTeXMath key={idx} math={part.slice(1, -1)} />;
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};

export interface BBTPoint {
  x: string;              // e.g. "-\\infty", "-1", "2", "+\\infty"
  yPrimeAt?: string;      // "0" | "||" | "" | string
  
  // For row y at this point (if normal continuous point):
  val?: string;           // e.g. "4", "-2", "34", "-\\infty"
  pos?: 'top' | 'bottom' | 'mid';
  
  // If vertical asymptote (tiệm cận đứng):
  isAsymptote?: boolean;  // true if double bar in row y
  leftVal?: string;       // limit from left, e.g. "+\\infty"
  leftPos?: 'top' | 'bottom' | 'mid';
  rightVal?: string;      // limit from right, e.g. "-\\infty"
  rightPos?: 'top' | 'bottom' | 'mid';
}

export interface BBTInterval {
  sign: string;           // "+" | "-" | ""
  arrow?: 'up' | 'down' | 'none'; // vector arrow in row y
}

export interface VariationTableData {
  type: 'bbt';
  title?: string;
  xLabel?: string;        // default "x"
  yPrimeLabel?: string;   // default "y'" or "f'(x)"
  yLabel?: string;        // default "y" or "f(x)"
  
  // Structured model:
  points?: BBTPoint[];
  intervals?: BBTInterval[];
  
  // Legacy fields (automatically adapted):
  xValues?: string[];
  yPrimeSigns?: string[];
  yValues?: Array<{
    val: string;
    pos?: 'top' | 'bottom' | 'mid';
    doubleBar?: boolean;
    leftVal?: string;
    rightVal?: string;
  }>;
  
  notes?: string;
  katexArray?: string;
}

export interface CoordinateGraphData {
  type: 'graph';
  title?: string;
  graphKind: 
    | 'parabola_min' 
    | 'parabola_max' 
    | 'cubic_standard' 
    | 'cubic_111'
    | 'cusp_fig12'
    | 'quartic_fig18'
    | 'fprime_roots'
    | 'fprime_roots_3'
    | 'abs_min'
    | 'quartic_w'
    | 'motion_line'
    | 'box_folding' 
    | 'cylinder' 
    | 'river_crossing' 
    | 'cable_line' 
    | 'rational_hyperbola';
  paramInfo?: string;
  notes?: string;
}

export type MathDiagram = VariationTableData | CoordinateGraphData;

interface MathGraphicProps {
  tikz?: string;
  diagram?: MathDiagram;
}

// Normalizer to convert any BBT data into structured points and intervals
function normalizeBBT(d: VariationTableData): {
  xLabel: string;
  yPrimeLabel: string;
  yLabel: string;
  points: BBTPoint[];
  intervals: BBTInterval[];
  tikzCode: string;
  katexArrayCode: string;
} {
  const xLabel = d.xLabel || 'x';
  const yPrimeLabel = d.yPrimeLabel || (d.title?.includes("f'(x)") || d.title?.includes("f(x)") ? "f'(x)" : "y'");
  const yLabel = d.yLabel || (d.title?.includes("f(x)") ? "f(x)" : "y");

  let points: BBTPoint[] = [];
  let intervals: BBTInterval[] = [];

  if (d.points && d.intervals && d.points.length > 0) {
    points = d.points;
    intervals = d.intervals;
  } else {
    // Adapter from legacy fields
    const xVals = d.xValues || [];
    const N = xVals.length;
    const numInts = Math.max(0, N - 1);
    const legacyYValues = d.yValues || [];
    const legacyYPrime = d.yPrimeSigns || [];

    for (let i = 0; i < N; i++) {
      const x = xVals[i];
      let yPrimeAt = '';
      if (i > 0 && i < N - 1) {
        yPrimeAt = legacyYPrime[2 * i - 1] || '0';
      }

      const yItem = legacyYValues[i];
      const hasDoubleBarSign = yPrimeAt.includes('||') || yPrimeAt.includes('d');
      // If doubleBar is explicitly true or has doubleBar sign with left/right values:
      const isAsymptote = !!(yItem?.doubleBar && hasDoubleBarSign && (yItem.leftVal || yItem.rightVal || yItem.val.includes('\\infty')));

      if (isAsymptote) {
        points.push({
          x,
          yPrimeAt: '||',
          isAsymptote: true,
          leftVal: yItem?.leftVal || (yItem?.val.includes('+') ? '+\\infty' : '-\\infty'),
          leftPos: yItem?.leftVal?.includes('-') ? 'bottom' : 'top',
          rightVal: yItem?.rightVal || (yItem?.val.includes('+') ? '-\\infty' : '+\\infty'),
          rightPos: yItem?.rightVal?.includes('+') ? 'top' : 'bottom'
        });
      } else {
        points.push({
          x,
          yPrimeAt: hasDoubleBarSign ? '||' : yPrimeAt,
          val: yItem?.val || '',
          pos: yItem?.pos || 'mid'
        });
      }
    }

    for (let i = 0; i < numInts; i++) {
      const sign = legacyYPrime[2 * i] || (i % 2 === 0 ? '+' : '-');
      let arrow: 'up' | 'down' = sign.includes('-') ? 'down' : 'up';
      intervals.push({ sign, arrow });
    }
  }

  // Generate fallback TikZ tkz-tab code if needed
  const tikzX = points.map(p => `$${p.x}$`).join(', ');
  const tikzLineParts: string[] = [''];
  intervals.forEach((it, i) => {
    tikzLineParts.push(it.sign.includes('+') ? '+' : '-');
    if (i < points.length - 2) {
      const pt = points[i + 1];
      tikzLineParts.push(pt.yPrimeAt === '||' ? 'd' : pt.yPrimeAt === '0' ? '0' : '0');
    }
  });
  tikzLineParts.push('');
  const tikzLine = `\\tkzTabLine{${tikzLineParts.join(',')}}`;

  // Tikz TabVar
  const tikzVarParts: string[] = [];
  points.forEach((pt, i) => {
    if (pt.isAsymptote) {
      const lSign = pt.leftPos === 'top' ? '+' : '-';
      const rSign = pt.rightPos === 'top' ? '+' : '-';
      tikzVarParts.push(`${lSign}D${rSign}/ $${pt.leftVal}$ / $${pt.rightVal}$`);
    } else {
      const s = pt.pos === 'top' ? '+' : pt.pos === 'bottom' ? '-' : '+';
      tikzVarParts.push(`${s}/ $${pt.val}$`);
    }
  });
  const tikzVar = `\\tkzTabVar{${tikzVarParts.join(', ')}}`;
  const tikzCode = `\\begin{tikzpicture}\n\\tkzTabInit[lgt=1.2,espcl=2.2]{$${xLabel}$ /0.8, $${yPrimeLabel}$ /0.8, $${yLabel}$ /2}{${tikzX}}\n${tikzLine}\n${tikzVar}\n\\end{tikzpicture}`;

  // Generate KaTeX array code
  const katexArrayCode = d.katexArray || tikzCode;

  return { xLabel, yPrimeLabel, yLabel, points, intervals, tikzCode, katexArrayCode };
}

export const MathGraphic: React.FC<MathGraphicProps> = ({ tikz, diagram }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'tikz' | 'katex'>('visual');
  const [copied, setCopied] = useState(false);

  // Compute normalized BBT if diagram is bbt
  const bbtNorm = diagram?.type === 'bbt' ? normalizeBBT(diagram) : null;
  const effectiveTikz = tikz || bbtNorm?.tikzCode;

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
    });
  };

  if (!diagram && !tikz) return null;

  return (
    <div className="my-3 p-3 md:p-4 bg-slate-900/95 rounded-2xl border-2 border-blue-500/40 shadow-xl text-white max-w-full overflow-hidden">
      {/* Header bar with Title & Tab buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-700/80">
        <div className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2 text-center sm:text-left">
          <span className="text-base">{diagram?.type === 'bbt' ? '📊' : '📈'}</span>
          <span>{diagram?.title || (diagram?.type === 'bbt' ? 'Bảng biến thiên chuẩn TikZ LaTeX' : 'Đồ thị hàm số chuẩn TikZ LaTeX')}</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Trực quan</span>
          </button>

          {effectiveTikz && (
            <button
              onClick={() => setActiveTab('tikz')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'tikz'
                  ? 'bg-yellow-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mã TikZ</span>
            </button>
          )}

          {diagram?.type === 'bbt' && (
            <button
              onClick={() => setActiveTab('katex')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'katex'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mã LaTeX</span>
            </button>
          )}
        </div>
      </div>

      {/* TIKZ CODE TAB */}
      {activeTab === 'tikz' && effectiveTikz && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-cyan-300">Gói lệnh LaTeX: \usepackage&#123;tikz,tkz-tab&#125;</span>
            <button
              onClick={() => handleCopy(effectiveTikz)}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-slate-200" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép TikZ'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
            <code>{effectiveTikz}</code>
          </pre>
          <p className="text-[11px] text-slate-400 mt-2 italic text-center">
            Mã nguồn TikZ tkz-tab chuẩn biên dịch 100% trên Overleaf / TeXmaker / TexStudio.
          </p>
        </div>
      )}

      {/* KATEX CODE TAB */}
      {activeTab === 'katex' && bbtNorm && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-emerald-300">Cú pháp LaTeX chuẩn Toán học Việt Nam</span>
            <button
              onClick={() => handleCopy(bbtNorm.katexArrayCode)}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-slate-200" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép LaTeX'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
            <code>{bbtNorm.katexArrayCode}</code>
          </pre>
        </div>
      )}

      {/* VISUAL TAB */}
      {activeTab === 'visual' && diagram && (
        <>
          {/* VARIATION TABLE (BẢNG BIẾN THIÊN CHUẨN TIKZ TKZ-TAB) */}
          {diagram.type === 'bbt' && bbtNorm && (() => {
            const { xLabel, yPrimeLabel, yLabel, points, intervals } = bbtNorm;
            const N = points.length;

            return (
              <div className="overflow-x-auto pb-1 -mx-1 px-1">
                <div className="min-w-[360px] sm:min-w-[420px] text-xs md:text-sm border-2 border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 font-sans shadow-2xl">
                  {/* Row 1: x */}
                  <div className="flex border-b-2 border-slate-700 bg-blue-950/70 items-center text-center">
                    {/* Header x */}
                    <div className="w-14 sm:w-16 min-w-[56px] py-2.5 border-r-2 border-slate-700 text-center font-bold text-amber-300 shrink-0">
                      <KaTeXMath math={xLabel} className="text-sm md:text-base font-bold" />
                    </div>
                    {/* Points & Intervals in x */}
                    <div className="flex-1 flex items-center">
                      {points.map((pt, idx) => (
                        <React.Fragment key={idx}>
                          {/* Point column */}
                          <div className={`${pt.isAsymptote ? 'w-24 min-w-[88px]' : 'w-14 sm:w-16 min-w-[52px]'} px-1 py-2 font-semibold text-yellow-100 flex justify-center items-center shrink-0`}>
                            <KaTeXMath math={pt.x} />
                          </div>
                          {/* Interval column */}
                          {idx < intervals.length && (
                            <div className="flex-1 min-w-[60px] text-center select-none text-transparent">
                              -
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: y' */}
                  <div className="flex border-b-2 border-slate-700 bg-slate-900/80 items-center text-center">
                    {/* Header y' */}
                    <div className="w-14 sm:w-16 min-w-[56px] py-2 border-r-2 border-slate-700 text-center font-bold text-amber-300 shrink-0">
                      <KaTeXMath math={yPrimeLabel} className="text-sm md:text-base font-bold" />
                    </div>
                    {/* Points & Intervals in y' */}
                    <div className="flex-1 flex items-center">
                      {points.map((pt, idx) => (
                        <React.Fragment key={idx}>
                          {/* Point column */}
                          <div className={`${pt.isAsymptote ? 'w-24 min-w-[88px]' : 'w-14 sm:w-16 min-w-[52px]'} px-1 py-1.5 flex justify-center items-center shrink-0`}>
                            {idx > 0 && idx < N - 1 ? (
                              pt.yPrimeAt === '||' ? (
                                <div className="flex gap-1 items-center justify-center h-6" title="Đạo hàm không xác định">
                                  <span className="w-0.5 h-5 bg-rose-400 block rounded-full"></span>
                                  <span className="w-0.5 h-5 bg-rose-400 block rounded-full"></span>
                                </div>
                              ) : (
                                <KaTeXMath math={pt.yPrimeAt || '0'} className="text-cyan-300 font-bold text-sm" />
                              )
                            ) : (
                              <span className="text-transparent">-</span>
                            )}
                          </div>
                          {/* Interval column with sign */}
                          {idx < intervals.length && (
                            <div className="flex-1 min-w-[60px] flex justify-center items-center select-none">
                              <span className={`font-black text-sm md:text-base px-1.5 py-0.5 rounded ${
                                intervals[idx].sign.includes('+') 
                                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]' 
                                  : intervals[idx].sign.includes('-') 
                                  ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.7)]' 
                                  : 'text-slate-300'
                              }`}>
                                <KaTeXMath math={intervals[idx].sign} />
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: y with true vector arrows and continuous/asymptote values */}
                  <div className="flex bg-slate-950/95 items-stretch min-h-[96px] sm:min-h-[104px]">
                    {/* Header y */}
                    <div className="w-14 sm:w-16 min-w-[56px] border-r-2 border-slate-700 flex items-center justify-center font-bold text-amber-300 shrink-0">
                      <KaTeXMath math={yLabel} className="text-sm md:text-base font-bold" />
                    </div>
                    {/* Points & Intervals in y */}
                    <div className="flex-1 flex items-stretch">
                      {points.map((pt, idx) => (
                        <React.Fragment key={idx}>
                          {/* Point column */}
                          <div className={`${pt.isAsymptote ? 'w-24 min-w-[88px]' : 'w-14 sm:w-16 min-w-[52px]'} px-1 py-1.5 flex justify-center items-center shrink-0 relative`}>
                            {pt.isAsymptote ? (
                              /* Double bar for vertical asymptote with left & right limits */
                              <div className="flex items-center justify-between w-full h-full py-1">
                                {/* Left limit */}
                                <div className={`flex flex-col ${pt.leftPos === 'bottom' ? 'justify-end pb-1' : 'justify-start pt-1'} h-full items-center`}>
                                  <span className="px-1 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-amber-300 font-extrabold text-xs shadow">
                                    <KaTeXMath math={pt.leftVal || ''} />
                                  </span>
                                </div>
                                {/* Continuous double bar line */}
                                <div className="flex gap-1 items-center justify-center h-full mx-1">
                                  <span className="w-0.5 h-20 bg-rose-400 block rounded-full shadow-[0_0_6px_rgba(251,113,133,0.6)]"></span>
                                  <span className="w-0.5 h-20 bg-rose-400 block rounded-full shadow-[0_0_6px_rgba(251,113,133,0.6)]"></span>
                                </div>
                                {/* Right limit */}
                                <div className={`flex flex-col ${pt.rightPos === 'top' ? 'justify-start pt-1' : 'justify-end pb-1'} h-full items-center`}>
                                  <span className="px-1 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-cyan-300 font-extrabold text-xs shadow">
                                    <KaTeXMath math={pt.rightVal || ''} />
                                  </span>
                                </div>
                              </div>
                            ) : (
                              /* Regular continuous point / extremum */
                              <div className={`flex flex-col items-center w-full h-full ${
                                pt.pos === 'top' ? 'justify-start pt-1' : pt.pos === 'bottom' ? 'justify-end pb-1' : 'justify-center'
                              }`}>
                                {pt.val && (
                                  <span className={`px-1.5 py-0.5 rounded-md bg-slate-900/90 border shadow-md ${
                                    pt.pos === 'top' 
                                      ? 'border-amber-500/50 text-amber-300 font-extrabold' 
                                      : pt.pos === 'bottom' 
                                      ? 'border-cyan-500/50 text-cyan-300 font-extrabold' 
                                      : 'border-slate-700 text-slate-100 font-bold'
                                  }`}>
                                    <KaTeXMath math={pt.val} className="text-xs sm:text-sm" />
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Interval column with Vector Arrow */}
                          {idx < intervals.length && (() => {
                            const arrowDir = intervals[idx].arrow || (intervals[idx].sign.includes('-') ? 'down' : 'up');
                            return (
                              <div className="flex-1 min-w-[60px] flex items-center justify-center px-1">
                                <svg viewBox="0 0 54 44" className="w-full max-w-[64px] h-12 overflow-visible">
                                  <defs>
                                    <marker
                                      id={`arr-${idx}-${arrowDir}`}
                                      viewBox="0 0 10 10"
                                      refX="7"
                                      refY="5"
                                      markerWidth="6"
                                      markerHeight="6"
                                      orient="auto-start-reverse"
                                    >
                                      <path
                                        d="M 1 2 L 8 5 L 1 8 z"
                                        fill={arrowDir === 'up' ? '#34d399' : '#fb7185'}
                                      />
                                    </marker>
                                  </defs>
                                  {arrowDir === 'up' ? (
                                    <line
                                      x1="4"
                                      y1="38"
                                      x2="48"
                                      y2="6"
                                      stroke="#34d399"
                                      strokeWidth="2.8"
                                      strokeLinecap="round"
                                      markerEnd={`url(#arr-${idx}-${arrowDir})`}
                                    />
                                  ) : (
                                    <line
                                      x1="4"
                                      y1="6"
                                      x2="48"
                                      y2="38"
                                      stroke="#fb7185"
                                      strokeWidth="2.8"
                                      strokeLinecap="round"
                                      markerEnd={`url(#arr-${idx}-${arrowDir})`}
                                    />
                                  )}
                                </svg>
                              </div>
                            );
                          })()}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* COORDINATE GRAPHS (ĐỒ THỊ HÀM SỐ) */}
          {diagram.type === 'graph' && (
            <div className="flex justify-center my-2">
              {diagram.graphKind === 'fprime_roots' && (
                <svg viewBox="0 0 340 180" className="w-full max-w-[320px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Grid lines */}
                  <line x1="20" y1="35" x2="320" y2="35" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="320" y2="100" stroke="#475569" strokeWidth="1.5" />
                  <line x1="20" y1="150" x2="320" y2="150" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="45" y1="15" x2="45" y2="165" stroke="#475569" strokeWidth="1.5" />

                  {/* Axes Arrows */}
                  <polygon points="320,97 330,100 320,103" fill="#94a3b8" />
                  <polygon points="42,15 45,5 48,15" fill="#94a3b8" />
                  <text x="325" y="115" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">x</text>
                  <text x="30" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">y</text>
                  <text x="34" y="114" fill="#94a3b8" fontSize="11">O</text>

                  {/* f'(x) curve cutting x-axis at 2, 4, 6 (Hình 1.13 SGK KNTT trang 14) */}
                  <path 
                    d="M45,145 Q80,25 115,100 Q150,155 185,100 Q220,30 255,100 Q275,135 305,35" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="2.8" 
                  />

                  {/* Roots on Ox */}
                  <circle cx="115" cy="100" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                  <text x="115" y="117" fill="#facc15" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                  <circle cx="185" cy="100" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                  <text x="185" y="117" fill="#facc15" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                  <circle cx="255" cy="100" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                  <text x="255" y="117" fill="#facc15" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>

                  {/* Sign Badges */}
                  <rect x="70" y="50" width="24" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="82" y="63" fill="#34d399" fontSize="11" fontWeight="black" textAnchor="middle">(+)</text>
                  <rect x="138" y="118" width="24" height="18" rx="4" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                  <text x="150" y="131" fill="#fb7185" fontSize="11" fontWeight="black" textAnchor="middle">(-)</text>
                  <rect x="208" y="50" width="24" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="220" y="63" fill="#34d399" fontSize="11" fontWeight="black" textAnchor="middle">(+)</text>

                  {/* Title text inside */}
                  <text x="150" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">y = f'(x)</text>
                </svg>
              )}

              {diagram.graphKind === 'fprime_roots_3' && (
                <svg viewBox="0 0 340 180" className="w-full max-w-[320px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Axes */}
                  <line x1="20" y1="100" x2="320" y2="100" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="15" x2="120" y2="165" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="320,97 330,100 320,103" fill="#94a3b8" />
                  <polygon points="117,15 120,5 123,15" fill="#94a3b8" />
                  <text x="325" y="115" fill="#94a3b8" fontSize="12" fontStyle="italic">x</text>
                  <text x="105" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic">y</text>
                  <text x="108" y="114" fill="#94a3b8" fontSize="11">O</text>

                  {/* f'(x) curve cutting x-axis at -1, 1, 4 */}
                  <path 
                    d="M40,150 Q60,30 85,100 Q115,160 155,100 Q195,40 235,100 Q265,150 295,40" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="2.8" 
                  />

                  {/* Roots on Ox: -1, 1, 4 */}
                  <circle cx="85" cy="100" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                  <text x="85" y="117" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="bold">-1</text>
                  <circle cx="155" cy="100" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                  <text x="155" y="117" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="bold">1</text>
                  <circle cx="235" cy="100" r="4" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                  <text x="235" y="117" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="bold">4</text>

                  {/* Title */}
                  <text x="160" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">y = f'(x)</text>
                </svg>
              )}

              {diagram.graphKind === 'abs_min' && (
                <svg viewBox="0 0 300 180" className="w-full max-w-[280px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Grid */}
                  <line x1="20" y1="135" x2="280" y2="135" stroke="#475569" strokeWidth="1.5" />
                  <line x1="150" y1="165" x2="150" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="280,132 290,135 280,138" fill="#94a3b8" />
                  <polygon points="147,15 150,5 153,15" fill="#94a3b8" />
                  <text x="282" y="150" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">x</text>
                  <text x="135" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">y</text>
                  <text x="136" y="148" fill="#94a3b8" fontSize="11">O</text>

                  {/* V-shape y = |x| */}
                  <path d="M40,25 L150,135 L260,25" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="150" cy="135" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="150" y="120" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="black">Cực tiểu (0; 0)</text>

                  {/* Label */}
                  <text x="215" y="45" fill="#38bdf8" fontSize="12" fontWeight="bold">y = |x|</text>
                  <text x="65" y="90" fill="#fb7185" fontSize="10" fontWeight="bold">Nghịch biến</text>
                  <text x="185" y="90" fill="#34d399" fontSize="10" fontWeight="bold">Đồng biến</text>
                </svg>
              )}

              {diagram.graphKind === 'cubic_standard' && (
                <svg viewBox="0 0 320 180" className="w-full max-w-[300px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Axes */}
                  <line x1="20" y1="90" x2="300" y2="90" stroke="#475569" strokeWidth="1.5" />
                  <line x1="160" y1="165" x2="160" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="300,87 310,90 300,93" fill="#94a3b8" />
                  <polygon points="157,15 160,5 163,15" fill="#94a3b8" />
                  <text x="302" y="105" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">x</text>
                  <text x="145" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">y</text>
                  <text x="146" y="104" fill="#94a3b8" fontSize="11">O</text>

                  {/* Cubic curve */}
                  <path d="M40,150 C100,20 120,30 160,90 C200,150 220,160 280,30" fill="none" stroke="#38bdf8" strokeWidth="2.8" />
                  {/* Extrema */}
                  <circle cx="110" cy="45" r="4.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx="210" cy="135" r="4.5" fill="#34d399" stroke="#ffffff" strokeWidth="1.2" />
                  <text x="100" y="32" fill="#facc15" fontSize="11" fontWeight="bold">Cực đại</text>
                  <text x="215" y="152" fill="#34d399" fontSize="11" fontWeight="bold">Cực tiểu</text>
                </svg>
              )}

              {diagram.graphKind === 'cubic_111' && (
                <svg viewBox="0 0 320 180" className="w-full max-w-[300px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Axes */}
                  <line x1="20" y1="90" x2="300" y2="90" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="165" x2="120" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="300,87 310,90 300,93" fill="#94a3b8" />
                  <polygon points="117,15 120,5 123,15" fill="#94a3b8" />
                  <text x="302" y="105" fill="#94a3b8" fontSize="12" fontStyle="italic">x</text>
                  <text x="105" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic">y</text>
                  <text x="106" y="104" fill="#94a3b8" fontSize="11">O</text>

                  {/* Curve y = x^3 - 1.5x^2: local max at (0,0), local min at (1, -0.5), root at 1.5 */}
                  <path d="M40,165 C85,60 100,90 120,90 C140,90 160,135 180,135 C200,135 220,110 260,25" fill="none" stroke="#38bdf8" strokeWidth="2.8" />
                  <circle cx="120" cy="90" r="4" fill="#facc15" />
                  <circle cx="180" cy="135" r="4" fill="#34d399" />
                  <circle cx="210" cy="90" r="3.5" fill="#94a3b8" />
                  <text x="180" y="152" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">CT (1; -1/2)</text>
                  <text x="210" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle">3/2</text>
                  <text x="180" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold">y = x³ - 3/2 x²</text>
                </svg>
              )}

              {diagram.graphKind === 'quartic_fig18' && (
                <svg viewBox="0 0 320 180" className="w-full max-w-[300px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Axes */}
                  <line x1="20" y1="140" x2="300" y2="140" stroke="#475569" strokeWidth="1.5" />
                  <line x1="160" y1="165" x2="160" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="300,137 310,140 300,143" fill="#94a3b8" />
                  <polygon points="157,15 160,5 163,15" fill="#94a3b8" />
                  <text x="302" y="152" fill="#94a3b8" fontSize="12" fontStyle="italic">x</text>
                  <text x="145" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic">y</text>
                  <text x="146" y="152" fill="#94a3b8" fontSize="11">O</text>

                  {/* Curve Hình 1.8 SGK trang 10: Local mins at (-1, 2) and (1, 2); local max at (0, 3) */}
                  <path d="M50,15 C80,120 100,100 110,100 C125,100 145,60 160,60 C175,60 195,100 210,100 C220,100 240,120 270,15" fill="none" stroke="#38bdf8" strokeWidth="2.8" />
                  <circle cx="110" cy="100" r="4.5" fill="#34d399" />
                  <circle cx="160" cy="60" r="4.5" fill="#facc15" />
                  <circle cx="210" cy="100" r="4.5" fill="#34d399" />
                  <line x1="110" y1="100" x2="110" y2="140" stroke="#94a3b8" strokeDasharray="2 2" />
                  <line x1="210" y1="100" x2="210" y2="140" stroke="#94a3b8" strokeDasharray="2 2" />
                  <text x="110" y="153" fill="#94a3b8" fontSize="10" textAnchor="middle">-1</text>
                  <text x="210" y="153" fill="#94a3b8" fontSize="10" textAnchor="middle">1</text>
                  <text x="148" y="65" fill="#facc15" fontSize="11" textAnchor="end" fontWeight="bold">3</text>
                  <text x="148" y="105" fill="#34d399" fontSize="11" textAnchor="end" fontWeight="bold">2</text>
                  <text x="160" y="45" fill="#facc15" fontSize="10" textAnchor="middle" fontWeight="bold">CĐ (0; 3)</text>
                  <text x="110" y="88" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">CT (-1; 2)</text>
                  <text x="210" y="88" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">CT (1; 2)</text>
                </svg>
              )}

              {diagram.graphKind === 'cusp_fig12' && (
                <svg viewBox="0 0 320 180" className="w-full max-w-[300px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Axes */}
                  <line x1="20" y1="135" x2="300" y2="135" stroke="#475569" strokeWidth="1.5" />
                  <line x1="160" y1="165" x2="160" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="300,132 310,135 300,138" fill="#94a3b8" />
                  <polygon points="157,15 160,5 163,15" fill="#94a3b8" />
                  <text x="302" y="150" fill="#94a3b8" fontSize="12" fontStyle="italic">x</text>
                  <text x="145" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic">y</text>
                  <text x="146" y="148" fill="#94a3b8" fontSize="11">O</text>

                  {/* Curve y = ((x^2-4)^2)^(1/3): two cusps touching Ox at x = -2 and 2 */}
                  <path d="M45,25 Q80,110 100,135 Q130,55 160,55 Q190,55 220,135 Q240,110 275,25" fill="none" stroke="#38bdf8" strokeWidth="2.8" />
                  <circle cx="100" cy="135" r="4.5" fill="#34d399" />
                  <circle cx="220" cy="135" r="4.5" fill="#34d399" />
                  <circle cx="160" cy="55" r="4" fill="#facc15" />
                  <text x="100" y="152" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">-2</text>
                  <text x="220" y="152" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">2</text>
                  <text x="100" y="120" fill="#34d399" fontSize="10" textAnchor="middle">Cực tiểu</text>
                  <text x="220" y="120" fill="#34d399" fontSize="10" textAnchor="middle">Cực tiểu</text>
                  <text x="160" y="42" fill="#facc15" fontSize="10" textAnchor="middle">Cực đại</text>
                  <text x="160" y="172" fill="#fbbf24" fontSize="10" textAnchor="middle" fontStyle="italic">Hình 1.12 SGK trang 13</text>
                </svg>
              )}

              {diagram.graphKind === 'quartic_w' && (
                <svg viewBox="0 0 320 180" className="w-full max-w-[300px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  {/* Axes */}
                  <line x1="20" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="1.5" />
                  <line x1="160" y1="165" x2="160" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="300,97 310,100 300,103" fill="#94a3b8" />
                  <polygon points="157,15 160,5 163,15" fill="#94a3b8" />
                  <text x="302" y="115" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">x</text>
                  <text x="145" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic" fontWeight="bold">y</text>

                  {/* W curve */}
                  <path d="M45,30 C75,155 105,155 160,65 C215,155 245,155 275,30" fill="none" stroke="#38bdf8" strokeWidth="2.8" />
                  <circle cx="90" cy="142" r="4.5" fill="#34d399" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx="160" cy="65" r="4.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx="230" cy="142" r="4.5" fill="#34d399" stroke="#ffffff" strokeWidth="1.2" />
                  <text x="160" y="52" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="bold">Cực đại (0; c)</text>
                  <text x="90" y="160" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">Cực tiểu 1</text>
                  <text x="230" y="160" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">Cực tiểu 2</text>
                </svg>
              )}

              {diagram.graphKind === 'motion_line' && (
                <svg viewBox="0 0 340 140" className="w-full max-w-[320px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  <defs>
                    <marker id="motionArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 1 2 L 8 5 L 1 8 z" fill="#38bdf8" />
                    </marker>
                    <marker id="velArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 1 2 L 8 5 L 1 8 z" fill="#34d399" />
                    </marker>
                  </defs>
                  {/* Number line */}
                  <line x1="25" y1="70" x2="310" y2="70" stroke="#94a3b8" strokeWidth="2.5" markerEnd="url(#motionArrow)" />
                  <circle cx="65" cy="70" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="65" y="93" fill="#facc15" fontSize="12" textAnchor="middle" fontWeight="bold">O</text>
                  <circle cx="180" cy="70" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="180" y="93" fill="#38bdf8" fontSize="12" textAnchor="middle" fontWeight="bold">s(t)</text>
                  {/* Velocity vector */}
                  <line x1="185" y1="48" x2="245" y2="48" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#velArrow)" />
                  <text x="215" y="40" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">v(t) = s'(t) &gt; 0</text>
                  <text x="170" y="122" fill="#fbbf24" fontSize="11" textAnchor="middle" fontStyle="italic">Hình 1.1: Trục toạ độ chuyển động chất điểm</text>
                </svg>
              )}

              {diagram.graphKind === 'parabola_max' && (
                <svg viewBox="0 0 300 170" className="w-full max-w-[280px] h-auto bg-slate-950/90 rounded-2xl p-2.5 border-2 border-slate-800 shadow-inner">
                  <line x1="20" y1="135" x2="280" y2="135" stroke="#475569" strokeWidth="1.5" />
                  <line x1="55" y1="155" x2="55" y2="15" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="280,132 290,135 280,138" fill="#94a3b8" />
                  <polygon points="52,15 55,5 58,15" fill="#94a3b8" />
                  <text x="282" y="150" fill="#94a3b8" fontSize="12" fontStyle="italic">t</text>
                  <text x="40" y="18" fill="#94a3b8" fontSize="12" fontStyle="italic">f'(t)</text>
                  {/* Parabola curve */}
                  <path d="M55,130 Q145,15 235,130" fill="none" stroke="#38bdf8" strokeWidth="2.8" />
                  <circle cx="145" cy="42" r="4.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.2" />
                  <line x1="145" y1="42" x2="145" y2="135" stroke="#facc15" strokeDasharray="3 3" strokeWidth="1.2" />
                  <text x="145" y="150" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="bold">ln 5 ≈ 1,61</text>
                  <text x="145" y="32" fill="#facc15" fontSize="11" textAnchor="middle" fontWeight="bold">Cực đại</text>
                </svg>
              )}
            </div>
          )}

          {/* Notes display */}
          {diagram.notes && (
            <div className="text-[12px] text-blue-300 mt-2 text-center italic bg-blue-950/40 py-1.5 px-3 rounded-xl border border-blue-900/40">
              <KaTeXText text={diagram.notes} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
