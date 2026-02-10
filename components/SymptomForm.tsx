import React, { useState, ChangeEvent } from 'react';
import { FormData } from '../types';

interface SymptomFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    symptoms: '',
    image: null
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.age && formData.weight && formData.symptoms.trim().length > 0;

  return (
    <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">Symptoms</h2>
          <p className="mt-1 text-sm text-muted-foreground">Provide your details for an OTC dosage recommendation</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="age" className="text-sm font-medium text-foreground/80">Age</label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 32"
                min="0"
                max="120"
                className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="weight" className="text-sm font-medium text-foreground/80">Weight (lbs)</label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 160"
                min="0"
                max="999"
                className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="symptoms" className="text-sm font-medium text-foreground/80">Describe your symptoms</label>
            <textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms in detail... e.g. headache for 2 days, mild fever, sore throat"
              rows={4}
              className="flex min-h-[100px] w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              required
            ></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground/80">
              Upload Medication Bottle <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <label
                htmlFor="bottle-upload"
                className={`group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-7 transition-all hover:border-primary/40 hover:bg-primary/5 ${formData.image ? 'border-primary/50 bg-primary/10' : ''}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-primary/20">
                  {formData.image ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground h-5 w-5 transition-colors group-hover:text-primary"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M7 12h10"></path></svg>
                  )}
                </div>
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-foreground/80">
                    {formData.image ? formData.image.name : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>
                        Scan Label
                      </>
                    )}
                  </p>
                  {!formData.image && <p className="mt-0.5 text-xs text-muted-foreground">Drag & drop or click to upload</p>}
                </div>
                <input
                  id="bottle-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="btn-glow mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? 'Analyzing...' : 'Analyze & Calculate Dosage'}
          </button>
        </form>
      </div>
    </div>
  );
};