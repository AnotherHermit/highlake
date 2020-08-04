const { fetchData } = require("./fetch");
const { closeWriter, writeSensor, writeDevice } = require("./write");
const { state } = require("./persist");

const fetchList = async (url, property) => {
  try {
    const response = await fetchData(url);
    console.log("fetchList -> response", response);
    const json = await response.json();
    return json[property];
  } catch (error) {
    console.log(`Could not fetch data from ${url}`);
    throw error;
  }
};

fetchHistory = async (url, item) => {
  const { id, name } = item;
  const type = item.type || "sensor";
  let lastUpdate = state.getLastUpdate(id) || 0;

  const parameters = { id };
  if (lastUpdate) parameters.from = lastUpdate;

  const lastUpdateDate = new Date(lastUpdate * 1000).toString();
  console.log(`Getting updates for ${name} since ${lastUpdateDate}`);

  let history;
  try {
    const response = await fetchData(url, parameters);
    const json = await response.json();
    history = json.history;
  } catch (error) {
    console.log(`Could not fetch ${type} history for ${name}.`);

    throw error;
  }

  const updates = history.length;
  console.log(`Updated ${type} ${name}, ${updates} new values`);

  lastUpdate = Math.max(lastUpdate, ...history.map((value) => value.ts));
  state.setLastUpdate(id, lastUpdate);

  return history;
};

const updateSensors = async () => {
  const sensors = await fetchList("/sensors/list", "sensor");

  for (const sensor of sensors) {
    const history = await fetchHistory("/sensor/history", sensor);
    writeSensor(sensor, history);
  }
};

const updateDevices = async () => {
  const devices = await fetchList("/devices/list", "device");

  for (const device of devices) {
    const history = await fetchHistory("/device/history", device);
    writeDevice(device, history);
  }
};

const getAllHistories = async () => {
  await updateSensors();
  await updateDevices();

  const success = await closeWriter();
  if (success) {
    state.writePersistedState();
    console.log("Success");
  } else {
    console.log("Failed");
    process.exit(1);
  }
};

getAllHistories();
