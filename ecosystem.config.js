module.exports = {
  apps: [{
    name: 'API-Server',
    script: 'index.js',
    exec_mode: 'cluster',
    instances: '1',
    watch: '.',
  }],
};
