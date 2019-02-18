var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

esClient.indices.create({
  index: "911",
  body: {
    "mappings": {
      "_doc": {
        "properties": {
          "location": {
            "type": "geo_point"
          }
        }
      }
    }
  }
}, (err, resp) => {
  if(err) {
    console.log(err);
  } else {
    console.log("Index created with success");
  }
});

// Oui c'est de l'asynchrone mais ça devrait finir avant qu'on ait parsé le fichier

const bulkBody = [];

fs.createReadStream('../911.csv')
  .pipe(csv())
  .on('data', data => {
    // extract one line from CSV
    bulkBody.push({ index:  { _index: "911", _type: "_doc" } });
    bulkBody.push({
      "location": [parseFloat(data.lng), parseFloat(data.lat)],
      "desc": data.desc,
      "zip": parseInt(data.zip),
      "title": data.title,
      "@timestamp": new Date(data.timeStamp),
      "twp": data.twp,
      "addr": data.addr
    });
  })
  .on('end', () => {
    // insert data to ES
    esClient.bulk({
      body: bulkBody
    }, (err, resp) => {
      if(err) {
        console.log(err);
      } else {
        console.log(`All good : ${resp.items.length} items inserted`);
      }
    });
  });
