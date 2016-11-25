// var mote_ip = "bbbb::12:4b00:3a5:6b3c";
var mote_ip = request.params.mote_ip;
// var req = coap.request("coap://["+request.params.mote_ip+"]/root");

var req = coap.request("coap://["+mote_ip+"]/"+commandList[command]+"");
// var req = coap.request("coap://[bbbb::12:4b00:3a5:6b3c]/root");
req.on('error', function(err) {
  console.log(err);
  response.json({ response: 'error' });
});

req.on('timeout', function () {
  response.json({ response: 'timeout' });
  console.log('timeout');
});

req.on('response', function(res) {
  console.log("res: "+res);
  if(!res) {
    console.log("not respond");
  }
  res.pipe(bl(function(err, data) {
    console.log("err: "+err);
    console.log("data: "+data);
    console.log(data[0]);
    console.log(data[1]);
    console.log(parseInt(data[0]));
    // var temp1 = (data[0] << 8) + data[1]
    // var temperatura1 =-46.86+175.72*temp1/65536
    // console.log(temp1);
    // console.log(temperatura1);
    // var hum1 = (data[0] << 8)+data[1]
    // console.log(hum1);
    // var humedad1 = -6.0+125.0 * hum1 / 65536
    // console.log(humedad1);
    // if(err) {
    // 	console.log(err);
    // }
    response.json({ response: 'yes' });
     dataResponse = trimNewlines(data.toString());
   }));
});
req.end();
