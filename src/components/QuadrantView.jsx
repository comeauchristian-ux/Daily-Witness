import React from 'react';
import { ITEM_LABELS } from '../data';
import ItemRow from './ItemRow';

export default function QuadrantView({ group, dayState, onBack, onToggle }) {
  return (
    <main className="quadrant-screen" onClick={onBack}>
      <div className="quadrant-content" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="back-button" onClick={onBack}>
          Back
        </button>

        <h1>{group.label}</h1>

        <div className="item-list">
          {group.items.map((itemId) => (
            <ItemRow
              key={itemId}
              label={ITEM_LABELS[itemId]}
              checked={dayState.items[itemId]}
              onToggle={() => onToggle(itemId)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
