import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, BookOpen, Smartphone, Github, Check, Copy, Trash2, Heart, RotateCcw } from 'lucide-react';
import { Task, SketchbookSettings } from './types';
import TaskCard from './components/TaskCard';
import TaskInput from './components/TaskInput';

const DEFAULT_TASKS: Task[] = [
  { id: 't1', text: 'Poranny stack suplementów', completed: false, category: 'Zdrowie', priority: 'High', order: 0 },
  { id: 't2', text: '10k kroków', completed: false, category: 'Zdrowie', priority: 'High', order: 1 },
  { id: 't3', text: 'Dieta Blueprint', completed: false, category: 'Zdrowie', priority: 'High', order: 2 },
  { id: 't4', text: '5 ofert Pracownia Witryn', completed: false, category: 'Biznes', priority: 'High', order: 3 },
  { id: 't5', text: 'Draft maila sprzedażowego', completed: false, category: 'Biznes', priority: 'Medium', order: 4 },
  { id: 't6', text: '2 nowe ogłoszenia wypożyczalnia', completed: false, category: 'Biznes', priority: 'High', order: 5 },
  { id: 't7', text: 'Podbicie 5 ogłoszeń wypożyczalnia', completed: false, category: 'Biznes', priority: 'Low', order: 6 },
  { id: 't8', text: 'Sprawdzenie bota Uniswap v4', completed: false, category: 'Biznes', priority: 'Medium', order: 7 },
  { id: 't9', text: '30 min analizy rynkowej', completed: false, category: 'Inwestycje', priority: 'Medium', order: 8 },
  { id: 't10', text: '50 linii kodu', completed: false, category: 'Rozwój', priority: 'High', order: 9 },
  { id: 't11', text: '30 min pracy w Unity', completed: false, category: 'Rozwój', priority: 'Medium', order: 10 },
  { id: 't12', text: 'Research motel/gym', completed: false, category: 'Biznes', priority: 'Low', order: 11 },
  { id: 't13', text: 'Raport wieczorny', completed: false, category: 'Optymalizacja', priority: 'High', order: 12 }
];

const DEFAULT_SETTINGS: SketchbookSettings = {
  language: 'pl',
  paperStyle: 'lines',
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem('sketchbook_v2_tasks');
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_TASKS; }
    }
    return DEFAULT_TASKS;
  });

  const [settings, setSettings] = useState<SketchbookSettings>(() => {
    const cached = localStorage.getItem('sketchbook_v2_settings');
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_SETTINGS; }
    }
    return DEFAULT_SETTINGS;
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  
  // Collapse controller for Guides & Deployment
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [copiedVite, setCopiedVite] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);

  useEffect(() => {
    localStorage.setItem('sketchbook_v2_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sketchbook_v2_settings', JSON.stringify(settings));
  }, [settings]);

  const language = settings.language;
  const t = {
    pl: {
      appName: 'Szkicownik Zadań',
      headerUnit: 'zadań do zrobienia',
      headerUnitOne: 'zadanie do zrobienia',
      headerUnitMany: 'zadania do zrobienia',
      todaySection: 'CZYSTA LISTA ZADAŃ',
      completedSection: 'UKOŃCZONE',
      emptyState: 'Brak zadań w wybranej kategorii. Dodaj jedno powyżej lub wklej listę CSV!',
      clearAll: 'Wyczyść wszystko',
      clearConfirm: 'Czy na pewno chcesz usunąć wszystkie trwale zapisane zadania?',
      showGuides: 'Przewodnik Instalacji (Kliknij aby rozwinąć) 📱🐙',
      hideGuides: 'Ukryj przewodnik instalacji',
      filterAll: 'Wszystkie',
      filterCategory: 'Kategoria',
      filterPriority: 'Priorytet',
      paperLinesName: 'Linie',
      paperDotsName: 'Kropki',
      paperPlainName: 'Gładki',

      // Guides
      iosHeader: '📱 Jak dodać skrót na pulpit telefonu iPhone',
      iosStep1: 'Prześlij adres tej aplikacji i otwórz go w Safari na swoim iPhonie.',
      iosStep2: 'Na dolnym pasku klinij ikonę udostępniania (kwadrat ze strzałką w górę 📤).',
      iosStep3: 'Przewiń w dół i wybierz opcję „Dodaj do ekranu początkowego” (Add to Home Screen ➕).',
      iosStep4: 'Zatwierdź nazwę. Aplikacja uruchomi się na iPhonie w pełnym ekranie jak natywna apka bez pasków przeglądarki!',

      githubHeader: '🐙 Publikacja na darmowym GitHub Pages',
      githubBuild: 'Zbuduj aplikację lokalnie na swoim komputerze:',
      githubVite: '2. W pliku vite.config.ts dodaj parametr base z nazwą swojego repozytorium:',
      githubDeploy: '3. Zainstaluj moduł gh-pages i wyślij gotowe pliki z folderu „dist”:',
    },
    en: {
      appName: 'Task Notebook',
      headerUnit: 'tasks left',
      headerUnitOne: 'task left',
      headerUnitMany: 'tasks left',
      todaySection: 'MINIMALIST TASK LIST',
      completedSection: 'COMPLETED',
      emptyState: 'No tasks found. Try adding some above or pasting a CSV checklist!',
      clearAll: 'Clear checklist',
      clearConfirm: 'Are you absolutely sure you want to delete all stored tasks?',
      showGuides: 'Installation & Deploy Instructions (Click to expand) 📱🐙',
      hideGuides: 'Hide instructions',
      filterAll: 'All',
      filterCategory: 'Category',
      filterPriority: 'Priority',
      paperLinesName: 'Lines',
      paperDotsName: 'Dots',
      paperPlainName: 'Plain',

      // Guides
      iosHeader: '📱 Add to iPhone Home Screen Desktop',
      iosStep1: 'Send this app URL to your iPhone and open it exclusively in Safari.',
      iosStep2: 'At the bottom toolbar, tap the Share icon (square with outline arrow 📤).',
      iosStep3: 'Scroll down and choose "Add to Home Screen" (➕).',
      iosStep4: 'Tap Add. The application now displays on your desktop in full sandbox viewport!',

      githubHeader: '🐙 Host Online for Free on GitHub Pages',
      githubBuild: 'Build assets locally within terminal console:',
      githubVite: '2. Specify the repository name as "base" path parameter in vite.config.ts:',
      githubDeploy: '3. Install gh-pages dependency and run deploy task script:',
    },
  }[language];

  // Dynamic filter lists
  const availableCategories = ['All', ...Array.from(new Set(tasks.map((task) => task.category).filter(Boolean)))];
  const availablePriorities = ['All', 'High', 'Medium', 'Low'];

  // Calculations
  const filteredTasks = tasks.filter((t) => {
    const matchesCat = selectedCategoryFilter === 'All' || t.category === selectedCategoryFilter;
    const matchesPriority = selectedPriorityFilter === 'All' || t.priority === selectedPriorityFilter;
    return matchesCat && matchesPriority;
  });

  const activeTasks = filteredTasks
    .filter((t) => !t.completed)
    .sort((a, b) => a.order - b.order);

  const completedTasks = filteredTasks
    .filter((t) => t.completed)
    .sort((a, b) => a.order - b.order);

  // Task list header with declensions
  const getHeaderTitle = () => {
    const count = activeTasks.length;
    if (language === 'en') {
      return `${count} ${count === 1 ? t.headerUnitOne : t.headerUnit}`;
    }
    // Polish
    if (count === 1) return `1 ${t.headerUnitOne}`;
    const lastDigit = count % 10;
    const lastTwo = count % 100;
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 10 || lastTwo > 20)) {
      return `${count} ${t.headerUnitMany}`;
    }
    return `${count} ${t.headerUnit}`;
  };

  // Adding single task action
  const handleAddTask = (text: string, category: string, priority: 'High' | 'Medium' | 'Low') => {
    const newTask: Task = {
      id: 't_' + Date.now(),
      text,
      completed: false,
      category: category.trim() || 'Ogólne',
      priority,
      order: tasks.length,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Bulk CSV pasting action
  const handleAddBulkTasks = (newTasksList: { text: string; category: string; priority: 'High' | 'Medium' | 'Low' }[]) => {
    const parsed: Task[] = newTasksList.map((item, idx) => ({
      id: `t_bulk_${Date.now()}_${idx}`,
      text: item.text,
      completed: false,
      category: item.category || 'Ogólne',
      priority: item.priority || 'Medium',
      order: tasks.length + idx,
    }));
    // Append bulk parsed tasks onto the list
    setTasks((prev) => [...parsed, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTask = (id: string, newText: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  const handleMoveTask = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= activeTasks.length) return;

    const itemA = activeTasks[idx];
    const itemB = activeTasks[targetIdx];

    const tempOrder = itemA.order;
    itemA.order = itemB.order;
    itemB.order = tempOrder;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === itemA.id) return { ...t, order: itemA.order };
        if (t.id === itemB.id) return { ...t, order: itemB.order };
        return t;
      })
    );
  };

  const handleClearAll = () => {
    if (window.confirm(t.clearConfirm)) {
      setTasks([]);
    }
  };

  const copyCode = (code: string, type: 'vite' | 'bash') => {
    navigator.clipboard.writeText(code);
    if (type === 'vite') {
      setCopiedVite(true);
      setTimeout(() => setCopiedVite(false), 2000);
    } else {
      setCopiedBash(true);
      setTimeout(() => setCopiedBash(false), 2000);
    }
  };

  const paperClass =
    settings.paperStyle === 'lines'
      ? 'notebook-lines'
      : settings.paperStyle === 'dots'
      ? 'notebook-dots'
      : '';

  return (
    <div className={`min-h-screen text-sketch-pencil pb-12 flex flex-col items-center justify-start ${paperClass}`}>
      <div className="w-full max-w-[550px] px-4 pt-6 flex flex-col flex-grow">
        
        {/* Binder Loops visual topper */}
        <div className="w-full flex justify-between px-6 mb-5 select-none pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-2.5 h-6 bg-gradient-to-r from-zinc-300 via-neutral-200 to-zinc-400 rounded-full border border-zinc-400/40 shadow-xs" />
              <div className="w-1.5 h-1.5 bg-zinc-700/60 rounded-full" />
            </div>
          ))}
        </div>

        {/* Header Ribbon */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-sketch-pencil/20 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-sketch-pencil/80 h-full" />
            <h1 className="font-display text-[22px] md:text-2xl font-black text-[#111111]">
              {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle */}
            <button
              onClick={() => setSettings((p) => ({ ...p, language: p.language === 'pl' ? 'en' : 'pl' }))}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white/70 hover:bg-white border border-sketch-pencil/20 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              {language === 'pl' ? '🇬🇧 EN' : '🇵🇱 PL'}
            </button>

            {/* Quick Paper Style Toggle */}
            <div className="flex bg-neutral-200/65 rounded-lg p-0.5 border border-sketch-pencil/20">
              {(['lines', 'dots', 'plain'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setSettings((p) => ({ ...p, paperStyle: style }))}
                  className={`text-[9.5px] font-black px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    settings.paperStyle === style ? 'bg-white text-sketch-pencil' : 'text-sketch-pencil/55'
                  }`}
                >
                  {style === 'lines' ? t.paperLinesName : style === 'dots' ? t.paperDotsName : t.paperPlainName}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Interactive Filters Area (Tabs for quick categories) */}
        {availableCategories.length > 1 && (
          <div className="mb-5">
            <span className="text-[10px] font-black uppercase tracking-wider text-sketch-pencil/40 block mb-1.5 px-1">
              📂 {language === 'pl' ? 'Filtruj wg kategorii:' : 'Filter by category:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-sketch-pencil text-white'
                      : 'bg-white/80 hover:bg-neutral-100/90 text-sketch-pencil/80 border border-sketch-pencil/15'
                  }`}
                >
                  {cat === 'All' ? t.filterAll : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Priority Filter Selector */}
        <div className="mb-6 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-sketch-pencil/40">
              ⚡ {language === 'pl' ? 'Priorytet:' : 'Priority Filter:'}
            </span>
            <div className="flex gap-1.5">
              {availablePriorities.map((prio) => (
                <button
                  key={prio}
                  onClick={() => setSelectedPriorityFilter(prio)}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded transition-all cursor-pointer ${
                    selectedPriorityFilter === prio
                      ? 'bg-sketch-pencil/90 text-white'
                      : 'bg-white/80 text-sketch-pencil/60 border border-sketch-pencil/10 hover:bg-neutral-50'
                  }`}
                >
                  {prio === 'All' ? t.filterAll : prio}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Clear Checklist button */}
          {tasks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-black text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>

        {/* Main List Section */}
        <main className="flex-grow w-full flex flex-col gap-6">
          
          {/* Active section */}
          <div>
            <h3 className="text-xs font-black tracking-widest text-sketch-pencil/55 mb-3 ml-1 uppercase">
              📌 {t.todaySection}
            </h3>

            <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {activeTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    className="py-10 text-center text-xs italic text-sketch-pencil/50 bg-neutral-100/40 rounded-xl border border-dashed border-sketch-pencil/20 flex flex-col items-center justify-center gap-1.5 p-4"
                  >
                    <span>{t.emptyState}</span>
                  </motion.div>
                ) : (
                  activeTasks.map((task, idx) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      onMoveUp={() => handleMoveTask(idx, 'up')}
                      onMoveDown={() => handleMoveTask(idx, 'down')}
                      isFirst={idx === 0}
                      isLast={idx === activeTasks.length - 1}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed section */}
          {completedTasks.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xs font-black tracking-widest text-sketch-pencil/50 mb-3 ml-1 uppercase">
                ✅ {t.completedSection}
              </h3>
              
              <div className="flex flex-col gap-2.5">
                <AnimatePresence mode="popLayout">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Dynamic List Input (Single or Bulk CSV Import) */}
          <div className="mt-4">
            <TaskInput onAddTask={handleAddTask} onAddBulkTasks={handleAddBulkTasks} language={language} />
          </div>

          {/* Collapsible Deployment and iPhone integration Guides requested by the user */}
          <section className="mt-8 border-t-2 border-sketch-pencil/15 pt-6">
            <button
              onClick={() => setGuidesOpen(!guidesOpen)}
              className="w-full py-2.5 px-4 rounded-xl bg-white sketch-border text-center font-display font-black text-sm uppercase tracking-wide text-sketch-pencil cursor-pointer flex items-center justify-center gap-2 hover:bg-neutral-50 transition-all select-none"
              style={{
                boxShadow: '1.5px 1.5px 0px 0px rgba(68, 71, 77, 0.9)',
              }}
            >
              <Smartphone className="w-4 h-4" />
              <span>{guidesOpen ? t.hideGuides : t.showGuides}</span>
            </button>

            {guidesOpen && (
              <div className="mt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-250">
                
                {/* iPhone desktop manual */}
                <div className="p-4 rounded-xl bg-sketch-blue-bg border-sketch-blue-border sketch-border-thick sketch-shadow-sm text-sketch-blue-text flex flex-col gap-2">
                  <h4 className="font-display font-black text-sm uppercase tracking-wide flex items-center gap-1.5 border-b border-sketch-blue-border pb-1">
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>{t.iosHeader}</span>
                  </h4>
                  <ol className="list-decimal list-inside text-xs font-semibold flex flex-col gap-2.5 leading-relaxed mt-1">
                    <li>{t.iosStep1}</li>
                    <li>{t.iosStep2}</li>
                    <li>{t.iosStep3}</li>
                    <li>{t.iosStep4}</li>
                  </ol>
                </div>

                {/* GitHub pages deploy card */}
                <div className="p-4 rounded-xl bg-sketch-pink-bg border-sketch-pink-border sketch-border-thick sketch-shadow-sm text-sketch-pink-text flex flex-col gap-3">
                  <h4 className="font-display font-black text-sm uppercase tracking-wide flex items-center gap-1.5 border-b border-sketch-pink-border pb-1">
                    <Github className="w-4 h-4 shrink-0" />
                    <span>{t.githubHeader}</span>
                  </h4>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold">{t.githubBuild}</span>
                    <pre className="bg-white/80 p-2 rounded-lg text-[10px] font-mono border border-sketch-pink-border/40 text-sketch-pencil overflow-x-auto no-scrollbar">
                      npm run build
                    </pre>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold">{t.githubVite}</span>
                      <button
                        onClick={() => copyCode(`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/nazwa-twojego-repozytorium/', // <--- Tutaj wpisz nazwe repo
});`, 'vite')}
                        className="px-2 py-0.5 bg-white rounded border border-sketch-pencil/20 hover:bg-neutral-50 text-[10px] text-sketch-pencil font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedVite ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedVite ? 'Skopiowano!' : 'Kopiuj'}</span>
                      </button>
                    </div>
                    <pre className="bg-white/80 p-2 rounded-lg text-[9.5px] font-mono border border-sketch-pink-border/40 text-sketch-pencil overflow-x-auto no-scrollbar whitespace-pre">
{`export default defineConfig({
  base: '/nazwa-twojego-repozytorium/',
});`}
                    </pre>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold">{t.githubDeploy}</span>
                      <button
                        onClick={() => copyCode(`# Zainstaluj paczkę
npm install -D gh-pages

# Wyślij spakowane pliki (dist) na gałąź gh-pages repozytorium
npx gh-pages -d dist`, 'bash')}
                        className="px-2 py-0.5 bg-white rounded border border-sketch-pencil/20 hover:bg-neutral-50 text-[10px] text-sketch-pencil font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedBash ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedBash ? 'Skopiowano!' : 'Kopiuj'}</span>
                      </button>
                    </div>
                    <pre className="bg-white/80 p-2.5 rounded-lg text-[9.5px] font-mono border border-sketch-pink-border/40 text-sketch-pencil overflow-x-auto no-scrollbar whitespace-pre">
{`npm install -D gh-pages
npx gh-pages -d dist`}
                    </pre>
                  </div>
                </div>

              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
