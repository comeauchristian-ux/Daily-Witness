import React from 'react';

export default function InkCheck({ checked }) {
  return (
    <svg className={`ink-check ${checked ? 'is-checked' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 12.5 L10 18 L19.5 6.5" />
    </svg>
  );
}
