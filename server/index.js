const { fetchData } = require('./fetch');
const { closeWriter, writeSensor } = require('./write');
const { getLastUpdate, setLastUpdate } = require('./persist');

const fetchSensors = async () => {
  const response = await fetchData('/sensors/list');
  const json = await response.json();

  return json.sensor;
}

const getSensorHistory = async (sensor, lastUpdate) => {
  const parameters = { id: sensor.id };
  if (lastUpdate) parameters.from = lastUpdate;

  const response = await fetchData('/sensor/history', parameters);
  const json = await response.json();

  console.log(`Updated sensor ${sensor.name}, ${json.history.length} new values`);

  return json.history;
};

const getAllHistories = async () => {
  const sensors = await fetchSensors();
  const lastUpdate = getLastUpdate();
  console.log("Last update", new Date(lastUpdate * 1000).toString())

  let latestUpdate = lastUpdate || 0;
  for (const sensor of sensors) {
    const history = await getSensorHistory(sensor, lastUpdate);
    
    latestUpdate = Math.max(latestUpdate, ...history.map(value => value.ts));
    
    writeSensor(sensor, history);
  }

  setLastUpdate(latestUpdate);

  const success = await closeWriter();
  if (success) {
    console.log('Success');
  } else {
    console.log('Failed');
    process.exit(1);
  }
};

getAllHistories();
