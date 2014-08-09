#!/usr/bin/python

print 'Content-Type: application/json'
print 

import cgi
import cgitb
import urllib2

cgitb.enable()

form = cgi.FieldStorage()

method = form.getvalue('by', 'bmw')
startX = form.getvalue('startX', "127")
startY = form.getvalue('startY', "37")
endX   = form.getvalue('endX', "128")
endY   = form.getvalue('endY', "38")

if method == 'bmw':
    url = ("http://map.naver.com/findroute2/searchPubtransPath.nhn?" + 
        "apiVersion=3&searchType=0&" + 
        "start=" + startX + "%2C" + startY + "%2Cstart&destination=" +
        endX + "%2C" + endY + "%2Cdest");
    
elif method == 'car' or method == 'bicycle':
    code = '2' if method == 'car' else '8'
    url = ("http://map.naver.com/spirra/findCarRoute.nhn?" + 
        "route=route3&output=json&result=web3&coord_type=naver&search=" +
        code  + "&car=0&mileage=12.4&" +
        "start=" + startX + "%2C" + startY + "%2Cstart&destination=" +
        endX + "%2C" + endY + "%2Cdest");
    
req = urllib2.Request(url, headers={ 'User-Agent': 'Mozilla/5.0' })
print urllib2.urlopen(req).read()
