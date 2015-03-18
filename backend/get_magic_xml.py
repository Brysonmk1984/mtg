# -*- coding: utf-8 -*-
import urllib2
import urllib
import json
from xml.dom.minidom import parseString

#OPEN NAME FILE, LOOP THROUGH AND GET DATA, SAVE TO magic_data.json FILE
combinedFile = open('magic_data_names_full.json.')
combined_set_list = json.loads(combinedFile.read())
combinedFile.close()

name_map = {"LEA":"Limited Edition Alpha", "LEB":"Limited Edition Beta", "ARN":"Arabian Nights", "2ED":"Unlimited Edition", "ATQ":"Antiquities", "3ED":"Revised Edition", "LEG":"Legends", "DRK":"The Dark", "FEM":"Fallen Empires", "4ED":"Fourth Edition", "PO2":"Portal Second Age", "ICE":"Ice Age", "CHR":"Chronicles", "HML":"Homelands", "ALL":"Alliances", "MIR":"Mirage", "VIS":"Visions", "5ED":"Fifth Edition", "POR":"Portal", "WTH":"Weatherlight", "TMP":"Tempest", "STH":"Stronghold", "P02":"Portal Second Age", "EXO":"Exodus", "UGL":"Unglued", "USG":"Urza's Saga", "ATH":"Anthologies", "ULG":"Urza's Legacy", "6ED":"Classic Sixth Edition", "PTK":"Portal Three Kingdoms", "UDS":"Urza's Destiny", "S99":"Starter 1999", "MMQ":"Mercadian Masques", "BRB":"Battle Royale Box Set", "NEM":"Nemesis", "PCY":"Prophecy", "S00":"Starter 2000", "INV":"Invasion", "BTD":"Beatdown Box Set", "PLS":"Planeshift", "7ED":"Seventh Edition", "APC":"Apocalypse", "ODY":"Odyssey", "DKM":"Deckmasters: Garfield vs. Finkel", "TOR":"Torment", "JUD":"Judgment", "ONS":"Onslaught", "LGN":"Legions", "SCG":"Scourge", "8ED":"Eighth Edition", "MRD":"Mirrodin", "DST":"Darksteel", "5DN":"Fifth Dawn", "CHK":"Champions of Kamigawa", "UNH":"Unhinged", "BOK":"Betrayers of Kamigawa", "SOK":"Saviors of Kamigawa", "9ED":"Ninth Edition", "RAV":"Ravnica: City of Guilds", "GPT":"Guildpact", "DIS":"Dissension", "CSP":"Coldsnap", "TSH":"Time Spiral \"Timeshifted\"", "TSP":"Time Spiral", "PLC":"Planar Chaos", "FUT":"Future Sight", "10E":"Tenth Edition", "MED":"Masters Edition", "LRW":"Lorwyn", "EVG":"Duel Decks: Elves vs. Goblins", "MOR":"Morningtide", "SHM":"Shadowmoor", "EVE":"Eventide", "DRB":"From the Vault: Dragons", "ME2":"Masters Edition II", "ALA":"Shards of Alara", "DD2":"Duel Decks: Jace vs. Chandra", "CON":"Conflux", "DDC":"Duel Decks: Divine vs. Demonic", "ARB":"Alara Reborn", "M10":"Magic 2010 (m10)", "V09":"From the Vault: Exiled", "ME3":"Masters Edition III", "ZEN":"Zendikar", "DDD":"Duel Decks: Garruk vs. Liliana", "HOP":"Planechase", "H09":"Premium Deck Series: Slivers", "WWK":"Worldwake", "DDE":"Duel Decks: Phyrexia vs. the Coalition", "ROE":"Rise of the Eldrazi", "DPA":"Duels of the Planeswalkers", "ARC":"Archenemy", "M11":"Magic 2011 (m11)", "V10":"From the Vault: Relics", "DDF":"Duel Decks: Elspeth vs. Tezzeret", "SOM":"Scars of Mirrodin", "PD2":"Premium Deck Series: Fire and Lightning", "ME4":"Masters Edition IV", "MBS":"Mirrodin Besieged", "DDG":"Duel Decks: Knights vs. Dragons", "NPH":"New Phyrexia", "CMD":"Commander", "M12":"Magic 2012 (m12)", "V11":"From the Vault: Legends", "DDH":"Duel Decks: Ajani vs. Nicol Bolas", "ISD":"Innistrad", "PD3":"Premium Deck Series: Graveborn", "DKA":"Dark Ascension", "DDI":"Duel Decks: Venser vs. Koth", "AVR":"Avacyn Restored", "PC2":"Planechase 2012 Edition", "M13":"Magic 2013 (m13)", "V12":"From the Vault: Realms", "DDJ":"Duel Decks: Izzet vs. Golgari", "RTR":"Return to Ravnica", "CM1":"Commander's Arsenal", "GTC":"Gatecrash", "DDK":"Duel Decks: Sorin vs. Tibalt", "DGM":"Dragon's Maze", "M14":"Magic 2014 (m14)", "MMA":"Modern Masters", "V13":"From the Vault: Twenty", "DDL":"Duel Decks: Heroes vs. Monsters", "THS":"Theros", "C13":"Commander 2013 Edition", "BNG":"Born of the Gods", "DDM":"Duel Decks: Jace vs. Vraska", "JOU":"Journey into Nyx", "VMA":"Vintage Masters", "MD1":"Modern Event Deck 2014", "CNS":"Magic: The Gathering-Conspiracy", "M15":"Magic 2015 (m15)", "DDN":"Duel Decks: Speed vs. Cunning", "KTK":"Khans of Tarkir", "FRF":"Fate Reforged"}
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
		#FOR EARCH CARD IN SET
		failed_card_count = 0
		for card in python_set_list:
			if failed_card_count == 6:
				failed_sets.append(card_set)
				break
			else:
				#ATEMPT TO GET CARD INFO FROM TCGPLAYER	
				try:
					file = urllib2.urlopen('http://partner.tcgplayer.com/x3/phl.asmx/p?pk=MTGCARDSTER&s='+urllib.quote(name_map[card_set])+'&p=' + urllib.quote(card))
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
					failed_card_count = 0
				except:
					print "FAILED: " + card
					failed_card_count += failed_card_count
					continue
		#APPEND THE SET DATA TO THE MASTER OBJECT
		full_complete_object[name_map[card_set]] = card_object_list
		#print full_complete_object
	except:
		print "SET FAILED: " + card_set
		failed_sets.append(card_set)
		continue

#print full_complete_object
f = open('master_prices.json', 'w+')
f.write(json.dumps(full_complete_object))
f.close()

log = open('error_log.txt', 'w')
log.write(str(failed_sets))
log.close	
