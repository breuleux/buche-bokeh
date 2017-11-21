#!/usr/bin/env buche --inspect python -u

import time, math, json

def buche(**args):
    print(json.dumps(args))

buche(command='require', path='/', pluginName='bokeh')

buche(command='open', path='/data', type='table',
      columns={'x': {'type': 'number'},
               'sin': {'type': 'number'},
               'cos': {'type': 'number'}},
      hidden=True)
buche(command='open', path='/plot', type='bokeh',
      title='Trigonometry')

buche(command='open', path='/plot/sin', plotType='line', legend='sin',
      source='/data', y={'field': 'sin'})
buche(command='open', path='/plot/cos', plotType='line', legend='cos',
      source='/data', y={'field': 'cos'})
buche(command='open', path='/plot/circle', plotType='line', legend='(sin, cos)',
      source='/data', x={'field': 'sin'}, y={'field': 'cos'})

for i in range(0, 629):
    x = i / 100.0
    buche(command='data', path='/data', x=x, sin=math.sin(x), cos=math.cos(x))
    time.sleep(0.05)
