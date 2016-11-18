/**
* Network Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NetworkSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    panid:  { type: String, required: true, lowercase: true },
    motes: [{ type: Schema.Types.ObjectId, ref: 'Mote' }]
});

module.exports = mongoose.model('Network', NetworkSchema);
