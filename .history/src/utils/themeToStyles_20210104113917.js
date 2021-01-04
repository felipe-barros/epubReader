let styles = {
    body: {
        background: '#fafafa',
        color: '#121212',
        'font-size': '100%',
        padding: '0px !important'
    },
    p: {
        color: '#ffffff',
        'font-size': '100%',
        padding: '0px !important'
    },
    li: {
        color: '#ffffff',
        'font-size': '100%',
        padding: '0px !important'
    },
    h1: {
        color: '#ffffff',
        padding: '0px !important'
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
    styles.h1.color = theme.fg;
    return styles;
}