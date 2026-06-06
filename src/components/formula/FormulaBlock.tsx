import katex from 'katex';
import { useMemo } from 'react';

type Props = {
  latex: string;
  displayMode?: boolean;
  className?: string;
};

export function FormulaBlock({ latex, displayMode = true, className = '' }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode, throwOnError: false });
    } catch {
      return `<span class="text-red-400">Error rendering: ${latex}</span>`;
    }
  }, [latex, displayMode]);

  return (
    <div
      className={`bg-slate-800 rounded-lg p-4 overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function InlineFormula({ latex, className = '' }: { latex: string; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode: false, throwOnError: false });
    } catch {
      return latex;
    }
  }, [latex]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
