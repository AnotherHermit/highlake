const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const { dbs } = require("../temp/keys");

const client = new InfluxDB(dbs.local.host);

const { org, bucket } = dbs.local.details;
const writeApi = client.getWriteApi(org, bucket, "s");

writeApi.useDefaultTags({ host: "Telldus API" });

const writeSensor = (sensor, history) => {
  for (const { ts, data } of history) {
    for (const { name, value } of data) {
      const point = new Point(sensor.name)
        .floatField(name, value)
        .timestamp(ts);
      writeApi.writePoint(point);
    }
  }
};

const writeDevice = (device, history) => {
  for (const { ts, state, origin, successStatus } of history) {
    const point = new Point(device.name)
      .booleanField("state", state === 1)
      .tag("origin", origin)
      .tag("success", successStatus === 0)
      .timestamp(ts);
    writeApi.writePoint(point);
  }
};

const closeWriter = async () => {
  try {
    await writeApi.close();
    console.log("Database updated");
    return true;
  } catch (error) {
    console.error(error);
    console.log("\nCould not update database");
    return false;
  }
};

module.exports = {
  writeSensor,
  writeDevice,
  closeWriter,
};
