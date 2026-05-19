import React, { useState } from 'react';
import { PenTool, Plus, Layers, FileText, Check } from 'lucide-react';

interface TaskInputProps {
  onAddBulkTasks: (tasks: { text: string; category: string; priority: 'High' | 'Medium' | 'Low' }[]) => void;
  onAddTask: (text: string, category: string, priority: 'High' | 'Medium' | 'Low') => void;
  language: 'pl' | 'en';
}

const CATEGORY_PRESETS = {
  pl: ['Zdrowie', 'Biznes', 'Inwestycje', 'Rozwój', 'Optymalizacja', 'Dom'],
  en: ['Health', 'Business', 'Investments', 'Growth', 'Optimization', 'Home'],
};

export default function TaskInput({ onAddBulkTasks, onAddTask, language }: TaskInputProps) {
  const [activeMode, setActiveMode] = useState<'single' | 'bulk'>('single');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Ogólne');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [csvText, setCsvText] = useState('');
  const [bulkError, setBulkError] = useState('');

  const t = {
    pl: {
      singleTab: 'Pojedyncze zadanie',
      bulkTab: 'Wklej listę zadań (CSV)',
      placeholderSingle: 'Co masz teraz do zrobienia?...',
      placeholderBulk: `Wklej tutaj CSV. Przykład:\n\n"Zadanie","Kategoria","Priority"\n"10k kroków","Zdrowie","High"\n"50 linii kodu","Rozwój","High"`,
      btnSingle: 'Dodaj zadanie',
      btnBulk: 'Dodaj całą listę z pliku/schowka',
      labelCategory: 'Kategoria:',
      labelPriority: 'Priorytet:',
      successAlert: 'Zadania zostały dodane pomyślnie!',
      categoryPlaceholder: 'Wpisz własną kategorię...',
    },
    en: {
      singleTab: 'Single Task',
      bulkTab: 'Paste Bulk Tasks (CSV)',
      placeholderSingle: 'What is on your list right now?...',
      placeholderBulk: `Paste CSV rows here. Example:\n\n"Task","Category","Priority"\n"10k steps","Health","High"\n"50 lines of code","Growth","High"`,
      btnSingle: 'Add task',
      btnBulk: 'Import all lines from clipboard',
      labelCategory: 'Category:',
      labelPriority: 'Priority:',
      successAlert: 'Tasks imported successfully!',
      categoryPlaceholder: 'Custom category...',
    },
  }[language];

  // Robust parsing of CSV strings supporting quoted fields
  const parseCSV = (csv: string) => {
    const lines = csv.split('\n');
    const results: { text: string; category: string; priority: 'High' | 'Medium' | 'Low' }[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      // Skip CSV header
      if (line.toLowerCase().startsWith('task,category,priority')) {
        continue;
      }

      const fields: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());

      if (fields.length >= 1) {
        let taskText = fields[0] || '';
        // Remove trailing or leading quotes
        taskText = taskText.replace(/^"|"$/g, '').trim();
        
        // Skip header lines
        if (!taskText || taskText.toLowerCase() === 'task') {
          continue;
        }

        let taskCategory = fields[1]?.replace(/^"|"$/g, '').trim() || (language === 'pl' ? 'Ogólne' : 'General');
        let rawPriority = fields[2]?.replace(/^"|"$/g, '').trim().toLowerCase() || 'medium';
        
        let priorityVal: 'High' | 'Medium' | 'Low' = 'Medium';
        if (rawPriority === 'high') priorityVal = 'High';
        if (rawPriority === 'low') priorityVal = 'Low';

        results.push({
          text: taskText,
          category: taskCategory,
          priority: priorityVal,
        });
      }
    }
    return results;
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask(text.trim(), category.trim() || 'Ogólne', priority);
    setText('');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    try {
      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        setBulkError(language === 'pl' ? 'Nie znaleziono poprawnych zadań. Sprawdź format!' : 'No valid records found.');
        return;
      }
      onAddBulkTasks(parsed);
      setCsvText('');
      setBulkError('');
    } catch (err) {
      setBulkError(language === 'pl' ? 'Błąd parsowania pliku.' : 'Parser failure.');
    }
  };

  return (
    <div className="w-full bg-white/70 p-4 rounded-2xl sketch-border sketch-shadow-sm mb-6 flex flex-col gap-4">
      {/* Mode Switches */}
      <div className="flex border-b-2 border-sketch-pencil/15 pb-2 justify-between items-center">
        <div className="flex bg-neutral-100 rounded-lg p-0.5 sketch-border">
          <button
            type="button"
            onClick={() => setActiveMode('single')}
            className={`text-xs font-black px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-all ${
              activeMode === 'single'
                ? 'bg-[#ffffff] text-sketch-pencil shadow-xs border border-sketch-pencil/25'
                : 'text-sketch-pencil/60 hover:text-sketch-pencil'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{t.singleTab}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMode('bulk')}
            className={`text-xs font-black px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-all ${
              activeMode === 'bulk'
                ? 'bg-[#ffffff] text-sketch-pencil shadow-xs border border-sketch-pencil/25'
                : 'text-sketch-pencil/60 hover:text-sketch-pencil'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.bulkTab}</span>
          </button>
        </div>
        
        {/* Quick CSV tag info */}
        {activeMode === 'bulk' && (
          <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-dashed border border-neutral-300 text-sketch-pencil/50 rounded">
            CSV FORMAT
          </span>
        )}
      </div>

      {activeMode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b-2 border-sketch-pencil/30 pb-2 focus-within:border-sketch-pencil">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholderSingle}
              className="flex-grow bg-transparent text-sketch-pencil placeholder-sketch-pencil/40 font-sans text-lg font-bold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-xl sketch-border border-zinc-200">
            {/* Category Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-sketch-pencil/70">
                📂 {t.labelCategory}
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {CATEGORY_PRESETS[language].map((catName) => (
                  <button
                    type="button"
                    key={catName}
                    onClick={() => setCategory(catName)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                      category === catName
                        ? 'bg-sketch-pencil text-white'
                        : 'bg-white text-sketch-pencil border border-sketch-pencil/20 hover:bg-neutral-100'
                    }`}
                  >
                    {catName}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t.categoryPlaceholder}
                className="w-full bg-white text-xs px-2 py-1 rounded border border-sketch-pencil/20 text-sketch-pencil font-semibold focus:outline-none"
                maxLength={20}
              />
            </div>

            {/* Priority Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-sketch-pencil/70">
                ⚡ {t.labelPriority}
              </label>
              <div className="flex gap-2">
                {(['High', 'Medium', 'Low'] as const).map((p) => {
                  const colors = {
                    High: 'bg-sketch-pink-bg text-sketch-pink-text border-sketch-pink-border',
                    Medium: 'bg-sketch-yellow-bg text-sketch-yellow-text border-sketch-yellow-border',
                    Low: 'bg-sketch-green-bg text-sketch-green-text border-sketch-green-border',
                  }[p];

                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`text-xs px-3 py-1.5 rounded-lg border-2 font-bold flex-1 text-center transition-all cursor-pointer ${colors} ${
                        priority === p
                          ? 'ring-2 ring-sketch-pencil scale-105 border-sketch-pencil'
                          : 'opacity-65 hover:opacity-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className={`w-full py-2.5 rounded-xl font-bold text-sm sketch-border-thick sketch-shadow flex items-center justify-center gap-1.5 transition-all duration-150 ${
              text.trim()
                ? 'bg-sketch-green-bg hover:bg-sketch-green-border hover:scale-[1.01] active:scale-95 text-sketch-green-text cursor-pointer'
                : 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnSingle}</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleBulkSubmit} className="flex flex-col gap-3">
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={t.placeholderBulk}
            rows={8}
            className="w-full bg-white p-3 rounded-xl border border-sketch-pencil/25 text-xs font-mono text-sketch-pencil/85 focus:outline-none focus:border-sketch-pencil line-clamp-none resize-y"
          />

          {bulkError && (
            <p className="text-xs font-black text-rose-500 bg-rose-50 p-2 rounded border border-rose-200">
              ⚠️ {bulkError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Auto populate code clip */}
            <button
              type="button"
              onClick={() => setCsvText(`Task,Category,Priority
"Poranny stack suplementów","Zdrowie","High"
"10k kroków","Zdrowie","High"
"Dieta Blueprint","Zdrowie","High"
"5 ofert Pracownia Witryn","Biznes","High"
"Draft maila sprzedażowego","Biznes","Medium"
"2 nowe ogłoszenia wypożyczalnia","Biznes","High"
"Podbicie 5 ogłoszeń wypożyczalnia","Biznes","Low"
"Sprawdzenie bota Uniswap v4","Biznes","Medium"
"30 min analizy rynkowej","Inwestycje","Medium"
"50 linii kodu","Rozwój","High"
"30 min pracy w Unity","Rozwój","Medium"
"Research motel/gym","Biznes","Low"
"Raport wieczorny","Optymalizacja","High"`)}
              className="text-[11px] font-black text-slate-500 hover:text-slate-800 underline decoration-dotted cursor-pointer"
            >
              📋 {language === 'pl' ? 'Wklej przykładowy kod użytkownika' : 'Load sample dataset'}
            </button>

            <button
              type="submit"
              disabled={!csvText.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm sketch-border-thick sketch-shadow flex items-center justify-center gap-1.5 transition-all duration-150 ${
                csvText.trim()
                  ? 'bg-sketch-blue-bg hover:bg-sketch-blue-border hover:scale-[1.01] active:scale-95 text-sketch-blue-text cursor-pointer'
                  : 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.btnBulk}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
