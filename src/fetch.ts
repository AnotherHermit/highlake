import { URLSearchParams } from 'url';

import fetch from 'node-fetch';

import { apis } from '../secrets.json';

import { getHeaders } from './auth';
import { state } from './persist';

const fetchData = (url: string, params?: Record<string, string>) => {
  let paramString = '';
  if (params) {
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      p.set(key, value);
    }
    paramString = p.toString();
  }

  let fullUrl = `${apis.telldus.url}${url}`;
  if (paramString) fullUrl = `${fullUrl}?${paramString}`;
  const requestData = {
    url: fullUrl,
    method: 'GET',
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { Authorization } = getHeaders(requestData);
  return fetch(requestData.url, {
    method: requestData.method,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { Authorization },
  });
};

const fetchList = async (url: string, property: string) => {
  try {
    const response = await fetchData(url);
    const json = await response.json();

    return json[property];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Could not fetch data from ${url}`);

    throw error;
  }
};

const fetchHistory = async (url: string, item: any) => {
  const { id, name } = item;
  const type = item.type || 'sensor';
  let lastUpdate = state.getLastUpdate(id) || 0;

  const parameters: Record<string, any> = { id };
  if (lastUpdate) parameters.from = lastUpdate;

  const lastUpdateDate = new Date(lastUpdate * 1000).toLocaleString();

  // eslint-disable-next-line no-console
  console.log(`Getting updates for ${name} since ${lastUpdateDate}`);

  let history;
  try {
    const response = await fetchData(url, parameters);
    const json = await response.json();
    history = json.history;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Could not fetch ${type} history for ${name}.`);

    throw error;
  }

  const updates = history.length;
  // eslint-disable-next-line no-console
  console.warn(`Updated ${type} ${name}, ${updates} new values`);

  lastUpdate = Math.max(lastUpdate, ...history.map((value: any) => value.ts));
  state.setLastUpdate(id, lastUpdate);

  return history;
};

export const fetchSensors = () => fetchList('/sensors/list', 'sensor');
export const fetchDevices = () => fetchList('/devices/list', 'device');

export const fetchSensorHistory = (sensor: any) =>
  fetchHistory('/sensor/history', sensor);
export const fetchDeviceHistory = (device: any) =>
  fetchHistory('/device/history', device);
