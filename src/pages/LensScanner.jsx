import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, CameraOff, Scan, RotateCcw, Star, AlertTriangle, CheckCircle, Loader, X, Utensils, MapPin, Pill, FileText } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import { translateText } from '../services/translation'
import { useAppStore } from '../store/appStore'
import { LANGUAGES } from '../utils/constants'

const ALL_LANGS = LANGUAGES // bn, ne, hi, en
const SOURCE_OPTIONS = [{ code: 'auto', name: 'Auto-detect', label: 'AUTO', color: '#a78bfa' }, ...ALL_LANGS.filter(l => ['bn', 'en', 'ne'].includes(l.code))]

// Allergen keywords to flag in translated text
const ALLERGEN_WORDS = ['meat', 'fish', 'nut', 'peanut', 'egg', 'milk', 'dairy', 'shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'wheat', 'gluten', 'soy', 'pork', 'beef', 'chicken', 'mutton', 'lamb']

// Context detection from OCR text (Bengali + English + Nepali cues)
function detectContextType(text) {
  const lower = text.toLowerCase()
  const hasPrice = /[০-৯\d]+\s*(?:টাকা|৳|rs\.?|rupee|taka)/i.test(text) || /\d+\s*(?:tk|taka)/i.test(lower)
  const foodWords = ['ভাত', 'রুটি', 'মাংস', 'মাছ', 'ডাল', 'তরকারি', 'বিরিয়ানি', 'খিচুড়ি', 'পোলাও', 'চাউল', 'চা', 'কফি', 'মিষ্টি', 'सन्देश', 'rice', 'curry', 'fish', 'chicken', 'mutton', 'biryani', 'dal', 'roti', 'menu', 'thali', 'खाना', 'दाल', 'भात']
  const hasFoodWord = foodWords.some(w => lower.includes(w) || text.includes(w))
  const medicineWords = ['ট্যাবলেট', 'ক্যাপসুল', 'সিরাপ', 'ওষুধ', 'tablet', 'capsule', 'syrup', 'medicine', 'mg', 'ml', 'injection', 'dose', 'औषधि']
  const hasMedicine = medicineWords.some(w => lower.includes(w) || text.includes(w))
  const directionWords = ['রোড', 'স্ট্রিট', 'মোড়', 'বাজার', 'ঘাট', 'নগর', 'road', 'street', 'market', 'bazar', 'ghat', 'marg', 'नगर', 'बाजार']
  const hasDirection = directionWords.some(w => lower.includes(w) || text.includes(w))

  if (hasMedicine) return 'medicine'
  if (hasPrice || hasFoodWord) return 'menu'
  if (hasDirection) return 'sign'
  return 'general'
}

const CONTEXT_META = {
  menu: { icon: Utensils, label: 'Restaurant Menu', color: '#f87171' },
  sign: { icon: MapPin, label: 'Street / Place Sign', color: '#2dd4bf' },
  medicine: { icon: Pill, label: 'Medicine Label', color: '#fbbf24' },
  general: { icon: FileText, label: 'General Text', color: '#a78bfa' },
}

function detectAllergens(translatedText) {
  const lower = translatedText.toLowerCase()
  return ALLERGEN_WORDS.filter(w => lower.includes(w))
}

export default function LensScanner() {
  const [mode, setMode] = useState('idle') // idle | camera | processing | results
  const [cameraError, setCameraError] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStatus, setOcrStatus] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [results, setResults] = useState([]) // [{original, translated, context, allergens}]
  const [snappedImage, setSnappedImage] = useState(null)

  const [savedIds, setSavedIds] = useState(new Set())
  const [facingMode, setFacingMode] = useState('environment')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const workerRef = useRef(null)

  const { addToHistory } = useAppStore()

  const targetLangData = ALL_LANGS.find(l => l.code === targetLang) || ALL_LANGS[0]
  const sourceLangData = SOURCE_OPTIONS.find(l => l.code === sourceLang) || SOURCE_OPTIONS[0]

  // Start camera
  const startCamera = useCallback(async () => {
    setCameraError(null)
    setMode('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err) {
      setCameraError(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access and try again.'
        : 'Could not access camera. Make sure no other app is using it.')
      setMode('idle')
    }
  }, [facingMode])

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  // Snap current frame and run OCR → translate
  const handleSnap = useCallback(async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Capture frame
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setSnappedImage(imageDataUrl)
    stopCamera()
    setMode('processing')
    setOcrProgress(0)

    try {
      // Init worker with Bengali + English + Hindi/Devanagari (cached after first load)
      if (!workerRef.current) {
        try {
          workerRef.current = await createWorker('ben+eng+hin', 1, {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setOcrProgress(Math.round((m.progress || 0) * 80))
                setOcrStatus('Reading text...')
              } else if (m.status === 'loading tesseract core') {
                setOcrStatus('Loading OCR engine...')
              } else if (m.status === 'loading language traineddata') {
                setOcrStatus('Loading language data...')
              }
            },
          })
        } catch (workerErr) {
          console.error('[Lens] Worker init failed, falling back to eng only:', workerErr)
          workerRef.current = await createWorker('eng', 1, {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setOcrProgress(Math.round((m.progress || 0) * 80))
                setOcrStatus('Reading text...')
              }
            },
          })
        }
      }

      setOcrStatus('Recognising text...')
      const { data } = await workerRef.current.recognize(imageDataUrl)

      console.log('[Lens] OCR raw text:', data.text)
      console.log('[Lens] OCR paragraphs:', data.paragraphs?.length)

      const nonEmpty = (t) => t.replace(/[\s\n\r]+/g, '').length > 2

      // Primary: structured paragraphs
      let blocks = (data.paragraphs || [])
        .map(p => p.text.trim())
        .filter(nonEmpty)

      // Fallback 1: split raw text by blank lines
      if (blocks.length === 0 && data.text) {
        blocks = data.text.split(/\n{2,}/).map(t => t.trim()).filter(nonEmpty)
      }

      // Fallback 2: split by single newlines
      if (blocks.length === 0 && data.text) {
        blocks = data.text.split(/\n/).map(t => t.trim()).filter(nonEmpty)
      }

      // Fallback 3: entire text as one block
      if (blocks.length === 0 && data.text?.trim()) {
        blocks = [data.text.trim()]
      }

      if (blocks.length === 0) {
        setResults([{ original: '', translated: '', context: 'general', allergens: [], error: 'No text detected. Make sure the text is well-lit, in focus, and fills the frame. Check browser console for OCR debug output.' }])
        setMode('results')
        return
      }

      setOcrProgress(85)
      setOcrStatus('Translating...')

      // Translate all blocks (sourceLang='auto' omits &from= so Azure auto-detects)
      const translated = await Promise.all(
        blocks.map(text => translateText(text, sourceLang, targetLang).catch(() => '[Translation failed]'))
      )

      setOcrProgress(100)

      const resultItems = blocks.map((original, i) => {
        const trans = translated[i]
        const context = detectContextType(original)
        const allergens = detectAllergens(trans)
        return { id: Date.now() + i, original, translated: trans, context, allergens }
      })

      setResults(resultItems)

      // Save all to history
      resultItems.forEach(item => {
        if (!item.error) {
          addToHistory({
            fromLang: sourceLang === 'auto' ? 'auto' : sourceLang,
            toLang: targetLang,
            originalText: item.original,
            translatedText: item.translated,
            fromLangName: sourceLang === 'auto' ? 'Auto-detected' : sourceLangData.name,
            toLangName: targetLangData.name,
            source: 'lens',
          })
        }
      })

      setMode('results')
    } catch (err) {
      setResults([{ original: '', translated: '', context: 'general', allergens: [], error: 'OCR or translation failed. Please try again.' }])
      setMode('results')
    }
  }, [stopCamera, targetLang, targetLangData, addToHistory])

  const handleReset = () => {
    stop()
    setResults([])
    setSnappedImage(null)
    setOcrProgress(0)
    setSavedIds(new Set())
    startCamera()
  }

  const handleSave = (item) => {
    setSavedIds(prev => new Set([...prev, item.id]))
  }

  const handleFlipCamera = () => {
    stopCamera()
    setFacingMode(f => f === 'environment' ? 'user' : 'environment')
  }

  // Re-start camera when facingMode changes
  useEffect(() => {
    if (mode === 'camera') startCamera()
  }, [facingMode]) // eslint-disable-line

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [stopCamera])

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 48px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 700, marginBottom: 6 }}>
          <span className="gradient-text">KothaSetu</span> Lens
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px, 2vw, 15px)' }}>
          Point at a Bengali menu or sign — snap and translate instantly
        </p>
      </div>

      {/* Language selectors */}
      <div className="glass" style={{ borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
        {/* Source language */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Scan language</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SOURCE_OPTIONS.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setSourceLang(lang.code); if (lang.code !== 'auto' && lang.code === targetLang) setTargetLang('en') }}
                style={{
                  padding: '5px 12px', borderRadius: 20,
                  border: `1px solid ${sourceLang === lang.code ? lang.color : 'var(--border)'}`,
                  background: sourceLang === lang.code ? lang.color + '20' : 'var(--bg-secondary)',
                  color: sourceLang === lang.code ? lang.color : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 12, fontWeight: sourceLang === lang.code ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
        {/* Target language */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Translate to</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_LANGS.filter(l => ['bn', 'en', 'ne', 'hi'].includes(l.code)).map(lang => (
              <button
                key={lang.code}
                onClick={() => setTargetLang(lang.code)}
                style={{
                  padding: '5px 12px', borderRadius: 20,
                  border: `1px solid ${targetLang === lang.code ? lang.color : 'var(--border)'}`,
                  background: targetLang === lang.code ? lang.color + '20' : 'var(--bg-secondary)',
                  color: targetLang === lang.code ? lang.color : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 12, fontWeight: targetLang === lang.code ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* IDLE STATE */}
      {mode === 'idle' && (
        <div className="glass" style={{ borderRadius: 20, padding: 40, textAlign: 'center' }}>
          {cameraError && (
            <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(248,113,113,0.1)', borderRadius: 10, border: '1px solid rgba(248,113,113,0.25)', color: '#f87171', fontSize: 13, lineHeight: 1.5 }}>
              <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6 }} />
              {cameraError}
            </div>
          )}
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #6c63ff22, #2dd4bf22)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Camera size={36} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>Ready to scan</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 28px' }}>
            Point your camera at any Bengali menu, sign, or label and tap Snap to translate
          </p>
          <button onClick={startCamera} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 14,
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            border: 'none', color: 'white', cursor: 'pointer',
            fontSize: 15, fontWeight: 600,
            boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
            transition: 'all 0.2s',
          }}>
            <Camera size={18} /> Open Camera
          </button>

          {/* How it works */}
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { step: '1', text: 'Open camera & frame the text' },
              { step: '2', text: 'Tap Snap to capture' },
              { step: '3', text: 'Get instant translation' },
            ].map(({ step, text }) => (
              <div key={step} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(108,99,255,0.2)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, margin: '0 auto 8px' }}>{step}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.4 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMERA VIEWFINDER */}
      {mode === 'camera' && (
        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Scan frame overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '72%', height: '55%', position: 'relative' }}>
              {[
                { top: 0, left: 0, borderTop: '3px solid #a78bfa', borderLeft: '3px solid #a78bfa', borderRadius: '10px 0 0 0' },
                { top: 0, right: 0, borderTop: '3px solid #a78bfa', borderRight: '3px solid #a78bfa', borderRadius: '0 10px 0 0' },
                { bottom: 0, left: 0, borderBottom: '3px solid #a78bfa', borderLeft: '3px solid #a78bfa', borderRadius: '0 0 0 10px' },
                { bottom: 0, right: 0, borderBottom: '3px solid #a78bfa', borderRight: '3px solid #a78bfa', borderRadius: '0 0 10px 0' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...s }} />
              ))}
            </div>
          </div>

          {/* Hint text */}
          <div style={{ position: 'absolute', top: 16, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: 12, padding: '5px 12px', borderRadius: 20, backdropFilter: 'blur(8px)' }}>
              Frame the Bengali text within the guide
            </span>
          </div>

          {/* Controls */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Flip camera */}
            <button onClick={handleFlipCamera} style={{
              width: 44, height: 44, borderRadius: 22,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              <RotateCcw size={18} />
            </button>

            {/* Snap button */}
            <button onClick={handleSnap} style={{
              width: 68, height: 68, borderRadius: 34,
              background: 'white', border: '4px solid rgba(255,255,255,0.5)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(167,139,250,0.6)',
              transition: 'transform 0.15s',
            }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Scan size={28} style={{ color: '#6c63ff' }} />
            </button>

            {/* Close camera */}
            <button onClick={() => { stopCamera(); setMode('idle') }} style={{
              width: 44, height: 44, borderRadius: 22,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* PROCESSING STATE */}
      {mode === 'processing' && (
        <div>
          {snappedImage && (
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 20, maxHeight: 280, position: 'relative' }}>
              <img src={snappedImage} alt="Captured" style={{ width: '100%', height: 280, objectFit: 'cover', filter: 'brightness(0.6)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <Loader size={32} style={{ color: 'var(--accent-secondary)', animation: 'spin 1s linear infinite' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{ocrStatus || 'Processing...'}</p>
                  <div style={{ width: 200, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '10px auto 0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: ocrProgress + '%', background: 'linear-gradient(90deg, #6c63ff, #2dd4bf)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 6 }}>{ocrProgress}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULTS STATE */}
      {mode === 'results' && (
        <div>
          {/* Snapped image thumbnail */}
          {snappedImage && (
            <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20, height: 180, position: 'relative' }}>
              <img src={snappedImage} alt="Scanned" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7))' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
                  {results.filter(r => !r.error).length} text block{results.filter(r => !r.error).length !== 1 ? 's' : ''} found
                </span>
                <button onClick={handleReset} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}>
                  <Camera size={13} /> Scan Again
                </button>
              </div>
            </div>
          )}

          {/* Error result */}
          {results[0]?.error && (
            <div className="glass" style={{ borderRadius: 14, padding: 24, textAlign: 'center', marginBottom: 16 }}>
              <CameraOff size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{results[0].error}</p>
              <button onClick={handleReset} style={{
                marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 10,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
              }}>
                <RotateCcw size={14} /> Try Again
              </button>
            </div>
          )}

          {/* Result cards */}
          {results.filter(r => !r.error).map((item, idx) => {
            const meta = CONTEXT_META[item.context]
            const ContextIcon = meta.icon
            const isSaved = savedIds.has(item.id)

            return (
              <div key={item.id} className="glass" style={{ borderRadius: 16, padding: 18, marginBottom: 14, border: item.allergens.length > 0 ? '1px solid rgba(251,191,36,0.4)' : '1px solid var(--border)' }}>

                {/* Context badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 10px', borderRadius: 20, background: meta.color + '18', border: `1px solid ${meta.color}40` }}>
                    <ContextIcon size={12} style={{ color: meta.color }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: meta.color }}>{meta.label}</span>
                  </div>
                  {item.allergens.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)' }}>
                      <AlertTriangle size={12} style={{ color: '#fbbf24' }} />
                      <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600 }}>Contains: {item.allergens.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Original Bengali text */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Bengali (Original)</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    {item.original}
                  </p>
                </div>

                <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

                {/* Translation */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: targetLangData.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: targetLangData.color }}>{targetLangData.label}</div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{targetLangData.name} (Translation)</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 500, lineHeight: 1.6 }}>
                    {item.translated}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleSave(item)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', borderRadius: 10,
                    background: isSaved ? 'rgba(251,191,36,0.15)' : 'var(--bg-secondary)',
                    border: `1px solid ${isSaved ? 'rgba(251,191,36,0.5)' : 'var(--border)'}`,
                    color: isSaved ? '#fbbf24' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: 13,
                  }}>
                    {isSaved ? <CheckCircle size={14} /> : <Star size={14} />}
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            )
          })}

          {/* Scan again CTA at bottom */}
          {results.filter(r => !r.error).length > 0 && (
            <button onClick={handleReset} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px', borderRadius: 14, marginTop: 8,
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              border: 'none', color: 'white', cursor: 'pointer',
              fontSize: 15, fontWeight: 600,
              boxShadow: '0 8px 24px rgba(108,99,255,0.3)',
            }}>
              <Camera size={17} /> Scan Another Sign
            </button>
          )}
        </div>
      )}

      {/* Spin animation for loader */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
