var nunjucks = require('nunjucks');  // template engine



var routes = function(app) {


    app.get('/', function(req, res) {
            console.log('got /. rendering index.');
            res.render('index.html', { title: app.get('TITLE') });
        });

}


module.exports = routes;