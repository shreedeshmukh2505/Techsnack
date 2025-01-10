import React, { useState } from 'react';

const Navbar = () => (
  <nav className="bg-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-gray-800">
          Social Media Analyzer
        </span>
        <a
          href="https://www.groq.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800"
        >
          Groq Docs
        </a>
      </div>
    </div>
  </nav>
);

const SocialMediaAnalyzer = () => {
  const [inputText, setInputText] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_ENDPOINT = "http://127.0.0.1:7860/api/v1/run/c63a7426-7ed3-4e1f-ae82-f1ced98b28d8";

  const analyzeContent = async () => {
    if (!inputText.trim() || !groqApiKey.trim()) {
      setError('Please provide both API key and content');
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Social Media Content Analyzer
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groq API Key:
            </label>
            <input
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your social media content:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your social media content here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
            />
          </div>

          <button
            onClick={analyzeContent}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Content'}
          </button>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Results</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Navbar />
      <SocialMediaAnalyzer />
    </>
  );
};

export default App;