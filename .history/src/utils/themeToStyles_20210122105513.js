let styles = {
    body: {
        background: '#FFF',
        'font-size': '100%',
        textAlign: 'justify !important'
    },
    p: {
        color: '#ffffff',
        'font-size': '100%',
        textAlign: 'justify !important'
    },
    li: {
        color: '#ffffff',
        'font-size': '100%',
        textAlign: 'justify !important'
    },
    h1: {
        color: '#ffffff',
        textAlign: 'justify !important'
    },
    a: {
        color: '#FFF',
        textAlign: 'justify !important'
    },
    '::selection': {
        'background': 'lightskyblue'
    },
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