console.log("Watching for changes...")
var chokidar = require("chokidar");
var browserify = require("browserify");
var fs = require("fs");

chokidar.watch("src/js").on('all', (event, path) => {
  console.log(event + " | " + path);
  
  if(event == "change") {
    console.log("Changes")
    
    var b = browserify();
    b.add(path);
    
    console.log("Building...");
    b.bundle().pipe(
      fs.createWriteStream(__dirname + '/dist/bundle.js')
    );
    console.log("Done.");
  }
})