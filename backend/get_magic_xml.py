# -*- coding: utf-8 -*-
import urllib2
import urllib
import json
import codecs
import sys
from pprint import pprint
from xml.dom.minidom import parseString



combinedFile = open('magic_data_names_two.json')
combined_set_list = json.loads(combinedFile.read())
combinedFile.close()

name_map = {"LEA":"Limited Edition Alpha","LEB":"Limited Edition Beta","2ED":"Unlimited Edition","ARN":"Arabian Nights","pDRC":"Dragon Con","ATQ":"Antiquities","3ED":"Revised Edition","LEG":"Legends","DRK":"The Dark","FEM":"Fallen Empires","pLGM":"Legend Membership","pMEI":"Media Inserts","4ED":"Fourth Edition","ICE":"Ice Age","CHR":"Chronicles","HML":"Homelands","ALL":"Alliances","RQS":"Rivals Quick Start Set","pARL":"Arena League","pCEL":"Celebration","MIR":"Mirage","MGB":"Multiverse Gift Box","ITP":"Introductory Two-Player Set","VIS":"Visions","5ED":"Fifth Edition","VAN":"Vanguard","pPOD":"Portal Demo Game","POR":"Portal","WTH":"Weatherlight","pPRE":"Prerelease Events","TMP":"Tempest","STH":"Stronghold","PO2":"Portal Second Age","pJGP":"Judge Gift Program","EXO":"Exodus","UGL":"Unglued","pALP":"Asia Pacific Land Program","USG":"Urza's Saga","ATH":"Anthologies","ULG":"Urza's Legacy","6ED":"Classic Sixth Edition","PTK":"Portal Three Kingdoms","UDS":"Urza's Destiny","S99":"Starter 1999","pGRU":"Guru","pWOR":"Worlds","pWOS":"Wizards of the Coast Online Store","MMQ":"Mercadian Masques","BRB":"Battle Royale Box Set","pSUS":"Super Series","pFNM":"Friday Night Magic","pELP":"European Land Program","NMS":"Nemesis","PCY":"Prophecy","BTD":"Beatdown Box Set","INV":"Invasion","PLS":"Planeshift","7ED":"Seventh Edition","pMPR":"Magic Player Rewards","APC":"Apocalypse","ODY":"Odyssey","DKM":"Deckmasters","TOR":"Torment","JUD":"Judgment","ONS":"Onslaught","LGN":"Legions","SCG":"Scourge","pREL":"Release Events","8ED":"Eighth Edition","MRD":"Mirrodin","DST":"Darksteel","5DN":"Fifth Dawn","CHK":"Champions of Kamigawa","UNH":"Unhinged","BOK":"Betrayers of Kamigawa","SOK":"Saviors of Kamigawa","9ED":"Ninth Edition","RAV":"Ravnica: City of Guilds","p2HG":"Two-Headed Giant Tournament","pWPN":"WPN and Gateway","GPT":"Guildpact","pCMP":"Champs and States","DIS":"Dissension","CSP":"Coldsnap","CST":"Coldsnap Theme Decks","TSP":"Time Spiral","TSB":"Time Spiral \"Timeshifted\"","pHHO":"Happy Holidays","PLC":"Planar Chaos","pPRO":"Pro Tour","pGPX":"Grand Prix","FUT":"Future Sight","10E":"Tenth Edition","pMGD":"Magic Game Day","pSUM":"Summer of Magic","MED":"Masters Edition","LRW":"Lorwyn","EVG":"Duel Decks: Elves vs. Goblins","M14":"Magic 2014 Core Set","V13":"From the Vault: Twenty","DDL":"Duel Decks: Heroes vs. Monsters","THS":"Theros","C13":"Commander 2013 Edition","BNG":"Born of the Gods","DDM":"Duel Decks: Jace vs. Vraska","JOU":"Journey into Nyx","MD1":"Modern Event Deck 2014","CNS":"Magic: The Gathering—Conspiracy","VMA":"Vintage Masters","M15":"Magic 2015 Core Set","V14":"From the Vault: Annihilation (2014)","DDN":"Duel Decks: Speed vs. Cunning","KTK":"Khans of Tarkir","C14":"Commander 2014","FRF":"Fate Reforged","DDO":"Duel Decks: Elspeth vs. Kiora"}
#name_map = {"KTK":"Khans of Takir", "FRF":"Fate Reforged"}
for card_set in combined_set_list:
	#print card_set 
	
	#print type(combined_set_list[card_set])
	python_set_list = list(eval(combined_set_list[card_set]))
	
	

	for card in python_set_list:
		#file = urllib2.urlopen('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s='+urllib.quote(name_map[card_set])+'&p=' + urllib.quote(card), )
		print 'http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s='+urllib.quote(name_map[card_set])+'&p=' + urllib.quote(card)
		
		'''
		try:
			file = urllib2.urlopen('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s='+urllib.quote(card_set)+'&p=' + urllib.quote(card), )
			#print file
			
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
		'''
'''		
# print json.dumps(json_data)
set_object[currentSet] = card_object_list
print set_object
f = open('test.txt', 'w')
f.write(json.dumps(set_object))
f.close()				
'''


'''
#OPEN NAME FILE, LOOP THROUGH AND GET DATA, SAVE TO magic_data.json FILE
setFile = open('FRFnames.txt','r')
card_list = eval(setFile.read())
setFile.close()

currentSet = "Fate Reforged"
card_object_list = []
set_object = {currentSet : []}
for card in card_list['names']:
	print card_list
	print 'http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s=Fate%20Reforge&p=' + urllib.quote(card)

	try:
		file = urllib2.urlopen('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=TCGTEST&s=Fate%20Reforged&p=' + urllib.quote(card), )
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
f.close()
'''