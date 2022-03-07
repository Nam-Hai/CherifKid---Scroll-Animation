let N = {};
/** Interpolation Lineaire */
N.Lerp = function (xi, xf, t) {
    return (1 - t) * xi + t * xf
};

/** Fonction inverse de Lerp */
N.iLerp = function (x, xi, xf) {
    return (x - xi) / (xf - xi)
}

N.Clamp = function (x, min, max) {
    return Math.max(Math.min(x, max), min)
}
/** R-maps a number from one range to another */
N.map = function (x, start1, end1, start2, end2) {
    return N.Lerp(start2, end2, N.iLerp(x, start1, end1))
}

N.get = function (context, by, tag) {
    const e = context || document;
    return e["getElement" + by](tag)
}
N.Get = {
    id: (tag, context) => N.get(context, "ById", tag),
    class: (tag, context) => N.get(context, "sByClassName", tag),
    tag: (tag, context) => N.get(context, 'sByTagName', tag)
}

/** Return l'index de l'element */
N.index = function (el, list) {
    let n = list.length;
    for (let i = 0; i < N; i++)
        if (list[i] === el) return i
    return -1
}

N.Index = {
    /** L'indice de l'element par rapport a son parent */
    list: (el) => N.index(el, el.parentNode.children),

    /** L'indice de l'element par rapport au element de la meme classe, relatif au contexte */
    // class: (el, nameClass, context)
}

/** Arrondie à la decimal pres, au centieme de base */
N.round = (x, decimal) => {
    decimal = N.Is.und(decimal) ? 100 : 10 ** decimal;
    return Math.round(x * decimal) / decimal
}

/** shorthand for hasOwnProperty method */
N.Has = (el, p) => el.hasOwnProperty(p)

N.Is = {
    str: t => 'string' == typeof t,
    obj: t => t === Object(t),
    arr: t => t.constructor === Array,
    def: t => void 0 !== t,
    und: t => void 0 === t
}

N.O = (t, r) => {
    t.style.opacity = r
}
N.pe = (t, r) => {
    t.style.pointerEvents = r
};
N.PE = {
    all: t => {
        R.pe(t, "all")
    },
    none: t => {
        R.pe(t, "none")
    }
}

N.TopReload = t => {
    "scrollRestoration" in history ? history.scrollRestoration = "manual" : window.onbeforeunload = t => {
        window.scrollTo(0, 0)
    }
}

N.T = (el, x, y, unite) => {
    unite = N.Is.und(unite) ? "%" : unite;
    el.style.transform = "translate3d(" + x + unite + "," + y + unite + ",0)"
}

! function () {
    "use strict";

    N.TopReload()
    const container = N.Get.class('container');
    const bleuRouge = N.Get.class('bleu-rouge');
    const posterContainer = N.Get.class('poster-anime-container');
    let posterContainerW = 0;
    let timer = 0;
    let border = 0;

    setTimeout(() => {
        posterContainerW = N.Get.class('poster-anime-container')[0].offsetWidth;
        border = 1650 + 800 + 450 + 40 * 15 + posterContainerW / 6 / 2;

        console.log(posterContainerW, border);
    }, 1000)

    function goToPoster(n) {
        // console.log(n + 1, border + posterContainerW / 5 * n);
        window.scrollTo(0, (border + posterContainerW / 5 * n) / 2)
    }

    let x = 0;
    let curX = 0;

    ! function main() {
        setInterval(() => {
            x = window.scrollY * 2;

            curX = N.Lerp(curX, x, 0.1);


            if (curX <= 1650) {
                N.T(container[0], -curX, 0, 'px')
                N.T(bleuRouge[0], 0, 0, 'px')
            } else {
                N.T(container[0], -1650, 0, 'px');
                if (curX - 1650 < 800) {
                    N.T(bleuRouge[0], 0, -curX + 1650, 'px')
                } else {
                    N.T(bleuRouge[0], 0, -800, 'px')
                }
            }

            if (curX >= 1650 + 800) {
                N.T(container[0], -curX + 800, 0, 'px')

                if (curX >= border) {

                    N.T(container[0], -border + 800, 0, 'px')
                    N.T(posterContainer[0], -curX + border, 0, 'px');



                    window.onscroll = function (e) {
                        clearTimeout(timer)
                        timer = setTimeout(() => {
                            goToPoster(N.round((curX - border) / (posterContainerW / 5), 0));
                        }, 1000);
                    }

                }
                else {
                    clearTimeout(timer)
                }
            }
        }, 1000 / 60)
    }()
}()
