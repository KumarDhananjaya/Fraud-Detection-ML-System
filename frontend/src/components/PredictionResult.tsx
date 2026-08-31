import { ShieldCheck, AlertOctagon, Info } from 'lucide-react';

export interface PredictionData {
  prediction: string;
  fraud_probability: number;
  decision_threshold: number;
  risk_level: string;
}

interface Props {
  result: PredictionData | null;
}

export function PredictionResult({ result }: Props) {
  if (!result) {
    return (
      <div className="bg-slate-50/50 border-2 border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 min-h-[320px]">
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
          <Info className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-500">Awaiting Data</p>
        <p className="text-xs text-center mt-2 max-w-[200px] leading-relaxed">
          Submit a transaction to see the real-time ML analysis here.
        </p>
      </div>
    );
  }

  const isFraud = result.prediction.toLowerCase() === "fraud";
  const percentage = (result.fraud_probability * 100).toFixed(1);
  const thresholdPct = (result.decision_threshold * 100).toFixed(1);

  return (
    <div className={`p-1 rounded-2xl shadow-sm transition-all duration-500 ${
      isFraud ? 'bg-gradient-to-b from-rose-400 to-rose-600 shadow-rose-200' 
              : 'bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-emerald-200'
    }`}>
      <div className="bg-white rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
        {/* Background watermark icon */}
        <div className="absolute -right-8 -top-8 opacity-[0.03] pointer-events-none">
          {isFraud ? <AlertOctagon size={180} /> : <ShieldCheck size={180} />}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${
            isFraud ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {isFraud ? <AlertOctagon size={24} strokeWidth={2.5} /> : <ShieldCheck size={24} strokeWidth={2.5} />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Analysis Result
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black tracking-tight ${
                isFraud ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {isFraud ? 'FRAUD' : 'LEGITIMATE'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isFraud ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {result.risk_level} Risk
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-6">
          {/* Probability Gauge */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-slate-600">Fraud Probability</span>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{percentage}</span>
                <span className="text-slate-400 font-bold ml-1">%</span>
              </div>
            </div>
            
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
              {/* Threshold Marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10"
                style={{ left: `${thresholdPct}%` }}
                title={`Threshold: ${thresholdPct}%`}
              />
              {/* Fill */}
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  isFraud ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-semibold text-slate-400">0%</span>
              <span className="text-[10px] font-semibold text-slate-400 flex flex-col items-center">
                <span>Threshold</span>
                <span>{thresholdPct}%</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
