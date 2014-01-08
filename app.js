//var //servers = require('./servers'),  // server list
var server = null,                   // server to start by default
    mc_server = null,                // minecraft java server process will be held here

    fs = require('fs'),              // module for working with filesystem
    path = require('path'),          // module for working with paths
    nconf = require('nconf'),        // configuration lib
    express = require('express'),    // web framework
    app = express(),
    nunjucks = require('nunjucks');  // template engine

 


// read the config file (nconf)
nconf.file({ file: 'config.json' });

// default configurations if config file does not set them
nconf.defaults({ 'PORT': '9090' });

// configure the app
app.set('TITLE', nconf.get('TITLE'));
app.set('PORT', nconf.get('PORT'));
app.set('SERVERS', nconf.get('SERVERS'));
app.set('SERVERSDIR', nconf.get('SERVERSDIR'));

// set up templating engine
nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/public/templates'),{ autoescape: true });
nunjucksEnv.express(app);

// serve static files
app.use("/public", express.static(__dirname + '/public'));

// configure routes
require('./api/routes')(app);

// set up socketio to communicate with java mc server
require('./include/mcsocketio')(app.get('SERVERS'), app.get('SERVERSDIR'));

// Allows me to type commands into the Console Window to control the MC Server
process.stdin.resume();
process.stdin.on('data', function (data) {
	if (mc_server) {
		mc_server.stdin.write(data);
	}
});

// start the http server
app.listen(app.get('PORT'));