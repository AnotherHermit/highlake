const { fetchData } = require('./fetch');
const { closeWriter, writeSensor } = require('./write');

const fetchSensors = async () => {
  const response = await fetchData('/sensors/list');
  const json = await response.json();

  return json.sensor;
}

const getSensorHistory = async sensor => {
  const response = await fetchData('/sensor/history', { id: sensor.id });
  const json = await response.json();
  
  return json.history;
};

const getAllHistories = async () => {
  const sensors = await fetchSensors();

  for (const sensor of sensors) {
    const history = await getSensorHistory(sensor);
    writeSensor(sensor, history);
  }

  closeWriter();
};

getAllHistories();
