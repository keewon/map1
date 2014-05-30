#!/usr/bin/python
# coding=utf-8

print 'Content-Type: application/json'
print 

import cgi
import cgitb
import urllib, urllib2
#import xml.etree.ElementTree as ET
import json

cgitb.enable()

form = cgi.FieldStorage()

q = form.getvalue('q', '')

if len(q) > 0:
    url = ("http://map.naver.com/search2/local.nhn?sm=hty&menu=location&query=" + urllib.quote_plus(q))
    #url = ("http://openapi.map.naver.com/api/geocode.php?key=" +
    #    "a17035f1be1947626b27325e9def210e" +
    #        "&query=" + q + "&encoding=utf-8&coord=latlng")

    #url = ("http://openapi.naver.com/search?key=" +
    #    "65ca837920a36c96a9ec6636d0f76a87" +
    #    "&target=local&query=" + urllib.quote_plus(q))
    
    data = urllib2.urlopen(url).read()
    print data
    #print parse_xml(data)


def parse_xml(data):
    result = []
    root = ET.fromstring(data)
    for item in root.iter('item'):
        try:
            result.append({
                'title': item.find('title').text,
                'mapx': item.find('mapx').text,
                'mapy': item.find('mapy').text
                })
        except:
            pass

    return json.dumps( result )

