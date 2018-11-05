'use strict'

const AWS = require('aws-sdk');
const env = process.env.NODE_ENV || 'development';
const fsPromises = require('fs').promises;
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// database
const dbConfig = require('./db/config');
const { Client } = require('pg');

function getClient() {
  return new Client(dbConfig[env]);
}

const handler = function(event) {
  const rec = event.Records[0];
  const fileName = rec.s3.object.key;
  const parts = fileName.split('-');
  const company = parts[0];
  const version = parts[1];
  let text
  let rows

  const params = { Bucket: 'eulagy', Key: fileName };
  return s3.getObject(params, function (err, data) {
    if (err) {
      console.log("Error", err, data);
    }
  }).promise()
  .then(data => {
    text = data.Body.toString()
  })
  .then(() => {
    return synthesizeSpeech(text)
  })
  .then(mp3 => {
    const client = getClient();
    client.connect();
console.log('yyyyy', mp3)
    return client
      .query('insert into eulas(content, company, version, audio) values ($1, $2, $3, $4) RETURNING *', [text, company, version, ('\\x' + mp3.AudioStream.toString('hex'))])
      .then(ret => {
        console.log('zzzzzzz', ret)
        client.end();
        rows = ret.rows;
        return rows
      })
  });
};
    // let counter = 0;
    // const chunks = text.Body.toString().match(/[\s\S]{1,3000}/g);
    // synthesizeSpeech(chunks[0])
    //   .then((mp3data, err) => {
    //     console.log('cccccccc', mp3data, mp3data.AudioStream instanceof Buffer);
    //     if (err) {
    //       console.log('Error in speech synthesis of handler', err);
    //     } else if (mp3data) {
    //       if (mp3data.AudioStream instanceof Buffer) {
    //         const client = getClient();
    //         console.log('ffffff', 'pre-insert');
    //         client.connect();
    //         client
    //           .query('insert into eulas(content, company, version, audio) values ($1, $2, $3, $4) RETURNING *', [text.Body.toString(), company, version, ('\\x' + mp3data.toString('hex'))])
    //           .then(ret => {
    //             client.end();
    //             console.log('dddddddddd', 'inserted!', ret);
    //             return true;
    //           })
    //       }
    //     } else {
    //       throw 'handler: data not a Buffer!!';
    //     }
    //   })
    //   .then(z => {
    //     console.log('zzzzzzzzzz', z)
    //   })
    //   .catch(err => {
    //     console.log('error in handler', err);
    //   });
  // });

const insertRecord = function(content, company, version, audio) {
  const client = getClient();
  let data;
  try {
    client.connect();
    return client
      .query('insert into eulas(content, company, version, audio) values ($1, $2, $3, $4)', [content, company, version, ('\\x' + audio.toString('hex'))])
      .then(ret => {
        client.end();
        console.log('dddddddddd', 'inserted!', ret);
        return true;
      })
      .catch(e => {
        console.log('ERROR inserting record', e);
        client.end();
      });
  } catch (err) {
    client.end();
    console.log('ERROR in insertRecord', err);
  }
};

const getAllRecords = function() {
  const client = getClient();
  let data;
  try {
    client.connect();
    return client
      .query('SELECT content, company, version, audio FROM eulas')
      .then(recs => {
        data = recs.rows
        client.end();
        return data;
      })
      .catch(e => {
        console.log('ERROR selecting all records', e);
        client.end();
      });
  } catch (err) {
    client.end();
    console.log('ERROR in getText', err);
  }
};

// returns random record
const getRecord = function() {
  const client = getClient();
  let data;
  try {
    client.connect();
    return client
      .query('SELECT content, company, version, audio FROM eulas OFFSET floor(random()*(select count(*) from eulas)) LIMIT 1')
      .then(rec => {
        data = rec.rows[0];
        client.end();
        return data;
      })
      .catch(e => {
        console.log('ERROR selecting random record', e);
        client.end();
      });
  } catch (err) {
    console.log('ERROR in getText', err);
  }
};

// returns a promise to create an mp3 from text
const synthesizeSpeech = function(text) {
  const params = {
    'Text': text,
    'OutputFormat': 'mp3',
    'VoiceId': 'Kimberly'
  };
  return Polly.synthesizeSpeech(params).promise();
};

const createMp3 = function(text, name) {
  return synthesizeSpeech(text)
    .then((data, err) => {
      if (err) {
        console.log('Error in speech synthesis of createMp3', err);
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          fsPromises.writeFile(`${name}.kimberly.mp3`, data.AudioStream);
        }
      } else {
        throw 'createMp3: data not a Buffer!!';
      }
    })
    .catch(err => {
      console.log('error in createMp3', err);
    });
};

// thanks to https://codereview.stackexchange.com/questions/88788/save-file-from-request-to-database
const insertAudio = function(file, company) {
  const client = getClient();
  try {
    return fsPromises.readFile(`${file}`)
      .then(d => {
        const data = '\\x' + d.toString('hex');
        client.connect();

        return client
          .query(`update eulas set audio = $1 where company = '${company}'`, [data])
          .then(d => {
            console.log(`done uploading ${file} to ${company}`);
            client.end();
          });
      });
  } catch (err) {
    client.end();
    console.log('ERROR in insertAudio', err);
  }
};

const downloadAudio = function(company) {
  const client = getClient();
  try {
    client.connect();
    return client
      .query(`SELECT content, company, version, audio FROM eulas WHERE company = '${company}'`)
      .then(recs => {
        const rec = recs.rows[0]
        const audio = rec.audio;

        return fsPromises.writeFile(`output/${company}.downloaded.mp3`, audio)
          .then(() => {
            client.end();
          });
      })
      .catch(e => {
        console.log('ERROR selecting record', e);
        client.end();
      });
  } catch (err) {
    client.end();
    console.log('ERROR in downloadAudio', err);
  }
};

module.exports.getAllRecords = getAllRecords;
module.exports.getRecord = getRecord;
module.exports.createMp3 = createMp3;
module.exports.synthesizeSpeech = synthesizeSpeech;
module.exports.insertAudio = insertAudio;
module.exports.downloadAudio = downloadAudio;
module.exports.handler = handler;