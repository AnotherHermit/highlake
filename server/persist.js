const { readFileSync, writeFileSync } = require('fs');

const { resolveRelative } = require('../config/paths');

const getLastUpdate = () => {
  const filePath = resolveRelative('temp/lastUpdate.json');
  let json = {};

  try {
    const raw = readFileSync(filePath);
    json = JSON.parse(raw);
  } catch (error) {
    return null;
  }

  if (!json.lastUpdate) return null;
  return json.lastUpdate;
};

const setLastUpdate = lastUpdate => {
  const filePath = resolveRelative('temp/lastUpdate.json');
  const data = JSON.stringify({ lastUpdate });
  writeFileSync(filePath, data);
};

module.exports = {
  getLastUpdate,
  setLastUpdate,
};
