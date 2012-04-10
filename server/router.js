var fs = require("fs"),
    path = require("path");

function route(handle, pathname, response, request) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
	handle[pathname](response, request);
    } else {
	var filename = path.join(process.cwd(), "../site", pathname);
	path.exists(filename, function(exists) {
	    if(!exists) {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not fount");
		response.end();
		return;
	    }

	    fs.readFile(filename, "binary",  function(err, data) {
		if(err) {
		    response.writeHead(500, {"Content-Type": "text/plain"});
		    response.write(err + "\n");
		    response.end();
		    return;
		}
		
		response.writeHead(200);
		response.write(data, "binary");
		response.end();
	    });
	});
    }
}


exports.route = route;
