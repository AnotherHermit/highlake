const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const { dbs } = require('../temp/keys');

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
    console.log('Database updated');
    return true;
  } catch (error) {
    console.error(error);
    console.log('\nCould not update database');
    return false;
  }
};

module.exports = {
  writeSensor,
  closeWriter,
};
