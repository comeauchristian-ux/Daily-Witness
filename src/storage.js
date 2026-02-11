import { ALL_ITEM_IDS } from './data';

const STORAGE_KEY = 'dailyWitness.records.v1';
export const DAY_ROLLOVER_HOUR = 4;

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function keyFromLocalDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function getDayAnchor(date = new Date(), rolloverHour = DAY_ROLLOVER_HOUR) {
  const anchor = new Date(date);
  anchor.setHours(0, 0, 0, 0);
  if (date.getHours() < rolloverHour) {
    anchor.setDate(anchor.getDate() - 1);
  }
  return anchor;
}

export function getTodayKey(date = new Date()) {
  return keyFromLocalDate(getDayAnchor(date));
}

export function todayDisplayLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(getDayAnchor(date));
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
