const config = {
  development: {
    host:     'localhost',
    port:     '5432',
    database: 'eulagy',
    user:     'eulagy_user',
    password: 'abcd!1234'
  },
  test: {
    host:     'localhost',
    port:     '5432',
    database: 'eulagy_test',
    user:     'eulagy_test_user',
    password: 'abcd!1234'
  },
  production: {
    host:     'name.random.us-east-1.rds.amazonaws.com',
    port:     '5432',
    database: 'eulagy',
    user:     'eulagy_user',
    password: 'abcd1234^'
  }
}

module.exports = config;
