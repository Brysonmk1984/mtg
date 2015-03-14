import urllib2
import urllib
import json
from xml.dom.minidom import parseString
'''
#OPEN RAW SET FILE, READ IT, THEN SAVE NAMES TO NEW FILE
file = open('FRF.json','r')
file = json.load(file)
file = json.dumps(file["cards"])
from StringIO import StringIO
io = StringIO(file)
allCards = json.load(io)
card_name_list = []
for card in allCards:
	print str(card['name'])
	card_name_list.append(str(card['name']))

print card_name_list


listFile = open('FRFnames.txt','w')
listFile.write(str(card_name_list))
'''

#OPEN NAME FILE, LOOP THROUGH AND GET DATA, SAVE TO magic_data.json FILE
setFile = open('test.txt','r')
card_list = eval(setFile.read())
setFile.close()

currentSet = "Fate Reforged"
card_object_list = []
set_object = {currentSet : []}
for card in card_list:
	print card_list
	#print 'http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s=Fate%20Reforge&p=' + urllib.quote(card)
'''
	try:
		file = urllib2.urlopen('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s=Fourth%20Edition&p=' + urllib.quote(card), )
		data = file.read()
		file.close()
		#parse the xml you downloaded
		dom = parseString(data)
		elements = ['id','hiprice','lowprice','avgprice','foilavgprice']
		json_data = {'name' : card}
		for e in elements:
			tag = dom.getElementsByTagName(e)[0].toxml()
			#strip off the tag (<tag>data</tag>  --->   data):
			data = tag.replace('<'+ e +'>','').replace('</'+ e +'>','')
			json_data[e] = data
		card_object_list.append(json_data)
		print card
	except:
		print "FAILED: " + card
		continue


# print json.dumps(json_data)
set_object[currentSet] = card_object_list
print set_object
f = open('test.txt', 'w')
f.write(json.dumps(set_object))
f.close()'''
