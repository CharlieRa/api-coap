const coap  = require('coap') // or coap
    , req   = coap.request('coap://[bbbb::1415:92cc:0:2]/i')

req.on('response', function(res) {
  res.pipe(process.stdout)
})

req.end()
