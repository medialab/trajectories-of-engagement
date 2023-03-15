const async = require('async');
const express = require('express');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const cors = require('cors');
const reqYml = require('require-yml')
const bodyParser = require('body-parser');
const Fingerprint = require('express-fingerprint');
const MongoClient = require('mongodb').MongoClient;
const Ajv = require('ajv');
const morgan = require('morgan');
const config = require('./vendors');
const basicAuth = require('express-basic-auth');
// const  chron = new require("chron")();

/**
 * passwords management
 */
const salt = 8;
const adminPassword = config.get('adminPassword');

const hash = (password) => bcrypt.hash(password, salt);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);


/**
 * Validation
 */
const ajv = new Ajv();
const responseSchema = reqYml('./schemas/trajectory.yml');
const validateTrajectory = ajv.compile(responseSchema);

/**
 * Mongo
 */
const PORT = config.get('port');
const MONGO_CONFIG = config.get('mongo');

// will contain the mongo collection pointer
let TRAJECTORIES;


/**
 * @todo refine and externalize that
 * (careful should match the client equivalent)
 */
const isValidPassword = pwd => {
  return pwd !== null && pwd !== undefined && pwd.length > 2;
}

/**
 * Connect to mongo
 */
function connect(callback) {
  const auth = `${encodeURIComponent(MONGO_CONFIG.user)}:${encodeURIComponent(
    MONGO_CONFIG.password
  )}`;

  const url = `mongodb://${auth}@${MONGO_CONFIG.host}:${MONGO_CONFIG.port}/admin`;

  const client = new MongoClient(url, { useUnifiedTopology: true });

  return client.connect(err => {
    if (err) return callback(err);

    return callback(null, client);
  });
}

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  Fingerprint({
    parameters: [
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip
    ]
  })
);

function timestampMiddleware(req, res, next) {
  req.timestamp = +new Date();
  return next();
}

app.use(timestampMiddleware);

app.use(cors());

function validateMiddleware(req, res, next) {
  if (!req.body || !req.body.data || typeof req.body.data !== 'object') {
    return res.status(400).send('Bad request');
  }

  const valid = validateTrajectory(req.body.data);

  if (!valid) {
    return res.status(400).send({
      errors: validateTrajectory.errors
    });
  }

  return next();
}


// const authMiddleware = basicAuth({
//   users: {
//     [MONGO_CONFIG.user]: MONGO_CONFIG.password
//   },
//   challenge: true
// });

const authenticate = (password, trajectoryId) =>
  new Promise((resolve, reject) => {
    // admin resolves all
    if (password === adminPassword) {
      resolve();
      // if a trajectory is specified look
      // for its specific password
    } else if (trajectoryId) {
      TRAJECTORIES.findOne({ 'data.id': trajectoryId }, (err, item) => {
        if (err) {
          console.error(err);
          return reject(err);
        } else if (item) {
          const { hashedPassword } = item;
          comparePassword(password, hashedPassword)
            .then(resolve)
            .catch(reject);
        } else {
          reject();
        }
      })
    } else {
      reject();
    }
  });

function authMiddleware(req, res, next) {
  const trajectoryId = req.params.id;
  let auth = req.headers.authorization;
  auth = auth.length ? auth.split(' ')[1] : undefined;
  auth = auth ? atob(auth) : undefined;
  if (auth) {
    const password = auth.split(':').slice(1).join(':');
    authenticate(password, trajectoryId)
    .then(() => next())
    .catch(() => res.status(403).send('Invalid password'))
  } else {
    return res.status(403).send('No password provided for a protected route');
  }
}

/**
 * TRAJECTORIES CRUD
 */

/**
 * GET TRAJECTORY
 */
app.get('/trajectory/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  console.log('get trajectory', id);
  return TRAJECTORIES.findOne({ 'data.id': id }, (err, item) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    return res.send(item);
  });
});

/**
 * CREATE TRAJECTORY
 */
app.post('/trajectory/:id', validateMiddleware, authMiddleware, (req, res) => {
  const pwd = req.body.data.password;
  if (!isValidPassword(pwd)) {
    return res.status(400).send('Invalid password');
  }
  hash(pwd)
    .then(hashedPassword => {
      const trajectory = Object.assign({}, req.body.data, {
        password: undefined,
      });
      delete trajectory.password;
      const item = {
        timestamp: req.timestamp,
        fingerprint: req.fingerprint,
        hashedPassword,
        data: trajectory
      };

      return TRAJECTORIES.insertOne(item, err => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }

        return res.send('Ok');
      });

    })
});

/**
 * UPDATE TRAJECTORY
 */
app.put('/trajectory/:id', validateMiddleware, authMiddleware, (req, res) => {
  const { id } = req.params;
  const query = { 'data.id': id };
  const newValues = { '$set': { 'data': req.body.data } };
  return TRAJECTORIES.updateOne(query, newValues, err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    return res.send('Ok');
  });
});


/**
 * UPDATE TRAJECTORY PWD
 */
app.put('/trajectory/password/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const query = { 'data.id': id };
  const pwd = req.body && req.body.password;
  if (isValidPassword(pwd)) {
    hash(pwd)
      .then(hashedPassword => {
        const newValues = { '$set': { hashedPassword: hashedPassword } };
        return TRAJECTORIES.updateOne(query, newValues, err => {
          if (err) {
            console.error(err);
            return res.status(500).send('Server error');
          }

          return res.send('Ok');
        });
      });
  } else {
    res.status(400).send('Invalid password');
  }

});

/**
 * DELETE TRAJECTORY
 */
app.delete('/trajectory/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const query = { 'data.id': id };
  return TRAJECTORIES.deleteOne(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    return res.send('Ok');
  });
});



app.put('/checkauth/:id?', (req, res) => {
  const pwd = req.body.password;
  const id = req.params && req.params.id;
  authenticate(pwd, id)
    .then(() => {
      res.status(200).send('Valid password');
    })
    .catch(() => {
      res.status(403).send('Invalid password');
    })
})

/**
 * GET ALL TRAJECTORIES
 */
// app.get('/trajectories', authMiddleware, (req, res) => {
app.get('/trajectories', authMiddleware, (req, res) => {
  return TRAJECTORIES.find({}).toArray((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.json(data);
  });
});

function start(callback) {
  async.series(
    [
      next => {
        console.info('connecting to mongo db');
        connect((err, client) => {
          if (err) {
            console.log('error', err);
            return next(err);
          }
          console.info('connected to mongo db');
          const db = client.db(MONGO_CONFIG.db);

          TRAJECTORIES = db.collection('trajectories');
          return next();
        });
      },
      // // TEST DATA INPUT
      // next => {
      //   const timestamp = +new Date();
      //   const item = {
      //     timestamp,
      //     fingerprint: undefined, // req.fingerprint,
      //     data: {
      //       id: uuid(),
      //       lang: 'fr',
      //       date_created: new Date(),
      //       date_updated: new Date(),
      //       part1_general: {
      //         name: 'test project'
      //       }
      //     }
      //   };

      //   return TRAJECTORIES.insertOne(item, err => {
      //     if (err) {
      //       console.error(err);
      //       return next()
      //     }

      //     return next();
      //   });
      // },
      next => {
        return next();
      },
      next => app.listen(PORT, next),
    ],
    callback
  );
}

start(err => {
  if (err) return console.error(err);

  console.log(`Server listening to port ${PORT}`);
});

// chron.add(UPDATE_CALENDAR_DELAY, updateCalendar)
