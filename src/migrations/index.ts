import * as migration_20251110_013726 from './20251110_013726';

export const migrations = [
  {
    up: migration_20251110_013726.up,
    down: migration_20251110_013726.down,
    name: '20251110_013726'
  },
];
