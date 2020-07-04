const { InfluxDB } = require('@influxdata/influxdb-client');
const { Point } = require('@influxdata/influxdb-client')

const { influxTokens } = require('./keys');

const client = new InfluxDB({
  url: 'https://eu-central-1-1.aws.cloud2.influxdata.com', 
  token: influxTokens.token
});

const writeApi = client.getWriteApi(influxTokens.org, influxTokens.bucket, 's');
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
