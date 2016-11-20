/**
* Network Model
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PacketSchema = new Schema({
  panid:    {type: String},
  highest_layer:    {type: String},
  local_ipv6_src:    {type: String},
  local_ipv6_dst:    {type: String},
  ipv6_src:    {type: String},
  ipv6_dst:    {type: String},
  coap_code:    {type: String},
  layers:     [{type: String}],
  src_port:    {type: Number},
  dst_port:    {type: Number}
});

module.exports = mongoose.model('Packet', PacketSchema);
