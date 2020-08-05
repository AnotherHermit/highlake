import { readFileSync, writeFileSync } from 'fs';

import { resolveRelative } from './paths';

class PersistState {
  private path: string;

  private state: Record<string, number>;

  constructor(path: string) {
    this.path = resolveRelative(path);
    this.state = {};

    this.readPersistedState();
  }

  readPersistedState = () => {
    try {
      const raw = (readFileSync(this.path) as unknown) as string;
      this.state = JSON.parse(raw);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('No state file persited yet, using empty state');
    }
  };

  writePersistedState = () => {
    const data = JSON.stringify(this.state);
    writeFileSync(this.path, data);
  };

  getLastUpdate = (id: string) => this.state[id];

  setLastUpdate = (id: string, value: number) => {
    this.state[id] = value;
  };
}

export const state = new PersistState('lastUpdate.json');
