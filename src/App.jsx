import React, { useEffect, useMemo, useState } from 'react';
import CircleView from './components/CircleView';
import HistoryTapestry from './components/HistoryTapestry';
import QuadrantView from './components/QuadrantView';
import RecollectionModal from './components/RecollectionModal';
import { GROUPS } from './data';
import { createBlankDay, getTodayKey, loadRecords, saveRecords, todayDisplayLabel } from './storage';

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const todayKey = getTodayKey(now);
  const [records, setRecords] = useState(() => loadRecords());
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showRecollection, setShowRecollection] = useState(false);

  const dayState = records[todayKey] || createBlankDay();

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  const selectedGroup = useMemo(
    () => GROUPS.find((group) => group.id === selectedQuadrant) || null,
    [selectedQuadrant]
  );

  function updateDay(mutator) {
    setRecords((prev) => {
      const current = prev[todayKey] || createBlankDay();
      const nextDay = mutator(current);
      return {
        ...prev,
        [todayKey]: nextDay
      };
    });
  }

  function handleToggle(itemId) {
    updateDay((current) => {
      const checked = !current.items[itemId];
      const next = {
        ...current,
        items: {
          ...current.items,
          [itemId]: checked
        }
      };

      if (itemId === 'recollection') {
        if (checked) {
          setShowRecollection(true);
        } else {
          next.recollection = null;
        }
      }

      return next;
    });
  }

  function handleSaveRecollection(payload) {
    updateDay((current) => ({
      ...current,
      recollection: {
        tone: payload.tone || '',
        note: payload.note || ''
      }
    }));
    setShowRecollection(false);
  }

  function handleCloseRecollection() {
    setShowRecollection(false);
  }

  return (
    <div className="app-shell">
      {!selectedGroup ? (
        <CircleView
          dayState={dayState}
          dateLabel={todayDisplayLabel(now)}
          onSelectQuadrant={setSelectedQuadrant}
          onHistory={() => setShowHistory(true)}
        />
      ) : (
        <QuadrantView
          group={selectedGroup}
          dayState={dayState}
          onBack={() => setSelectedQuadrant(null)}
          onToggle={handleToggle}
        />
      )}

      <RecollectionModal
        open={showRecollection}
        initialValue={dayState.recollection}
        onClose={handleCloseRecollection}
        onSave={handleSaveRecollection}
      />

      <HistoryTapestry open={showHistory} records={records} onClose={() => setShowHistory(false)} />
    </div>
  );
}
