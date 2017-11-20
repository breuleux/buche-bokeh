
const Bokeh = require('bokehjs');
const {Channel} = Buche;


class BokehChannel extends Channel {
    setup() {
        this.sources = {};
        this.colorRotation = ['blue', 'red', 'green', 'purple'];
        let tools = "pan,crosshair,wheel_zoom,box_zoom,reset,resize,save"
        this.plot = Bokeh.Plotting.figure({
            title: this.options.title || null,
            tools: tools,
            sizing_mode: 'stretch_both'
        });
        this.plot._legend.click_policy = this.options.legendClick || 'hide';
        this.plot._legend.location = this.options.legendLocation || 'top_right';
    }

    showPlot() {
        if (!this.shown) {
            this.shown = true;
            Bokeh.Plotting.show(this.plot, this.element);
        }
    }

    newColor() {
        let color = this.colorRotation.shift();
        this.colorRotation.push(color);
        return color;
    }

    makeElement() {
        let rval = document.createElement('div');
        rval.style.width = "100%";
        rval.style.height = "100%";
        rval.innerHTML = `
        <link rel="stylesheet"
              type="text/css"
              href="${__dirname}/../resources/bokeh-0.12.10.min.css"/>
        <link rel="stylesheet"
              type="text/css"
              href="${__dirname}/../resources/bokeh-widgets-0.12.10.min.css"/>
        <div class="plot-area">
        `
        return rval;
    }

    dispatch_point(m) {
        let src = this.sources[m.subPath || m.name || ""].main;
        if (src) {
            this.addPoint(src, m.x, m.y);
        }
        else {
            this.addLine(Object.assign({}, m, {name: m.subPath}));
        }
    }

    addChannel(subChannel) {}

    openChannel(options) {
        this.addLine(Object.assign({name: options.subPath}, options));
        let chopts = Object.assign({}, options, {redirectPath: this.path});
        return this.master.construct(this, 'redirect', chopts);
    }

    addPoint(src, x, y) {
        src.data.x.push(x);
        src.data.y.push(y);
        this.showPlot();
        src.change.emit();
    }

    addLine(opt) {
        let source = new Bokeh.ColumnDataSource({data: {x: [], y: []}});
        let color = opt.lineColor || this.newColor();
        this.plot.line({field: 'x'}, {field: 'y'}, {
            source: source,
            line_color: color,
            line_width: opt.lineWidth || 2,
            legend: opt.legend || opt.name || '--'
        });
        this.sources[opt.name] = {main: source};
        if (opt.x) {
            this.addPoint(source, opt.x, opt.y);
        }
    }
}


module.exports = {
    isBuchePlugin: true,
    channels: {
        bokeh: BokehChannel
    },
    components: {}
}
