import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export interface TransactionData {
  Time: number;
  Amount: number;
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
  V9: number;
  V10: number;
  V11: number;
  V12: number;
  V13: number;
  V14: number;
  V15: number;
  V16: number;
  V17: number;
  V18: number;
  V19: number;
  V20: number;
  V21: number;
  V22: number;
  V23: number;
  V24: number;
  V25: number;
  V26: number;
  V27: number;
  V28: number;
}

const defaultData: TransactionData = {
  Time: 0, Amount: 0,
  V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0, V8: 0, V9: 0, V10: 0,
  V11: 0, V12: 0, V13: 0, V14: 0, V15: 0, V16: 0, V17: 0, V18: 0, V19: 0, V20: 0,
  V21: 0, V22: 0, V23: 0, V24: 0, V25: 0, V26: 0, V27: 0, V28: 0
};

// Sample data to simulate fraud and genuine cases
const sampleGenuine: TransactionData = {
  Time: 120, Amount: 14.50,
  V1: -1.35, V2: -0.07, V3: 2.53, V4: 1.37, V5: -0.33, V6: 0.46, V7: 0.23, V8: 0.09, V9: 0.36, V10: 0.09,
  V11: -0.55, V12: -0.61, V13: -0.99, V14: -0.31, V15: 1.46, V16: -0.47, V17: 0.20, V18: 0.02, V19: 0.40, V20: 0.25,
  V21: -0.01, V22: 0.27, V23: -0.11, V24: 0.06, V25: 0.12, V26: -0.18, V27: 0.13, V28: -0.02
};

const sampleFraud: TransactionData = {
  Time: 406, Amount: 0.00,
  V1: -2.31, V2: 1.95, V3: -1.60, V4: 3.99, V5: -0.52, V6: -1.42, V7: -2.53, V8: 1.39, V9: -2.77, V10: -2.77,
  V11: 3.20, V12: -2.89, V13: -0.59, V14: -4.28, V15: 0.38, V16: -1.14, V17: -2.83, V18: -0.01, V19: 0.41, V20: 0.12,
  V21: 0.51, V22: -0.03, V23: -0.46, V24: 0.32, V25: 0.04, V26: 0.10, V27: 0.24, V28: -0.20
};

interface TransactionFormProps {
  onSubmit: (data: TransactionData) => void;
  isLoading: boolean;
}

export function TransactionForm({ onSubmit, isLoading }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionData>(defaultData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Transaction Details</h2>
          <p className="text-sm text-slate-500">Enter transaction features manually or use demo data.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFormData(sampleGenuine)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
          >
            <ShieldCheck size={16} />
            Demo Genuine
          </button>
          <button
            type="button"
            onClick={() => setFormData(sampleFraud)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
          >
            <AlertCircle size={16} />
            Demo Fraud
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
            <input
              type="number"
              step="any"
              name="Time"
              value={formData.Time}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Amount</label>
            <input
              type="number"
              step="any"
              name="Amount"
              value={formData.Amount}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => (
            <div key={`V${num}`} className="col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">V{num}</label>
              <input
                type="number"
                step="any"
                name={`V${num}`}
                value={formData[`V${num}` as keyof TransactionData]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-sm",
              isLoading 
                ? "bg-indigo-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow"
            )}
          >
            {isLoading ? "Analyzing..." : "Analyze Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
