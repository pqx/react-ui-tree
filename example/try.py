import subprocess
import os
cwd = "/Users/psharma/Documents/Company/Repositories/react-ui-tree"
cmd = "cd " + cwd + " && npm install > '/dev/null' 2>&1"
cmd2 = "cd " + cwd + " && npm install"
os.system(cmd2)