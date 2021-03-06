#!/usr/bin/env buche --inspect python -u

import time, math, json

def buche(**args):
    print(json.dumps(args))

buche(command='require', path='/', pluginName='bokeh', channels='bokeh')
buche(command='open', path='/plot', type='bokeh', title='Trigonometry')

for i in range(0, 629):
    x = i / 100.0
    buche(command='data', path='/plot/sin', x=x, y=math.sin(x))
    buche(command='data', path='/plot/cos', x=x, y=math.cos(x))
    time.sleep(0.05)
