import React from 'react';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export interface PredictionData {
  prediction: string;
  fraud_probability: number;
  decision_threshold: number;
  risk_level: string;
}

interface PredictionResultProps {
  result: PredictionData | null;
}

export function PredictionResult({ result }: PredictionResultProps) {
  if (!result) {
    return (
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
        <Info className="w-10 h-10 mb-3 text-slate-300" />
        <p className="text-sm font-medium">No prediction yet</p>
        <p className="text-xs text-center mt-1">Submit a transaction to see the analysis result here.</p>
      </div>
    );
  }

  const isFraud = result.prediction === "Fraud";
  const riskColor = isFraud ? "text-rose-600" : "text-emerald-600";
  const bgColor = isFraud ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200";
  const progressColor = isFraud ? "bg-rose-500" : "bg-emerald-500";
  
  const percentage = (result.fraud_probability * 100).toFixed(2);

  return (
    <div className={cn("p-6 rounded-2xl shadow-sm border transition-all", bgColor)}>
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-full bg-white shadow-sm", riskColor)}>
          {isFraud ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Analysis Result
          </h3>
          <div className="flex items-baseline gap-3 mb-4">
            <span className={cn("text-3xl font-bold", riskColor)}>
              {result.prediction}
            </span>
            <span className="text-sm font-medium text-slate-600 bg-white/60 px-2 py-0.5 rounded-md border border-white/40">
              {result.risk_level} Risk
            </span>
          </div>

          <div className="space-y-3 bg-white/60 p-4 rounded-xl border border-white/40">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 font-medium">Fraud Probability</span>
                <span className="text-slate-800 font-bold">{percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", progressColor)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
              <span>Decision Threshold</span>
              <span>{(result.decision_threshold * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
