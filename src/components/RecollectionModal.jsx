import React, { useEffect, useState } from 'react';
import { TONES } from '../data';

export default function RecollectionModal({ open, initialValue, onClose, onSave }) {
  const [tone, setTone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setTone(initialValue?.tone || '');
      setNote(initialValue?.note || '');
    }
  }, [open, initialValue]);

  if (!open) {
    return null;
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Recollection">
      <div className="modal-shell" onClick={onClose} />
      <div className="modal-body">
        <h2>How did the day feel?</h2>

        <div className="tone-list" role="radiogroup" aria-label="Tone">
          {TONES.map((entry) => {
            const selected = tone === entry;
            return (
              <button
                key={entry}
                type="button"
                className={`tone-chip ${selected ? 'is-selected' : ''}`}
                role="radio"
                aria-checked={selected}
                onClick={() => setTone(selected ? '' : entry)}
              >
                {entry}
              </button>
            );
          })}
        </div>

        <label className="note-field">
          <span>Optional line</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, 180))}
            rows={3}
            placeholder="A brief recollection"
          />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ tone: tone.trim(), note: note.trim() })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
