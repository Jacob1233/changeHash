# changeHash.js
### embeds data in files to change the sha256 checksum

usage `node changeHash.js operation path flags`

Operations
- f for single file
- d for directory

Flags
- r for recursion
- a for absolute path

Examples
- `node changeHash.js f demoFile.txt`
- `node changeHash.js f /home/admin/Documents/demoFile.txt -a`
- `node changeHash.js d files/`
- `node changeHash.js d /home/admin/Documents/Files -a`
- `node changeHash.js d /home/admin/Documents/Files -ar`