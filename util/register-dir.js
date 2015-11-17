module.exports = function(dir){
    var fs = require('fs');
    var path = require('path');

    var dirs = fs.readdirSync(dir);

    var obj = {};

    dirs.forEach(function(file){
        if(file !== "index.src"){
            obj[file.replace(/\.js$/,'')] = require( path.join(dir, file) );
        }
    });

    return obj;
}