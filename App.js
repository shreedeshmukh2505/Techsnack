import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle, Loader2, BarChart2, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Alert, AlertDescription } from './ui/alert.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SocialMediaAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const groqApiKey = "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";
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [sampleData, setSampleData] = useState([]);
  const [sentimentHistory, setSentimentHistory] = useState([]);

  useEffect(() => {
    // Generate sample historical data for demo purposes
    const generateSampleData = () => {
      const data = [];
      for (let i = 0; i < 7; i++) {
        data.push({
          date: `Day ${i + 1}`,
          engagement: Math.floor(Math.random() * 1000),
          sentiment: (Math.random() * 100).toFixed(2),
          shares: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 300)
        });
      }
      setSampleData(data);
    };

    generateSampleData();
  }, []);

  const extractTextFromResponse = (data) => {
    try {
      const text = data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text || 'No analysis text available';
      // Simulate sentiment analysis result
      const sentiment = Math.random() * 100;
      const newSentimentData = {
        timestamp: new Date().toLocaleTimeString(),
        sentiment: sentiment.toFixed(2)
      };
      setSentimentHistory(prev => [...prev, newSentimentData].slice(-10));
      return text;
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
      const response = await fetch("http://127.0.0.1:7860/api/v1/run/c63a7426-7ed3-4e1f-ae82-f1ced98b28d8", {
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

  const renderMetricCard = (icon, title, value, trend) => (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-medium text-gray-700">{title}</h3>
          </div>
          <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );

  const TabButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Social Media Content Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive insights about your social media content with advanced analytics and visualizations
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {renderMetricCard(
            <ThumbsUp className="w-5 h-5 text-blue-500" />,
            'Engagement Rate',
            '8.4%',
            2.5
          )}
          {renderMetricCard(
            <MessageCircle className="w-5 h-5 text-green-500" />,
            'Average Comments',
            '245',
            -1.2
          )}
          {renderMetricCard(
            <Share2 className="w-5 h-5 text-purple-500" />,
            'Share Rate',
            '12.3%',
            5.7
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Content Input
                <span className="text-sm font-normal text-gray-500">
                  (Paste your content below)
                </span>
              </h2>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your social media content here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] text-gray-700 placeholder-gray-400"
              />

              <button
                onClick={analyzeContent}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Content
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Engagement Chart */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="#4F46E5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex gap-4 mb-6">
              <TabButton
                label="Analysis"
                active={activeTab === 'analysis'}
                onClick={() => setActiveTab('analysis')}
              />
              <TabButton
                label="Metrics"
                active={activeTab === 'metrics'}
                onClick={() => setActiveTab('metrics')}
              />
              <TabButton
                label="Sentiment"
                active={activeTab === 'sentiment'}
                onClick={() => setActiveTab('sentiment')}
              />
            </div>
            
            {activeTab === 'analysis' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
                {analysis ? (
                  <div className="prose max-w-none">
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                      {extractTextFromResponse(analysis)}
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-gray-500">
                    Your analysis results will appear here
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Engagement Metrics</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="shares" fill="#8884d8" />
                    <Bar dataKey="comments" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'sentiment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sentimentHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sentiment" stroke="#4F46E5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {analysis && (
              <details className="group mt-6">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    View Raw Response
                  </span>
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAnalyzer;