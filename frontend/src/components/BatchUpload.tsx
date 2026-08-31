import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileDown, AlertCircle, ShieldCheck, FileSpreadsheet, Loader2 } from 'lucide-react';

interface BatchPredictionRow {
  row_index: number;
  amount: number;
  prediction: string;
  fraud_probability: number;
  decision_threshold: number;
  risk_level: string;
}

interface BatchPredictionResponse {
  total_rows: number;
  fraud_count: number;
  legitimate_count: number;
  results: BatchPredictionRow[];
}

interface Props {
  apiBaseUrl: string;
}

export function BatchUpload({ apiBaseUrl }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<BatchPredictionResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResponse(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
        setResponse(null);
      } else {
        setError('Please upload a valid CSV file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${apiBaseUrl}/api/v1/predict/batch`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(
        e.response?.data?.detail || 'An error occurred during batch prediction.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadResults = () => {
    if (!response) return;

    // Build CSV content
    const headers = ['Row Index', 'Amount', 'Prediction', 'Probability', 'Threshold', 'Risk Level'];
    const rows = response.results.map(r => [
      r.row_index,
      r.amount.toFixed(2),
      r.prediction,
      r.fraud_probability.toFixed(4),
      r.decision_threshold.toFixed(4),
      r.risk_level
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `batch_predictions_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Batch CSV Prediction</h2>
        <p className="text-slate-500 text-sm">
          Upload a CSV file containing transactions to predict fraud in bulk. The file must include <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">Time</code>, <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">V1</code> to <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">V28</code>, and <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">Amount</code> columns.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <p>{error}</p>
        </div>
      )}

      {/* Upload Zone */}
      {!response && (
        <div 
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-colors ${
            file ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileSpreadsheet size={32} />
          </div>
          
          {file ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">{file.name}</h3>
              <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => setFile(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-70"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? 'Processing...' : 'Upload and Predict'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Drag & Drop your CSV</h3>
              <p className="text-sm text-slate-500">or click to browse files</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results View */}
      {response && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Rows</p>
                <p className="text-2xl font-bold text-slate-800">{response.total_rows}</p>
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-1">Legitimate</p>
                <p className="text-2xl font-bold text-emerald-700">{response.legitimate_count}</p>
              </div>
              <div>
                <p className="text-sm text-rose-600 font-medium mb-1">Fraud Detected</p>
                <p className="text-2xl font-bold text-rose-700">{response.fraud_count}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setFile(null); setResponse(null); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Upload Another
              </button>
              <button
                onClick={downloadResults}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
              >
                <FileDown size={16} />
                Download CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-600">Row</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Amount</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Prediction</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Probability</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {response.results.map((row) => {
                    const isFraud = row.prediction.toLowerCase() === 'fraud';
                    return (
                      <tr key={row.row_index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-500">#{row.row_index}</td>
                        <td className="px-6 py-3">${row.amount.toFixed(2)}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            isFraud ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {isFraud ? <AlertCircle size={12} /> : <ShieldCheck size={12} />}
                            {row.prediction}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${isFraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${row.fraud_probability * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-8">
                              {(row.fraud_probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`font-semibold text-xs ${
                            row.risk_level === 'HIGH' ? 'text-rose-600' : 
                            row.risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {row.risk_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
