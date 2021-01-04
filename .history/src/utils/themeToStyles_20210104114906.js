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
    span: {
        'border-color': '#000 !important'
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