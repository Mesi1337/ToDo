import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, Trash2, Edit3, GripVertical, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  key?: React.Key;
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  // Map priority to comfortable crayon sketch themes
  const colorMap = {
    High: {
      bg: 'bg-sketch-pink-bg border-sketch-pink-border text-sketch-pink-text',
      badge: 'bg-red-50 text-red-600 border-red-200',
      label: 'High',
    },
    Medium: {
      bg: 'bg-sketch-yellow-bg border-sketch-yellow-border text-sketch-yellow-text',
      badge: 'bg-amber-50 text-amber-600 border-amber-200',
      label: 'Medium',
    },
    Low: {
      bg: 'bg-sketch-green-bg border-sketch-green-border text-sketch-green-text',
      badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      label: 'Low',
    },
  }[task.priority || 'Medium'];

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
      className={`relative w-full p-4 rounded-xl flex items-center justify-between gap-3 sketch-border sketch-shadow-sm transition-all duration-200 ${
        task.completed
          ? 'bg-neutral-50/40 border-neutral-300 text-neutral-400 opacity-55'
          : colorMap.bg
      }`}
    >
      {/* Task Tick & Info column */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        
        {/* Handdrawn Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`relative w-6 h-6 rounded-lg flex items-center justify-center border-2 shrink-0 transition-all duration-150 ${
            task.completed
              ? 'border-neutral-400 bg-neutral-200/50'
              : 'border-sketch-pencil bg-white hover:scale-105 active:scale-95 cursor-pointer'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg
              className="w-5 h-5 text-sketch-pencil absolute"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                d="M20 6 9 17l-5-5"
              />
            </svg>
          )}
        </button>

        {/* Task Text & Badges */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-white/70 border-b-2 border-sketch-pencil px-1 py-0.5 text-sketch-pencil font-sans text-base focus:outline-none"
            />
          ) : (
            <div className="flex flex-col gap-1 items-start">
              <span
                onClick={() => !task.completed && setIsEditing(true)}
                className={`font-sans text-[16px] md:text-[17px] leading-snug cursor-text select-none break-words w-full ${
                  task.completed ? 'scribble-strike font-normal opacity-70' : 'font-semibold'
                }`}
              >
                {task.text}
              </span>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Category tag */}
                {task.category && (
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-white/75 border border-sketch-pencil/20 tracking-wider">
                    📂 {task.category}
                  </span>
                )}
                
                {/* Priority micro badge */}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${colorMap.badge}`}>
                  ⚡ {colorMap.label}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 select-none">
        {!task.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-sketch-pencil/60 hover:text-sketch-pencil hover:bg-black/5 opacity-80 md:opacity-100 transition-all cursor-pointer"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}

        {/* Ordering buttons */}
        {!task.completed && (
          <div className="flex flex-col gap-0.5">
            <button
              disabled={isFirst}
              onClick={onMoveUp}
              className={`p-0.5 rounded-md transition-colors ${
                isFirst
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-sketch-pencil/55 hover:text-sketch-pencil hover:bg-black/5 cursor-pointer'
              }`}
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={isLast}
              onClick={onMoveDown}
              className={`p-0.5 rounded-md transition-colors ${
                isLast
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-sketch-pencil/55 hover:text-sketch-pencil hover:bg-black/5 cursor-pointer'
              }`}
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-red-500/75 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="text-sketch-pencil/25 cursor-grab p-1">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
