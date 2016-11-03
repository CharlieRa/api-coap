/**
* Network Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NetworkSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    motes: [{ type: Schema.Types.ObjectId, ref: 'Mote' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Network', NetworkSchema);
