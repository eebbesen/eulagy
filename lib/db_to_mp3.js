'use strict'

const app = require('../app');

const dbToMp3 = function() {
  const records = app
    .getAllRecords()
    .then(rs => {
      rs.forEach(r => {
        app
          .createMp3(r.content, `output/${r.company}.${r.version}`);
      });
    })
};

dbToMp3();