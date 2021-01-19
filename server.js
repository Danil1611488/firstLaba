const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const PORT = 3001;
const dbUrl = "mongodb://localhost:27017/";
const dbName = "DB";

const app = express();
const mongoClient = new MongoClient(dbUrl);

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.get("/", (request, response) => {
  response.send("It is working");
});

app.get("/volontiers", (request, response) => {
  mongoClient.connect((error, client) => {
    if (!error) {
      const db = client.db(dbName);
      const collection = db.collection("volontiers");

      collection.find({ "work": "volontier" }).toArray((error, results) => {
        if (error) {
	  console.error('error', error)
          return;
        }

	console.log('list of volontiers, results')
        response.send(results);
        response.sendStatus(200);
        client.close();
      });
    } else {
      console.error('error', error)

      response.sendStatus(500);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT} port`);
});
