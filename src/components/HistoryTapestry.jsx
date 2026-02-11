import React, { useMemo, useState } from 'react';
import { ALL_ITEM_IDS, ITEM_LABELS } from '../data';
import { getDayAnchor, keyFromLocalDate } from '../storage';

const RANGES = [14, 30, 90, 365];

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function seededNoise(seed, min, max) {
  const normalized = (seed % 1000) / 1000;
  return min + (max - min) * normalized;
}

function buildDays(limit, records) {
  const todayAnchor = getDayAnchor(new Date());
  const days = [];

  for (let i = limit - 1; i >= 0; i -= 1) {
    const day = new Date(todayAnchor);
    day.setDate(todayAnchor.getDate() - i);
    const key = keyFromLocalDate(day);
    days.push({
      key,
      record: records[key]
    });
  }

  return days;
}

export default function HistoryTapestry({ open, records, onClose }) {
  const [range, setRange] = useState(30);

  const days = useMemo(() => buildDays(range, records), [range, records]);

  const height = 320;
  const width = Math.max(280, days.length * 8 + 36);
  const topPad = 20;
  const bottomPad = 20;
  const threadTop = topPad;
  const threadBottom = height - bottomPad;
  const rowGap = (threadBottom - threadTop) / (ALL_ITEM_IDS.length + 1);

  if (!open) {
    return null;
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="History">
      <div className="modal-shell" onClick={onClose} />
      <div className="modal-body modal-history">
        <h2>Witness Tapestry</h2>

        <div className="range-row" aria-label="Date range">
          {RANGES.map((entry) => (
            <button
              key={entry}
              type="button"
              className={`range-chip ${range === entry ? 'is-selected' : ''}`}
              onClick={() => setRange(entry)}
            >
              {entry}d
            </button>
          ))}
        </div>

        <div className="tapestry-wrap">
          <svg viewBox={`0 0 ${width} ${height}`} className="tapestry" preserveAspectRatio="none">
            {days.map((day, dayIndex) => {
              const x = 18 + dayIndex * 8;
              const threadSeed = hashString(day.key);
              const lineJitter = seededNoise(threadSeed, -0.8, 0.8);
              const opacity = seededNoise(threadSeed + 99, 0.22, 0.38);

              return (
                <g key={day.key}>
                  <line
                    x1={x + lineJitter}
                    y1={threadTop}
                    x2={x + lineJitter}
                    y2={threadBottom}
                    className="thread"
                    style={{ opacity }}
                  />
                  {ALL_ITEM_IDS.map((itemId, itemIndex) => {
                    if (!day.record?.items?.[itemId]) {
                      return null;
                    }

                    const seed = hashString(`${day.key}-${itemId}`);
                    const y = threadTop + rowGap * (itemIndex + 1) + seededNoise(seed, -1.8, 1.8);
                    const len = seededNoise(seed + 7, 4.5, 7.2);
                    const inkOpacity = seededNoise(seed + 17, 0.55, 0.92);

                    return (
                      <line
                        key={`${day.key}-${itemId}`}
                        x1={x - len / 2}
                        y1={y}
                        x2={x + len / 2}
                        y2={y + seededNoise(seed + 23, -0.6, 0.6)}
                        className="stitch"
                        style={{ opacity: inkOpacity }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        <details className="history-key">
          <summary>Item order</summary>
          <ol>
            {ALL_ITEM_IDS.map((id) => (
              <li key={id}>{ITEM_LABELS[id]}</li>
            ))}
          </ol>
        </details>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
