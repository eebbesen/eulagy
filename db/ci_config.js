var config = {
  test: {
    host:     process.env.CI_PG_HOST,
    port:     '5432',
    database: 'eulagy_test',
    user:     'eulagy_test',
    password: process.env.CI_PG_PASS
  }
};

module.exports = config;
