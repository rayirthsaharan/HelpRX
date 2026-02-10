import React, { useState } from 'react';
import { SymptomForm } from './components/SymptomForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeSymptoms } from './services/geminiService';
import { AnalysisResult, FormData, LoadingState } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setStatus(LoadingState.LOADING);
    setError(null);
    try {
      const analysis = await analyzeSymptoms(data.age, data.weight, data.symptoms, data.image);
      setResult(analysis);
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Unable to process request. Please try again later or check your network.");
      setStatus(LoadingState.ERROR);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStatus(LoadingState.IDLE);
    setError(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {/* Background Orbs */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb-1"></div>
        <div className="aurora-orb-2"></div>
        <div className="aurora-orb-3"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0f1629]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden="true">
                    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"></path>
                    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">HelpRX</span>
            </div>
            <a href="tel:911" className="inline-flex items-center justify-center h-9 gap-1.5 rounded-full bg-destructive px-4 text-sm font-medium text-white shadow-[0_0_20px_hsla(0,72%,55%,0.3)] hover:bg-destructive/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span className="hidden sm:inline">Emergency:</span> 911
            </a>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-balance bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
              Symptom Analyzer
            </h1>
            <p className="mt-3 text-pretty text-base text-muted-foreground">
              Enter your information below to receive OTC medication recommendations.
            </p>
          </div>

          {status === LoadingState.IDLE && (
            <SymptomForm onSubmit={handleSubmit} isLoading={false} />
          )}

          {status === LoadingState.LOADING && (
            <LoadingSpinner />
          )}

          {status === LoadingState.ERROR && (
             <div className="text-center w-full max-w-md">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 mb-6">
                    {error}
                </div>
                <button 
                    onClick={() => setStatus(LoadingState.IDLE)}
                    className="btn-glow inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                    Try Again
                </button>
             </div>
          )}

          {status === LoadingState.SUCCESS && result && (
            <ResultsDisplay result={result} onReset={handleReset} />
          )}

          <footer className="mt-16 text-center text-xs text-muted-foreground/60">
            <p>HelpRX is for informational purposes only. Not a substitute for medical advice.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
