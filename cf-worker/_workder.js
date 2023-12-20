addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    try {
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const body = await request.json();

        if (!body) {
            return new Response(JSON.stringify({ message: 'Request body is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const allHeaders = request.headers;
        const authorization = allHeaders.get('authorization');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (authorization) {
            headers.append('authorization', authorization);
        }

        const { commonLabels } = body;
        const { webhookUrl } = commonLabels;

        if (!webhookUrl) {
            return new Response(JSON.stringify({ message: 'webhookUrl is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const alertParams = {};
        Object.keys(commonLabels).forEach(key => {
            if (!['alertname', 'instance', 'webhookUrl'].includes(key)) {
                const jsonPath = commonLabels[key];
                const jsonPathValue = jsonPath.startsWith('$')
                    ? readValue(jsonPath, body)
                    : jsonPath;
                alertParams[key] = jsonPathValue;
            }
        });

        const alertResponse = await fetch(webhookUrl, {
            method: request.method,
            headers: headers,
            body: JSON.stringify(alertParams),
        });

        if (!alertResponse.ok) {
            throw new Error(`Failed to send alert: ${alertResponse.statusText}`);
        }

        return new Response(JSON.stringify({ message: 'ok' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: `Internal Server Error: ${error.message}` }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}

function readValue(jsonPath, body) {
    let value = '';

    jsonPath.split(',').forEach(path => {
        if (path.startsWith('$')) {
            value += jsonpath.query(body, path).map(value => value.toString());
        }else{
            value += path;
        }
    });

    return value;
}

/*! jsonpath 1.1.1 */
!(function (a) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = a();
    else if ('function' == typeof define && define.amd) define([], a);
    else {
        var b;
        (b =
            'undefined' != typeof window
                ? window
                : 'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                ? self
                : this),
            (b.jsonpath = a());
    }
})(function () {
    var a;
    return (function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = 'function' == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw ((j.code = 'MODULE_NOT_FOUND'), j);
                }
                var k = (c[g] = { exports: {} });
                b[g][0].call(
                    k.exports,
                    function (a) {
                        var c = b[g][1][a];
                        return e(c || a);
                    },
                    k,
                    k.exports,
                    a,
                    b,
                    c,
                    d,
                );
            }
            return c[g].exports;
        }
        for (var f = 'function' == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e;
    })(
        {
            './aesprim': [
                function (b, c, d) {
                    !(function (b, c) {
                        'use strict';
                        'function' == typeof a && a.amd
                            ? a(['exports'], c)
                            : c(void 0 !== d ? d : (b.esprima = {}));
                    })(this, function (a) {
                        'use strict';
                        function b(a, b) {
                            if (!a) throw new Error('ASSERT: ' + b);
                        }
                        function c(a) {
                            return a >= 48 && a <= 57;
                        }
                        function d(a) {
                            return '0123456789abcdefABCDEF'.indexOf(a) >= 0;
                        }
                        function e(a) {
                            return '01234567'.indexOf(a) >= 0;
                        }
                        function f(a) {
                            return (
                                32 === a ||
                                9 === a ||
                                11 === a ||
                                12 === a ||
                                160 === a ||
                                (a >= 5760 &&
                                    [
                                        5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199,
                                        8200, 8201, 8202, 8239, 8287, 12288, 65279,
                                    ].indexOf(a) >= 0)
                            );
                        }
                        function g(a) {
                            return 10 === a || 13 === a || 8232 === a || 8233 === a;
                        }
                        function h(a) {
                            return (
                                64 == a ||
                                36 === a ||
                                95 === a ||
                                (a >= 65 && a <= 90) ||
                                (a >= 97 && a <= 122) ||
                                92 === a ||
                                (a >= 128 &&
                                    eb.NonAsciiIdentifierStart.test(String.fromCharCode(a)))
                            );
                        }
                        function i(a) {
                            return (
                                36 === a ||
                                95 === a ||
                                (a >= 65 && a <= 90) ||
                                (a >= 97 && a <= 122) ||
                                (a >= 48 && a <= 57) ||
                                92 === a ||
                                (a >= 128 && eb.NonAsciiIdentifierPart.test(String.fromCharCode(a)))
                            );
                        }
                        function j(a) {
                            switch (a) {
                                case 'class':
                                case 'enum':
                                case 'export':
                                case 'extends':
                                case 'import':
                                case 'super':
                                    return !0;
                                default:
                                    return !1;
                            }
                        }
                        function k(a) {
                            switch (a) {
                                case 'implements':
                                case 'interface':
                                case 'package':
                                case 'private':
                                case 'protected':
                                case 'public':
                                case 'static':
                                case 'yield':
                                case 'let':
                                    return !0;
                                default:
                                    return !1;
                            }
                        }
                        function l(a) {
                            return 'eval' === a || 'arguments' === a;
                        }
                        function m(a) {
                            if (hb && k(a)) return !0;
                            switch (a.length) {
                                case 2:
                                    return 'if' === a || 'in' === a || 'do' === a;
                                case 3:
                                    return (
                                        'var' === a ||
                                        'for' === a ||
                                        'new' === a ||
                                        'try' === a ||
                                        'let' === a
                                    );
                                case 4:
                                    return (
                                        'this' === a ||
                                        'else' === a ||
                                        'case' === a ||
                                        'void' === a ||
                                        'with' === a ||
                                        'enum' === a
                                    );
                                case 5:
                                    return (
                                        'while' === a ||
                                        'break' === a ||
                                        'catch' === a ||
                                        'throw' === a ||
                                        'const' === a ||
                                        'yield' === a ||
                                        'class' === a ||
                                        'super' === a
                                    );
                                case 6:
                                    return (
                                        'return' === a ||
                                        'typeof' === a ||
                                        'delete' === a ||
                                        'switch' === a ||
                                        'export' === a ||
                                        'import' === a
                                    );
                                case 7:
                                    return 'default' === a || 'finally' === a || 'extends' === a;
                                case 8:
                                    return 'function' === a || 'continue' === a || 'debugger' === a;
                                case 10:
                                    return 'instanceof' === a;
                                default:
                                    return !1;
                            }
                        }
                        function n(a, c, d, e, f) {
                            var g;
                            b('number' == typeof d, 'Comment must have valid position'),
                                ob.lastCommentStart >= d ||
                                    ((ob.lastCommentStart = d),
                                    (g = { type: a, value: c }),
                                    pb.range && (g.range = [d, e]),
                                    pb.loc && (g.loc = f),
                                    pb.comments.push(g),
                                    pb.attachComment &&
                                        (pb.leadingComments.push(g), pb.trailingComments.push(g)));
                        }
                        function o(a) {
                            var b, c, d, e;
                            for (
                                b = ib - a, c = { start: { line: jb, column: ib - kb - a } };
                                ib < lb;

                            )
                                if (((d = gb.charCodeAt(ib)), ++ib, g(d)))
                                    return (
                                        pb.comments &&
                                            ((e = gb.slice(b + a, ib - 1)),
                                            (c.end = { line: jb, column: ib - kb - 1 }),
                                            n('Line', e, b, ib - 1, c)),
                                        13 === d && 10 === gb.charCodeAt(ib) && ++ib,
                                        ++jb,
                                        void (kb = ib)
                                    );
                            pb.comments &&
                                ((e = gb.slice(b + a, ib)),
                                (c.end = { line: jb, column: ib - kb }),
                                n('Line', e, b, ib, c));
                        }
                        function p() {
                            var a, b, c, d;
                            for (
                                pb.comments &&
                                ((a = ib - 2), (b = { start: { line: jb, column: ib - kb - 2 } }));
                                ib < lb;

                            )
                                if (((c = gb.charCodeAt(ib)), g(c)))
                                    13 === c && 10 === gb.charCodeAt(ib + 1) && ++ib,
                                        ++jb,
                                        ++ib,
                                        (kb = ib),
                                        ib >= lb && O({}, db.UnexpectedToken, 'ILLEGAL');
                                else if (42 === c) {
                                    if (47 === gb.charCodeAt(ib + 1))
                                        return (
                                            ++ib,
                                            ++ib,
                                            void (
                                                pb.comments &&
                                                ((d = gb.slice(a + 2, ib - 2)),
                                                (b.end = { line: jb, column: ib - kb }),
                                                n('Block', d, a, ib, b))
                                            )
                                        );
                                    ++ib;
                                } else ++ib;
                            O({}, db.UnexpectedToken, 'ILLEGAL');
                        }
                        function q() {
                            var a, b;
                            for (b = 0 === ib; ib < lb; )
                                if (((a = gb.charCodeAt(ib)), f(a))) ++ib;
                                else if (g(a))
                                    ++ib,
                                        13 === a && 10 === gb.charCodeAt(ib) && ++ib,
                                        ++jb,
                                        (kb = ib),
                                        (b = !0);
                                else if (47 === a)
                                    if (47 === (a = gb.charCodeAt(ib + 1)))
                                        ++ib, ++ib, o(2), (b = !0);
                                    else {
                                        if (42 !== a) break;
                                        ++ib, ++ib, p();
                                    }
                                else if (b && 45 === a) {
                                    if (
                                        45 !== gb.charCodeAt(ib + 1) ||
                                        62 !== gb.charCodeAt(ib + 2)
                                    )
                                        break;
                                    (ib += 3), o(3);
                                } else {
                                    if (60 !== a) break;
                                    if ('!--' !== gb.slice(ib + 1, ib + 4)) break;
                                    ++ib, ++ib, ++ib, ++ib, o(4);
                                }
                        }
                        function r(a) {
                            var b,
                                c,
                                e,
                                f = 0;
                            for (c = 'u' === a ? 4 : 2, b = 0; b < c; ++b) {
                                if (!(ib < lb && d(gb[ib]))) return '';
                                (e = gb[ib++]),
                                    (f = 16 * f + '0123456789abcdef'.indexOf(e.toLowerCase()));
                            }
                            return String.fromCharCode(f);
                        }
                        function s() {
                            var a, b;
                            for (
                                a = gb.charCodeAt(ib++),
                                    b = String.fromCharCode(a),
                                    92 === a &&
                                        (117 !== gb.charCodeAt(ib) &&
                                            O({}, db.UnexpectedToken, 'ILLEGAL'),
                                        ++ib,
                                        (a = r('u')),
                                        (a && '\\' !== a && h(a.charCodeAt(0))) ||
                                            O({}, db.UnexpectedToken, 'ILLEGAL'),
                                        (b = a));
                                ib < lb && ((a = gb.charCodeAt(ib)), i(a));

                            )
                                ++ib,
                                    (b += String.fromCharCode(a)),
                                    92 === a &&
                                        ((b = b.substr(0, b.length - 1)),
                                        117 !== gb.charCodeAt(ib) &&
                                            O({}, db.UnexpectedToken, 'ILLEGAL'),
                                        ++ib,
                                        (a = r('u')),
                                        (a && '\\' !== a && i(a.charCodeAt(0))) ||
                                            O({}, db.UnexpectedToken, 'ILLEGAL'),
                                        (b += a));
                            return b;
                        }
                        function t() {
                            var a, b;
                            for (a = ib++; ib < lb; ) {
                                if (92 === (b = gb.charCodeAt(ib))) return (ib = a), s();
                                if (!i(b)) break;
                                ++ib;
                            }
                            return gb.slice(a, ib);
                        }
                        function u() {
                            var a, b, c;
                            return (
                                (a = ib),
                                (b = 92 === gb.charCodeAt(ib) ? s() : t()),
                                (c =
                                    1 === b.length
                                        ? $a.Identifier
                                        : m(b)
                                        ? $a.Keyword
                                        : 'null' === b
                                        ? $a.NullLiteral
                                        : 'true' === b || 'false' === b
                                        ? $a.BooleanLiteral
                                        : $a.Identifier),
                                {
                                    type: c,
                                    value: b,
                                    lineNumber: jb,
                                    lineStart: kb,
                                    start: a,
                                    end: ib,
                                }
                            );
                        }
                        function v() {
                            var a,
                                b,
                                c,
                                d,
                                e = ib,
                                f = gb.charCodeAt(ib),
                                g = gb[ib];
                            switch (f) {
                                case 46:
                                case 40:
                                case 41:
                                case 59:
                                case 44:
                                case 123:
                                case 125:
                                case 91:
                                case 93:
                                case 58:
                                case 63:
                                case 126:
                                    return (
                                        ++ib,
                                        pb.tokenize &&
                                            (40 === f
                                                ? (pb.openParenToken = pb.tokens.length)
                                                : 123 === f &&
                                                  (pb.openCurlyToken = pb.tokens.length)),
                                        {
                                            type: $a.Punctuator,
                                            value: String.fromCharCode(f),
                                            lineNumber: jb,
                                            lineStart: kb,
                                            start: e,
                                            end: ib,
                                        }
                                    );
                                default:
                                    if (61 === (a = gb.charCodeAt(ib + 1)))
                                        switch (f) {
                                            case 43:
                                            case 45:
                                            case 47:
                                            case 60:
                                            case 62:
                                            case 94:
                                            case 124:
                                            case 37:
                                            case 38:
                                            case 42:
                                                return (
                                                    (ib += 2),
                                                    {
                                                        type: $a.Punctuator,
                                                        value:
                                                            String.fromCharCode(f) +
                                                            String.fromCharCode(a),
                                                        lineNumber: jb,
                                                        lineStart: kb,
                                                        start: e,
                                                        end: ib,
                                                    }
                                                );
                                            case 33:
                                            case 61:
                                                return (
                                                    (ib += 2),
                                                    61 === gb.charCodeAt(ib) && ++ib,
                                                    {
                                                        type: $a.Punctuator,
                                                        value: gb.slice(e, ib),
                                                        lineNumber: jb,
                                                        lineStart: kb,
                                                        start: e,
                                                        end: ib,
                                                    }
                                                );
                                        }
                            }
                            return '>>>=' === (d = gb.substr(ib, 4))
                                ? ((ib += 4),
                                  {
                                      type: $a.Punctuator,
                                      value: d,
                                      lineNumber: jb,
                                      lineStart: kb,
                                      start: e,
                                      end: ib,
                                  })
                                : '>>>' === (c = d.substr(0, 3)) || '<<=' === c || '>>=' === c
                                ? ((ib += 3),
                                  {
                                      type: $a.Punctuator,
                                      value: c,
                                      lineNumber: jb,
                                      lineStart: kb,
                                      start: e,
                                      end: ib,
                                  })
                                : ((b = c.substr(0, 2)),
                                  (g === b[1] && '+-<>&|'.indexOf(g) >= 0) || '=>' === b
                                      ? ((ib += 2),
                                        {
                                            type: $a.Punctuator,
                                            value: b,
                                            lineNumber: jb,
                                            lineStart: kb,
                                            start: e,
                                            end: ib,
                                        })
                                      : '<>=!+-*%&|^/'.indexOf(g) >= 0
                                      ? (++ib,
                                        {
                                            type: $a.Punctuator,
                                            value: g,
                                            lineNumber: jb,
                                            lineStart: kb,
                                            start: e,
                                            end: ib,
                                        })
                                      : void O({}, db.UnexpectedToken, 'ILLEGAL'));
                        }
                        function w(a) {
                            for (var b = ''; ib < lb && d(gb[ib]); ) b += gb[ib++];
                            return (
                                0 === b.length && O({}, db.UnexpectedToken, 'ILLEGAL'),
                                h(gb.charCodeAt(ib)) && O({}, db.UnexpectedToken, 'ILLEGAL'),
                                {
                                    type: $a.NumericLiteral,
                                    value: parseInt('0x' + b, 16),
                                    lineNumber: jb,
                                    lineStart: kb,
                                    start: a,
                                    end: ib,
                                }
                            );
                        }
                        function x(a) {
                            for (var b = '0' + gb[ib++]; ib < lb && e(gb[ib]); ) b += gb[ib++];
                            return (
                                (h(gb.charCodeAt(ib)) || c(gb.charCodeAt(ib))) &&
                                    O({}, db.UnexpectedToken, 'ILLEGAL'),
                                {
                                    type: $a.NumericLiteral,
                                    value: parseInt(b, 8),
                                    octal: !0,
                                    lineNumber: jb,
                                    lineStart: kb,
                                    start: a,
                                    end: ib,
                                }
                            );
                        }
                        function y() {
                            var a, d, f;
                            if (
                                ((f = gb[ib]),
                                b(
                                    c(f.charCodeAt(0)) || '.' === f,
                                    'Numeric literal must start with a decimal digit or a decimal point',
                                ),
                                (d = ib),
                                (a = ''),
                                '.' !== f)
                            ) {
                                if (((a = gb[ib++]), (f = gb[ib]), '0' === a)) {
                                    if ('x' === f || 'X' === f) return ++ib, w(d);
                                    if (e(f)) return x(d);
                                    f && c(f.charCodeAt(0)) && O({}, db.UnexpectedToken, 'ILLEGAL');
                                }
                                for (; c(gb.charCodeAt(ib)); ) a += gb[ib++];
                                f = gb[ib];
                            }
                            if ('.' === f) {
                                for (a += gb[ib++]; c(gb.charCodeAt(ib)); ) a += gb[ib++];
                                f = gb[ib];
                            }
                            if ('e' === f || 'E' === f)
                                if (
                                    ((a += gb[ib++]),
                                    (f = gb[ib]),
                                    ('+' !== f && '-' !== f) || (a += gb[ib++]),
                                    c(gb.charCodeAt(ib)))
                                )
                                    for (; c(gb.charCodeAt(ib)); ) a += gb[ib++];
                                else O({}, db.UnexpectedToken, 'ILLEGAL');
                            return (
                                h(gb.charCodeAt(ib)) && O({}, db.UnexpectedToken, 'ILLEGAL'),
                                {
                                    type: $a.NumericLiteral,
                                    value: parseFloat(a),
                                    lineNumber: jb,
                                    lineStart: kb,
                                    start: d,
                                    end: ib,
                                }
                            );
                        }
                        function z() {
                            var a,
                                c,
                                d,
                                f,
                                h,
                                i,
                                j,
                                k,
                                l = '',
                                m = !1;
                            for (
                                j = jb,
                                    k = kb,
                                    a = gb[ib],
                                    b(
                                        "'" === a || '"' === a,
                                        'String literal must starts with a quote',
                                    ),
                                    c = ib,
                                    ++ib;
                                ib < lb;

                            ) {
                                if ((d = gb[ib++]) === a) {
                                    a = '';
                                    break;
                                }
                                if ('\\' === d)
                                    if ((d = gb[ib++]) && g(d.charCodeAt(0)))
                                        ++jb, '\r' === d && '\n' === gb[ib] && ++ib, (kb = ib);
                                    else
                                        switch (d) {
                                            case 'u':
                                            case 'x':
                                                (i = ib),
                                                    (h = r(d)),
                                                    h ? (l += h) : ((ib = i), (l += d));
                                                break;
                                            case 'n':
                                                l += '\n';
                                                break;
                                            case 'r':
                                                l += '\r';
                                                break;
                                            case 't':
                                                l += '\t';
                                                break;
                                            case 'b':
                                                l += '\b';
                                                break;
                                            case 'f':
                                                l += '\f';
                                                break;
                                            case 'v':
                                                l += '\v';
                                                break;
                                            default:
                                                e(d)
                                                    ? ((f = '01234567'.indexOf(d)),
                                                      0 !== f && (m = !0),
                                                      ib < lb &&
                                                          e(gb[ib]) &&
                                                          ((m = !0),
                                                          (f =
                                                              8 * f + '01234567'.indexOf(gb[ib++])),
                                                          '0123'.indexOf(d) >= 0 &&
                                                              ib < lb &&
                                                              e(gb[ib]) &&
                                                              (f =
                                                                  8 * f +
                                                                  '01234567'.indexOf(gb[ib++]))),
                                                      (l += String.fromCharCode(f)))
                                                    : (l += d);
                                        }
                                else {
                                    if (g(d.charCodeAt(0))) break;
                                    l += d;
                                }
                            }
                            return (
                                '' !== a && O({}, db.UnexpectedToken, 'ILLEGAL'),
                                {
                                    type: $a.StringLiteral,
                                    value: l,
                                    octal: m,
                                    startLineNumber: j,
                                    startLineStart: k,
                                    lineNumber: jb,
                                    lineStart: kb,
                                    start: c,
                                    end: ib,
                                }
                            );
                        }
                        function A(a, b) {
                            var c;
                            try {
                                c = new RegExp(a, b);
                            } catch (d) {
                                O({}, db.InvalidRegExp);
                            }
                            return c;
                        }
                        function B() {
                            var a, c, d, e, f;
                            for (
                                a = gb[ib],
                                    b(
                                        '/' === a,
                                        'Regular expression literal must start with a slash',
                                    ),
                                    c = gb[ib++],
                                    d = !1,
                                    e = !1;
                                ib < lb;

                            )
                                if (((a = gb[ib++]), (c += a), '\\' === a))
                                    (a = gb[ib++]),
                                        g(a.charCodeAt(0)) && O({}, db.UnterminatedRegExp),
                                        (c += a);
                                else if (g(a.charCodeAt(0))) O({}, db.UnterminatedRegExp);
                                else if (d) ']' === a && (d = !1);
                                else {
                                    if ('/' === a) {
                                        e = !0;
                                        break;
                                    }
                                    '[' === a && (d = !0);
                                }
                            return (
                                e || O({}, db.UnterminatedRegExp),
                                (f = c.substr(1, c.length - 2)),
                                { value: f, literal: c }
                            );
                        }
                        function C() {
                            var a, b, c, d;
                            for (b = '', c = ''; ib < lb && ((a = gb[ib]), i(a.charCodeAt(0))); )
                                if ((++ib, '\\' === a && ib < lb))
                                    if ('u' === (a = gb[ib])) {
                                        if ((++ib, (d = ib), (a = r('u'))))
                                            for (c += a, b += '\\u'; d < ib; ++d) b += gb[d];
                                        else (ib = d), (c += 'u'), (b += '\\u');
                                        P({}, db.UnexpectedToken, 'ILLEGAL');
                                    } else (b += '\\'), P({}, db.UnexpectedToken, 'ILLEGAL');
                                else (c += a), (b += a);
                            return { value: c, literal: b };
                        }
                        function D() {
                            var a, b, c, d;
                            return (
                                (nb = null),
                                q(),
                                (a = ib),
                                (b = B()),
                                (c = C()),
                                (d = A(b.value, c.value)),
                                pb.tokenize
                                    ? {
                                          type: $a.RegularExpression,
                                          value: d,
                                          lineNumber: jb,
                                          lineStart: kb,
                                          start: a,
                                          end: ib,
                                      }
                                    : {
                                          literal: b.literal + c.literal,
                                          value: d,
                                          start: a,
                                          end: ib,
                                      }
                            );
                        }
                        function E() {
                            var a, b, c, d;
                            return (
                                q(),
                                (a = ib),
                                (b = { start: { line: jb, column: ib - kb } }),
                                (c = D()),
                                (b.end = { line: jb, column: ib - kb }),
                                pb.tokenize ||
                                    (pb.tokens.length > 0 &&
                                        ((d = pb.tokens[pb.tokens.length - 1]),
                                        d.range[0] === a &&
                                            'Punctuator' === d.type &&
                                            (('/' !== d.value && '/=' !== d.value) ||
                                                pb.tokens.pop())),
                                    pb.tokens.push({
                                        type: 'RegularExpression',
                                        value: c.literal,
                                        range: [a, ib],
                                        loc: b,
                                    })),
                                c
                            );
                        }
                        function F(a) {
                            return (
                                a.type === $a.Identifier ||
                                a.type === $a.Keyword ||
                                a.type === $a.BooleanLiteral ||
                                a.type === $a.NullLiteral
                            );
                        }
                        function G() {
                            var a, b;
                            if (!(a = pb.tokens[pb.tokens.length - 1])) return E();
                            if ('Punctuator' === a.type) {
                                if (']' === a.value) return v();
                                if (')' === a.value)
                                    return (
                                        (b = pb.tokens[pb.openParenToken - 1]),
                                        !b ||
                                        'Keyword' !== b.type ||
                                        ('if' !== b.value &&
                                            'while' !== b.value &&
                                            'for' !== b.value &&
                                            'with' !== b.value)
                                            ? v()
                                            : E()
                                    );
                                if ('}' === a.value) {
                                    if (
                                        pb.tokens[pb.openCurlyToken - 3] &&
                                        'Keyword' === pb.tokens[pb.openCurlyToken - 3].type
                                    ) {
                                        if (!(b = pb.tokens[pb.openCurlyToken - 4])) return v();
                                    } else {
                                        if (
                                            !pb.tokens[pb.openCurlyToken - 4] ||
                                            'Keyword' !== pb.tokens[pb.openCurlyToken - 4].type
                                        )
                                            return v();
                                        if (!(b = pb.tokens[pb.openCurlyToken - 5])) return E();
                                    }
                                    return ab.indexOf(b.value) >= 0 ? v() : E();
                                }
                                return E();
                            }
                            return 'Keyword' === a.type ? E() : v();
                        }
                        function H() {
                            var a;
                            return (
                                q(),
                                ib >= lb
                                    ? {
                                          type: $a.EOF,
                                          lineNumber: jb,
                                          lineStart: kb,
                                          start: ib,
                                          end: ib,
                                      }
                                    : ((a = gb.charCodeAt(ib)),
                                      h(a)
                                          ? u()
                                          : 40 === a || 41 === a || 59 === a
                                          ? v()
                                          : 39 === a || 34 === a
                                          ? z()
                                          : 46 === a
                                          ? c(gb.charCodeAt(ib + 1))
                                              ? y()
                                              : v()
                                          : c(a)
                                          ? y()
                                          : pb.tokenize && 47 === a
                                          ? G()
                                          : v())
                            );
                        }
                        function I() {
                            var a, b, c;
                            return (
                                q(),
                                (a = { start: { line: jb, column: ib - kb } }),
                                (b = H()),
                                (a.end = { line: jb, column: ib - kb }),
                                b.type !== $a.EOF &&
                                    ((c = gb.slice(b.start, b.end)),
                                    pb.tokens.push({
                                        type: _a[b.type],
                                        value: c,
                                        range: [b.start, b.end],
                                        loc: a,
                                    })),
                                b
                            );
                        }
                        function J() {
                            var a;
                            return (
                                (a = nb),
                                (ib = a.end),
                                (jb = a.lineNumber),
                                (kb = a.lineStart),
                                (nb = void 0 !== pb.tokens ? I() : H()),
                                (ib = a.end),
                                (jb = a.lineNumber),
                                (kb = a.lineStart),
                                a
                            );
                        }
                        function K() {
                            var a, b, c;
                            (a = ib),
                                (b = jb),
                                (c = kb),
                                (nb = void 0 !== pb.tokens ? I() : H()),
                                (ib = a),
                                (jb = b),
                                (kb = c);
                        }
                        function L(a, b) {
                            (this.line = a), (this.column = b);
                        }
                        function M(a, b, c, d) {
                            (this.start = new L(a, b)), (this.end = new L(c, d));
                        }
                        function N() {
                            var a, b, c, d;
                            return (
                                (a = ib),
                                (b = jb),
                                (c = kb),
                                q(),
                                (d = jb !== b),
                                (ib = a),
                                (jb = b),
                                (kb = c),
                                d
                            );
                        }
                        function O(a, c) {
                            var d,
                                e = Array.prototype.slice.call(arguments, 2),
                                f = c.replace(/%(\d)/g, function (a, c) {
                                    return (
                                        b(c < e.length, 'Message reference must be in range'), e[c]
                                    );
                                });
                            throw (
                                ('number' == typeof a.lineNumber
                                    ? ((d = new Error('Line ' + a.lineNumber + ': ' + f)),
                                      (d.index = a.start),
                                      (d.lineNumber = a.lineNumber),
                                      (d.column = a.start - kb + 1))
                                    : ((d = new Error('Line ' + jb + ': ' + f)),
                                      (d.index = ib),
                                      (d.lineNumber = jb),
                                      (d.column = ib - kb + 1)),
                                (d.description = f),
                                d)
                            );
                        }
                        function P() {
                            try {
                                O.apply(null, arguments);
                            } catch (a) {
                                if (!pb.errors) throw a;
                                pb.errors.push(a);
                            }
                        }
                        function Q(a) {
                            if (
                                (a.type === $a.EOF && O(a, db.UnexpectedEOS),
                                a.type === $a.NumericLiteral && O(a, db.UnexpectedNumber),
                                a.type === $a.StringLiteral && O(a, db.UnexpectedString),
                                a.type === $a.Identifier && O(a, db.UnexpectedIdentifier),
                                a.type === $a.Keyword)
                            ) {
                                if (j(a.value)) O(a, db.UnexpectedReserved);
                                else if (hb && k(a.value)) return void P(a, db.StrictReservedWord);
                                O(a, db.UnexpectedToken, a.value);
                            }
                            O(a, db.UnexpectedToken, a.value);
                        }
                        function R(a) {
                            var b = J();
                            (b.type === $a.Punctuator && b.value === a) || Q(b);
                        }
                        function S(a) {
                            var b = J();
                            (b.type === $a.Keyword && b.value === a) || Q(b);
                        }
                        function T(a) {
                            return nb.type === $a.Punctuator && nb.value === a;
                        }
                        function U(a) {
                            return nb.type === $a.Keyword && nb.value === a;
                        }
                        function V() {
                            var a;
                            return (
                                nb.type === $a.Punctuator &&
                                ('=' === (a = nb.value) ||
                                    '*=' === a ||
                                    '/=' === a ||
                                    '%=' === a ||
                                    '+=' === a ||
                                    '-=' === a ||
                                    '<<=' === a ||
                                    '>>=' === a ||
                                    '>>>=' === a ||
                                    '&=' === a ||
                                    '^=' === a ||
                                    '|=' === a)
                            );
                        }
                        function W() {
                            var a;
                            if (59 === gb.charCodeAt(ib) || T(';')) return void J();
                            (a = jb), q(), jb === a && (nb.type === $a.EOF || T('}') || Q(nb));
                        }
                        function X(a) {
                            return a.type === bb.Identifier || a.type === bb.MemberExpression;
                        }
                        function Y() {
                            var a,
                                b = [];
                            for (a = nb, R('['); !T(']'); )
                                T(',') ? (J(), b.push(null)) : (b.push(pa()), T(']') || R(','));
                            return J(), mb.markEnd(mb.createArrayExpression(b), a);
                        }
                        function Z(a, b) {
                            var c, d, e;
                            return (
                                (c = hb),
                                (e = nb),
                                (d = Qa()),
                                b && hb && l(a[0].name) && P(b, db.StrictParamName),
                                (hb = c),
                                mb.markEnd(mb.createFunctionExpression(null, a, [], d), e)
                            );
                        }
                        function $() {
                            var a, b;
                            return (
                                (b = nb),
                                (a = J()),
                                a.type === $a.StringLiteral || a.type === $a.NumericLiteral
                                    ? (hb && a.octal && P(a, db.StrictOctalLiteral),
                                      mb.markEnd(mb.createLiteral(a), b))
                                    : mb.markEnd(mb.createIdentifier(a.value), b)
                            );
                        }
                        function _() {
                            var a, b, c, d, e, f;
                            return (
                                (a = nb),
                                (f = nb),
                                a.type === $a.Identifier
                                    ? ((c = $()),
                                      'get' !== a.value || T(':')
                                          ? 'set' !== a.value || T(':')
                                              ? (R(':'),
                                                (d = pa()),
                                                mb.markEnd(mb.createProperty('init', c, d), f))
                                              : ((b = $()),
                                                R('('),
                                                (a = nb),
                                                a.type !== $a.Identifier
                                                    ? (R(')'),
                                                      P(a, db.UnexpectedToken, a.value),
                                                      (d = Z([])))
                                                    : ((e = [ta()]), R(')'), (d = Z(e, a))),
                                                mb.markEnd(mb.createProperty('set', b, d), f))
                                          : ((b = $()),
                                            R('('),
                                            R(')'),
                                            (d = Z([])),
                                            mb.markEnd(mb.createProperty('get', b, d), f)))
                                    : a.type !== $a.EOF && a.type !== $a.Punctuator
                                    ? ((b = $()),
                                      R(':'),
                                      (d = pa()),
                                      mb.markEnd(mb.createProperty('init', b, d), f))
                                    : void Q(a)
                            );
                        }
                        function aa() {
                            var a,
                                b,
                                c,
                                d,
                                e,
                                f = [],
                                g = {},
                                h = String;
                            for (e = nb, R('{'); !T('}'); )
                                (a = _()),
                                    (b =
                                        a.key.type === bb.Identifier ? a.key.name : h(a.key.value)),
                                    (d =
                                        'init' === a.kind
                                            ? cb.Data
                                            : 'get' === a.kind
                                            ? cb.Get
                                            : cb.Set),
                                    (c = '$' + b),
                                    Object.prototype.hasOwnProperty.call(g, c)
                                        ? (g[c] === cb.Data
                                              ? hb && d === cb.Data
                                                  ? P({}, db.StrictDuplicateProperty)
                                                  : d !== cb.Data && P({}, db.AccessorDataProperty)
                                              : d === cb.Data
                                              ? P({}, db.AccessorDataProperty)
                                              : g[c] & d && P({}, db.AccessorGetSet),
                                          (g[c] |= d))
                                        : (g[c] = d),
                                    f.push(a),
                                    T('}') || R(',');
                            return R('}'), mb.markEnd(mb.createObjectExpression(f), e);
                        }
                        function ba() {
                            var a;
                            return R('('), (a = qa()), R(')'), a;
                        }
                        function ca() {
                            var a, b, c, d;
                            if (T('(')) return ba();
                            if (T('[')) return Y();
                            if (T('{')) return aa();
                            if (((a = nb.type), (d = nb), a === $a.Identifier))
                                c = mb.createIdentifier(J().value);
                            else if (a === $a.StringLiteral || a === $a.NumericLiteral)
                                hb && nb.octal && P(nb, db.StrictOctalLiteral),
                                    (c = mb.createLiteral(J()));
                            else if (a === $a.Keyword) {
                                if (U('function')) return Ta();
                                U('this') ? (J(), (c = mb.createThisExpression())) : Q(J());
                            } else
                                a === $a.BooleanLiteral
                                    ? ((b = J()),
                                      (b.value = 'true' === b.value),
                                      (c = mb.createLiteral(b)))
                                    : a === $a.NullLiteral
                                    ? ((b = J()), (b.value = null), (c = mb.createLiteral(b)))
                                    : T('/') || T('/=')
                                    ? ((c =
                                          void 0 !== pb.tokens
                                              ? mb.createLiteral(E())
                                              : mb.createLiteral(D())),
                                      K())
                                    : Q(J());
                            return mb.markEnd(c, d);
                        }
                        function da() {
                            var a = [];
                            if ((R('('), !T(')')))
                                for (; ib < lb && (a.push(pa()), !T(')')); ) R(',');
                            return R(')'), a;
                        }
                        function ea() {
                            var a, b;
                            return (
                                (b = nb),
                                (a = J()),
                                F(a) || Q(a),
                                mb.markEnd(mb.createIdentifier(a.value), b)
                            );
                        }
                        function fa() {
                            return R('.'), ea();
                        }
                        function ga() {
                            var a;
                            return R('['), (a = qa()), R(']'), a;
                        }
                        function ha() {
                            var a, b, c;
                            return (
                                (c = nb),
                                S('new'),
                                (a = ja()),
                                (b = T('(') ? da() : []),
                                mb.markEnd(mb.createNewExpression(a, b), c)
                            );
                        }
                        function ia() {
                            var a, b, c, d, e;
                            for (
                                e = nb,
                                    a = ob.allowIn,
                                    ob.allowIn = !0,
                                    b = U('new') ? ha() : ca(),
                                    ob.allowIn = a;
                                ;

                            ) {
                                if (T('.')) (d = fa()), (b = mb.createMemberExpression('.', b, d));
                                else if (T('(')) (c = da()), (b = mb.createCallExpression(b, c));
                                else {
                                    if (!T('[')) break;
                                    (d = ga()), (b = mb.createMemberExpression('[', b, d));
                                }
                                mb.markEnd(b, e);
                            }
                            return b;
                        }
                        function ja() {
                            var a, b, c, d;
                            for (
                                d = nb, a = ob.allowIn, b = U('new') ? ha() : ca(), ob.allowIn = a;
                                T('.') || T('[');

                            )
                                T('[')
                                    ? ((c = ga()), (b = mb.createMemberExpression('[', b, c)))
                                    : ((c = fa()), (b = mb.createMemberExpression('.', b, c))),
                                    mb.markEnd(b, d);
                            return b;
                        }
                        function ka() {
                            var a,
                                b,
                                c = nb;
                            return (
                                (a = ia()),
                                nb.type === $a.Punctuator &&
                                    ((!T('++') && !T('--')) ||
                                        N() ||
                                        (hb &&
                                            a.type === bb.Identifier &&
                                            l(a.name) &&
                                            P({}, db.StrictLHSPostfix),
                                        X(a) || P({}, db.InvalidLHSInAssignment),
                                        (b = J()),
                                        (a = mb.markEnd(
                                            mb.createPostfixExpression(b.value, a),
                                            c,
                                        )))),
                                a
                            );
                        }
                        function la() {
                            var a, b, c;
                            return (
                                nb.type !== $a.Punctuator && nb.type !== $a.Keyword
                                    ? (b = ka())
                                    : T('++') || T('--')
                                    ? ((c = nb),
                                      (a = J()),
                                      (b = la()),
                                      hb &&
                                          b.type === bb.Identifier &&
                                          l(b.name) &&
                                          P({}, db.StrictLHSPrefix),
                                      X(b) || P({}, db.InvalidLHSInAssignment),
                                      (b = mb.createUnaryExpression(a.value, b)),
                                      (b = mb.markEnd(b, c)))
                                    : T('+') || T('-') || T('~') || T('!')
                                    ? ((c = nb),
                                      (a = J()),
                                      (b = la()),
                                      (b = mb.createUnaryExpression(a.value, b)),
                                      (b = mb.markEnd(b, c)))
                                    : U('delete') || U('void') || U('typeof')
                                    ? ((c = nb),
                                      (a = J()),
                                      (b = la()),
                                      (b = mb.createUnaryExpression(a.value, b)),
                                      (b = mb.markEnd(b, c)),
                                      hb &&
                                          'delete' === b.operator &&
                                          b.argument.type === bb.Identifier &&
                                          P({}, db.StrictDelete))
                                    : (b = ka()),
                                b
                            );
                        }
                        function ma(a, b) {
                            var c = 0;
                            if (a.type !== $a.Punctuator && a.type !== $a.Keyword) return 0;
                            switch (a.value) {
                                case '||':
                                    c = 1;
                                    break;
                                case '&&':
                                    c = 2;
                                    break;
                                case '|':
                                    c = 3;
                                    break;
                                case '^':
                                    c = 4;
                                    break;
                                case '&':
                                    c = 5;
                                    break;
                                case '==':
                                case '!=':
                                case '===':
                                case '!==':
                                    c = 6;
                                    break;
                                case '<':
                                case '>':
                                case '<=':
                                case '>=':
                                case 'instanceof':
                                    c = 7;
                                    break;
                                case 'in':
                                    c = b ? 7 : 0;
                                    break;
                                case '<<':
                                case '>>':
                                case '>>>':
                                    c = 8;
                                    break;
                                case '+':
                                case '-':
                                    c = 9;
                                    break;
                                case '*':
                                case '/':
                                case '%':
                                    c = 11;
                            }
                            return c;
                        }
                        function na() {
                            var a, b, c, d, e, f, g, h, i, j;
                            if (((a = nb), (i = la()), (d = nb), 0 === (e = ma(d, ob.allowIn))))
                                return i;
                            for (
                                d.prec = e, J(), b = [a, nb], g = la(), f = [i, d, g];
                                (e = ma(nb, ob.allowIn)) > 0;

                            ) {
                                for (; f.length > 2 && e <= f[f.length - 2].prec; )
                                    (g = f.pop()),
                                        (h = f.pop().value),
                                        (i = f.pop()),
                                        (c = mb.createBinaryExpression(h, i, g)),
                                        b.pop(),
                                        (a = b[b.length - 1]),
                                        mb.markEnd(c, a),
                                        f.push(c);
                                (d = J()),
                                    (d.prec = e),
                                    f.push(d),
                                    b.push(nb),
                                    (c = la()),
                                    f.push(c);
                            }
                            for (j = f.length - 1, c = f[j], b.pop(); j > 1; )
                                (c = mb.createBinaryExpression(f[j - 1].value, f[j - 2], c)),
                                    (j -= 2),
                                    (a = b.pop()),
                                    mb.markEnd(c, a);
                            return c;
                        }
                        function oa() {
                            var a, b, c, d, e;
                            return (
                                (e = nb),
                                (a = na()),
                                T('?') &&
                                    (J(),
                                    (b = ob.allowIn),
                                    (ob.allowIn = !0),
                                    (c = pa()),
                                    (ob.allowIn = b),
                                    R(':'),
                                    (d = pa()),
                                    (a = mb.createConditionalExpression(a, c, d)),
                                    mb.markEnd(a, e)),
                                a
                            );
                        }
                        function pa() {
                            var a, b, c, d, e;
                            return (
                                (a = nb),
                                (e = nb),
                                (d = b = oa()),
                                V() &&
                                    (X(b) || P({}, db.InvalidLHSInAssignment),
                                    hb &&
                                        b.type === bb.Identifier &&
                                        l(b.name) &&
                                        P(a, db.StrictLHSAssignment),
                                    (a = J()),
                                    (c = pa()),
                                    (d = mb.markEnd(
                                        mb.createAssignmentExpression(a.value, b, c),
                                        e,
                                    ))),
                                d
                            );
                        }
                        function qa() {
                            var a,
                                b = nb;
                            if (((a = pa()), T(','))) {
                                for (a = mb.createSequenceExpression([a]); ib < lb && T(','); )
                                    J(), a.expressions.push(pa());
                                mb.markEnd(a, b);
                            }
                            return a;
                        }
                        function ra() {
                            for (var a, b = []; ib < lb && !T('}') && void 0 !== (a = Ua()); )
                                b.push(a);
                            return b;
                        }
                        function sa() {
                            var a, b;
                            return (
                                (b = nb),
                                R('{'),
                                (a = ra()),
                                R('}'),
                                mb.markEnd(mb.createBlockStatement(a), b)
                            );
                        }
                        function ta() {
                            var a, b;
                            return (
                                (b = nb),
                                (a = J()),
                                a.type !== $a.Identifier && Q(a),
                                mb.markEnd(mb.createIdentifier(a.value), b)
                            );
                        }
                        function ua(a) {
                            var b,
                                c,
                                d = null;
                            return (
                                (c = nb),
                                (b = ta()),
                                hb && l(b.name) && P({}, db.StrictVarName),
                                'const' === a ? (R('='), (d = pa())) : T('=') && (J(), (d = pa())),
                                mb.markEnd(mb.createVariableDeclarator(b, d), c)
                            );
                        }
                        function va(a) {
                            var b = [];
                            do {
                                if ((b.push(ua(a)), !T(','))) break;
                                J();
                            } while (ib < lb);
                            return b;
                        }
                        function wa() {
                            var a;
                            return (
                                S('var'), (a = va()), W(), mb.createVariableDeclaration(a, 'var')
                            );
                        }
                        function xa(a) {
                            var b, c;
                            return (
                                (c = nb),
                                S(a),
                                (b = va(a)),
                                W(),
                                mb.markEnd(mb.createVariableDeclaration(b, a), c)
                            );
                        }
                        function ya() {
                            return R(';'), mb.createEmptyStatement();
                        }
                        function za() {
                            var a = qa();
                            return W(), mb.createExpressionStatement(a);
                        }
                        function Aa() {
                            var a, b, c;
                            return (
                                S('if'),
                                R('('),
                                (a = qa()),
                                R(')'),
                                (b = Pa()),
                                U('else') ? (J(), (c = Pa())) : (c = null),
                                mb.createIfStatement(a, b, c)
                            );
                        }
                        function Ba() {
                            var a, b, c;
                            return (
                                S('do'),
                                (c = ob.inIteration),
                                (ob.inIteration = !0),
                                (a = Pa()),
                                (ob.inIteration = c),
                                S('while'),
                                R('('),
                                (b = qa()),
                                R(')'),
                                T(';') && J(),
                                mb.createDoWhileStatement(a, b)
                            );
                        }
                        function Ca() {
                            var a, b, c;
                            return (
                                S('while'),
                                R('('),
                                (a = qa()),
                                R(')'),
                                (c = ob.inIteration),
                                (ob.inIteration = !0),
                                (b = Pa()),
                                (ob.inIteration = c),
                                mb.createWhileStatement(a, b)
                            );
                        }
                        function Da() {
                            var a, b, c;
                            return (
                                (c = nb),
                                (a = J()),
                                (b = va()),
                                mb.markEnd(mb.createVariableDeclaration(b, a.value), c)
                            );
                        }
                        function Ea() {
                            var a, b, c, d, e, f, g;
                            return (
                                (a = b = c = null),
                                S('for'),
                                R('('),
                                T(';')
                                    ? J()
                                    : (U('var') || U('let')
                                          ? ((ob.allowIn = !1),
                                            (a = Da()),
                                            (ob.allowIn = !0),
                                            1 === a.declarations.length &&
                                                U('in') &&
                                                (J(), (d = a), (e = qa()), (a = null)))
                                          : ((ob.allowIn = !1),
                                            (a = qa()),
                                            (ob.allowIn = !0),
                                            U('in') &&
                                                (X(a) || P({}, db.InvalidLHSInForIn),
                                                J(),
                                                (d = a),
                                                (e = qa()),
                                                (a = null))),
                                      void 0 === d && R(';')),
                                void 0 === d &&
                                    (T(';') || (b = qa()), R(';'), T(')') || (c = qa())),
                                R(')'),
                                (g = ob.inIteration),
                                (ob.inIteration = !0),
                                (f = Pa()),
                                (ob.inIteration = g),
                                void 0 === d
                                    ? mb.createForStatement(a, b, c, f)
                                    : mb.createForInStatement(d, e, f)
                            );
                        }
                        function Fa() {
                            var a,
                                b = null;
                            return (
                                S('continue'),
                                59 === gb.charCodeAt(ib)
                                    ? (J(),
                                      ob.inIteration || O({}, db.IllegalContinue),
                                      mb.createContinueStatement(null))
                                    : N()
                                    ? (ob.inIteration || O({}, db.IllegalContinue),
                                      mb.createContinueStatement(null))
                                    : (nb.type === $a.Identifier &&
                                          ((b = ta()),
                                          (a = '$' + b.name),
                                          Object.prototype.hasOwnProperty.call(ob.labelSet, a) ||
                                              O({}, db.UnknownLabel, b.name)),
                                      W(),
                                      null !== b || ob.inIteration || O({}, db.IllegalContinue),
                                      mb.createContinueStatement(b))
                            );
                        }
                        function Ga() {
                            var a,
                                b = null;
                            return (
                                S('break'),
                                59 === gb.charCodeAt(ib)
                                    ? (J(),
                                      ob.inIteration || ob.inSwitch || O({}, db.IllegalBreak),
                                      mb.createBreakStatement(null))
                                    : N()
                                    ? (ob.inIteration || ob.inSwitch || O({}, db.IllegalBreak),
                                      mb.createBreakStatement(null))
                                    : (nb.type === $a.Identifier &&
                                          ((b = ta()),
                                          (a = '$' + b.name),
                                          Object.prototype.hasOwnProperty.call(ob.labelSet, a) ||
                                              O({}, db.UnknownLabel, b.name)),
                                      W(),
                                      null !== b ||
                                          ob.inIteration ||
                                          ob.inSwitch ||
                                          O({}, db.IllegalBreak),
                                      mb.createBreakStatement(b))
                            );
                        }
                        function Ha() {
                            var a = null;
                            return (
                                S('return'),
                                ob.inFunctionBody || P({}, db.IllegalReturn),
                                32 === gb.charCodeAt(ib) && h(gb.charCodeAt(ib + 1))
                                    ? ((a = qa()), W(), mb.createReturnStatement(a))
                                    : N()
                                    ? mb.createReturnStatement(null)
                                    : (T(';') || T('}') || nb.type === $a.EOF || (a = qa()),
                                      W(),
                                      mb.createReturnStatement(a))
                            );
                        }
                        function Ia() {
                            var a, b;
                            return (
                                hb && (q(), P({}, db.StrictModeWith)),
                                S('with'),
                                R('('),
                                (a = qa()),
                                R(')'),
                                (b = Pa()),
                                mb.createWithStatement(a, b)
                            );
                        }
                        function Ja() {
                            var a,
                                b,
                                c,
                                d = [];
                            for (
                                c = nb,
                                    U('default') ? (J(), (a = null)) : (S('case'), (a = qa())),
                                    R(':');
                                ib < lb && !(T('}') || U('default') || U('case'));

                            )
                                (b = Pa()), d.push(b);
                            return mb.markEnd(mb.createSwitchCase(a, d), c);
                        }
                        function Ka() {
                            var a, b, c, d, e;
                            if ((S('switch'), R('('), (a = qa()), R(')'), R('{'), (b = []), T('}')))
                                return J(), mb.createSwitchStatement(a, b);
                            for (d = ob.inSwitch, ob.inSwitch = !0, e = !1; ib < lb && !T('}'); )
                                (c = Ja()),
                                    null === c.test &&
                                        (e && O({}, db.MultipleDefaultsInSwitch), (e = !0)),
                                    b.push(c);
                            return (ob.inSwitch = d), R('}'), mb.createSwitchStatement(a, b);
                        }
                        function La() {
                            var a;
                            return (
                                S('throw'),
                                N() && O({}, db.NewlineAfterThrow),
                                (a = qa()),
                                W(),
                                mb.createThrowStatement(a)
                            );
                        }
                        function Ma() {
                            var a, b, c;
                            return (
                                (c = nb),
                                S('catch'),
                                R('('),
                                T(')') && Q(nb),
                                (a = ta()),
                                hb && l(a.name) && P({}, db.StrictCatchVariable),
                                R(')'),
                                (b = sa()),
                                mb.markEnd(mb.createCatchClause(a, b), c)
                            );
                        }
                        function Na() {
                            var a,
                                b = [],
                                c = null;
                            return (
                                S('try'),
                                (a = sa()),
                                U('catch') && b.push(Ma()),
                                U('finally') && (J(), (c = sa())),
                                0 !== b.length || c || O({}, db.NoCatchOrFinally),
                                mb.createTryStatement(a, [], b, c)
                            );
                        }
                        function Oa() {
                            return S('debugger'), W(), mb.createDebuggerStatement();
                        }
                        function Pa() {
                            var a,
                                b,
                                c,
                                d,
                                e = nb.type;
                            if ((e === $a.EOF && Q(nb), e === $a.Punctuator && '{' === nb.value))
                                return sa();
                            if (((d = nb), e === $a.Punctuator))
                                switch (nb.value) {
                                    case ';':
                                        return mb.markEnd(ya(), d);
                                    case '(':
                                        return mb.markEnd(za(), d);
                                }
                            if (e === $a.Keyword)
                                switch (nb.value) {
                                    case 'break':
                                        return mb.markEnd(Ga(), d);
                                    case 'continue':
                                        return mb.markEnd(Fa(), d);
                                    case 'debugger':
                                        return mb.markEnd(Oa(), d);
                                    case 'do':
                                        return mb.markEnd(Ba(), d);
                                    case 'for':
                                        return mb.markEnd(Ea(), d);
                                    case 'function':
                                        return mb.markEnd(Sa(), d);
                                    case 'if':
                                        return mb.markEnd(Aa(), d);
                                    case 'return':
                                        return mb.markEnd(Ha(), d);
                                    case 'switch':
                                        return mb.markEnd(Ka(), d);
                                    case 'throw':
                                        return mb.markEnd(La(), d);
                                    case 'try':
                                        return mb.markEnd(Na(), d);
                                    case 'var':
                                        return mb.markEnd(wa(), d);
                                    case 'while':
                                        return mb.markEnd(Ca(), d);
                                    case 'with':
                                        return mb.markEnd(Ia(), d);
                                }
                            return (
                                (a = qa()),
                                a.type === bb.Identifier && T(':')
                                    ? (J(),
                                      (c = '$' + a.name),
                                      Object.prototype.hasOwnProperty.call(ob.labelSet, c) &&
                                          O({}, db.Redeclaration, 'Label', a.name),
                                      (ob.labelSet[c] = !0),
                                      (b = Pa()),
                                      delete ob.labelSet[c],
                                      mb.markEnd(mb.createLabeledStatement(a, b), d))
                                    : (W(), mb.markEnd(mb.createExpressionStatement(a), d))
                            );
                        }
                        function Qa() {
                            var a,
                                b,
                                c,
                                d,
                                e,
                                f,
                                g,
                                h,
                                i,
                                j = [];
                            for (
                                i = nb, R('{');
                                ib < lb &&
                                nb.type === $a.StringLiteral &&
                                ((b = nb), (a = Ua()), j.push(a), a.expression.type === bb.Literal);

                            )
                                (c = gb.slice(b.start + 1, b.end - 1)),
                                    'use strict' === c
                                        ? ((hb = !0), d && P(d, db.StrictOctalLiteral))
                                        : !d && b.octal && (d = b);
                            for (
                                e = ob.labelSet,
                                    f = ob.inIteration,
                                    g = ob.inSwitch,
                                    h = ob.inFunctionBody,
                                    ob.labelSet = {},
                                    ob.inIteration = !1,
                                    ob.inSwitch = !1,
                                    ob.inFunctionBody = !0;
                                ib < lb && !T('}') && void 0 !== (a = Ua());

                            )
                                j.push(a);
                            return (
                                R('}'),
                                (ob.labelSet = e),
                                (ob.inIteration = f),
                                (ob.inSwitch = g),
                                (ob.inFunctionBody = h),
                                mb.markEnd(mb.createBlockStatement(j), i)
                            );
                        }
                        function Ra(a) {
                            var b,
                                c,
                                d,
                                e,
                                f,
                                g,
                                h = [];
                            if ((R('('), !T(')')))
                                for (
                                    e = {};
                                    ib < lb &&
                                    ((c = nb),
                                    (b = ta()),
                                    (f = '$' + c.value),
                                    hb
                                        ? (l(c.value) && ((d = c), (g = db.StrictParamName)),
                                          Object.prototype.hasOwnProperty.call(e, f) &&
                                              ((d = c), (g = db.StrictParamDupe)))
                                        : a ||
                                          (l(c.value)
                                              ? ((a = c), (g = db.StrictParamName))
                                              : k(c.value)
                                              ? ((a = c), (g = db.StrictReservedWord))
                                              : Object.prototype.hasOwnProperty.call(e, f) &&
                                                ((a = c), (g = db.StrictParamDupe))),
                                    h.push(b),
                                    (e[f] = !0),
                                    !T(')'));

                                )
                                    R(',');
                            return (
                                R(')'), { params: h, stricted: d, firstRestricted: a, message: g }
                            );
                        }
                        function Sa() {
                            var a,
                                b,
                                c,
                                d,
                                e,
                                f,
                                g,
                                h,
                                i,
                                j = [];
                            return (
                                (i = nb),
                                S('function'),
                                (c = nb),
                                (a = ta()),
                                hb
                                    ? l(c.value) && P(c, db.StrictFunctionName)
                                    : l(c.value)
                                    ? ((f = c), (g = db.StrictFunctionName))
                                    : k(c.value) && ((f = c), (g = db.StrictReservedWord)),
                                (e = Ra(f)),
                                (j = e.params),
                                (d = e.stricted),
                                (f = e.firstRestricted),
                                e.message && (g = e.message),
                                (h = hb),
                                (b = Qa()),
                                hb && f && O(f, g),
                                hb && d && P(d, g),
                                (hb = h),
                                mb.markEnd(mb.createFunctionDeclaration(a, j, [], b), i)
                            );
                        }
                        function Ta() {
                            var a,
                                b,
                                c,
                                d,
                                e,
                                f,
                                g,
                                h,
                                i = null,
                                j = [];
                            return (
                                (h = nb),
                                S('function'),
                                T('(') ||
                                    ((a = nb),
                                    (i = ta()),
                                    hb
                                        ? l(a.value) && P(a, db.StrictFunctionName)
                                        : l(a.value)
                                        ? ((c = a), (d = db.StrictFunctionName))
                                        : k(a.value) && ((c = a), (d = db.StrictReservedWord))),
                                (e = Ra(c)),
                                (j = e.params),
                                (b = e.stricted),
                                (c = e.firstRestricted),
                                e.message && (d = e.message),
                                (g = hb),
                                (f = Qa()),
                                hb && c && O(c, d),
                                hb && b && P(b, d),
                                (hb = g),
                                mb.markEnd(mb.createFunctionExpression(i, j, [], f), h)
                            );
                        }
                        function Ua() {
                            if (nb.type === $a.Keyword)
                                switch (nb.value) {
                                    case 'const':
                                    case 'let':
                                        return xa(nb.value);
                                    case 'function':
                                        return Sa();
                                    default:
                                        return Pa();
                                }
                            if (nb.type !== $a.EOF) return Pa();
                        }
                        function Va() {
                            for (
                                var a, b, c, d, e = [];
                                ib < lb &&
                                ((b = nb), b.type === $a.StringLiteral) &&
                                ((a = Ua()), e.push(a), a.expression.type === bb.Literal);

                            )
                                (c = gb.slice(b.start + 1, b.end - 1)),
                                    'use strict' === c
                                        ? ((hb = !0), d && P(d, db.StrictOctalLiteral))
                                        : !d && b.octal && (d = b);
                            for (; ib < lb && void 0 !== (a = Ua()); ) e.push(a);
                            return e;
                        }
                        function Wa() {
                            var a, b;
                            return (
                                q(),
                                K(),
                                (b = nb),
                                (hb = !1),
                                (a = Va()),
                                mb.markEnd(mb.createProgram(a), b)
                            );
                        }
                        function Xa() {
                            var a,
                                b,
                                c,
                                d = [];
                            for (a = 0; a < pb.tokens.length; ++a)
                                (b = pb.tokens[a]),
                                    (c = { type: b.type, value: b.value }),
                                    pb.range && (c.range = b.range),
                                    pb.loc && (c.loc = b.loc),
                                    d.push(c);
                            pb.tokens = d;
                        }
                        function Ya(a, b) {
                            var c, d;
                            (c = String),
                                'string' == typeof a || a instanceof String || (a = c(a)),
                                (mb = fb),
                                (gb = a),
                                (ib = 0),
                                (jb = gb.length > 0 ? 1 : 0),
                                (kb = 0),
                                (lb = gb.length),
                                (nb = null),
                                (ob = {
                                    allowIn: !0,
                                    labelSet: {},
                                    inFunctionBody: !1,
                                    inIteration: !1,
                                    inSwitch: !1,
                                    lastCommentStart: -1,
                                }),
                                (pb = {}),
                                (b = b || {}),
                                (b.tokens = !0),
                                (pb.tokens = []),
                                (pb.tokenize = !0),
                                (pb.openParenToken = -1),
                                (pb.openCurlyToken = -1),
                                (pb.range = 'boolean' == typeof b.range && b.range),
                                (pb.loc = 'boolean' == typeof b.loc && b.loc),
                                'boolean' == typeof b.comment && b.comment && (pb.comments = []),
                                'boolean' == typeof b.tolerant && b.tolerant && (pb.errors = []);
                            try {
                                if ((K(), nb.type === $a.EOF)) return pb.tokens;
                                for (J(); nb.type !== $a.EOF; )
                                    try {
                                        J();
                                    } catch (e) {
                                        if ((nb, pb.errors)) {
                                            pb.errors.push(e);
                                            break;
                                        }
                                        throw e;
                                    }
                                Xa(),
                                    (d = pb.tokens),
                                    void 0 !== pb.comments && (d.comments = pb.comments),
                                    void 0 !== pb.errors && (d.errors = pb.errors);
                            } catch (f) {
                                throw f;
                            } finally {
                                pb = {};
                            }
                            return d;
                        }
                        function Za(a, b) {
                            var c, d;
                            (d = String),
                                'string' == typeof a || a instanceof String || (a = d(a)),
                                (mb = fb),
                                (gb = a),
                                (ib = 0),
                                (jb = gb.length > 0 ? 1 : 0),
                                (kb = 0),
                                (lb = gb.length),
                                (nb = null),
                                (ob = {
                                    allowIn: !0,
                                    labelSet: {},
                                    inFunctionBody: !1,
                                    inIteration: !1,
                                    inSwitch: !1,
                                    lastCommentStart: -1,
                                }),
                                (pb = {}),
                                void 0 !== b &&
                                    ((pb.range = 'boolean' == typeof b.range && b.range),
                                    (pb.loc = 'boolean' == typeof b.loc && b.loc),
                                    (pb.attachComment =
                                        'boolean' == typeof b.attachComment && b.attachComment),
                                    pb.loc &&
                                        null !== b.source &&
                                        void 0 !== b.source &&
                                        (pb.source = d(b.source)),
                                    'boolean' == typeof b.tokens && b.tokens && (pb.tokens = []),
                                    'boolean' == typeof b.comment &&
                                        b.comment &&
                                        (pb.comments = []),
                                    'boolean' == typeof b.tolerant &&
                                        b.tolerant &&
                                        (pb.errors = []),
                                    pb.attachComment &&
                                        ((pb.range = !0),
                                        (pb.comments = []),
                                        (pb.bottomRightStack = []),
                                        (pb.trailingComments = []),
                                        (pb.leadingComments = [])));
                            try {
                                (c = Wa()),
                                    void 0 !== pb.comments && (c.comments = pb.comments),
                                    void 0 !== pb.tokens && (Xa(), (c.tokens = pb.tokens)),
                                    void 0 !== pb.errors && (c.errors = pb.errors);
                            } catch (e) {
                                throw e;
                            } finally {
                                pb = {};
                            }
                            return c;
                        }
                        var $a, _a, ab, bb, cb, db, eb, fb, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb;
                        ($a = {
                            BooleanLiteral: 1,
                            EOF: 2,
                            Identifier: 3,
                            Keyword: 4,
                            NullLiteral: 5,
                            NumericLiteral: 6,
                            Punctuator: 7,
                            StringLiteral: 8,
                            RegularExpression: 9,
                        }),
                            (_a = {}),
                            (_a[$a.BooleanLiteral] = 'Boolean'),
                            (_a[$a.EOF] = '<end>'),
                            (_a[$a.Identifier] = 'Identifier'),
                            (_a[$a.Keyword] = 'Keyword'),
                            (_a[$a.NullLiteral] = 'Null'),
                            (_a[$a.NumericLiteral] = 'Numeric'),
                            (_a[$a.Punctuator] = 'Punctuator'),
                            (_a[$a.StringLiteral] = 'String'),
                            (_a[$a.RegularExpression] = 'RegularExpression'),
                            (ab = [
                                '(',
                                '{',
                                '[',
                                'in',
                                'typeof',
                                'instanceof',
                                'new',
                                'return',
                                'case',
                                'delete',
                                'throw',
                                'void',
                                '=',
                                '+=',
                                '-=',
                                '*=',
                                '/=',
                                '%=',
                                '<<=',
                                '>>=',
                                '>>>=',
                                '&=',
                                '|=',
                                '^=',
                                ',',
                                '+',
                                '-',
                                '*',
                                '/',
                                '%',
                                '++',
                                '--',
                                '<<',
                                '>>',
                                '>>>',
                                '&',
                                '|',
                                '^',
                                '!',
                                '~',
                                '&&',
                                '||',
                                '?',
                                ':',
                                '===',
                                '==',
                                '>=',
                                '<=',
                                '<',
                                '>',
                                '!=',
                                '!==',
                            ]),
                            (bb = {
                                AssignmentExpression: 'AssignmentExpression',
                                ArrayExpression: 'ArrayExpression',
                                BlockStatement: 'BlockStatement',
                                BinaryExpression: 'BinaryExpression',
                                BreakStatement: 'BreakStatement',
                                CallExpression: 'CallExpression',
                                CatchClause: 'CatchClause',
                                ConditionalExpression: 'ConditionalExpression',
                                ContinueStatement: 'ContinueStatement',
                                DoWhileStatement: 'DoWhileStatement',
                                DebuggerStatement: 'DebuggerStatement',
                                EmptyStatement: 'EmptyStatement',
                                ExpressionStatement: 'ExpressionStatement',
                                ForStatement: 'ForStatement',
                                ForInStatement: 'ForInStatement',
                                FunctionDeclaration: 'FunctionDeclaration',
                                FunctionExpression: 'FunctionExpression',
                                Identifier: 'Identifier',
                                IfStatement: 'IfStatement',
                                Literal: 'Literal',
                                LabeledStatement: 'LabeledStatement',
                                LogicalExpression: 'LogicalExpression',
                                MemberExpression: 'MemberExpression',
                                NewExpression: 'NewExpression',
                                ObjectExpression: 'ObjectExpression',
                                Program: 'Program',
                                Property: 'Property',
                                ReturnStatement: 'ReturnStatement',
                                SequenceExpression: 'SequenceExpression',
                                SwitchStatement: 'SwitchStatement',
                                SwitchCase: 'SwitchCase',
                                ThisExpression: 'ThisExpression',
                                ThrowStatement: 'ThrowStatement',
                                TryStatement: 'TryStatement',
                                UnaryExpression: 'UnaryExpression',
                                UpdateExpression: 'UpdateExpression',
                                VariableDeclaration: 'VariableDeclaration',
                                VariableDeclarator: 'VariableDeclarator',
                                WhileStatement: 'WhileStatement',
                                WithStatement: 'WithStatement',
                            }),
                            (cb = { Data: 1, Get: 2, Set: 4 }),
                            (db = {
                                UnexpectedToken: 'Unexpected token %0',
                                UnexpectedNumber: 'Unexpected number',
                                UnexpectedString: 'Unexpected string',
                                UnexpectedIdentifier: 'Unexpected identifier',
                                UnexpectedReserved: 'Unexpected reserved word',
                                UnexpectedEOS: 'Unexpected end of input',
                                NewlineAfterThrow: 'Illegal newline after throw',
                                InvalidRegExp: 'Invalid regular expression',
                                UnterminatedRegExp: 'Invalid regular expression: missing /',
                                InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
                                InvalidLHSInForIn: 'Invalid left-hand side in for-in',
                                MultipleDefaultsInSwitch:
                                    'More than one default clause in switch statement',
                                NoCatchOrFinally: 'Missing catch or finally after try',
                                UnknownLabel: "Undefined label '%0'",
                                Redeclaration: "%0 '%1' has already been declared",
                                IllegalContinue: 'Illegal continue statement',
                                IllegalBreak: 'Illegal break statement',
                                IllegalReturn: 'Illegal return statement',
                                StrictModeWith: 'Strict mode code may not include a with statement',
                                StrictCatchVariable:
                                    'Catch variable may not be eval or arguments in strict mode',
                                StrictVarName:
                                    'Variable name may not be eval or arguments in strict mode',
                                StrictParamName:
                                    'Parameter name eval or arguments is not allowed in strict mode',
                                StrictParamDupe:
                                    'Strict mode function may not have duplicate parameter names',
                                StrictFunctionName:
                                    'Function name may not be eval or arguments in strict mode',
                                StrictOctalLiteral:
                                    'Octal literals are not allowed in strict mode.',
                                StrictDelete: 'Delete of an unqualified identifier in strict mode.',
                                StrictDuplicateProperty:
                                    'Duplicate data property in object literal not allowed in strict mode',
                                AccessorDataProperty:
                                    'Object literal may not have data and accessor property with the same name',
                                AccessorGetSet:
                                    'Object literal may not have multiple get/set accessors with the same name',
                                StrictLHSAssignment:
                                    'Assignment to eval or arguments is not allowed in strict mode',
                                StrictLHSPostfix:
                                    'Postfix increment/decrement may not have eval or arguments operand in strict mode',
                                StrictLHSPrefix:
                                    'Prefix increment/decrement may not have eval or arguments operand in strict mode',
                                StrictReservedWord: 'Use of future reserved word in strict mode',
                            }),
                            (eb = {
                                NonAsciiIdentifierStart: new RegExp(
                                    '[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]',
                                ),
                                NonAsciiIdentifierPart: new RegExp(
                                    '[ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮ̀-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁ҃-҇Ҋ-ԧԱ-Ֆՙա-և֑-ׇֽֿׁׂׅׄא-תװ-ײؐ-ؚؠ-٩ٮ-ۓە-ۜ۟-۪ۨ-ۼۿܐ-݊ݍ-ޱ߀-ߵߺࠀ-࠭ࡀ-࡛ࢠࢢ-ࢬࣤ-ࣾऀ-ॣ०-९ॱ-ॷॹ-ॿঁ-ঃঅ-ঌএঐও-নপ-রলশ-হ়-ৄেৈো-ৎৗড়ঢ়য়-ৣ০-ৱਁ-ਃਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹ਼ਾ-ੂੇੈੋ-੍ੑਖ਼-ੜਫ਼੦-ੵઁ-ઃઅ-ઍએ-ઑઓ-નપ-રલળવ-હ઼-ૅે-ૉો-્ૐૠ-ૣ૦-૯ଁ-ଃଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହ଼-ୄେୈୋ-୍ୖୗଡ଼ଢ଼ୟ-ୣ୦-୯ୱஂஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹா-ூெ-ைொ-்ௐௗ௦-௯ఁ-ఃఅ-ఌఎ-ఐఒ-నప-ళవ-హఽ-ౄె-ైొ-్ౕౖౘౙౠ-ౣ౦-౯ಂಃಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹ಼-ೄೆ-ೈೊ-್ೕೖೞೠ-ೣ೦-೯ೱೲംഃഅ-ഌഎ-ഐഒ-ഺഽ-ൄെ-ൈൊ-ൎൗൠ-ൣ൦-൯ൺ-ൿංඃඅ-ඖක-නඳ-රලව-ෆ්ා-ුූෘ-ෟෲෳก-ฺเ-๎๐-๙ກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ູົ-ຽເ-ໄໆ່-ໍ໐-໙ໜ-ໟༀ༘༙༠-༩༹༵༷༾-ཇཉ-ཬཱ-྄྆-ྗྙ-ྼ࿆က-၉ၐ-ႝႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚ፝-፟ᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-᜔ᜠ-᜴ᝀ-ᝓᝠ-ᝬᝮ-ᝰᝲᝳក-៓ៗៜ៝០-៩᠋-᠍᠐-᠙ᠠ-ᡷᢀ-ᢪᢰ-ᣵᤀ-ᤜᤠ-ᤫᤰ-᤻᥆-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉ᧐-᧙ᨀ-ᨛᨠ-ᩞ᩠-᩿᩼-᪉᪐-᪙ᪧᬀ-ᭋ᭐-᭙᭫-᭳ᮀ-᯳ᰀ-᰷᱀-᱉ᱍ-ᱽ᳐-᳔᳒-ᳶᴀ-ᷦ᷼-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼ‌‍‿⁀⁔ⁱⁿₐ-ₜ⃐-⃥⃜⃡-⃰ℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯ⵿-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⷠ-ⷿⸯ々-〇〡-〯〱-〵〸-〼ぁ-ゖ゙゚ゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘫꙀ-꙯ꙴ-꙽ꙿ-ꚗꚟ-꛱ꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠧꡀ-ꡳꢀ-꣄꣐-꣙꣠-ꣷꣻ꤀-꤭ꤰ-꥓ꥠ-ꥼꦀ-꧀ꧏ-꧙ꨀ-ꨶꩀ-ꩍ꩐-꩙ꩠ-ꩶꩺꩻꪀ-ꫂꫛ-ꫝꫠ-ꫯꫲ-꫶ꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯪ꯬꯭꯰-꯹가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻ︀-️︠-︦︳︴﹍-﹏ﹰ-ﹴﹶ-ﻼ０-９Ａ-Ｚ＿ａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]',
                                ),
                            }),
                            (fb = {
                                name: 'SyntaxTree',
                                processComment: function (a) {
                                    var b, c;
                                    if (!(a.type === bb.Program && a.body.length > 0)) {
                                        for (
                                            pb.trailingComments.length > 0
                                                ? pb.trailingComments[0].range[0] >= a.range[1]
                                                    ? ((c = pb.trailingComments),
                                                      (pb.trailingComments = []))
                                                    : (pb.trailingComments.length = 0)
                                                : pb.bottomRightStack.length > 0 &&
                                                  pb.bottomRightStack[
                                                      pb.bottomRightStack.length - 1
                                                  ].trailingComments &&
                                                  pb.bottomRightStack[
                                                      pb.bottomRightStack.length - 1
                                                  ].trailingComments[0].range[0] >= a.range[1] &&
                                                  ((c =
                                                      pb.bottomRightStack[
                                                          pb.bottomRightStack.length - 1
                                                      ].trailingComments),
                                                  delete pb.bottomRightStack[
                                                      pb.bottomRightStack.length - 1
                                                  ].trailingComments);
                                            pb.bottomRightStack.length > 0 &&
                                            pb.bottomRightStack[pb.bottomRightStack.length - 1]
                                                .range[0] >= a.range[0];

                                        )
                                            b = pb.bottomRightStack.pop();
                                        b
                                            ? b.leadingComments &&
                                              b.leadingComments[b.leadingComments.length - 1]
                                                  .range[1] <= a.range[0] &&
                                              ((a.leadingComments = b.leadingComments),
                                              delete b.leadingComments)
                                            : pb.leadingComments.length > 0 &&
                                              pb.leadingComments[pb.leadingComments.length - 1]
                                                  .range[1] <= a.range[0] &&
                                              ((a.leadingComments = pb.leadingComments),
                                              (pb.leadingComments = [])),
                                            c && (a.trailingComments = c),
                                            pb.bottomRightStack.push(a);
                                    }
                                },
                                markEnd: function (a, b) {
                                    return (
                                        pb.range && (a.range = [b.start, ib]),
                                        pb.loc &&
                                            ((a.loc = new M(
                                                void 0 === b.startLineNumber
                                                    ? b.lineNumber
                                                    : b.startLineNumber,
                                                b.start -
                                                    (void 0 === b.startLineStart
                                                        ? b.lineStart
                                                        : b.startLineStart),
                                                jb,
                                                ib - kb,
                                            )),
                                            this.postProcess(a)),
                                        pb.attachComment && this.processComment(a),
                                        a
                                    );
                                },
                                postProcess: function (a) {
                                    return pb.source && (a.loc.source = pb.source), a;
                                },
                                createArrayExpression: function (a) {
                                    return { type: bb.ArrayExpression, elements: a };
                                },
                                createAssignmentExpression: function (a, b, c) {
                                    return {
                                        type: bb.AssignmentExpression,
                                        operator: a,
                                        left: b,
                                        right: c,
                                    };
                                },
                                createBinaryExpression: function (a, b, c) {
                                    return {
                                        type:
                                            '||' === a || '&&' === a
                                                ? bb.LogicalExpression
                                                : bb.BinaryExpression,
                                        operator: a,
                                        left: b,
                                        right: c,
                                    };
                                },
                                createBlockStatement: function (a) {
                                    return { type: bb.BlockStatement, body: a };
                                },
                                createBreakStatement: function (a) {
                                    return { type: bb.BreakStatement, label: a };
                                },
                                createCallExpression: function (a, b) {
                                    return { type: bb.CallExpression, callee: a, arguments: b };
                                },
                                createCatchClause: function (a, b) {
                                    return { type: bb.CatchClause, param: a, body: b };
                                },
                                createConditionalExpression: function (a, b, c) {
                                    return {
                                        type: bb.ConditionalExpression,
                                        test: a,
                                        consequent: b,
                                        alternate: c,
                                    };
                                },
                                createContinueStatement: function (a) {
                                    return { type: bb.ContinueStatement, label: a };
                                },
                                createDebuggerStatement: function () {
                                    return { type: bb.DebuggerStatement };
                                },
                                createDoWhileStatement: function (a, b) {
                                    return { type: bb.DoWhileStatement, body: a, test: b };
                                },
                                createEmptyStatement: function () {
                                    return { type: bb.EmptyStatement };
                                },
                                createExpressionStatement: function (a) {
                                    return { type: bb.ExpressionStatement, expression: a };
                                },
                                createForStatement: function (a, b, c, d) {
                                    return {
                                        type: bb.ForStatement,
                                        init: a,
                                        test: b,
                                        update: c,
                                        body: d,
                                    };
                                },
                                createForInStatement: function (a, b, c) {
                                    return {
                                        type: bb.ForInStatement,
                                        left: a,
                                        right: b,
                                        body: c,
                                        each: !1,
                                    };
                                },
                                createFunctionDeclaration: function (a, b, c, d) {
                                    return {
                                        type: bb.FunctionDeclaration,
                                        id: a,
                                        params: b,
                                        defaults: c,
                                        body: d,
                                        rest: null,
                                        generator: !1,
                                        expression: !1,
                                    };
                                },
                                createFunctionExpression: function (a, b, c, d) {
                                    return {
                                        type: bb.FunctionExpression,
                                        id: a,
                                        params: b,
                                        defaults: c,
                                        body: d,
                                        rest: null,
                                        generator: !1,
                                        expression: !1,
                                    };
                                },
                                createIdentifier: function (a) {
                                    return { type: bb.Identifier, name: a };
                                },
                                createIfStatement: function (a, b, c) {
                                    return {
                                        type: bb.IfStatement,
                                        test: a,
                                        consequent: b,
                                        alternate: c,
                                    };
                                },
                                createLabeledStatement: function (a, b) {
                                    return { type: bb.LabeledStatement, label: a, body: b };
                                },
                                createLiteral: function (a) {
                                    return {
                                        type: bb.Literal,
                                        value: a.value,
                                        raw: gb.slice(a.start, a.end),
                                    };
                                },
                                createMemberExpression: function (a, b, c) {
                                    return {
                                        type: bb.MemberExpression,
                                        computed: '[' === a,
                                        object: b,
                                        property: c,
                                    };
                                },
                                createNewExpression: function (a, b) {
                                    return { type: bb.NewExpression, callee: a, arguments: b };
                                },
                                createObjectExpression: function (a) {
                                    return { type: bb.ObjectExpression, properties: a };
                                },
                                createPostfixExpression: function (a, b) {
                                    return {
                                        type: bb.UpdateExpression,
                                        operator: a,
                                        argument: b,
                                        prefix: !1,
                                    };
                                },
                                createProgram: function (a) {
                                    return { type: bb.Program, body: a };
                                },
                                createProperty: function (a, b, c) {
                                    return { type: bb.Property, key: b, value: c, kind: a };
                                },
                                createReturnStatement: function (a) {
                                    return { type: bb.ReturnStatement, argument: a };
                                },
                                createSequenceExpression: function (a) {
                                    return { type: bb.SequenceExpression, expressions: a };
                                },
                                createSwitchCase: function (a, b) {
                                    return { type: bb.SwitchCase, test: a, consequent: b };
                                },
                                createSwitchStatement: function (a, b) {
                                    return { type: bb.SwitchStatement, discriminant: a, cases: b };
                                },
                                createThisExpression: function () {
                                    return { type: bb.ThisExpression };
                                },
                                createThrowStatement: function (a) {
                                    return { type: bb.ThrowStatement, argument: a };
                                },
                                createTryStatement: function (a, b, c, d) {
                                    return {
                                        type: bb.TryStatement,
                                        block: a,
                                        guardedHandlers: b,
                                        handlers: c,
                                        finalizer: d,
                                    };
                                },
                                createUnaryExpression: function (a, b) {
                                    return '++' === a || '--' === a
                                        ? {
                                              type: bb.UpdateExpression,
                                              operator: a,
                                              argument: b,
                                              prefix: !0,
                                          }
                                        : {
                                              type: bb.UnaryExpression,
                                              operator: a,
                                              argument: b,
                                              prefix: !0,
                                          };
                                },
                                createVariableDeclaration: function (a, b) {
                                    return {
                                        type: bb.VariableDeclaration,
                                        declarations: a,
                                        kind: b,
                                    };
                                },
                                createVariableDeclarator: function (a, b) {
                                    return { type: bb.VariableDeclarator, id: a, init: b };
                                },
                                createWhileStatement: function (a, b) {
                                    return { type: bb.WhileStatement, test: a, body: b };
                                },
                                createWithStatement: function (a, b) {
                                    return { type: bb.WithStatement, object: a, body: b };
                                },
                            }),
                            (a.version = '1.2.2'),
                            (a.tokenize = Ya),
                            (a.parse = Za),
                            (a.Syntax = (function () {
                                var a,
                                    b = {};
                                'function' == typeof Object.create && (b = Object.create(null));
                                for (a in bb) bb.hasOwnProperty(a) && (b[a] = bb[a]);
                                return 'function' == typeof Object.freeze && Object.freeze(b), b;
                            })());
                    });
                },
                {},
            ],
            1: [
                function (a, b, c) {
                    (function (d) {
                        var e = (function () {
                            function a() {
                                this.yy = {};
                            }
                            var b = {
                                    trace: function () {},
                                    yy: {},
                                    symbols_: {
                                        error: 2,
                                        JSON_PATH: 3,
                                        DOLLAR: 4,
                                        PATH_COMPONENTS: 5,
                                        LEADING_CHILD_MEMBER_EXPRESSION: 6,
                                        PATH_COMPONENT: 7,
                                        MEMBER_COMPONENT: 8,
                                        SUBSCRIPT_COMPONENT: 9,
                                        CHILD_MEMBER_COMPONENT: 10,
                                        DESCENDANT_MEMBER_COMPONENT: 11,
                                        DOT: 12,
                                        MEMBER_EXPRESSION: 13,
                                        DOT_DOT: 14,
                                        STAR: 15,
                                        IDENTIFIER: 16,
                                        SCRIPT_EXPRESSION: 17,
                                        INTEGER: 18,
                                        END: 19,
                                        CHILD_SUBSCRIPT_COMPONENT: 20,
                                        DESCENDANT_SUBSCRIPT_COMPONENT: 21,
                                        '[': 22,
                                        SUBSCRIPT: 23,
                                        ']': 24,
                                        SUBSCRIPT_EXPRESSION: 25,
                                        SUBSCRIPT_EXPRESSION_LIST: 26,
                                        SUBSCRIPT_EXPRESSION_LISTABLE: 27,
                                        ',': 28,
                                        STRING_LITERAL: 29,
                                        ARRAY_SLICE: 30,
                                        FILTER_EXPRESSION: 31,
                                        QQ_STRING: 32,
                                        Q_STRING: 33,
                                        $accept: 0,
                                        $end: 1,
                                    },
                                    terminals_: {
                                        2: 'error',
                                        4: 'DOLLAR',
                                        12: 'DOT',
                                        14: 'DOT_DOT',
                                        15: 'STAR',
                                        16: 'IDENTIFIER',
                                        17: 'SCRIPT_EXPRESSION',
                                        18: 'INTEGER',
                                        19: 'END',
                                        22: '[',
                                        24: ']',
                                        28: ',',
                                        30: 'ARRAY_SLICE',
                                        31: 'FILTER_EXPRESSION',
                                        32: 'QQ_STRING',
                                        33: 'Q_STRING',
                                    },
                                    productions_: [
                                        0,
                                        [3, 1],
                                        [3, 2],
                                        [3, 1],
                                        [3, 2],
                                        [5, 1],
                                        [5, 2],
                                        [7, 1],
                                        [7, 1],
                                        [8, 1],
                                        [8, 1],
                                        [10, 2],
                                        [6, 1],
                                        [11, 2],
                                        [13, 1],
                                        [13, 1],
                                        [13, 1],
                                        [13, 1],
                                        [13, 1],
                                        [9, 1],
                                        [9, 1],
                                        [20, 3],
                                        [21, 4],
                                        [23, 1],
                                        [23, 1],
                                        [26, 1],
                                        [26, 3],
                                        [27, 1],
                                        [27, 1],
                                        [27, 1],
                                        [25, 1],
                                        [25, 1],
                                        [25, 1],
                                        [29, 1],
                                        [29, 1],
                                    ],
                                    performAction: function (a, b, d, e, f, g, h) {
                                        e.ast || ((e.ast = c), c.initialize());
                                        var i = g.length - 1;
                                        switch (f) {
                                            case 1:
                                                return (
                                                    e.ast.set({
                                                        expression: { type: 'root', value: g[i] },
                                                    }),
                                                    e.ast.unshift(),
                                                    e.ast.yield()
                                                );
                                            case 2:
                                                return (
                                                    e.ast.set({
                                                        expression: {
                                                            type: 'root',
                                                            value: g[i - 1],
                                                        },
                                                    }),
                                                    e.ast.unshift(),
                                                    e.ast.yield()
                                                );
                                            case 3:
                                                return e.ast.unshift(), e.ast.yield();
                                            case 4:
                                                return (
                                                    e.ast.set({
                                                        operation: 'member',
                                                        scope: 'child',
                                                        expression: {
                                                            type: 'identifier',
                                                            value: g[i - 1],
                                                        },
                                                    }),
                                                    e.ast.unshift(),
                                                    e.ast.yield()
                                                );
                                            case 5:
                                            case 6:
                                                break;
                                            case 7:
                                                e.ast.set({ operation: 'member' }), e.ast.push();
                                                break;
                                            case 8:
                                                e.ast.set({ operation: 'subscript' }), e.ast.push();
                                                break;
                                            case 9:
                                                e.ast.set({ scope: 'child' });
                                                break;
                                            case 10:
                                                e.ast.set({ scope: 'descendant' });
                                                break;
                                            case 11:
                                                break;
                                            case 12:
                                                e.ast.set({ scope: 'child', operation: 'member' });
                                                break;
                                            case 13:
                                                break;
                                            case 14:
                                                e.ast.set({
                                                    expression: { type: 'wildcard', value: g[i] },
                                                });
                                                break;
                                            case 15:
                                                e.ast.set({
                                                    expression: { type: 'identifier', value: g[i] },
                                                });
                                                break;
                                            case 16:
                                                e.ast.set({
                                                    expression: {
                                                        type: 'script_expression',
                                                        value: g[i],
                                                    },
                                                });
                                                break;
                                            case 17:
                                                e.ast.set({
                                                    expression: {
                                                        type: 'numeric_literal',
                                                        value: parseInt(g[i]),
                                                    },
                                                });
                                                break;
                                            case 18:
                                                break;
                                            case 19:
                                                e.ast.set({ scope: 'child' });
                                                break;
                                            case 20:
                                                e.ast.set({ scope: 'descendant' });
                                                break;
                                            case 21:
                                            case 22:
                                            case 23:
                                                break;
                                            case 24:
                                                g[i].length > 1
                                                    ? e.ast.set({
                                                          expression: {
                                                              type: 'union',
                                                              value: g[i],
                                                          },
                                                      })
                                                    : (this.$ = g[i]);
                                                break;
                                            case 25:
                                                this.$ = [g[i]];
                                                break;
                                            case 26:
                                                this.$ = g[i - 2].concat(g[i]);
                                                break;
                                            case 27:
                                                (this.$ = {
                                                    expression: {
                                                        type: 'numeric_literal',
                                                        value: parseInt(g[i]),
                                                    },
                                                }),
                                                    e.ast.set(this.$);
                                                break;
                                            case 28:
                                                (this.$ = {
                                                    expression: {
                                                        type: 'string_literal',
                                                        value: g[i],
                                                    },
                                                }),
                                                    e.ast.set(this.$);
                                                break;
                                            case 29:
                                                (this.$ = {
                                                    expression: { type: 'slice', value: g[i] },
                                                }),
                                                    e.ast.set(this.$);
                                                break;
                                            case 30:
                                                (this.$ = {
                                                    expression: { type: 'wildcard', value: g[i] },
                                                }),
                                                    e.ast.set(this.$);
                                                break;
                                            case 31:
                                                (this.$ = {
                                                    expression: {
                                                        type: 'script_expression',
                                                        value: g[i],
                                                    },
                                                }),
                                                    e.ast.set(this.$);
                                                break;
                                            case 32:
                                                (this.$ = {
                                                    expression: {
                                                        type: 'filter_expression',
                                                        value: g[i],
                                                    },
                                                }),
                                                    e.ast.set(this.$);
                                                break;
                                            case 33:
                                            case 34:
                                                this.$ = g[i];
                                        }
                                    },
                                    table: [
                                        {
                                            3: 1,
                                            4: [1, 2],
                                            6: 3,
                                            13: 4,
                                            15: [1, 5],
                                            16: [1, 6],
                                            17: [1, 7],
                                            18: [1, 8],
                                            19: [1, 9],
                                        },
                                        { 1: [3] },
                                        {
                                            1: [2, 1],
                                            5: 10,
                                            7: 11,
                                            8: 12,
                                            9: 13,
                                            10: 14,
                                            11: 15,
                                            12: [1, 18],
                                            14: [1, 19],
                                            20: 16,
                                            21: 17,
                                            22: [1, 20],
                                        },
                                        {
                                            1: [2, 3],
                                            5: 21,
                                            7: 11,
                                            8: 12,
                                            9: 13,
                                            10: 14,
                                            11: 15,
                                            12: [1, 18],
                                            14: [1, 19],
                                            20: 16,
                                            21: 17,
                                            22: [1, 20],
                                        },
                                        { 1: [2, 12], 12: [2, 12], 14: [2, 12], 22: [2, 12] },
                                        { 1: [2, 14], 12: [2, 14], 14: [2, 14], 22: [2, 14] },
                                        { 1: [2, 15], 12: [2, 15], 14: [2, 15], 22: [2, 15] },
                                        { 1: [2, 16], 12: [2, 16], 14: [2, 16], 22: [2, 16] },
                                        { 1: [2, 17], 12: [2, 17], 14: [2, 17], 22: [2, 17] },
                                        { 1: [2, 18], 12: [2, 18], 14: [2, 18], 22: [2, 18] },
                                        {
                                            1: [2, 2],
                                            7: 22,
                                            8: 12,
                                            9: 13,
                                            10: 14,
                                            11: 15,
                                            12: [1, 18],
                                            14: [1, 19],
                                            20: 16,
                                            21: 17,
                                            22: [1, 20],
                                        },
                                        { 1: [2, 5], 12: [2, 5], 14: [2, 5], 22: [2, 5] },
                                        { 1: [2, 7], 12: [2, 7], 14: [2, 7], 22: [2, 7] },
                                        { 1: [2, 8], 12: [2, 8], 14: [2, 8], 22: [2, 8] },
                                        { 1: [2, 9], 12: [2, 9], 14: [2, 9], 22: [2, 9] },
                                        { 1: [2, 10], 12: [2, 10], 14: [2, 10], 22: [2, 10] },
                                        { 1: [2, 19], 12: [2, 19], 14: [2, 19], 22: [2, 19] },
                                        { 1: [2, 20], 12: [2, 20], 14: [2, 20], 22: [2, 20] },
                                        {
                                            13: 23,
                                            15: [1, 5],
                                            16: [1, 6],
                                            17: [1, 7],
                                            18: [1, 8],
                                            19: [1, 9],
                                        },
                                        {
                                            13: 24,
                                            15: [1, 5],
                                            16: [1, 6],
                                            17: [1, 7],
                                            18: [1, 8],
                                            19: [1, 9],
                                            22: [1, 25],
                                        },
                                        {
                                            15: [1, 29],
                                            17: [1, 30],
                                            18: [1, 33],
                                            23: 26,
                                            25: 27,
                                            26: 28,
                                            27: 32,
                                            29: 34,
                                            30: [1, 35],
                                            31: [1, 31],
                                            32: [1, 36],
                                            33: [1, 37],
                                        },
                                        {
                                            1: [2, 4],
                                            7: 22,
                                            8: 12,
                                            9: 13,
                                            10: 14,
                                            11: 15,
                                            12: [1, 18],
                                            14: [1, 19],
                                            20: 16,
                                            21: 17,
                                            22: [1, 20],
                                        },
                                        { 1: [2, 6], 12: [2, 6], 14: [2, 6], 22: [2, 6] },
                                        { 1: [2, 11], 12: [2, 11], 14: [2, 11], 22: [2, 11] },
                                        { 1: [2, 13], 12: [2, 13], 14: [2, 13], 22: [2, 13] },
                                        {
                                            15: [1, 29],
                                            17: [1, 30],
                                            18: [1, 33],
                                            23: 38,
                                            25: 27,
                                            26: 28,
                                            27: 32,
                                            29: 34,
                                            30: [1, 35],
                                            31: [1, 31],
                                            32: [1, 36],
                                            33: [1, 37],
                                        },
                                        { 24: [1, 39] },
                                        { 24: [2, 23] },
                                        { 24: [2, 24], 28: [1, 40] },
                                        { 24: [2, 30] },
                                        { 24: [2, 31] },
                                        { 24: [2, 32] },
                                        { 24: [2, 25], 28: [2, 25] },
                                        { 24: [2, 27], 28: [2, 27] },
                                        { 24: [2, 28], 28: [2, 28] },
                                        { 24: [2, 29], 28: [2, 29] },
                                        { 24: [2, 33], 28: [2, 33] },
                                        { 24: [2, 34], 28: [2, 34] },
                                        { 24: [1, 41] },
                                        { 1: [2, 21], 12: [2, 21], 14: [2, 21], 22: [2, 21] },
                                        {
                                            18: [1, 33],
                                            27: 42,
                                            29: 34,
                                            30: [1, 35],
                                            32: [1, 36],
                                            33: [1, 37],
                                        },
                                        { 1: [2, 22], 12: [2, 22], 14: [2, 22], 22: [2, 22] },
                                        { 24: [2, 26], 28: [2, 26] },
                                    ],
                                    defaultActions: {
                                        27: [2, 23],
                                        29: [2, 30],
                                        30: [2, 31],
                                        31: [2, 32],
                                    },
                                    parseError: function (a, b) {
                                        if (!b.recoverable) throw new Error(a);
                                        this.trace(a);
                                    },
                                    parse: function (a) {
                                        function b() {
                                            var a;
                                            return (
                                                (a = c.lexer.lex() || m),
                                                'number' != typeof a && (a = c.symbols_[a] || a),
                                                a
                                            );
                                        }
                                        var c = this,
                                            d = [0],
                                            e = [null],
                                            f = [],
                                            g = this.table,
                                            h = '',
                                            i = 0,
                                            j = 0,
                                            k = 0,
                                            l = 2,
                                            m = 1,
                                            n = f.slice.call(arguments, 1);
                                        this.lexer.setInput(a),
                                            (this.lexer.yy = this.yy),
                                            (this.yy.lexer = this.lexer),
                                            (this.yy.parser = this),
                                            void 0 === this.lexer.yylloc &&
                                                (this.lexer.yylloc = {});
                                        var o = this.lexer.yylloc;
                                        f.push(o);
                                        var p = this.lexer.options && this.lexer.options.ranges;
                                        'function' == typeof this.yy.parseError
                                            ? (this.parseError = this.yy.parseError)
                                            : (this.parseError =
                                                  Object.getPrototypeOf(this).parseError);
                                        for (var q, r, s, t, u, v, w, x, y, z = {}; ; ) {
                                            if (
                                                ((s = d[d.length - 1]),
                                                this.defaultActions[s]
                                                    ? (t = this.defaultActions[s])
                                                    : ((null !== q && void 0 !== q) || (q = b()),
                                                      (t = g[s] && g[s][q])),
                                                void 0 === t || !t.length || !t[0])
                                            ) {
                                                var A = '';
                                                y = [];
                                                for (v in g[s])
                                                    this.terminals_[v] &&
                                                        v > l &&
                                                        y.push("'" + this.terminals_[v] + "'");
                                                (A = this.lexer.showPosition
                                                    ? 'Parse error on line ' +
                                                      (i + 1) +
                                                      ':\n' +
                                                      this.lexer.showPosition() +
                                                      '\nExpecting ' +
                                                      y.join(', ') +
                                                      ", got '" +
                                                      (this.terminals_[q] || q) +
                                                      "'"
                                                    : 'Parse error on line ' +
                                                      (i + 1) +
                                                      ': Unexpected ' +
                                                      (q == m
                                                          ? 'end of input'
                                                          : "'" + (this.terminals_[q] || q) + "'")),
                                                    this.parseError(A, {
                                                        text: this.lexer.match,
                                                        token: this.terminals_[q] || q,
                                                        line: this.lexer.yylineno,
                                                        loc: o,
                                                        expected: y,
                                                    });
                                            }
                                            if (t[0] instanceof Array && t.length > 1)
                                                throw new Error(
                                                    'Parse Error: multiple actions possible at state: ' +
                                                        s +
                                                        ', token: ' +
                                                        q,
                                                );
                                            switch (t[0]) {
                                                case 1:
                                                    d.push(q),
                                                        e.push(this.lexer.yytext),
                                                        f.push(this.lexer.yylloc),
                                                        d.push(t[1]),
                                                        (q = null),
                                                        r
                                                            ? ((q = r), (r = null))
                                                            : ((j = this.lexer.yyleng),
                                                              (h = this.lexer.yytext),
                                                              (i = this.lexer.yylineno),
                                                              (o = this.lexer.yylloc),
                                                              k > 0 && k--);
                                                    break;
                                                case 2:
                                                    if (
                                                        ((w = this.productions_[t[1]][1]),
                                                        (z.$ = e[e.length - w]),
                                                        (z._$ = {
                                                            first_line:
                                                                f[f.length - (w || 1)].first_line,
                                                            last_line: f[f.length - 1].last_line,
                                                            first_column:
                                                                f[f.length - (w || 1)].first_column,
                                                            last_column:
                                                                f[f.length - 1].last_column,
                                                        }),
                                                        p &&
                                                            (z._$.range = [
                                                                f[f.length - (w || 1)].range[0],
                                                                f[f.length - 1].range[1],
                                                            ]),
                                                        void 0 !==
                                                            (u = this.performAction.apply(
                                                                z,
                                                                [
                                                                    h,
                                                                    j,
                                                                    i,
                                                                    this.yy,
                                                                    t[1],
                                                                    e,
                                                                    f,
                                                                ].concat(n),
                                                            )))
                                                    )
                                                        return u;
                                                    w &&
                                                        ((d = d.slice(0, -1 * w * 2)),
                                                        (e = e.slice(0, -1 * w)),
                                                        (f = f.slice(0, -1 * w))),
                                                        d.push(this.productions_[t[1]][0]),
                                                        e.push(z.$),
                                                        f.push(z._$),
                                                        (x = g[d[d.length - 2]][d[d.length - 1]]),
                                                        d.push(x);
                                                    break;
                                                case 3:
                                                    return !0;
                                            }
                                        }
                                        return !0;
                                    },
                                },
                                c = {
                                    initialize: function () {
                                        (this._nodes = []), (this._node = {}), (this._stash = []);
                                    },
                                    set: function (a) {
                                        for (var b in a) this._node[b] = a[b];
                                        return this._node;
                                    },
                                    node: function (a) {
                                        return arguments.length && (this._node = a), this._node;
                                    },
                                    push: function () {
                                        this._nodes.push(this._node), (this._node = {});
                                    },
                                    unshift: function () {
                                        this._nodes.unshift(this._node), (this._node = {});
                                    },
                                    yield: function () {
                                        var a = this._nodes;
                                        return this.initialize(), a;
                                    },
                                },
                                d = (function () {
                                    return {
                                        EOF: 1,
                                        parseError: function (a, b) {
                                            if (!this.yy.parser) throw new Error(a);
                                            this.yy.parser.parseError(a, b);
                                        },
                                        setInput: function (a) {
                                            return (
                                                (this._input = a),
                                                (this._more = this._backtrack = this.done = !1),
                                                (this.yylineno = this.yyleng = 0),
                                                (this.yytext = this.matched = this.match = ''),
                                                (this.conditionStack = ['INITIAL']),
                                                (this.yylloc = {
                                                    first_line: 1,
                                                    first_column: 0,
                                                    last_line: 1,
                                                    last_column: 0,
                                                }),
                                                this.options.ranges && (this.yylloc.range = [0, 0]),
                                                (this.offset = 0),
                                                this
                                            );
                                        },
                                        input: function () {
                                            var a = this._input[0];
                                            return (
                                                (this.yytext += a),
                                                this.yyleng++,
                                                this.offset++,
                                                (this.match += a),
                                                (this.matched += a),
                                                a.match(/(?:\r\n?|\n).*/g)
                                                    ? (this.yylineno++, this.yylloc.last_line++)
                                                    : this.yylloc.last_column++,
                                                this.options.ranges && this.yylloc.range[1]++,
                                                (this._input = this._input.slice(1)),
                                                a
                                            );
                                        },
                                        unput: function (a) {
                                            var b = a.length,
                                                c = a.split(/(?:\r\n?|\n)/g);
                                            (this._input = a + this._input),
                                                (this.yytext = this.yytext.substr(
                                                    0,
                                                    this.yytext.length - b - 1,
                                                )),
                                                (this.offset -= b);
                                            var d = this.match.split(/(?:\r\n?|\n)/g);
                                            (this.match = this.match.substr(
                                                0,
                                                this.match.length - 1,
                                            )),
                                                (this.matched = this.matched.substr(
                                                    0,
                                                    this.matched.length - 1,
                                                )),
                                                c.length - 1 && (this.yylineno -= c.length - 1);
                                            var e = this.yylloc.range;
                                            return (
                                                (this.yylloc = {
                                                    first_line: this.yylloc.first_line,
                                                    last_line: this.yylineno + 1,
                                                    first_column: this.yylloc.first_column,
                                                    last_column: c
                                                        ? (c.length === d.length
                                                              ? this.yylloc.first_column
                                                              : 0) +
                                                          d[d.length - c.length].length -
                                                          c[0].length
                                                        : this.yylloc.first_column - b,
                                                }),
                                                this.options.ranges &&
                                                    (this.yylloc.range = [
                                                        e[0],
                                                        e[0] + this.yyleng - b,
                                                    ]),
                                                (this.yyleng = this.yytext.length),
                                                this
                                            );
                                        },
                                        more: function () {
                                            return (this._more = !0), this;
                                        },
                                        reject: function () {
                                            return this.options.backtrack_lexer
                                                ? ((this._backtrack = !0), this)
                                                : this.parseError(
                                                      'Lexical error on line ' +
                                                          (this.yylineno + 1) +
                                                          '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' +
                                                          this.showPosition(),
                                                      {
                                                          text: '',
                                                          token: null,
                                                          line: this.yylineno,
                                                      },
                                                  );
                                        },
                                        less: function (a) {
                                            this.unput(this.match.slice(a));
                                        },
                                        pastInput: function () {
                                            var a = this.matched.substr(
                                                0,
                                                this.matched.length - this.match.length,
                                            );
                                            return (
                                                (a.length > 20 ? '...' : '') +
                                                a.substr(-20).replace(/\n/g, '')
                                            );
                                        },
                                        upcomingInput: function () {
                                            var a = this.match;
                                            return (
                                                a.length < 20 &&
                                                    (a += this._input.substr(0, 20 - a.length)),
                                                (
                                                    a.substr(0, 20) + (a.length > 20 ? '...' : '')
                                                ).replace(/\n/g, '')
                                            );
                                        },
                                        showPosition: function () {
                                            var a = this.pastInput(),
                                                b = new Array(a.length + 1).join('-');
                                            return a + this.upcomingInput() + '\n' + b + '^';
                                        },
                                        test_match: function (a, b) {
                                            var c, d, e;
                                            if (
                                                (this.options.backtrack_lexer &&
                                                    ((e = {
                                                        yylineno: this.yylineno,
                                                        yylloc: {
                                                            first_line: this.yylloc.first_line,
                                                            last_line: this.last_line,
                                                            first_column: this.yylloc.first_column,
                                                            last_column: this.yylloc.last_column,
                                                        },
                                                        yytext: this.yytext,
                                                        match: this.match,
                                                        matches: this.matches,
                                                        matched: this.matched,
                                                        yyleng: this.yyleng,
                                                        offset: this.offset,
                                                        _more: this._more,
                                                        _input: this._input,
                                                        yy: this.yy,
                                                        conditionStack:
                                                            this.conditionStack.slice(0),
                                                        done: this.done,
                                                    }),
                                                    this.options.ranges &&
                                                        (e.yylloc.range =
                                                            this.yylloc.range.slice(0))),
                                                (d = a[0].match(/(?:\r\n?|\n).*/g)),
                                                d && (this.yylineno += d.length),
                                                (this.yylloc = {
                                                    first_line: this.yylloc.last_line,
                                                    last_line: this.yylineno + 1,
                                                    first_column: this.yylloc.last_column,
                                                    last_column: d
                                                        ? d[d.length - 1].length -
                                                          d[d.length - 1].match(/\r?\n?/)[0].length
                                                        : this.yylloc.last_column + a[0].length,
                                                }),
                                                (this.yytext += a[0]),
                                                (this.match += a[0]),
                                                (this.matches = a),
                                                (this.yyleng = this.yytext.length),
                                                this.options.ranges &&
                                                    (this.yylloc.range = [
                                                        this.offset,
                                                        (this.offset += this.yyleng),
                                                    ]),
                                                (this._more = !1),
                                                (this._backtrack = !1),
                                                (this._input = this._input.slice(a[0].length)),
                                                (this.matched += a[0]),
                                                (c = this.performAction.call(
                                                    this,
                                                    this.yy,
                                                    this,
                                                    b,
                                                    this.conditionStack[
                                                        this.conditionStack.length - 1
                                                    ],
                                                )),
                                                this.done && this._input && (this.done = !1),
                                                c)
                                            )
                                                return c;
                                            if (this._backtrack) {
                                                for (var f in e) this[f] = e[f];
                                                return !1;
                                            }
                                            return !1;
                                        },
                                        next: function () {
                                            if (this.done) return this.EOF;
                                            this._input || (this.done = !0);
                                            var a, b, c, d;
                                            this._more || ((this.yytext = ''), (this.match = ''));
                                            for (
                                                var e = this._currentRules(), f = 0;
                                                f < e.length;
                                                f++
                                            )
                                                if (
                                                    (c = this._input.match(this.rules[e[f]])) &&
                                                    (!b || c[0].length > b[0].length)
                                                ) {
                                                    if (
                                                        ((b = c),
                                                        (d = f),
                                                        this.options.backtrack_lexer)
                                                    ) {
                                                        if (!1 !== (a = this.test_match(c, e[f])))
                                                            return a;
                                                        if (this._backtrack) {
                                                            b = !1;
                                                            continue;
                                                        }
                                                        return !1;
                                                    }
                                                    if (!this.options.flex) break;
                                                }
                                            return b
                                                ? !1 !== (a = this.test_match(b, e[d])) && a
                                                : '' === this._input
                                                ? this.EOF
                                                : this.parseError(
                                                      'Lexical error on line ' +
                                                          (this.yylineno + 1) +
                                                          '. Unrecognized text.\n' +
                                                          this.showPosition(),
                                                      {
                                                          text: '',
                                                          token: null,
                                                          line: this.yylineno,
                                                      },
                                                  );
                                        },
                                        lex: function () {
                                            var a = this.next();
                                            return a || this.lex();
                                        },
                                        begin: function (a) {
                                            this.conditionStack.push(a);
                                        },
                                        popState: function () {
                                            return this.conditionStack.length - 1 > 0
                                                ? this.conditionStack.pop()
                                                : this.conditionStack[0];
                                        },
                                        _currentRules: function () {
                                            return this.conditionStack.length &&
                                                this.conditionStack[this.conditionStack.length - 1]
                                                ? this.conditions[
                                                      this.conditionStack[
                                                          this.conditionStack.length - 1
                                                      ]
                                                  ].rules
                                                : this.conditions.INITIAL.rules;
                                        },
                                        topState: function (a) {
                                            return (
                                                (a =
                                                    this.conditionStack.length -
                                                    1 -
                                                    Math.abs(a || 0)),
                                                a >= 0 ? this.conditionStack[a] : 'INITIAL'
                                            );
                                        },
                                        pushState: function (a) {
                                            this.begin(a);
                                        },
                                        stateStackSize: function () {
                                            return this.conditionStack.length;
                                        },
                                        options: {},
                                        performAction: function (a, b, c, d) {
                                            switch (c) {
                                                case 0:
                                                    return 4;
                                                case 1:
                                                    return 14;
                                                case 2:
                                                    return 12;
                                                case 3:
                                                    return 15;
                                                case 4:
                                                    return 16;
                                                case 5:
                                                    return 22;
                                                case 6:
                                                    return 24;
                                                case 7:
                                                    return 28;
                                                case 8:
                                                    return 30;
                                                case 9:
                                                    return 18;
                                                case 10:
                                                    return (
                                                        (b.yytext = b.yytext.substr(
                                                            1,
                                                            b.yyleng - 2,
                                                        )),
                                                        32
                                                    );
                                                case 11:
                                                    return (
                                                        (b.yytext = b.yytext.substr(
                                                            1,
                                                            b.yyleng - 2,
                                                        )),
                                                        33
                                                    );
                                                case 12:
                                                    return 17;
                                                case 13:
                                                    return 31;
                                            }
                                        },
                                        rules: [
                                            /^(?:\$)/,
                                            /^(?:\.\.)/,
                                            /^(?:\.)/,
                                            /^(?:\*)/,
                                            /^(?:[a-zA-Z_]+[a-zA-Z0-9_]*)/,
                                            /^(?:\[)/,
                                            /^(?:\])/,
                                            /^(?:,)/,
                                            /^(?:((-?(?:0|[1-9][0-9]*)))?\:((-?(?:0|[1-9][0-9]*)))?(\:((-?(?:0|[1-9][0-9]*)))?)?)/,
                                            /^(?:(-?(?:0|[1-9][0-9]*)))/,
                                            /^(?:"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*")/,
                                            /^(?:'(?:\\['bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*')/,
                                            /^(?:\(.+?\)(?=\]))/,
                                            /^(?:\?\(.+?\)(?=\]))/,
                                        ],
                                        conditions: {
                                            INITIAL: {
                                                rules: [
                                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                                ],
                                                inclusive: !0,
                                            },
                                        },
                                    };
                                })();
                            return (b.lexer = d), (a.prototype = b), (b.Parser = a), new a();
                        })();
                        void 0 !== a &&
                            void 0 !== c &&
                            ((c.parser = e),
                            (c.Parser = e.Parser),
                            (c.parse = function () {
                                return e.parse.apply(e, arguments);
                            }),
                            (c.main = function (b) {
                                b[1] || (console.log('Usage: ' + b[0] + ' FILE'), d.exit(1));
                                var e = a('fs').readFileSync(a('path').normalize(b[1]), 'utf8');
                                return c.parser.parse(e);
                            }),
                            void 0 !== b && a.main === b && c.main(d.argv.slice(1)));
                    }).call(this, a('_process'));
                },
                { _process: 14, fs: 12, path: 13 },
            ],
            2: [
                function (a, b, c) {
                    b.exports = {
                        identifier: '[a-zA-Z_]+[a-zA-Z0-9_]*',
                        integer: '-?(?:0|[1-9][0-9]*)',
                        qq_string: '"(?:\\\\["bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^"\\\\])*"',
                        q_string: "'(?:\\\\['bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^'\\\\])*'",
                    };
                },
                {},
            ],
            3: [
                function (a, b, c) {
                    var d = a('./dict'),
                        e = a('fs'),
                        f = {
                            lex: {
                                macros: { esc: '\\\\', int: d.integer },
                                rules: [
                                    ['\\$', "return 'DOLLAR'"],
                                    ['\\.\\.', "return 'DOT_DOT'"],
                                    ['\\.', "return 'DOT'"],
                                    ['\\*', "return 'STAR'"],
                                    [d.identifier, "return 'IDENTIFIER'"],
                                    ['\\[', "return '['"],
                                    ['\\]', "return ']'"],
                                    [',', "return ','"],
                                    ['({int})?\\:({int})?(\\:({int})?)?', "return 'ARRAY_SLICE'"],
                                    ['{int}', "return 'INTEGER'"],
                                    [
                                        d.qq_string,
                                        "yytext = yytext.substr(1,yyleng-2); return 'QQ_STRING';",
                                    ],
                                    [
                                        d.q_string,
                                        "yytext = yytext.substr(1,yyleng-2); return 'Q_STRING';",
                                    ],
                                    ['\\(.+?\\)(?=\\])', "return 'SCRIPT_EXPRESSION'"],
                                    ['\\?\\(.+?\\)(?=\\])', "return 'FILTER_EXPRESSION'"],
                                ],
                            },
                            start: 'JSON_PATH',
                            bnf: {
                                JSON_PATH: [
                                    [
                                        'DOLLAR',
                                        'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()',
                                    ],
                                    [
                                        'DOLLAR PATH_COMPONENTS',
                                        'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()',
                                    ],
                                    [
                                        'LEADING_CHILD_MEMBER_EXPRESSION',
                                        'yy.ast.unshift(); return yy.ast.yield()',
                                    ],
                                    [
                                        'LEADING_CHILD_MEMBER_EXPRESSION PATH_COMPONENTS',
                                        'yy.ast.set({ operation: "member", scope: "child", expression: { type: "identifier", value: $1 }}); yy.ast.unshift(); return yy.ast.yield()',
                                    ],
                                ],
                                PATH_COMPONENTS: [
                                    ['PATH_COMPONENT', ''],
                                    ['PATH_COMPONENTS PATH_COMPONENT', ''],
                                ],
                                PATH_COMPONENT: [
                                    [
                                        'MEMBER_COMPONENT',
                                        'yy.ast.set({ operation: "member" }); yy.ast.push()',
                                    ],
                                    [
                                        'SUBSCRIPT_COMPONENT',
                                        'yy.ast.set({ operation: "subscript" }); yy.ast.push() ',
                                    ],
                                ],
                                MEMBER_COMPONENT: [
                                    ['CHILD_MEMBER_COMPONENT', 'yy.ast.set({ scope: "child" })'],
                                    [
                                        'DESCENDANT_MEMBER_COMPONENT',
                                        'yy.ast.set({ scope: "descendant" })',
                                    ],
                                ],
                                CHILD_MEMBER_COMPONENT: [['DOT MEMBER_EXPRESSION', '']],
                                LEADING_CHILD_MEMBER_EXPRESSION: [
                                    [
                                        'MEMBER_EXPRESSION',
                                        'yy.ast.set({ scope: "child", operation: "member" })',
                                    ],
                                ],
                                DESCENDANT_MEMBER_COMPONENT: [['DOT_DOT MEMBER_EXPRESSION', '']],
                                MEMBER_EXPRESSION: [
                                    [
                                        'STAR',
                                        'yy.ast.set({ expression: { type: "wildcard", value: $1 } })',
                                    ],
                                    [
                                        'IDENTIFIER',
                                        'yy.ast.set({ expression: { type: "identifier", value: $1 } })',
                                    ],
                                    [
                                        'SCRIPT_EXPRESSION',
                                        'yy.ast.set({ expression: { type: "script_expression", value: $1 } })',
                                    ],
                                    [
                                        'INTEGER',
                                        'yy.ast.set({ expression: { type: "numeric_literal", value: parseInt($1) } })',
                                    ],
                                    ['END', ''],
                                ],
                                SUBSCRIPT_COMPONENT: [
                                    ['CHILD_SUBSCRIPT_COMPONENT', 'yy.ast.set({ scope: "child" })'],
                                    [
                                        'DESCENDANT_SUBSCRIPT_COMPONENT',
                                        'yy.ast.set({ scope: "descendant" })',
                                    ],
                                ],
                                CHILD_SUBSCRIPT_COMPONENT: [['[ SUBSCRIPT ]', '']],
                                DESCENDANT_SUBSCRIPT_COMPONENT: [['DOT_DOT [ SUBSCRIPT ]', '']],
                                SUBSCRIPT: [
                                    ['SUBSCRIPT_EXPRESSION', ''],
                                    [
                                        'SUBSCRIPT_EXPRESSION_LIST',
                                        '$1.length > 1? yy.ast.set({ expression: { type: "union", value: $1 } }) : $$ = $1',
                                    ],
                                ],
                                SUBSCRIPT_EXPRESSION_LIST: [
                                    ['SUBSCRIPT_EXPRESSION_LISTABLE', '$$ = [$1]'],
                                    [
                                        'SUBSCRIPT_EXPRESSION_LIST , SUBSCRIPT_EXPRESSION_LISTABLE',
                                        '$$ = $1.concat($3)',
                                    ],
                                ],
                                SUBSCRIPT_EXPRESSION_LISTABLE: [
                                    [
                                        'INTEGER',
                                        '$$ = { expression: { type: "numeric_literal", value: parseInt($1) } }; yy.ast.set($$)',
                                    ],
                                    [
                                        'STRING_LITERAL',
                                        '$$ = { expression: { type: "string_literal", value: $1 } }; yy.ast.set($$)',
                                    ],
                                    [
                                        'ARRAY_SLICE',
                                        '$$ = { expression: { type: "slice", value: $1 } }; yy.ast.set($$)',
                                    ],
                                ],
                                SUBSCRIPT_EXPRESSION: [
                                    [
                                        'STAR',
                                        '$$ = { expression: { type: "wildcard", value: $1 } }; yy.ast.set($$)',
                                    ],
                                    [
                                        'SCRIPT_EXPRESSION',
                                        '$$ = { expression: { type: "script_expression", value: $1 } }; yy.ast.set($$)',
                                    ],
                                    [
                                        'FILTER_EXPRESSION',
                                        '$$ = { expression: { type: "filter_expression", value: $1 } }; yy.ast.set($$)',
                                    ],
                                ],
                                STRING_LITERAL: [
                                    ['QQ_STRING', '$$ = $1'],
                                    ['Q_STRING', '$$ = $1'],
                                ],
                            },
                        };
                    e.readFileSync &&
                        ((f.moduleInclude = e.readFileSync(a.resolve('../include/module.js'))),
                        (f.actionInclude = e.readFileSync(a.resolve('../include/action.js')))),
                        (b.exports = f);
                },
                { './dict': 2, fs: 12 },
            ],
            4: [
                function (a, b, c) {
                    function d(b, c, d) {
                        var e = a('./index'),
                            f = m.parse(c).body[0].expression,
                            g = j(f, { '@': b.value }),
                            h = d.replace(/\{\{\s*value\s*\}\}/g, g),
                            i = e.nodes(b.value, h);
                        return (
                            i.forEach(function (a) {
                                a.path = b.path.concat(a.path.slice(1));
                            }),
                            i
                        );
                    }
                    function e(a) {
                        return Array.isArray(a);
                    }
                    function f(a) {
                        return a && !(a instanceof Array) && a instanceof Object;
                    }
                    function g(a) {
                        return function (b, c, d, g) {
                            var h = b.value,
                                i = b.path,
                                j = [],
                                k = function (b, h) {
                                    e(b)
                                        ? (b.forEach(function (a, b) {
                                              j.length >= g ||
                                                  (d(b, a, c) &&
                                                      j.push({ path: h.concat(b), value: a }));
                                          }),
                                          b.forEach(function (b, c) {
                                              j.length >= g || (a && k(b, h.concat(c)));
                                          }))
                                        : f(b) &&
                                          (this.keys(b).forEach(function (a) {
                                              j.length >= g ||
                                                  (d(a, b[a], c) &&
                                                      j.push({ path: h.concat(a), value: b[a] }));
                                          }),
                                          this.keys(b).forEach(function (c) {
                                              j.length >= g || (a && k(b[c], h.concat(c)));
                                          }));
                                }.bind(this);
                            return k(h, i), j;
                        };
                    }
                    function h(a) {
                        return function (b, c, d) {
                            return this.descend(c, b.expression.value, a, d);
                        };
                    }
                    function i(a) {
                        return function (b, c, d) {
                            return this.traverse(c, b.expression.value, a, d);
                        };
                    }
                    function j() {
                        try {
                            return o.apply(this, arguments);
                        } catch (a) {}
                    }
                    function k(a) {
                        return (
                            (a = a.filter(function (a) {
                                return a;
                            })),
                            p(a, function (a) {
                                return a.path
                                    .map(function (a) {
                                        return String(a).replace('-', '--');
                                    })
                                    .join('-');
                            })
                        );
                    }
                    function l(a) {
                        var b = String(a);
                        return b.match(/^-?[0-9]+$/) ? parseInt(b) : null;
                    }
                    var m = a('./aesprim'),
                        n = a('./slice'),
                        o = a('static-eval'),
                        p = a('underscore').uniq,
                        q = function () {
                            return this.initialize.apply(this, arguments);
                        };
                    (q.prototype.initialize = function () {
                        (this.traverse = g(!0)), (this.descend = g());
                    }),
                        (q.prototype.keys = Object.keys),
                        (q.prototype.resolve = function (a) {
                            var b = [a.operation, a.scope, a.expression.type].join('-'),
                                c = this._fns[b];
                            if (!c) throw new Error("couldn't resolve key: " + b);
                            return c.bind(this);
                        }),
                        (q.prototype.register = function (a, b) {
                            if (!b instanceof Function)
                                throw new Error('handler must be a function');
                            this._fns[a] = b;
                        }),
                        (q.prototype._fns = {
                            'member-child-identifier': function (a, b) {
                                var c = a.expression.value,
                                    d = b.value;
                                if (d instanceof Object && c in d)
                                    return [{ value: d[c], path: b.path.concat(c) }];
                            },
                            'member-descendant-identifier': i(function (a, b, c) {
                                return a == c;
                            }),
                            'subscript-child-numeric_literal': h(function (a, b, c) {
                                return a === c;
                            }),
                            'member-child-numeric_literal': h(function (a, b, c) {
                                return String(a) === String(c);
                            }),
                            'subscript-descendant-numeric_literal': i(function (a, b, c) {
                                return a === c;
                            }),
                            'member-child-wildcard': h(function () {
                                return !0;
                            }),
                            'member-descendant-wildcard': i(function () {
                                return !0;
                            }),
                            'subscript-descendant-wildcard': i(function () {
                                return !0;
                            }),
                            'subscript-child-wildcard': h(function () {
                                return !0;
                            }),
                            'subscript-child-slice': function (a, b) {
                                if (e(b.value)) {
                                    var c = a.expression.value.split(':').map(l),
                                        d = b.value.map(function (a, c) {
                                            return { value: a, path: b.path.concat(c) };
                                        });
                                    return n.apply(null, [d].concat(c));
                                }
                            },
                            'subscript-child-union': function (a, b) {
                                var c = [];
                                return (
                                    a.expression.value.forEach(function (a) {
                                        var d = {
                                                operation: 'subscript',
                                                scope: 'child',
                                                expression: a.expression,
                                            },
                                            e = this.resolve(d),
                                            f = e(d, b);
                                        f && (c = c.concat(f));
                                    }, this),
                                    k(c)
                                );
                            },
                            'subscript-descendant-union': function (b, c, d) {
                                var e = a('..'),
                                    f = this,
                                    g = [];
                                return (
                                    e
                                        .nodes(c, '$..*')
                                        .slice(1)
                                        .forEach(function (a) {
                                            g.length >= d ||
                                                b.expression.value.forEach(function (b) {
                                                    var c = {
                                                            operation: 'subscript',
                                                            scope: 'child',
                                                            expression: b.expression,
                                                        },
                                                        d = f.resolve(c),
                                                        e = d(c, a);
                                                    g = g.concat(e);
                                                });
                                        }),
                                    k(g)
                                );
                            },
                            'subscript-child-filter_expression': function (a, b, c) {
                                var d = a.expression.value.slice(2, -1),
                                    e = m.parse(d).body[0].expression,
                                    f = function (a, b) {
                                        return j(e, { '@': b });
                                    };
                                return this.descend(b, null, f, c);
                            },
                            'subscript-descendant-filter_expression': function (a, b, c) {
                                var d = a.expression.value.slice(2, -1),
                                    e = m.parse(d).body[0].expression,
                                    f = function (a, b) {
                                        return j(e, { '@': b });
                                    };
                                return this.traverse(b, null, f, c);
                            },
                            'subscript-child-script_expression': function (a, b) {
                                return d(b, a.expression.value.slice(1, -1), '$[{{value}}]');
                            },
                            'member-child-script_expression': function (a, b) {
                                return d(b, a.expression.value.slice(1, -1), '$.{{value}}');
                            },
                            'member-descendant-script_expression': function (a, b) {
                                return d(b, a.expression.value.slice(1, -1), '$..value');
                            },
                        }),
                        (q.prototype._fns['subscript-child-string_literal'] =
                            q.prototype._fns['member-child-identifier']),
                        (q.prototype._fns['member-descendant-numeric_literal'] = q.prototype._fns[
                            'subscript-descendant-string_literal'
                        ] =
                            q.prototype._fns['member-descendant-identifier']),
                        (b.exports = q);
                },
                {
                    '..': 'jsonpath',
                    './aesprim': './aesprim',
                    './index': 5,
                    './slice': 7,
                    'static-eval': 15,
                    underscore: 12,
                },
            ],
            5: [
                function (a, b, c) {
                    function d(a) {
                        return '[object String]' == Object.prototype.toString.call(a);
                    }
                    var e = a('assert'),
                        f = a('./dict'),
                        g = a('./parser'),
                        h = a('./handlers'),
                        i = function () {
                            this.initialize.apply(this, arguments);
                        };
                    (i.prototype.initialize = function () {
                        (this.parser = new g()), (this.handlers = new h());
                    }),
                        (i.prototype.parse = function (a) {
                            return e.ok(d(a), 'we need a path'), this.parser.parse(a);
                        }),
                        (i.prototype.parent = function (a, b) {
                            e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(b, 'we need a path');
                            var c = this.nodes(a, b)[0];
                            c.path.pop();
                            return this.value(a, c.path);
                        }),
                        (i.prototype.apply = function (a, b, c) {
                            e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(b, 'we need a path'),
                                e.equal(typeof c, 'function', 'fn needs to be function');
                            var d = this.nodes(a, b).sort(function (a, b) {
                                return b.path.length - a.path.length;
                            });
                            return (
                                d.forEach(function (b) {
                                    var d = b.path.pop(),
                                        e = this.value(a, this.stringify(b.path)),
                                        f = (b.value = c.call(a, e[d]));
                                    e[d] = f;
                                }, this),
                                d
                            );
                        }),
                        (i.prototype.value = function (a, b, c) {
                            if (
                                (e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(b, 'we need a path'),
                                arguments.length >= 3)
                            ) {
                                var d = this.nodes(a, b).shift();
                                if (!d) return this._vivify(a, b, c);
                                var f = d.path.slice(-1).shift();
                                this.parent(a, this.stringify(d.path))[f] = c;
                            }
                            return this.query(a, this.stringify(b), 1).shift();
                        }),
                        (i.prototype._vivify = function (a, b, c) {
                            var d = this;
                            e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(b, 'we need a path');
                            var f = this.parser.parse(b).map(function (a) {
                                    return a.expression.value;
                                }),
                                g = function (b, c) {
                                    var e = b.pop(),
                                        f = d.value(a, b);
                                    f ||
                                        (g(b.concat(), 'string' == typeof e ? {} : []),
                                        (f = d.value(a, b))),
                                        (f[e] = c);
                                };
                            return g(f, c), this.query(a, b)[0];
                        }),
                        (i.prototype.query = function (a, b, c) {
                            return (
                                e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(d(b), 'we need a path'),
                                this.nodes(a, b, c).map(function (a) {
                                    return a.value;
                                })
                            );
                        }),
                        (i.prototype.paths = function (a, b, c) {
                            return (
                                e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(b, 'we need a path'),
                                this.nodes(a, b, c).map(function (a) {
                                    return a.path;
                                })
                            );
                        }),
                        (i.prototype.nodes = function (a, b, c) {
                            if (
                                (e.ok(a instanceof Object, 'obj needs to be an object'),
                                e.ok(b, 'we need a path'),
                                0 === c)
                            )
                                return [];
                            var d = this.parser.parse(b),
                                f = this.handlers,
                                g = [{ path: ['$'], value: a }],
                                h = [];
                            return (
                                d.length && 'root' == d[0].expression.type && d.shift(),
                                d.length
                                    ? (d.forEach(function (a, b) {
                                          if (!(h.length >= c)) {
                                              var e = f.resolve(a),
                                                  i = [];
                                              g.forEach(function (f) {
                                                  if (!(h.length >= c)) {
                                                      var g = e(a, f, c);
                                                      b == d.length - 1
                                                          ? (h = h.concat(g || []))
                                                          : (i = i.concat(g || []));
                                                  }
                                              }),
                                                  (g = i);
                                          }
                                      }),
                                      c ? h.slice(0, c) : h)
                                    : g
                            );
                        }),
                        (i.prototype.stringify = function (a) {
                            e.ok(a, 'we need a path');
                            var b = '$',
                                c = {
                                    'descendant-member': '..{{value}}',
                                    'child-member': '.{{value}}',
                                    'descendant-subscript': '..[{{value}}]',
                                    'child-subscript': '[{{value}}]',
                                };
                            return (
                                (a = this._normalize(a)),
                                a.forEach(function (a) {
                                    if ('root' != a.expression.type) {
                                        var d,
                                            e = [a.scope, a.operation].join('-'),
                                            f = c[e];
                                        if (
                                            ((d =
                                                'string_literal' == a.expression.type
                                                    ? JSON.stringify(a.expression.value)
                                                    : a.expression.value),
                                            !f)
                                        )
                                            throw new Error("couldn't find template " + e);
                                        b += f.replace(/{{value}}/, d);
                                    }
                                }),
                                b
                            );
                        }),
                        (i.prototype._normalize = function (a) {
                            if ((e.ok(a, 'we need a path'), 'string' == typeof a))
                                return this.parser.parse(a);
                            if (Array.isArray(a) && 'string' == typeof a[0]) {
                                var b = [{ expression: { type: 'root', value: '$' } }];
                                return (
                                    a.forEach(function (a, c) {
                                        if ('$' != a || 0 !== c)
                                            if (
                                                'string' == typeof a &&
                                                a.match('^' + f.identifier + '$')
                                            )
                                                b.push({
                                                    operation: 'member',
                                                    scope: 'child',
                                                    expression: { value: a, type: 'identifier' },
                                                });
                                            else {
                                                var d =
                                                    'number' == typeof a
                                                        ? 'numeric_literal'
                                                        : 'string_literal';
                                                b.push({
                                                    operation: 'subscript',
                                                    scope: 'child',
                                                    expression: { value: a, type: d },
                                                });
                                            }
                                    }),
                                    b
                                );
                            }
                            if (Array.isArray(a) && 'object' == typeof a[0]) return a;
                            throw new Error("couldn't understand path " + a);
                        }),
                        (i.Handlers = h),
                        (i.Parser = g);
                    var j = new i();
                    (j.JSONPath = i), (b.exports = j);
                },
                { './dict': 2, './handlers': 4, './parser': 6, assert: 8 },
            ],
            6: [
                function (a, b, c) {
                    var d = a('./grammar'),
                        e = a('../generated/parser'),
                        f = function () {
                            var a = new e.Parser(),
                                b = a.parseError;
                            return (
                                (a.yy.parseError = function () {
                                    a.yy.ast && a.yy.ast.initialize(), b.apply(a, arguments);
                                }),
                                a
                            );
                        };
                    (f.grammar = d), (b.exports = f);
                },
                { '../generated/parser': 1, './grammar': 3 },
            ],
            7: [
                function (a, b, c) {
                    function d(a) {
                        return String(a).match(/^[0-9]+$/)
                            ? parseInt(a)
                            : Number.isFinite(a)
                            ? parseInt(a, 10)
                            : 0;
                    }
                    b.exports = function (a, b, c, e) {
                        if ('string' == typeof b) throw new Error('start cannot be a string');
                        if ('string' == typeof c) throw new Error('end cannot be a string');
                        if ('string' == typeof e) throw new Error('step cannot be a string');
                        var f = a.length;
                        if (0 === e) throw new Error('step cannot be zero');
                        if (
                            ((e = e ? d(e) : 1),
                            (b = b < 0 ? f + b : b),
                            (c = c < 0 ? f + c : c),
                            (b = d(0 === b ? 0 : b || (e > 0 ? 0 : f - 1))),
                            (c = d(0 === c ? 0 : c || (e > 0 ? f : -1))),
                            (b = e > 0 ? Math.max(0, b) : Math.min(f, b)),
                            (c = e > 0 ? Math.min(c, f) : Math.max(-1, c)),
                            e > 0 && c <= b)
                        )
                            return [];
                        if (e < 0 && b <= c) return [];
                        for (
                            var g = [], h = b;
                            h != c && !((e < 0 && h <= c) || (e > 0 && h >= c));
                            h += e
                        )
                            g.push(a[h]);
                        return g;
                    };
                },
                {},
            ],
            8: [
                function (a, b, c) {
                    function d(a, b) {
                        return n.isUndefined(b)
                            ? '' + b
                            : n.isNumber(b) && !isFinite(b)
                            ? b.toString()
                            : n.isFunction(b) || n.isRegExp(b)
                            ? b.toString()
                            : b;
                    }
                    function e(a, b) {
                        return n.isString(a) ? (a.length < b ? a : a.slice(0, b)) : a;
                    }
                    function f(a) {
                        return (
                            e(JSON.stringify(a.actual, d), 128) +
                            ' ' +
                            a.operator +
                            ' ' +
                            e(JSON.stringify(a.expected, d), 128)
                        );
                    }
                    function g(a, b, c, d, e) {
                        throw new q.AssertionError({
                            message: c,
                            actual: a,
                            expected: b,
                            operator: d,
                            stackStartFunction: e,
                        });
                    }
                    function h(a, b) {
                        a || g(a, !0, b, '==', q.ok);
                    }
                    function i(a, b) {
                        if (a === b) return !0;
                        if (n.isBuffer(a) && n.isBuffer(b)) {
                            if (a.length != b.length) return !1;
                            for (var c = 0; c < a.length; c++) if (a[c] !== b[c]) return !1;
                            return !0;
                        }
                        return n.isDate(a) && n.isDate(b)
                            ? a.getTime() === b.getTime()
                            : n.isRegExp(a) && n.isRegExp(b)
                            ? a.source === b.source &&
                              a.global === b.global &&
                              a.multiline === b.multiline &&
                              a.lastIndex === b.lastIndex &&
                              a.ignoreCase === b.ignoreCase
                            : n.isObject(a) || n.isObject(b)
                            ? k(a, b)
                            : a == b;
                    }
                    function j(a) {
                        return '[object Arguments]' == Object.prototype.toString.call(a);
                    }
                    function k(a, b) {
                        if (n.isNullOrUndefined(a) || n.isNullOrUndefined(b)) return !1;
                        if (a.prototype !== b.prototype) return !1;
                        if (n.isPrimitive(a) || n.isPrimitive(b)) return a === b;
                        var c = j(a),
                            d = j(b);
                        if ((c && !d) || (!c && d)) return !1;
                        if (c) return (a = o.call(a)), (b = o.call(b)), i(a, b);
                        var e,
                            f,
                            g = r(a),
                            h = r(b);
                        if (g.length != h.length) return !1;
                        for (g.sort(), h.sort(), f = g.length - 1; f >= 0; f--)
                            if (g[f] != h[f]) return !1;
                        for (f = g.length - 1; f >= 0; f--)
                            if (((e = g[f]), !i(a[e], b[e]))) return !1;
                        return !0;
                    }
                    function l(a, b) {
                        return (
                            !(!a || !b) &&
                            ('[object RegExp]' == Object.prototype.toString.call(b)
                                ? b.test(a)
                                : a instanceof b || !0 === b.call({}, a))
                        );
                    }
                    function m(a, b, c, d) {
                        var e;
                        n.isString(c) && ((d = c), (c = null));
                        try {
                            b();
                        } catch (f) {
                            e = f;
                        }
                        if (
                            ((d = (c && c.name ? ' (' + c.name + ').' : '.') + (d ? ' ' + d : '.')),
                            a && !e && g(e, c, 'Missing expected exception' + d),
                            !a && l(e, c) && g(e, c, 'Got unwanted exception' + d),
                            (a && e && c && !l(e, c)) || (!a && e))
                        )
                            throw e;
                    }
                    var n = a('util/'),
                        o = Array.prototype.slice,
                        p = Object.prototype.hasOwnProperty,
                        q = (b.exports = h);
                    (q.AssertionError = function (a) {
                        (this.name = 'AssertionError'),
                            (this.actual = a.actual),
                            (this.expected = a.expected),
                            (this.operator = a.operator),
                            a.message
                                ? ((this.message = a.message), (this.generatedMessage = !1))
                                : ((this.message = f(this)), (this.generatedMessage = !0));
                        var b = a.stackStartFunction || g;
                        if (Error.captureStackTrace) Error.captureStackTrace(this, b);
                        else {
                            var c = new Error();
                            if (c.stack) {
                                var d = c.stack,
                                    e = b.name,
                                    h = d.indexOf('\n' + e);
                                if (h >= 0) {
                                    var i = d.indexOf('\n', h + 1);
                                    d = d.substring(i + 1);
                                }
                                this.stack = d;
                            }
                        }
                    }),
                        n.inherits(q.AssertionError, Error),
                        (q.fail = g),
                        (q.ok = h),
                        (q.equal = function (a, b, c) {
                            a != b && g(a, b, c, '==', q.equal);
                        }),
                        (q.notEqual = function (a, b, c) {
                            a == b && g(a, b, c, '!=', q.notEqual);
                        }),
                        (q.deepEqual = function (a, b, c) {
                            i(a, b) || g(a, b, c, 'deepEqual', q.deepEqual);
                        }),
                        (q.notDeepEqual = function (a, b, c) {
                            i(a, b) && g(a, b, c, 'notDeepEqual', q.notDeepEqual);
                        }),
                        (q.strictEqual = function (a, b, c) {
                            a !== b && g(a, b, c, '===', q.strictEqual);
                        }),
                        (q.notStrictEqual = function (a, b, c) {
                            a === b && g(a, b, c, '!==', q.notStrictEqual);
                        }),
                        (q.throws = function (a, b, c) {
                            m.apply(this, [!0].concat(o.call(arguments)));
                        }),
                        (q.doesNotThrow = function (a, b) {
                            m.apply(this, [!1].concat(o.call(arguments)));
                        }),
                        (q.ifError = function (a) {
                            if (a) throw a;
                        });
                    var r =
                        Object.keys ||
                        function (a) {
                            var b = [];
                            for (var c in a) p.call(a, c) && b.push(c);
                            return b;
                        };
                },
                { 'util/': 11 },
            ],
            9: [
                function (a, b, c) {
                    'function' == typeof Object.create
                        ? (b.exports = function (a, b) {
                              (a.super_ = b),
                                  (a.prototype = Object.create(b.prototype, {
                                      constructor: {
                                          value: a,
                                          enumerable: !1,
                                          writable: !0,
                                          configurable: !0,
                                      },
                                  }));
                          })
                        : (b.exports = function (a, b) {
                              a.super_ = b;
                              var c = function () {};
                              (c.prototype = b.prototype),
                                  (a.prototype = new c()),
                                  (a.prototype.constructor = a);
                          });
                },
                {},
            ],
            10: [
                function (a, b, c) {
                    b.exports = function (a) {
                        return (
                            a &&
                            'object' == typeof a &&
                            'function' == typeof a.copy &&
                            'function' == typeof a.fill &&
                            'function' == typeof a.readUInt8
                        );
                    };
                },
                {},
            ],
            11: [
                function (a, b, c) {
                    (function (b, d) {
                        function e(a, b) {
                            var d = { seen: [], stylize: g };
                            return (
                                arguments.length >= 3 && (d.depth = arguments[2]),
                                arguments.length >= 4 && (d.colors = arguments[3]),
                                p(b) ? (d.showHidden = b) : b && c._extend(d, b),
                                v(d.showHidden) && (d.showHidden = !1),
                                v(d.depth) && (d.depth = 2),
                                v(d.colors) && (d.colors = !1),
                                v(d.customInspect) && (d.customInspect = !0),
                                d.colors && (d.stylize = f),
                                i(d, a, d.depth)
                            );
                        }
                        function f(a, b) {
                            var c = e.styles[b];
                            return c
                                ? '[' + e.colors[c][0] + 'm' + a + '[' + e.colors[c][1] + 'm'
                                : a;
                        }
                        function g(a, b) {
                            return a;
                        }
                        function h(a) {
                            var b = {};
                            return (
                                a.forEach(function (a, c) {
                                    b[a] = !0;
                                }),
                                b
                            );
                        }
                        function i(a, b, d) {
                            if (
                                a.customInspect &&
                                b &&
                                A(b.inspect) &&
                                b.inspect !== c.inspect &&
                                (!b.constructor || b.constructor.prototype !== b)
                            ) {
                                var e = b.inspect(d, a);
                                return t(e) || (e = i(a, e, d)), e;
                            }
                            var f = j(a, b);
                            if (f) return f;
                            var g = Object.keys(b),
                                p = h(g);
                            if (
                                (a.showHidden && (g = Object.getOwnPropertyNames(b)),
                                z(b) &&
                                    (g.indexOf('message') >= 0 || g.indexOf('description') >= 0))
                            )
                                return k(b);
                            if (0 === g.length) {
                                if (A(b)) {
                                    var q = b.name ? ': ' + b.name : '';
                                    return a.stylize('[Function' + q + ']', 'special');
                                }
                                if (w(b))
                                    return a.stylize(RegExp.prototype.toString.call(b), 'regexp');
                                if (y(b)) return a.stylize(Date.prototype.toString.call(b), 'date');
                                if (z(b)) return k(b);
                            }
                            var r = '',
                                s = !1,
                                u = ['{', '}'];
                            if ((o(b) && ((s = !0), (u = ['[', ']'])), A(b))) {
                                r = ' [Function' + (b.name ? ': ' + b.name : '') + ']';
                            }
                            if (
                                (w(b) && (r = ' ' + RegExp.prototype.toString.call(b)),
                                y(b) && (r = ' ' + Date.prototype.toUTCString.call(b)),
                                z(b) && (r = ' ' + k(b)),
                                0 === g.length && (!s || 0 == b.length))
                            )
                                return u[0] + r + u[1];
                            if (d < 0)
                                return w(b)
                                    ? a.stylize(RegExp.prototype.toString.call(b), 'regexp')
                                    : a.stylize('[Object]', 'special');
                            a.seen.push(b);
                            var v;
                            return (
                                (v = s
                                    ? l(a, b, d, p, g)
                                    : g.map(function (c) {
                                          return m(a, b, d, p, c, s);
                                      })),
                                a.seen.pop(),
                                n(v, r, u)
                            );
                        }
                        function j(a, b) {
                            if (v(b)) return a.stylize('undefined', 'undefined');
                            if (t(b)) {
                                var c =
                                    "'" +
                                    JSON.stringify(b)
                                        .replace(/^"|"$/g, '')
                                        .replace(/'/g, "\\'")
                                        .replace(/\\"/g, '"') +
                                    "'";
                                return a.stylize(c, 'string');
                            }
                            return s(b)
                                ? a.stylize('' + b, 'number')
                                : p(b)
                                ? a.stylize('' + b, 'boolean')
                                : q(b)
                                ? a.stylize('null', 'null')
                                : void 0;
                        }
                        function k(a) {
                            return '[' + Error.prototype.toString.call(a) + ']';
                        }
                        function l(a, b, c, d, e) {
                            for (var f = [], g = 0, h = b.length; g < h; ++g)
                                F(b, String(g)) ? f.push(m(a, b, c, d, String(g), !0)) : f.push('');
                            return (
                                e.forEach(function (e) {
                                    e.match(/^\d+$/) || f.push(m(a, b, c, d, e, !0));
                                }),
                                f
                            );
                        }
                        function m(a, b, c, d, e, f) {
                            var g, h, j;
                            if (
                                ((j = Object.getOwnPropertyDescriptor(b, e) || { value: b[e] }),
                                j.get
                                    ? (h = j.set
                                          ? a.stylize('[Getter/Setter]', 'special')
                                          : a.stylize('[Getter]', 'special'))
                                    : j.set && (h = a.stylize('[Setter]', 'special')),
                                F(d, e) || (g = '[' + e + ']'),
                                h ||
                                    (a.seen.indexOf(j.value) < 0
                                        ? ((h = q(c) ? i(a, j.value, null) : i(a, j.value, c - 1)),
                                          h.indexOf('\n') > -1 &&
                                              (h = f
                                                  ? h
                                                        .split('\n')
                                                        .map(function (a) {
                                                            return '  ' + a;
                                                        })
                                                        .join('\n')
                                                        .substr(2)
                                                  : '\n' +
                                                    h
                                                        .split('\n')
                                                        .map(function (a) {
                                                            return '   ' + a;
                                                        })
                                                        .join('\n')))
                                        : (h = a.stylize('[Circular]', 'special'))),
                                v(g))
                            ) {
                                if (f && e.match(/^\d+$/)) return h;
                                (g = JSON.stringify('' + e)),
                                    g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
                                        ? ((g = g.substr(1, g.length - 2)),
                                          (g = a.stylize(g, 'name')))
                                        : ((g = g
                                              .replace(/'/g, "\\'")
                                              .replace(/\\"/g, '"')
                                              .replace(/(^"|"$)/g, "'")),
                                          (g = a.stylize(g, 'string')));
                            }
                            return g + ': ' + h;
                        }
                        function n(a, b, c) {
                            var d = 0;
                            return a.reduce(function (a, b) {
                                return (
                                    d++,
                                    b.indexOf('\n') >= 0 && d++,
                                    a + b.replace(/\u001b\[\d\d?m/g, '').length + 1
                                );
                            }, 0) > 60
                                ? c[0] +
                                      ('' === b ? '' : b + '\n ') +
                                      ' ' +
                                      a.join(',\n  ') +
                                      ' ' +
                                      c[1]
                                : c[0] + b + ' ' + a.join(', ') + ' ' + c[1];
                        }
                        function o(a) {
                            return Array.isArray(a);
                        }
                        function p(a) {
                            return 'boolean' == typeof a;
                        }
                        function q(a) {
                            return null === a;
                        }
                        function r(a) {
                            return null == a;
                        }
                        function s(a) {
                            return 'number' == typeof a;
                        }
                        function t(a) {
                            return 'string' == typeof a;
                        }
                        function u(a) {
                            return 'symbol' == typeof a;
                        }
                        function v(a) {
                            return void 0 === a;
                        }
                        function w(a) {
                            return x(a) && '[object RegExp]' === C(a);
                        }
                        function x(a) {
                            return 'object' == typeof a && null !== a;
                        }
                        function y(a) {
                            return x(a) && '[object Date]' === C(a);
                        }
                        function z(a) {
                            return x(a) && ('[object Error]' === C(a) || a instanceof Error);
                        }
                        function A(a) {
                            return 'function' == typeof a;
                        }
                        function B(a) {
                            return (
                                null === a ||
                                'boolean' == typeof a ||
                                'number' == typeof a ||
                                'string' == typeof a ||
                                'symbol' == typeof a ||
                                void 0 === a
                            );
                        }
                        function C(a) {
                            return Object.prototype.toString.call(a);
                        }
                        function D(a) {
                            return a < 10 ? '0' + a.toString(10) : a.toString(10);
                        }
                        function E() {
                            var a = new Date(),
                                b = [D(a.getHours()), D(a.getMinutes()), D(a.getSeconds())].join(
                                    ':',
                                );
                            return [a.getDate(), J[a.getMonth()], b].join(' ');
                        }
                        function F(a, b) {
                            return Object.prototype.hasOwnProperty.call(a, b);
                        }
                        var G = /%[sdj%]/g;
                        (c.format = function (a) {
                            if (!t(a)) {
                                for (var b = [], c = 0; c < arguments.length; c++)
                                    b.push(e(arguments[c]));
                                return b.join(' ');
                            }
                            for (
                                var c = 1,
                                    d = arguments,
                                    f = d.length,
                                    g = String(a).replace(G, function (a) {
                                        if ('%%' === a) return '%';
                                        if (c >= f) return a;
                                        switch (a) {
                                            case '%s':
                                                return String(d[c++]);
                                            case '%d':
                                                return Number(d[c++]);
                                            case '%j':
                                                try {
                                                    return JSON.stringify(d[c++]);
                                                } catch (b) {
                                                    return '[Circular]';
                                                }
                                            default:
                                                return a;
                                        }
                                    }),
                                    h = d[c];
                                c < f;
                                h = d[++c]
                            )
                                q(h) || !x(h) ? (g += ' ' + h) : (g += ' ' + e(h));
                            return g;
                        }),
                            (c.deprecate = function (a, e) {
                                function f() {
                                    if (!g) {
                                        if (b.throwDeprecation) throw new Error(e);
                                        b.traceDeprecation ? console.trace(e) : console.error(e),
                                            (g = !0);
                                    }
                                    return a.apply(this, arguments);
                                }
                                if (v(d.process))
                                    return function () {
                                        return c.deprecate(a, e).apply(this, arguments);
                                    };
                                if (!0 === b.noDeprecation) return a;
                                var g = !1;
                                return f;
                            });
                        var H,
                            I = {};
                        (c.debuglog = function (a) {
                            if (
                                (v(H) && (H = b.env.NODE_DEBUG || ''), (a = a.toUpperCase()), !I[a])
                            )
                                if (new RegExp('\\b' + a + '\\b', 'i').test(H)) {
                                    var d = b.pid;
                                    I[a] = function () {
                                        var b = c.format.apply(c, arguments);
                                        console.error('%s %d: %s', a, d, b);
                                    };
                                } else I[a] = function () {};
                            return I[a];
                        }),
                            (c.inspect = e),
                            (e.colors = {
                                bold: [1, 22],
                                italic: [3, 23],
                                underline: [4, 24],
                                inverse: [7, 27],
                                white: [37, 39],
                                grey: [90, 39],
                                black: [30, 39],
                                blue: [34, 39],
                                cyan: [36, 39],
                                green: [32, 39],
                                magenta: [35, 39],
                                red: [31, 39],
                                yellow: [33, 39],
                            }),
                            (e.styles = {
                                special: 'cyan',
                                number: 'yellow',
                                boolean: 'yellow',
                                undefined: 'grey',
                                null: 'bold',
                                string: 'green',
                                date: 'magenta',
                                regexp: 'red',
                            }),
                            (c.isArray = o),
                            (c.isBoolean = p),
                            (c.isNull = q),
                            (c.isNullOrUndefined = r),
                            (c.isNumber = s),
                            (c.isString = t),
                            (c.isSymbol = u),
                            (c.isUndefined = v),
                            (c.isRegExp = w),
                            (c.isObject = x),
                            (c.isDate = y),
                            (c.isError = z),
                            (c.isFunction = A),
                            (c.isPrimitive = B),
                            (c.isBuffer = a('./support/isBuffer'));
                        var J = [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                        ];
                        (c.log = function () {
                            console.log('%s - %s', E(), c.format.apply(c, arguments));
                        }),
                            (c.inherits = a('inherits')),
                            (c._extend = function (a, b) {
                                if (!b || !x(b)) return a;
                                for (var c = Object.keys(b), d = c.length; d--; ) a[c[d]] = b[c[d]];
                                return a;
                            });
                    }).call(
                        this,
                        a('_process'),
                        'undefined' != typeof global
                            ? global
                            : 'undefined' != typeof self
                            ? self
                            : 'undefined' != typeof window
                            ? window
                            : {},
                    );
                },
                { './support/isBuffer': 10, _process: 14, inherits: 9 },
            ],
            12: [function (a, b, c) {}, {}],
            13: [
                function (a, b, c) {
                    (function (a) {
                        function b(a, b) {
                            for (var c = 0, d = a.length - 1; d >= 0; d--) {
                                var e = a[d];
                                '.' === e
                                    ? a.splice(d, 1)
                                    : '..' === e
                                    ? (a.splice(d, 1), c++)
                                    : c && (a.splice(d, 1), c--);
                            }
                            if (b) for (; c--; c) a.unshift('..');
                            return a;
                        }
                        function d(a) {
                            'string' != typeof a && (a += '');
                            var b,
                                c = 0,
                                d = -1,
                                e = !0;
                            for (b = a.length - 1; b >= 0; --b)
                                if (47 === a.charCodeAt(b)) {
                                    if (!e) {
                                        c = b + 1;
                                        break;
                                    }
                                } else -1 === d && ((e = !1), (d = b + 1));
                            return -1 === d ? '' : a.slice(c, d);
                        }
                        function e(a, b) {
                            if (a.filter) return a.filter(b);
                            for (var c = [], d = 0; d < a.length; d++)
                                b(a[d], d, a) && c.push(a[d]);
                            return c;
                        }
                        (c.resolve = function () {
                            for (var c = '', d = !1, f = arguments.length - 1; f >= -1 && !d; f--) {
                                var g = f >= 0 ? arguments[f] : a.cwd();
                                if ('string' != typeof g)
                                    throw new TypeError(
                                        'Arguments to path.resolve must be strings',
                                    );
                                g && ((c = g + '/' + c), (d = '/' === g.charAt(0)));
                            }
                            return (
                                (c = b(
                                    e(c.split('/'), function (a) {
                                        return !!a;
                                    }),
                                    !d,
                                ).join('/')),
                                (d ? '/' : '') + c || '.'
                            );
                        }),
                            (c.normalize = function (a) {
                                var d = c.isAbsolute(a),
                                    g = '/' === f(a, -1);
                                return (
                                    (a = b(
                                        e(a.split('/'), function (a) {
                                            return !!a;
                                        }),
                                        !d,
                                    ).join('/')),
                                    a || d || (a = '.'),
                                    a && g && (a += '/'),
                                    (d ? '/' : '') + a
                                );
                            }),
                            (c.isAbsolute = function (a) {
                                return '/' === a.charAt(0);
                            }),
                            (c.join = function () {
                                var a = Array.prototype.slice.call(arguments, 0);
                                return c.normalize(
                                    e(a, function (a, b) {
                                        if ('string' != typeof a)
                                            throw new TypeError(
                                                'Arguments to path.join must be strings',
                                            );
                                        return a;
                                    }).join('/'),
                                );
                            }),
                            (c.relative = function (a, b) {
                                function d(a) {
                                    for (var b = 0; b < a.length && '' === a[b]; b++);
                                    for (var c = a.length - 1; c >= 0 && '' === a[c]; c--);
                                    return b > c ? [] : a.slice(b, c - b + 1);
                                }
                                (a = c.resolve(a).substr(1)), (b = c.resolve(b).substr(1));
                                for (
                                    var e = d(a.split('/')),
                                        f = d(b.split('/')),
                                        g = Math.min(e.length, f.length),
                                        h = g,
                                        i = 0;
                                    i < g;
                                    i++
                                )
                                    if (e[i] !== f[i]) {
                                        h = i;
                                        break;
                                    }
                                for (var j = [], i = h; i < e.length; i++) j.push('..');
                                return (j = j.concat(f.slice(h))), j.join('/');
                            }),
                            (c.sep = '/'),
                            (c.delimiter = ':'),
                            (c.dirname = function (a) {
                                if (('string' != typeof a && (a += ''), 0 === a.length)) return '.';
                                for (
                                    var b = a.charCodeAt(0),
                                        c = 47 === b,
                                        d = -1,
                                        e = !0,
                                        f = a.length - 1;
                                    f >= 1;
                                    --f
                                )
                                    if (47 === (b = a.charCodeAt(f))) {
                                        if (!e) {
                                            d = f;
                                            break;
                                        }
                                    } else e = !1;
                                return -1 === d
                                    ? c
                                        ? '/'
                                        : '.'
                                    : c && 1 === d
                                    ? '/'
                                    : a.slice(0, d);
                            }),
                            (c.basename = function (a, b) {
                                var c = d(a);
                                return (
                                    b &&
                                        c.substr(-1 * b.length) === b &&
                                        (c = c.substr(0, c.length - b.length)),
                                    c
                                );
                            }),
                            (c.extname = function (a) {
                                'string' != typeof a && (a += '');
                                for (
                                    var b = -1, c = 0, d = -1, e = !0, f = 0, g = a.length - 1;
                                    g >= 0;
                                    --g
                                ) {
                                    var h = a.charCodeAt(g);
                                    if (47 !== h)
                                        -1 === d && ((e = !1), (d = g + 1)),
                                            46 === h
                                                ? -1 === b
                                                    ? (b = g)
                                                    : 1 !== f && (f = 1)
                                                : -1 !== b && (f = -1);
                                    else if (!e) {
                                        c = g + 1;
                                        break;
                                    }
                                }
                                return -1 === b ||
                                    -1 === d ||
                                    0 === f ||
                                    (1 === f && b === d - 1 && b === c + 1)
                                    ? ''
                                    : a.slice(b, d);
                            });
                        var f =
                            'b' === 'ab'.substr(-1)
                                ? function (a, b, c) {
                                      return a.substr(b, c);
                                  }
                                : function (a, b, c) {
                                      return b < 0 && (b = a.length + b), a.substr(b, c);
                                  };
                    }).call(this, a('_process'));
                },
                { _process: 14 },
            ],
            14: [
                function (a, b, c) {
                    function d() {
                        throw new Error('setTimeout has not been defined');
                    }
                    function e() {
                        throw new Error('clearTimeout has not been defined');
                    }
                    function f(a) {
                        if (l === setTimeout) return setTimeout(a, 0);
                        if ((l === d || !l) && setTimeout)
                            return (l = setTimeout), setTimeout(a, 0);
                        try {
                            return l(a, 0);
                        } catch (b) {
                            try {
                                return l.call(null, a, 0);
                            } catch (b) {
                                return l.call(this, a, 0);
                            }
                        }
                    }
                    function g(a) {
                        if (m === clearTimeout) return clearTimeout(a);
                        if ((m === e || !m) && clearTimeout)
                            return (m = clearTimeout), clearTimeout(a);
                        try {
                            return m(a);
                        } catch (b) {
                            try {
                                return m.call(null, a);
                            } catch (b) {
                                return m.call(this, a);
                            }
                        }
                    }
                    function h() {
                        q &&
                            o &&
                            ((q = !1), o.length ? (p = o.concat(p)) : (r = -1), p.length && i());
                    }
                    function i() {
                        if (!q) {
                            var a = f(h);
                            q = !0;
                            for (var b = p.length; b; ) {
                                for (o = p, p = []; ++r < b; ) o && o[r].run();
                                (r = -1), (b = p.length);
                            }
                            (o = null), (q = !1), g(a);
                        }
                    }
                    function j(a, b) {
                        (this.fun = a), (this.array = b);
                    }
                    function k() {}
                    var l,
                        m,
                        n = (b.exports = {});
                    !(function () {
                        try {
                            l = 'function' == typeof setTimeout ? setTimeout : d;
                        } catch (a) {
                            l = d;
                        }
                        try {
                            m = 'function' == typeof clearTimeout ? clearTimeout : e;
                        } catch (a) {
                            m = e;
                        }
                    })();
                    var o,
                        p = [],
                        q = !1,
                        r = -1;
                    (n.nextTick = function (a) {
                        var b = new Array(arguments.length - 1);
                        if (arguments.length > 1)
                            for (var c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
                        p.push(new j(a, b)), 1 !== p.length || q || f(i);
                    }),
                        (j.prototype.run = function () {
                            this.fun.apply(null, this.array);
                        }),
                        (n.title = 'browser'),
                        (n.browser = !0),
                        (n.env = {}),
                        (n.argv = []),
                        (n.version = ''),
                        (n.versions = {}),
                        (n.on = k),
                        (n.addListener = k),
                        (n.once = k),
                        (n.off = k),
                        (n.removeListener = k),
                        (n.removeAllListeners = k),
                        (n.emit = k),
                        (n.prependListener = k),
                        (n.prependOnceListener = k),
                        (n.listeners = function (a) {
                            return [];
                        }),
                        (n.binding = function (a) {
                            throw new Error('process.binding is not supported');
                        }),
                        (n.cwd = function () {
                            return '/';
                        }),
                        (n.chdir = function (a) {
                            throw new Error('process.chdir is not supported');
                        }),
                        (n.umask = function () {
                            return 0;
                        });
                },
                {},
            ],
            15: [
                function (a, b, c) {
                    var d = a('escodegen').generate;
                    b.exports = function (a, b) {
                        b || (b = {});
                        var c = {},
                            e = (function a(e, f) {
                                if ('Literal' === e.type) return e.value;
                                if ('UnaryExpression' === e.type) {
                                    var g = a(e.argument);
                                    return '+' === e.operator
                                        ? +g
                                        : '-' === e.operator
                                        ? -g
                                        : '~' === e.operator
                                        ? ~g
                                        : '!' === e.operator
                                        ? !g
                                        : c;
                                }
                                if ('ArrayExpression' === e.type) {
                                    for (var h = [], i = 0, j = e.elements.length; i < j; i++) {
                                        var k = a(e.elements[i]);
                                        if (k === c) return c;
                                        h.push(k);
                                    }
                                    return h;
                                }
                                if ('ObjectExpression' === e.type) {
                                    for (var l = {}, i = 0; i < e.properties.length; i++) {
                                        var m = e.properties[i],
                                            n = null === m.value ? m.value : a(m.value);
                                        if (n === c) return c;
                                        l[m.key.value || m.key.name] = n;
                                    }
                                    return l;
                                }
                                if (
                                    'BinaryExpression' === e.type ||
                                    'LogicalExpression' === e.type
                                ) {
                                    var j = a(e.left);
                                    if (j === c) return c;
                                    var o = a(e.right);
                                    if (o === c) return c;
                                    var p = e.operator;
                                    return '==' === p
                                        ? j == o
                                        : '===' === p
                                        ? j === o
                                        : '!=' === p
                                        ? j != o
                                        : '!==' === p
                                        ? j !== o
                                        : '+' === p
                                        ? j + o
                                        : '-' === p
                                        ? j - o
                                        : '*' === p
                                        ? j * o
                                        : '/' === p
                                        ? j / o
                                        : '%' === p
                                        ? j % o
                                        : '<' === p
                                        ? j < o
                                        : '<=' === p
                                        ? j <= o
                                        : '>' === p
                                        ? j > o
                                        : '>=' === p
                                        ? j >= o
                                        : '|' === p
                                        ? j | o
                                        : '&' === p
                                        ? j & o
                                        : '^' === p
                                        ? j ^ o
                                        : '&&' === p
                                        ? j && o
                                        : '||' === p
                                        ? j || o
                                        : c;
                                }
                                if ('Identifier' === e.type)
                                    return {}.hasOwnProperty.call(b, e.name) ? b[e.name] : c;
                                if ('ThisExpression' === e.type)
                                    return {}.hasOwnProperty.call(b, 'this') ? b.this : c;
                                if ('CallExpression' === e.type) {
                                    var q = a(e.callee);
                                    if (q === c) return c;
                                    if ('function' != typeof q) return c;
                                    var r = e.callee.object ? a(e.callee.object) : c;
                                    r === c && (r = null);
                                    for (var s = [], i = 0, j = e.arguments.length; i < j; i++) {
                                        var k = a(e.arguments[i]);
                                        if (k === c) return c;
                                        s.push(k);
                                    }
                                    return q.apply(r, s);
                                }
                                if ('MemberExpression' === e.type) {
                                    var l = a(e.object);
                                    if (l === c || 'function' == typeof l) return c;
                                    if ('Identifier' === e.property.type) return l[e.property.name];
                                    var m = a(e.property);
                                    return m === c ? c : l[m];
                                }
                                if ('ConditionalExpression' === e.type) {
                                    var g = a(e.test);
                                    return g === c ? c : a(g ? e.consequent : e.alternate);
                                }
                                if ('ExpressionStatement' === e.type) {
                                    var g = a(e.expression);
                                    return g === c ? c : g;
                                }
                                if ('ReturnStatement' === e.type) return a(e.argument);
                                if ('FunctionExpression' === e.type) {
                                    var t = e.body.body,
                                        u = {};
                                    Object.keys(b).forEach(function (a) {
                                        u[a] = b[a];
                                    });
                                    for (var i = 0; i < e.params.length; i++) {
                                        var v = e.params[i];
                                        if ('Identifier' != v.type) return c;
                                        b[v.name] = null;
                                    }
                                    for (var i in t) if (a(t[i]) === c) return c;
                                    b = u;
                                    var w = Object.keys(b),
                                        x = w.map(function (a) {
                                            return b[a];
                                        });
                                    return Function(w.join(', '), 'return ' + d(e)).apply(null, x);
                                }
                                if ('TemplateLiteral' === e.type) {
                                    for (var y = '', i = 0; i < e.expressions.length; i++)
                                        (y += a(e.quasis[i])), (y += a(e.expressions[i]));
                                    return (y += a(e.quasis[i]));
                                }
                                if ('TaggedTemplateExpression' === e.type) {
                                    var z = a(e.tag),
                                        A = e.quasi,
                                        B = A.quasis.map(a),
                                        C = A.expressions.map(a);
                                    return z.apply(null, [B].concat(C));
                                }
                                return 'TemplateElement' === e.type ? e.value.cooked : c;
                            })(a);
                        return e === c ? void 0 : e;
                    };
                },
                { escodegen: 12 },
            ],
            jsonpath: [
                function (a, b, c) {
                    b.exports = a('./lib/index');
                },
                { './lib/index': 5 },
            ],
        },
        {},
        ['jsonpath'],
    )('jsonpath');
});
//# sourceMappingURL=jsonpath.min.js.map
