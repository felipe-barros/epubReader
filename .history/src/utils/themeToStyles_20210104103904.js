let styles = {
    body: {
        background: 'red',
        color: 'pink',
        'font-family': 'Default',
        'font-size': '100%',
        'line-height': 'normal'
    },
    p: {
        color: 'red',
        'font-family': 'Default',
        'font-size': '100%',
        'line-height': 'normal'
    },
    li: {
        color: '#ffffff',
        'font-family': 'Default',
        'font-size': '100%',
        'line-height': 'normal'
    },
    h1: {
        color: '#ffffff'
    }
};

export default function (theme) {
    styles.body = {
        background: theme.bg,
        color: theme.fg,
        'font-family': theme.font,
        'font-size': theme.size,
        'line-height': theme.height,
        padding: "0px",
        'border-color': '#9e4321',
        'border-width': '10px'
    };
    styles.p = {
        color: theme.fg,
        'font-family': theme.font,
        'font-size': theme.size,
        'line-height': theme.height,
        padding: "0px",
        'border-color': '#9e4321',
        'border-width': '10px'
    };
    styles.li = {
        color: theme.fg,
        'font-family': theme.font,
        'font-size': theme.size,
        'line-height': theme.height,
        padding: "0px",
        'border-color': '#9e4321',
        'border-width': '10px'
    };
    styles.h1.color = theme.fg;
    return styles;
}