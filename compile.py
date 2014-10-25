#!/bin/bash

# Not using grunt de-facto build standard for javascript projects....
# ... I have found most of the tools not yet updated to typescript 1...
# .... so I'm setting my own build chain here....

import os
import re
import os.path
import subprocess as sp
from shlex import split

from pathlib import PosixPath


def compile_hard():
    # You don't need to use this one...
    src_root = PosixPath('src')
    lib_root = PosixPath('lib')

    for typescript_file in src_root.glob('**/*.ts'):
        equiv_js = str(PosixPath(lib_root, *typescript_file.parts[1:]))
        equiv_js = re.sub('.ts$', '.js', equiv_js)
        cmd = "node_modules/.bin/tsc {0} --out {1}".format( typescript_file, equiv_js)
        cmd_parts = split(cmd)
        sp.check_call(cmd_parts)

