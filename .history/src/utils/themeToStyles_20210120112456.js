let styles = {
    body: {
        background: '#fafafa',
        color: '#121212',
        'font-size': '100%',
    },
    p: {
        color: '#ffffff',
        'font-size': '100%',
    },
    li: {
        color: '#ffffff',
        'font-size': '100%',
    },
    h1: {
        color: '#ffffff',
    },
    a: {
        color: '#FFF'
    },
    '[ref="epubjs-mk"]::before': {
        'content': '""',
        'background-color': 'red',
        'display': 'block',
        'right': '0',
        'position': 'absolute',
        'width': '20px',
        'height': '20px',
        'margin': '0',
        'cursor': 'pointer'
    }
};

export default function (theme) {
    styles.body = {
        background: theme.bg,
        color: theme.fg,
        'font-size': theme.size,
    };
    styles.p = {
        color: theme.fg,
        'font-size': theme.size,
    };
    styles.li = {
        color: theme.fg,
        'font-size': theme.size,
    };
    styles.a = {
        color: theme.fg
    };
    styles.h1.color = theme.fg;
    return styles;
}