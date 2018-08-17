#!/usr/bin/python3
from flask import Flask, request, jsonify, make_response, render_template
from io import StringIO
import contextlib
import signal
import sys
import time
from processing import Process

from string_processing import getSynTraceback, getTraceback


from RestrictedPython import compile_restricted
from RestrictedPython import safe_builtins
from RestrictedPython.PrintCollector import PrintCollector


app = Flask(__name__)

filename = "code.py"

@app.errorhandler(400)
def not_found(error):
    return make_response(jsonify( { 'error': 'Bad request' } ), 400)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/run', methods=['GET'])
def run_code():
    if not request.args:
        abort(400)
    pycode = request.args.get('code', '')
    pysplit = pycode.splitlines()
    print(pycode, file=sys.stderr)

    try:
        _print_ = PrintCollector
        byte_code = compile_restricted(pycode, '<inline>', 'exec')
        myglobals = {'__builtins__': safe_builtins,
        '_print_': PrintCollector
        }
        p = Process(target=exec, args=(byte_code, myglobals))
        p.start()
        p.join(2)
        p.terminate()
        if p.exception:
            tb = p.exception[1]
            return getTraceback(filename, pysplit, tb)
        return jsonify("timed out! you have an infinite loop!")
        # exec(byte_code, myglobals)
    except SyntaxError: #the compilation failed: exec is safe
        try:
            exec(pycode, {})
        except Exception:
            return getSynTraceback(filename, pysplit)

    return jsonify("no error!")


if __name__ == '__main__':
    app.run(debug=True)
