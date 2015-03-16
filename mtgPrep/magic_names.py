# -*- coding: utf-8 -*-
import json
import os
#OPEN RAW SET FILE, READ IT, THEN SAVE NAMES TO NEW FILE
set_file_names_raw = os.listdir('AllSetRaw')
#print set_file_names_raw
set_file_names = []
for item in set_file_names_raw:
	if not item.startswith('.'):
		set_file_names.append(item)

for item in set_file_names:
	current_set = item
	print current_set
	cs_minus_ext = current_set.split('.',1)[0]
	cs_with_new_ext = cs_minus_ext + '.txt'
	print cs_with_new_ext
	
	
	
	file = open('AllSetRaw/'+current_set,'r')
	
	file = json.load(file)

	file = json.dumps(file["cards"])
	from StringIO import StringIO
	io = StringIO(file)

	allCards = json.load(io) 
	card_name_list = []
	for card in allCards:
		#print unicode(card['name'])
		card_name_list.append(unicode(card['name']))

	print card_name_list
	cs_minus_ext = current_set.split('.',1)[0]
	cs_with_new_ext = cs_minus_ext + 'names.txt'
	#print cs_with_new_ext

	listFile = open('AllSetNames/'+cs_with_new_ext,'w+')
	listFile.write(unicode(card_name_list))



'''
current_set = "5ED.json"

print current_set
file = open('AllSetRaw/'+current_set,'r')
file = json.load(file)
file = json.dumps(file["cards"])
from StringIO import StringIO
io = StringIO(file)

allCards = json.load(io) 
card_name_list = []
for card in allCards:
	#print unicode(card['name'])
	card_name_list.append(unicode(card['name']))

print card_name_list
cs_minus_ext = current_set.split('.',1)[0]
cs_with_new_ext = cs_minus_ext + 'names.txt'
#print cs_with_new_ext

listFile = open('AllSetNames/'+cs_with_new_ext,'w+')
listFile.write(unicode(card_name_list))'''