"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  Wind, Layers, SprayCan, Box, Waves, Zap, Flame, Search, ChevronRight,
  ChevronLeft, ArrowLeft, Info, ShieldCheck, Microscope, Loader2,
  AlertTriangle, CheckCircle2, Activity, Droplets, Scan,
  Sparkles, Download, Play, Mic, MicOff, Volume2, Target, Eye
} from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Helper for exponential backoff retries
const fetchWithRetry = async (url, options, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (i === retries - 1) throw new Error(`Status ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
    }
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
  }
};

const PROCESS_STEPS = [
  {
    id: 'A',
    title: 'Film Draping',
    subtitle: 'Surface Definition',
    icon: <Layers className="w-5 h-5" />,
    prompt: "Cinematic close-up of a heated translucent EVA plastic film being vacuum-formed perfectly over a complex industrial metal engine pattern, stretched tight, detailed textures, industrial lighting.",
    details: [
      "EVA Film (0.05-0.1mm thickness) is heated until softened for elasticity.",
      "Vacuum suction from the pattern carrier plate pulls the film tight.",
      "The film creates a binder-free barrier between metal and sand."
    ],
    qualityCheck: [
      "Inspect film for 'Webbing' or folds at sharp corners.",
      "Check for micro-tears or 'pinholes' using a vacuum gauge drop test.",
      "Verify uniform transparency (indicates even heating)."
    ],
    tip: "Film thickness directly determines the final surface Ra value (Smoothness)."
  },
  {
    id: 'B',
    title: 'Refractory Coating',
    subtitle: 'Thermal Shielding',
    icon: <SprayCan className="w-5 h-5" />,
    prompt: "Detailed photo of a technician spraying a dark grey refractory slurry onto a plastic-wrapped mould pattern, fine mist, industrial foundry setting.",
    details: [
      "A heat-resistant slurry wash is applied over the film.",
      "Protects the mould integrity during 1450°C metal pouring.",
      "Ensures a clean, glass-smooth release after cooling."
    ],
    qualityCheck: [
      "Check for coating 'runs' or 'drips' which cause surface lumps.",
      "Measure wet-layer thickness (should be consistent +/- 0.05mm).",
      "Ensure 100% coverage in deep recesses."
    ],
    tip: "Uniform coating prevents molten metal from melting the plastic film prematurely."
  },
  {
    id: 'C',
    title: 'Sand Filling',
    subtitle: 'Flask Formation',
    icon: <Box className="w-5 h-5" />,
    prompt: "Industrial photo of fine dry silica sand being poured into a double-walled mould box, foundry environment, sharp detail.",
    details: [
      "A double-walled vacuum flask is placed over the pattern.",
      "Dry, unbonded silica sand is filled into the mould box.",
      "Sand flows easily into complex undercuts due to lack of glue."
    ],
    qualityCheck: [
      "Verify sand temperature is below 40°C to prevent film distortion.",
      "Check that sand is dry and free from foreign debris.",
      "Ensure the flask is seated perfectly flat on the carrier plate."
    ],
    tip: "V-Process sand requires 0% moisture—eliminating steam-related porosity."
  },
  {
    id: 'D',
    title: 'Compaction',
    subtitle: 'Bulk Density',
    icon: <Waves className="w-5 h-5" />,
    prompt: "Realistic photo of an industrial vibration table with a large flask, showing sand settling into place, metallic reflections, professional lighting.",
    details: [
      "Mechanical high-frequency vibration is applied to the mould box.",
      "Settles the sand particles into their most compact state.",
      "Provides the foundation for the mould's structural strength."
    ],
    qualityCheck: [
      "Monitor vibration timer (standard 45-60 seconds).",
      "Check sand level 'drop' (significant drop indicates good settling).",
      "Verify no 'bridging' of sand over complex geometry."
    ],
    tip: "Vibration frequency is tuned to achieve maximum sand bulk density."
  },
  {
    id: 'E',
    title: 'Vacuum Seal',
    subtitle: 'Atmospheric Hardening',
    icon: <Zap className="w-5 h-5" />,
    prompt: "Close-up of a high-tech vacuum pump connected to a metal mould box, industrial gauges showing 14.7 psi pressure, technical detail.",
    details: [
      "A second top film is applied to seal the sand volume.",
      "Vacuum is applied internally, hardening the sand mass instantly.",
      "Atmospheric pressure (14.7 psi) hardens the sand into a rigid block."
    ],
    qualityCheck: [
      "Read vacuum gauge: Must hold at 12-14.7 PSI.",
      "Listen for 'hissing' sounds indicating top-film leaks.",
      "Gently press sand: It should feel rock-hard like concrete."
    ],
    tip: "The vacuum must be maintained until the metal has fully solidified."
  },
  {
    id: 'F',
    title: 'Assembly & Pour',
    subtitle: 'Transformation',
    icon: <Flame className="w-5 h-5" />,
    prompt: "Cinematic orange glowing metal pouring from a ladle into a vacuum mould, sparks, intense foundry atmosphere.",
    details: [
      "The pattern is removed with zero friction or draft issues.",
      "Mould halves joined and molten metal poured while under vacuum.",
      "Vacuum draws out gases, resulting in zero porosity defects."
    ],
    qualityCheck: [
      "Check alignment pins for zero 'shift' between mould halves.",
      "Monitor vacuum during pouring (any drop suggests mould collapse).",
      "Verify metal temperature is within spec before pouring."
    ],
    tip: "Vacuum pouring results in denser metal structures than traditional casting."
  }
];

const QC_TOOLS = [
  {
    id: 'ut',
    title: 'Ultrasonic Testing (UT)',
    icon: <Activity className="w-6 h-6" />,
    category: 'Internal Flaws',
    prompt: "High-tech industrial UT probe on a smooth steel casting, digital waveforms on a lab screen, cinematic blue lighting.",
    steps: [
      "Clean testing surface of scale/dirt.",
      "Apply couplant gel (Aqueous) for sonic contact.",
      "Calibrate probe to known thickness block.",
      "Scan grid for pulse-echo peak anomalies."
    ],
    parameters: {
      "Frequency": "2.25 - 5 MHz",
      "Gain": "60-80 dB",
      "Couplant": "Aqueous Gel"
    },
    dos: [
      "Maintain perpendicular contact.",
      "Verify calibration every 4 hours.",
      "Slow scan speed for high resolution."
    ],
    donts: [
      "Don't scan through air gaps.",
      "Don't ignore background 'grass' noise.",
      "Don't use on highly porous materials."
    ]
  },
  {
    id: 'cmm',
    title: 'CMM Probing',
    icon: <Scan className="w-6 h-6" />,
    category: 'Dimensions',
    prompt: "Ruby-tipped automated CMM probe touching a complex industrial manifold, precision lab.",
    steps: [
      "Stabilize part in 20°C environment.",
      "Define XYZ datums via probe.",
      "Execute automated mapping program.",
      "Generate variance report vs CAD model."
    ],
    parameters: {
      "Ambient Temp": "20°C (Fixed)",
      "Accuracy": "±0.001 mm",
      "Stylus": "Ruby-Tipped"
    },
    dos: [
      "Ensure part is clinically clean.",
      "Use rigid non-stressing fixtures.",
      "Map stylus daily for wear."
    ],
    donts: [
      "Don't touch part with bare hands.",
      "Don't measure hot parts.",
      "Don't use damaged ruby tips."
    ]
  },
  {
    id: 'mpi',
    title: 'Magnetic Particle (MPI)',
    icon: <Target className="w-6 h-6" />,
    category: 'Surface Cracks',
    prompt: "Fluorescent green magnetic particles glowing under UV light on a dark metal crack, close-up industrial.",
    steps: [
      "Degrease and dry the part.",
      "Induce magnetic field via yoke.",
      "Apply fluorescent particle spray.",
      "Inspect under UV-A blacklight."
    ],
    parameters: {
      "UV Intensity": "1000 µW/cm²",
      "Amperage": "1000-2000A",
      "Medium": "Wet Fluorescent"
    },
    dos: [
      "Test in two perpendicular directions.",
      "Allow UV light 15m warm up.",
      "Demagnetize after check."
    ],
    donts: [
      "Don't use on non-ferrous alloys.",
      "Don't over-wash particles.",
      "Don't skip UV intensity checks."
    ]
  },
  {
    id: 'spectro',
    title: 'Spectrometry',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'Chemistry',
    prompt: "Plasma spark stand on a spectrometer machine, blue electric arc striking a metal sample.",
    steps: [
      "Grind a flat surface on sample.",
      "Seal sample on spark stand.",
      "Trigger argon-shielded plasma arc.",
      "Analyze elemental spectral lines."
    ],
    parameters: {
      "Argon Purity": "99.999%",
      "Burn Time": "15 Seconds",
      "Spark Voltage": "400V"
    },
    dos: [
      "Use High-Purity Argon.",
      "Perform 3 test burns.",
      "Calibrate with CRM sample."
    ],
    donts: [
      "Don't spark on porosity.",
      "Don't reuse spark points.",
      "Don't ignore drift values."
    ]
  }
];

const ImagenImage = ({ prompt, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instances: { prompt }, parameters: { sampleCount: 1 } })
        });
        const data = await response.json();
        if (isMounted && data.predictions && data.predictions[0]) {
          setImageUrl(`data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`);
        } else {
          throw new Error("Invalid response");
        }
      } catch (e) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    generate();
    return () => { isMounted = false; };
  }, [prompt]);

  return (
    <div className={`relative overflow-hidden bg-slate-900 rounded-2xl flex items-center justify-center ${className}`}>
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Generating Realistic Visual...</span>
        </div>
      ) : error ? (
        <div className="text-red-400 text-xs text-center p-4"><AlertTriangle className="w-6 h-6 mx-auto mb-2" />Visual Simulation Failed</div>
      ) : imageUrl ? (
        <img src={imageUrl} alt={alt} className="w-full h-full object-cover animate-in fade-in duration-700" />
      ) : (
        <div className="text-slate-600 text-xs text-center p-4 italic">Instrument Interface Simulation</div>
      )}
      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-blue-400 uppercase border border-blue-500/30">
        Realistic Ref
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [activeStep, setActiveStep] = useState(0);
  const [activeTool, setActiveTool] = useState(null);
  const [psi, setPsi] = useState(0);
  const [temp, setTemp] = useState(20);
  const [vibe, setVibe] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [utGain, setUtGain] = useState(20);
  const [utFreq, setUtFreq] = useState(2.25);

  const isRigid = psi >= 12.5 && vibe && temp >= 90 && temp <= 135;

  // --- Voice Features ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAsk = async () => {
    if (!input) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    const systemPrompt = "You are a simplified technical consultant for the V-Process foundry. Answer using clear, plain English. Explain common defects like film tearing or mould collapse simply. Be precise but accessible.";

    try {
      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: currentInput }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't get that answer. Try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Trouble connecting. Please ask again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
     
      <style>{`
        @keyframes highFreqVibrate {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(-1.5px, 1.5px); }
          75% { transform: translate(1px, 1px); }
          100% { transform: translate(0, 0); }
        }
        .animate-vibrate { animation: highFreqVibrate 0.08s linear infinite; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20"><Wind className="w-6 h-6" /></div>
            <div>
              <h1 className="font-black text-xl leading-none uppercase">V-PROCESS <span className="text-blue-500">PRO</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-widest">Foundry Systems Master</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('home')} className={`text-xs font-black uppercase tracking-widest ${view === 'home' ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}>Master Map</button>
            <button onClick={() => setView('simulator')} className={`text-xs font-black uppercase tracking-widest ${view === 'simulator' ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}>Physics Lab</button>
            <button onClick={() => setView('qc')} className={`text-xs font-black uppercase tracking-widest ${view.includes('qc') ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}>QC Toolkit</button>
            <button onClick={() => setView('assistant')} className={`text-xs font-black uppercase tracking-widest ${view === 'assistant' ? 'text-blue-500' : 'text-slate-500 hover:text-white'}`}><Sparkles className="w-3 h-3 inline mr-1" /> AI Talk</button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
       
        {/* VIEW 1: HOME */}
        {view === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-700">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-blue-500 font-black text-xs uppercase tracking-widest">Casting Intelligence</span>
                <h2 className="text-7xl font-black text-white leading-none">Modern Foundry <br/><span className="text-blue-500">Simplified.</span></h2>
                <p className="text-slate-400 text-lg">Use Vacuum and 100% Recyclable sand to build parts with zero gas holes and perfect surfaces.</p>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-white/5 border border-white/5 rounded-2xl"><ShieldCheck className="text-blue-500 mb-2" /><h5 className="font-bold text-sm">Precision Accuracy</h5></div>
                  <div className="flex-1 p-4 bg-white/5 border border-white/5 rounded-2xl"><Zap className="text-amber-500 mb-2" /><h5 className="font-bold text-sm">Low Cost Ops</h5></div>
                </div>
              </div>
              <ImagenImage prompt="Modern industrial foundry, glowing liquid metal, high tech machinery, 8k resolution cinematic." className="h-[400px]" />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.id} onClick={() => {setActiveStep(i); setView('step-detail')}} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-blue-500/50 cursor-pointer transition-all group">
                  <div className="flex justify-between items-center mb-6">
                    <span className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-sm text-white shadow-lg">{step.id}</span>
                    <div className="text-slate-500 group-hover:text-blue-500 transition-colors">{step.icon}</div>
                  </div>
                  <h4 className="text-xl font-black mb-1 text-white">{step.title}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{step.subtitle}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* VIEW 2: STEP DETAIL + QUALITY CHECKLIST */}
        {view === 'step-detail' && (
          <div className="animate-in slide-in-from-right-8 duration-500 space-y-8">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
                  <div>
                    <h2 className="text-4xl font-black text-white">{PROCESS_STEPS[activeStep].title}</h2>
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">{PROCESS_STEPS[activeStep].subtitle}</p>
                  </div>
                  <div className="space-y-4">
                    {PROCESS_STEPS[activeStep].details.map((d, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></div>
                        <p className="text-slate-400 text-lg leading-relaxed">{d}</p>
                      </div>
                    ))}
                  </div>
                 
                  {/* Quality Checklist Section */}
                  <div className="bg-blue-600/5 p-6 rounded-2xl border border-blue-500/20">
                    <h4 className="text-blue-500 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Quality Inspector's Focus
                    </h4>
                    <ul className="space-y-4">
                      {PROCESS_STEPS[activeStep].qualityCheck.map((check, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <ImagenImage prompt={PROCESS_STEPS[activeStep].prompt} alt="Step visual" className="h-[350px] shadow-2xl" />
                <div className="p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20 italic text-sm text-slate-400 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>"{PROCESS_STEPS[activeStep].tip}"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: QC TOOLKIT DASHBOARD */}
        {view === 'qc' && (
          <div className="space-y-16 animate-in fade-in duration-700">
             <section className="text-center space-y-4">
                <span className="text-indigo-500 font-black text-xs uppercase tracking-widest">Inspection Division</span>
                <h2 className="text-6xl font-black text-white">The Quality <span className="text-indigo-500">Toolkit</span></h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">High-tech non-destructive and dimensional testing suites to guarantee integrity.</p>
                <div className="flex justify-center gap-4 pt-6">
                   <button onClick={() => setView('qc-sim')} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2">
                     <Play className="w-4 h-4" /> Start UT Simulation
                   </button>
                </div>
             </section>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
               {QC_TOOLS.map(tool => (
                 <div key={tool.id} onClick={() => {setActiveTool(tool); setView('qc-detail')}} className="group bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                       <div className="p-4 bg-indigo-600/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/5">{tool.icon}</div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{tool.category}</span>
                    </div>
                    <h4 className="text-2xl font-black text-white mb-2">{tool.title}</h4>
                    <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      Open Operational Manual <ChevronRight className="w-3 h-3" />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* VIEW 4: QC TOOL DETAIL */}
        {view === 'qc-detail' && activeTool && (
          <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-10">
             <button onClick={() => setView('qc')} className="flex items-center gap-2 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</button>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-7 space-y-8">
                  <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
                     <div className="flex items-center gap-6 mb-4">
                        <div className="bg-indigo-600 p-5 rounded-[2rem] text-white shadow-xl shadow-indigo-600/20">{activeTool.icon}</div>
                        <div>
                           <h2 className="text-5xl font-black text-white">{activeTool.title}</h2>
                           <p className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px]">{activeTool.category}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                           <Activity className="w-4 h-4" /> Clinical Workflow
                        </h4>
                        <div className="space-y-3">
                           {activeTool.steps.map((step, i) => (
                             <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                <span className="text-indigo-500 font-black text-xs mt-1">STEP 0{i+1}</span>
                                <p className="text-slate-300 text-lg font-medium">{step}</p>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-green-500/5 border border-green-500/20 p-8 rounded-3xl space-y-4">
                           <h5 className="text-green-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> The How-To</h5>
                           <ul className="space-y-3 text-slate-400 text-sm">
                             {activeTool.dos.map((d, i) => <li key={i} className="flex gap-2"><span>•</span> {d}</li>)}
                           </ul>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-4">
                           <h5 className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> The How-Not-To</h5>
                           <ul className="space-y-3 text-slate-400 text-sm">
                             {activeTool.donts.map((d, i) => <li key={i} className="flex gap-2"><span>•</span> {d}</li>)}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-5 space-y-8">
                  <ImagenImage prompt={activeTool.prompt} alt={activeTool.title} className="h-[400px] shadow-2xl" />
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
                     <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Industrial Parameter Specs</h5>
                     <div className="space-y-3">
                        {Object.entries(activeTool.parameters).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{key}</span>
                             <span className="text-indigo-400 font-black text-sm">{val}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* VIEW 5: QC UT SIMULATION */}
        {view === 'qc-sim' && (
          <div className="animate-in zoom-in duration-500 space-y-8">
            <button onClick={() => setView('qc')} className="flex items-center gap-2 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"><ArrowLeft className="w-4 h-4" /> Exit Simulation</button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white/5 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
              <div className="lg:col-span-4 space-y-12">
                <div>
                  <h2 className="text-4xl font-black text-white">UT Inspection <span className="text-indigo-500">Simulator</span></h2>
                  <p className="text-slate-400 mt-4 leading-relaxed">Adjust the <strong>Gain</strong> and <strong>Frequency</strong> to find the hidden defect spike on the oscilloscope. Calibration is key.</p>
                </div>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Probe Gain (dB)</span><span className="text-indigo-500 font-bold">{utGain} dB</span></div>
                    <input type="range" min="0" max="100" value={utGain} onChange={(e) => setUtGain(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Frequency (MHz)</span><span className="text-indigo-500 font-bold">{utFreq.toFixed(2)} MHz</span></div>
                    <input type="range" min="2" max="10" step="0.25" value={utFreq} onChange={(e) => setUtFreq(parseFloat(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => alert(utFreq === 4.25 ? "ERROR: Failure to Identify. You accepted a part with a critical internal crack." : "VERDICT: Accept. Part clear.")} className="py-5 bg-green-600/20 border border-green-500/30 text-green-500 rounded-2xl font-black uppercase text-[10px] hover:bg-green-600 hover:text-white transition-all">Accept Part</button>
                   <button onClick={() => alert(utFreq === 4.25 ? "VERDICT: Reject. Excellent catch. Critical internal flaw detected at 4.25 MHz." : "ERROR: False Reject. Part was dimensionally clear at this scan frequency.")} className="py-5 bg-red-600/20 border border-red-500/30 text-red-500 rounded-2xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">Reject Part</button>
                </div>
              </div>
              <div className="lg:col-span-8 bg-black rounded-[2.5rem] border-4 border-slate-800 p-10 relative overflow-hidden shadow-inner">
                <div className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-indigo-500/50">Live Oscilloscope Feed</div>
                <div className="w-full h-full flex items-center justify-center">
                   <svg viewBox="0 0 400 200" className="w-full h-64">
                      <path d="M 0 180 L 80 180 L 100 20 L 120 180 L 350 180 L 400 180" fill="none" stroke="#6366f1" strokeWidth="4" className="animate-pulse opacity-50" />
                      {utFreq === 4.25 && (
                         <path d={`M 220 180 L 235 ${180 - (utGain * 1.5)} L 250 180`} fill="none" stroke="#ef4444" strokeWidth="5" className="animate-in fade-in zoom-in duration-300" />
                      )}
                   </svg>
                </div>
                <div className="absolute bottom-6 right-10">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${utFreq === 4.25 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
                     {utFreq === 4.25 ? '!!! CRITICAL FLAW INDICATION !!!' : 'SCANNING FOR SUB-SURFACE VOIDS...'}
                   </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: AI ASSISTANT */}
        {view === 'assistant' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <Sparkles className="w-12 h-12 text-blue-500 mx-auto" />
              <h2 className="text-4xl font-black">AI Technical <span className="text-blue-500">Talking Assistant</span></h2>
              <p className="text-slate-400">Collaborate with the Gemini Expert via Voice or Text.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col h-[550px] shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
                <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl rounded-tl-none text-slate-300">
                  "Engineer, use the Mic button to describe a foundry defect. I will troubleshoot the A-F cycle root cause and speak the answer back to you."
                </div>
                {messages.map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className={`p-5 rounded-2xl max-w-[85%] ${m.role === 'ai' ? 'bg-white/5 border border-white/5 rounded-tl-none mr-auto' : 'bg-blue-600 text-white rounded-tr-none ml-auto'}`}>
                      {m.text}
                    </div>
                    {m.role === 'ai' && (
                      <button onClick={() => speakText(m.text)} className="flex items-center gap-2 text-[10px] font-bold text-blue-500 hover:text-white transition-colors">
                        <Volume2 className="w-3 h-3" /> CLICK TO LISTEN
                      </button>
                    )}
                  </div>
                ))}
                {isTyping && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
              </div>
             
              <div className="p-6 bg-slate-900/50 border-t border-white/5 flex gap-4 items-center">
                <button
                  onClick={startListening}
                  className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Ask a question or tap the Mic..."
                  className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button onClick={handleAsk} disabled={isTyping} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs disabled:opacity-50 transition-opacity">Send</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: PHYSICS LAB */}
        {view === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
            <div className="space-y-8">
              <h2 className="text-3xl font-black">Physics Lab</h2>
              <div className="space-y-10 bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Atmospheric Pressure</span><span className="text-blue-500 font-bold">{psi.toFixed(1)} PSI</span></div>
                  <input type="range" min="0" max="15" step="0.1" value={psi} onChange={(e) => setPsi(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Pattern Temperature</span><span className="text-amber-500 font-bold">{temp}°C</span></div>
                  <input type="range" min="20" max="200" step="1" value={temp} onChange={(e) => setTemp(parseInt(e.target.value))} className="w-full accent-amber-600" />
                </div>
                <button onClick={() => setVibe(!vibe)} className={`w-full py-4 rounded-xl font-black uppercase text-[10px] transition-all tracking-widest ${vibe ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                  Vibration Table: {vibe ? 'ACTIVE' : 'IDLE'}
                </button>
              </div>
              <div className={`p-6 rounded-2xl border ${isRigid ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-lg shadow-green-500/5' : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/5'}`}>
                <h5 className="font-black text-xs uppercase tracking-widest">{isRigid ? 'MOULD IS RIGID' : 'SAND IS FLUID'}</h5>
                <p className="text-[10px] uppercase font-bold opacity-60 mt-1">{isRigid ? 'Physics lock successful' : 'Stabilization Failed'}</p>
              </div>
            </div>
            <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] border border-white/5 h-[550px] flex items-center justify-center relative overflow-hidden shadow-inner">
               <div className={`w-64 h-80 rounded-[2.5rem] border-4 flex flex-col items-center justify-center transition-all duration-700 z-10 ${isRigid ? 'border-blue-500 bg-slate-800 shadow-[0_0_80px_rgba(59,130,246,0.3)]' : 'border-slate-700 bg-slate-900 shadow-none'} ${vibe ? 'animate-vibrate' : ''}`}>
                  <Activity className={`w-20 h-20 mb-6 ${isRigid ? 'text-blue-500 drop-shadow-lg' : 'text-slate-700'}`} />
                  <span className={`font-black uppercase tracking-[0.2em] text-sm ${isRigid ? 'text-blue-500' : 'text-slate-700'}`}>{isRigid ? 'Solid Locked' : 'Fluid Phase'}</span>
               </div>
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                  {[...Array(40)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{top: `${Math.random()*100}%`, left: `${Math.random()*100}%`}}></div>)}
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}