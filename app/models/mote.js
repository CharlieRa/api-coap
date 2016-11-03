/**
* Mote Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MoteSchema = new Schema({
    name:   { type: String, required: true },
    mac:    { type: String, required: true, lowercase: true },
    panid:  { type: String, required: true, lowercase: true },
    id16b:  { type: String, required: false, lowercase: true },
    eui64:  { type: String, required: true, lowercase: true },
    dagroot: { type: Boolean },
    ipv6:   { type: String, required: true, lowercase: true },
    commands: [{ type: String, lowercase: true }]
});

module.exports = mongoose.model('Mote', MoteSchema);
