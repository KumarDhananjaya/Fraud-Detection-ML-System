import { useState, useEffect } from 'react';
import axios from 'axios';
import { TransactionForm, type TransactionData } from './TransactionForm';
import { PredictionResult, type PredictionData } from './PredictionResult';
import { ModelExplanation } from './ModelExplanation';
import { Activity, Database, Server, FileText, Zap } from 'lucide-react';

interface ModelInfo {
  model: string;
  version: string;
  task: string;
  threshold: number;
}

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export function Dashboard() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [activeTab, setActiveTab] = useState<'predictor' | 'docs'>('predictor');

  useEffect(() => {
    checkApiHealth();
    fetchModelInfo();
  }, []);

  const checkApiHealth = async () => {
    try {
      await axios.get(`${API_BASE_URL}/health`);
      setApiStatus('connected');
    } catch (err) {
      setApiStatus('error');
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/model`);
      setModelInfo(response.data);
    } catch (err) {
      console.error("Failed to fetch model info");
    }
  };

  const handlePredict = async (data: TransactionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/predict`, data);
      setPrediction(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to connect to the prediction API. Make sure the backend is running.");
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                <Activity size={18} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">FraudLens</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Server size={14} className="text-slate-400" />
                <span className="text-slate-600 font-medium">Backend:</span>
                {apiStatus === 'checking' && <span className="text-amber-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>Checking</span>}
                {apiStatus === 'connected' && <span className="text-emerald-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Online</span>}
                {apiStatus === 'error' && <span className="text-rose-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Offline</span>}
              </div>
              
              {modelInfo && (
                <div className="hidden sm:flex items-center gap-2 text-sm pl-6 border-l border-slate-200">
                  <Database size={14} className="text-slate-400" />
                  <span className="text-slate-600 font-medium">Model:</span>
                  <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs font-semibold border border-slate-200">
                    {modelInfo.model} v{modelInfo.version}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/60 p-1 rounded-xl inline-flex gap-1">
            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'predictor' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Zap size={16} />
              Live Predictor
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'docs' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText size={16} />
              Model Documentation
            </button>
          </div>
        </div>

        {activeTab === 'predictor' ? (
          <>
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Real-time Fraud Detection
              </h2>
              <p className="text-slate-500">
                Submit transaction features to our Machine Learning model to instantly determine the probability of fraudulent activity.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
                <Activity className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">API Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <TransactionForm onSubmit={handlePredict} isLoading={isLoading} />
              </div>
              
              <div className="lg:col-span-4 sticky top-24">
                <PredictionResult result={prediction} />
                
                {modelInfo && (
                  <div className="mt-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Database size={16} className="text-indigo-500" />
                      Model Metadata
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                        <span className="text-slate-500">Algorithm</span>
                        <span className="font-medium text-slate-700">{modelInfo.model}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                        <span className="text-slate-500">Task</span>
                        <span className="font-medium text-slate-700">{modelInfo.task}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                        <span className="text-slate-500">Version</span>
                        <span className="font-medium text-slate-700">{modelInfo.version}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                        <span className="text-slate-500">Decision Threshold</span>
                        <span className="font-medium text-slate-700">{modelInfo.threshold}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <ModelExplanation />
        )}
      </main>
    </div>
  );
}
