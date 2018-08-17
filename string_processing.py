import traceback
import sys
from flask import jsonify

def getSynTraceback(filename, pysplit):
    strs = traceback.format_exc().replace("<string>", filename).splitlines()
    print(strs, file=sys.stderr)
    strs = [strs[0]] + strs[len(strs) - 4: ]
    return jsonify(strs)

def getTraceback(filename, pysplit, tb):
    strs = tb.replace("<inline>", filename).splitlines()
    print(strs, file=sys.stderr)
    strs = [strs[0]] + strs[5:]
    '''
    0: traceback
    1: /processing.py
    2: mp.Process.run(self)
    3: process.py, in run
    4: self._target(args, kwargs)
    5: file code.py
    ...
    '''
    ind = 2
    for str in strs[1:]:
        if ind >= len(strs):
            continue
        if str.find("line") == -1:
            ind += 1
            continue
        numind = str.find("line") + 5
        endind = str.find(",", numind)
        if endind == -1:
            continue
        strs.insert(ind, '    ' + pysplit[int(str[numind:endind]) - 1].lstrip())
        ind += 2
    # return jsonify('\n'.join(strs) + '\n')
    return jsonify(strs)
