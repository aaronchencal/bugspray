#!/usr/bin/python3
from flask import Flask, request, jsonify, make_response, render_template
from io import StringIO
import contextlib
import signal
import sys
import time
from processing import Process
from errdict import edict

from string_processing import getSynTraceback, getTraceback

from RestrictedPython import compile_restricted
from RestrictedPython import safe_builtins
from RestrictedPython.PrintCollector import PrintCollector

#A module is a file containing Python definitions and statements.

app = Flask(__name__)

filename = "code.py"

myglobals = {'__builtins__': safe_builtins,
'_print_': PrintCollector,
}

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['GET'])
def anal_code():
    if not request.args:
        abort(400)
    pycode = request.args.get('code', '')
    pyarr = pycode.split()
    # print(pyarr[0], file=sys.stderr)

    return jsonify(edict.get(pyarr[0], 'ooh, I haven\'t seen this error before. Sorry!'))

@app.route('/api/run', methods=['GET'])
def run_code():
    if not request.args:
        abort(400)
    pycode = request.args.get('code', '')
    pysplit = pycode.splitlines()
    # print(pycode, file=sys.stderr)

    try:
        p = Process(target=exec, args=(pycode, myglobals))
        p.start()
        p.join(2)
        p.terminate()
        if p.exception:
            if p.exception == 1:
                return jsonify("no error!")
            tb = p.exception[1]
            return getTraceback(filename, pysplit, tb)
        return jsonify("timed out! you have an infinite loop!")
        # exec(byte_code, myglobals)
    except SyntaxError as e: #the compilation failed: exec is safe
        try:
            exec(pycode, myglobals)
        except Exception:
            return getSynTraceback(filename, pysplit)

    return jsonify("no error!")


if __name__ == '__main__':
    app.run(debug=True)
