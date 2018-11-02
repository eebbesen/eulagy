'use strict'

const env = process.env.NODE_ENV || 'development';

// database
const dbConfig = require('./db/config');
const { Client } = require('pg');
const client = new Client(dbConfig[env]);

const getText = async function() {
  let rows;
  try {
    await client.connect();
    rows = await client.query('SELECT content FROM eulas');
    await client.end();
  } catch (err) {
    console.log('ERROR in getText', err);
  }
  return rows.rows[0]['content'];
}

module.exports.getText = getText;
