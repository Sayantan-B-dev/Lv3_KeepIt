import React, { useRef, useState } from 'react';

/**
 * TagInput - Animated, modern tag input field
 * Props:
 *   value: array of strings (tags)
 *   onChange: function(newTagsArray)
 *   placeholder: string
 *   disabled: boolean
 */
const TagInput = ({ value = [], onChange, placeholder = 'Add tags...', disabled = false }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed) && trimmed.length <= 30) {
      onChange([...value, trimmed]);
    }
  };

  const removeTag = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && input.trim()) {
      e.preventDefault();
      addTag(input);
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',')) {
      e.preventDefault();
      text.split(',').forEach(t => addTag(t));
      setInput('');
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 min-h-[48px] focus-within:ring-1 focus-within:ring-black ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {value.map((tag, idx) => (
        <span
          key={tag + idx}
                                 className="backdrop-blur-md bg-black/70 border border-black px-3 py-1 rounded-full text-xs font-semibold flex items-center text-white shadow-sm animate-fadeIn"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              className="ml-1 text-indigo-400 hover:text-red-500 focus:outline-none transition-colors rounded-full text-xs flex items-center justify-center"
              style={{ minWidth: "20px", minHeight: "20px", width: "20px", height: "20px", lineHeight: "1" }}
              onClick={e => { e.stopPropagation(); removeTag(idx); }}
              aria-label={`Remove tag ${tag}`}
            >
              &times;
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-black placeholder-gray-400 py-1"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={30}
      />
      {/* Simple animation for focus */}
      <style>{`
        .animate-fadeIn {
          animation: fadeInTag 0.2s ease;
        }
        @keyframes fadeInTag {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default TagInput; 