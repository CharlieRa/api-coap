#!/usr/bin/python

####
# Script que captura paquetes de la red e inserta en mongoDB para mostrarlos en plataforma
#
import pyshark
from pymongo import *
from mongothon import *
import os
import sys

pid = str(os.getpid())
pidfile = "/tmp/liveCapture.pid"

if os.path.isfile(pidfile):
    print "%s Ya existe, terminando" % pidfile
    sys.exit()
file(pidfile, 'w').write(pid)
try:
    client = MongoClient('localhost', 27017)
    db = client['api-coap']
    db.drop_collection('packets')
    packet_schema = Schema({
        "panid":    {"type": basestring},
        "highest_layer":    {"type": basestring},
        "local_ipv6_src":    {"type": basestring},
        "local_ipv6_dst":    {"type": basestring},
        "ipv6_src":    {"type": basestring},
        "ipv6_dst":    {"type": basestring},
        "coap_code":    {"type": basestring},
        "layers":    {"type":  Array(basestring), "default": []},
        "src_port":    {"type": int},
        "dst_port":    {"type": int},
    })

    Packet = create_model(packet_schema, db['packets'])

    capture = pyshark.LiveCapture(interface='tun0')
    totalPackets = 0
    malformedPackets = 0
    coapPackets = 0
    coapCheck = False
    icmpCheck = False
    sixLowPanCheck = False
    for packet in capture.sniff_continuously(packet_count=100):
        coapCode = None
        src_port = None
        dst_port = None
        srcIpv6  = None
        dstIpv6  = None
        panId = None
        highest_layer = None
        sixLowDst = None
        sixLowSrc = None
        layersList = []
        if 'wpan' in packet:
            panId = packet.wpan.dst_pan.split('x')[1]
            panId = panId[:2] + '-' + panId[2:]
        # print packet
        # print dir(packet)
        # print packet.wpan
        # print packet.wpan.dst_pan
        highest_layer = packet.highest_layer.lower()

        for layer in packet.layers:
            layersList.append(layer.layer_name)
            if(layer.layer_name == 'malformed'):
                malformedPackets = malformedPackets + 1
            if(layer.layer_name == 'coap'):
                coapPackets = coapPackets + 1
                coapCheck = True
            if(layer.layer_name == '6lowpan'):
                sixLowPanCheck = True
            if(layer.layer_name == 'icmpv6'):
                icmpCheck = True
        if(coapCheck):
            coapCode = packet.coap.code
        if(sixLowPanCheck):
            sixLowDst = packet['6lowpan'].dst
            sixLowSrc = packet['6lowpan'].src
        src_port = packet.udp.srcPort
        dst_port = packet.udp.dstPort
        srcIpv6  = packet.ipv6.src
        dstIpv6  = packet.ipv6.dst
        coapCheck = False
        icmpCheck = False
        sixLowPanCheck = False
        packet = Packet({
            "panid": panId,
            "highest_layer": highest_layer,
            "local_ipv6_src": sixLowSrc,
            "local_ipv6_dst": sixLowDst,
            "ipv6_src": srcIpv6,
            "ipv6_dst":  dstIpv6,
            "coap_code":coapCode ,
            "layers" : layersList,
            "src_port": int(src_port),
            "dst_port": int(dst_port)
        })
        packet.save()
        print "packet captured!"
finally:
    os.unlink(pidfile)
