import { useState, useEffect } from 'react';
import axios from 'axios';
import { TransactionForm, type TransactionData } from './TransactionForm';
import { PredictionResult, type PredictionData } from './PredictionResult';
import { ModelExplanation } from './ModelExplanation';
import { BatchUpload } from './BatchUpload';
import {
  Activity,
  Database,
  Server,
  FileText,
  Zap,
  Upload,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface ModelInfo {
  model: string;
  version: string;
  task: string;
  threshold: number;
}

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

type Tab = 'predictor' | 'batch' | 'docs';

export function Dashboard() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [activeTab, setActiveTab] = useState<Tab>('predictor');

  useEffect(() => {
    checkApiHealth();
    fetchModelInfo();
  }, []);

  const checkApiHealth = async () => {
    try {
      await axios.get(`${API_BASE_URL}/health`);
      setApiStatus('connected');
    } catch {
      setApiStatus('error');
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/model`);
      setModelInfo(response.data);
    } catch {
      console.error('Failed to fetch model info');
    }
  };

  const handlePredict = async (data: TransactionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/predict`, data);
      setPrediction(response.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(
        e.response?.data?.detail ||
          'Failed to connect to the prediction API. Make sure the backend is running.'
      );
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'predictor', label: 'Live Predictor', icon: <Zap size={15} /> },
    { id: 'batch', label: 'Batch Upload', icon: <Upload size={15} /> },
    { id: 'docs', label: 'Model Docs', icon: <FileText size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl hero-gradient flex items-center justify-center shadow-md">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-none">FraudLens</h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  ML Fraud Detection
                </p>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              {/* API Status */}
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <Server size={13} className="text-slate-400" />
                <span className="text-slate-500 font-medium">API</span>
                {apiStatus === 'checking' && (
                  <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 status-pulse" />
                    Checking
                  </span>
                )}
                {apiStatus === 'connected' && (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                )}
                {apiStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Offline
                  </span>
                )}
              </div>

              {/* Model badge */}
              {modelInfo && (
                <div className="hidden sm:flex items-center gap-2 text-xs pl-4 border-l border-slate-200">
                  <Database size={13} className="text-indigo-400" />
                  <span className="text-slate-500 font-medium">Model</span>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold">
                    {modelInfo.model} v{modelInfo.version}
                  </span>
                </div>
              )}

              {/* Threshold pill */}
              {modelInfo && (
                <div className="hidden md:flex items-center gap-2 text-xs pl-4 border-l border-slate-200">
                  <TrendingUp size={13} className="text-slate-400" />
                  <span className="text-slate-500 font-medium">Threshold</span>
                  <span className="font-semibold text-slate-700">
                    {(modelInfo.threshold * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-indigo-200" />
              <span className="text-indigo-200 text-sm font-medium tracking-wide uppercase">
                Real-time Detection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Credit Card Fraud Detection
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
              Powered by XGBoost with Bayesian-tuned hyperparameters. Analyze individual
              transactions or upload a CSV file to run batch predictions.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 shrink-0">
            {[
              { label: 'PR-AUC', value: '84.0%' },
              { label: 'Precision', value: '88.1%' },
              { label: 'Recall', value: '79.7%' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-center"
              >
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-indigo-200 text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {activeTab === 'predictor' && (
          <>
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
                <Activity className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                <div>
                  <h4 className="font-semibold mb-1">API Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <TransactionForm onSubmit={handlePredict} isLoading={isLoading} />
              </div>

              <div className="lg:col-span-4 space-y-5 sticky top-32">
                <PredictionResult result={prediction} />

                {modelInfo && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Database size={15} className="text-indigo-500" />
                      Model Metadata
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      {[
                        { label: 'Algorithm', value: modelInfo.model },
                        { label: 'Task', value: modelInfo.task },
                        { label: 'Version', value: modelInfo.version },
                        {
                          label: 'Decision Threshold',
                          value: `${(modelInfo.threshold * 100).toFixed(1)}%`,
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                        >
                          <span className="text-slate-500">{row.label}</span>
                          <span className="font-semibold text-slate-800 text-xs bg-slate-100 px-2 py-1 rounded-md">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'batch' && <BatchUpload apiBaseUrl={API_BASE_URL} />}

        {activeTab === 'docs' && <ModelExplanation />}
      </main>
    </div>
  );
}
