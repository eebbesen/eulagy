'use strict'

const app = require('../app');

const dbToMp3 = function() {
  let counter = 0;
  const records = app
    .getAllRecords()
    .then(rs => {
      rs.forEach(r => {
        const chunks = r.content.match(/[\s\S]{1,2999}/g);
        chunks.forEach(c => {
          app.createMp3(c, `output/${r.company}.${r.version}.${counter++}`);
        });
      });
    })
};

dbToMp3();