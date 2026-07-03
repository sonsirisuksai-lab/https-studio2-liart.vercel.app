import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X, AlertCircle, CheckCircle2 } from 'lucide-react';

type InputType = 'text' | 'textarea' | 'select' | 'search';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  type?: InputType;
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  ({ type = 'text', label, error, success, hint, className, onClear, value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState(value || '');

    useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e as any);
      }
    };

    const handleClear = () => {
      setInputValue('');
      if (onClear) {
        onClear();
      }
      if (onChange) {
        const event = {
          target: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event as any);
      }
    };

    const containerStyles = cn(
      'w-full flex items-center rounded-xl transition-all duration-300 border bg-gradient-to-b from-white/5 to-white/0',
      'text-[var(--theme-text)] placeholder:text-[var(--theme-text-tertiary)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-red-500/50 bg-red-500/5 ring-4 ring-red-500/10 focus-within:ring-red-500/20 focus-within:border-red-500',
      success && 'border-green-500/50 bg-green-500/5 ring-4 ring-green-500/10 focus-within:ring-green-500/20 focus-within:border-green-500',
      !error && !success && 'border-[var(--theme-border)] hover:border-white/20 hover:scale-[1.005] focus-within:scale-[1.01] focus-within:ring-4 focus-within:ring-[var(--theme-primary)]/25 focus-within:border-[var(--theme-primary)]',
      type === 'textarea' ? 'p-1' : 'h-11 px-3',
      className
    );

    const inputStyles = 'w-full bg-transparent border-none outline-none text-base placeholder:text-[var(--theme-text-tertiary)] py-2 focus:ring-0 focus:outline-none';

    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              value={inputValue}
              onChange={handleTextChange}
              className={cn(inputStyles, 'min-h-[100px] resize-none px-2')}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          );
        case 'select':
          return (
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              value={inputValue}
              onChange={handleTextChange}
              className={cn(inputStyles, 'appearance-none pr-8 cursor-pointer')}
              {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            />
          );
        case 'search':
          return (
            <div className="flex items-center w-full gap-2">
              <Search className="w-4 h-4 text-[var(--theme-text-tertiary)] shrink-0" />
              <input
                ref={ref as React.Ref<HTMLInputElement>}
                type="text"
                value={inputValue}
                onChange={handleTextChange}
                className={inputStyles}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full hover:bg-white/10 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        default:
          return (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              value={inputValue}
              onChange={handleTextChange}
              className={inputStyles}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          );
      }
    };

    return (
      <div className="space-y-1.5 w-full flex flex-col">
        {label && (
          <label className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-0.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className={containerStyles}>
          <div className="flex-1 flex items-center">
            {renderInput()}
          </div>
          {error && <AlertCircle className="w-4 h-4 text-red-500 ml-2 shrink-0" />}
          {success && !error && <CheckCircle2 className="w-4 h-4 text-green-500 ml-2 shrink-0" />}
        </div>
        {error && <p className="text-xs font-medium text-red-400 mt-1 flex items-center gap-1">{error}</p>}
        {success && !error && <p className="text-xs font-medium text-green-400 mt-1 flex items-center gap-1">{success}</p>}
        {hint && !error && !success && <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
