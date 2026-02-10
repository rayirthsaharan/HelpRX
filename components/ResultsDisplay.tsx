import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const isEmergency = result.is_emergency;
  const needsMoreInfo = result.needs_more_info;

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Emergency Alert */}
      {isEmergency && (
        <div className="mb-8 rounded-2xl border border-red-500/50 bg-red-500/10 p-6 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-500/20 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">EMERGENCY ALERT</h3>
              <p className="mt-2 text-base leading-relaxed text-red-100">{result.emergency_instructions}</p>
              <div className="mt-4">
                 <a href="tel:911" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 font-bold text-white hover:bg-red-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Call 911 Immediately
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Needs More Info / Clarification */}
      {needsMoreInfo && !isEmergency && (
        <div className="mb-8 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-6 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-500/20 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                 <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-400">Additional Information Needed</h3>
              <p className="mt-2 text-base leading-relaxed text-amber-100/90">
                To provide the safest and most accurate recommendation, I need a few more details:
              </p>
              <ul className="mt-4 space-y-3">
                {result.clarifying_questions?.map((question, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-amber-200">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Options */}
      {!isEmergency && !needsMoreInfo && (
        <div className="mb-8 grid gap-6">
          <h2 className="text-2xl font-semibold text-foreground">Recommended OTC Options</h2>
          {result.suggested_otc_options.length > 0 ? (
              result.suggested_otc_options.map((option, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-6 transition-transform hover:scale-[1.01]">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{option.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Purpose: {option.purpose}</p>
                    </div>
                    <div className="rounded-xl bg-primary/10 px-4 py-2 border border-primary/20">
                      <span className="block text-xs font-medium text-primary uppercase tracking-wider">Dosage</span>
                      <span className="text-lg font-bold text-foreground">{option.calculated_dosage}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground border-t border-white/5 pt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {option.max_frequency}
                  </div>
                </div>
              ))
          ) : (
            <div className="p-4 text-center text-muted-foreground bg-white/5 rounded-xl">No specific OTC options found for these symptoms.</div>
          )}
        </div>
      )}

      {/* Safety & Triggers Grid */}
      {(!needsMoreInfo || isEmergency) && (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Safety Warnings */}
            <div className="glass-card rounded-2xl p-6">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-orange-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Safety Warnings
                </h4>
                <ul className="space-y-2">
                    {result.safety_warnings.map((warning, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400/50"></span>
                            {warning}
                        </li>
                    ))}
                    {result.safety_warnings.length === 0 && <li className="text-sm text-muted-foreground/60">None listed.</li>}
                </ul>
            </div>

            {/* Doctor Triggers */}
            <div className="glass-card rounded-2xl p-6">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M8 14h.01"></path><path d="M12 12h.01"></path><path d="M16 10h.01"></path><path d="M12 16h.01"></path><path d="M8 18h.01"></path><path d="M16 14h.01"></path></svg>
                    When to see a Doctor
                </h4>
                <ul className="space-y-2">
                    {result.doctor_visit_triggers.map((trigger, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/50"></span>
                            {trigger}
                        </li>
                    ))}
                     {result.doctor_visit_triggers.length === 0 && <li className="text-sm text-muted-foreground/60">None listed.</li>}
                </ul>
            </div>
        </div>
      )}

       {/* Disclaimer */}
       <div className="mt-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-yellow-200/70">
        <p className="font-semibold uppercase tracking-wider text-yellow-500/80 mb-1">Disclaimer</p>
        {result.disclaimer}
      </div>

      <div className="mt-10 flex justify-center w-full">
        <button 
            onClick={onReset}
            className={`
                group relative inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300
                ${needsMoreInfo 
                    ? 'w-full sm:w-auto bg-primary text-white shadow-[0_0_25px_hsla(239,84%,67%,0.4)] hover:bg-primary/90 hover:shadow-[0_0_40px_hsla(239,84%,67%,0.6)] hover:-translate-y-1' 
                    : 'text-muted-foreground hover:text-foreground underline decoration-dotted underline-offset-4'
                }
            `}
        >
            {needsMoreInfo ? (
                <>
                    <span>Update Symptoms & Try Again</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </>
            ) : (
                'Start New Analysis'
            )}
        </button>
      </div>

    </div>
  );
};
