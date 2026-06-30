
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Bookmark, Award, Star, Feather } from 'lucide-react';

/* ============================================================
   SOUND ENGINE
   ============================================================ */
function usePageFlipSound() {
  const ctxRef = useRef(null);
  const init = useCallback(() => {
    if (ctxRef.current) return;
    try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  }, []);
  const play = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const bufSize = ctx.sampleRate * 0.28;
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const t = i / ctx.sampleRate;
        const env = Math.pow(Math.sin(Math.PI * t / 0.28), 0.4) * Math.exp(-t * 7);
        const rustle = Math.sin(t * 1200) * 0.012 + Math.sin(t * 2800) * 0.008;
        data[i] = ((Math.random() * 2 - 1) * 0.045 + rustle) * env;
      }
      const noise = ctx.createBufferSource(); noise.buffer = buffer;
      const bp1 = ctx.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 280; bp1.Q.value = 3.5;
      const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 1100; bp2.Q.value = 2;
      const gain = ctx.createGain(); gain.gain.setValueAtTime(0.09, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      noise.connect(bp1); bp1.connect(bp2); bp2.connect(gain); gain.connect(ctx.destination);
      noise.start(now); noise.stop(now + 0.28);
    } catch (_) {}
  }, []);
  return { play, init };
}

/* ============================================================
   GLOBAL CSS
   ============================================================ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=IM+Fell+English:ital@0;1&display=swap');
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes twinkle { 0%,100%{opacity:.04;transform:scale(1)} 50%{opacity:.85;transform:scale(1.9)} }
  @keyframes titlePulse { 0%,100%{filter:drop-shadow(0 0 20px rgba(255,215,0,.7)) drop-shadow(0 0 40px rgba(255,215,0,.35))} 50%{filter:drop-shadow(0 0 32px rgba(255,215,0,1)) drop-shadow(0 0 55px rgba(255,215,0,.55))} }
  @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes contentIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ribbonWave { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(4deg)} }
  @keyframes dustFloat { 
    0%{opacity:0;transform:translate(0,0) scale(0) rotate(0deg)} 
    12%{opacity:1} 
    100%{opacity:0;transform:translate(var(--ddx),var(--ddy)) scale(.03) rotate(var(--ddr))} 
  }
  @keyframes glowPulse { 0%,100%{opacity:.55} 50%{opacity:1} }
`;

/* ============================================================
   DUST PARTICLES
   ============================================================ */
const DUST = Array.from({ length: 22 }, (_, i) => ({
  id: i, x: 5 + Math.random() * 90, y: 15 + Math.random() * 70,
  s: 0.5 + Math.random() * 2.8, dx: (Math.random() - 0.5) * 100,
  dy: -18 - Math.random() * 50, dr: (Math.random() - 0.5) * 520,
  dur: 0.5 + Math.random() * 0.8, delay: Math.random() * 0.09,
  gold: Math.random() > 0.3,
}));

function DustParticles({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40, overflow: 'hidden' }}>
      {DUST.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s * 0.42, borderRadius: '50%',
          background: p.gold ? 'rgba(255,215,0,.9)' : 'rgba(200,155,85,.55)',
          boxShadow: p.gold ? '0 0 5px rgba(255,215,0,.7)' : 'none',
          '--ddx': `${p.dx}px`, '--ddy': `${p.dy}px`, '--ddr': `${p.dr}deg`,
          animation: `dustFloat ${p.dur}s ease-out ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}

/* ============================================================
   STARS
   ============================================================ */
const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  s: 0.2 + Math.random() * 1.1, dur: 2 + Math.random() * 4.5, d: Math.random() * 7,
}));

function Stars() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {STARS.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.s * 2, height: s.s * 2, borderRadius: '50%',
          background: 'rgba(255,215,0,.75)',
          boxShadow: `0 0 ${s.s * 7}px rgba(255,215,0,.6)`,
          animation: `twinkle ${s.dur}s ease-in-out ${s.d}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ============================================================
   PAPER TEXTURE
   ============================================================ */
function PaperTexture({ style }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    for (let i = 0; i < 3800; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const alpha = Math.random() * 0.04;
      const size = Math.random() * 1.8;
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,215,0' : '180,130,60'},${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    }
  }, []);
  return <canvas ref={canvasRef} width={320} height={460} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55, borderRadius: 'inherit', mixBlendMode: 'overlay', ...style }} />;
}

/* ============================================================
   GENRE NAMES
   ============================================================ */
const GENRE_NAMES = {
  phoenix: 'Phoenix Rise', dramatic: 'Dramatic', thriller: 'Thriller',
  fairyTale: 'Fairy Tale', noir: 'Noir', hopeful: 'Hopeful',
};

/* ============================================================
   PROGRESS BAR
   ============================================================ */
function ProgressBar({ current, total, readingMinutes }) {
  const pct = total > 1 ? (current / (total - 1)) * 100 : 100;
  const minsLeft = Math.max(0, readingMinutes * (1 - pct / 100));
  const timeLabel = minsLeft < 1 ? '< 1 min left' : `~${Math.ceil(minsLeft)} min left`;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', height: 3, background: 'rgba(255,215,0,.04)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: 'linear-gradient(to right,#7A5200,#C8960A,#FFD700)', transition: 'width .5s ease-out', boxShadow: '0 0 10px rgba(255,215,0,.55)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)', animation: 'shimmer 5s infinite' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: 8, color: 'rgba(255,215,0,.55)', fontFamily: 'Georgia,serif', letterSpacing: '.04em' }}>Page {current + 1} of {total}</span>
        <span style={{ fontSize: 8, color: 'rgba(255,215,0,.55)', fontFamily: 'Georgia,serif', letterSpacing: '.04em' }}>{timeLabel} · {Math.round(pct)}%</span>
      </div>
    </div>
  );
}

/* ============================================================
   SCORE RING
   ============================================================ */
function ScoreRing({ value, max = 10, size = 96 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const [dashPct, setDashPct] = useState(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf, start = null;
    const dur = 1400, ease = t => 1 - Math.pow(1 - t, 3);
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1), ep = ease(p);
      setDashPct(ep * (value / max)); setDisplay(ep * value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, max]);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs><linearGradient id="gRing" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7A5200" /><stop offset="50%" stopColor="#FFD700" /><stop offset="100%" stopColor="#F4D03F" /></linearGradient></defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,215,0,.04)" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#gRing)" strokeWidth={5}
          strokeDasharray={`${dashPct * circ} ${circ}`} strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,.75))' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 'bold', lineHeight: 1, background: 'linear-gradient(180deg,#FFD700,#D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(255,215,0,.6))' }}>{display.toFixed(1)}</span>
        <span style={{ fontSize: 7, color: 'rgba(255,215,0,.18)', letterSpacing: '.2em', marginTop: 1 }}>/10</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, delay }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const tid = setTimeout(() => {
      let raf, start = null;
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 650, 1);
        setW(ease(p) * value * 10);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, delay);
    return () => clearTimeout(tid);
  }, [value, delay]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 8, color: 'rgba(255,215,0,.8)', textTransform: 'uppercase', letterSpacing: '.08em', width: 48, textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${w}%`, borderRadius: 999, background: 'linear-gradient(to right,#8B5E00,#E8C040,#FFD700)', boxShadow: w > 1 ? '0 0 6px rgba(255,215,0,.55)' : 'none' }} />
      </div>
      <span style={{ fontSize: 9, color: '#FFD060', width: 13, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function ElegantDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '3px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,rgba(255,215,0,.22))' }} />
      <div style={{ width: 3, height: 3, background: '#FFD700', borderRadius: '50%', boxShadow: '0 0 5px rgba(255,215,0,.6)' }} />
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,transparent,rgba(255,215,0,.22))' }} />
    </div>
  );
}

/* ============================================================
   PAGE CONTENT
   ============================================================ */
function PageContent({ page, pageIndex, totalPages, genre, contentKey }) {
  if (!page) return null;
  const serif = '"Cormorant Garamond","IM Fell English","Palatino Linotype",Palatino,serif';
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Stars />
      <span style={{ position: 'absolute', bottom: 9, left: 14, fontSize: 8, color: 'rgba(255,215,0,.55)', fontFamily: serif }}>{pageIndex + 1}</span>
      <span style={{ position: 'absolute', bottom: 9, right: 14, fontSize: 8, color: 'rgba(255,215,0,.55)', fontFamily: serif }}>{totalPages}</span>

      {page.type === 'title' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '28px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            <Feather size={9} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px rgba(255,215,0,.8))' }} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', fontFamily: serif, color: '#FFE87A', textShadow: '0 0 10px rgba(255,215,0,.9)' }}>A Tale Begins</span>
            <Feather size={9} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px rgba(255,215,0,.8))', transform: 'scaleX(-1)' }} />
          </div>
          <ElegantDivider />
          <h2 style={{
            fontFamily: serif, fontSize: 'clamp(14px,2.6vw,20px)', fontWeight: 600, lineHeight: 1.45,
            margin: '18px 0', letterSpacing: '.015em',
            color: '#FFF5A0',
            textShadow: '0 0 18px rgba(255,215,0,.9), 0 0 35px rgba(255,215,0,.5)',
            animation: 'titlePulse 3.5s ease-in-out infinite',
          }}>{page.content}</h2>
          <ElegantDivider />
          <div style={{ marginTop: 16, fontSize: 8, letterSpacing: '.3em', textTransform: 'uppercase', fontFamily: serif, color: '#FFE87A', textShadow: '0 0 10px rgba(255,215,0,.9)' }}>
            ✦ {GENRE_NAMES[genre] || 'Story'} ✦
          </div>
        </div>
      )}

      {page.type === 'content' && (
        <div key={contentKey} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 24px', animation: 'contentIn .3s ease-out both' }}>
          <div style={{ width: '100%' }}>
            <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(255,215,0,.35),transparent)', marginBottom: 10 }} />
            {page.content[0] && (
              <span style={{
                float: 'left', fontFamily: serif, fontSize: 42, lineHeight: .7,
                paddingRight: 6, paddingTop: 5,
                color: '#FFD700',
                filter: 'drop-shadow(0 0 12px rgba(255,215,0,.8))',
                fontWeight: 'bold', userSelect: 'none',
              }}>{page.content[0]}</span>
            )}
            <p style={{
              fontFamily: serif, fontSize: 'clamp(11px,1.9vw,13.5px)', lineHeight: 1.9,
              textAlign: 'justify', color: '#FFF0C0',
              textShadow: '0 0 8px rgba(255,230,100,.25)',
              margin: 0,
            }}>{page.content.slice(1)}</p>
            <div style={{ clear: 'both' }} />
          </div>
        </div>
      )}

      {page.type === 'critique' && (
        <div key={contentKey} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 18px', gap: 6, animation: 'contentIn .4s ease-out both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Award size={12} style={{ color: '#FFD700' }} />
            <span style={{ fontSize: 8, fontWeight: 700, color: '#FFD97A', letterSpacing: '.28em', textTransform: 'uppercase', fontFamily: '"Georgia",serif', textShadow: '0 0 8px rgba(255,215,0,.7)' }}>Quality Score</span>
          </div>
          <ScoreRing value={page.content?.average ?? 9.0} />
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const lit = i < Math.round(page.content?.average ?? 9);
              return <Star key={i} size={8} style={{ color: lit ? '#FFD700' : 'rgba(255,215,0,.15)', fill: lit ? '#FFD700' : 'none', filter: lit ? 'drop-shadow(0 0 3px rgba(255,215,0,.8))' : 'none', transition: `all .18s ${i * .035}s` }} />;
            })}
          </div>
          {page.content?.scores && (
            <div style={{ width: '100%', maxWidth: 168, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {Object.entries(page.content.scores).map(([key, val], idx) => (
                <ScoreBar key={key} label={key} value={val} delay={idx * 70} />
              ))}
            </div>
          )}
          {page.content?.feedback && (
            <p style={{ fontFamily: '"Cormorant Garamond","Palatino Linotype",serif', color: '#F0D080', fontSize: 10, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.65, maxWidth: 168, borderTop: '1px solid rgba(255,215,0,.2)', paddingTop: 8, margin: 0 }}>
              "{page.content.feedback}"
            </p>
          )}
          <div style={{ fontSize: 8, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(255,215,0,.45)', fontFamily: 'Georgia,serif' }}>― Fin ―</div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   NAV BUTTON
   ============================================================ */
function NavBtn({ onClick, disabled, children, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: '50%',
        background: hov && !disabled ? 'rgba(255,215,0,.05)' : 'transparent',
        border: `1px solid ${hov && !disabled ? 'rgba(255,215,0,.35)' : 'rgba(255,215,0,.06)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? 'rgba(255,215,0,.04)' : hov ? '#FFD700' : 'rgba(255,215,0,.26)',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .14s ease',
        boxShadow: hov && !disabled ? '0 0 8px rgba(255,215,0,.1)' : 'none',
        transform: hov && !disabled ? 'scale(1.06)' : 'scale(1)',
      }}>
      {children}
    </button>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function StoryBook3D({ storyData }) {
  const { story, critique, genre } = storyData ?? {};

  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState('forward');

  // ⚡ fromPage = الصفحة اللي بتتقلب منها, toPage = الصفحة اللي بنروح ليها
  const [fromPage, setFromPage] = useState(0);
  const [toPage, setToPage] = useState(0);

  const [showDust, setShowDust] = useState(false);
  const [entered, setEntered] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  // flipProgress: 0 → 1
  const [flipProgress, setFlipProgress] = useState(0);

  const flipAnimRef = useRef(null);
  const sound = usePageFlipSound();

  useEffect(() => { const t = setTimeout(() => setEntered(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => { return () => { if (flipAnimRef.current) cancelAnimationFrame(flipAnimRef.current); }; }, []);

  const { pages, wordCount } = useMemo(() => {
    const lines = story?.trim().split('\n') ?? [];
    const title = lines[0]?.replace(/^#+\s*/, '') || 'A Story Rises';
    const body = lines.slice(1).join('\n').trim();
    const paras = body.split('\n\n').filter(p => p.trim());
    const ps = [
      { type: 'title', content: title },
      ...paras.map(p => ({ type: 'content', content: p })),
      { type: 'critique', content: critique },
    ].filter(pg => pg.content);
    const wc = (story ?? '').split(/\s+/).filter(Boolean).length;
    return { pages: ps, wordCount: wc };
  }, [story, critique]);

  const totalPages = pages.length;
  const readingMins = wordCount / 238;

  /*
   * كيف بيشتغل التقليب:
   * ─────────────────────────────────────────────────────────────────
   * الـ flipping page بتدور حول محورها الأيسر من 0 → -180deg (للأمام)
   * أو من -180 → 0 (للخلف).
   *
   * الـ FRONT FACE تعرض fromPage (الصفحة اللي بنمشي منها).
   * الـ BACK FACE  تعرض toPage  (الصفحة اللي بنروح ليها).
   *
   * الصفحة الـ static (خلفها) بتعرض:
   *   • لما بنروح للأمام: toPage   (هي ما بتظهرش تحت الصفحة المتقلبة غير لما الـ flip يعدي 90°)
   *   • لما بنرجع للخلف: fromPage  (نفس المنطق)
   *
   * عشان كده بنحدد staticBehind ديناميكيًا.
   * ─────────────────────────────────────────────────────────────────
   */
  const flipTo = useCallback((target, dir) => {
    if (isFlipping) return;

    sound.play();
    try { navigator.vibrate?.(4); } catch (_) {}

    setShowDust(true);
    setTimeout(() => setShowDust(false), 800);

    const src = currentPage;
    setFromPage(src);
    setToPage(target);
    setFlipDir(dir);
    setFlipProgress(0);
    setIsFlipping(true);

    if (flipAnimRef.current) cancelAnimationFrame(flipAnimRef.current);

    const startTime = performance.now();
    const duration = 700;

    const animate = (now) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // ease-in-out cubic
      const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      setFlipProgress(eased);

      if (raw < 1) {
        flipAnimRef.current = requestAnimationFrame(animate);
      } else {
        // انتهى التقليب → حدّث الصفحة الحالية
        setCurrentPage(target);
        setContentKey(k => k + 1);
        setIsFlipping(false);
        setFlipProgress(0);
      }
    };

    flipAnimRef.current = requestAnimationFrame(animate);
  }, [isFlipping, currentPage, sound]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) flipTo(currentPage + 1, 'forward');
  }, [currentPage, totalPages, isFlipping, flipTo]);

  const prevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) flipTo(currentPage - 1, 'backward');
  }, [currentPage, isFlipping, flipTo]);

  useEffect(() => {
    const h = e => { if (e.key === 'ArrowRight') nextPage(); if (e.key === 'ArrowLeft') prevPage(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [nextPage, prevPage]);

  const touchRef = useRef(null);

  /* ─── حساب زاوية التقليب ─── */
  // forward:  0° → -180°  (الصفحة بتتقلب من اليمين لليسار)
  // backward: -180° → 0°  (الصفحة بترجع من اليسار لليمين)
  const rotateY = isFlipping
    ? (flipDir === 'forward' ? -flipProgress * 180 : -(1 - flipProgress) * 180)
    : 0;

  // شدة الظل: ذروتها في منتصف التقليب (عند 90°)
  const shadowIntensity = isFlipping ? Math.sin(flipProgress * Math.PI) : 0;
  const shadowOpacity = shadowIntensity * 0.65;
  const shadowSpread = 15 + shadowIntensity * 35;
  const shadowOffset = shadowIntensity * 20;
  const borderRadiusRight = 5 + shadowIntensity * 18;

  /*
   * الصفحة الثابتة في الخلف:
   * - لما بنروح للأمام: خلف الـ flip هي toPage  → نعرضها لما الـ flip يعدي نص المسار
   * - لما بنرجع:       خلف الـ flip هي fromPage → نعرضها دايمًا
   */
  const staticPageIdx = isFlipping
    ? (flipDir === 'forward' ? toPage : fromPage)
    : currentPage;

  const pgCommon = { totalPages, genre, contentKey };

  const pageType = pages[currentPage]?.type;
  const glowColor = pageType === 'critique' ? 'rgba(255,215,0,.14)' : pageType === 'title' ? 'rgba(255,215,0,.1)' : 'rgba(170,130,20,.07)';

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(22px) scale(0.97)',
        transition: 'opacity .7s ease-out, transform .7s ease-out',
      }}
      onClick={sound.init}
      onTouchStart={e => { touchRef.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchRef.current === null) return;
        const dx = e.changedTouches[0].clientX - touchRef.current;
        if (Math.abs(dx) > 30) dx < 0 ? nextPage() : prevPage();
        touchRef.current = null;
      }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* Genre badge */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '3.5px 11px',
          borderRadius: 999, border: '1px solid rgba(255,215,0,.12)',
          background: 'rgba(255,215,0,.02)', backdropFilter: 'blur(4px)',
          animation: 'badgeFloat 4s ease-in-out infinite',
        }}>
          <Sparkles size={8} style={{ color: '#FFD700' }} />
          <span style={{ fontSize: 6.5, fontWeight: 700, color: '#FFD700', letterSpacing: '.28em', textTransform: 'uppercase', fontFamily: 'Georgia,serif' }}>
            {GENRE_NAMES[genre] || 'Story'}
          </span>
          <Sparkles size={8} style={{ color: '#FFD700', transform: 'scaleX(-1)' }} />
        </div>
      </div>

      <ProgressBar current={currentPage} total={totalPages} readingMinutes={readingMins} />

      {/* Book */}
      <div style={{ position: 'relative' }}>

        <div style={{
          position: 'absolute', bottom: -14, left: '8%', right: '8%', height: 28,
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 65%)`,
          filter: 'blur(10px)', borderRadius: '50%', transition: 'background .5s ease',
          animation: 'glowPulse 3s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute', inset: '-10px -6px', borderRadius: 12,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,215,0,.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Book shell */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(145deg,rgba(55,26,6,.6),rgba(34,14,1,.55),rgba(50,22,4,.6))',
          borderRadius: 8,
          border: '1px solid rgba(255,215,0,.16)',
          boxShadow: [
            '0 18px 50px rgba(0,0,0,.52)',
            '0 4px 12px rgba(0,0,0,.38)',
            '0 0 0 1px rgba(255,215,0,.016)',
            `0 0 28px ${glowColor}`,
            'inset 0 1px 0 rgba(255,215,0,.055)',
          ].join(','),
        }}>
          {/* Spine */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 14,
            background: 'linear-gradient(to right,rgba(18,6,0,.95),rgba(55,22,4,.45),rgba(55,22,4,.08),transparent)',
            zIndex: 20, borderRadius: '8px 0 0 8px',
            borderRight: '1px solid rgba(255,215,0,.03)',
          }} />
          <div style={{
            position: 'absolute', left: 2.5, top: '12%', bottom: '12%', width: 1,
            background: 'linear-gradient(to bottom,transparent,rgba(255,215,0,.4),rgba(255,215,0,.2),transparent)',
            borderRadius: 999, zIndex: 21,
          }} />
          {[25, 50, 75].map(pct => (
            <div key={pct} style={{ position: 'absolute', left: 4, right: '92%', top: `${pct}%`, height: 1, background: 'rgba(255,215,0,.06)', zIndex: 21 }} />
          ))}

          {/* Page stack */}
          <div style={{
            position: 'absolute', right: 1, top: 4, bottom: 4, width: 3,
            background: 'repeating-linear-gradient(to bottom,rgba(255,215,0,.022) 0,rgba(255,215,0,.022) 1.5px,rgba(0,0,0,.08) 1.5px,rgba(0,0,0,.08) 3px)',
            borderRadius: '0 6px 6px 0', zIndex: 20,
          }} />

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right,rgba(255,215,0,.28),rgba(244,208,63,.12),rgba(255,215,0,.28))', zIndex: 20, borderRadius: '8px 8px 0 0' }} />

          {/* Bookmark */}
          <div style={{
            position: 'absolute', top: -4, right: 24, width: 15, height: 45,
            background: 'linear-gradient(175deg,#FFD700,#6E4800)',
            borderRadius: '0 0 4px 4px', boxShadow: '2px 2px 8px rgba(0,0,0,.6)', zIndex: 30,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 2,
            pointerEvents: 'none', animation: 'ribbonWave 2.8s ease-in-out infinite',
          }}>
            <Bookmark size={7} style={{ color: 'rgba(0,0,0,.5)' }} />
          </div>

          {/* Corner curl */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, zIndex: 22, pointerEvents: 'none',
            width: 28, height: 28,
            background: 'linear-gradient(135deg,transparent 55%,rgba(0,0,0,.18) 100%)',
            borderRadius: '0 0 7px 0',
          }} />

          {/* ═══════════════════════════════════════════
              PERSPECTIVE STAGE
              ═══════════════════════════════════════════ */}
          <div style={{
            position: 'relative',
            minHeight: 440,
            marginLeft: 14,
            perspective: '1200px',
            perspectiveOrigin: '30% 50%',
            overflow: 'hidden',
            borderRadius: '2px 6px 6px 2px',
          }}>
            <DustParticles active={showDust} />

            {/* ── LAYER 1: الصفحة اللي وراء (destination when forward, source when backward) ── */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(168deg,#130a01 0%,#0a0400 45%,#070200 100%)',
              overflow: 'hidden',
            }}>
              <PaperTexture />
              <PageContent page={pages[staticPageIdx]} pageIndex={staticPageIdx ?? 0} {...pgCommon} />
              {/* ظل الوسط (التلاقي مع العمود) */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 22,
                background: 'linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,.12),transparent)', pointerEvents: 'none' }} />
              {/* ظل من الصفحة المتقلبة فوقها */}
              {isFlipping && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: `linear-gradient(to ${flipDir === 'forward' ? 'right' : 'left'}, rgba(0,0,0,${shadowIntensity * 0.55}) 0%, transparent ${40 + shadowIntensity * 30}%)`,
                }} />
              )}
            </div>

            {/* ── LAYER 2: الصفحة المتقلبة (الوجه الأمامي — ما بنمشي منه) ── */}
            {isFlipping && (
              <>
                {/* الجزء الإيجابي من الصفحة — اللي لسه مش اتقلب */}
                {flipDir === 'forward' && flipProgress < 0.98 && (
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 5, overflow: 'hidden',
                    // نقطع من اليمين حسب التقدم — بتضيق من اليمين لليسار
                    clipPath: `inset(0 ${flipProgress * 100}% 0 0)`,
                    background: 'linear-gradient(168deg,#130a01 0%,#0a0400 45%,#070200 100%)',
                  }}>
                    <PaperTexture />
                    <PageContent page={pages[fromPage]} pageIndex={fromPage} {...pgCommon} />
                    {/* ظل حافة التقليب على الجزء المتبقي */}
                    <div style={{
                      position: 'absolute', top: 0, right: 0, bottom: 0, width: `${Math.min(30, shadowIntensity * 55)}%`,
                      background: `linear-gradient(to left, rgba(0,0,0,${shadowIntensity * 0.75}) 0%, transparent 100%)`,
                      pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 22,
                      background: 'linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,.12),transparent)', pointerEvents: 'none' }} />
                  </div>
                )}
                {flipDir === 'backward' && flipProgress < 0.98 && (
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 5, overflow: 'hidden',
                    clipPath: `inset(0 0 0 ${flipProgress * 100}%)`,
                    background: 'linear-gradient(168deg,#130a01 0%,#0a0400 45%,#070200 100%)',
                  }}>
                    <PaperTexture />
                    <PageContent page={pages[toPage]} pageIndex={toPage} {...pgCommon} />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: `${Math.min(30, shadowIntensity * 55)}%`,
                      background: `linear-gradient(to right, rgba(0,0,0,${shadowIntensity * 0.75}) 0%, transparent 100%)`,
                      pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 22,
                      background: 'linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,.12),transparent)', pointerEvents: 'none' }} />
                  </div>
                )}

                {/* الصفحة المتقلبة في الهواء — 3D rotate حول المحور */}
                {(() => {
                  // flipProgress: 0→1
                  // نحول لـ rotateY: forward: 0 → -180, backward: -180 → 0
                  const ry = flipDir === 'forward'
                    ? -flipProgress * 180
                    : -(1 - flipProgress) * 180;

                  // العرض الظاهر للصفحة في الهواء = cos(angle) * 100%
                  const absRad = Math.abs(ry) * Math.PI / 180;
                  const cosVal = Math.cos(absRad); // 1→0→-1
                  const visibleWidth = Math.abs(cosVal); // 1→0→1
                  const showBack = Math.abs(ry) > 90; // وراء 90° نعرض الوجه الخلفي

                  // موضع الصفحة: تبدأ من اليمين وتنتهي عند اليسار
                  // forward: تبدأ مفتوحة بالكامل وتنكمش من اليمين للوسط ثم تنبسط من الوسط لليسار
                  const pageRight = flipDir === 'forward'
                    ? `${flipProgress * 100}%`  // الحافة اليسرى للصفحة المتقلبة
                    : `${(1 - flipProgress) * 100}%`;

                  // skewY لمحاكاة الانحناء
                  const skew = shadowIntensity * (flipDir === 'forward' ? -8 : 8);

                  return (
                    <div style={{
                      position: 'absolute',
                      top: 0, bottom: 0,
                      right: pageRight,
                      width: `${visibleWidth * 100}%`,
                      zIndex: 8,
                      overflow: 'hidden',
                      background: showBack
                        ? 'linear-gradient(168deg,#0e0600 0%,#060200 45%,#040100 100%)'
                        : 'linear-gradient(168deg,#160c02 0%,#0c0500 45%,#080200 100%)',
                      transform: `skewY(${skew}deg)`,
                      transformOrigin: 'center center',
                      boxShadow: flipDir === 'forward'
                        ? `${shadowIntensity * 18}px 0 ${shadowIntensity * 30}px rgba(0,0,0,${shadowIntensity * 0.7})`
                        : `-${shadowIntensity * 18}px 0 ${shadowIntensity * 30}px rgba(0,0,0,${shadowIntensity * 0.7})`,
                    }}>
                      <PaperTexture />
                      {!showBack ? (
                        // الوجه الأمامي
                        <div style={{
                          position: 'absolute', inset: 0,
                          // نعوض الـ clip بـ translate عشان المحتوى يبان صح
                          transform: flipDir === 'forward'
                            ? `scaleX(${1 / Math.max(visibleWidth, 0.01)}) translateX(${-(flipProgress) * 50}%)`
                            : `scaleX(${1 / Math.max(visibleWidth, 0.01)}) translateX(${(1 - flipProgress) * 50}%)`,
                          transformOrigin: flipDir === 'forward' ? 'left center' : 'right center',
                        }}>
                          <PageContent page={pages[fromPage]} pageIndex={fromPage} {...pgCommon} />
                        </div>
                      ) : (
                        // الوجه الخلفي (صفحة الوجهة)
                        <div style={{
                          position: 'absolute', inset: 0,
                          transform: flipDir === 'forward'
                            ? `scaleX(${-1 / Math.max(visibleWidth, 0.01)}) translateX(${(1 - flipProgress) * 50}%)`
                            : `scaleX(${-1 / Math.max(visibleWidth, 0.01)}) translateX(${-flipProgress * 50}%)`,
                          transformOrigin: 'center center',
                        }}>
                          <PageContent page={pages[toPage]} pageIndex={toPage} {...pgCommon} />
                        </div>
                      )}
                      {/* إضاءة وظل على سطح الورقة */}
                      <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: showBack
                          ? `linear-gradient(to ${flipDir === 'forward' ? 'right' : 'left'}, rgba(0,0,0,${shadowIntensity * 0.5}) 0%, rgba(255,215,0,${shadowIntensity * 0.04}) 50%, rgba(0,0,0,${shadowIntensity * 0.3}) 100%)`
                          : `linear-gradient(to ${flipDir === 'forward' ? 'left' : 'right'}, rgba(0,0,0,${shadowIntensity * 0.5}) 0%, rgba(255,215,0,${shadowIntensity * 0.04}) 50%, rgba(0,0,0,${shadowIntensity * 0.3}) 100%)`,
                      }} />
                    </div>
                  );
                })()}
              </>
            )}

            {/* Inner glow */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at 50% 85%,rgba(255,215,0,.025) 0%,transparent 52%)' }} />
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '0 2px' }}>
          <NavBtn onClick={prevPage} disabled={currentPage === 0 || isFlipping} label="Previous page">
            <ChevronLeft size={13} />
          </NavBtn>

          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '50%' }}>
            {pages.map((pg, i) => {
              const active = i === currentPage;
              return (
                <button key={i}
                  onClick={() => !isFlipping && i !== currentPage && flipTo(i, i > currentPage ? 'forward' : 'backward')}
                  title={`Page ${i + 1}`}
                  style={{
                    width: active ? 14 : 4, height: 4, borderRadius: 999, border: 'none',
                    cursor: active ? 'default' : 'pointer', padding: 0,
                    background: active
                      ? 'linear-gradient(to right,#FFD700,#F4D03F)'
                      : pg.type === 'critique' ? 'rgba(255,215,0,.4)' : 'rgba(255,215,0,.22)',
                    boxShadow: active ? '0 0 5px rgba(255,215,0,.65)' : 'none',
                    transition: 'all .26s ease-out',
                  }}
                />
              );
            })}
          </div>

          <NavBtn onClick={nextPage} disabled={currentPage === totalPages - 1 || isFlipping} label="Next page">
            <ChevronRight size={13} />
          </NavBtn>
        </div>

        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,215,0,.35)', letterSpacing: '.2em', fontFamily: 'Georgia,serif' }}>
            ← → keys · swipe · tap dots
          </span>
        </div>
      </div>
    </div>
  );
}