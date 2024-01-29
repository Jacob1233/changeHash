# changeHash.js
### adds random bytes to files to change the sha256 checksum

usage `node changeHash.js option path flags`

Operations
- n adds random bytes to the end of the file 

Flags
- d for directory
- r for recursion
- a for absolute path

New Examples
- `node changeHash.js n /home/admin/Documents/Files/ -adr` n for new hash command and adr flags for absolute path, directory, and recursive