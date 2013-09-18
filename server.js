//Simple HTTP/JSON server (yes - Express could be used but wanted only core stuff for this demo)
var server = function () {

    var http = require('http'),
		url = require('url'),
        fs = require('fs'),

		start = function (port) {
		    var server = http.createServer(function (req, res) {
		        var pathName = url.parse(req.url).pathname;
		        if (pathName === '/') pathName = '/index.html';
		        if (req.headers['accept'].indexOf('application/json') > -1 && pathName.indexOf('.html') == -1)
		        {
		            processJsonRequest(res, pathName);
		        }
		        else {
		            processHttpRequest(res, pathName);
		        }
		    });

		    server.listen(port, function () {
		        console.log('Listening on ' + port + '...');
		    });
		},

        processHttpRequest = function (res, pathName) {
            if (!pathName.indexOf('/') == 0) pathName = '/' + pathName;
        	fs.readFile(__dirname + pathName, function (err, data) {
        		if (err) {
        		    res.writeHead(500);
        		    return res.end('Error loading ' + pathName + ' ' + err.message);
        		}
        		var contentType = getContentType(pathName);
        		res.writeHead(200, { "Content-Type": contentType });
        		res.end(data);
        	});
        },

		processJsonRequest = function (res, pathName) {
		    var json = '';
		    switch (pathName) {
		        case '/api/dataservice/existingcustomers':
		            json = '[{"firstName":"John", "lastName":"Doe", "city":"Chandler", "state":"AZ"},{"firstName":"Jane", "lastName":"Doe", "city":"Scottsdale", "state":"AZ"}]';
		            break;
		        case '/api/dataservice/newcustomers':
		            json = '[{"firstName":"Jimmy", "lastName":"Smith", "city":"San Diego", "state":"CA"},{"firstName":"Michelle", "lastName":"Smith", "city":"Los Angeles", "state":"CA"}]';
		            break;
		    }
            //Simulate a longer request
		    setTimeout(function () {
		        res.writeHead(200, { "Content-Type": "application/json" });
		        res.write(json);
		        res.end();
		    }, 5000);
		},

        getContentType = function (pathName) {
            if (pathName.indexOf('.css') > 0) return "text/css";
            if (pathName.indexOf('.js') > 0) return "application/javascript";
            return "text/html";
        }

    return {
        start: start
    }
}();

server.start(9000);