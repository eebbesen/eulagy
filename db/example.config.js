var config = {
  development: {
    database: {
      host:     'name.random.us-east-1.rds.amazonaws.com',
      port:     '5432',
      db:       'eulagy'
      user:     'eulagy_user',
      password: 'abcd1234^'
    }
  },
  test: {
    database: {
      host:     'name.random.us-east-1.rds.amazonaws.com',
      port:     '5432',
      db:       'eulagy.test'
      user:     'eulagy_user',
      password: 'abcd1234^'
    }
  }
};

module.exports = config;
