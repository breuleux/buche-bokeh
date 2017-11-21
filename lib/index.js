
const Bokeh = require('bokehjs');
const {Channel} = Buche;


const defaultTools = ["pan","crosshair","wheel_zoom","box_zoom","reset","save"];
const defaultColorRotation = ['blue', 'red', 'green', 'purple'];


const plotArgspec = {
    // NOTE: some of these might be wrong, not all plots have been tested.
    // TODO: Fill this in, starting from
    // https://bokeh.pydata.org/en/latest/docs/reference/plotting.html

    annular_wedge: {
        x: {field: 'x'},
        y: {field: 'y'},
        inner_radius: {field: 'inner_radius'},
        outer_radius: {field: 'outer_radius'},
        start_angle: {field: 'start_angle'},
        end_angle: {field: 'end_angle'},
        direction: {field: 'direction'},
    },
    annulus: {
        x: {field: 'x'},
        y: {field: 'y'},
        inner_radius: {field: 'inner_radius'},
        outer_radius: {field: 'outer_radius'},
    },
    arc: {
        x: {field: 'x'},
        y: {field: 'y'},
        radius: {field: 'radius'},
        start_angle: {field: 'start_angle'},
        end_angle: {field: 'end_angle'},
        direction: {field: 'direction'},
    },
    asterisk: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    bezier: {
        x0: {field: 'x0'},
        y0: {field: 'y0'},
        x1: {field: 'x1'},
        y1: {field: 'y1'},
        cx0: {field: 'cx0'},
        cy0: {field: 'cy0'},
        cx1: {field: 'cx1'},
        cy1: {field: 'cy1'},
    },
    circle: {
        x: {field: 'x'},
        y: {field: 'y'},
    },
    circle_cross: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    circle_x: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    cross: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    diamond: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    diamond_cross: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    ellipse: {
        x: {field: 'x'},
        y: {field: 'y'},
        width: {field: 'width'},
        height: {field: 'height'},
        angle: undefined,
    },
    hbar: {
        y: {field: 'y'},
        height: undefined,
        right: {field: 'right'},
        left: undefined,
    },
    // image: {},
    // image_rgba: {},
    // image_url: {},
    inverted_triangle: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    line: {
        x: {field: 'x'},
        y: {field: 'y'},
    },
    // multi_line: {}
    oval: {
        x: {field: 'x'},
        y: {field: 'y'},
        width: {field: 'width'},
        height: {field: 'height'},
        angle: undefined,
    },
    patch: {
        x: {field: 'x'},
        y: {field: 'y'},
    },
    // patches: {}
    quad: {
        left: {field: 'left'},
        right: {field: 'right'},
        top: {field: 'top'},
        bottom: {field: 'bottom'},
    },
    quadratic: {
        x0: {field: 'x0'},
        y0: {field: 'y0'},
        x1: {field: 'x1'},
        y1: {field: 'y1'},
        cx: {field: 'cx'},
        cy: {field: 'cy'},
    },
    ray: {
        x: {field: 'x'},
        y: {field: 'y'},
        length: {field: 'length'},
        angle: {field: 'angle'},
    },
    rect: {
        x: {field: 'x'},
        y: {field: 'y'},
        width: {field: 'width'},
        height: {field: 'height'},
        angle: undefined,
        dilate: undefined,
    },
    segment: {
        x0: {field: 'x0'},
        y0: {field: 'y0'},
        x1: {field: 'x1'},
        y1: {field: 'y1'},
    },
    square: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    square_cross: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    square_x: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    text: {
        x: {field: 'x'},
        y: {field: 'y'},
        text: {field: 'text'},
        angle: undefined,
        x_offset: undefined,
        y_offset: undefined,
    },
    triangle: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
    vbar: {
        x: {field: 'x'},
        width: undefined,
        top: {field: 'top'},
        bottom: undefined,
    },
    wedge: {
        x: {field: 'x'},
        y: {field: 'y'},
        radius: {field: 'radius'},
        start_angle: {field: 'start_angle'},
        end_angle: {field: 'end_angle'},
        direction: {field: 'direction'},
    },
    x: {
        x: {field: 'x'},
        y: {field: 'y'},
        size: undefined,
        angle: undefined,
    },
}


class BokehChannel extends Channel {
    setup() {
        this.sources = {};
        let tools = this.options.tools || defaultTools;
        this.colorRotation = defaultColorRotation.slice(0);
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

    nextColor() {
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

    getData(m) {
        if (m.data) {
            return m.data;
        }
        else {
            let m2 = Object.assign({}, m);
            let fields = ['command', 'path', 'source',
                          'subPath', 'originalPath'];
            for (let field of fields) {
                delete m2[field];
            }
            return m2;
        }
    }

    addData(src, data) {
        for (let field in data) {
            src.data[field].push(data[field]);
        }
        this.showPlot();
        src.change.emit();
    }

    dispatch_data(m) {
        let src = this.getSource(m.subPath, null);
        this.addData(src, this.getData(m));
    }

    addChannel(subChannel) {}

    openChannel(options) {
        this.addPlot(Object.assign({source: options.source || options.name},
                                   options));
        let chopts = Object.assign({}, options, {redirectPath: this.path});
        return this.master.construct(this, 'redirect', chopts);
    }

    getSource(subPath, spec) {
        let sourceObject = this.sources[subPath];
        if (sourceObject) {
            return sourceObject;
        }
        if (typeof(spec) === 'string') {
            sourceObject = this.getSource(spec, null);
        }
        else {
            let origData = [];
            if (subPath.startsWith('/')) {
                let ch = this.master.channels[subPath];
                if (ch && ch.columns && ch.data) {
                    spec = {columns: Object.keys(ch.columns)};
                    origData = ch.data;
                    ch.on('add-data', data => {
                        this.addData(sourceObject, data);
                    });
                }
                else {
                    throw Error(`Channel ${subPath} does not contain data.`);
                }
            }
            else {
                spec = spec || {columns: ['x', 'y']};            
            }
            let data = {};
            for (let column of spec.columns) {
                data[column] = origData.map(d => d[column]);
            }
            sourceObject = new Bokeh.ColumnDataSource({data: data});
        }
        this.sources[subPath] = sourceObject;
        return sourceObject;
    }

    _fill_options_idem(options, field_names) {
        for (let field_name of field_names) {
            if (!options[field_name]) {
                options[field_name] = {field: field_name};
            }
        }
        return options;
    }

    _fill_options_xy(options) {
        return this._fill_options_idem(options, ['x', 'y']);
    }

    addPlot(options) {
        let {plotType, name, source} = options;
        plotType = plotType || 'line';
        let argspec = plotArgspec[plotType];
        if (!source) {
            source = [];
            for (let arg of argspec) {
                if (argspec[arg] && argspec[arg].field) {
                    source.push(arg);
                }
            }
        }
        options = Object.assign({}, options);
        for (let field of ['path', 'parentPath', 'name', 'plotType', 'command']) {
            delete options[field];
        }
        options.source = this.getSource(name, source);
        options = Object.assign({}, argspec, options);
        if (!options.color) {
            options.color = this.nextColor();
        }
        this.plot[plotType](options);
    }
}


module.exports = {
    isBuchePlugin: true,
    channels: {
        bokeh: BokehChannel
    },
    components: {}
}
