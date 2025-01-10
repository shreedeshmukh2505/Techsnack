import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  MessageCircle,
  BarChart3,
  Sparkles,
  Send,
  ChartBar,
  TrendingUp,
  Brain,
  Star,
  Zap,
  Copy
} from 'lucide-react';

const EnhancedAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  const groqApiKey = "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";
  const API_ENDPOINT = "http://127.0.0.1:7860/api/v1/run/c63a7426-7ed3-4e1f-ae82-f1ced98b28d8";

  useEffect(() => {
    setAnimateHeader(true);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractTextFromResponse = (data) => {
    try {
      return data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text || 'No analysis text available';
    } catch (err) {
      console.error('Error extracting text:', err);
      return 'Error extracting analysis text';
    }
  };

  const analyzeContent = async () => {
    if (!inputText.trim()) {
      setError('Please provide content for analysis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT + "?stream=false", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": groqApiKey
        },
        body: JSON.stringify({
          input_value: inputText,
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "Groq-MaB1J": {
              "model": "llama-3.1-8b-instant",
              "temperature": 0.1,
              "groqapi": groqApiKey
            },
            "CombineText-a3et3": {},
            "ChatOutput-H6tgv": {}
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse" />
        {/* Floating Elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-screen animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              backgroundColor: `rgba(${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, 255, 0.${Math.random() * 5 + 2})`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative">
        {/* Animated Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${animateHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Content Analyzer
            </h1>
          </div>
          <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
            Enhance your content with advanced AI-powered insights
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Instant Analysis", desc: "Get real-time insights" },
            { icon: <Brain className="w-6 h-6 text-purple-400" />, title: "AI-Powered", desc: "Advanced ML algorithms" },
            { icon: <Star className="w-6 h-6 text-cyan-400" />, title: "Smart Metrics", desc: "Detailed performance data" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                {feature.icon}
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-blue-200/70">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">
                  Content Input
                </h2>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your content for AI analysis..."
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent min-h-[300px] text-white placeholder-blue-200/50 backdrop-blur-sm transition-all duration-300"
              />

              <button
                onClick={analyzeContent}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform group-hover:translate-y-0 -translate-y-full transition-transform duration-300" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze with AI
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-start gap-2 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">
                  AI Analysis
                </h2>
              </div>
              {analysis && (
                <button
                  onClick={() => handleCopy(extractTextFromResponse(analysis))}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                >
                  {copied ? "Copied!" : "Copy"}
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {analysis ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <ChartBar className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Analysis Results</h3>
                  </div>
                  <div className="prose prose-invert max-w-none text-blue-100/90 whitespace-pre-wrap">
                    {extractTextFromResponse(analysis)}
                  </div>
                </div>
                
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm text-blue-200/70 cursor-pointer hover:text-blue-200 transition-colors duration-200">
                    <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                    Technical Details
                  </summary>
                  <pre className="mt-4 p-4 bg-black/30 rounded-xl text-xs overflow-auto border border-white/5 text-blue-200/70">
                    {JSON.stringify(analysis, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-blue-200/50 gap-4">
                <div className="relative">
                  <Brain className="w-12 h-12 animate-pulse" />
                  <div className="absolute inset-0 animate-ping-slow opacity-50">
                    <Brain className="w-12 h-12" />
                  </div>
                </div>
                <p>AI is ready to analyze your content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalyzer;