"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Brain, Target, Compass, MessageSquare, ChevronRight, Check, X, RefreshCw, BarChart, GitBranch, TrendingUp, Users, Link, Activity, Calculator, ShoppingCart, Percent, Award, HelpCircle, ArrowRight, MousePointer, Layers, Network, Cpu, Share2 } from 'lucide-react';

// --- Constants & Config ---
const THEME = {
  primary: "bg-red-900",
  primaryHover: "hover:bg-red-800",
  primaryText: "text-red-900",
  secondary: "bg-slate-100",
  accent: "border-red-900",
};

const apiKey = ""; // API Key injected at runtime

// --- Helper Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: `${THEME.primary} text-white ${THEME.primaryHover} shadow-md`,
    outline: `border-2 ${THEME.accent} ${THEME.primaryText} hover:bg-red-50`,
    ghost: "text-slate-600 hover:bg-slate-100",
    white: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    supervised: "bg-blue-100 text-blue-800",
    unsupervised: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
    dark: "bg-slate-800 text-white"
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[type]}`}>
      {children}
    </span>
  );
};

// --- ALGORITHM SIMULATIONS ---

// 1. Linear Regression Simulation
const LinearRegressionSim = () => {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(20);
  
  // Static dataset for "Ad Spend (x) vs Sales (y)"
  const data = [
    { x: 10, y: 30 }, { x: 20, y: 50 }, { x: 30, y: 45 }, 
    { x: 40, y: 70 }, { x: 50, y: 80 }, { x: 60, y: 85 },
    { x: 70, y: 110 }, { x: 80, y: 105 }
  ];

  const predict = (x) => slope * x + intercept;
  const mse = data.reduce((acc, point) => acc + Math.pow(point.y - predict(point.x), 2), 0) / data.length;
  const accuracyColor = mse < 150 ? "text-green-600" : mse < 500 ? "text-amber-600" : "text-red-600";

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600 w-5 h-5" /> Lab: Linear Regression
          </h4>
          <p className="text-sm text-slate-600 mt-1"><strong>Task:</strong> Adjust Slope and Intercept to minimize the Error Score.</p>
        </div>
        <div className={`text-right bg-slate-50 p-3 rounded-lg border border-slate-100 ${accuracyColor}`}>
           <div className="text-2xl font-mono font-bold">{Math.round(mse)}</div>
           <div className="text-xs uppercase font-bold tracking-wider">Error (Lower is better)</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Chart Area */}
        <div className="relative w-full h-64 bg-slate-50 border-l border-b border-slate-300 rounded-sm">
           {data.map((p, i) => (
             <div key={i} className="absolute w-3 h-3 bg-slate-800 rounded-full shadow-sm" style={{ left: `${p.x}%`, bottom: `${p.y/1.5}%` }}></div>
           ))}
           <div 
              className="absolute bg-red-600 h-1 origin-bottom-left transition-all duration-75 opacity-80"
              style={{
                left: '0',
                bottom: `${intercept/1.5}%`,
                width: '120%',
                transform: `rotate(-${Math.atan(slope/1.5) * (180/Math.PI)}deg)`
              }}
           ></div>
        </div>

        {/* Controls */}
        <div className="w-full md:w-72 space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              Slope (Angle) <span>{slope.toFixed(1)}</span>
            </label>
            <input 
              type="range" min="0" max="2" step="0.1" 
              value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))}
              className="w-full mt-2 accent-red-900 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              Intercept (Start) <span>{intercept}</span>
            </label>
            <input 
              type="range" min="0" max="50" step="1" 
              value={intercept} onChange={(e) => setIntercept(parseInt(e.target.value))}
              className="w-full mt-2 accent-red-900 cursor-pointer"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono pt-4 border-t border-slate-200">
            Formula: y = {slope.toFixed(1)}x + {intercept}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Logistic Regression Simulation
const LogisticRegressionSim = () => {
  const [score, setScore] = useState(650);
  
  const probability = 1 / (1 + Math.exp(-0.02 * (score - 700)));
  const percentage = (probability * 100).toFixed(1);
  const isApproved = probability > 0.5;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
       <div className="mb-6">
        <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Calculator className="text-blue-600 w-5 h-5" /> Lab: Logistic Regression
        </h4>
        <p className="text-sm text-slate-600 mt-1"><strong>Task:</strong> Find the credit score threshold where approval becomes likely (&gt;50%).</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-lg h-40 bg-slate-50 rounded-lg mb-8 overflow-hidden border border-slate-200 shadow-inner">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-300 border-dashed border-l-2"></div>
          <div className="absolute top-2 left-2 text-xs text-slate-400 font-bold">DENIED ZONE (0)</div>
          <div className="absolute top-2 right-2 text-xs text-slate-400 font-bold">APPROVED ZONE (1)</div>
          
          <div 
            className={`absolute bottom-0 left-0 h-full transition-all duration-300 opacity-30 ${isApproved ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
          
          <div 
             className={`absolute top-1/2 w-8 h-8 rounded-full border-4 shadow-xl transform -translate-y-1/2 -translate-x-1/2 transition-all duration-300 z-10 flex items-center justify-center text-[10px] font-bold text-white ${isApproved ? 'bg-green-600 border-white' : 'bg-red-600 border-white'}`}
             style={{ left: `${percentage}%` }}
          >
            {Math.round(percentage)}%
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-white/90 px-2 py-1 rounded border border-slate-200 z-20">
            50% Threshold
          </div>
        </div>

        <div className="w-full max-w-lg bg-slate-900 p-6 rounded-xl text-white flex items-center justify-between gap-8 shadow-xl">
           <div className="flex-grow">
             <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 block">
               Set Applicant Credit Score
             </label>
             <input 
               type="range" min="300" max="850" step="10"
               value={score} onChange={(e) => setScore(parseInt(e.target.value))}
               className="w-full accent-blue-500 cursor-pointer"
             />
             <div className="flex justify-between text-xs text-slate-500 mt-1">
               <span>300 (Poor)</span>
               <span>850 (Excellent)</span>
             </div>
           </div>
           
           <div className="text-right min-w-[120px]">
             <div className="text-4xl font-bold">{score}</div>
             <div className={`text-sm font-bold mt-1 ${isApproved ? 'text-green-400' : 'text-red-400'}`}>
               {isApproved ? 'APPROVED' : 'DENIED'}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// 3. Decision Tree Simulation
const InteractiveDecisionTree = () => {
  const [node, setNode] = useState('root');
  
  const tree = {
    root: { question: "Is Credit Score > 700?", yes: 'income_check', no: 'denied_score' },
    income_check: { question: "Is Annual Income > $50k?", yes: 'approved', no: 'denied_income' },
    approved: { result: "LOAN APPROVED", color: "text-green-400", bg: "bg-green-900/50" },
    denied_score: { result: "DENIED (Low Credit)", color: "text-red-400", bg: "bg-red-900/50" },
    denied_income: { result: "DENIED (Low Income)", color: "text-red-400", bg: "bg-red-900/50" }
  };

  const current = tree[node];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <GitBranch className="text-blue-600 w-5 h-5" /> Lab: Decision Tree
        </h4>
        <p className="text-sm text-slate-600 mt-1"><strong>Task:</strong> Navigate the logic branches to see how the algorithm makes a final decision.</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden min-h-[280px] flex items-center justify-center shadow-inner">
        <div className="relative z-10 text-center w-full max-w-md">
          {current.question ? (
            <div className="animate-fade-in w-full">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg mb-8 shadow-xl">
                <span className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Current Node</span>
                <p className="text-xl font-medium">{current.question}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setNode(current.yes)}
                  className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  Yes
                </button>
                <button 
                  onClick={() => setNode(current.no)}
                  className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in text-center">
              <div className={`text-4xl font-extrabold mb-6 ${current.color}`}>{current.result}</div>
              <button 
                onClick={() => setNode('root')}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
      </div>
    </div>
  );
};

// 4. Apriori Simulation
const AprioriSim = () => {
  const [cart, setCart] = useState([]);
  
  const items = [
    { id: 'diapers', label: 'Diapers', icon: '👶' },
    { id: 'beer', label: 'Beer', icon: '🍺' },
    { id: 'milk', label: 'Milk', icon: '🥛' },
    { id: 'bread', label: 'Bread', icon: '🍞' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' }
  ];

  const rules = [
    { if: ['diapers'], then: 'beer', confidence: 85, reason: "New dads buying diapers often grab a beer." },
    { if: ['milk', 'bread'], then: 'eggs', confidence: 70, reason: "Breakfast essentials usually go together." }
  ];

  const toggleItem = (id) => {
    setCart(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const activeRules = rules.filter(r => 
    r.if.every(i => cart.includes(i)) && !cart.includes(r.then)
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="mb-6">
        <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Link className="text-emerald-600 w-5 h-5" /> Lab: Apriori (Association)
        </h4>
        <p className="text-sm text-slate-600 mt-1"><strong>Task:</strong> Add items to the cart to trigger hidden "Rules" (Recommendations).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Shelf */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
           <h5 className="text-xs font-bold text-slate-500 uppercase mb-4">Store Shelf</h5>
           <div className="grid grid-cols-3 gap-3">
             {items.map(item => (
               <button 
                 key={item.id}
                 onClick={() => toggleItem(item.id)}
                 className={`p-3 rounded-xl border text-center transition-all ${cart.includes(item.id) ? 'bg-slate-200 border-slate-300 opacity-50 scale-95' : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md transform hover:-translate-y-1'}`}
               >
                 <div className="text-2xl mb-1">{item.icon}</div>
                 <div className="text-xs font-medium text-slate-700">{item.label}</div>
               </button>
             ))}
           </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-slate-800 text-white p-5 rounded-xl shadow-lg">
            <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Customer Cart
            </h5>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {cart.length === 0 && <span className="text-slate-500 text-sm italic">Empty cart...</span>}
              {cart.map(id => (
                <span key={id} className="px-3 py-1 bg-slate-700 rounded-full text-xs font-medium border border-slate-600">{items.find(i => i.id === id).label}</span>
              ))}
            </div>
          </div>

          <div className="min-h-[120px]">
            {activeRules.length > 0 ? (
               activeRules.map((rule, i) => (
                 <div key={i} className="bg-amber-50 border border-amber-200 p-4 rounded-xl animate-pop-in shadow-sm">
                   <div className="flex items-start gap-3">
                     <div className="p-2 bg-amber-100 rounded-full text-amber-700 mt-1">
                       <Sparkles size={16} />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-amber-900">Recommendation Triggered!</div>
                       <p className="text-sm text-amber-800 mt-1 leading-snug">
                         Customers who bought <strong>{rule.if.join(' & ')}</strong> are 85% likely to buy <strong>{rule.then.toUpperCase()}</strong>.
                       </p>
                     </div>
                   </div>
                 </div>
               ))
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl p-4">
                 Add items to see if they trigger any hidden rules...
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. K-Means Simulation
const KMeansAlgoSim = () => {
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([
    { x: 30, y: 30, color: 'bg-blue-500' },
    { x: 70, y: 70, color: 'bg-amber-500' }
  ]);

  const addPoint = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Find nearest centroid
    let nearestIndex = 0;
    let minDistance = Infinity;
    
    centroids.forEach((c, idx) => {
       const dist = Math.sqrt(Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2));
       if (dist < minDistance) {
         minDistance = dist;
         nearestIndex = idx;
       }
    });

    setPoints([...points, { x, y, color: centroids[nearestIndex].color }]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Users className="text-emerald-600 w-5 h-5" /> Lab: K-Means Clustering
          </h4>
          <p className="text-sm text-slate-600 mt-1"><strong>Task:</strong> Click anywhere to add customers. The algorithm will automatically group them.</p>
        </div>
        <Button onClick={() => setPoints([])} variant="ghost" className="text-xs">
           <RefreshCw className="w-3 h-3" /> Clear Board
        </Button>
      </div>

      <div 
        onClick={addPoint}
        className="relative w-full h-72 bg-slate-50 border border-slate-200 rounded-xl cursor-crosshair overflow-hidden hover:bg-slate-100 transition-colors"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Centroids */}
        {centroids.map((c, i) => (
           <div 
             key={i} 
             className={`absolute w-8 h-8 flex items-center justify-center font-bold text-white text-xs transform -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-white shadow-md z-20 ${c.color}`}
             style={{ left: `${c.x}%`, top: `${c.y}%` }}
           >
             C{i+1}
           </div>
        ))}

        {/* Points */}
        {points.map((p, i) => (
           <div 
             key={i} 
             className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-90 shadow-sm animate-pop-in ${p.color}`}
             style={{ left: `${p.x}%`, top: `${p.y}%` }}
           ></div>
        ))}
        
        {points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="bg-white/80 px-4 py-2 rounded-full text-slate-500 text-sm font-medium flex items-center gap-2">
               <MousePointer className="w-4 h-4" /> Click to add data points
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Algorithm Showcase Wrapper ---

const AlgorithmCard = ({ title, icon: Icon, type, description, useCase, mathConcept, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-xl border transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full
      ${isActive 
        ? 'bg-slate-50 border-red-900 shadow-lg ring-1 ring-red-900' 
        : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md hover:-translate-y-1'
      }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg transition-colors ${isActive ? 'bg-red-100 text-red-900' : type === 'supervised' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
        <Icon size={24} />
      </div>
      <Badge type={type}>{type}</Badge>
    </div>
    <h3 className={`font-bold text-lg mb-2 transition-colors ${isActive ? 'text-red-900' : 'text-slate-900'}`}>{title}</h3>
    <p className="text-slate-600 text-sm mb-4 leading-relaxed flex-grow">{description}</p>
    
    <div className="bg-white/50 rounded-lg p-3 space-y-2 border border-slate-100 mt-auto">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Use Case</div>
      <div className="text-sm text-slate-800 font-medium flex items-center gap-2">
        <Activity className="w-4 h-4 text-slate-400" /> {useCase}
      </div>
    </div>
  </div>
);

const AlgorithmShowcase = () => {
  const [filter, setFilter] = useState('all');
  const [selectedAlgoId, setSelectedAlgoId] = useState(1);
  const scrollRef = useRef(null);

  const algorithms = [
    {
      id: 1,
      title: "Linear Regression",
      type: "supervised",
      icon: TrendingUp,
      description: "Predicts a continuous value (number) by fitting a straight line through data points.",
      useCase: "Forecasting Sales Revenue",
      mathConcept: "y = mx + b"
    },
    {
      id: 2,
      title: "Logistic Regression",
      type: "supervised",
      icon: Calculator,
      description: "Predicts the probability (0 to 1) of an event happening (Yes/No).",
      useCase: "Customer Churn Risk",
      mathConcept: "Sigmoid Function"
    },
    {
      id: 3,
      title: "Decision Trees",
      type: "supervised",
      icon: GitBranch,
      description: "Splits data into branches based on rules. Like a flowchart of 'If/Else' statements.",
      useCase: "Loan Approval",
      mathConcept: "Entropy"
    },
    {
      id: 4,
      title: "K-Means Clustering",
      type: "unsupervised",
      icon: Users,
      description: "Groups data into 'K' clusters based on distance to center points (centroids).",
      useCase: "Customer Segmentation",
      mathConcept: "Euclidean Distance"
    },
    {
      id: 5,
      title: "Apriori (Association)",
      type: "unsupervised",
      icon: Link,
      description: "Finds relationships: 'If Item A is bought, Item B is likely to be bought'.",
      useCase: "Market Basket Analysis",
      mathConcept: "Confidence"
    }
  ];

  const filteredAlgos = filter === 'all' ? algorithms : algorithms.filter(a => a.type === filter);

  const handleAlgoClick = (id) => {
    setSelectedAlgoId(id);
    setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const renderSimulation = () => {
    switch(selectedAlgoId) {
      case 1: return <LinearRegressionSim />;
      case 2: return <LogisticRegressionSim />;
      case 3: return <InteractiveDecisionTree />;
      case 4: return <KMeansAlgoSim />;
      case 5: return <AprioriSim />;
      default: return <LinearRegressionSim />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Algorithm Arsenal</h2>
        <p className="text-slate-600">
          Select an algorithm below to launch its specific interactive simulation.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {['all', 'supervised', 'unsupervised'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f 
              ? 'bg-slate-800 text-white shadow-lg' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgos.map(algo => (
          <AlgorithmCard 
            key={algo.id} 
            {...algo} 
            isActive={selectedAlgoId === algo.id}
            onClick={() => handleAlgoClick(algo.id)}
          />
        ))}
      </div>

      <div ref={scrollRef} className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px bg-slate-200 flex-grow"></div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <MousePointer className="w-3 h-3" /> Practice Lab Area
           </span>
           <div className="h-px bg-slate-200 flex-grow"></div>
        </div>
        
        {renderSimulation()}
      </div>
    </div>
  );
};

// --- DEEP LEARNING SECTION ---

const CorporateNeuralNetwork = () => {
  const [activeStage, setActiveStage] = useState('idle'); // idle, processing, done
  
  const startSimulation = () => {
    setActiveStage('input');
    setTimeout(() => setActiveStage('hidden1'), 1000);
    setTimeout(() => setActiveStage('hidden2'), 2500);
    setTimeout(() => setActiveStage('output'), 4000);
    setTimeout(() => setActiveStage('done'), 5000);
  };

  const LayerNode = ({ role, title, isActive, delay }) => (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-700 w-32 text-center z-10
      ${isActive ? 'bg-red-50 border-red-500 scale-110 shadow-lg' : 'bg-white border-slate-200 text-slate-400'}
    `}>
      <div className={`text-xs font-bold uppercase mb-1 ${isActive ? 'text-red-900' : 'text-slate-400'}`}>{role}</div>
      <div className={`text-sm font-medium leading-tight ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>{title}</div>
      
      {/* Connector Line Logic (Simplified for visual) */}
      {role !== 'Director' && (
        <div className={`absolute top-1/2 -right-8 w-8 h-0.5 transition-all duration-500 ${isActive ? 'bg-red-300' : 'bg-slate-100'}`}></div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">The Corporate Neural Network</h3>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Neural networks work like a company. Information flows from <strong>Junior Analysts</strong> (Input) to <strong>Team Leads</strong> (Hidden Layers) up to the <strong>Director</strong> (Output) who makes the final call.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto bg-slate-50 rounded-xl p-8 border border-slate-100 overflow-hidden">
         {/* Layer Labels */}
         <div className="grid grid-cols-3 gap-8 mb-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div>Input Layer</div>
            <div>Hidden Layers</div>
            <div>Output Layer</div>
         </div>

         <div className="grid grid-cols-3 gap-8 relative z-20">
            {/* INPUT LAYER (Juniors) */}
            <div className="space-y-4 flex flex-col justify-center">
               <LayerNode 
                 role="Jr. Analyst" title="See: Sq. Footage" 
                 isActive={activeStage === 'input' || activeStage === 'hidden1' || activeStage === 'hidden2' || activeStage === 'output' || activeStage === 'done'} 
               />
               <LayerNode 
                 role="Jr. Analyst" title="See: Location" 
                 isActive={activeStage === 'input' || activeStage === 'hidden1' || activeStage === 'hidden2' || activeStage === 'output' || activeStage === 'done'} 
               />
               <LayerNode 
                 role="Jr. Analyst" title="See: Condition" 
                 isActive={activeStage === 'input' || activeStage === 'hidden1' || activeStage === 'hidden2' || activeStage === 'output' || activeStage === 'done'} 
               />
            </div>

            {/* HIDDEN LAYERS (Managers) */}
            <div className="space-y-12 flex flex-col justify-center">
               <LayerNode 
                 role="Team Lead" title="Combine: Size Score" 
                 isActive={activeStage === 'hidden1' || activeStage === 'hidden2' || activeStage === 'output' || activeStage === 'done'} 
               />
               <LayerNode 
                 role="Team Lead" title="Combine: Area Value" 
                 isActive={activeStage === 'hidden1' || activeStage === 'hidden2' || activeStage === 'output' || activeStage === 'done'} 
               />
            </div>

            {/* OUTPUT LAYER (Director) */}
            <div className="flex flex-col justify-center items-center">
               <LayerNode 
                 role="Director" title="Predict: Price $$" 
                 isActive={activeStage === 'output' || activeStage === 'done'} 
               />
               
               {activeStage === 'done' && (
                 <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold animate-pop-in">
                   $450,000
                 </div>
               )}
            </div>
         </div>

         {/* Start Button */}
         <div className="mt-12 text-center">
            <Button onClick={startSimulation} disabled={activeStage !== 'idle' && activeStage !== 'done'}>
               {activeStage === 'idle' || activeStage === 'done' ? 'Process Data Request' : 'Processing...'}
            </Button>
         </div>
      </div>
    </div>
  );
};

const DeepLearningSection = () => {
  return (
    <div className="space-y-12 animate-fade-in">
       {/* 1. The Relationship (Venn Diagram) */}
       <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
             <h2 className="text-3xl font-bold text-slate-900 mb-4">The "Russian Doll" Relationship</h2>
             <p className="text-lg text-slate-600 mb-6 leading-relaxed">
               People often use AI, Machine Learning, and Deep Learning interchangeably, but they are subsets of each other.
             </p>
             <ul className="space-y-4">
                <li className="flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <Cpu className="text-slate-600" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800">Artificial Intelligence (AI)</h4>
                      <p className="text-sm text-slate-500">The broad umbrella. Any technique that enables computers to mimic human intelligence.</p>
                   </div>
                </li>
                <li className="flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Network className="text-blue-600" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800">Machine Learning (ML)</h4>
                      <p className="text-sm text-slate-500">A subset of AI. Algorithms that improve at tasks with experience (data) without being explicitly programmed.</p>
                   </div>
                </li>
                <li className="flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Layers className="text-red-600" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800">Deep Learning (DL)</h4>
                      <p className="text-sm text-slate-500">A subset of ML. Uses <strong>Neural Networks</strong> with many layers to solve complex problems (like vision or speech).</p>
                   </div>
                </li>
             </ul>
          </div>
          
          {/* Visual Representation */}
          <div className="bg-slate-50 p-8 rounded-full border border-slate-200 aspect-square flex items-center justify-center relative shadow-inner">
             <div className="absolute top-8 text-sm font-bold text-slate-400">ARTIFICIAL INTELLIGENCE</div>
             <div className="w-3/4 h-3/4 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center relative shadow-sm">
                <div className="absolute top-6 text-sm font-bold text-blue-400">MACHINE LEARNING</div>
                <div className="w-1/2 h-1/2 bg-red-50 rounded-full border border-red-200 flex items-center justify-center relative shadow-sm animate-pulse-slow">
                   <div className="text-center">
                     <Layers className="w-8 h-8 text-red-500 mx-auto mb-1" />
                     <span className="text-xs font-bold text-red-600">DEEP LEARNING</span>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* 2. Corporate Hierarchy Analogy */}
       <div className="pt-8 border-t border-slate-200">
         <CorporateNeuralNetwork />
       </div>
    </div>
  );
};

// --- Quiz Component ---

const QuizMode = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answerState, setAnswerState] = useState(null); 

  const questions = [
    {
      id: 1,
      scenario: "You work for Netflix. You want to recommend movies to User A based on what User B watched, because they have similar viewing history.",
      type: "Unsupervised",
      algorithm: "Collaborative Filtering (Association)",
      explanation: "You don't have a label telling you what User A likes yet; you are finding hidden patterns/groupings between similar users."
    },
    {
      id: 2,
      scenario: "You are a bank. You want to automatically flag transactions as 'Fraud' or 'Legit' based on 5 years of labeled historical data.",
      type: "Supervised",
      algorithm: "Classification (Random Forest/Logistic Regression)",
      explanation: "You have a 'Teacher' (historical data with labels) and a clear target variable (Fraud/Not Fraud)."
    },
    {
      id: 3,
      scenario: "You are launching a new clothing line in a new country. You have no sales data, but you want to identify different 'fashion personas' in the population to target ads.",
      type: "Unsupervised",
      algorithm: "Clustering (K-Means)",
      explanation: "You don't know the personas ahead of time. You need the algorithm to discover the natural groups in the demographic data."
    },
    {
      id: 4,
      scenario: "You want to predict the exact price (in dollars) a house will sell for based on its square footage and zip code.",
      type: "Supervised",
      algorithm: "Regression",
      explanation: "You are predicting a continuous numerical value based on historical examples."
    },
    {
      id: 5,
      scenario: "A grocery store wants to know: 'If a customer buys Bread, what is the probability they also buy Butter?'",
      type: "Unsupervised",
      algorithm: "Association Rules (Apriori)",
      explanation: "This is Market Basket Analysis. It looks for relationships between items without a target prediction."
    }
  ];

  const handleAnswer = (selectedType) => {
    const isCorrect = selectedType === questions[currentQuestion].type;
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setAnswerState(null);
      } else {
        setShowResult(true);
      }
    }, 2500);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setAnswerState(null);
  };

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 animate-fade-in py-10">
        <div className="inline-block p-6 rounded-full bg-red-50 mb-4">
          <Award size={64} className="text-red-900" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Quiz Complete!</h2>
        <div className="text-5xl font-extrabold text-red-900 mb-4">{score} / {questions.length}</div>
        <p className="text-slate-600">
          {score === 5 ? "Perfect Score! You are a Machine Learning Strategist." : 
           score >= 3 ? "Good job! You understand the core concepts." : 
           "Keep practicing with the simulations and try again!"}
        </p>
        <Button onClick={restart} className="mx-auto">Try Again</Button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-red-900 h-full transition-all duration-500" 
          style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg relative overflow-hidden min-h-[400px] flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scenario {currentQuestion + 1} of {questions.length}</span>
            <HelpCircle className="w-5 h-5 text-slate-300" />
          </div>
          
          <h3 className="text-xl font-medium text-slate-800 leading-relaxed mb-8">
            "{q.scenario}"
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleAnswer('Supervised')}
              disabled={answerState !== null}
              className={`p-6 rounded-lg border-2 text-lg font-bold transition-all flex flex-col items-center gap-2
                ${answerState === null ? 'border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-600' : ''}
                ${answerState && q.type === 'Supervised' ? 'bg-green-50 border-green-500 text-green-700' : ''}
                ${answerState === 'incorrect' && q.type !== 'Supervised' ? 'opacity-50' : ''}
              `}
            >
              <Target size={32} />
              Supervised
            </button>
            <button 
              onClick={() => handleAnswer('Unsupervised')}
              disabled={answerState !== null}
              className={`p-6 rounded-lg border-2 text-lg font-bold transition-all flex flex-col items-center gap-2
                ${answerState === null ? 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600' : ''}
                ${answerState && q.type === 'Unsupervised' ? 'bg-green-50 border-green-500 text-green-700' : ''}
                ${answerState === 'incorrect' && q.type !== 'Unsupervised' ? 'opacity-50' : ''}
              `}
            >
              <Compass size={32} />
              Unsupervised
            </button>
          </div>
        </div>

        {answerState && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in backdrop-blur-sm">
             <div className={`mb-4 p-3 rounded-full ${answerState === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
               {answerState === 'correct' ? <Check size={40} /> : <X size={40} />}
             </div>
             <h4 className={`text-2xl font-bold mb-2 ${answerState === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
               {answerState === 'correct' ? 'Correct!' : 'Incorrect'}
             </h4>
             <p className="text-slate-600 mb-2">
               The correct answer is <strong>{q.type}</strong>.
             </p>
             <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100 max-w-md">
               <strong>Why?</strong> {q.explanation} <br/>
               <span className="text-xs text-slate-400 mt-2 block font-mono">Algorithm: {q.algorithm}</span>
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Gen AI Feature ---

const AIStrategyConsultant = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeScenario = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const systemPrompt = `You are an expert Data Science Professor for MBA students.
      The user will provide a business scenario.
      Your task:
      1. Identify if it is a Supervised Learning (Classification/Regression), Unsupervised Learning (Clustering/Association), or Deep Learning (e.g. Image/NLP) problem.
      2. Recommend a specific algorithm (e.g., Random Forest, CNN, LSTM).
      3. Explain WHY in 1-2 concise sentences using business terminology.
      4. Format the output as JSON: { "type": "Type Name", "algorithm": "Algorithm Name", "reasoning": "..." }`;

      const payload = {
        contents: [{ parts: [{ text: input }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error.message);
      
      const content = JSON.parse(data.candidates[0].content.parts[0].text);
      setResponse(content);

    } catch (err) {
      console.error(err);
      setError("AI Service Unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Brain size={150} />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="text-yellow-400 w-5 h-5" /> AI Strategy Consultant
        </h3>
        <p className="text-slate-300 text-sm mb-6 max-w-lg">
          Not sure which model to use? Describe your business problem below, and our AI will recommend the best strategy and algorithm.
        </p>
        
        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I want to analyze customer sentiment from thousands of support emails..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none resize-none h-32"
          />
          
          <Button 
            onClick={analyzeScenario} 
            disabled={loading || !input}
            className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-none py-3"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Analyze Scenario"}
          </Button>

          {response && (
            <div className="bg-slate-800/80 backdrop-blur rounded-lg p-6 border border-slate-600 animate-fade-in mt-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge type="dark">
                  {response.type}
                </Badge>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-white font-bold text-sm flex items-center gap-1">
                   <Activity className="w-3 h-3 text-red-400" /> Recommended: {response.algorithm}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed text-sm">
                {response.reasoning}
              </p>
            </div>
          )}

          {error && (
             <div className="text-red-400 text-xs mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <style>{`
        @keyframes pop-in { 0% { transform: translate(-50%, -50%) scale(0); } 70% { transform: translate(-50%, -50%) scale(1.2); } 100% { transform: translate(-50%, -50%) scale(1); } }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-red-900">
            <BarChart className="w-6 h-6" /> ML<span className="text-slate-800">Strategies</span>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {['learn', 'algorithms', 'deep-learning', 'quiz', 'consult'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-red-50 text-red-900' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12 mb-20">
        
        {/* Hero / Learn Section */}
        {activeTab === 'learn' && (
          <div className="animate-fade-in space-y-12">
            <section className="text-center space-y-6 py-10">
              <Badge type="red">Interactive Module</Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Supervised vs. <span className="text-red-900">Unsupervised</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Machine learning isn't magic. It's a strategic choice between a <span className="font-bold text-slate-900">Teacher (Supervised)</span> and an <span className="font-bold text-slate-900">Explorer (Unsupervised)</span>.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                 <Button onClick={() => setActiveTab('algorithms')} className="px-8 py-3 text-lg">
                    Start Learning <ChevronRight className="w-5 h-5" />
                 </Button>
              </div>
            </section>

            {/* Concept Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-600">
                <div className="p-8">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-700 shadow-sm">
                    <Target size={28} />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Supervised Learning</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    The model learns from <strong>labeled data</strong> (history) where the answer key is known. It tries to map inputs to outputs to predict the future.
                  </p>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <span><strong>Analogy:</strong> A student learning from flashcards with answers on the back.</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <span><strong>Sub-types:</strong> Classification (Categories) & Regression (Values).</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-emerald-500">
                <div className="p-8">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 shadow-sm">
                    <Compass size={28} />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Unsupervised Learning</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    The model looks at <strong>unlabeled data</strong> (raw info) without an answer key. It tries to find hidden structures, patterns, or groupings on its own.
                  </p>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <span><strong>Analogy:</strong> An explorer mapping a new territory without a guide.</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <span><strong>Sub-types:</strong> Clustering (Grouping) & Association (Rules).</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Algorithms Tab */}
        {activeTab === 'algorithms' && (
          <AlgorithmShowcase />
        )}

        {/* Deep Learning Tab */}
        {activeTab === 'deep-learning' && (
          <DeepLearningSection />
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Strategy Assessment</h2>
              <p className="text-slate-600">Can you match the real-world problem to the correct machine learning approach?</p>
            </div>
            <QuizMode />
            <div className="flex justify-center pt-8">
               <Button onClick={() => setActiveTab('consult')} variant="ghost" className="w-full max-w-md py-4 text-lg">
                  Need Help? Ask the AI <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </div>
          </div>
        )}

        {/* AI Consultant Tab */}
        {activeTab === 'consult' && (
          <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
             <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">AI Strategy Consultant</h2>
              <p className="text-slate-600">Leverage Gen AI to solve your specific business dilemma.</p>
            </div>
            
            <AIStrategyConsultant />

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mt-8">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Try these prompts:
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                 <button 
                   onClick={() => document.querySelector('textarea').value = "I want to analyze 10,000 product reviews to automatically detect if customers are angry or happy."}
                   className="text-left p-3 bg-white rounded-lg border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all text-sm text-slate-600"
                 >
                   "Sentiment analysis of reviews..."
                 </button>
                 <button 
                   onClick={() => document.querySelector('textarea').value = "I have a list of thousands of customer purchases. I want to know which items are frequently bought together so I can create bundles."}
                   className="text-left p-3 bg-white rounded-lg border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all text-sm text-slate-600"
                 >
                   "Find product bundles..."
                 </button>
                 <button 
                   onClick={() => document.querySelector('textarea').value = "I need to build a system that can recognize faces in security camera footage."}
                   className="text-left p-3 bg-white rounded-lg border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all text-sm text-slate-600"
                 >
                   "Face recognition..."
                 </button>
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-slate-400 text-sm">
          <p className="mb-2">Machine Learning Strategy Module • Ivy Pro Theme</p>
          <p className="text-xs">Built for Executive Education</p>
        </div>
      </footer>
    </div>
  );
};

export default App;