import React from 'react';
import InkCheck from './InkCheck';

export default function ItemRow({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      className={`item-row ${checked ? 'is-on' : ''}`}
      onClick={onToggle}
      aria-pressed={checked}
    >
      <span className="item-row__label">{label}</span>
      <InkCheck checked={checked} />
    </button>
  );
}
