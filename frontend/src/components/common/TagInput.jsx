import React, { useRef, useState } from 'react';


const TagInput = ({ value = [], onChange, placeholder = 'Add tags...', disabled = false ,textAreaStyle}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed.length > 30) {
      setError("Tags cannot be more than 30 characters.");
      return;
    }
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setError('');
    }
  };

  const removeTag = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 30) {
      setError("Tags cannot be more than 30 characters.");
    } else {
      setError('');
    }
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
      className={textAreaStyle}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {value.map((tag, idx) => (
        <span
          key={tag + idx}
          className="backdrop-blur-md bg-black/70  border border-muted px-3 py-1 rounded-full text-xs font-semibold flex items-center text-white shadow-sm animate-fadeIn w-fit max-w-full mb-2"
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
        className={textAreaStyle}
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
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
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