
# buche-bokeh

Buche plugin for the [bokeh](https://bokeh.pydata.org/en/latest/) plotting library.

Provides the `bokeh` channel type.

## Use

First you must output the following `buche` command:

```json
{"command":"require","path":"/","pluginName":"bokeh"}
```

Buche will prompt you to install the plugin if it is not available, although you can install it manually with `buche --install bokeh`.


## `bokeh` channel

The `bokeh` channel lets you define a figure and add plots and points to it in real time.

After you create the main `BokehChannel` for plotting, each plot is a sub-channel that you must open. For example:

```json
{"command":"open","path":"/plot","type":"bokeh"}
{"command":"open","path":"/plot/myplot1","plotType":"line"}
{"command":"open","path":"/plot/myplot2","plotType":"x","legend":"My Plot"}
{"command":"open","path":"/plot/myplot3","plotType":"asterisk","size":10,"x":{"field":"time"},"y":{"field":"candies"}}
...
```

Once these channels are created, add points using the `data` command:

```json
{"command":"data","path":"/plot/myplot1","x":1,"y":2}
{"command":"data","path":"/plot/myplot2","x":3,"y":4}
{"command":"data","path":"/plot/myplot3","time":5,"candies":6}
...
```

`BokehChannel` typically assumes that the data are `(x, y)` pairs, but it is possible to override that.

### Coupling with a `table` channel

A plot can specify an existing `TableChannel` as a source:

```json
{"command":"open","path":"/data","type":"table","columns":{"x":{"type":"number"},"y":{"type":"number"}}, "hidden":true}
{"command":"open","path":"/plot","type":"bokeh"}
{"command":"open","path":"/plot/myplot1","plotType":"line","source":"/data"}
{"command":"data","path":"/data","x":1,"y":2}
...
```

Data sent to `/data` will be shown as points in `/plot/myplot1`. Multiple plots can use the same source and use arbitrary fields from that table as `x` and `y` coordinates. Set the `hidden` attribute on the data channel if you don't want the data table to actually be displayed.

### Examples

See the `examples/` sub-directory.
