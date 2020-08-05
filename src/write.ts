import { InfluxDB, Point, WritePrecision } from '@influxdata/influxdb-client';

import { apis, env } from '../secrets.json';

const db = env.influxDB as 'hermitscave-remote' | 'hermitscave-local' | 'cloud';
const { host, details } = apis.influxDB[db];

const client = new InfluxDB(host);

const { org, bucket } = details;
const writeApi = client.getWriteApi(org, bucket, WritePrecision.s);

writeApi.useDefaultTags({ host: 'Telldus API' });

export const writeSensor = (sensor: any, history: any) => {
  for (const { ts, data } of history) {
    for (const { name, value } of data) {
      const point = new Point(sensor.name)
        .floatField(name, value)
        .timestamp(ts);
      writeApi.writePoint(point);
    }
  }
};

export const writeDevice = (device: any, history: any) => {
  for (const { ts, state, origin, successStatus } of history) {
    const point = new Point(device.name)
      .booleanField('state', state === 1)
      .tag('origin', origin)
      .tag('success', `${successStatus === 0}`)
      .timestamp(ts);
    writeApi.writePoint(point);
  }
};

export const closeWriter = async () => {
  try {
    await writeApi.close();
    // eslint-disable-next-line no-console
    console.log('Database updated');

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    // eslint-disable-next-line no-console
    console.warn('\nCould not update database');
    return false;
  }
};
