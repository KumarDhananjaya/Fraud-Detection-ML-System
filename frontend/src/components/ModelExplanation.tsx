import { BarChart3, Binary, BrainCircuit, GitMerge, Search, ShieldAlert, Sparkles, Target } from 'lucide-react';

export function ModelExplanation() {
  const metrics = {
    precision: 0.8806,
    recall: 0.7973,
    f1: 0.8369,
    roc_auc: 0.9681,
    pr_auc: 0.8399,
  };

  const confusionMatrix = {
    tn: 42640,
    fp: 8,
    fn: 15,
    tp: 59,
  };

  const featureImportance = [
    { name: 'V14', value: 3.105, width: '100%' },
    { name: 'V4', value: 2.320, width: '75%' },
    { name: 'V12', value: 0.827, width: '27%' },
    { name: 'V10', value: 0.795, width: '25%' },
    { name: 'V3', value: 0.499, width: '16%' },
    { name: 'V26', value: 0.403, width: '13%' },
    { name: 'V11', value: 0.380, width: '12%' },
    { name: 'Amount', value: 0.328, width: '10%' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
          How the Model Works
        </h2>
        <p className="text-lg text-slate-500">
          An inside look at the pipeline: from Exploratory Data Analysis (EDA) and handling massive class imbalance, to training the final XGBoost model.
        </p>
      </div>

      {/* Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PipelineStep 
          icon={<Search />}
          title="1. Exploratory Data Analysis"
          description="Analyzed 284,807 transactions. Identified a massive class imbalance where frauds accounted for only 0.172% of all data. Time and Amount distributions were carefully plotted."
        />
        <PipelineStep 
          icon={<Binary />}
          title="2. Data Preprocessing"
          description="Scaled Time and Amount features using RobustScaler to handle outliers. The V1-V28 features were already PCA-transformed by the dataset provider."
        />
        <PipelineStep 
          icon={<GitMerge />}
          title="3. Handling Imbalance"
          description="Experimented with SMOTE (Synthetic Minority Oversampling Technique) and class weights. Ultimately, tuning `scale_pos_weight` in XGBoost provided the best organic results."
        />
        <PipelineStep 
          icon={<Sparkles />}
          title="4. Model Training"
          description="Trained a Random Forest baseline, then upgraded to XGBoost. Used Optuna for Bayesian hyperparameter tuning to maximize the PR-AUC score."
        />
      </div>

      {/* Results & Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Confusion Matrix */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800">Confusion Matrix</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Evaluated on the hold-out test set. The model successfully caught 59 frauds while only making 8 false alarms out of over 42,000 genuine transactions.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="flex items-end justify-center pb-2 font-medium text-slate-400">Actual \ Pred</div>
            <div className="font-semibold text-slate-700 pb-2">Predicted Genuine</div>
            <div className="font-semibold text-slate-700 pb-2">Predicted Fraud</div>

            <div className="font-semibold text-slate-700 flex items-center justify-end pr-4">Actual Genuine</div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col justify-center">
              <span className="text-2xl font-bold text-emerald-700">{confusionMatrix.tn.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-medium">True Negatives</span>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex flex-col justify-center">
              <span className="text-2xl font-bold text-rose-700">{confusionMatrix.fp}</span>
              <span className="text-xs text-rose-600 font-medium">False Positives</span>
            </div>

            <div className="font-semibold text-slate-700 flex items-center justify-end pr-4">Actual Fraud</div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col justify-center">
              <span className="text-2xl font-bold text-amber-700">{confusionMatrix.fn}</span>
              <span className="text-xs text-amber-600 font-medium">False Negatives</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col justify-center">
              <span className="text-2xl font-bold text-emerald-700">{confusionMatrix.tp}</span>
              <span className="text-xs text-emerald-600 font-medium">True Positives</span>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-800">SHAP Feature Importance</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Using SHAP (SHapley Additive exPlanations) values to interpret the model. Features V14 and V4 are the strongest indicators of fraudulent behavior.
          </p>

          <div className="space-y-4">
            {featureImportance.map((feat) => (
              <div key={feat.name} className="flex items-center gap-4">
                <span className="w-16 text-sm font-semibold text-slate-700 text-right">{feat.name}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: feat.width }}
                  />
                </div>
                <span className="w-12 text-xs text-slate-500">{feat.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
          <ShieldAlert className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
          <h3 className="text-xl font-bold mb-6">Final Model Performance (Threshold = 0.83)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <MetricBox label="Precision" value={`${(metrics.precision * 100).toFixed(1)}%`} />
            <MetricBox label="Recall" value={`${(metrics.recall * 100).toFixed(1)}%`} />
            <MetricBox label="F1-Score" value={`${(metrics.f1 * 100).toFixed(1)}%`} />
            <MetricBox label="PR-AUC" value={`${(metrics.pr_auc * 100).toFixed(1)}%`} />
            <MetricBox label="ROC-AUC" value={`${(metrics.roc_auc * 100).toFixed(1)}%`} />
          </div>
        </div>

      </div>
    </div>
  );
}

function PipelineStep({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function MetricBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-indigo-200 text-sm font-medium mb-1">{label}</span>
      <span className="text-3xl font-extrabold tracking-tight">{value}</span>
    </div>
  );
}
