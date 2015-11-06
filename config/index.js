/**
 * Created by nikolay on 11/6/15.
 */

var nconf = require("nconf");
var path = require("path");

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });

module.exports = nconf;