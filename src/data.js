export const GROUPS = [
  {
    id: 'inner',
    label: 'Inner',
    items: ['morningPrayer', 'thanksgiving', 'eveningPrayer']
  },
  {
    id: 'reception',
    label: 'Reception',
    items: ['listening', 'scripture', 'silence']
  },
  {
    id: 'outer',
    label: 'Outer',
    items: ['outdoors', 'movement', 'chores']
  },
  {
    id: 'expression',
    label: 'Expression',
    items: ['charity', 'initiation', 'recollection']
  }
];

export const ITEM_LABELS = {
  morningPrayer: 'Morning Prayer',
  eveningPrayer: 'Evening Prayer',
  thanksgiving: 'Gratitude',
  scripture: 'Scripture',
  silence: 'Silence',
  listening: 'Study',
  outdoors: 'Outdoors',
  movement: 'Movement',
  chores: 'Care',
  charity: 'Charity',
  initiation: 'Initiation',
  recollection: 'Recollection'
};

export const TONES = [
  'Clear',
  'Full',
  'Quiet',
  'Fragmented',
  'Heavy',
  'Grateful',
  'Restless'
];

export const ALL_ITEM_IDS = GROUPS.flatMap((group) => group.items);
