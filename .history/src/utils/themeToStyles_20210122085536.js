let styles = {
    body: {
        background: '#FFF',
        'font-size': '100%'
    },
    p: {
        color: '#ffffff',
        'font-size': '100%'
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
    '::selection': {
        'background': 'lightskyblue'
    },
    .textLayer {
        -webkit - touch - callout: none; /* iOS Safari */
-webkit - user - select: none; /* Safari */
-khtml - user - select: none; /* Konqueror HTML */
-moz - user - select: none; /* Firefox */
-ms - user - select: none; /* Internet Explorer/Edge */
user - select: none; /* Non-prefixed version, currently
                                      supported by Chrome and Opera */
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