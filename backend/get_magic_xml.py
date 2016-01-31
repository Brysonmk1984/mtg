#!/usr/bin/python2.7
# -*- coding: utf-8 -*-
import urllib2
import urllib
import json
from xml.dom.minidom import parseString

#OPEN NAME FILE, LOOP THROUGH AND GET DATA, SAVE TO magic_data.json FILE
combinedFile = open('/home4/brysonkr/public_html/mtg/backend/magic_data_names_accurate.json')
#combinedFile = open('magic_data_names_accurate.json')

combined_set_list = json.loads(combinedFile.read())

combinedFile.close()
#Sets that exit in DOM, mapped to set code
name_map = {"2ED":"Unlimited Edition","ATQ":"Antiquities","AVR":"Avacyn Restored","BFZ":"Battle for Zendikar","BNG":"Born of the Gods","DGM":"Dragon's Maze","DKA":"Dark Ascension","DRK":"The Dark","DTK":"Dragons of Tarkir","FEM":"Fallen Empires","FRF":"Fate Reforged","GTC":"Gatecrash","HML":"Homelands","ISD":"Innistrad","JOU":"Journey into Nyx","JUD":"Judgment","KTK":"Khans of Tarkir","LEA":"Limited Edition Alpha","LEB":"Limited Edition Beta","LEG":"Legends","LGN":"Legions","M13":"Magic 2013","M14":"Magic 2014 Core Set","M15":"Magic 2015 Core Set","MBS":"Mirrodin Besieged","MMQ":"Mercadian Masques","NPH":"New Phyrexia","ODY":"Odyssey","OGW":"Oath of the Gatewatch","ONS":"Onslaught","ORI":"Magic Origins","PCY":"Prophecy","ROE":"Rise of the Eldrazi","RTR":"Return to Ravnica","SCG":"Scourge","SOM":"Scars of Mirrodin","THS":"Theros","TOR":"Torment","UDS":"Urza's Destiny","UGL":"Unglued","ULG":"Urza's Legacy","UNH":"Unhinged","USG":"Urza's Saga","WWK":"Worldwake","ZEN":"Zendikar"}
full_complete_object = {}
#FOR EACH SET IN LIST
failed_sets = []
for card_set in combined_set_list:
	try:
		print card_set 
		#print type(combined_set_list[card_set])
		python_set_list = list(eval(combined_set_list[card_set]))
		#print python_set_list
		card_object_list = {}
		#FOR EARCH CARD IN SET]\
		
		for card in python_set_list:
			#ATEMPT TO GET CARD INFO FROM TCGPLAYER	
			try:
				file = urllib2.urlopen('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=MTGCARDSTER&s='+urllib.quote(name_map[card_set])+'&p=' + urllib.quote(card))
				#print file
				data = file.read()
				file.close()
				#parse the xml you downloaded
				dom = parseString(data)
				elements = ['avgprice','foilavgprice']
				json_data = {'name' : card}
		
				#FOR EARCH ELEMENT IN CARD DOCUMENT
				for e in elements:
					try:
						tag = dom.getElementsByTagName(e)[0].toxml()
						#strip off the tag (<tag>data</tag>  --->   data):
						data = tag.replace('<'+ e +'>','').replace('</'+ e +'>','')
						json_data[e] = data
					except:
						continue
				card_object_list[card] = json_data
				print card
			except:
				#print "FAILED: " + card
				continue
		#APPEND THE SET DATA TO THE MASTER OBJECT
		full_complete_object[name_map[card_set]] = card_object_list
		#print full_complete_object
		
	except:
		print "SET FAILED: " + card_set
		failed_sets.append(card_set)
		continue

#print full_complete_object
f = open('/home4/brysonkr/public_html/mtg/backend/master_prices.json', 'w+')
#f = open('master_prices.json', 'w+')
f.write(json.dumps(full_complete_object))
f.close()

log = open('/home4/brysonkr/public_html/mtg/backend/error_log.txt', 'w+')
#log = open('error_log.txt', 'w+')
log.write(str(failed_sets))
log.close