const { readFileSync, writeFileSync } = require("fs");

const { resolveRelative } = require("../config/paths");

class PersistState {
  constructor(path) {
    this.path = resolveRelative(path);
    this.state = {};

    this.readPersistedState();
  }

  readPersistedState = () => {
    try {
      const raw = readFileSync(this.path);
      this.state = JSON.parse(raw);
    } catch (error) {
      console.log("No state file persited yet, using empty state");
    }
  };

  writePersistedState = () => {
    const data = JSON.stringify(this.state);
    writeFileSync(this.path, data);
  };

  getLastUpdate = (id) => this.state[id];
  setLastUpdate = (id, value) => (this.state[id] = value);
}

module.exports = {
  state: new PersistState("temp/lastUpdate.json"),
};
