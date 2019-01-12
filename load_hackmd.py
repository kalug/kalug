#!/usr/bin/env python3
import yaml
import os
from urllib.request import urlopen

with open("hackmd.yml", 'r') as stream:
    try:
        data=yaml.load(stream)
    except yaml.YAMLError as exc:
        print(exc)

def saveHackMd(fn, mdId):
    url = "https://hackmd.io/"+mdId+"/download"
    response = urlopen(url)
    dn = os.path.dirname(fn)
    if dn != "":
        os.makedirs(dn, exist_ok=True)

    with open("content/"+fn+".md", "wb") as output:
        output.write(response.read())
        hackmdLine = "\n{{< edit_hackmd "+mdId+" >}}\n"
        output.write(hackmdLine.encode())

for fn, mdId in data.items():
    saveHackMd(fn, mdId)
