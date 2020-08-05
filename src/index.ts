import {
  fetchSensors,
  fetchDevices,
  fetchSensorHistory,
  fetchDeviceHistory,
} from './fetch';
import { closeWriter, writeSensor, writeDevice } from './write';
import { state } from './persist';

const updateSensors = async () => {
  const sensors = await fetchSensors();

  const queueUpdates = sensors.map(async (sensor: any) => {
    const history = await fetchSensorHistory(sensor);
    writeSensor(sensor, history);
  });

  await Promise.all(queueUpdates);
};

const updateDevices = async () => {
  const devices = await fetchDevices();

  const queueUpdates = devices.map(async (device: any) => {
    const history = await fetchDeviceHistory(device);
    writeDevice(device, history);
  });

  await Promise.all(queueUpdates);
};

const getAllHistories = async () => {
  await Promise.all([updateSensors(), updateDevices()]);

  const success = await closeWriter();
  if (success) {
    state.writePersistedState();

    // eslint-disable-next-line no-console
    console.log('Success');
  } else {
    // eslint-disable-next-line no-console
    console.log('Failed');

    process.exit(1);
  }
};

getAllHistories();
