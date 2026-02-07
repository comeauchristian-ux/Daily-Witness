import React from 'react';
import { GROUPS } from '../data';

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad)
  };
}

function wedgePath(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  const p1 = polarToCartesian(cx, cy, outerRadius, startAngle);
  const p2 = polarToCartesian(cx, cy, outerRadius, endAngle);
  const p3 = polarToCartesian(cx, cy, innerRadius, endAngle);
  const p4 = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

function stitchLine(cx, cy, radius, angleDeg, checked) {
  const start = polarToCartesian(cx, cy, radius - 6, angleDeg);
  const end = polarToCartesian(cx, cy, radius + 6, angleDeg);
  return <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className={`circle-stitch ${checked ? 'is-on' : ''}`} />;
}

export default function CircleView({ dayState, dateLabel, onSelectQuadrant, onHistory }) {
  const cx = 100;
  const cy = 100;
  const outerRadius = 92;
  const innerRadius = 37;

  return (
    <main className="circle-screen">
      <button type="button" className="history-button" onClick={onHistory}>
        History
      </button>

      <svg className="circle-svg" viewBox="0 0 200 200" role="img" aria-label="Daily Witness Circle">
        <circle cx={cx} cy={cy} r={outerRadius} className="circle-outline" />
        <circle cx={cx} cy={cy} r={innerRadius} className="center-ring" />

        {GROUPS.map((group, index) => {
          const startAngle = -90 + index * 90;
          const endAngle = startAngle + 90;
          const path = wedgePath(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
          const itemAngles = [startAngle + 18, startAngle + 45, startAngle + 72];

          return (
            <g key={group.id}>
              <path
                d={path}
                className="wedge-hit"
                onClick={() => onSelectQuadrant(group.id)}
                role="button"
                tabIndex={0}
                aria-label={group.label}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectQuadrant(group.id);
                  }
                }}
              />

              {itemAngles.map((angle, itemIndex) => (
                <g key={`${group.id}-${group.items[itemIndex]}`}>
                  {stitchLine(cx, cy, outerRadius - 3, angle, dayState.items[group.items[itemIndex]])}
                </g>
              ))}

              <text
                x={polarToCartesian(cx, cy, 62, startAngle + 45).x}
                y={polarToCartesian(cx, cy, 62, startAngle + 45).y}
                className="wedge-label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {group.label}
              </text>
            </g>
          );
        })}

        <text x={cx} y={cy} className="center-date" textAnchor="middle" dominantBaseline="middle">
          {dateLabel}
        </text>
      </svg>
    </main>
  );
}
