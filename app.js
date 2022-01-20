const express = require('express');
const Redis = require('ioredis');
const redis = require('redis');
const serviceBindings = require('kube-service-bindings');

const app = express();

const options = kafkaConnectionBindings = serviceBindings.getBinding('REDIS', 'ioredis');
//const options = kafkaConnectionBindings = serviceBindings.getBinding('REDIS', 'redis');
console.log(options);

//const client = redis.createClient(options);
//client.connect();
const client = new Redis (options);

client.on("error", (err) => {
    console.log(err);
});


app.get("/", (req, resp) => {
  client.get("theKey", async (err, value) => {
//  client.get('theKey').then((value) => {
    if (err) {
      resp.status(500).send(err);
    }

    if (value) {
      resp.status(200).send('last cached data:' + value);
    } else {
      resp.status(200).send('No cached value');
    };

    if (req.query.newvalue) {
      client.set('theKey', req.query.newvalue);
    }

    if (req.query.clear) {
      client.del('theKey');
    }
  });
});

app.listen(8080, () => {
  console.log("Server started");
});
