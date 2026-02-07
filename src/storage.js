import { ALL_ITEM_IDS } from './data';

const STORAGE_KEY = 'dailyWitness.records.v1';

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function todayDisplayLabel() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());
}

function blankItems() {
  return ALL_ITEM_IDS.reduce((acc, id) => {
    acc[id] = false;
    return acc;
  }, {});
}

function normalizeRecord(record) {
  const items = {
    ...blankItems(),
    ...(record?.items || {})
  };

  return {
    items,
    recollection: record?.recollection
      ? {
          tone: record.recollection.tone || '',
          note: record.recollection.note || ''
        }
      : null
  };
}

export function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const normalized = {};
    Object.entries(parsed).forEach(([day, record]) => {
      normalized[day] = normalizeRecord(record);
    });

    return normalized;
  } catch {
    return {};
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createBlankDay() {
  return {
    items: blankItems(),
    recollection: null
  };
}
