const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const { dbs } = require('../keys');

const client = new InfluxDB(dbs.local.host);

const writeApi = client.getWriteApi(dbs.local.details.org, dbs.local.details.bucket, 's');
writeApi.useDefaultTags({ host: 'Telldus API' });

const writeSensor = (sensor, history) => {
  for (const { ts, data } of history) {
    for (const { name, value } of data) {
      const point = new Point(sensor.name)
        .floatField(name, value)
        .timestamp(ts)
      writeApi.writePoint(point)
    }
  }
}

const closeWriter = async () => {
  try {
    await writeApi.close();
    console.log('Finished');
  } catch (error) {
    console.error(e);
    console.log('\nFinished ERROR');
  }
};

module.exports = {
  writeSensor,
  closeWriter,
};
