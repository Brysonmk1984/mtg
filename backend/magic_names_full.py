import json
import os
#OPEN NAME FILES, READ IT, THEN MAKE COMBINED LIST

set_files = os.listdir('AllSetNames')

set_files_array = []
for item in set_files:
	if not item.startswith('.'):
		set_files_array.append(item)
set_object = {}

for item in set_files_array:
	current_set_name = item.split('names',1)[0]
	print current_set_name
	file = open('AllSetNames/'+item,'r')
	file = file.read()
	print file
	set_object[current_set_name] = file

'''
file = open('AllSetNames/FRFnames.txt','r')
file = file.read()
set_object['Fate Reforged'] = file
print set_object
'''

f = open('magic_data_names_full.json', 'w+')
f.write(json.dumps(set_object))
f.close()
