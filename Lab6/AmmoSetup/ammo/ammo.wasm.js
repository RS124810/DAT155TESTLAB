// This is ammo.js, a port of Bullet Physics to JavaScript. zlib licensed.

var Ammo = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function (Ammo) {
            Ammo = Ammo || {};


            var b;
            b || (b = typeof Ammo !== 'undefined' ? Ammo : {});
            var aa, ba;
            b.ready = new Promise(function (a, c) {
                aa = a;
                ba = c
            });
            var ca = Object.assign({}, b), da = "object" == typeof window, ea = "function" == typeof importScripts,
                fa = "", ha, ia, ja, fs, ka, la;
            if ("object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node) fa = ea ? require("path").dirname(fa) + "/" : __dirname + "/", la = () => {
                ka || (fs = require("fs"), ka = require("path"))
            }, ha = function (a, c) {
                la();
                a = ka.normalize(a);
                return fs.readFileSync(a, c ? void 0 : "utf8")
            }, ja = a => {
                a = ha(a, !0);
                a.buffer || (a = new Uint8Array(a));
                return a
            }, ia = (a, c, d) => {
                la();
                a = ka.normalize(a);
                fs.readFile(a, function (e, g) {
                    e ? d(e) : c(g.buffer)
                })
            }, 1 < process.argv.length && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2),
                process.on("uncaughtException", function (a) {
                    throw a;
                }), process.on("unhandledRejection", function (a) {
                throw a;
            }), b.inspect = function () {
                return "[Emscripten Module object]"
            }; else if (da || ea) ea ? fa = self.location.href : "undefined" != typeof document && document.currentScript && (fa = document.currentScript.src), _scriptDir && (fa = _scriptDir), fa = 0 !== fa.indexOf("blob:") ? fa.substr(0, fa.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", ha = a => {
                var c = new XMLHttpRequest;
                c.open("GET", a, !1);
                c.send(null);
                return c.responseText
            }, ea && (ja =
                a => {
                    var c = new XMLHttpRequest;
                    c.open("GET", a, !1);
                    c.responseType = "arraybuffer";
                    c.send(null);
                    return new Uint8Array(c.response)
                }), ia = (a, c, d) => {
                var e = new XMLHttpRequest;
                e.open("GET", a, !0);
                e.responseType = "arraybuffer";
                e.onload = () => {
                    200 == e.status || 0 == e.status && e.response ? c(e.response) : d()
                };
                e.onerror = d;
                e.send(null)
            };
            b.print || console.log.bind(console);
            var ma = b.printErr || console.warn.bind(console);
            Object.assign(b, ca);
            ca = null;
            var na = [], oa, pa;
            b.wasmBinary && (pa = b.wasmBinary);
            var noExitRuntime = b.noExitRuntime || !0;
            "object" != typeof WebAssembly && qa("no native wasm support detected");
            var ra, sa = !1, ta = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

            function ua(a, c) {
                if (a) {
                    var d = va, e = a + c;
                    for (c = a; d[c] && !(c >= e);) ++c;
                    if (16 < c - a && d.subarray && ta) a = ta.decode(d.subarray(a, c)); else {
                        for (e = ""; a < c;) {
                            var g = d[a++];
                            if (g & 128) {
                                var n = d[a++] & 63;
                                if (192 == (g & 224)) e += String.fromCharCode((g & 31) << 6 | n); else {
                                    var D = d[a++] & 63;
                                    g = 224 == (g & 240) ? (g & 15) << 12 | n << 6 | D : (g & 7) << 18 | n << 12 | D << 6 | d[a++] & 63;
                                    65536 > g ? e += String.fromCharCode(g) : (g -= 65536, e += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023))
                                }
                            } else e += String.fromCharCode(g)
                        }
                        a = e
                    }
                } else a = "";
                return a
            }

            var wa, va, xa, ya, za, Aa, Ba = [], Ca = [], Ea = [], Fa = !1;

            function Ga() {
                var a = b.preRun.shift();
                Ba.unshift(a)
            }

            var Ha = 0, Ia = null, Ja = null;
            b.preloadedImages = {};
            b.preloadedAudios = {};

            function qa(a) {
                if (b.onAbort) b.onAbort(a);
                a = "Aborted(" + a + ")";
                ma(a);
                sa = !0;
                a = new WebAssembly.RuntimeError(a + ". Build with -s ASSERTIONS=1 for more info.");
                ba(a);
                throw a;
            }

            function Ka() {
                return La.startsWith("data:application/octet-stream;base64,")
            }

            var La;
            La = "ammo.wasm.wasm";
            if (!Ka()) {
                var Ma = La;
                La = b.locateFile ? b.locateFile(Ma, fa) : fa + Ma
            }

            function Na() {
                var a = La;
                try {
                    if (a == La && pa) return new Uint8Array(pa);
                    if (ja) return ja(a);
                    throw"both async and sync fetching of the wasm failed";
                } catch (c) {
                    qa(c)
                }
            }

            function Oa() {
                if (!pa && (da || ea)) {
                    if ("function" == typeof fetch && !La.startsWith("file://")) return fetch(La, {credentials: "same-origin"}).then(function (a) {
                        if (!a.ok) throw"failed to load wasm binary file at '" + La + "'";
                        return a.arrayBuffer()
                    }).catch(function () {
                        return Na()
                    });
                    if (ia) return new Promise(function (a, c) {
                        ia(La, function (d) {
                            a(new Uint8Array(d))
                        }, c)
                    })
                }
                return Promise.resolve().then(function () {
                    return Na()
                })
            }

            var Pa = {
                27254: function (a, c, d, e) {
                    a = b.getCache(b.DebugDrawer)[a];
                    if (!a.hasOwnProperty("drawLine")) throw"a JSImplementation must implement all functions, you forgot DebugDrawer::drawLine.";
                    a.drawLine(c, d, e)
                }, 27474: function (a, c, d, e, g, n) {
                    a = b.getCache(b.DebugDrawer)[a];
                    if (!a.hasOwnProperty("drawContactPoint")) throw"a JSImplementation must implement all functions, you forgot DebugDrawer::drawContactPoint.";
                    a.drawContactPoint(c, d, e, g, n)
                }, 27724: function (a, c) {
                    a = b.getCache(b.DebugDrawer)[a];
                    if (!a.hasOwnProperty("reportErrorWarning")) throw"a JSImplementation must implement all functions, you forgot DebugDrawer::reportErrorWarning.";
                    a.reportErrorWarning(c)
                }, 27968: function (a, c, d) {
                    a = b.getCache(b.DebugDrawer)[a];
                    if (!a.hasOwnProperty("draw3dText")) throw"a JSImplementation must implement all functions, you forgot DebugDrawer::draw3dText.";
                    a.draw3dText(c, d)
                }, 28191: function (a, c) {
                    a = b.getCache(b.DebugDrawer)[a];
                    if (!a.hasOwnProperty("setDebugMode")) throw"a JSImplementation must implement all functions, you forgot DebugDrawer::setDebugMode.";
                    a.setDebugMode(c)
                }, 28417: function (a) {
                    a = b.getCache(b.DebugDrawer)[a];
                    if (!a.hasOwnProperty("getDebugMode")) throw"a JSImplementation must implement all functions, you forgot DebugDrawer::getDebugMode.";
                    return a.getDebugMode()
                }, 28648: function (a, c, d, e, g, n, D, T) {
                    a = b.getCache(b.ConcreteContactResultCallback)[a];
                    if (!a.hasOwnProperty("addSingleResult")) throw"a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.";
                    return a.addSingleResult(c, d, e, g, n, D, T)
                }
            };

            function Qa(a) {
                for (; 0 < a.length;) {
                    var c = a.shift();
                    if ("function" == typeof c) c(b); else {
                        var d = c.EH;
                        "number" == typeof d ? void 0 === c.AB ? Ra(d)() : Ra(d)(c.AB) : d(void 0 === c.AB ? null : c.AB)
                    }
                }
            }

            var Sa = [];

            function Ra(a) {
                var c = Sa[a];
                c || (a >= Sa.length && (Sa.length = a + 1), Sa[a] = c = Aa.get(a));
                return c
            }

            var Ta = [];

            function Ua(a, c, d) {
                Ta.length = 0;
                var e;
                for (d >>= 2; e = va[c++];) (e = 105 > e) && d & 1 && d++, Ta.push(e ? za[d++ >> 1] : xa[d]), ++d;
                return Pa[a].apply(null, Ta)
            }

            var Va = {
                c: function () {
                    qa("")
                }, f: function (a, c, d) {
                    return Ua(a, c, d)
                }, b: Ua, e: function (a, c, d) {
                    va.copyWithin(a, c, c + d)
                }, d: function () {
                    qa("OOM")
                }, a: function (a) {
                    var c = Date.now();
                    xa[a >> 2] = c / 1E3 | 0;
                    xa[a + 4 >> 2] = c % 1E3 * 1E3 | 0;
                    return 0
                }
            };
            (function () {
                function a(g) {
                    b.asm = g.exports;
                    ra = b.asm.g;
                    g = ra.buffer;
                    b.HEAP8 = wa = new Int8Array(g);
                    b.HEAP16 = new Int16Array(g);
                    b.HEAP32 = xa = new Int32Array(g);
                    b.HEAPU8 = va = new Uint8Array(g);
                    b.HEAPU16 = new Uint16Array(g);
                    b.HEAPU32 = new Uint32Array(g);
                    b.HEAPF32 = ya = new Float32Array(g);
                    b.HEAPF64 = za = new Float64Array(g);
                    Aa = b.asm.$A;
                    Ca.unshift(b.asm.h);
                    Ha--;
                    b.monitorRunDependencies && b.monitorRunDependencies(Ha);
                    0 == Ha && (null !== Ia && (clearInterval(Ia), Ia = null), Ja && (g = Ja, Ja = null, g()))
                }

                function c(g) {
                    a(g.instance)
                }

                function d(g) {
                    return Oa().then(function (n) {
                        return WebAssembly.instantiate(n,
                            e)
                    }).then(function (n) {
                        return n
                    }).then(g, function (n) {
                        ma("failed to asynchronously prepare wasm: " + n);
                        qa(n)
                    })
                }

                var e = {a: Va};
                Ha++;
                b.monitorRunDependencies && b.monitorRunDependencies(Ha);
                if (b.instantiateWasm) try {
                    return b.instantiateWasm(e, a)
                } catch (g) {
                    return ma("Module.instantiateWasm callback failed with error: " + g), !1
                }
                (function () {
                    return pa || "function" != typeof WebAssembly.instantiateStreaming || Ka() || La.startsWith("file://") || "function" != typeof fetch ? d(c) : fetch(La, {credentials: "same-origin"}).then(function (g) {
                        return WebAssembly.instantiateStreaming(g,
                            e).then(c, function (n) {
                            ma("wasm streaming compile failed: " + n);
                            ma("falling back to ArrayBuffer instantiation");
                            return d(c)
                        })
                    })
                })().catch(ba);
                return {}
            })();
            b.___wasm_call_ctors = function () {
                return (b.___wasm_call_ctors = b.asm.h).apply(null, arguments)
            };
            var Wa = b._emscripten_bind_btCollisionShape_setLocalScaling_1 = function () {
                    return (Wa = b._emscripten_bind_btCollisionShape_setLocalScaling_1 = b.asm.i).apply(null, arguments)
                }, Xa = b._emscripten_bind_btCollisionShape_getLocalScaling_0 = function () {
                    return (Xa = b._emscripten_bind_btCollisionShape_getLocalScaling_0 = b.asm.j).apply(null, arguments)
                }, Ya = b._emscripten_bind_btCollisionShape_calculateLocalInertia_2 = function () {
                    return (Ya = b._emscripten_bind_btCollisionShape_calculateLocalInertia_2 = b.asm.k).apply(null, arguments)
                },
                Za = b._emscripten_bind_btCollisionShape_setMargin_1 = function () {
                    return (Za = b._emscripten_bind_btCollisionShape_setMargin_1 = b.asm.l).apply(null, arguments)
                }, $a = b._emscripten_bind_btCollisionShape_getMargin_0 = function () {
                    return ($a = b._emscripten_bind_btCollisionShape_getMargin_0 = b.asm.m).apply(null, arguments)
                }, ab = b._emscripten_bind_btCollisionShape___destroy___0 = function () {
                    return (ab = b._emscripten_bind_btCollisionShape___destroy___0 = b.asm.n).apply(null, arguments)
                }, bb = b._emscripten_bind_btCollisionWorld_getDispatcher_0 =
                    function () {
                        return (bb = b._emscripten_bind_btCollisionWorld_getDispatcher_0 = b.asm.o).apply(null, arguments)
                    }, cb = b._emscripten_bind_btCollisionWorld_rayTest_3 = function () {
                    return (cb = b._emscripten_bind_btCollisionWorld_rayTest_3 = b.asm.p).apply(null, arguments)
                }, db = b._emscripten_bind_btCollisionWorld_getPairCache_0 = function () {
                    return (db = b._emscripten_bind_btCollisionWorld_getPairCache_0 = b.asm.q).apply(null, arguments)
                }, eb = b._emscripten_bind_btCollisionWorld_getDispatchInfo_0 = function () {
                    return (eb = b._emscripten_bind_btCollisionWorld_getDispatchInfo_0 =
                        b.asm.r).apply(null, arguments)
                }, fb = b._emscripten_bind_btCollisionWorld_addCollisionObject_1 = function () {
                    return (fb = b._emscripten_bind_btCollisionWorld_addCollisionObject_1 = b.asm.s).apply(null, arguments)
                }, gb = b._emscripten_bind_btCollisionWorld_addCollisionObject_2 = function () {
                    return (gb = b._emscripten_bind_btCollisionWorld_addCollisionObject_2 = b.asm.t).apply(null, arguments)
                }, hb = b._emscripten_bind_btCollisionWorld_addCollisionObject_3 = function () {
                    return (hb = b._emscripten_bind_btCollisionWorld_addCollisionObject_3 =
                        b.asm.u).apply(null, arguments)
                }, ib = b._emscripten_bind_btCollisionWorld_removeCollisionObject_1 = function () {
                    return (ib = b._emscripten_bind_btCollisionWorld_removeCollisionObject_1 = b.asm.v).apply(null, arguments)
                }, jb = b._emscripten_bind_btCollisionWorld_getBroadphase_0 = function () {
                    return (jb = b._emscripten_bind_btCollisionWorld_getBroadphase_0 = b.asm.w).apply(null, arguments)
                }, kb = b._emscripten_bind_btCollisionWorld_convexSweepTest_5 = function () {
                    return (kb = b._emscripten_bind_btCollisionWorld_convexSweepTest_5 = b.asm.x).apply(null,
                        arguments)
                }, lb = b._emscripten_bind_btCollisionWorld_contactPairTest_3 = function () {
                    return (lb = b._emscripten_bind_btCollisionWorld_contactPairTest_3 = b.asm.y).apply(null, arguments)
                }, mb = b._emscripten_bind_btCollisionWorld_contactTest_2 = function () {
                    return (mb = b._emscripten_bind_btCollisionWorld_contactTest_2 = b.asm.z).apply(null, arguments)
                }, nb = b._emscripten_bind_btCollisionWorld_updateSingleAabb_1 = function () {
                    return (nb = b._emscripten_bind_btCollisionWorld_updateSingleAabb_1 = b.asm.A).apply(null, arguments)
                }, ob =
                    b._emscripten_bind_btCollisionWorld_setDebugDrawer_1 = function () {
                        return (ob = b._emscripten_bind_btCollisionWorld_setDebugDrawer_1 = b.asm.B).apply(null, arguments)
                    }, pb = b._emscripten_bind_btCollisionWorld_getDebugDrawer_0 = function () {
                    return (pb = b._emscripten_bind_btCollisionWorld_getDebugDrawer_0 = b.asm.C).apply(null, arguments)
                }, qb = b._emscripten_bind_btCollisionWorld_debugDrawWorld_0 = function () {
                    return (qb = b._emscripten_bind_btCollisionWorld_debugDrawWorld_0 = b.asm.D).apply(null, arguments)
                }, rb = b._emscripten_bind_btCollisionWorld_debugDrawObject_3 =
                    function () {
                        return (rb = b._emscripten_bind_btCollisionWorld_debugDrawObject_3 = b.asm.E).apply(null, arguments)
                    }, sb = b._emscripten_bind_btCollisionWorld___destroy___0 = function () {
                    return (sb = b._emscripten_bind_btCollisionWorld___destroy___0 = b.asm.F).apply(null, arguments)
                }, tb = b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 = function () {
                    return (tb = b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 = b.asm.G).apply(null, arguments)
                }, ub = b._emscripten_bind_btCollisionObject_getCollisionShape_0 =
                    function () {
                        return (ub = b._emscripten_bind_btCollisionObject_getCollisionShape_0 = b.asm.H).apply(null, arguments)
                    }, vb = b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 = function () {
                    return (vb = b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 = b.asm.I).apply(null, arguments)
                }, wb = b._emscripten_bind_btCollisionObject_setActivationState_1 = function () {
                    return (wb = b._emscripten_bind_btCollisionObject_setActivationState_1 = b.asm.J).apply(null, arguments)
                }, xb = b._emscripten_bind_btCollisionObject_forceActivationState_1 =
                    function () {
                        return (xb = b._emscripten_bind_btCollisionObject_forceActivationState_1 = b.asm.K).apply(null, arguments)
                    }, yb = b._emscripten_bind_btCollisionObject_activate_0 = function () {
                    return (yb = b._emscripten_bind_btCollisionObject_activate_0 = b.asm.L).apply(null, arguments)
                }, zb = b._emscripten_bind_btCollisionObject_activate_1 = function () {
                    return (zb = b._emscripten_bind_btCollisionObject_activate_1 = b.asm.M).apply(null, arguments)
                }, Ab = b._emscripten_bind_btCollisionObject_isActive_0 = function () {
                    return (Ab = b._emscripten_bind_btCollisionObject_isActive_0 =
                        b.asm.N).apply(null, arguments)
                }, Bb = b._emscripten_bind_btCollisionObject_isKinematicObject_0 = function () {
                    return (Bb = b._emscripten_bind_btCollisionObject_isKinematicObject_0 = b.asm.O).apply(null, arguments)
                }, Cb = b._emscripten_bind_btCollisionObject_isStaticObject_0 = function () {
                    return (Cb = b._emscripten_bind_btCollisionObject_isStaticObject_0 = b.asm.P).apply(null, arguments)
                }, Db = b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 = function () {
                    return (Db = b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 =
                        b.asm.Q).apply(null, arguments)
                }, Eb = b._emscripten_bind_btCollisionObject_getRestitution_0 = function () {
                    return (Eb = b._emscripten_bind_btCollisionObject_getRestitution_0 = b.asm.R).apply(null, arguments)
                }, Fb = b._emscripten_bind_btCollisionObject_getFriction_0 = function () {
                    return (Fb = b._emscripten_bind_btCollisionObject_getFriction_0 = b.asm.S).apply(null, arguments)
                }, Gb = b._emscripten_bind_btCollisionObject_getRollingFriction_0 = function () {
                    return (Gb = b._emscripten_bind_btCollisionObject_getRollingFriction_0 = b.asm.T).apply(null,
                        arguments)
                }, Hb = b._emscripten_bind_btCollisionObject_setRestitution_1 = function () {
                    return (Hb = b._emscripten_bind_btCollisionObject_setRestitution_1 = b.asm.U).apply(null, arguments)
                }, Ib = b._emscripten_bind_btCollisionObject_setFriction_1 = function () {
                    return (Ib = b._emscripten_bind_btCollisionObject_setFriction_1 = b.asm.V).apply(null, arguments)
                }, Jb = b._emscripten_bind_btCollisionObject_setRollingFriction_1 = function () {
                    return (Jb = b._emscripten_bind_btCollisionObject_setRollingFriction_1 = b.asm.W).apply(null, arguments)
                },
                Kb = b._emscripten_bind_btCollisionObject_getWorldTransform_0 = function () {
                    return (Kb = b._emscripten_bind_btCollisionObject_getWorldTransform_0 = b.asm.X).apply(null, arguments)
                }, Lb = b._emscripten_bind_btCollisionObject_getCollisionFlags_0 = function () {
                    return (Lb = b._emscripten_bind_btCollisionObject_getCollisionFlags_0 = b.asm.Y).apply(null, arguments)
                }, Mb = b._emscripten_bind_btCollisionObject_setCollisionFlags_1 = function () {
                    return (Mb = b._emscripten_bind_btCollisionObject_setCollisionFlags_1 = b.asm.Z).apply(null, arguments)
                },
                Nb = b._emscripten_bind_btCollisionObject_setWorldTransform_1 = function () {
                    return (Nb = b._emscripten_bind_btCollisionObject_setWorldTransform_1 = b.asm._).apply(null, arguments)
                }, Ob = b._emscripten_bind_btCollisionObject_setCollisionShape_1 = function () {
                    return (Ob = b._emscripten_bind_btCollisionObject_setCollisionShape_1 = b.asm.$).apply(null, arguments)
                }, Pb = b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 = function () {
                    return (Pb = b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 = b.asm.aa).apply(null,
                        arguments)
                }, Qb = b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 = function () {
                    return (Qb = b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 = b.asm.ba).apply(null, arguments)
                }, Rb = b._emscripten_bind_btCollisionObject_getUserIndex_0 = function () {
                    return (Rb = b._emscripten_bind_btCollisionObject_getUserIndex_0 = b.asm.ca).apply(null, arguments)
                }, Sb = b._emscripten_bind_btCollisionObject_setUserIndex_1 = function () {
                    return (Sb = b._emscripten_bind_btCollisionObject_setUserIndex_1 = b.asm.da).apply(null,
                        arguments)
                }, Tb = b._emscripten_bind_btCollisionObject_getUserPointer_0 = function () {
                    return (Tb = b._emscripten_bind_btCollisionObject_getUserPointer_0 = b.asm.ea).apply(null, arguments)
                }, Ub = b._emscripten_bind_btCollisionObject_setUserPointer_1 = function () {
                    return (Ub = b._emscripten_bind_btCollisionObject_setUserPointer_1 = b.asm.fa).apply(null, arguments)
                }, Vb = b._emscripten_bind_btCollisionObject_getBroadphaseHandle_0 = function () {
                    return (Vb = b._emscripten_bind_btCollisionObject_getBroadphaseHandle_0 = b.asm.ga).apply(null,
                        arguments)
                }, Wb = b._emscripten_bind_btCollisionObject___destroy___0 = function () {
                    return (Wb = b._emscripten_bind_btCollisionObject___destroy___0 = b.asm.ha).apply(null, arguments)
                }, Xb = b._emscripten_bind_btConcaveShape_setLocalScaling_1 = function () {
                    return (Xb = b._emscripten_bind_btConcaveShape_setLocalScaling_1 = b.asm.ia).apply(null, arguments)
                }, Yb = b._emscripten_bind_btConcaveShape_getLocalScaling_0 = function () {
                    return (Yb = b._emscripten_bind_btConcaveShape_getLocalScaling_0 = b.asm.ja).apply(null, arguments)
                }, Zb = b._emscripten_bind_btConcaveShape_calculateLocalInertia_2 =
                    function () {
                        return (Zb = b._emscripten_bind_btConcaveShape_calculateLocalInertia_2 = b.asm.ka).apply(null, arguments)
                    }, $b = b._emscripten_bind_btConcaveShape___destroy___0 = function () {
                    return ($b = b._emscripten_bind_btConcaveShape___destroy___0 = b.asm.la).apply(null, arguments)
                }, ac = b._emscripten_bind_btCollisionAlgorithm___destroy___0 = function () {
                    return (ac = b._emscripten_bind_btCollisionAlgorithm___destroy___0 = b.asm.ma).apply(null, arguments)
                }, bc = b._emscripten_bind_btTypedConstraint_enableFeedback_1 = function () {
                    return (bc =
                        b._emscripten_bind_btTypedConstraint_enableFeedback_1 = b.asm.na).apply(null, arguments)
                }, cc = b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (cc = b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 = b.asm.oa).apply(null, arguments)
                }, ec = b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 = function () {
                    return (ec = b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 = b.asm.pa).apply(null, arguments)
                }, fc = b._emscripten_bind_btTypedConstraint_getParam_2 =
                    function () {
                        return (fc = b._emscripten_bind_btTypedConstraint_getParam_2 = b.asm.qa).apply(null, arguments)
                    }, gc = b._emscripten_bind_btTypedConstraint_setParam_3 = function () {
                    return (gc = b._emscripten_bind_btTypedConstraint_setParam_3 = b.asm.ra).apply(null, arguments)
                }, hc = b._emscripten_bind_btTypedConstraint___destroy___0 = function () {
                    return (hc = b._emscripten_bind_btTypedConstraint___destroy___0 = b.asm.sa).apply(null, arguments)
                }, ic = b._emscripten_bind_btDynamicsWorld_addAction_1 = function () {
                    return (ic = b._emscripten_bind_btDynamicsWorld_addAction_1 =
                        b.asm.ta).apply(null, arguments)
                }, jc = b._emscripten_bind_btDynamicsWorld_removeAction_1 = function () {
                    return (jc = b._emscripten_bind_btDynamicsWorld_removeAction_1 = b.asm.ua).apply(null, arguments)
                }, kc = b._emscripten_bind_btDynamicsWorld_getSolverInfo_0 = function () {
                    return (kc = b._emscripten_bind_btDynamicsWorld_getSolverInfo_0 = b.asm.va).apply(null, arguments)
                }, lc = b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 = function () {
                    return (lc = b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 = b.asm.wa).apply(null,
                        arguments)
                }, mc = b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 = function () {
                    return (mc = b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 = b.asm.xa).apply(null, arguments)
                }, nc = b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 = function () {
                    return (nc = b._emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 = b.asm.ya).apply(null, arguments)
                }, oc = b._emscripten_bind_btDynamicsWorld_getDispatcher_0 = function () {
                    return (oc = b._emscripten_bind_btDynamicsWorld_getDispatcher_0 = b.asm.za).apply(null,
                        arguments)
                }, pc = b._emscripten_bind_btDynamicsWorld_rayTest_3 = function () {
                    return (pc = b._emscripten_bind_btDynamicsWorld_rayTest_3 = b.asm.Aa).apply(null, arguments)
                }, qc = b._emscripten_bind_btDynamicsWorld_getPairCache_0 = function () {
                    return (qc = b._emscripten_bind_btDynamicsWorld_getPairCache_0 = b.asm.Ba).apply(null, arguments)
                }, rc = b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 = function () {
                    return (rc = b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 = b.asm.Ca).apply(null, arguments)
                }, sc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_1 =
                    function () {
                        return (sc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_1 = b.asm.Da).apply(null, arguments)
                    }, tc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_2 = function () {
                    return (tc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_2 = b.asm.Ea).apply(null, arguments)
                }, uc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_3 = function () {
                    return (uc = b._emscripten_bind_btDynamicsWorld_addCollisionObject_3 = b.asm.Fa).apply(null, arguments)
                }, vc = b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 =
                    function () {
                        return (vc = b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 = b.asm.Ga).apply(null, arguments)
                    }, wc = b._emscripten_bind_btDynamicsWorld_getBroadphase_0 = function () {
                    return (wc = b._emscripten_bind_btDynamicsWorld_getBroadphase_0 = b.asm.Ha).apply(null, arguments)
                }, xc = b._emscripten_bind_btDynamicsWorld_convexSweepTest_5 = function () {
                    return (xc = b._emscripten_bind_btDynamicsWorld_convexSweepTest_5 = b.asm.Ia).apply(null, arguments)
                }, yc = b._emscripten_bind_btDynamicsWorld_contactPairTest_3 = function () {
                    return (yc =
                        b._emscripten_bind_btDynamicsWorld_contactPairTest_3 = b.asm.Ja).apply(null, arguments)
                }, zc = b._emscripten_bind_btDynamicsWorld_contactTest_2 = function () {
                    return (zc = b._emscripten_bind_btDynamicsWorld_contactTest_2 = b.asm.Ka).apply(null, arguments)
                }, Ac = b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 = function () {
                    return (Ac = b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 = b.asm.La).apply(null, arguments)
                }, Bc = b._emscripten_bind_btDynamicsWorld_setDebugDrawer_1 = function () {
                    return (Bc = b._emscripten_bind_btDynamicsWorld_setDebugDrawer_1 =
                        b.asm.Ma).apply(null, arguments)
                }, Cc = b._emscripten_bind_btDynamicsWorld_getDebugDrawer_0 = function () {
                    return (Cc = b._emscripten_bind_btDynamicsWorld_getDebugDrawer_0 = b.asm.Na).apply(null, arguments)
                }, Dc = b._emscripten_bind_btDynamicsWorld_debugDrawWorld_0 = function () {
                    return (Dc = b._emscripten_bind_btDynamicsWorld_debugDrawWorld_0 = b.asm.Oa).apply(null, arguments)
                }, Ec = b._emscripten_bind_btDynamicsWorld_debugDrawObject_3 = function () {
                    return (Ec = b._emscripten_bind_btDynamicsWorld_debugDrawObject_3 = b.asm.Pa).apply(null,
                        arguments)
                }, Fc = b._emscripten_bind_btDynamicsWorld___destroy___0 = function () {
                    return (Fc = b._emscripten_bind_btDynamicsWorld___destroy___0 = b.asm.Qa).apply(null, arguments)
                }, Gc = b._emscripten_bind_btIDebugDraw_drawLine_3 = function () {
                    return (Gc = b._emscripten_bind_btIDebugDraw_drawLine_3 = b.asm.Ra).apply(null, arguments)
                }, Hc = b._emscripten_bind_btIDebugDraw_drawContactPoint_5 = function () {
                    return (Hc = b._emscripten_bind_btIDebugDraw_drawContactPoint_5 = b.asm.Sa).apply(null, arguments)
                }, Ic = b._emscripten_bind_btIDebugDraw_reportErrorWarning_1 =
                    function () {
                        return (Ic = b._emscripten_bind_btIDebugDraw_reportErrorWarning_1 = b.asm.Ta).apply(null, arguments)
                    }, Jc = b._emscripten_bind_btIDebugDraw_draw3dText_2 = function () {
                    return (Jc = b._emscripten_bind_btIDebugDraw_draw3dText_2 = b.asm.Ua).apply(null, arguments)
                }, Kc = b._emscripten_bind_btIDebugDraw_setDebugMode_1 = function () {
                    return (Kc = b._emscripten_bind_btIDebugDraw_setDebugMode_1 = b.asm.Va).apply(null, arguments)
                }, Lc = b._emscripten_bind_btIDebugDraw_getDebugMode_0 = function () {
                    return (Lc = b._emscripten_bind_btIDebugDraw_getDebugMode_0 =
                        b.asm.Wa).apply(null, arguments)
                }, Mc = b._emscripten_bind_btIDebugDraw___destroy___0 = function () {
                    return (Mc = b._emscripten_bind_btIDebugDraw___destroy___0 = b.asm.Xa).apply(null, arguments)
                }, Nc = b._emscripten_bind_btVector3_btVector3_0 = function () {
                    return (Nc = b._emscripten_bind_btVector3_btVector3_0 = b.asm.Ya).apply(null, arguments)
                }, Oc = b._emscripten_bind_btVector3_btVector3_3 = function () {
                    return (Oc = b._emscripten_bind_btVector3_btVector3_3 = b.asm.Za).apply(null, arguments)
                }, Pc = b._emscripten_bind_btVector3_length_0 =
                    function () {
                        return (Pc = b._emscripten_bind_btVector3_length_0 = b.asm._a).apply(null, arguments)
                    }, Qc = b._emscripten_bind_btVector3_x_0 = function () {
                    return (Qc = b._emscripten_bind_btVector3_x_0 = b.asm.$a).apply(null, arguments)
                }, Rc = b._emscripten_bind_btVector3_y_0 = function () {
                    return (Rc = b._emscripten_bind_btVector3_y_0 = b.asm.ab).apply(null, arguments)
                }, Sc = b._emscripten_bind_btVector3_z_0 = function () {
                    return (Sc = b._emscripten_bind_btVector3_z_0 = b.asm.bb).apply(null, arguments)
                }, Tc = b._emscripten_bind_btVector3_setX_1 = function () {
                    return (Tc =
                        b._emscripten_bind_btVector3_setX_1 = b.asm.cb).apply(null, arguments)
                }, Uc = b._emscripten_bind_btVector3_setY_1 = function () {
                    return (Uc = b._emscripten_bind_btVector3_setY_1 = b.asm.db).apply(null, arguments)
                }, Vc = b._emscripten_bind_btVector3_setZ_1 = function () {
                    return (Vc = b._emscripten_bind_btVector3_setZ_1 = b.asm.eb).apply(null, arguments)
                }, Wc = b._emscripten_bind_btVector3_setValue_3 = function () {
                    return (Wc = b._emscripten_bind_btVector3_setValue_3 = b.asm.fb).apply(null, arguments)
                }, Xc = b._emscripten_bind_btVector3_normalize_0 =
                    function () {
                        return (Xc = b._emscripten_bind_btVector3_normalize_0 = b.asm.gb).apply(null, arguments)
                    }, Yc = b._emscripten_bind_btVector3_rotate_2 = function () {
                    return (Yc = b._emscripten_bind_btVector3_rotate_2 = b.asm.hb).apply(null, arguments)
                }, Zc = b._emscripten_bind_btVector3_dot_1 = function () {
                    return (Zc = b._emscripten_bind_btVector3_dot_1 = b.asm.ib).apply(null, arguments)
                }, $c = b._emscripten_bind_btVector3_op_mul_1 = function () {
                    return ($c = b._emscripten_bind_btVector3_op_mul_1 = b.asm.jb).apply(null, arguments)
                }, ad = b._emscripten_bind_btVector3_op_add_1 =
                    function () {
                        return (ad = b._emscripten_bind_btVector3_op_add_1 = b.asm.kb).apply(null, arguments)
                    }, bd = b._emscripten_bind_btVector3_op_sub_1 = function () {
                    return (bd = b._emscripten_bind_btVector3_op_sub_1 = b.asm.lb).apply(null, arguments)
                }, cd = b._emscripten_bind_btVector3___destroy___0 = function () {
                    return (cd = b._emscripten_bind_btVector3___destroy___0 = b.asm.mb).apply(null, arguments)
                }, dd = b._emscripten_bind_btQuadWord_x_0 = function () {
                    return (dd = b._emscripten_bind_btQuadWord_x_0 = b.asm.nb).apply(null, arguments)
                }, ed = b._emscripten_bind_btQuadWord_y_0 =
                    function () {
                        return (ed = b._emscripten_bind_btQuadWord_y_0 = b.asm.ob).apply(null, arguments)
                    }, fd = b._emscripten_bind_btQuadWord_z_0 = function () {
                    return (fd = b._emscripten_bind_btQuadWord_z_0 = b.asm.pb).apply(null, arguments)
                }, gd = b._emscripten_bind_btQuadWord_w_0 = function () {
                    return (gd = b._emscripten_bind_btQuadWord_w_0 = b.asm.qb).apply(null, arguments)
                }, hd = b._emscripten_bind_btQuadWord_setX_1 = function () {
                    return (hd = b._emscripten_bind_btQuadWord_setX_1 = b.asm.rb).apply(null, arguments)
                }, jd = b._emscripten_bind_btQuadWord_setY_1 =
                    function () {
                        return (jd = b._emscripten_bind_btQuadWord_setY_1 = b.asm.sb).apply(null, arguments)
                    }, kd = b._emscripten_bind_btQuadWord_setZ_1 = function () {
                    return (kd = b._emscripten_bind_btQuadWord_setZ_1 = b.asm.tb).apply(null, arguments)
                }, ld = b._emscripten_bind_btQuadWord_setW_1 = function () {
                    return (ld = b._emscripten_bind_btQuadWord_setW_1 = b.asm.ub).apply(null, arguments)
                }, md = b._emscripten_bind_btQuadWord___destroy___0 = function () {
                    return (md = b._emscripten_bind_btQuadWord___destroy___0 = b.asm.vb).apply(null, arguments)
                }, nd =
                    b._emscripten_bind_btMotionState_getWorldTransform_1 = function () {
                        return (nd = b._emscripten_bind_btMotionState_getWorldTransform_1 = b.asm.wb).apply(null, arguments)
                    }, od = b._emscripten_bind_btMotionState_setWorldTransform_1 = function () {
                    return (od = b._emscripten_bind_btMotionState_setWorldTransform_1 = b.asm.xb).apply(null, arguments)
                }, pd = b._emscripten_bind_btMotionState___destroy___0 = function () {
                    return (pd = b._emscripten_bind_btMotionState___destroy___0 = b.asm.yb).apply(null, arguments)
                }, qd = b._emscripten_bind_RayResultCallback_hasHit_0 =
                    function () {
                        return (qd = b._emscripten_bind_RayResultCallback_hasHit_0 = b.asm.zb).apply(null, arguments)
                    }, rd = b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 = function () {
                    return (rd = b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 = b.asm.Ab).apply(null, arguments)
                }, sd = b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 = function () {
                    return (sd = b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 = b.asm.Bb).apply(null, arguments)
                }, td = b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 =
                    function () {
                        return (td = b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 = b.asm.Cb).apply(null, arguments)
                    }, ud = b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 = function () {
                    return (ud = b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 = b.asm.Db).apply(null, arguments)
                }, vd = b._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 = function () {
                    return (vd = b._emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 = b.asm.Eb).apply(null, arguments)
                }, wd = b._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 =
                    function () {
                        return (wd = b._emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 = b.asm.Fb).apply(null, arguments)
                    }, xd = b._emscripten_bind_RayResultCallback_get_m_collisionObject_0 = function () {
                    return (xd = b._emscripten_bind_RayResultCallback_get_m_collisionObject_0 = b.asm.Gb).apply(null, arguments)
                }, yd = b._emscripten_bind_RayResultCallback_set_m_collisionObject_1 = function () {
                    return (yd = b._emscripten_bind_RayResultCallback_set_m_collisionObject_1 = b.asm.Hb).apply(null, arguments)
                }, zd = b._emscripten_bind_RayResultCallback_get_m_flags_0 =
                    function () {
                        return (zd = b._emscripten_bind_RayResultCallback_get_m_flags_0 = b.asm.Ib).apply(null, arguments)
                    }, Ad = b._emscripten_bind_RayResultCallback_set_m_flags_1 = function () {
                    return (Ad = b._emscripten_bind_RayResultCallback_set_m_flags_1 = b.asm.Jb).apply(null, arguments)
                }, Bd = b._emscripten_bind_RayResultCallback___destroy___0 = function () {
                    return (Bd = b._emscripten_bind_RayResultCallback___destroy___0 = b.asm.Kb).apply(null, arguments)
                }, Cd = b._emscripten_bind_ContactResultCallback_addSingleResult_7 = function () {
                    return (Cd =
                        b._emscripten_bind_ContactResultCallback_addSingleResult_7 = b.asm.Lb).apply(null, arguments)
                }, Dd = b._emscripten_bind_ContactResultCallback___destroy___0 = function () {
                    return (Dd = b._emscripten_bind_ContactResultCallback___destroy___0 = b.asm.Mb).apply(null, arguments)
                }, Ed = b._emscripten_bind_ConvexResultCallback_hasHit_0 = function () {
                    return (Ed = b._emscripten_bind_ConvexResultCallback_hasHit_0 = b.asm.Nb).apply(null, arguments)
                }, Fd = b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 = function () {
                    return (Fd =
                        b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 = b.asm.Ob).apply(null, arguments)
                }, Gd = b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 = function () {
                    return (Gd = b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 = b.asm.Pb).apply(null, arguments)
                }, Hd = b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 = function () {
                    return (Hd = b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 = b.asm.Qb).apply(null, arguments)
                }, Id = b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 =
                    function () {
                        return (Id = b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 = b.asm.Rb).apply(null, arguments)
                    }, Jd = b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 = function () {
                    return (Jd = b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 = b.asm.Sb).apply(null, arguments)
                }, Kd = b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 = function () {
                    return (Kd = b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 = b.asm.Tb).apply(null, arguments)
                },
                Ld = b._emscripten_bind_ConvexResultCallback___destroy___0 = function () {
                    return (Ld = b._emscripten_bind_ConvexResultCallback___destroy___0 = b.asm.Ub).apply(null, arguments)
                }, Md = b._emscripten_bind_btConvexShape_setLocalScaling_1 = function () {
                    return (Md = b._emscripten_bind_btConvexShape_setLocalScaling_1 = b.asm.Vb).apply(null, arguments)
                }, Nd = b._emscripten_bind_btConvexShape_getLocalScaling_0 = function () {
                    return (Nd = b._emscripten_bind_btConvexShape_getLocalScaling_0 = b.asm.Wb).apply(null, arguments)
                }, Od = b._emscripten_bind_btConvexShape_calculateLocalInertia_2 =
                    function () {
                        return (Od = b._emscripten_bind_btConvexShape_calculateLocalInertia_2 = b.asm.Xb).apply(null, arguments)
                    }, Pd = b._emscripten_bind_btConvexShape_setMargin_1 = function () {
                    return (Pd = b._emscripten_bind_btConvexShape_setMargin_1 = b.asm.Yb).apply(null, arguments)
                }, Qd = b._emscripten_bind_btConvexShape_getMargin_0 = function () {
                    return (Qd = b._emscripten_bind_btConvexShape_getMargin_0 = b.asm.Zb).apply(null, arguments)
                }, Rd = b._emscripten_bind_btConvexShape___destroy___0 = function () {
                    return (Rd = b._emscripten_bind_btConvexShape___destroy___0 =
                        b.asm._b).apply(null, arguments)
                }, Sd = b._emscripten_bind_btCapsuleShape_btCapsuleShape_2 = function () {
                    return (Sd = b._emscripten_bind_btCapsuleShape_btCapsuleShape_2 = b.asm.$b).apply(null, arguments)
                }, Td = b._emscripten_bind_btCapsuleShape_setMargin_1 = function () {
                    return (Td = b._emscripten_bind_btCapsuleShape_setMargin_1 = b.asm.ac).apply(null, arguments)
                }, Ud = b._emscripten_bind_btCapsuleShape_getMargin_0 = function () {
                    return (Ud = b._emscripten_bind_btCapsuleShape_getMargin_0 = b.asm.bc).apply(null, arguments)
                }, Vd = b._emscripten_bind_btCapsuleShape_getUpAxis_0 =
                    function () {
                        return (Vd = b._emscripten_bind_btCapsuleShape_getUpAxis_0 = b.asm.cc).apply(null, arguments)
                    }, Wd = b._emscripten_bind_btCapsuleShape_getRadius_0 = function () {
                    return (Wd = b._emscripten_bind_btCapsuleShape_getRadius_0 = b.asm.dc).apply(null, arguments)
                }, Xd = b._emscripten_bind_btCapsuleShape_getHalfHeight_0 = function () {
                    return (Xd = b._emscripten_bind_btCapsuleShape_getHalfHeight_0 = b.asm.ec).apply(null, arguments)
                }, Yd = b._emscripten_bind_btCapsuleShape_setLocalScaling_1 = function () {
                    return (Yd = b._emscripten_bind_btCapsuleShape_setLocalScaling_1 =
                        b.asm.fc).apply(null, arguments)
                }, Zd = b._emscripten_bind_btCapsuleShape_getLocalScaling_0 = function () {
                    return (Zd = b._emscripten_bind_btCapsuleShape_getLocalScaling_0 = b.asm.gc).apply(null, arguments)
                }, $d = b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 = function () {
                    return ($d = b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 = b.asm.hc).apply(null, arguments)
                }, ae = b._emscripten_bind_btCapsuleShape___destroy___0 = function () {
                    return (ae = b._emscripten_bind_btCapsuleShape___destroy___0 = b.asm.ic).apply(null,
                        arguments)
                }, be = b._emscripten_bind_btCylinderShape_btCylinderShape_1 = function () {
                    return (be = b._emscripten_bind_btCylinderShape_btCylinderShape_1 = b.asm.jc).apply(null, arguments)
                }, ce = b._emscripten_bind_btCylinderShape_setMargin_1 = function () {
                    return (ce = b._emscripten_bind_btCylinderShape_setMargin_1 = b.asm.kc).apply(null, arguments)
                }, de = b._emscripten_bind_btCylinderShape_getMargin_0 = function () {
                    return (de = b._emscripten_bind_btCylinderShape_getMargin_0 = b.asm.lc).apply(null, arguments)
                }, ee = b._emscripten_bind_btCylinderShape_setLocalScaling_1 =
                    function () {
                        return (ee = b._emscripten_bind_btCylinderShape_setLocalScaling_1 = b.asm.mc).apply(null, arguments)
                    }, fe = b._emscripten_bind_btCylinderShape_getLocalScaling_0 = function () {
                    return (fe = b._emscripten_bind_btCylinderShape_getLocalScaling_0 = b.asm.nc).apply(null, arguments)
                }, ge = b._emscripten_bind_btCylinderShape_calculateLocalInertia_2 = function () {
                    return (ge = b._emscripten_bind_btCylinderShape_calculateLocalInertia_2 = b.asm.oc).apply(null, arguments)
                }, he = b._emscripten_bind_btCylinderShape___destroy___0 = function () {
                    return (he =
                        b._emscripten_bind_btCylinderShape___destroy___0 = b.asm.pc).apply(null, arguments)
                }, ie = b._emscripten_bind_btConeShape_btConeShape_2 = function () {
                    return (ie = b._emscripten_bind_btConeShape_btConeShape_2 = b.asm.qc).apply(null, arguments)
                }, je = b._emscripten_bind_btConeShape_setLocalScaling_1 = function () {
                    return (je = b._emscripten_bind_btConeShape_setLocalScaling_1 = b.asm.rc).apply(null, arguments)
                }, ke = b._emscripten_bind_btConeShape_getLocalScaling_0 = function () {
                    return (ke = b._emscripten_bind_btConeShape_getLocalScaling_0 =
                        b.asm.sc).apply(null, arguments)
                }, le = b._emscripten_bind_btConeShape_calculateLocalInertia_2 = function () {
                    return (le = b._emscripten_bind_btConeShape_calculateLocalInertia_2 = b.asm.tc).apply(null, arguments)
                }, me = b._emscripten_bind_btConeShape___destroy___0 = function () {
                    return (me = b._emscripten_bind_btConeShape___destroy___0 = b.asm.uc).apply(null, arguments)
                }, ne = b._emscripten_bind_btStridingMeshInterface_setScaling_1 = function () {
                    return (ne = b._emscripten_bind_btStridingMeshInterface_setScaling_1 = b.asm.vc).apply(null,
                        arguments)
                }, oe = b._emscripten_bind_btStridingMeshInterface___destroy___0 = function () {
                    return (oe = b._emscripten_bind_btStridingMeshInterface___destroy___0 = b.asm.wc).apply(null, arguments)
                }, pe = b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 = function () {
                    return (pe = b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 = b.asm.xc).apply(null, arguments)
                }, qe = b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 = function () {
                    return (qe = b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 = b.asm.yc).apply(null,
                        arguments)
                }, re = b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 = function () {
                    return (re = b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 = b.asm.zc).apply(null, arguments)
                }, se = b._emscripten_bind_btTriangleMeshShape___destroy___0 = function () {
                    return (se = b._emscripten_bind_btTriangleMeshShape___destroy___0 = b.asm.Ac).apply(null, arguments)
                }, te = b._emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 = function () {
                    return (te = b._emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 = b.asm.Bc).apply(null,
                        arguments)
                }, ue = b._emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 = function () {
                    return (ue = b._emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 = b.asm.Cc).apply(null, arguments)
                }, ve = b._emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 = function () {
                    return (ve = b._emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 = b.asm.Dc).apply(null, arguments)
                }, we = b._emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 = function () {
                    return (we = b._emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 =
                        b.asm.Ec).apply(null, arguments)
                }, xe = b._emscripten_bind_btPrimitiveManagerBase___destroy___0 = function () {
                    return (xe = b._emscripten_bind_btPrimitiveManagerBase___destroy___0 = b.asm.Fc).apply(null, arguments)
                }, ye = b._emscripten_bind_btGImpactShapeInterface_updateBound_0 = function () {
                    return (ye = b._emscripten_bind_btGImpactShapeInterface_updateBound_0 = b.asm.Gc).apply(null, arguments)
                }, ze = b._emscripten_bind_btGImpactShapeInterface_postUpdate_0 = function () {
                    return (ze = b._emscripten_bind_btGImpactShapeInterface_postUpdate_0 =
                        b.asm.Hc).apply(null, arguments)
                }, Ae = b._emscripten_bind_btGImpactShapeInterface_getShapeType_0 = function () {
                    return (Ae = b._emscripten_bind_btGImpactShapeInterface_getShapeType_0 = b.asm.Ic).apply(null, arguments)
                }, Be = b._emscripten_bind_btGImpactShapeInterface_getName_0 = function () {
                    return (Be = b._emscripten_bind_btGImpactShapeInterface_getName_0 = b.asm.Jc).apply(null, arguments)
                }, Ce = b._emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0 = function () {
                    return (Ce = b._emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0 =
                        b.asm.Kc).apply(null, arguments)
                }, De = b._emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 = function () {
                    return (De = b._emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 = b.asm.Lc).apply(null, arguments)
                }, Ee = b._emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 = function () {
                    return (Ee = b._emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 = b.asm.Mc).apply(null, arguments)
                }, Fe = b._emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 = function () {
                    return (Fe = b._emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 =
                        b.asm.Nc).apply(null, arguments)
                }, Ge = b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 = function () {
                    return (Ge = b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 = b.asm.Oc).apply(null, arguments)
                }, He = b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 = function () {
                    return (He = b._emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 = b.asm.Pc).apply(null, arguments)
                }, Ie = b._emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 = function () {
                    return (Ie =
                        b._emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 = b.asm.Qc).apply(null, arguments)
                }, Je = b._emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 = function () {
                    return (Je = b._emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 = b.asm.Rc).apply(null, arguments)
                }, Ke = b._emscripten_bind_btGImpactShapeInterface_getChildShape_1 = function () {
                    return (Ke = b._emscripten_bind_btGImpactShapeInterface_getChildShape_1 = b.asm.Sc).apply(null, arguments)
                }, Le = b._emscripten_bind_btGImpactShapeInterface_getChildTransform_1 =
                    function () {
                        return (Le = b._emscripten_bind_btGImpactShapeInterface_getChildTransform_1 = b.asm.Tc).apply(null, arguments)
                    }, Me = b._emscripten_bind_btGImpactShapeInterface_setChildTransform_2 = function () {
                    return (Me = b._emscripten_bind_btGImpactShapeInterface_setChildTransform_2 = b.asm.Uc).apply(null, arguments)
                }, Ne = b._emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 = function () {
                    return (Ne = b._emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 = b.asm.Vc).apply(null, arguments)
                }, Oe = b._emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 =
                    function () {
                        return (Oe = b._emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 = b.asm.Wc).apply(null, arguments)
                    }, Pe = b._emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 = function () {
                    return (Pe = b._emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 = b.asm.Xc).apply(null, arguments)
                }, Qe = b._emscripten_bind_btGImpactShapeInterface___destroy___0 = function () {
                    return (Qe = b._emscripten_bind_btGImpactShapeInterface___destroy___0 = b.asm.Yc).apply(null, arguments)
                }, Re = b._emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 =
                    function () {
                        return (Re = b._emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 = b.asm.Zc).apply(null, arguments)
                    },
                Se = b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 = function () {
                    return (Se = b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 = b.asm._c).apply(null, arguments)
                },
                Te = b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 = function () {
                    return (Te = b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 =
                        b.asm.$c).apply(null, arguments)
                }, Ue = b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 = function () {
                    return (Ue = b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 = b.asm.ad).apply(null, arguments)
                }, Ve = b._emscripten_bind_btDispatcher_getNumManifolds_0 = function () {
                    return (Ve = b._emscripten_bind_btDispatcher_getNumManifolds_0 = b.asm.bd).apply(null, arguments)
                }, We = b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 = function () {
                    return (We = b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 =
                        b.asm.cd).apply(null, arguments)
                }, Xe = b._emscripten_bind_btDispatcher___destroy___0 = function () {
                    return (Xe = b._emscripten_bind_btDispatcher___destroy___0 = b.asm.dd).apply(null, arguments)
                }, Ye = b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3 = function () {
                    return (Ye = b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3 = b.asm.ed).apply(null, arguments)
                }, Ze = b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5 = function () {
                    return (Ze = b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5 =
                        b.asm.fd).apply(null, arguments)
                }, $e = b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1 = function () {
                    return ($e = b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1 = b.asm.gd).apply(null, arguments)
                }, af = b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1 = function () {
                    return (af = b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1 = b.asm.hd).apply(null, arguments)
                }, bf = b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1 = function () {
                    return (bf = b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1 =
                        b.asm.id).apply(null, arguments)
                }, cf = b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1 = function () {
                    return (cf = b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1 = b.asm.jd).apply(null, arguments)
                }, df = b._emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0 = function () {
                    return (df = b._emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0 = b.asm.kd).apply(null, arguments)
                }, ef = b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1 = function () {
                    return (ef = b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1 =
                        b.asm.ld).apply(null, arguments)
                }, ff = b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (ff = b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0 = b.asm.md).apply(null, arguments)
                }, gf = b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1 = function () {
                    return (gf = b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1 = b.asm.nd).apply(null, arguments)
                }, hf = b._emscripten_bind_btGeneric6DofConstraint_getParam_2 = function () {
                    return (hf =
                        b._emscripten_bind_btGeneric6DofConstraint_getParam_2 = b.asm.od).apply(null, arguments)
                }, jf = b._emscripten_bind_btGeneric6DofConstraint_setParam_3 = function () {
                    return (jf = b._emscripten_bind_btGeneric6DofConstraint_setParam_3 = b.asm.pd).apply(null, arguments)
                }, kf = b._emscripten_bind_btGeneric6DofConstraint___destroy___0 = function () {
                    return (kf = b._emscripten_bind_btGeneric6DofConstraint___destroy___0 = b.asm.qd).apply(null, arguments)
                }, lf = b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 = function () {
                    return (lf =
                        b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 = b.asm.rd).apply(null, arguments)
                }, mf = b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 = function () {
                    return (mf = b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 = b.asm.sd).apply(null, arguments)
                }, nf = b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 = function () {
                    return (nf = b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 = b.asm.td).apply(null, arguments)
                }, of = b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 =
                    function () {
                        return (of = b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 = b.asm.ud).apply(null, arguments)
                    }, pf = b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 = function () {
                    return (pf = b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 = b.asm.vd).apply(null, arguments)
                }, qf = b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 = function () {
                    return (qf = b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 = b.asm.wd).apply(null, arguments)
                }, rf = b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 =
                    function () {
                        return (rf = b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 = b.asm.xd).apply(null, arguments)
                    }, sf = b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 = function () {
                    return (sf = b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 = b.asm.yd).apply(null, arguments)
                }, tf = b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 = function () {
                    return (tf = b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 = b.asm.zd).apply(null, arguments)
                }, uf = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 =
                    function () {
                        return (uf = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 = b.asm.Ad).apply(null, arguments)
                    }, vf = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 = function () {
                    return (vf = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 = b.asm.Bd).apply(null, arguments)
                }, wf = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 = function () {
                    return (wf = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 = b.asm.Cd).apply(null, arguments)
                }, xf = b._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 =
                    function () {
                        return (xf = b._emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 = b.asm.Dd).apply(null, arguments)
                    }, yf = b._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 = function () {
                    return (yf = b._emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 = b.asm.Ed).apply(null, arguments)
                }, zf = b._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 = function () {
                    return (zf = b._emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 = b.asm.Fd).apply(null,
                        arguments)
                }, Af = b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 = function () {
                    return (Af = b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 = b.asm.Gd).apply(null, arguments)
                }, Bf = b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 = function () {
                    return (Bf = b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 = b.asm.Hd).apply(null, arguments)
                }, Cf = b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 = function () {
                    return (Cf = b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 = b.asm.Id).apply(null,
                        arguments)
                }, Df = b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 = function () {
                    return (Df = b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 = b.asm.Jd).apply(null, arguments)
                }, Ef = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 = function () {
                    return (Ef = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 = b.asm.Kd).apply(null, arguments)
                }, Ff = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 = function () {
                    return (Ff = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 =
                        b.asm.Ld).apply(null, arguments)
                }, Gf = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 = function () {
                    return (Gf = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 = b.asm.Md).apply(null, arguments)
                }, Hf = b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 = function () {
                    return (Hf = b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 = b.asm.Nd).apply(null, arguments)
                }, If = b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 = function () {
                    return (If = b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 =
                        b.asm.Od).apply(null, arguments)
                }, Jf = b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 = function () {
                    return (Jf = b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 = b.asm.Pd).apply(null, arguments)
                }, Kf = b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 = function () {
                    return (Kf = b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 = b.asm.Qd).apply(null, arguments)
                }, Lf = b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 = function () {
                    return (Lf = b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 =
                        b.asm.Rd).apply(null, arguments)
                }, Mf = b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 = function () {
                    return (Mf = b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 = b.asm.Sd).apply(null, arguments)
                }, Nf = b._emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1 = function () {
                    return (Nf = b._emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1 = b.asm.Td).apply(null, arguments)
                }, Of = b._emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0 = function () {
                    return (Of = b._emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0 =
                        b.asm.Ud).apply(null, arguments)
                }, Pf = b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0 = function () {
                    return (Pf = b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0 = b.asm.Vd).apply(null, arguments)
                }, Qf = b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3 = function () {
                    return (Qf = b._emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3 = b.asm.Wd).apply(null, arguments)
                }, Rf = b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 = function () {
                    return (Rf = b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 =
                        b.asm.Xd).apply(null, arguments)
                }, Sf = b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 = function () {
                    return (Sf = b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 = b.asm.Yd).apply(null, arguments)
                }, Tf = b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 = function () {
                    return (Tf = b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 = b.asm.Zd).apply(null, arguments)
                }, Uf = b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 = function () {
                    return (Uf = b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 =
                        b.asm._d).apply(null, arguments)
                }, Vf = b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 = function () {
                    return (Vf = b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 = b.asm.$d).apply(null, arguments)
                }, Wf = b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 = function () {
                    return (Wf = b._emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 = b.asm.ae).apply(null, arguments)
                }, Xf = b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 = function () {
                    return (Xf =
                        b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 = b.asm.be).apply(null, arguments)
                }, Yf = b._emscripten_bind_btVehicleRaycaster_castRay_3 = function () {
                    return (Yf = b._emscripten_bind_btVehicleRaycaster_castRay_3 = b.asm.ce).apply(null, arguments)
                }, Zf = b._emscripten_bind_btVehicleRaycaster___destroy___0 = function () {
                    return (Zf = b._emscripten_bind_btVehicleRaycaster___destroy___0 = b.asm.de).apply(null, arguments)
                }, $f = b._emscripten_bind_btActionInterface_updateAction_2 = function () {
                    return ($f = b._emscripten_bind_btActionInterface_updateAction_2 =
                        b.asm.ee).apply(null, arguments)
                }, ag = b._emscripten_bind_btActionInterface___destroy___0 = function () {
                    return (ag = b._emscripten_bind_btActionInterface___destroy___0 = b.asm.fe).apply(null, arguments)
                }, bg = b._emscripten_bind_btGhostObject_btGhostObject_0 = function () {
                    return (bg = b._emscripten_bind_btGhostObject_btGhostObject_0 = b.asm.ge).apply(null, arguments)
                }, cg = b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0 = function () {
                    return (cg = b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0 = b.asm.he).apply(null,
                        arguments)
                }, dg = b._emscripten_bind_btGhostObject_getOverlappingObject_1 = function () {
                    return (dg = b._emscripten_bind_btGhostObject_getOverlappingObject_1 = b.asm.ie).apply(null, arguments)
                }, eg = b._emscripten_bind_btGhostObject_setAnisotropicFriction_2 = function () {
                    return (eg = b._emscripten_bind_btGhostObject_setAnisotropicFriction_2 = b.asm.je).apply(null, arguments)
                }, fg = b._emscripten_bind_btGhostObject_getCollisionShape_0 = function () {
                    return (fg = b._emscripten_bind_btGhostObject_getCollisionShape_0 = b.asm.ke).apply(null,
                        arguments)
                }, gg = b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1 = function () {
                    return (gg = b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1 = b.asm.le).apply(null, arguments)
                }, hg = b._emscripten_bind_btGhostObject_setActivationState_1 = function () {
                    return (hg = b._emscripten_bind_btGhostObject_setActivationState_1 = b.asm.me).apply(null, arguments)
                }, ig = b._emscripten_bind_btGhostObject_forceActivationState_1 = function () {
                    return (ig = b._emscripten_bind_btGhostObject_forceActivationState_1 = b.asm.ne).apply(null,
                        arguments)
                }, jg = b._emscripten_bind_btGhostObject_activate_0 = function () {
                    return (jg = b._emscripten_bind_btGhostObject_activate_0 = b.asm.oe).apply(null, arguments)
                }, kg = b._emscripten_bind_btGhostObject_activate_1 = function () {
                    return (kg = b._emscripten_bind_btGhostObject_activate_1 = b.asm.pe).apply(null, arguments)
                }, lg = b._emscripten_bind_btGhostObject_isActive_0 = function () {
                    return (lg = b._emscripten_bind_btGhostObject_isActive_0 = b.asm.qe).apply(null, arguments)
                }, mg = b._emscripten_bind_btGhostObject_isKinematicObject_0 =
                    function () {
                        return (mg = b._emscripten_bind_btGhostObject_isKinematicObject_0 = b.asm.re).apply(null, arguments)
                    }, ng = b._emscripten_bind_btGhostObject_isStaticObject_0 = function () {
                    return (ng = b._emscripten_bind_btGhostObject_isStaticObject_0 = b.asm.se).apply(null, arguments)
                }, og = b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0 = function () {
                    return (og = b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0 = b.asm.te).apply(null, arguments)
                }, pg = b._emscripten_bind_btGhostObject_getRestitution_0 = function () {
                    return (pg =
                        b._emscripten_bind_btGhostObject_getRestitution_0 = b.asm.ue).apply(null, arguments)
                }, qg = b._emscripten_bind_btGhostObject_getFriction_0 = function () {
                    return (qg = b._emscripten_bind_btGhostObject_getFriction_0 = b.asm.ve).apply(null, arguments)
                }, rg = b._emscripten_bind_btGhostObject_getRollingFriction_0 = function () {
                    return (rg = b._emscripten_bind_btGhostObject_getRollingFriction_0 = b.asm.we).apply(null, arguments)
                }, sg = b._emscripten_bind_btGhostObject_setRestitution_1 = function () {
                    return (sg = b._emscripten_bind_btGhostObject_setRestitution_1 =
                        b.asm.xe).apply(null, arguments)
                }, tg = b._emscripten_bind_btGhostObject_setFriction_1 = function () {
                    return (tg = b._emscripten_bind_btGhostObject_setFriction_1 = b.asm.ye).apply(null, arguments)
                }, ug = b._emscripten_bind_btGhostObject_setRollingFriction_1 = function () {
                    return (ug = b._emscripten_bind_btGhostObject_setRollingFriction_1 = b.asm.ze).apply(null, arguments)
                }, vg = b._emscripten_bind_btGhostObject_getWorldTransform_0 = function () {
                    return (vg = b._emscripten_bind_btGhostObject_getWorldTransform_0 = b.asm.Ae).apply(null, arguments)
                },
                wg = b._emscripten_bind_btGhostObject_getCollisionFlags_0 = function () {
                    return (wg = b._emscripten_bind_btGhostObject_getCollisionFlags_0 = b.asm.Be).apply(null, arguments)
                }, xg = b._emscripten_bind_btGhostObject_setCollisionFlags_1 = function () {
                    return (xg = b._emscripten_bind_btGhostObject_setCollisionFlags_1 = b.asm.Ce).apply(null, arguments)
                }, yg = b._emscripten_bind_btGhostObject_setWorldTransform_1 = function () {
                    return (yg = b._emscripten_bind_btGhostObject_setWorldTransform_1 = b.asm.De).apply(null, arguments)
                }, zg = b._emscripten_bind_btGhostObject_setCollisionShape_1 =
                    function () {
                        return (zg = b._emscripten_bind_btGhostObject_setCollisionShape_1 = b.asm.Ee).apply(null, arguments)
                    }, Ag = b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1 = function () {
                    return (Ag = b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1 = b.asm.Fe).apply(null, arguments)
                }, Bg = b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1 = function () {
                    return (Bg = b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1 = b.asm.Ge).apply(null, arguments)
                }, Cg = b._emscripten_bind_btGhostObject_getUserIndex_0 =
                    function () {
                        return (Cg = b._emscripten_bind_btGhostObject_getUserIndex_0 = b.asm.He).apply(null, arguments)
                    }, Dg = b._emscripten_bind_btGhostObject_setUserIndex_1 = function () {
                    return (Dg = b._emscripten_bind_btGhostObject_setUserIndex_1 = b.asm.Ie).apply(null, arguments)
                }, Eg = b._emscripten_bind_btGhostObject_getUserPointer_0 = function () {
                    return (Eg = b._emscripten_bind_btGhostObject_getUserPointer_0 = b.asm.Je).apply(null, arguments)
                }, Fg = b._emscripten_bind_btGhostObject_setUserPointer_1 = function () {
                    return (Fg = b._emscripten_bind_btGhostObject_setUserPointer_1 =
                        b.asm.Ke).apply(null, arguments)
                }, Gg = b._emscripten_bind_btGhostObject_getBroadphaseHandle_0 = function () {
                    return (Gg = b._emscripten_bind_btGhostObject_getBroadphaseHandle_0 = b.asm.Le).apply(null, arguments)
                }, Hg = b._emscripten_bind_btGhostObject___destroy___0 = function () {
                    return (Hg = b._emscripten_bind_btGhostObject___destroy___0 = b.asm.Me).apply(null, arguments)
                }, Ig = b._emscripten_bind_btSoftBodySolver___destroy___0 = function () {
                    return (Ig = b._emscripten_bind_btSoftBodySolver___destroy___0 = b.asm.Ne).apply(null, arguments)
                },
                Jg = b._emscripten_bind_VoidPtr___destroy___0 = function () {
                    return (Jg = b._emscripten_bind_VoidPtr___destroy___0 = b.asm.Oe).apply(null, arguments)
                }, Kg = b._emscripten_bind_DebugDrawer_DebugDrawer_0 = function () {
                    return (Kg = b._emscripten_bind_DebugDrawer_DebugDrawer_0 = b.asm.Pe).apply(null, arguments)
                }, Lg = b._emscripten_bind_DebugDrawer_drawLine_3 = function () {
                    return (Lg = b._emscripten_bind_DebugDrawer_drawLine_3 = b.asm.Qe).apply(null, arguments)
                }, Mg = b._emscripten_bind_DebugDrawer_drawContactPoint_5 = function () {
                    return (Mg =
                        b._emscripten_bind_DebugDrawer_drawContactPoint_5 = b.asm.Re).apply(null, arguments)
                }, Ng = b._emscripten_bind_DebugDrawer_reportErrorWarning_1 = function () {
                    return (Ng = b._emscripten_bind_DebugDrawer_reportErrorWarning_1 = b.asm.Se).apply(null, arguments)
                }, Og = b._emscripten_bind_DebugDrawer_draw3dText_2 = function () {
                    return (Og = b._emscripten_bind_DebugDrawer_draw3dText_2 = b.asm.Te).apply(null, arguments)
                }, Pg = b._emscripten_bind_DebugDrawer_setDebugMode_1 = function () {
                    return (Pg = b._emscripten_bind_DebugDrawer_setDebugMode_1 =
                        b.asm.Ue).apply(null, arguments)
                }, Qg = b._emscripten_bind_DebugDrawer_getDebugMode_0 = function () {
                    return (Qg = b._emscripten_bind_DebugDrawer_getDebugMode_0 = b.asm.Ve).apply(null, arguments)
                }, Rg = b._emscripten_bind_DebugDrawer___destroy___0 = function () {
                    return (Rg = b._emscripten_bind_DebugDrawer___destroy___0 = b.asm.We).apply(null, arguments)
                }, Sg = b._emscripten_bind_btVector4_btVector4_0 = function () {
                    return (Sg = b._emscripten_bind_btVector4_btVector4_0 = b.asm.Xe).apply(null, arguments)
                }, Tg = b._emscripten_bind_btVector4_btVector4_4 =
                    function () {
                        return (Tg = b._emscripten_bind_btVector4_btVector4_4 = b.asm.Ye).apply(null, arguments)
                    }, Ug = b._emscripten_bind_btVector4_w_0 = function () {
                    return (Ug = b._emscripten_bind_btVector4_w_0 = b.asm.Ze).apply(null, arguments)
                }, Vg = b._emscripten_bind_btVector4_setValue_4 = function () {
                    return (Vg = b._emscripten_bind_btVector4_setValue_4 = b.asm._e).apply(null, arguments)
                }, Wg = b._emscripten_bind_btVector4_length_0 = function () {
                    return (Wg = b._emscripten_bind_btVector4_length_0 = b.asm.$e).apply(null, arguments)
                }, Xg = b._emscripten_bind_btVector4_x_0 =
                    function () {
                        return (Xg = b._emscripten_bind_btVector4_x_0 = b.asm.af).apply(null, arguments)
                    }, Yg = b._emscripten_bind_btVector4_y_0 = function () {
                    return (Yg = b._emscripten_bind_btVector4_y_0 = b.asm.bf).apply(null, arguments)
                }, Zg = b._emscripten_bind_btVector4_z_0 = function () {
                    return (Zg = b._emscripten_bind_btVector4_z_0 = b.asm.cf).apply(null, arguments)
                }, $g = b._emscripten_bind_btVector4_setX_1 = function () {
                    return ($g = b._emscripten_bind_btVector4_setX_1 = b.asm.df).apply(null, arguments)
                }, ah = b._emscripten_bind_btVector4_setY_1 =
                    function () {
                        return (ah = b._emscripten_bind_btVector4_setY_1 = b.asm.ef).apply(null, arguments)
                    }, bh = b._emscripten_bind_btVector4_setZ_1 = function () {
                    return (bh = b._emscripten_bind_btVector4_setZ_1 = b.asm.ff).apply(null, arguments)
                }, ch = b._emscripten_bind_btVector4_normalize_0 = function () {
                    return (ch = b._emscripten_bind_btVector4_normalize_0 = b.asm.gf).apply(null, arguments)
                }, dh = b._emscripten_bind_btVector4_rotate_2 = function () {
                    return (dh = b._emscripten_bind_btVector4_rotate_2 = b.asm.hf).apply(null, arguments)
                }, eh = b._emscripten_bind_btVector4_dot_1 =
                    function () {
                        return (eh = b._emscripten_bind_btVector4_dot_1 = b.asm.jf).apply(null, arguments)
                    }, fh = b._emscripten_bind_btVector4_op_mul_1 = function () {
                    return (fh = b._emscripten_bind_btVector4_op_mul_1 = b.asm.kf).apply(null, arguments)
                }, gh = b._emscripten_bind_btVector4_op_add_1 = function () {
                    return (gh = b._emscripten_bind_btVector4_op_add_1 = b.asm.lf).apply(null, arguments)
                }, hh = b._emscripten_bind_btVector4_op_sub_1 = function () {
                    return (hh = b._emscripten_bind_btVector4_op_sub_1 = b.asm.mf).apply(null, arguments)
                }, ih = b._emscripten_bind_btVector4___destroy___0 =
                    function () {
                        return (ih = b._emscripten_bind_btVector4___destroy___0 = b.asm.nf).apply(null, arguments)
                    }, jh = b._emscripten_bind_btQuaternion_btQuaternion_4 = function () {
                    return (jh = b._emscripten_bind_btQuaternion_btQuaternion_4 = b.asm.of).apply(null, arguments)
                }, kh = b._emscripten_bind_btQuaternion_setValue_4 = function () {
                    return (kh = b._emscripten_bind_btQuaternion_setValue_4 = b.asm.pf).apply(null, arguments)
                }, lh = b._emscripten_bind_btQuaternion_setEulerZYX_3 = function () {
                    return (lh = b._emscripten_bind_btQuaternion_setEulerZYX_3 =
                        b.asm.qf).apply(null, arguments)
                }, mh = b._emscripten_bind_btQuaternion_setRotation_2 = function () {
                    return (mh = b._emscripten_bind_btQuaternion_setRotation_2 = b.asm.rf).apply(null, arguments)
                }, nh = b._emscripten_bind_btQuaternion_normalize_0 = function () {
                    return (nh = b._emscripten_bind_btQuaternion_normalize_0 = b.asm.sf).apply(null, arguments)
                }, oh = b._emscripten_bind_btQuaternion_length2_0 = function () {
                    return (oh = b._emscripten_bind_btQuaternion_length2_0 = b.asm.tf).apply(null, arguments)
                }, ph = b._emscripten_bind_btQuaternion_length_0 =
                    function () {
                        return (ph = b._emscripten_bind_btQuaternion_length_0 = b.asm.uf).apply(null, arguments)
                    }, qh = b._emscripten_bind_btQuaternion_dot_1 = function () {
                    return (qh = b._emscripten_bind_btQuaternion_dot_1 = b.asm.vf).apply(null, arguments)
                }, rh = b._emscripten_bind_btQuaternion_normalized_0 = function () {
                    return (rh = b._emscripten_bind_btQuaternion_normalized_0 = b.asm.wf).apply(null, arguments)
                }, sh = b._emscripten_bind_btQuaternion_getAxis_0 = function () {
                    return (sh = b._emscripten_bind_btQuaternion_getAxis_0 = b.asm.xf).apply(null,
                        arguments)
                }, th = b._emscripten_bind_btQuaternion_inverse_0 = function () {
                    return (th = b._emscripten_bind_btQuaternion_inverse_0 = b.asm.yf).apply(null, arguments)
                }, uh = b._emscripten_bind_btQuaternion_getAngle_0 = function () {
                    return (uh = b._emscripten_bind_btQuaternion_getAngle_0 = b.asm.zf).apply(null, arguments)
                }, vh = b._emscripten_bind_btQuaternion_getAngleShortestPath_0 = function () {
                    return (vh = b._emscripten_bind_btQuaternion_getAngleShortestPath_0 = b.asm.Af).apply(null, arguments)
                }, wh = b._emscripten_bind_btQuaternion_angle_1 =
                    function () {
                        return (wh = b._emscripten_bind_btQuaternion_angle_1 = b.asm.Bf).apply(null, arguments)
                    }, xh = b._emscripten_bind_btQuaternion_angleShortestPath_1 = function () {
                    return (xh = b._emscripten_bind_btQuaternion_angleShortestPath_1 = b.asm.Cf).apply(null, arguments)
                }, yh = b._emscripten_bind_btQuaternion_op_add_1 = function () {
                    return (yh = b._emscripten_bind_btQuaternion_op_add_1 = b.asm.Df).apply(null, arguments)
                }, zh = b._emscripten_bind_btQuaternion_op_sub_1 = function () {
                    return (zh = b._emscripten_bind_btQuaternion_op_sub_1 = b.asm.Ef).apply(null,
                        arguments)
                }, Ah = b._emscripten_bind_btQuaternion_op_mul_1 = function () {
                    return (Ah = b._emscripten_bind_btQuaternion_op_mul_1 = b.asm.Ff).apply(null, arguments)
                }, Bh = b._emscripten_bind_btQuaternion_op_mulq_1 = function () {
                    return (Bh = b._emscripten_bind_btQuaternion_op_mulq_1 = b.asm.Gf).apply(null, arguments)
                }, Ch = b._emscripten_bind_btQuaternion_op_div_1 = function () {
                    return (Ch = b._emscripten_bind_btQuaternion_op_div_1 = b.asm.Hf).apply(null, arguments)
                }, Dh = b._emscripten_bind_btQuaternion_x_0 = function () {
                    return (Dh = b._emscripten_bind_btQuaternion_x_0 =
                        b.asm.If).apply(null, arguments)
                }, Eh = b._emscripten_bind_btQuaternion_y_0 = function () {
                    return (Eh = b._emscripten_bind_btQuaternion_y_0 = b.asm.Jf).apply(null, arguments)
                }, Fh = b._emscripten_bind_btQuaternion_z_0 = function () {
                    return (Fh = b._emscripten_bind_btQuaternion_z_0 = b.asm.Kf).apply(null, arguments)
                }, Gh = b._emscripten_bind_btQuaternion_w_0 = function () {
                    return (Gh = b._emscripten_bind_btQuaternion_w_0 = b.asm.Lf).apply(null, arguments)
                }, Hh = b._emscripten_bind_btQuaternion_setX_1 = function () {
                    return (Hh = b._emscripten_bind_btQuaternion_setX_1 =
                        b.asm.Mf).apply(null, arguments)
                }, Ih = b._emscripten_bind_btQuaternion_setY_1 = function () {
                    return (Ih = b._emscripten_bind_btQuaternion_setY_1 = b.asm.Nf).apply(null, arguments)
                }, Jh = b._emscripten_bind_btQuaternion_setZ_1 = function () {
                    return (Jh = b._emscripten_bind_btQuaternion_setZ_1 = b.asm.Of).apply(null, arguments)
                }, Kh = b._emscripten_bind_btQuaternion_setW_1 = function () {
                    return (Kh = b._emscripten_bind_btQuaternion_setW_1 = b.asm.Pf).apply(null, arguments)
                }, Lh = b._emscripten_bind_btQuaternion___destroy___0 = function () {
                    return (Lh =
                        b._emscripten_bind_btQuaternion___destroy___0 = b.asm.Qf).apply(null, arguments)
                }, Mh = b._emscripten_bind_btMatrix3x3_setEulerZYX_3 = function () {
                    return (Mh = b._emscripten_bind_btMatrix3x3_setEulerZYX_3 = b.asm.Rf).apply(null, arguments)
                }, Nh = b._emscripten_bind_btMatrix3x3_getRotation_1 = function () {
                    return (Nh = b._emscripten_bind_btMatrix3x3_getRotation_1 = b.asm.Sf).apply(null, arguments)
                }, Oh = b._emscripten_bind_btMatrix3x3_getRow_1 = function () {
                    return (Oh = b._emscripten_bind_btMatrix3x3_getRow_1 = b.asm.Tf).apply(null, arguments)
                },
                Ph = b._emscripten_bind_btMatrix3x3___destroy___0 = function () {
                    return (Ph = b._emscripten_bind_btMatrix3x3___destroy___0 = b.asm.Uf).apply(null, arguments)
                }, Qh = b._emscripten_bind_btTransform_btTransform_0 = function () {
                    return (Qh = b._emscripten_bind_btTransform_btTransform_0 = b.asm.Vf).apply(null, arguments)
                }, Rh = b._emscripten_bind_btTransform_btTransform_2 = function () {
                    return (Rh = b._emscripten_bind_btTransform_btTransform_2 = b.asm.Wf).apply(null, arguments)
                }, Sh = b._emscripten_bind_btTransform_setIdentity_0 = function () {
                    return (Sh =
                        b._emscripten_bind_btTransform_setIdentity_0 = b.asm.Xf).apply(null, arguments)
                }, Th = b._emscripten_bind_btTransform_setOrigin_1 = function () {
                    return (Th = b._emscripten_bind_btTransform_setOrigin_1 = b.asm.Yf).apply(null, arguments)
                }, Uh = b._emscripten_bind_btTransform_setRotation_1 = function () {
                    return (Uh = b._emscripten_bind_btTransform_setRotation_1 = b.asm.Zf).apply(null, arguments)
                }, Vh = b._emscripten_bind_btTransform_getOrigin_0 = function () {
                    return (Vh = b._emscripten_bind_btTransform_getOrigin_0 = b.asm._f).apply(null, arguments)
                },
                Wh = b._emscripten_bind_btTransform_getRotation_0 = function () {
                    return (Wh = b._emscripten_bind_btTransform_getRotation_0 = b.asm.$f).apply(null, arguments)
                }, Xh = b._emscripten_bind_btTransform_getBasis_0 = function () {
                    return (Xh = b._emscripten_bind_btTransform_getBasis_0 = b.asm.ag).apply(null, arguments)
                }, Yh = b._emscripten_bind_btTransform_setFromOpenGLMatrix_1 = function () {
                    return (Yh = b._emscripten_bind_btTransform_setFromOpenGLMatrix_1 = b.asm.bg).apply(null, arguments)
                }, Zh = b._emscripten_bind_btTransform_inverse_0 = function () {
                    return (Zh =
                        b._emscripten_bind_btTransform_inverse_0 = b.asm.cg).apply(null, arguments)
                }, $h = b._emscripten_bind_btTransform_op_mul_1 = function () {
                    return ($h = b._emscripten_bind_btTransform_op_mul_1 = b.asm.dg).apply(null, arguments)
                }, ai = b._emscripten_bind_btTransform___destroy___0 = function () {
                    return (ai = b._emscripten_bind_btTransform___destroy___0 = b.asm.eg).apply(null, arguments)
                }, bi = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 = function () {
                    return (bi = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 =
                        b.asm.fg).apply(null, arguments)
                }, ci = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 = function () {
                    return (ci = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 = b.asm.gg).apply(null, arguments)
                }, di = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 = function () {
                    return (di = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 = b.asm.hg).apply(null, arguments)
                }, ei = b._emscripten_bind_btDefaultMotionState_getWorldTransform_1 = function () {
                    return (ei = b._emscripten_bind_btDefaultMotionState_getWorldTransform_1 =
                        b.asm.ig).apply(null, arguments)
                }, fi = b._emscripten_bind_btDefaultMotionState_setWorldTransform_1 = function () {
                    return (fi = b._emscripten_bind_btDefaultMotionState_setWorldTransform_1 = b.asm.jg).apply(null, arguments)
                }, gi = b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 = function () {
                    return (gi = b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 = b.asm.kg).apply(null, arguments)
                }, hi = b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 = function () {
                    return (hi = b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 =
                        b.asm.lg).apply(null, arguments)
                }, ii = b._emscripten_bind_btDefaultMotionState___destroy___0 = function () {
                    return (ii = b._emscripten_bind_btDefaultMotionState___destroy___0 = b.asm.mg).apply(null, arguments)
                }, ji = b._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 = function () {
                    return (ji = b._emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 = b.asm.ng).apply(null, arguments)
                }, ki = b._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 = function () {
                    return (ki = b._emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 =
                        b.asm.og).apply(null, arguments)
                }, li = b._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 = function () {
                    return (li = b._emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 = b.asm.pg).apply(null, arguments)
                }, mi = b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 = function () {
                    return (mi = b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 = b.asm.qg).apply(null, arguments)
                }, ni = b._emscripten_bind_ClosestRayResultCallback_hasHit_0 = function () {
                    return (ni = b._emscripten_bind_ClosestRayResultCallback_hasHit_0 =
                        b.asm.rg).apply(null, arguments)
                }, oi = b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 = function () {
                    return (oi = b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 = b.asm.sg).apply(null, arguments)
                }, pi = b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 = function () {
                    return (pi = b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 = b.asm.tg).apply(null, arguments)
                }, qi = b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 = function () {
                    return (qi = b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 =
                        b.asm.ug).apply(null, arguments)
                }, ri = b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 = function () {
                    return (ri = b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 = b.asm.vg).apply(null, arguments)
                }, si = b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 = function () {
                    return (si = b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 = b.asm.wg).apply(null, arguments)
                }, ti = b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 = function () {
                    return (ti = b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 =
                        b.asm.xg).apply(null, arguments)
                }, ui = b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 = function () {
                    return (ui = b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 = b.asm.yg).apply(null, arguments)
                }, vi = b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 = function () {
                    return (vi = b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 = b.asm.zg).apply(null, arguments)
                }, wi = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 = function () {
                    return (wi =
                        b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 = b.asm.Ag).apply(null, arguments)
                }, xi = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 = function () {
                    return (xi = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 = b.asm.Bg).apply(null, arguments)
                }, yi = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 = function () {
                    return (yi = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 = b.asm.Cg).apply(null, arguments)
                },
                zi = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 = function () {
                    return (zi = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 = b.asm.Dg).apply(null, arguments)
                }, Ai = b._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 = function () {
                    return (Ai = b._emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 = b.asm.Eg).apply(null, arguments)
                }, Bi = b._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 = function () {
                    return (Bi = b._emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 =
                        b.asm.Fg).apply(null, arguments)
                }, Ci = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 = function () {
                    return (Ci = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 = b.asm.Gg).apply(null, arguments)
                }, Di = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 = function () {
                    return (Di = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 = b.asm.Hg).apply(null, arguments)
                }, Ei = b._emscripten_bind_ClosestRayResultCallback_get_m_flags_0 = function () {
                    return (Ei =
                        b._emscripten_bind_ClosestRayResultCallback_get_m_flags_0 = b.asm.Ig).apply(null, arguments)
                }, Fi = b._emscripten_bind_ClosestRayResultCallback_set_m_flags_1 = function () {
                    return (Fi = b._emscripten_bind_ClosestRayResultCallback_set_m_flags_1 = b.asm.Jg).apply(null, arguments)
                }, Gi = b._emscripten_bind_ClosestRayResultCallback___destroy___0 = function () {
                    return (Gi = b._emscripten_bind_ClosestRayResultCallback___destroy___0 = b.asm.Kg).apply(null, arguments)
                }, Hi = b._emscripten_bind_btConstCollisionObjectArray_size_0 = function () {
                    return (Hi =
                        b._emscripten_bind_btConstCollisionObjectArray_size_0 = b.asm.Lg).apply(null, arguments)
                }, Ii = b._emscripten_bind_btConstCollisionObjectArray_at_1 = function () {
                    return (Ii = b._emscripten_bind_btConstCollisionObjectArray_at_1 = b.asm.Mg).apply(null, arguments)
                }, Ji = b._emscripten_bind_btConstCollisionObjectArray___destroy___0 = function () {
                    return (Ji = b._emscripten_bind_btConstCollisionObjectArray___destroy___0 = b.asm.Ng).apply(null, arguments)
                }, Ki = b._emscripten_bind_btScalarArray_size_0 = function () {
                    return (Ki = b._emscripten_bind_btScalarArray_size_0 =
                        b.asm.Og).apply(null, arguments)
                }, Li = b._emscripten_bind_btScalarArray_at_1 = function () {
                    return (Li = b._emscripten_bind_btScalarArray_at_1 = b.asm.Pg).apply(null, arguments)
                }, Mi = b._emscripten_bind_btScalarArray___destroy___0 = function () {
                    return (Mi = b._emscripten_bind_btScalarArray___destroy___0 = b.asm.Qg).apply(null, arguments)
                }, Ni = b._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 = function () {
                    return (Ni = b._emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 = b.asm.Rg).apply(null,
                        arguments)
                }, Oi = b._emscripten_bind_AllHitsRayResultCallback_hasHit_0 = function () {
                    return (Oi = b._emscripten_bind_AllHitsRayResultCallback_hasHit_0 = b.asm.Sg).apply(null, arguments)
                }, Pi = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 = function () {
                    return (Pi = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 = b.asm.Tg).apply(null, arguments)
                }, Qi = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 = function () {
                    return (Qi = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 =
                        b.asm.Ug).apply(null, arguments)
                }, Ri = b._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 = function () {
                    return (Ri = b._emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 = b.asm.Vg).apply(null, arguments)
                }, Si = b._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 = function () {
                    return (Si = b._emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 = b.asm.Wg).apply(null, arguments)
                }, Ti = b._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 = function () {
                    return (Ti = b._emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 =
                        b.asm.Xg).apply(null, arguments)
                }, Ui = b._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 = function () {
                    return (Ui = b._emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 = b.asm.Yg).apply(null, arguments)
                }, Vi = b._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 = function () {
                    return (Vi = b._emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 = b.asm.Zg).apply(null, arguments)
                }, Wi = b._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 = function () {
                    return (Wi = b._emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 =
                        b.asm._g).apply(null, arguments)
                }, Xi = b._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 = function () {
                    return (Xi = b._emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 = b.asm.$g).apply(null, arguments)
                }, Yi = b._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 = function () {
                    return (Yi = b._emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 = b.asm.ah).apply(null, arguments)
                }, Zi = b._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 = function () {
                    return (Zi = b._emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 =
                        b.asm.bh).apply(null, arguments)
                }, $i = b._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 = function () {
                    return ($i = b._emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 = b.asm.ch).apply(null, arguments)
                }, aj = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 = function () {
                    return (aj = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 = b.asm.dh).apply(null, arguments)
                }, bj = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 = function () {
                    return (bj =
                        b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 = b.asm.eh).apply(null, arguments)
                }, cj = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 = function () {
                    return (cj = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 = b.asm.fh).apply(null, arguments)
                }, dj = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 = function () {
                    return (dj = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 = b.asm.gh).apply(null, arguments)
                },
                ej = b._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 = function () {
                    return (ej = b._emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 = b.asm.hh).apply(null, arguments)
                }, fj = b._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 = function () {
                    return (fj = b._emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 = b.asm.ih).apply(null, arguments)
                }, gj = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 = function () {
                    return (gj = b._emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 =
                        b.asm.jh).apply(null, arguments)
                }, hj = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 = function () {
                    return (hj = b._emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 = b.asm.kh).apply(null, arguments)
                }, ij = b._emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 = function () {
                    return (ij = b._emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 = b.asm.lh).apply(null, arguments)
                }, jj = b._emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 = function () {
                    return (jj = b._emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 =
                        b.asm.mh).apply(null, arguments)
                }, kj = b._emscripten_bind_AllHitsRayResultCallback___destroy___0 = function () {
                    return (kj = b._emscripten_bind_AllHitsRayResultCallback___destroy___0 = b.asm.nh).apply(null, arguments)
                }, lj = b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 = function () {
                    return (lj = b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 = b.asm.oh).apply(null, arguments)
                }, mj = b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 = function () {
                    return (mj = b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 =
                        b.asm.ph).apply(null, arguments)
                }, nj = b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 = function () {
                    return (nj = b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 = b.asm.qh).apply(null, arguments)
                }, oj = b._emscripten_bind_btManifoldPoint_getDistance_0 = function () {
                    return (oj = b._emscripten_bind_btManifoldPoint_getDistance_0 = b.asm.rh).apply(null, arguments)
                }, pj = b._emscripten_bind_btManifoldPoint_get_m_localPointA_0 = function () {
                    return (pj = b._emscripten_bind_btManifoldPoint_get_m_localPointA_0 = b.asm.sh).apply(null,
                        arguments)
                }, qj = b._emscripten_bind_btManifoldPoint_set_m_localPointA_1 = function () {
                    return (qj = b._emscripten_bind_btManifoldPoint_set_m_localPointA_1 = b.asm.th).apply(null, arguments)
                }, rj = b._emscripten_bind_btManifoldPoint_get_m_localPointB_0 = function () {
                    return (rj = b._emscripten_bind_btManifoldPoint_get_m_localPointB_0 = b.asm.uh).apply(null, arguments)
                }, sj = b._emscripten_bind_btManifoldPoint_set_m_localPointB_1 = function () {
                    return (sj = b._emscripten_bind_btManifoldPoint_set_m_localPointB_1 = b.asm.vh).apply(null,
                        arguments)
                }, tj = b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 = function () {
                    return (tj = b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 = b.asm.wh).apply(null, arguments)
                }, uj = b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 = function () {
                    return (uj = b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 = b.asm.xh).apply(null, arguments)
                }, vj = b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 = function () {
                    return (vj = b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 =
                        b.asm.yh).apply(null, arguments)
                }, wj = b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 = function () {
                    return (wj = b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 = b.asm.zh).apply(null, arguments)
                }, xj = b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 = function () {
                    return (xj = b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 = b.asm.Ah).apply(null, arguments)
                }, yj = b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 = function () {
                    return (yj = b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 =
                        b.asm.Bh).apply(null, arguments)
                }, zj = b._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 = function () {
                    return (zj = b._emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 = b.asm.Ch).apply(null, arguments)
                }, Aj = b._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 = function () {
                    return (Aj = b._emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 = b.asm.Dh).apply(null, arguments)
                }, Bj = b._emscripten_bind_btManifoldPoint___destroy___0 = function () {
                    return (Bj = b._emscripten_bind_btManifoldPoint___destroy___0 =
                        b.asm.Eh).apply(null, arguments)
                }, Cj = b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 = function () {
                    return (Cj = b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 = b.asm.Fh).apply(null, arguments)
                }, Dj = b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 = function () {
                    return (Dj = b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 = b.asm.Gh).apply(null, arguments)
                }, Ej = b._emscripten_bind_ConcreteContactResultCallback___destroy___0 =
                    function () {
                        return (Ej = b._emscripten_bind_ConcreteContactResultCallback___destroy___0 = b.asm.Hh).apply(null, arguments)
                    }, Fj = b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 = function () {
                    return (Fj = b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 = b.asm.Ih).apply(null, arguments)
                }, Gj = b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 = function () {
                    return (Gj = b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 = b.asm.Jh).apply(null, arguments)
                }, Hj = b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 = function () {
                    return (Hj =
                        b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 = b.asm.Kh).apply(null, arguments)
                }, Ij = b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 = function () {
                    return (Ij = b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 = b.asm.Lh).apply(null, arguments)
                }, Jj = b._emscripten_bind_LocalShapeInfo___destroy___0 = function () {
                    return (Jj = b._emscripten_bind_LocalShapeInfo___destroy___0 = b.asm.Mh).apply(null, arguments)
                }, Kj = b._emscripten_bind_LocalConvexResult_LocalConvexResult_5 = function () {
                    return (Kj = b._emscripten_bind_LocalConvexResult_LocalConvexResult_5 =
                        b.asm.Nh).apply(null, arguments)
                }, Lj = b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 = function () {
                    return (Lj = b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 = b.asm.Oh).apply(null, arguments)
                }, Mj = b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 = function () {
                    return (Mj = b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 = b.asm.Ph).apply(null, arguments)
                }, Nj = b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 = function () {
                    return (Nj = b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 =
                        b.asm.Qh).apply(null, arguments)
                }, Oj = b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 = function () {
                    return (Oj = b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 = b.asm.Rh).apply(null, arguments)
                }, Pj = b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 = function () {
                    return (Pj = b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 = b.asm.Sh).apply(null, arguments)
                }, Qj = b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 = function () {
                    return (Qj = b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 =
                        b.asm.Th).apply(null, arguments)
                }, Rj = b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 = function () {
                    return (Rj = b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 = b.asm.Uh).apply(null, arguments)
                }, Sj = b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 = function () {
                    return (Sj = b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 = b.asm.Vh).apply(null, arguments)
                }, Tj = b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 = function () {
                    return (Tj = b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 =
                        b.asm.Wh).apply(null, arguments)
                }, Uj = b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 = function () {
                    return (Uj = b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 = b.asm.Xh).apply(null, arguments)
                }, Vj = b._emscripten_bind_LocalConvexResult___destroy___0 = function () {
                    return (Vj = b._emscripten_bind_LocalConvexResult___destroy___0 = b.asm.Yh).apply(null, arguments)
                }, Wj = b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 = function () {
                    return (Wj = b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 =
                        b.asm.Zh).apply(null, arguments)
                }, Xj = b._emscripten_bind_ClosestConvexResultCallback_hasHit_0 = function () {
                    return (Xj = b._emscripten_bind_ClosestConvexResultCallback_hasHit_0 = b.asm._h).apply(null, arguments)
                }, Yj = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 = function () {
                    return (Yj = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 = b.asm.$h).apply(null, arguments)
                }, Zj = b._emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 = function () {
                    return (Zj =
                        b._emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 = b.asm.ai).apply(null, arguments)
                }, ak = b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 = function () {
                    return (ak = b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 = b.asm.bi).apply(null, arguments)
                }, bk = b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 = function () {
                    return (bk = b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 = b.asm.ci).apply(null, arguments)
                },
                ck = b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 = function () {
                    return (ck = b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 = b.asm.di).apply(null, arguments)
                }, dk = b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 = function () {
                    return (dk = b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 = b.asm.ei).apply(null, arguments)
                }, ek = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 = function () {
                    return (ek = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 =
                        b.asm.fi).apply(null, arguments)
                }, fk = b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 = function () {
                    return (fk = b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 = b.asm.gi).apply(null, arguments)
                }, gk = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 = function () {
                    return (gk = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 = b.asm.hi).apply(null, arguments)
                }, hk = b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 = function () {
                    return (hk =
                        b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 = b.asm.ii).apply(null, arguments)
                }, ik = b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 = function () {
                    return (ik = b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 = b.asm.ji).apply(null, arguments)
                }, jk = b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 = function () {
                    return (jk = b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 = b.asm.ki).apply(null,
                        arguments)
                }, kk = b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 = function () {
                    return (kk = b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 = b.asm.li).apply(null, arguments)
                }, lk = b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 = function () {
                    return (lk = b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 = b.asm.mi).apply(null, arguments)
                }, mk = b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 =
                    function () {
                        return (mk = b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 = b.asm.ni).apply(null, arguments)
                    }, nk = b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 = function () {
                    return (nk = b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 = b.asm.oi).apply(null, arguments)
                }, ok = b._emscripten_bind_ClosestConvexResultCallback___destroy___0 = function () {
                    return (ok = b._emscripten_bind_ClosestConvexResultCallback___destroy___0 = b.asm.pi).apply(null, arguments)
                },
                pk = b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 = function () {
                    return (pk = b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 = b.asm.qi).apply(null, arguments)
                }, qk = b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 = function () {
                    return (qk = b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 = b.asm.ri).apply(null, arguments)
                }, rk = b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 = function () {
                    return (rk = b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 =
                        b.asm.si).apply(null, arguments)
                }, sk = b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 = function () {
                    return (sk = b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 = b.asm.ti).apply(null, arguments)
                }, tk = b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 = function () {
                    return (tk = b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 = b.asm.ui).apply(null, arguments)
                }, uk = b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 = function () {
                    return (uk = b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 =
                        b.asm.vi).apply(null, arguments)
                }, vk = b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 = function () {
                    return (vk = b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 = b.asm.wi).apply(null, arguments)
                }, wk = b._emscripten_bind_btConvexTriangleMeshShape___destroy___0 = function () {
                    return (wk = b._emscripten_bind_btConvexTriangleMeshShape___destroy___0 = b.asm.xi).apply(null, arguments)
                }, xk = b._emscripten_bind_btBoxShape_btBoxShape_1 = function () {
                    return (xk = b._emscripten_bind_btBoxShape_btBoxShape_1 = b.asm.yi).apply(null,
                        arguments)
                }, yk = b._emscripten_bind_btBoxShape_setMargin_1 = function () {
                    return (yk = b._emscripten_bind_btBoxShape_setMargin_1 = b.asm.zi).apply(null, arguments)
                }, zk = b._emscripten_bind_btBoxShape_getMargin_0 = function () {
                    return (zk = b._emscripten_bind_btBoxShape_getMargin_0 = b.asm.Ai).apply(null, arguments)
                }, Ak = b._emscripten_bind_btBoxShape_setLocalScaling_1 = function () {
                    return (Ak = b._emscripten_bind_btBoxShape_setLocalScaling_1 = b.asm.Bi).apply(null, arguments)
                }, Bk = b._emscripten_bind_btBoxShape_getLocalScaling_0 = function () {
                    return (Bk =
                        b._emscripten_bind_btBoxShape_getLocalScaling_0 = b.asm.Ci).apply(null, arguments)
                }, Ck = b._emscripten_bind_btBoxShape_calculateLocalInertia_2 = function () {
                    return (Ck = b._emscripten_bind_btBoxShape_calculateLocalInertia_2 = b.asm.Di).apply(null, arguments)
                }, Dk = b._emscripten_bind_btBoxShape___destroy___0 = function () {
                    return (Dk = b._emscripten_bind_btBoxShape___destroy___0 = b.asm.Ei).apply(null, arguments)
                }, Ek = b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 = function () {
                    return (Ek = b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 =
                        b.asm.Fi).apply(null, arguments)
                }, Fk = b._emscripten_bind_btCapsuleShapeX_setMargin_1 = function () {
                    return (Fk = b._emscripten_bind_btCapsuleShapeX_setMargin_1 = b.asm.Gi).apply(null, arguments)
                }, Gk = b._emscripten_bind_btCapsuleShapeX_getMargin_0 = function () {
                    return (Gk = b._emscripten_bind_btCapsuleShapeX_getMargin_0 = b.asm.Hi).apply(null, arguments)
                }, Hk = b._emscripten_bind_btCapsuleShapeX_getUpAxis_0 = function () {
                    return (Hk = b._emscripten_bind_btCapsuleShapeX_getUpAxis_0 = b.asm.Ii).apply(null, arguments)
                }, Ik = b._emscripten_bind_btCapsuleShapeX_getRadius_0 =
                    function () {
                        return (Ik = b._emscripten_bind_btCapsuleShapeX_getRadius_0 = b.asm.Ji).apply(null, arguments)
                    }, Jk = b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 = function () {
                    return (Jk = b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 = b.asm.Ki).apply(null, arguments)
                }, Kk = b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 = function () {
                    return (Kk = b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 = b.asm.Li).apply(null, arguments)
                }, Lk = b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 = function () {
                    return (Lk = b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 =
                        b.asm.Mi).apply(null, arguments)
                }, Mk = b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 = function () {
                    return (Mk = b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 = b.asm.Ni).apply(null, arguments)
                }, Nk = b._emscripten_bind_btCapsuleShapeX___destroy___0 = function () {
                    return (Nk = b._emscripten_bind_btCapsuleShapeX___destroy___0 = b.asm.Oi).apply(null, arguments)
                }, Ok = b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 = function () {
                    return (Ok = b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 = b.asm.Pi).apply(null,
                        arguments)
                }, Pk = b._emscripten_bind_btCapsuleShapeZ_setMargin_1 = function () {
                    return (Pk = b._emscripten_bind_btCapsuleShapeZ_setMargin_1 = b.asm.Qi).apply(null, arguments)
                }, Qk = b._emscripten_bind_btCapsuleShapeZ_getMargin_0 = function () {
                    return (Qk = b._emscripten_bind_btCapsuleShapeZ_getMargin_0 = b.asm.Ri).apply(null, arguments)
                }, Rk = b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 = function () {
                    return (Rk = b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 = b.asm.Si).apply(null, arguments)
                }, Sk = b._emscripten_bind_btCapsuleShapeZ_getRadius_0 =
                    function () {
                        return (Sk = b._emscripten_bind_btCapsuleShapeZ_getRadius_0 = b.asm.Ti).apply(null, arguments)
                    }, Tk = b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 = function () {
                    return (Tk = b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 = b.asm.Ui).apply(null, arguments)
                }, Uk = b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 = function () {
                    return (Uk = b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 = b.asm.Vi).apply(null, arguments)
                }, Vk = b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 = function () {
                    return (Vk = b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 =
                        b.asm.Wi).apply(null, arguments)
                }, Wk = b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 = function () {
                    return (Wk = b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 = b.asm.Xi).apply(null, arguments)
                }, Xk = b._emscripten_bind_btCapsuleShapeZ___destroy___0 = function () {
                    return (Xk = b._emscripten_bind_btCapsuleShapeZ___destroy___0 = b.asm.Yi).apply(null, arguments)
                }, Yk = b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 = function () {
                    return (Yk = b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 = b.asm.Zi).apply(null,
                        arguments)
                }, Zk = b._emscripten_bind_btCylinderShapeX_setMargin_1 = function () {
                    return (Zk = b._emscripten_bind_btCylinderShapeX_setMargin_1 = b.asm._i).apply(null, arguments)
                }, $k = b._emscripten_bind_btCylinderShapeX_getMargin_0 = function () {
                    return ($k = b._emscripten_bind_btCylinderShapeX_getMargin_0 = b.asm.$i).apply(null, arguments)
                }, al = b._emscripten_bind_btCylinderShapeX_setLocalScaling_1 = function () {
                    return (al = b._emscripten_bind_btCylinderShapeX_setLocalScaling_1 = b.asm.aj).apply(null, arguments)
                }, bl = b._emscripten_bind_btCylinderShapeX_getLocalScaling_0 =
                    function () {
                        return (bl = b._emscripten_bind_btCylinderShapeX_getLocalScaling_0 = b.asm.bj).apply(null, arguments)
                    }, cl = b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 = function () {
                    return (cl = b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 = b.asm.cj).apply(null, arguments)
                }, dl = b._emscripten_bind_btCylinderShapeX___destroy___0 = function () {
                    return (dl = b._emscripten_bind_btCylinderShapeX___destroy___0 = b.asm.dj).apply(null, arguments)
                }, el = b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 = function () {
                    return (el =
                        b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 = b.asm.ej).apply(null, arguments)
                }, fl = b._emscripten_bind_btCylinderShapeZ_setMargin_1 = function () {
                    return (fl = b._emscripten_bind_btCylinderShapeZ_setMargin_1 = b.asm.fj).apply(null, arguments)
                }, gl = b._emscripten_bind_btCylinderShapeZ_getMargin_0 = function () {
                    return (gl = b._emscripten_bind_btCylinderShapeZ_getMargin_0 = b.asm.gj).apply(null, arguments)
                }, hl = b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 = function () {
                    return (hl = b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 =
                        b.asm.hj).apply(null, arguments)
                }, il = b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 = function () {
                    return (il = b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 = b.asm.ij).apply(null, arguments)
                }, jl = b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 = function () {
                    return (jl = b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 = b.asm.jj).apply(null, arguments)
                }, kl = b._emscripten_bind_btCylinderShapeZ___destroy___0 = function () {
                    return (kl = b._emscripten_bind_btCylinderShapeZ___destroy___0 = b.asm.kj).apply(null,
                        arguments)
                }, ll = b._emscripten_bind_btSphereShape_btSphereShape_1 = function () {
                    return (ll = b._emscripten_bind_btSphereShape_btSphereShape_1 = b.asm.lj).apply(null, arguments)
                }, ml = b._emscripten_bind_btSphereShape_setMargin_1 = function () {
                    return (ml = b._emscripten_bind_btSphereShape_setMargin_1 = b.asm.mj).apply(null, arguments)
                }, nl = b._emscripten_bind_btSphereShape_getMargin_0 = function () {
                    return (nl = b._emscripten_bind_btSphereShape_getMargin_0 = b.asm.nj).apply(null, arguments)
                }, ol = b._emscripten_bind_btSphereShape_setLocalScaling_1 =
                    function () {
                        return (ol = b._emscripten_bind_btSphereShape_setLocalScaling_1 = b.asm.oj).apply(null, arguments)
                    }, pl = b._emscripten_bind_btSphereShape_getLocalScaling_0 = function () {
                    return (pl = b._emscripten_bind_btSphereShape_getLocalScaling_0 = b.asm.pj).apply(null, arguments)
                }, ql = b._emscripten_bind_btSphereShape_calculateLocalInertia_2 = function () {
                    return (ql = b._emscripten_bind_btSphereShape_calculateLocalInertia_2 = b.asm.qj).apply(null, arguments)
                }, rl = b._emscripten_bind_btSphereShape___destroy___0 = function () {
                    return (rl =
                        b._emscripten_bind_btSphereShape___destroy___0 = b.asm.rj).apply(null, arguments)
                }, sl = b._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 = function () {
                    return (sl = b._emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 = b.asm.sj).apply(null, arguments)
                }, tl = b._emscripten_bind_btMultiSphereShape_setLocalScaling_1 = function () {
                    return (tl = b._emscripten_bind_btMultiSphereShape_setLocalScaling_1 = b.asm.tj).apply(null, arguments)
                }, ul = b._emscripten_bind_btMultiSphereShape_getLocalScaling_0 = function () {
                    return (ul =
                        b._emscripten_bind_btMultiSphereShape_getLocalScaling_0 = b.asm.uj).apply(null, arguments)
                }, vl = b._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 = function () {
                    return (vl = b._emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 = b.asm.vj).apply(null, arguments)
                }, wl = b._emscripten_bind_btMultiSphereShape___destroy___0 = function () {
                    return (wl = b._emscripten_bind_btMultiSphereShape___destroy___0 = b.asm.wj).apply(null, arguments)
                }, xl = b._emscripten_bind_btConeShapeX_btConeShapeX_2 = function () {
                    return (xl =
                        b._emscripten_bind_btConeShapeX_btConeShapeX_2 = b.asm.xj).apply(null, arguments)
                }, yl = b._emscripten_bind_btConeShapeX_setLocalScaling_1 = function () {
                    return (yl = b._emscripten_bind_btConeShapeX_setLocalScaling_1 = b.asm.yj).apply(null, arguments)
                }, zl = b._emscripten_bind_btConeShapeX_getLocalScaling_0 = function () {
                    return (zl = b._emscripten_bind_btConeShapeX_getLocalScaling_0 = b.asm.zj).apply(null, arguments)
                }, Al = b._emscripten_bind_btConeShapeX_calculateLocalInertia_2 = function () {
                    return (Al = b._emscripten_bind_btConeShapeX_calculateLocalInertia_2 =
                        b.asm.Aj).apply(null, arguments)
                }, Bl = b._emscripten_bind_btConeShapeX___destroy___0 = function () {
                    return (Bl = b._emscripten_bind_btConeShapeX___destroy___0 = b.asm.Bj).apply(null, arguments)
                }, Cl = b._emscripten_bind_btConeShapeZ_btConeShapeZ_2 = function () {
                    return (Cl = b._emscripten_bind_btConeShapeZ_btConeShapeZ_2 = b.asm.Cj).apply(null, arguments)
                }, Dl = b._emscripten_bind_btConeShapeZ_setLocalScaling_1 = function () {
                    return (Dl = b._emscripten_bind_btConeShapeZ_setLocalScaling_1 = b.asm.Dj).apply(null, arguments)
                }, El = b._emscripten_bind_btConeShapeZ_getLocalScaling_0 =
                    function () {
                        return (El = b._emscripten_bind_btConeShapeZ_getLocalScaling_0 = b.asm.Ej).apply(null, arguments)
                    }, Fl = b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 = function () {
                    return (Fl = b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 = b.asm.Fj).apply(null, arguments)
                }, Gl = b._emscripten_bind_btConeShapeZ___destroy___0 = function () {
                    return (Gl = b._emscripten_bind_btConeShapeZ___destroy___0 = b.asm.Gj).apply(null, arguments)
                }, Hl = b._emscripten_bind_btIntArray_size_0 = function () {
                    return (Hl = b._emscripten_bind_btIntArray_size_0 =
                        b.asm.Hj).apply(null, arguments)
                }, Il = b._emscripten_bind_btIntArray_at_1 = function () {
                    return (Il = b._emscripten_bind_btIntArray_at_1 = b.asm.Ij).apply(null, arguments)
                }, Jl = b._emscripten_bind_btIntArray___destroy___0 = function () {
                    return (Jl = b._emscripten_bind_btIntArray___destroy___0 = b.asm.Jj).apply(null, arguments)
                }, Kl = b._emscripten_bind_btFace_get_m_indices_0 = function () {
                    return (Kl = b._emscripten_bind_btFace_get_m_indices_0 = b.asm.Kj).apply(null, arguments)
                }, Ll = b._emscripten_bind_btFace_set_m_indices_1 = function () {
                    return (Ll =
                        b._emscripten_bind_btFace_set_m_indices_1 = b.asm.Lj).apply(null, arguments)
                }, Ml = b._emscripten_bind_btFace_get_m_plane_1 = function () {
                    return (Ml = b._emscripten_bind_btFace_get_m_plane_1 = b.asm.Mj).apply(null, arguments)
                }, Nl = b._emscripten_bind_btFace_set_m_plane_2 = function () {
                    return (Nl = b._emscripten_bind_btFace_set_m_plane_2 = b.asm.Nj).apply(null, arguments)
                }, Ol = b._emscripten_bind_btFace___destroy___0 = function () {
                    return (Ol = b._emscripten_bind_btFace___destroy___0 = b.asm.Oj).apply(null, arguments)
                }, Pl = b._emscripten_bind_btVector3Array_size_0 =
                    function () {
                        return (Pl = b._emscripten_bind_btVector3Array_size_0 = b.asm.Pj).apply(null, arguments)
                    }, Ql = b._emscripten_bind_btVector3Array_at_1 = function () {
                    return (Ql = b._emscripten_bind_btVector3Array_at_1 = b.asm.Qj).apply(null, arguments)
                }, Rl = b._emscripten_bind_btVector3Array___destroy___0 = function () {
                    return (Rl = b._emscripten_bind_btVector3Array___destroy___0 = b.asm.Rj).apply(null, arguments)
                }, Sl = b._emscripten_bind_btFaceArray_size_0 = function () {
                    return (Sl = b._emscripten_bind_btFaceArray_size_0 = b.asm.Sj).apply(null,
                        arguments)
                }, Tl = b._emscripten_bind_btFaceArray_at_1 = function () {
                    return (Tl = b._emscripten_bind_btFaceArray_at_1 = b.asm.Tj).apply(null, arguments)
                }, Ul = b._emscripten_bind_btFaceArray___destroy___0 = function () {
                    return (Ul = b._emscripten_bind_btFaceArray___destroy___0 = b.asm.Uj).apply(null, arguments)
                }, Vl = b._emscripten_bind_btConvexPolyhedron_get_m_vertices_0 = function () {
                    return (Vl = b._emscripten_bind_btConvexPolyhedron_get_m_vertices_0 = b.asm.Vj).apply(null, arguments)
                }, Wl = b._emscripten_bind_btConvexPolyhedron_set_m_vertices_1 =
                    function () {
                        return (Wl = b._emscripten_bind_btConvexPolyhedron_set_m_vertices_1 = b.asm.Wj).apply(null, arguments)
                    }, Xl = b._emscripten_bind_btConvexPolyhedron_get_m_faces_0 = function () {
                    return (Xl = b._emscripten_bind_btConvexPolyhedron_get_m_faces_0 = b.asm.Xj).apply(null, arguments)
                }, Yl = b._emscripten_bind_btConvexPolyhedron_set_m_faces_1 = function () {
                    return (Yl = b._emscripten_bind_btConvexPolyhedron_set_m_faces_1 = b.asm.Yj).apply(null, arguments)
                }, Zl = b._emscripten_bind_btConvexPolyhedron___destroy___0 = function () {
                    return (Zl =
                        b._emscripten_bind_btConvexPolyhedron___destroy___0 = b.asm.Zj).apply(null, arguments)
                }, $l = b._emscripten_bind_btConvexHullShape_btConvexHullShape_0 = function () {
                    return ($l = b._emscripten_bind_btConvexHullShape_btConvexHullShape_0 = b.asm._j).apply(null, arguments)
                }, am = b._emscripten_bind_btConvexHullShape_btConvexHullShape_1 = function () {
                    return (am = b._emscripten_bind_btConvexHullShape_btConvexHullShape_1 = b.asm.$j).apply(null, arguments)
                }, bm = b._emscripten_bind_btConvexHullShape_btConvexHullShape_2 = function () {
                    return (bm =
                        b._emscripten_bind_btConvexHullShape_btConvexHullShape_2 = b.asm.ak).apply(null, arguments)
                }, cm = b._emscripten_bind_btConvexHullShape_addPoint_1 = function () {
                    return (cm = b._emscripten_bind_btConvexHullShape_addPoint_1 = b.asm.bk).apply(null, arguments)
                }, dm = b._emscripten_bind_btConvexHullShape_addPoint_2 = function () {
                    return (dm = b._emscripten_bind_btConvexHullShape_addPoint_2 = b.asm.ck).apply(null, arguments)
                }, em = b._emscripten_bind_btConvexHullShape_setMargin_1 = function () {
                    return (em = b._emscripten_bind_btConvexHullShape_setMargin_1 =
                        b.asm.dk).apply(null, arguments)
                }, fm = b._emscripten_bind_btConvexHullShape_getMargin_0 = function () {
                    return (fm = b._emscripten_bind_btConvexHullShape_getMargin_0 = b.asm.ek).apply(null, arguments)
                }, gm = b._emscripten_bind_btConvexHullShape_getNumVertices_0 = function () {
                    return (gm = b._emscripten_bind_btConvexHullShape_getNumVertices_0 = b.asm.fk).apply(null, arguments)
                }, hm = b._emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1 = function () {
                    return (hm = b._emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1 =
                        b.asm.gk).apply(null, arguments)
                }, im = b._emscripten_bind_btConvexHullShape_recalcLocalAabb_0 = function () {
                    return (im = b._emscripten_bind_btConvexHullShape_recalcLocalAabb_0 = b.asm.hk).apply(null, arguments)
                }, jm = b._emscripten_bind_btConvexHullShape_getConvexPolyhedron_0 = function () {
                    return (jm = b._emscripten_bind_btConvexHullShape_getConvexPolyhedron_0 = b.asm.ik).apply(null, arguments)
                }, km = b._emscripten_bind_btConvexHullShape_setLocalScaling_1 = function () {
                    return (km = b._emscripten_bind_btConvexHullShape_setLocalScaling_1 =
                        b.asm.jk).apply(null, arguments)
                }, lm = b._emscripten_bind_btConvexHullShape_getLocalScaling_0 = function () {
                    return (lm = b._emscripten_bind_btConvexHullShape_getLocalScaling_0 = b.asm.kk).apply(null, arguments)
                }, mm = b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2 = function () {
                    return (mm = b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2 = b.asm.lk).apply(null, arguments)
                }, nm = b._emscripten_bind_btConvexHullShape___destroy___0 = function () {
                    return (nm = b._emscripten_bind_btConvexHullShape___destroy___0 =
                        b.asm.mk).apply(null, arguments)
                }, om = b._emscripten_bind_btShapeHull_btShapeHull_1 = function () {
                    return (om = b._emscripten_bind_btShapeHull_btShapeHull_1 = b.asm.nk).apply(null, arguments)
                }, pm = b._emscripten_bind_btShapeHull_buildHull_1 = function () {
                    return (pm = b._emscripten_bind_btShapeHull_buildHull_1 = b.asm.ok).apply(null, arguments)
                }, qm = b._emscripten_bind_btShapeHull_numVertices_0 = function () {
                    return (qm = b._emscripten_bind_btShapeHull_numVertices_0 = b.asm.pk).apply(null, arguments)
                }, rm = b._emscripten_bind_btShapeHull_getVertexPointer_0 =
                    function () {
                        return (rm = b._emscripten_bind_btShapeHull_getVertexPointer_0 = b.asm.qk).apply(null, arguments)
                    }, sm = b._emscripten_bind_btShapeHull___destroy___0 = function () {
                    return (sm = b._emscripten_bind_btShapeHull___destroy___0 = b.asm.rk).apply(null, arguments)
                }, tm = b._emscripten_bind_btCompoundShape_btCompoundShape_0 = function () {
                    return (tm = b._emscripten_bind_btCompoundShape_btCompoundShape_0 = b.asm.sk).apply(null, arguments)
                }, um = b._emscripten_bind_btCompoundShape_btCompoundShape_1 = function () {
                    return (um = b._emscripten_bind_btCompoundShape_btCompoundShape_1 =
                        b.asm.tk).apply(null, arguments)
                }, wm = b._emscripten_bind_btCompoundShape_addChildShape_2 = function () {
                    return (wm = b._emscripten_bind_btCompoundShape_addChildShape_2 = b.asm.uk).apply(null, arguments)
                }, xm = b._emscripten_bind_btCompoundShape_removeChildShape_1 = function () {
                    return (xm = b._emscripten_bind_btCompoundShape_removeChildShape_1 = b.asm.vk).apply(null, arguments)
                }, ym = b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 = function () {
                    return (ym = b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 =
                        b.asm.wk).apply(null, arguments)
                }, zm = b._emscripten_bind_btCompoundShape_getNumChildShapes_0 = function () {
                    return (zm = b._emscripten_bind_btCompoundShape_getNumChildShapes_0 = b.asm.xk).apply(null, arguments)
                }, Am = b._emscripten_bind_btCompoundShape_getChildShape_1 = function () {
                    return (Am = b._emscripten_bind_btCompoundShape_getChildShape_1 = b.asm.yk).apply(null, arguments)
                }, Bm = b._emscripten_bind_btCompoundShape_updateChildTransform_2 = function () {
                    return (Bm = b._emscripten_bind_btCompoundShape_updateChildTransform_2 = b.asm.zk).apply(null,
                        arguments)
                }, Cm = b._emscripten_bind_btCompoundShape_updateChildTransform_3 = function () {
                    return (Cm = b._emscripten_bind_btCompoundShape_updateChildTransform_3 = b.asm.Ak).apply(null, arguments)
                }, Dm = b._emscripten_bind_btCompoundShape_setMargin_1 = function () {
                    return (Dm = b._emscripten_bind_btCompoundShape_setMargin_1 = b.asm.Bk).apply(null, arguments)
                }, Em = b._emscripten_bind_btCompoundShape_getMargin_0 = function () {
                    return (Em = b._emscripten_bind_btCompoundShape_getMargin_0 = b.asm.Ck).apply(null, arguments)
                }, Fm = b._emscripten_bind_btCompoundShape_setLocalScaling_1 =
                    function () {
                        return (Fm = b._emscripten_bind_btCompoundShape_setLocalScaling_1 = b.asm.Dk).apply(null, arguments)
                    }, Gm = b._emscripten_bind_btCompoundShape_getLocalScaling_0 = function () {
                    return (Gm = b._emscripten_bind_btCompoundShape_getLocalScaling_0 = b.asm.Ek).apply(null, arguments)
                }, Hm = b._emscripten_bind_btCompoundShape_calculateLocalInertia_2 = function () {
                    return (Hm = b._emscripten_bind_btCompoundShape_calculateLocalInertia_2 = b.asm.Fk).apply(null, arguments)
                }, Im = b._emscripten_bind_btCompoundShape___destroy___0 = function () {
                    return (Im =
                        b._emscripten_bind_btCompoundShape___destroy___0 = b.asm.Gk).apply(null, arguments)
                }, Jm = b._emscripten_bind_btIndexedMesh_get_m_numTriangles_0 = function () {
                    return (Jm = b._emscripten_bind_btIndexedMesh_get_m_numTriangles_0 = b.asm.Hk).apply(null, arguments)
                }, Km = b._emscripten_bind_btIndexedMesh_set_m_numTriangles_1 = function () {
                    return (Km = b._emscripten_bind_btIndexedMesh_set_m_numTriangles_1 = b.asm.Ik).apply(null, arguments)
                }, Lm = b._emscripten_bind_btIndexedMesh___destroy___0 = function () {
                    return (Lm = b._emscripten_bind_btIndexedMesh___destroy___0 =
                        b.asm.Jk).apply(null, arguments)
                }, Mm = b._emscripten_bind_btIndexedMeshArray_size_0 = function () {
                    return (Mm = b._emscripten_bind_btIndexedMeshArray_size_0 = b.asm.Kk).apply(null, arguments)
                }, Nm = b._emscripten_bind_btIndexedMeshArray_at_1 = function () {
                    return (Nm = b._emscripten_bind_btIndexedMeshArray_at_1 = b.asm.Lk).apply(null, arguments)
                }, Om = b._emscripten_bind_btIndexedMeshArray___destroy___0 = function () {
                    return (Om = b._emscripten_bind_btIndexedMeshArray___destroy___0 = b.asm.Mk).apply(null, arguments)
                }, Pm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_0 =
                    function () {
                        return (Pm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_0 = b.asm.Nk).apply(null, arguments)
                    }, Qm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_1 = function () {
                    return (Qm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_1 = b.asm.Ok).apply(null, arguments)
                }, Rm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_2 = function () {
                    return (Rm = b._emscripten_bind_btTriangleMesh_btTriangleMesh_2 = b.asm.Pk).apply(null, arguments)
                }, Sm = b._emscripten_bind_btTriangleMesh_addTriangle_3 = function () {
                    return (Sm = b._emscripten_bind_btTriangleMesh_addTriangle_3 =
                        b.asm.Qk).apply(null, arguments)
                }, Tm = b._emscripten_bind_btTriangleMesh_addTriangle_4 = function () {
                    return (Tm = b._emscripten_bind_btTriangleMesh_addTriangle_4 = b.asm.Rk).apply(null, arguments)
                }, Um = b._emscripten_bind_btTriangleMesh_findOrAddVertex_2 = function () {
                    return (Um = b._emscripten_bind_btTriangleMesh_findOrAddVertex_2 = b.asm.Sk).apply(null, arguments)
                }, Vm = b._emscripten_bind_btTriangleMesh_addIndex_1 = function () {
                    return (Vm = b._emscripten_bind_btTriangleMesh_addIndex_1 = b.asm.Tk).apply(null, arguments)
                }, Wm = b._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 =
                    function () {
                        return (Wm = b._emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 = b.asm.Uk).apply(null, arguments)
                    }, Xm = b._emscripten_bind_btTriangleMesh_setScaling_1 = function () {
                    return (Xm = b._emscripten_bind_btTriangleMesh_setScaling_1 = b.asm.Vk).apply(null, arguments)
                }, Ym = b._emscripten_bind_btTriangleMesh___destroy___0 = function () {
                    return (Ym = b._emscripten_bind_btTriangleMesh___destroy___0 = b.asm.Wk).apply(null, arguments)
                }, Zm = b._emscripten_bind_btEmptyShape_btEmptyShape_0 = function () {
                    return (Zm = b._emscripten_bind_btEmptyShape_btEmptyShape_0 =
                        b.asm.Xk).apply(null, arguments)
                }, $m = b._emscripten_bind_btEmptyShape_setLocalScaling_1 = function () {
                    return ($m = b._emscripten_bind_btEmptyShape_setLocalScaling_1 = b.asm.Yk).apply(null, arguments)
                }, an = b._emscripten_bind_btEmptyShape_getLocalScaling_0 = function () {
                    return (an = b._emscripten_bind_btEmptyShape_getLocalScaling_0 = b.asm.Zk).apply(null, arguments)
                }, bn = b._emscripten_bind_btEmptyShape_calculateLocalInertia_2 = function () {
                    return (bn = b._emscripten_bind_btEmptyShape_calculateLocalInertia_2 = b.asm._k).apply(null,
                        arguments)
                }, cn = b._emscripten_bind_btEmptyShape___destroy___0 = function () {
                    return (cn = b._emscripten_bind_btEmptyShape___destroy___0 = b.asm.$k).apply(null, arguments)
                }, dn = b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 = function () {
                    return (dn = b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 = b.asm.al).apply(null, arguments)
                }, en = b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 = function () {
                    return (en = b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 = b.asm.bl).apply(null, arguments)
                },
                fn = b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 = function () {
                    return (fn = b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 = b.asm.cl).apply(null, arguments)
                }, gn = b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 = function () {
                    return (gn = b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 = b.asm.dl).apply(null, arguments)
                }, hn = b._emscripten_bind_btStaticPlaneShape___destroy___0 = function () {
                    return (hn = b._emscripten_bind_btStaticPlaneShape___destroy___0 = b.asm.el).apply(null, arguments)
                },
                jn = b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 = function () {
                    return (jn = b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 = b.asm.fl).apply(null, arguments)
                }, kn = b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 = function () {
                    return (kn = b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 = b.asm.gl).apply(null, arguments)
                }, ln = b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 = function () {
                    return (ln = b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 =
                        b.asm.hl).apply(null, arguments)
                }, mn = b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 = function () {
                    return (mn = b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 = b.asm.il).apply(null, arguments)
                }, nn = b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 = function () {
                    return (nn = b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 = b.asm.jl).apply(null, arguments)
                }, on = b._emscripten_bind_btBvhTriangleMeshShape___destroy___0 = function () {
                    return (on = b._emscripten_bind_btBvhTriangleMeshShape___destroy___0 =
                        b.asm.kl).apply(null, arguments)
                }, pn = b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9 = function () {
                    return (pn = b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9 = b.asm.ll).apply(null, arguments)
                }, qn = b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1 = function () {
                    return (qn = b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1 = b.asm.ml).apply(null, arguments)
                }, rn = b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0 = function () {
                    return (rn = b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0 =
                        b.asm.nl).apply(null, arguments)
                }, sn = b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1 = function () {
                    return (sn = b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1 = b.asm.ol).apply(null, arguments)
                }, tn = b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0 = function () {
                    return (tn = b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0 = b.asm.pl).apply(null, arguments)
                }, un = b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2 = function () {
                    return (un = b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2 =
                        b.asm.ql).apply(null, arguments)
                }, vn = b._emscripten_bind_btHeightfieldTerrainShape___destroy___0 = function () {
                    return (vn = b._emscripten_bind_btHeightfieldTerrainShape___destroy___0 = b.asm.rl).apply(null, arguments)
                }, wn = b._emscripten_bind_btAABB_btAABB_4 = function () {
                    return (wn = b._emscripten_bind_btAABB_btAABB_4 = b.asm.sl).apply(null, arguments)
                }, xn = b._emscripten_bind_btAABB_invalidate_0 = function () {
                    return (xn = b._emscripten_bind_btAABB_invalidate_0 = b.asm.tl).apply(null, arguments)
                }, yn = b._emscripten_bind_btAABB_increment_margin_1 =
                    function () {
                        return (yn = b._emscripten_bind_btAABB_increment_margin_1 = b.asm.ul).apply(null, arguments)
                    }, zn = b._emscripten_bind_btAABB_copy_with_margin_2 = function () {
                    return (zn = b._emscripten_bind_btAABB_copy_with_margin_2 = b.asm.vl).apply(null, arguments)
                }, An = b._emscripten_bind_btAABB___destroy___0 = function () {
                    return (An = b._emscripten_bind_btAABB___destroy___0 = b.asm.wl).apply(null, arguments)
                }, Bn = b._emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 = function () {
                    return (Bn = b._emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 =
                        b.asm.xl).apply(null, arguments)
                }, Cn = b._emscripten_bind_btPrimitiveTriangle___destroy___0 = function () {
                    return (Cn = b._emscripten_bind_btPrimitiveTriangle___destroy___0 = b.asm.yl).apply(null, arguments)
                }, Dn = b._emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 = function () {
                    return (Dn = b._emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 = b.asm.zl).apply(null, arguments)
                }, En = b._emscripten_bind_btTriangleShapeEx_getAabb_3 = function () {
                    return (En = b._emscripten_bind_btTriangleShapeEx_getAabb_3 = b.asm.Al).apply(null,
                        arguments)
                }, Fn = b._emscripten_bind_btTriangleShapeEx_applyTransform_1 = function () {
                    return (Fn = b._emscripten_bind_btTriangleShapeEx_applyTransform_1 = b.asm.Bl).apply(null, arguments)
                }, Gn = b._emscripten_bind_btTriangleShapeEx_buildTriPlane_1 = function () {
                    return (Gn = b._emscripten_bind_btTriangleShapeEx_buildTriPlane_1 = b.asm.Cl).apply(null, arguments)
                }, Hn = b._emscripten_bind_btTriangleShapeEx___destroy___0 = function () {
                    return (Hn = b._emscripten_bind_btTriangleShapeEx___destroy___0 = b.asm.Dl).apply(null, arguments)
                }, In =
                    b._emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 = function () {
                        return (In = b._emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 = b.asm.El).apply(null, arguments)
                    }, Jn = b._emscripten_bind_btTetrahedronShapeEx_setVertices_4 = function () {
                    return (Jn = b._emscripten_bind_btTetrahedronShapeEx_setVertices_4 = b.asm.Fl).apply(null, arguments)
                }, Kn = b._emscripten_bind_btTetrahedronShapeEx___destroy___0 = function () {
                    return (Kn = b._emscripten_bind_btTetrahedronShapeEx___destroy___0 = b.asm.Gl).apply(null, arguments)
                },
                Ln = b._emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 = function () {
                    return (Ln = b._emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 = b.asm.Hl).apply(null, arguments)
                }, Mn = b._emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 = function () {
                    return (Mn = b._emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 = b.asm.Il).apply(null, arguments)
                }, Nn = b._emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 = function () {
                    return (Nn = b._emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 =
                        b.asm.Jl).apply(null, arguments)
                }, On = b._emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 = function () {
                    return (On = b._emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 = b.asm.Kl).apply(null, arguments)
                }, Pn = b._emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 = function () {
                    return (Pn = b._emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 = b.asm.Ll).apply(null, arguments)
                }, Qn = b._emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 = function () {
                    return (Qn = b._emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 =
                        b.asm.Ml).apply(null, arguments)
                }, Rn = b._emscripten_bind_CompoundPrimitiveManager___destroy___0 = function () {
                    return (Rn = b._emscripten_bind_CompoundPrimitiveManager___destroy___0 = b.asm.Nl).apply(null, arguments)
                }, Sn = b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 = function () {
                    return (Sn = b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 = b.asm.Ol).apply(null, arguments)
                }, Tn = b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 = function () {
                    return (Tn = b._emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 =
                        b.asm.Pl).apply(null, arguments)
                }, Un = b._emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 = function () {
                    return (Un = b._emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 = b.asm.Ql).apply(null, arguments)
                }, Vn = b._emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 = function () {
                    return (Vn = b._emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 = b.asm.Rl).apply(null, arguments)
                }, Wn = b._emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 = function () {
                    return (Wn =
                        b._emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 = b.asm.Sl).apply(null, arguments)
                }, Xn = b._emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 = function () {
                    return (Xn = b._emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 = b.asm.Tl).apply(null, arguments)
                }, Yn = b._emscripten_bind_btGImpactCompoundShape_addChildShape_2 = function () {
                    return (Yn = b._emscripten_bind_btGImpactCompoundShape_addChildShape_2 = b.asm.Ul).apply(null, arguments)
                }, Zn = b._emscripten_bind_btGImpactCompoundShape_getChildShape_1 =
                    function () {
                        return (Zn = b._emscripten_bind_btGImpactCompoundShape_getChildShape_1 = b.asm.Vl).apply(null, arguments)
                    }, $n = b._emscripten_bind_btGImpactCompoundShape_getChildAabb_4 = function () {
                    return ($n = b._emscripten_bind_btGImpactCompoundShape_getChildAabb_4 = b.asm.Wl).apply(null, arguments)
                }, ao = b._emscripten_bind_btGImpactCompoundShape_getChildTransform_1 = function () {
                    return (ao = b._emscripten_bind_btGImpactCompoundShape_getChildTransform_1 = b.asm.Xl).apply(null, arguments)
                }, bo = b._emscripten_bind_btGImpactCompoundShape_setChildTransform_2 =
                    function () {
                        return (bo = b._emscripten_bind_btGImpactCompoundShape_setChildTransform_2 = b.asm.Yl).apply(null, arguments)
                    }, co = b._emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 = function () {
                    return (co = b._emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 = b.asm.Zl).apply(null, arguments)
                }, eo = b._emscripten_bind_btGImpactCompoundShape_getName_0 = function () {
                    return (eo = b._emscripten_bind_btGImpactCompoundShape_getName_0 = b.asm._l).apply(null, arguments)
                }, fo = b._emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0 =
                    function () {
                        return (fo = b._emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0 = b.asm.$l).apply(null, arguments)
                    }, go = b._emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 = function () {
                    return (go = b._emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 = b.asm.am).apply(null, arguments)
                }, ho = b._emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 = function () {
                    return (ho = b._emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 = b.asm.bm).apply(null, arguments)
                }, io = b._emscripten_bind_btGImpactCompoundShape_updateBound_0 =
                    function () {
                        return (io = b._emscripten_bind_btGImpactCompoundShape_updateBound_0 = b.asm.cm).apply(null, arguments)
                    }, jo = b._emscripten_bind_btGImpactCompoundShape_postUpdate_0 = function () {
                    return (jo = b._emscripten_bind_btGImpactCompoundShape_postUpdate_0 = b.asm.dm).apply(null, arguments)
                }, ko = b._emscripten_bind_btGImpactCompoundShape_getShapeType_0 = function () {
                    return (ko = b._emscripten_bind_btGImpactCompoundShape_getShapeType_0 = b.asm.em).apply(null, arguments)
                }, lo = b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 =
                    function () {
                        return (lo = b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 = b.asm.fm).apply(null, arguments)
                    }, mo = b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 = function () {
                    return (mo = b._emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 = b.asm.gm).apply(null, arguments)
                }, no = b._emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 = function () {
                    return (no = b._emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 = b.asm.hm).apply(null, arguments)
                }, oo =
                    b._emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 = function () {
                        return (oo = b._emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 = b.asm.im).apply(null, arguments)
                    }, po = b._emscripten_bind_btGImpactCompoundShape___destroy___0 = function () {
                    return (po = b._emscripten_bind_btGImpactCompoundShape___destroy___0 = b.asm.jm).apply(null, arguments)
                }, qo = b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 = function () {
                    return (qo = b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 =
                        b.asm.km).apply(null, arguments)
                }, ro = b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 = function () {
                    return (ro = b._emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 = b.asm.lm).apply(null, arguments)
                }, so = b._emscripten_bind_TrimeshPrimitiveManager_lock_0 = function () {
                    return (so = b._emscripten_bind_TrimeshPrimitiveManager_lock_0 = b.asm.mm).apply(null, arguments)
                }, to = b._emscripten_bind_TrimeshPrimitiveManager_unlock_0 = function () {
                    return (to = b._emscripten_bind_TrimeshPrimitiveManager_unlock_0 =
                        b.asm.nm).apply(null, arguments)
                }, uo = b._emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 = function () {
                    return (uo = b._emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 = b.asm.om).apply(null, arguments)
                }, vo = b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 = function () {
                    return (vo = b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 = b.asm.pm).apply(null, arguments)
                }, wo = b._emscripten_bind_TrimeshPrimitiveManager_get_indices_4 = function () {
                    return (wo = b._emscripten_bind_TrimeshPrimitiveManager_get_indices_4 =
                        b.asm.qm).apply(null, arguments)
                }, xo = b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 = function () {
                    return (xo = b._emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 = b.asm.rm).apply(null, arguments)
                }, yo = b._emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 = function () {
                    return (yo = b._emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 = b.asm.sm).apply(null, arguments)
                }, zo = b._emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 = function () {
                    return (zo = b._emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 =
                        b.asm.tm).apply(null, arguments)
                }, Ao = b._emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 = function () {
                    return (Ao = b._emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 = b.asm.um).apply(null, arguments)
                }, Bo = b._emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 = function () {
                    return (Bo = b._emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 = b.asm.vm).apply(null, arguments)
                }, Co = b._emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 = function () {
                    return (Co = b._emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 =
                        b.asm.wm).apply(null, arguments)
                }, Do = b._emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 = function () {
                    return (Do = b._emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 = b.asm.xm).apply(null, arguments)
                }, Eo = b._emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 = function () {
                    return (Eo = b._emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 = b.asm.ym).apply(null, arguments)
                }, Fo = b._emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 = function () {
                    return (Fo = b._emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 =
                        b.asm.zm).apply(null, arguments)
                }, Go = b._emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 = function () {
                    return (Go = b._emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 = b.asm.Am).apply(null, arguments)
                }, Ho = b._emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 = function () {
                    return (Ho = b._emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 = b.asm.Bm).apply(null, arguments)
                }, Io = b._emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 = function () {
                    return (Io = b._emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 =
                        b.asm.Cm).apply(null, arguments)
                }, Jo = b._emscripten_bind_TrimeshPrimitiveManager_get_type_0 = function () {
                    return (Jo = b._emscripten_bind_TrimeshPrimitiveManager_get_type_0 = b.asm.Dm).apply(null, arguments)
                }, Ko = b._emscripten_bind_TrimeshPrimitiveManager_set_type_1 = function () {
                    return (Ko = b._emscripten_bind_TrimeshPrimitiveManager_set_type_1 = b.asm.Em).apply(null, arguments)
                }, Lo = b._emscripten_bind_TrimeshPrimitiveManager_get_stride_0 = function () {
                    return (Lo = b._emscripten_bind_TrimeshPrimitiveManager_get_stride_0 = b.asm.Fm).apply(null,
                        arguments)
                }, Mo = b._emscripten_bind_TrimeshPrimitiveManager_set_stride_1 = function () {
                    return (Mo = b._emscripten_bind_TrimeshPrimitiveManager_set_stride_1 = b.asm.Gm).apply(null, arguments)
                }, No = b._emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 = function () {
                    return (No = b._emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 = b.asm.Hm).apply(null, arguments)
                }, Oo = b._emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 = function () {
                    return (Oo = b._emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 =
                        b.asm.Im).apply(null, arguments)
                }, Po = b._emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 = function () {
                    return (Po = b._emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 = b.asm.Jm).apply(null, arguments)
                }, Qo = b._emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 = function () {
                    return (Qo = b._emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 = b.asm.Km).apply(null, arguments)
                }, Ro = b._emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 = function () {
                    return (Ro = b._emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 =
                        b.asm.Lm).apply(null, arguments)
                }, So = b._emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 = function () {
                    return (So = b._emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 = b.asm.Mm).apply(null, arguments)
                }, To = b._emscripten_bind_TrimeshPrimitiveManager___destroy___0 = function () {
                    return (To = b._emscripten_bind_TrimeshPrimitiveManager___destroy___0 = b.asm.Nm).apply(null, arguments)
                }, Uo = b._emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 = function () {
                    return (Uo = b._emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 =
                        b.asm.Om).apply(null, arguments)
                }, Vo = b._emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 = function () {
                    return (Vo = b._emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 = b.asm.Pm).apply(null, arguments)
                }, Wo = b._emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 = function () {
                    return (Wo = b._emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 = b.asm.Qm).apply(null, arguments)
                }, Xo = b._emscripten_bind_btGImpactMeshShapePart_getVertex_2 = function () {
                    return (Xo = b._emscripten_bind_btGImpactMeshShapePart_getVertex_2 =
                        b.asm.Rm).apply(null, arguments)
                }, Yo = b._emscripten_bind_btGImpactMeshShapePart_getPart_0 = function () {
                    return (Yo = b._emscripten_bind_btGImpactMeshShapePart_getPart_0 = b.asm.Sm).apply(null, arguments)
                }, Zo = b._emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 = function () {
                    return (Zo = b._emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 = b.asm.Tm).apply(null, arguments)
                }, $o = b._emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 = function () {
                    return ($o = b._emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 =
                        b.asm.Um).apply(null, arguments)
                }, ap = b._emscripten_bind_btGImpactMeshShapePart_updateBound_0 = function () {
                    return (ap = b._emscripten_bind_btGImpactMeshShapePart_updateBound_0 = b.asm.Vm).apply(null, arguments)
                }, bp = b._emscripten_bind_btGImpactMeshShapePart_postUpdate_0 = function () {
                    return (bp = b._emscripten_bind_btGImpactMeshShapePart_postUpdate_0 = b.asm.Wm).apply(null, arguments)
                }, cp = b._emscripten_bind_btGImpactMeshShapePart_getShapeType_0 = function () {
                    return (cp = b._emscripten_bind_btGImpactMeshShapePart_getShapeType_0 =
                        b.asm.Xm).apply(null, arguments)
                }, dp = b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 = function () {
                    return (dp = b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 = b.asm.Ym).apply(null, arguments)
                }, ep = b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 = function () {
                    return (ep = b._emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 = b.asm.Zm).apply(null, arguments)
                }, fp = b._emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 = function () {
                    return (fp =
                        b._emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 = b.asm._m).apply(null, arguments)
                }, gp = b._emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 = function () {
                    return (gp = b._emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 = b.asm.$m).apply(null, arguments)
                }, hp = b._emscripten_bind_btGImpactMeshShapePart___destroy___0 = function () {
                    return (hp = b._emscripten_bind_btGImpactMeshShapePart___destroy___0 = b.asm.an).apply(null, arguments)
                }, ip = b._emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 =
                    function () {
                        return (ip = b._emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 = b.asm.bn).apply(null, arguments)
                    }, jp = b._emscripten_bind_btGImpactMeshShape_getMeshInterface_0 = function () {
                    return (jp = b._emscripten_bind_btGImpactMeshShape_getMeshInterface_0 = b.asm.cn).apply(null, arguments)
                }, kp = b._emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 = function () {
                    return (kp = b._emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 = b.asm.dn).apply(null, arguments)
                }, lp = b._emscripten_bind_btGImpactMeshShape_getMeshPart_1 =
                    function () {
                        return (lp = b._emscripten_bind_btGImpactMeshShape_getMeshPart_1 = b.asm.en).apply(null, arguments)
                    }, mp = b._emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 = function () {
                    return (mp = b._emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 = b.asm.fn).apply(null, arguments)
                }, np = b._emscripten_bind_btGImpactMeshShape_setLocalScaling_1 = function () {
                    return (np = b._emscripten_bind_btGImpactMeshShape_setLocalScaling_1 = b.asm.gn).apply(null, arguments)
                }, op = b._emscripten_bind_btGImpactMeshShape_getLocalScaling_0 =
                    function () {
                        return (op = b._emscripten_bind_btGImpactMeshShape_getLocalScaling_0 = b.asm.hn).apply(null, arguments)
                    }, pp = b._emscripten_bind_btGImpactMeshShape_updateBound_0 = function () {
                    return (pp = b._emscripten_bind_btGImpactMeshShape_updateBound_0 = b.asm.jn).apply(null, arguments)
                }, qp = b._emscripten_bind_btGImpactMeshShape_postUpdate_0 = function () {
                    return (qp = b._emscripten_bind_btGImpactMeshShape_postUpdate_0 = b.asm.kn).apply(null, arguments)
                }, rp = b._emscripten_bind_btGImpactMeshShape_getShapeType_0 = function () {
                    return (rp =
                        b._emscripten_bind_btGImpactMeshShape_getShapeType_0 = b.asm.ln).apply(null, arguments)
                }, sp = b._emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 = function () {
                    return (sp = b._emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 = b.asm.mn).apply(null, arguments)
                }, tp = b._emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 = function () {
                    return (tp = b._emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 = b.asm.nn).apply(null, arguments)
                }, up = b._emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 =
                    function () {
                        return (up = b._emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 = b.asm.on).apply(null, arguments)
                    }, vp = b._emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 = function () {
                    return (vp = b._emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 = b.asm.pn).apply(null, arguments)
                }, wp = b._emscripten_bind_btGImpactMeshShape___destroy___0 = function () {
                    return (wp = b._emscripten_bind_btGImpactMeshShape___destroy___0 = b.asm.qn).apply(null, arguments)
                }, xp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 =
                    function () {
                        return (xp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 = b.asm.rn).apply(null, arguments)
                    },
                yp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 = function () {
                    return (yp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 = b.asm.sn).apply(null, arguments)
                }, zp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 = function () {
                    return (zp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 =
                        b.asm.tn).apply(null, arguments)
                }, Ap = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 = function () {
                    return (Ap = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 = b.asm.un).apply(null, arguments)
                }, Bp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 = function () {
                    return (Bp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 = b.asm.vn).apply(null, arguments)
                }, Cp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 =
                    function () {
                        return (Cp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 = b.asm.wn).apply(null, arguments)
                    }, Dp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 = function () {
                    return (Dp = b._emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 = b.asm.xn).apply(null, arguments)
                }, Ep = b._emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 = function () {
                    return (Ep = b._emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 =
                        b.asm.yn).apply(null, arguments)
                }, Fp = b._emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 = function () {
                    return (Fp = b._emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 = b.asm.zn).apply(null, arguments)
                }, Gp = b._emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 = function () {
                    return (Gp = b._emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 = b.asm.An).apply(null, arguments)
                },
                Hp = b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 = function () {
                    return (Hp =
                        b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 = b.asm.Bn).apply(null, arguments)
                }, Ip = b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 = function () {
                    return (Ip = b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 = b.asm.Cn).apply(null, arguments)
                }, Jp = b._emscripten_bind_btPersistentManifold_btPersistentManifold_0 = function () {
                    return (Jp = b._emscripten_bind_btPersistentManifold_btPersistentManifold_0 = b.asm.Dn).apply(null, arguments)
                }, Kp =
                    b._emscripten_bind_btPersistentManifold_getBody0_0 = function () {
                        return (Kp = b._emscripten_bind_btPersistentManifold_getBody0_0 = b.asm.En).apply(null, arguments)
                    }, Lp = b._emscripten_bind_btPersistentManifold_getBody1_0 = function () {
                    return (Lp = b._emscripten_bind_btPersistentManifold_getBody1_0 = b.asm.Fn).apply(null, arguments)
                }, Mp = b._emscripten_bind_btPersistentManifold_getNumContacts_0 = function () {
                    return (Mp = b._emscripten_bind_btPersistentManifold_getNumContacts_0 = b.asm.Gn).apply(null, arguments)
                }, Np = b._emscripten_bind_btPersistentManifold_getContactPoint_1 =
                    function () {
                        return (Np = b._emscripten_bind_btPersistentManifold_getContactPoint_1 = b.asm.Hn).apply(null, arguments)
                    }, Op = b._emscripten_bind_btPersistentManifold___destroy___0 = function () {
                    return (Op = b._emscripten_bind_btPersistentManifold___destroy___0 = b.asm.In).apply(null, arguments)
                }, Pp = b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 = function () {
                    return (Pp = b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 = b.asm.Jn).apply(null, arguments)
                }, Qp = b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 =
                    function () {
                        return (Qp = b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 = b.asm.Kn).apply(null, arguments)
                    }, Rp = b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 = function () {
                    return (Rp = b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 = b.asm.Ln).apply(null, arguments)
                }, Sp = b._emscripten_bind_btCollisionDispatcher___destroy___0 = function () {
                    return (Sp = b._emscripten_bind_btCollisionDispatcher___destroy___0 = b.asm.Mn).apply(null, arguments)
                }, Tp = b._emscripten_bind_btOverlappingPairCallback___destroy___0 =
                    function () {
                        return (Tp = b._emscripten_bind_btOverlappingPairCallback___destroy___0 = b.asm.Nn).apply(null, arguments)
                    }, Up = b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 = function () {
                    return (Up = b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 = b.asm.On).apply(null, arguments)
                }, Vp = b._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 = function () {
                    return (Vp = b._emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 = b.asm.Pn).apply(null, arguments)
                },
                Wp = b._emscripten_bind_btOverlappingPairCache___destroy___0 = function () {
                    return (Wp = b._emscripten_bind_btOverlappingPairCache___destroy___0 = b.asm.Qn).apply(null, arguments)
                }, Xp = b._emscripten_bind_btAxisSweep3_btAxisSweep3_2 = function () {
                    return (Xp = b._emscripten_bind_btAxisSweep3_btAxisSweep3_2 = b.asm.Rn).apply(null, arguments)
                }, Yp = b._emscripten_bind_btAxisSweep3_btAxisSweep3_3 = function () {
                    return (Yp = b._emscripten_bind_btAxisSweep3_btAxisSweep3_3 = b.asm.Sn).apply(null, arguments)
                }, Zp = b._emscripten_bind_btAxisSweep3_btAxisSweep3_4 =
                    function () {
                        return (Zp = b._emscripten_bind_btAxisSweep3_btAxisSweep3_4 = b.asm.Tn).apply(null, arguments)
                    }, $p = b._emscripten_bind_btAxisSweep3_btAxisSweep3_5 = function () {
                    return ($p = b._emscripten_bind_btAxisSweep3_btAxisSweep3_5 = b.asm.Un).apply(null, arguments)
                }, aq = b._emscripten_bind_btAxisSweep3___destroy___0 = function () {
                    return (aq = b._emscripten_bind_btAxisSweep3___destroy___0 = b.asm.Vn).apply(null, arguments)
                }, bq = b._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 = function () {
                    return (bq = b._emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 =
                        b.asm.Wn).apply(null, arguments)
                }, cq = b._emscripten_bind_btBroadphaseInterface___destroy___0 = function () {
                    return (cq = b._emscripten_bind_btBroadphaseInterface___destroy___0 = b.asm.Xn).apply(null, arguments)
                }, dq = b._emscripten_bind_btCollisionConfiguration___destroy___0 = function () {
                    return (dq = b._emscripten_bind_btCollisionConfiguration___destroy___0 = b.asm.Yn).apply(null, arguments)
                }, eq = b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 = function () {
                    return (eq = b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 =
                        b.asm.Zn).apply(null, arguments)
                }, fq = b._emscripten_bind_btDbvtBroadphase___destroy___0 = function () {
                    return (fq = b._emscripten_bind_btDbvtBroadphase___destroy___0 = b.asm._n).apply(null, arguments)
                }, gq = b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 = function () {
                    return (gq = b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 = b.asm.$n).apply(null, arguments)
                }, hq = b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 = function () {
                    return (hq = b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 =
                        b.asm.ao).apply(null, arguments)
                }, iq = b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 = function () {
                    return (iq = b._emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 = b.asm.bo).apply(null, arguments)
                }, jq = b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 = function () {
                    return (jq = b._emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 = b.asm.co).apply(null, arguments)
                }, kq = b._emscripten_bind_btBroadphaseProxy___destroy___0 = function () {
                    return (kq = b._emscripten_bind_btBroadphaseProxy___destroy___0 =
                        b.asm.eo).apply(null, arguments)
                }, lq = b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 = function () {
                    return (lq = b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 = b.asm.fo).apply(null, arguments)
                }, mq = b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 = function () {
                    return (mq = b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 = b.asm.go).apply(null, arguments)
                }, nq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 =
                    function () {
                        return (nq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 = b.asm.ho).apply(null, arguments)
                    }, oq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 = function () {
                    return (oq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 = b.asm.io).apply(null, arguments)
                }, pq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 = function () {
                    return (pq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 = b.asm.jo).apply(null,
                        arguments)
                }, qq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 = function () {
                    return (qq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 = b.asm.ko).apply(null, arguments)
                }, rq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 = function () {
                    return (rq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 = b.asm.lo).apply(null, arguments)
                }, sq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 = function () {
                    return (sq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 =
                        b.asm.mo).apply(null, arguments)
                }, tq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 = function () {
                    return (tq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 = b.asm.no).apply(null, arguments)
                }, uq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 = function () {
                    return (uq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 = b.asm.oo).apply(null, arguments)
                }, vq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 =
                    function () {
                        return (vq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 = b.asm.po).apply(null, arguments)
                    }, wq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 = function () {
                    return (wq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 = b.asm.qo).apply(null, arguments)
                }, xq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 = function () {
                    return (xq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 = b.asm.ro).apply(null,
                        arguments)
                }, yq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 = function () {
                    return (yq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 = b.asm.so).apply(null, arguments)
                }, zq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 = function () {
                    return (zq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 = b.asm.to).apply(null, arguments)
                }, Aq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 =
                    function () {
                        return (Aq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 = b.asm.uo).apply(null, arguments)
                    }, Bq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 = function () {
                    return (Bq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 = b.asm.vo).apply(null, arguments)
                }, Cq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 = function () {
                    return (Cq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 =
                        b.asm.wo).apply(null, arguments)
                }, Dq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 = function () {
                    return (Dq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 = b.asm.xo).apply(null, arguments)
                }, Eq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 = function () {
                    return (Eq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 = b.asm.yo).apply(null, arguments)
                }, Fq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 =
                    function () {
                        return (Fq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 = b.asm.zo).apply(null, arguments)
                    },
                Gq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 = function () {
                    return (Gq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 = b.asm.Ao).apply(null, arguments)
                },
                Hq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 = function () {
                    return (Hq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 =
                        b.asm.Bo).apply(null, arguments)
                },
                Iq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 = function () {
                    return (Iq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 = b.asm.Co).apply(null, arguments)
                },
                Jq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 = function () {
                    return (Jq = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 = b.asm.Do).apply(null, arguments)
                },
                Kq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 = function () {
                    return (Kq = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 = b.asm.Eo).apply(null, arguments)
                }, Lq = b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 = function () {
                    return (Lq = b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 = b.asm.Fo).apply(null, arguments)
                }, Mq = b._emscripten_bind_btRigidBody_btRigidBody_1 = function () {
                    return (Mq = b._emscripten_bind_btRigidBody_btRigidBody_1 =
                        b.asm.Go).apply(null, arguments)
                }, Nq = b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 = function () {
                    return (Nq = b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 = b.asm.Ho).apply(null, arguments)
                }, Oq = b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 = function () {
                    return (Oq = b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 = b.asm.Io).apply(null, arguments)
                }, Pq = b._emscripten_bind_btRigidBody_setSleepingThresholds_2 = function () {
                    return (Pq = b._emscripten_bind_btRigidBody_setSleepingThresholds_2 =
                        b.asm.Jo).apply(null, arguments)
                }, Qq = b._emscripten_bind_btRigidBody_getLinearDamping_0 = function () {
                    return (Qq = b._emscripten_bind_btRigidBody_getLinearDamping_0 = b.asm.Ko).apply(null, arguments)
                }, Rq = b._emscripten_bind_btRigidBody_getAngularDamping_0 = function () {
                    return (Rq = b._emscripten_bind_btRigidBody_getAngularDamping_0 = b.asm.Lo).apply(null, arguments)
                }, Sq = b._emscripten_bind_btRigidBody_setDamping_2 = function () {
                    return (Sq = b._emscripten_bind_btRigidBody_setDamping_2 = b.asm.Mo).apply(null, arguments)
                }, Tq = b._emscripten_bind_btRigidBody_setMassProps_2 =
                    function () {
                        return (Tq = b._emscripten_bind_btRigidBody_setMassProps_2 = b.asm.No).apply(null, arguments)
                    }, Uq = b._emscripten_bind_btRigidBody_getLinearFactor_0 = function () {
                    return (Uq = b._emscripten_bind_btRigidBody_getLinearFactor_0 = b.asm.Oo).apply(null, arguments)
                }, Vq = b._emscripten_bind_btRigidBody_setLinearFactor_1 = function () {
                    return (Vq = b._emscripten_bind_btRigidBody_setLinearFactor_1 = b.asm.Po).apply(null, arguments)
                }, Wq = b._emscripten_bind_btRigidBody_applyTorque_1 = function () {
                    return (Wq = b._emscripten_bind_btRigidBody_applyTorque_1 =
                        b.asm.Qo).apply(null, arguments)
                }, Xq = b._emscripten_bind_btRigidBody_applyLocalTorque_1 = function () {
                    return (Xq = b._emscripten_bind_btRigidBody_applyLocalTorque_1 = b.asm.Ro).apply(null, arguments)
                }, Yq = b._emscripten_bind_btRigidBody_applyForce_2 = function () {
                    return (Yq = b._emscripten_bind_btRigidBody_applyForce_2 = b.asm.So).apply(null, arguments)
                }, Zq = b._emscripten_bind_btRigidBody_applyCentralForce_1 = function () {
                    return (Zq = b._emscripten_bind_btRigidBody_applyCentralForce_1 = b.asm.To).apply(null, arguments)
                }, $q = b._emscripten_bind_btRigidBody_applyCentralLocalForce_1 =
                    function () {
                        return ($q = b._emscripten_bind_btRigidBody_applyCentralLocalForce_1 = b.asm.Uo).apply(null, arguments)
                    }, ar = b._emscripten_bind_btRigidBody_applyTorqueImpulse_1 = function () {
                    return (ar = b._emscripten_bind_btRigidBody_applyTorqueImpulse_1 = b.asm.Vo).apply(null, arguments)
                }, br = b._emscripten_bind_btRigidBody_applyImpulse_2 = function () {
                    return (br = b._emscripten_bind_btRigidBody_applyImpulse_2 = b.asm.Wo).apply(null, arguments)
                }, cr = b._emscripten_bind_btRigidBody_applyCentralImpulse_1 = function () {
                    return (cr = b._emscripten_bind_btRigidBody_applyCentralImpulse_1 =
                        b.asm.Xo).apply(null, arguments)
                }, dr = b._emscripten_bind_btRigidBody_updateInertiaTensor_0 = function () {
                    return (dr = b._emscripten_bind_btRigidBody_updateInertiaTensor_0 = b.asm.Yo).apply(null, arguments)
                }, er = b._emscripten_bind_btRigidBody_getLinearVelocity_0 = function () {
                    return (er = b._emscripten_bind_btRigidBody_getLinearVelocity_0 = b.asm.Zo).apply(null, arguments)
                }, fr = b._emscripten_bind_btRigidBody_getAngularVelocity_0 = function () {
                    return (fr = b._emscripten_bind_btRigidBody_getAngularVelocity_0 = b.asm._o).apply(null,
                        arguments)
                }, gr = b._emscripten_bind_btRigidBody_setLinearVelocity_1 = function () {
                    return (gr = b._emscripten_bind_btRigidBody_setLinearVelocity_1 = b.asm.$o).apply(null, arguments)
                }, hr = b._emscripten_bind_btRigidBody_setAngularVelocity_1 = function () {
                    return (hr = b._emscripten_bind_btRigidBody_setAngularVelocity_1 = b.asm.ap).apply(null, arguments)
                }, ir = b._emscripten_bind_btRigidBody_getMotionState_0 = function () {
                    return (ir = b._emscripten_bind_btRigidBody_getMotionState_0 = b.asm.bp).apply(null, arguments)
                }, jr = b._emscripten_bind_btRigidBody_setMotionState_1 =
                    function () {
                        return (jr = b._emscripten_bind_btRigidBody_setMotionState_1 = b.asm.cp).apply(null, arguments)
                    }, kr = b._emscripten_bind_btRigidBody_getAngularFactor_0 = function () {
                    return (kr = b._emscripten_bind_btRigidBody_getAngularFactor_0 = b.asm.dp).apply(null, arguments)
                }, lr = b._emscripten_bind_btRigidBody_setAngularFactor_1 = function () {
                    return (lr = b._emscripten_bind_btRigidBody_setAngularFactor_1 = b.asm.ep).apply(null, arguments)
                }, mr = b._emscripten_bind_btRigidBody_upcast_1 = function () {
                    return (mr = b._emscripten_bind_btRigidBody_upcast_1 =
                        b.asm.fp).apply(null, arguments)
                }, nr = b._emscripten_bind_btRigidBody_getAabb_2 = function () {
                    return (nr = b._emscripten_bind_btRigidBody_getAabb_2 = b.asm.gp).apply(null, arguments)
                }, or = b._emscripten_bind_btRigidBody_applyGravity_0 = function () {
                    return (or = b._emscripten_bind_btRigidBody_applyGravity_0 = b.asm.hp).apply(null, arguments)
                }, pr = b._emscripten_bind_btRigidBody_getGravity_0 = function () {
                    return (pr = b._emscripten_bind_btRigidBody_getGravity_0 = b.asm.ip).apply(null, arguments)
                }, qr = b._emscripten_bind_btRigidBody_setGravity_1 =
                    function () {
                        return (qr = b._emscripten_bind_btRigidBody_setGravity_1 = b.asm.jp).apply(null, arguments)
                    }, rr = b._emscripten_bind_btRigidBody_getBroadphaseProxy_0 = function () {
                    return (rr = b._emscripten_bind_btRigidBody_getBroadphaseProxy_0 = b.asm.kp).apply(null, arguments)
                }, sr = b._emscripten_bind_btRigidBody_clearForces_0 = function () {
                    return (sr = b._emscripten_bind_btRigidBody_clearForces_0 = b.asm.lp).apply(null, arguments)
                }, tr = b._emscripten_bind_btRigidBody_setAnisotropicFriction_2 = function () {
                    return (tr = b._emscripten_bind_btRigidBody_setAnisotropicFriction_2 =
                        b.asm.mp).apply(null, arguments)
                }, ur = b._emscripten_bind_btRigidBody_getCollisionShape_0 = function () {
                    return (ur = b._emscripten_bind_btRigidBody_getCollisionShape_0 = b.asm.np).apply(null, arguments)
                }, vr = b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 = function () {
                    return (vr = b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 = b.asm.op).apply(null, arguments)
                }, wr = b._emscripten_bind_btRigidBody_setActivationState_1 = function () {
                    return (wr = b._emscripten_bind_btRigidBody_setActivationState_1 =
                        b.asm.pp).apply(null, arguments)
                }, xr = b._emscripten_bind_btRigidBody_forceActivationState_1 = function () {
                    return (xr = b._emscripten_bind_btRigidBody_forceActivationState_1 = b.asm.qp).apply(null, arguments)
                }, yr = b._emscripten_bind_btRigidBody_activate_0 = function () {
                    return (yr = b._emscripten_bind_btRigidBody_activate_0 = b.asm.rp).apply(null, arguments)
                }, zr = b._emscripten_bind_btRigidBody_activate_1 = function () {
                    return (zr = b._emscripten_bind_btRigidBody_activate_1 = b.asm.sp).apply(null, arguments)
                }, Ar = b._emscripten_bind_btRigidBody_isActive_0 =
                    function () {
                        return (Ar = b._emscripten_bind_btRigidBody_isActive_0 = b.asm.tp).apply(null, arguments)
                    }, Br = b._emscripten_bind_btRigidBody_isKinematicObject_0 = function () {
                    return (Br = b._emscripten_bind_btRigidBody_isKinematicObject_0 = b.asm.up).apply(null, arguments)
                }, Cr = b._emscripten_bind_btRigidBody_isStaticObject_0 = function () {
                    return (Cr = b._emscripten_bind_btRigidBody_isStaticObject_0 = b.asm.vp).apply(null, arguments)
                }, Dr = b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 = function () {
                    return (Dr = b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 =
                        b.asm.wp).apply(null, arguments)
                }, Er = b._emscripten_bind_btRigidBody_getRestitution_0 = function () {
                    return (Er = b._emscripten_bind_btRigidBody_getRestitution_0 = b.asm.xp).apply(null, arguments)
                }, Fr = b._emscripten_bind_btRigidBody_getFriction_0 = function () {
                    return (Fr = b._emscripten_bind_btRigidBody_getFriction_0 = b.asm.yp).apply(null, arguments)
                }, Gr = b._emscripten_bind_btRigidBody_getRollingFriction_0 = function () {
                    return (Gr = b._emscripten_bind_btRigidBody_getRollingFriction_0 = b.asm.zp).apply(null, arguments)
                }, Hr = b._emscripten_bind_btRigidBody_setRestitution_1 =
                    function () {
                        return (Hr = b._emscripten_bind_btRigidBody_setRestitution_1 = b.asm.Ap).apply(null, arguments)
                    }, Ir = b._emscripten_bind_btRigidBody_setFriction_1 = function () {
                    return (Ir = b._emscripten_bind_btRigidBody_setFriction_1 = b.asm.Bp).apply(null, arguments)
                }, Jr = b._emscripten_bind_btRigidBody_setRollingFriction_1 = function () {
                    return (Jr = b._emscripten_bind_btRigidBody_setRollingFriction_1 = b.asm.Cp).apply(null, arguments)
                }, Kr = b._emscripten_bind_btRigidBody_getWorldTransform_0 = function () {
                    return (Kr = b._emscripten_bind_btRigidBody_getWorldTransform_0 =
                        b.asm.Dp).apply(null, arguments)
                }, Lr = b._emscripten_bind_btRigidBody_getCollisionFlags_0 = function () {
                    return (Lr = b._emscripten_bind_btRigidBody_getCollisionFlags_0 = b.asm.Ep).apply(null, arguments)
                }, Mr = b._emscripten_bind_btRigidBody_setCollisionFlags_1 = function () {
                    return (Mr = b._emscripten_bind_btRigidBody_setCollisionFlags_1 = b.asm.Fp).apply(null, arguments)
                }, Nr = b._emscripten_bind_btRigidBody_setWorldTransform_1 = function () {
                    return (Nr = b._emscripten_bind_btRigidBody_setWorldTransform_1 = b.asm.Gp).apply(null, arguments)
                },
                Or = b._emscripten_bind_btRigidBody_setCollisionShape_1 = function () {
                    return (Or = b._emscripten_bind_btRigidBody_setCollisionShape_1 = b.asm.Hp).apply(null, arguments)
                }, Pr = b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 = function () {
                    return (Pr = b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 = b.asm.Ip).apply(null, arguments)
                }, Qr = b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 = function () {
                    return (Qr = b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 = b.asm.Jp).apply(null, arguments)
                }, Rr = b._emscripten_bind_btRigidBody_getUserIndex_0 =
                    function () {
                        return (Rr = b._emscripten_bind_btRigidBody_getUserIndex_0 = b.asm.Kp).apply(null, arguments)
                    }, Sr = b._emscripten_bind_btRigidBody_setUserIndex_1 = function () {
                    return (Sr = b._emscripten_bind_btRigidBody_setUserIndex_1 = b.asm.Lp).apply(null, arguments)
                }, Tr = b._emscripten_bind_btRigidBody_getUserPointer_0 = function () {
                    return (Tr = b._emscripten_bind_btRigidBody_getUserPointer_0 = b.asm.Mp).apply(null, arguments)
                }, Ur = b._emscripten_bind_btRigidBody_setUserPointer_1 = function () {
                    return (Ur = b._emscripten_bind_btRigidBody_setUserPointer_1 =
                        b.asm.Np).apply(null, arguments)
                }, Vr = b._emscripten_bind_btRigidBody_getBroadphaseHandle_0 = function () {
                    return (Vr = b._emscripten_bind_btRigidBody_getBroadphaseHandle_0 = b.asm.Op).apply(null, arguments)
                }, Wr = b._emscripten_bind_btRigidBody___destroy___0 = function () {
                    return (Wr = b._emscripten_bind_btRigidBody___destroy___0 = b.asm.Pp).apply(null, arguments)
                }, Xr = b._emscripten_bind_btConstraintSetting_btConstraintSetting_0 = function () {
                    return (Xr = b._emscripten_bind_btConstraintSetting_btConstraintSetting_0 = b.asm.Qp).apply(null,
                        arguments)
                }, Yr = b._emscripten_bind_btConstraintSetting_get_m_tau_0 = function () {
                    return (Yr = b._emscripten_bind_btConstraintSetting_get_m_tau_0 = b.asm.Rp).apply(null, arguments)
                }, Zr = b._emscripten_bind_btConstraintSetting_set_m_tau_1 = function () {
                    return (Zr = b._emscripten_bind_btConstraintSetting_set_m_tau_1 = b.asm.Sp).apply(null, arguments)
                }, $r = b._emscripten_bind_btConstraintSetting_get_m_damping_0 = function () {
                    return ($r = b._emscripten_bind_btConstraintSetting_get_m_damping_0 = b.asm.Tp).apply(null, arguments)
                }, as = b._emscripten_bind_btConstraintSetting_set_m_damping_1 =
                    function () {
                        return (as = b._emscripten_bind_btConstraintSetting_set_m_damping_1 = b.asm.Up).apply(null, arguments)
                    }, bs = b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 = function () {
                    return (bs = b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 = b.asm.Vp).apply(null, arguments)
                }, cs = b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 = function () {
                    return (cs = b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 = b.asm.Wp).apply(null, arguments)
                }, ds = b._emscripten_bind_btConstraintSetting___destroy___0 =
                    function () {
                        return (ds = b._emscripten_bind_btConstraintSetting___destroy___0 = b.asm.Xp).apply(null, arguments)
                    }, es = b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 = function () {
                    return (es = b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 = b.asm.Yp).apply(null, arguments)
                }, gs = b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 = function () {
                    return (gs = b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 = b.asm.Zp).apply(null, arguments)
                }, hs = b._emscripten_bind_btPoint2PointConstraint_setPivotA_1 =
                    function () {
                        return (hs = b._emscripten_bind_btPoint2PointConstraint_setPivotA_1 = b.asm._p).apply(null, arguments)
                    }, is = b._emscripten_bind_btPoint2PointConstraint_setPivotB_1 = function () {
                    return (is = b._emscripten_bind_btPoint2PointConstraint_setPivotB_1 = b.asm.$p).apply(null, arguments)
                }, js = b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 = function () {
                    return (js = b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 = b.asm.aq).apply(null, arguments)
                }, ks = b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 =
                    function () {
                        return (ks = b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 = b.asm.bq).apply(null, arguments)
                    }, ls = b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 = function () {
                    return (ls = b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 = b.asm.cq).apply(null, arguments)
                }, ms = b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (ms = b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 = b.asm.dq).apply(null, arguments)
                }, ns = b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 =
                    function () {
                        return (ns = b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 = b.asm.eq).apply(null, arguments)
                    }, ps = b._emscripten_bind_btPoint2PointConstraint_getParam_2 = function () {
                    return (ps = b._emscripten_bind_btPoint2PointConstraint_getParam_2 = b.asm.fq).apply(null, arguments)
                }, qs = b._emscripten_bind_btPoint2PointConstraint_setParam_3 = function () {
                    return (qs = b._emscripten_bind_btPoint2PointConstraint_setParam_3 = b.asm.gq).apply(null, arguments)
                }, rs = b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 =
                    function () {
                        return (rs = b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 = b.asm.hq).apply(null, arguments)
                    }, ss = b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 = function () {
                    return (ss = b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 = b.asm.iq).apply(null, arguments)
                }, ts = b._emscripten_bind_btPoint2PointConstraint___destroy___0 = function () {
                    return (ts = b._emscripten_bind_btPoint2PointConstraint___destroy___0 = b.asm.jq).apply(null, arguments)
                }, us = b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3 =
                    function () {
                        return (us = b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3 = b.asm.kq).apply(null, arguments)
                    }, vs = b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5 = function () {
                    return (vs = b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5 = b.asm.lq).apply(null, arguments)
                }, xs = b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2 = function () {
                    return (xs = b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2 =
                        b.asm.mq).apply(null, arguments)
                }, ys = b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2 = function () {
                    return (ys = b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2 = b.asm.nq).apply(null, arguments)
                }, zs = b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2 = function () {
                    return (zs = b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2 = b.asm.oq).apply(null, arguments)
                }, As = b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0 = function () {
                    return (As = b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0 =
                        b.asm.pq).apply(null, arguments)
                }, Bs = b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1 = function () {
                    return (Bs = b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1 = b.asm.qq).apply(null, arguments)
                }, Cs = b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2 = function () {
                    return (Cs = b._emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2 = b.asm.rq).apply(null, arguments)
                }, Ds = b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1 =
                    function () {
                        return (Ds = b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1 = b.asm.sq).apply(null, arguments)
                    }, Es = b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1 = function () {
                    return (Es = b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1 = b.asm.tq).apply(null, arguments)
                }, Fs = b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1 = function () {
                    return (Fs = b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1 = b.asm.uq).apply(null,
                        arguments)
                }, Gs = b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1 = function () {
                    return (Gs = b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1 = b.asm.vq).apply(null, arguments)
                }, Hs = b._emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0 = function () {
                    return (Hs = b._emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0 = b.asm.wq).apply(null, arguments)
                }, Is = b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1 = function () {
                    return (Is = b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1 =
                        b.asm.xq).apply(null, arguments)
                }, Js = b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (Js = b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0 = b.asm.yq).apply(null, arguments)
                }, Ks = b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1 = function () {
                    return (Ks = b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1 = b.asm.zq).apply(null, arguments)
                }, Ls = b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2 =
                    function () {
                        return (Ls = b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2 = b.asm.Aq).apply(null, arguments)
                    }, Ms = b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3 = function () {
                    return (Ms = b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3 = b.asm.Bq).apply(null, arguments)
                }, Ns = b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0 = function () {
                    return (Ns = b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0 = b.asm.Cq).apply(null, arguments)
                }, Os = b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 =
                    function () {
                        return (Os = b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 = b.asm.Dq).apply(null, arguments)
                    }, Ps = b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 = function () {
                    return (Ps = b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 = b.asm.Eq).apply(null, arguments)
                }, Qs = b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2 = function () {
                    return (Qs = b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2 = b.asm.Fq).apply(null,
                        arguments)
                }, Rs = b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4 = function () {
                    return (Rs = b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4 = b.asm.Gq).apply(null, arguments)
                }, Ss = b._emscripten_bind_btConeTwistConstraint_setLimit_2 = function () {
                    return (Ss = b._emscripten_bind_btConeTwistConstraint_setLimit_2 = b.asm.Hq).apply(null, arguments)
                }, Ts = b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1 = function () {
                    return (Ts = b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1 = b.asm.Iq).apply(null,
                        arguments)
                }, Us = b._emscripten_bind_btConeTwistConstraint_setDamping_1 = function () {
                    return (Us = b._emscripten_bind_btConeTwistConstraint_setDamping_1 = b.asm.Jq).apply(null, arguments)
                }, Vs = b._emscripten_bind_btConeTwistConstraint_enableMotor_1 = function () {
                    return (Vs = b._emscripten_bind_btConeTwistConstraint_enableMotor_1 = b.asm.Kq).apply(null, arguments)
                }, Ws = b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1 = function () {
                    return (Ws = b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1 = b.asm.Lq).apply(null,
                        arguments)
                }, Xs = b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1 = function () {
                    return (Xs = b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1 = b.asm.Mq).apply(null, arguments)
                }, Ys = b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1 = function () {
                    return (Ys = b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1 = b.asm.Nq).apply(null, arguments)
                }, Zs = b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1 = function () {
                    return (Zs = b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1 =
                        b.asm.Oq).apply(null, arguments)
                }, $s = b._emscripten_bind_btConeTwistConstraint_enableFeedback_1 = function () {
                    return ($s = b._emscripten_bind_btConeTwistConstraint_enableFeedback_1 = b.asm.Pq).apply(null, arguments)
                }, at = b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (at = b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0 = b.asm.Qq).apply(null, arguments)
                }, bt = b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1 = function () {
                    return (bt = b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1 =
                        b.asm.Rq).apply(null, arguments)
                }, ct = b._emscripten_bind_btConeTwistConstraint_getParam_2 = function () {
                    return (ct = b._emscripten_bind_btConeTwistConstraint_getParam_2 = b.asm.Sq).apply(null, arguments)
                }, dt = b._emscripten_bind_btConeTwistConstraint_setParam_3 = function () {
                    return (dt = b._emscripten_bind_btConeTwistConstraint_setParam_3 = b.asm.Tq).apply(null, arguments)
                }, et = b._emscripten_bind_btConeTwistConstraint___destroy___0 = function () {
                    return (et = b._emscripten_bind_btConeTwistConstraint___destroy___0 = b.asm.Uq).apply(null,
                        arguments)
                }, ft = b._emscripten_bind_btHingeConstraint_btHingeConstraint_2 = function () {
                    return (ft = b._emscripten_bind_btHingeConstraint_btHingeConstraint_2 = b.asm.Vq).apply(null, arguments)
                }, gt = b._emscripten_bind_btHingeConstraint_btHingeConstraint_3 = function () {
                    return (gt = b._emscripten_bind_btHingeConstraint_btHingeConstraint_3 = b.asm.Wq).apply(null, arguments)
                }, ht = b._emscripten_bind_btHingeConstraint_btHingeConstraint_4 = function () {
                    return (ht = b._emscripten_bind_btHingeConstraint_btHingeConstraint_4 = b.asm.Xq).apply(null,
                        arguments)
                }, it = b._emscripten_bind_btHingeConstraint_btHingeConstraint_5 = function () {
                    return (it = b._emscripten_bind_btHingeConstraint_btHingeConstraint_5 = b.asm.Yq).apply(null, arguments)
                }, jt = b._emscripten_bind_btHingeConstraint_btHingeConstraint_6 = function () {
                    return (jt = b._emscripten_bind_btHingeConstraint_btHingeConstraint_6 = b.asm.Zq).apply(null, arguments)
                }, kt = b._emscripten_bind_btHingeConstraint_btHingeConstraint_7 = function () {
                    return (kt = b._emscripten_bind_btHingeConstraint_btHingeConstraint_7 = b.asm._q).apply(null,
                        arguments)
                }, lt = b._emscripten_bind_btHingeConstraint_setLimit_4 = function () {
                    return (lt = b._emscripten_bind_btHingeConstraint_setLimit_4 = b.asm.$q).apply(null, arguments)
                }, mt = b._emscripten_bind_btHingeConstraint_setLimit_5 = function () {
                    return (mt = b._emscripten_bind_btHingeConstraint_setLimit_5 = b.asm.ar).apply(null, arguments)
                }, nt = b._emscripten_bind_btHingeConstraint_enableAngularMotor_3 = function () {
                    return (nt = b._emscripten_bind_btHingeConstraint_enableAngularMotor_3 = b.asm.br).apply(null, arguments)
                }, ot = b._emscripten_bind_btHingeConstraint_setAngularOnly_1 =
                    function () {
                        return (ot = b._emscripten_bind_btHingeConstraint_setAngularOnly_1 = b.asm.cr).apply(null, arguments)
                    }, pt = b._emscripten_bind_btHingeConstraint_enableMotor_1 = function () {
                    return (pt = b._emscripten_bind_btHingeConstraint_enableMotor_1 = b.asm.dr).apply(null, arguments)
                }, qt = b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1 = function () {
                    return (qt = b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1 = b.asm.er).apply(null, arguments)
                }, rt = b._emscripten_bind_btHingeConstraint_setMotorTarget_2 = function () {
                    return (rt =
                        b._emscripten_bind_btHingeConstraint_setMotorTarget_2 = b.asm.fr).apply(null, arguments)
                }, st = b._emscripten_bind_btHingeConstraint_enableFeedback_1 = function () {
                    return (st = b._emscripten_bind_btHingeConstraint_enableFeedback_1 = b.asm.gr).apply(null, arguments)
                }, tt = b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (tt = b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0 = b.asm.hr).apply(null, arguments)
                }, ut = b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1 =
                    function () {
                        return (ut = b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1 = b.asm.ir).apply(null, arguments)
                    }, vt = b._emscripten_bind_btHingeConstraint_getParam_2 = function () {
                    return (vt = b._emscripten_bind_btHingeConstraint_getParam_2 = b.asm.jr).apply(null, arguments)
                }, wt = b._emscripten_bind_btHingeConstraint_setParam_3 = function () {
                    return (wt = b._emscripten_bind_btHingeConstraint_setParam_3 = b.asm.kr).apply(null, arguments)
                }, xt = b._emscripten_bind_btHingeConstraint___destroy___0 = function () {
                    return (xt =
                        b._emscripten_bind_btHingeConstraint___destroy___0 = b.asm.lr).apply(null, arguments)
                }, yt = b._emscripten_bind_btSliderConstraint_btSliderConstraint_3 = function () {
                    return (yt = b._emscripten_bind_btSliderConstraint_btSliderConstraint_3 = b.asm.mr).apply(null, arguments)
                }, zt = b._emscripten_bind_btSliderConstraint_btSliderConstraint_5 = function () {
                    return (zt = b._emscripten_bind_btSliderConstraint_btSliderConstraint_5 = b.asm.nr).apply(null, arguments)
                }, At = b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1 = function () {
                    return (At =
                        b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1 = b.asm.or).apply(null, arguments)
                }, Bt = b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1 = function () {
                    return (Bt = b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1 = b.asm.pr).apply(null, arguments)
                }, Ct = b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1 = function () {
                    return (Ct = b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1 = b.asm.qr).apply(null, arguments)
                }, Dt = b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1 = function () {
                    return (Dt =
                        b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1 = b.asm.rr).apply(null, arguments)
                }, Et = b._emscripten_bind_btSliderConstraint_setPoweredLinMotor_1 = function () {
                    return (Et = b._emscripten_bind_btSliderConstraint_setPoweredLinMotor_1 = b.asm.sr).apply(null, arguments)
                }, Ft = b._emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1 = function () {
                    return (Ft = b._emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1 = b.asm.tr).apply(null, arguments)
                }, Gt = b._emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1 =
                    function () {
                        return (Gt = b._emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1 = b.asm.ur).apply(null, arguments)
                    }, Ht = b._emscripten_bind_btSliderConstraint_enableFeedback_1 = function () {
                    return (Ht = b._emscripten_bind_btSliderConstraint_enableFeedback_1 = b.asm.vr).apply(null, arguments)
                }, It = b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (It = b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0 = b.asm.wr).apply(null, arguments)
                }, Jt = b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1 =
                    function () {
                        return (Jt = b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1 = b.asm.xr).apply(null, arguments)
                    }, Kt = b._emscripten_bind_btSliderConstraint_getParam_2 = function () {
                    return (Kt = b._emscripten_bind_btSliderConstraint_getParam_2 = b.asm.yr).apply(null, arguments)
                }, Lt = b._emscripten_bind_btSliderConstraint_setParam_3 = function () {
                    return (Lt = b._emscripten_bind_btSliderConstraint_setParam_3 = b.asm.zr).apply(null, arguments)
                }, Mt = b._emscripten_bind_btSliderConstraint___destroy___0 = function () {
                    return (Mt =
                        b._emscripten_bind_btSliderConstraint___destroy___0 = b.asm.Ar).apply(null, arguments)
                }, Nt = b._emscripten_bind_btFixedConstraint_btFixedConstraint_4 = function () {
                    return (Nt = b._emscripten_bind_btFixedConstraint_btFixedConstraint_4 = b.asm.Br).apply(null, arguments)
                }, Ot = b._emscripten_bind_btFixedConstraint_enableFeedback_1 = function () {
                    return (Ot = b._emscripten_bind_btFixedConstraint_enableFeedback_1 = b.asm.Cr).apply(null, arguments)
                }, Pt = b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 = function () {
                    return (Pt =
                        b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 = b.asm.Dr).apply(null, arguments)
                }, Qt = b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 = function () {
                    return (Qt = b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 = b.asm.Er).apply(null, arguments)
                }, Rt = b._emscripten_bind_btFixedConstraint_getParam_2 = function () {
                    return (Rt = b._emscripten_bind_btFixedConstraint_getParam_2 = b.asm.Fr).apply(null, arguments)
                }, St = b._emscripten_bind_btFixedConstraint_setParam_3 = function () {
                    return (St =
                        b._emscripten_bind_btFixedConstraint_setParam_3 = b.asm.Gr).apply(null, arguments)
                }, Tt = b._emscripten_bind_btFixedConstraint___destroy___0 = function () {
                    return (Tt = b._emscripten_bind_btFixedConstraint___destroy___0 = b.asm.Hr).apply(null, arguments)
                }, Ut = b._emscripten_bind_btConstraintSolver___destroy___0 = function () {
                    return (Ut = b._emscripten_bind_btConstraintSolver___destroy___0 = b.asm.Ir).apply(null, arguments)
                }, Vt = b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 = function () {
                    return (Vt = b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 =
                        b.asm.Jr).apply(null, arguments)
                }, Wt = b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 = function () {
                    return (Wt = b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 = b.asm.Kr).apply(null, arguments)
                }, Xt = b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 = function () {
                    return (Xt = b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 = b.asm.Lr).apply(null, arguments)
                }, Yt = b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 = function () {
                    return (Yt = b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 = b.asm.Mr).apply(null,
                        arguments)
                }, Zt = b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 = function () {
                    return (Zt = b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 = b.asm.Nr).apply(null, arguments)
                }, $t = b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 = function () {
                    return ($t = b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 = b.asm.Or).apply(null, arguments)
                }, au = b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 = function () {
                    return (au = b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 = b.asm.Pr).apply(null,
                        arguments)
                }, bu = b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 = function () {
                    return (bu = b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 = b.asm.Qr).apply(null, arguments)
                }, cu = b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 = function () {
                    return (cu = b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 = b.asm.Rr).apply(null, arguments)
                }, du = b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 = function () {
                    return (du = b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 = b.asm.Sr).apply(null,
                        arguments)
                }, eu = b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 = function () {
                    return (eu = b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 = b.asm.Tr).apply(null, arguments)
                }, fu = b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 = function () {
                    return (fu = b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 = b.asm.Ur).apply(null, arguments)
                }, gu = b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 = function () {
                    return (gu = b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 = b.asm.Vr).apply(null,
                        arguments)
                }, hu = b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 = function () {
                    return (hu = b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 = b.asm.Wr).apply(null, arguments)
                }, iu = b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 = function () {
                    return (iu = b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 = b.asm.Xr).apply(null, arguments)
                }, ju = b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 = function () {
                    return (ju = b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 = b.asm.Yr).apply(null, arguments)
                }, ku = b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 =
                    function () {
                        return (ku = b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 = b.asm.Zr).apply(null, arguments)
                    }, lu = b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 = function () {
                    return (lu = b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 = b.asm._r).apply(null, arguments)
                }, mu = b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 = function () {
                    return (mu = b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 = b.asm.$r).apply(null,
                        arguments)
                }, nu = b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 = function () {
                    return (nu = b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 = b.asm.as).apply(null, arguments)
                }, ou = b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 = function () {
                    return (ou = b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 = b.asm.bs).apply(null, arguments)
                }, pu = b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 =
                    function () {
                        return (pu = b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 = b.asm.cs).apply(null, arguments)
                    }, qu = b._emscripten_bind_btDispatcherInfo___destroy___0 = function () {
                    return (qu = b._emscripten_bind_btDispatcherInfo___destroy___0 = b.asm.ds).apply(null, arguments)
                }, ru = b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 = function () {
                    return (ru = b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 = b.asm.es).apply(null, arguments)
                }, su = b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 =
                    function () {
                        return (su = b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 = b.asm.fs).apply(null, arguments)
                    }, tu = b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 = function () {
                    return (tu = b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 = b.asm.gs).apply(null, arguments)
                }, uu = b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 = function () {
                    return (uu = b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 =
                        b.asm.hs).apply(null, arguments)
                }, vu = b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 = function () {
                    return (vu = b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 = b.asm.is).apply(null, arguments)
                }, wu = b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 = function () {
                    return (wu = b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 = b.asm.js).apply(null, arguments)
                }, xu = b._emscripten_bind_btContactSolverInfo___destroy___0 = function () {
                    return (xu = b._emscripten_bind_btContactSolverInfo___destroy___0 =
                        b.asm.ks).apply(null, arguments)
                }, yu = b._emscripten_bind_btVehicleTuning_btVehicleTuning_0 = function () {
                    return (yu = b._emscripten_bind_btVehicleTuning_btVehicleTuning_0 = b.asm.ls).apply(null, arguments)
                }, zu = b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0 = function () {
                    return (zu = b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0 = b.asm.ms).apply(null, arguments)
                }, Au = b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1 = function () {
                    return (Au = b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1 =
                        b.asm.ns).apply(null, arguments)
                }, Bu = b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0 = function () {
                    return (Bu = b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0 = b.asm.os).apply(null, arguments)
                }, Cu = b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1 = function () {
                    return (Cu = b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1 = b.asm.ps).apply(null, arguments)
                }, Du = b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0 = function () {
                    return (Du = b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0 =
                        b.asm.qs).apply(null, arguments)
                }, Eu = b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1 = function () {
                    return (Eu = b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1 = b.asm.rs).apply(null, arguments)
                }, Fu = b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0 = function () {
                    return (Fu = b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0 = b.asm.ss).apply(null, arguments)
                }, Gu = b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1 = function () {
                    return (Gu = b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1 =
                        b.asm.ts).apply(null, arguments)
                }, Hu = b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0 = function () {
                    return (Hu = b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0 = b.asm.us).apply(null, arguments)
                }, Iu = b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1 = function () {
                    return (Iu = b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1 = b.asm.vs).apply(null, arguments)
                }, Ju = b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0 = function () {
                    return (Ju = b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0 =
                        b.asm.ws).apply(null, arguments)
                }, Ku = b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1 = function () {
                    return (Ku = b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1 = b.asm.xs).apply(null, arguments)
                }, Lu = b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0 = function () {
                    return (Lu = b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0 = b.asm.ys).apply(null, arguments)
                }, Mu = b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1 = function () {
                    return (Mu = b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1 =
                        b.asm.zs).apply(null, arguments)
                }, Nu = b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0 = function () {
                    return (Nu = b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0 = b.asm.As).apply(null, arguments)
                }, Ou = b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1 = function () {
                    return (Ou = b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1 = b.asm.Bs).apply(null, arguments)
                }, Pu = b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0 = function () {
                    return (Pu =
                        b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0 = b.asm.Cs).apply(null, arguments)
                }, Qu = b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1 = function () {
                    return (Qu = b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1 = b.asm.Ds).apply(null, arguments)
                }, Ru = b._emscripten_bind_btVehicleRaycasterResult___destroy___0 = function () {
                    return (Ru = b._emscripten_bind_btVehicleRaycasterResult___destroy___0 = b.asm.Es).apply(null, arguments)
                }, Su = b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1 =
                    function () {
                        return (Su = b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1 = b.asm.Fs).apply(null, arguments)
                    }, Tu = b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3 = function () {
                    return (Tu = b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3 = b.asm.Gs).apply(null, arguments)
                }, Uu = b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0 = function () {
                    return (Uu = b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0 = b.asm.Hs).apply(null, arguments)
                }, Vu = b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0 =
                    function () {
                        return (Vu = b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0 = b.asm.Is).apply(null, arguments)
                    }, Wu = b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1 = function () {
                    return (Wu = b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1 = b.asm.Js).apply(null, arguments)
                }, Xu = b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0 = function () {
                    return (Xu = b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0 = b.asm.Ks).apply(null, arguments)
                }, Yu = b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1 = function () {
                    return (Yu =
                        b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1 = b.asm.Ls).apply(null, arguments)
                }, Zu = b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0 = function () {
                    return (Zu = b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0 = b.asm.Ms).apply(null, arguments)
                }, $u = b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1 = function () {
                    return ($u = b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1 = b.asm.Ns).apply(null, arguments)
                }, av = b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0 = function () {
                    return (av = b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0 =
                        b.asm.Os).apply(null, arguments)
                }, bv = b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1 = function () {
                    return (bv = b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1 = b.asm.Ps).apply(null, arguments)
                }, cv = b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0 = function () {
                    return (cv = b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0 = b.asm.Qs).apply(null, arguments)
                }, dv = b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1 = function () {
                    return (dv = b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1 = b.asm.Rs).apply(null,
                        arguments)
                }, ev = b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0 = function () {
                    return (ev = b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0 = b.asm.Ss).apply(null, arguments)
                }, fv = b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1 = function () {
                    return (fv = b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1 = b.asm.Ts).apply(null, arguments)
                }, gv = b._emscripten_bind_RaycastInfo_get_m_isInContact_0 = function () {
                    return (gv = b._emscripten_bind_RaycastInfo_get_m_isInContact_0 = b.asm.Us).apply(null, arguments)
                }, hv = b._emscripten_bind_RaycastInfo_set_m_isInContact_1 =
                    function () {
                        return (hv = b._emscripten_bind_RaycastInfo_set_m_isInContact_1 = b.asm.Vs).apply(null, arguments)
                    }, iv = b._emscripten_bind_RaycastInfo_get_m_groundObject_0 = function () {
                    return (iv = b._emscripten_bind_RaycastInfo_get_m_groundObject_0 = b.asm.Ws).apply(null, arguments)
                }, jv = b._emscripten_bind_RaycastInfo_set_m_groundObject_1 = function () {
                    return (jv = b._emscripten_bind_RaycastInfo_set_m_groundObject_1 = b.asm.Xs).apply(null, arguments)
                }, kv = b._emscripten_bind_RaycastInfo___destroy___0 = function () {
                    return (kv = b._emscripten_bind_RaycastInfo___destroy___0 =
                        b.asm.Ys).apply(null, arguments)
                }, lv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0 = function () {
                    return (lv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0 = b.asm.Zs).apply(null, arguments)
                }, mv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1 = function () {
                    return (mv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1 = b.asm._s).apply(null, arguments)
                }, nv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0 =
                    function () {
                        return (nv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0 = b.asm.$s).apply(null, arguments)
                    }, ov = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1 = function () {
                    return (ov = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1 = b.asm.at).apply(null, arguments)
                }, pv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0 = function () {
                    return (pv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0 = b.asm.bt).apply(null,
                        arguments)
                }, qv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1 = function () {
                    return (qv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1 = b.asm.ct).apply(null, arguments)
                }, rv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0 = function () {
                    return (rv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0 = b.asm.dt).apply(null, arguments)
                }, sv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1 = function () {
                    return (sv =
                        b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1 = b.asm.et).apply(null, arguments)
                }, tv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0 = function () {
                    return (tv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0 = b.asm.ft).apply(null, arguments)
                }, uv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1 = function () {
                    return (uv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1 = b.asm.gt).apply(null,
                        arguments)
                }, vv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0 = function () {
                    return (vv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0 = b.asm.ht).apply(null, arguments)
                }, wv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1 = function () {
                    return (wv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1 = b.asm.it).apply(null, arguments)
                }, xv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0 = function () {
                    return (xv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0 =
                        b.asm.jt).apply(null, arguments)
                }, yv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1 = function () {
                    return (yv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1 = b.asm.kt).apply(null, arguments)
                }, zv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0 = function () {
                    return (zv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0 = b.asm.lt).apply(null, arguments)
                }, Av = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1 =
                    function () {
                        return (Av = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1 = b.asm.mt).apply(null, arguments)
                    }, Bv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0 = function () {
                    return (Bv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0 = b.asm.nt).apply(null, arguments)
                }, Cv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1 = function () {
                    return (Cv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1 =
                        b.asm.ot).apply(null, arguments)
                }, Dv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0 = function () {
                    return (Dv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0 = b.asm.pt).apply(null, arguments)
                }, Ev = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1 = function () {
                    return (Ev = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1 = b.asm.qt).apply(null, arguments)
                }, Fv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0 = function () {
                    return (Fv =
                        b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0 = b.asm.rt).apply(null, arguments)
                }, Gv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1 = function () {
                    return (Gv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1 = b.asm.st).apply(null, arguments)
                }, Hv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0 = function () {
                    return (Hv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0 = b.asm.tt).apply(null, arguments)
                },
                Iv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1 = function () {
                    return (Iv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1 = b.asm.ut).apply(null, arguments)
                }, Jv = b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0 = function () {
                    return (Jv = b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0 = b.asm.vt).apply(null, arguments)
                }, Kv = b._emscripten_bind_btWheelInfo_btWheelInfo_1 = function () {
                    return (Kv = b._emscripten_bind_btWheelInfo_btWheelInfo_1 = b.asm.wt).apply(null,
                        arguments)
                }, Lv = b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0 = function () {
                    return (Lv = b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0 = b.asm.xt).apply(null, arguments)
                }, Mv = b._emscripten_bind_btWheelInfo_updateWheel_2 = function () {
                    return (Mv = b._emscripten_bind_btWheelInfo_updateWheel_2 = b.asm.yt).apply(null, arguments)
                }, Nv = b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0 = function () {
                    return (Nv = b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0 = b.asm.zt).apply(null, arguments)
                },
                Ov = b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1 = function () {
                    return (Ov = b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1 = b.asm.At).apply(null, arguments)
                }, Pv = b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0 = function () {
                    return (Pv = b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0 = b.asm.Bt).apply(null, arguments)
                }, Qv = b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1 = function () {
                    return (Qv = b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1 = b.asm.Ct).apply(null, arguments)
                }, Rv = b._emscripten_bind_btWheelInfo_get_m_engineForce_0 =
                    function () {
                        return (Rv = b._emscripten_bind_btWheelInfo_get_m_engineForce_0 = b.asm.Dt).apply(null, arguments)
                    }, Sv = b._emscripten_bind_btWheelInfo_set_m_engineForce_1 = function () {
                    return (Sv = b._emscripten_bind_btWheelInfo_set_m_engineForce_1 = b.asm.Et).apply(null, arguments)
                }, Tv = b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0 = function () {
                    return (Tv = b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0 = b.asm.Ft).apply(null, arguments)
                }, Uv = b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1 = function () {
                    return (Uv =
                        b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1 = b.asm.Gt).apply(null, arguments)
                }, Vv = b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0 = function () {
                    return (Vv = b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0 = b.asm.Ht).apply(null, arguments)
                }, Wv = b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1 = function () {
                    return (Wv = b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1 = b.asm.It).apply(null, arguments)
                }, Xv = b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0 = function () {
                    return (Xv =
                        b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0 = b.asm.Jt).apply(null, arguments)
                }, Yv = b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1 = function () {
                    return (Yv = b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1 = b.asm.Kt).apply(null, arguments)
                }, Zv = b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0 = function () {
                    return (Zv = b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0 = b.asm.Lt).apply(null, arguments)
                }, $v = b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1 = function () {
                    return ($v =
                        b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1 = b.asm.Mt).apply(null, arguments)
                }, aw = b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0 = function () {
                    return (aw = b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0 = b.asm.Nt).apply(null, arguments)
                }, bw = b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1 = function () {
                    return (bw = b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1 = b.asm.Ot).apply(null, arguments)
                }, cw = b._emscripten_bind_btWheelInfo_get_m_steering_0 =
                    function () {
                        return (cw = b._emscripten_bind_btWheelInfo_get_m_steering_0 = b.asm.Pt).apply(null, arguments)
                    }, dw = b._emscripten_bind_btWheelInfo_set_m_steering_1 = function () {
                    return (dw = b._emscripten_bind_btWheelInfo_set_m_steering_1 = b.asm.Qt).apply(null, arguments)
                }, ew = b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0 = function () {
                    return (ew = b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0 = b.asm.Rt).apply(null, arguments)
                }, fw = b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1 = function () {
                    return (fw =
                        b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1 = b.asm.St).apply(null, arguments)
                }, gw = b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0 = function () {
                    return (gw = b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0 = b.asm.Tt).apply(null, arguments)
                }, hw = b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1 = function () {
                    return (hw = b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1 = b.asm.Ut).apply(null, arguments)
                }, iw = b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0 =
                    function () {
                        return (iw = b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0 = b.asm.Vt).apply(null, arguments)
                    }, jw = b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1 = function () {
                    return (jw = b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1 = b.asm.Wt).apply(null, arguments)
                }, kw = b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0 = function () {
                    return (kw = b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0 = b.asm.Xt).apply(null, arguments)
                }, lw = b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1 =
                    function () {
                        return (lw = b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1 = b.asm.Yt).apply(null, arguments)
                    }, mw = b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0 = function () {
                    return (mw = b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0 = b.asm.Zt).apply(null, arguments)
                }, nw = b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1 = function () {
                    return (nw = b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1 = b.asm._t).apply(null, arguments)
                }, ow = b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0 = function () {
                    return (ow =
                        b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0 = b.asm.$t).apply(null, arguments)
                }, pw = b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1 = function () {
                    return (pw = b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1 = b.asm.au).apply(null, arguments)
                }, qw = b._emscripten_bind_btWheelInfo_get_m_worldTransform_0 = function () {
                    return (qw = b._emscripten_bind_btWheelInfo_get_m_worldTransform_0 = b.asm.bu).apply(null, arguments)
                }, rw = b._emscripten_bind_btWheelInfo_set_m_worldTransform_1 =
                    function () {
                        return (rw = b._emscripten_bind_btWheelInfo_set_m_worldTransform_1 = b.asm.cu).apply(null, arguments)
                    }, sw = b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0 = function () {
                    return (sw = b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0 = b.asm.du).apply(null, arguments)
                }, tw = b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1 = function () {
                    return (tw = b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1 = b.asm.eu).apply(null, arguments)
                }, uw = b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0 = function () {
                    return (uw =
                        b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0 = b.asm.fu).apply(null, arguments)
                }, vw = b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1 = function () {
                    return (vw = b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1 = b.asm.gu).apply(null, arguments)
                }, ww = b._emscripten_bind_btWheelInfo_get_m_rotation_0 = function () {
                    return (ww = b._emscripten_bind_btWheelInfo_get_m_rotation_0 = b.asm.hu).apply(null, arguments)
                }, xw = b._emscripten_bind_btWheelInfo_set_m_rotation_1 = function () {
                    return (xw = b._emscripten_bind_btWheelInfo_set_m_rotation_1 =
                        b.asm.iu).apply(null, arguments)
                }, yw = b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0 = function () {
                    return (yw = b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0 = b.asm.ju).apply(null, arguments)
                }, zw = b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1 = function () {
                    return (zw = b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1 = b.asm.ku).apply(null, arguments)
                }, Aw = b._emscripten_bind_btWheelInfo_get_m_brake_0 = function () {
                    return (Aw = b._emscripten_bind_btWheelInfo_get_m_brake_0 = b.asm.lu).apply(null, arguments)
                },
                Bw = b._emscripten_bind_btWheelInfo_set_m_brake_1 = function () {
                    return (Bw = b._emscripten_bind_btWheelInfo_set_m_brake_1 = b.asm.mu).apply(null, arguments)
                }, Cw = b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0 = function () {
                    return (Cw = b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0 = b.asm.nu).apply(null, arguments)
                }, Dw = b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1 = function () {
                    return (Dw = b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1 =
                        b.asm.ou).apply(null, arguments)
                }, Ew = b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0 = function () {
                    return (Ew = b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0 = b.asm.pu).apply(null, arguments)
                }, Fw = b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1 = function () {
                    return (Fw = b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1 = b.asm.qu).apply(null, arguments)
                }, Gw = b._emscripten_bind_btWheelInfo_get_m_skidInfo_0 = function () {
                    return (Gw = b._emscripten_bind_btWheelInfo_get_m_skidInfo_0 =
                        b.asm.ru).apply(null, arguments)
                }, Hw = b._emscripten_bind_btWheelInfo_set_m_skidInfo_1 = function () {
                    return (Hw = b._emscripten_bind_btWheelInfo_set_m_skidInfo_1 = b.asm.su).apply(null, arguments)
                }, Iw = b._emscripten_bind_btWheelInfo___destroy___0 = function () {
                    return (Iw = b._emscripten_bind_btWheelInfo___destroy___0 = b.asm.tu).apply(null, arguments)
                }, Jw = b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3 = function () {
                    return (Jw = b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3 =
                        b.asm.uu).apply(null, arguments)
                }, Kw = b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4 = function () {
                    return (Kw = b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4 = b.asm.vu).apply(null, arguments)
                }, Lw = b._emscripten_bind_btKinematicCharacterController_setUpAxis_1 = function () {
                    return (Lw = b._emscripten_bind_btKinematicCharacterController_setUpAxis_1 = b.asm.wu).apply(null, arguments)
                }, Mw = b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1 =
                    function () {
                        return (Mw = b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1 = b.asm.xu).apply(null, arguments)
                    }, Nw = b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2 = function () {
                    return (Nw = b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2 = b.asm.yu).apply(null, arguments)
                }, Ow = b._emscripten_bind_btKinematicCharacterController_warp_1 = function () {
                    return (Ow = b._emscripten_bind_btKinematicCharacterController_warp_1 = b.asm.zu).apply(null, arguments)
                },
                Pw = b._emscripten_bind_btKinematicCharacterController_preStep_1 = function () {
                    return (Pw = b._emscripten_bind_btKinematicCharacterController_preStep_1 = b.asm.Au).apply(null, arguments)
                }, Qw = b._emscripten_bind_btKinematicCharacterController_playerStep_2 = function () {
                    return (Qw = b._emscripten_bind_btKinematicCharacterController_playerStep_2 = b.asm.Bu).apply(null, arguments)
                }, Rw = b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1 = function () {
                    return (Rw = b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1 =
                        b.asm.Cu).apply(null, arguments)
                }, Sw = b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1 = function () {
                    return (Sw = b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1 = b.asm.Du).apply(null, arguments)
                }, Tw = b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1 = function () {
                    return (Tw = b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1 = b.asm.Eu).apply(null, arguments)
                }, Uw = b._emscripten_bind_btKinematicCharacterController_canJump_0 = function () {
                    return (Uw = b._emscripten_bind_btKinematicCharacterController_canJump_0 =
                        b.asm.Fu).apply(null, arguments)
                }, Vw = b._emscripten_bind_btKinematicCharacterController_jump_0 = function () {
                    return (Vw = b._emscripten_bind_btKinematicCharacterController_jump_0 = b.asm.Gu).apply(null, arguments)
                }, Ww = b._emscripten_bind_btKinematicCharacterController_setGravity_1 = function () {
                    return (Ww = b._emscripten_bind_btKinematicCharacterController_setGravity_1 = b.asm.Hu).apply(null, arguments)
                }, Xw = b._emscripten_bind_btKinematicCharacterController_getGravity_0 = function () {
                    return (Xw = b._emscripten_bind_btKinematicCharacterController_getGravity_0 =
                        b.asm.Iu).apply(null, arguments)
                }, Yw = b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1 = function () {
                    return (Yw = b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1 = b.asm.Ju).apply(null, arguments)
                }, Zw = b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0 = function () {
                    return (Zw = b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0 = b.asm.Ku).apply(null, arguments)
                }, $w = b._emscripten_bind_btKinematicCharacterController_getGhostObject_0 = function () {
                    return ($w = b._emscripten_bind_btKinematicCharacterController_getGhostObject_0 =
                        b.asm.Lu).apply(null, arguments)
                }, ax = b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1 = function () {
                    return (ax = b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1 = b.asm.Mu).apply(null, arguments)
                }, bx = b._emscripten_bind_btKinematicCharacterController_onGround_0 = function () {
                    return (bx = b._emscripten_bind_btKinematicCharacterController_onGround_0 = b.asm.Nu).apply(null, arguments)
                }, cx = b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1 = function () {
                    return (cx =
                        b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1 = b.asm.Ou).apply(null, arguments)
                }, dx = b._emscripten_bind_btKinematicCharacterController_updateAction_2 = function () {
                    return (dx = b._emscripten_bind_btKinematicCharacterController_updateAction_2 = b.asm.Pu).apply(null, arguments)
                }, ex = b._emscripten_bind_btKinematicCharacterController___destroy___0 = function () {
                    return (ex = b._emscripten_bind_btKinematicCharacterController___destroy___0 = b.asm.Qu).apply(null, arguments)
                }, fx = b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3 =
                    function () {
                        return (fx = b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3 = b.asm.Ru).apply(null, arguments)
                    }, gx = b._emscripten_bind_btRaycastVehicle_applyEngineForce_2 = function () {
                    return (gx = b._emscripten_bind_btRaycastVehicle_applyEngineForce_2 = b.asm.Su).apply(null, arguments)
                }, hx = b._emscripten_bind_btRaycastVehicle_setSteeringValue_2 = function () {
                    return (hx = b._emscripten_bind_btRaycastVehicle_setSteeringValue_2 = b.asm.Tu).apply(null, arguments)
                }, ix = b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1 =
                    function () {
                        return (ix = b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1 = b.asm.Uu).apply(null, arguments)
                    }, jx = b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2 = function () {
                    return (jx = b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2 = b.asm.Vu).apply(null, arguments)
                }, kx = b._emscripten_bind_btRaycastVehicle_addWheel_7 = function () {
                    return (kx = b._emscripten_bind_btRaycastVehicle_addWheel_7 = b.asm.Wu).apply(null, arguments)
                }, lx = b._emscripten_bind_btRaycastVehicle_getNumWheels_0 = function () {
                    return (lx =
                        b._emscripten_bind_btRaycastVehicle_getNumWheels_0 = b.asm.Xu).apply(null, arguments)
                }, mx = b._emscripten_bind_btRaycastVehicle_getRigidBody_0 = function () {
                    return (mx = b._emscripten_bind_btRaycastVehicle_getRigidBody_0 = b.asm.Yu).apply(null, arguments)
                }, nx = b._emscripten_bind_btRaycastVehicle_getWheelInfo_1 = function () {
                    return (nx = b._emscripten_bind_btRaycastVehicle_getWheelInfo_1 = b.asm.Zu).apply(null, arguments)
                }, ox = b._emscripten_bind_btRaycastVehicle_setBrake_2 = function () {
                    return (ox = b._emscripten_bind_btRaycastVehicle_setBrake_2 =
                        b.asm._u).apply(null, arguments)
                }, px = b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3 = function () {
                    return (px = b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3 = b.asm.$u).apply(null, arguments)
                }, qx = b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0 = function () {
                    return (qx = b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0 = b.asm.av).apply(null, arguments)
                }, rx = b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0 = function () {
                    return (rx = b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0 =
                        b.asm.bv).apply(null, arguments)
                }, sx = b._emscripten_bind_btRaycastVehicle_rayCast_1 = function () {
                    return (sx = b._emscripten_bind_btRaycastVehicle_rayCast_1 = b.asm.cv).apply(null, arguments)
                }, tx = b._emscripten_bind_btRaycastVehicle_updateVehicle_1 = function () {
                    return (tx = b._emscripten_bind_btRaycastVehicle_updateVehicle_1 = b.asm.dv).apply(null, arguments)
                }, ux = b._emscripten_bind_btRaycastVehicle_resetSuspension_0 = function () {
                    return (ux = b._emscripten_bind_btRaycastVehicle_resetSuspension_0 = b.asm.ev).apply(null, arguments)
                },
                vx = b._emscripten_bind_btRaycastVehicle_getSteeringValue_1 = function () {
                    return (vx = b._emscripten_bind_btRaycastVehicle_getSteeringValue_1 = b.asm.fv).apply(null, arguments)
                }, wx = b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1 = function () {
                    return (wx = b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1 = b.asm.gv).apply(null, arguments)
                }, xx = b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2 = function () {
                    return (xx = b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2 = b.asm.hv).apply(null,
                        arguments)
                }, yx = b._emscripten_bind_btRaycastVehicle_setPitchControl_1 = function () {
                    return (yx = b._emscripten_bind_btRaycastVehicle_setPitchControl_1 = b.asm.iv).apply(null, arguments)
                }, zx = b._emscripten_bind_btRaycastVehicle_updateSuspension_1 = function () {
                    return (zx = b._emscripten_bind_btRaycastVehicle_updateSuspension_1 = b.asm.jv).apply(null, arguments)
                }, Ax = b._emscripten_bind_btRaycastVehicle_updateFriction_1 = function () {
                    return (Ax = b._emscripten_bind_btRaycastVehicle_updateFriction_1 = b.asm.kv).apply(null, arguments)
                },
                Bx = b._emscripten_bind_btRaycastVehicle_getRightAxis_0 = function () {
                    return (Bx = b._emscripten_bind_btRaycastVehicle_getRightAxis_0 = b.asm.lv).apply(null, arguments)
                }, Cx = b._emscripten_bind_btRaycastVehicle_getUpAxis_0 = function () {
                    return (Cx = b._emscripten_bind_btRaycastVehicle_getUpAxis_0 = b.asm.mv).apply(null, arguments)
                }, Dx = b._emscripten_bind_btRaycastVehicle_getForwardAxis_0 = function () {
                    return (Dx = b._emscripten_bind_btRaycastVehicle_getForwardAxis_0 = b.asm.nv).apply(null, arguments)
                }, Ex = b._emscripten_bind_btRaycastVehicle_getForwardVector_0 =
                    function () {
                        return (Ex = b._emscripten_bind_btRaycastVehicle_getForwardVector_0 = b.asm.ov).apply(null, arguments)
                    }, Fx = b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0 = function () {
                    return (Fx = b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0 = b.asm.pv).apply(null, arguments)
                }, Gx = b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1 = function () {
                    return (Gx = b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1 = b.asm.qv).apply(null, arguments)
                }, Hx = b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1 =
                    function () {
                        return (Hx = b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1 = b.asm.rv).apply(null, arguments)
                    }, Ix = b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0 = function () {
                    return (Ix = b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0 = b.asm.sv).apply(null, arguments)
                }, Jx = b._emscripten_bind_btRaycastVehicle_updateAction_2 = function () {
                    return (Jx = b._emscripten_bind_btRaycastVehicle_updateAction_2 = b.asm.tv).apply(null, arguments)
                }, Kx = b._emscripten_bind_btRaycastVehicle___destroy___0 = function () {
                    return (Kx =
                        b._emscripten_bind_btRaycastVehicle___destroy___0 = b.asm.uv).apply(null, arguments)
                }, Lx = b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0 = function () {
                    return (Lx = b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0 = b.asm.vv).apply(null, arguments)
                }, Mx = b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2 = function () {
                    return (Mx = b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2 = b.asm.wv).apply(null, arguments)
                }, Nx = b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0 =
                    function () {
                        return (Nx = b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0 = b.asm.xv).apply(null, arguments)
                    }, Ox = b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1 = function () {
                    return (Ox = b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1 = b.asm.yv).apply(null, arguments)
                }, Px = b._emscripten_bind_btPairCachingGhostObject_setActivationState_1 = function () {
                    return (Px = b._emscripten_bind_btPairCachingGhostObject_setActivationState_1 = b.asm.zv).apply(null,
                        arguments)
                }, Qx = b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1 = function () {
                    return (Qx = b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1 = b.asm.Av).apply(null, arguments)
                }, Rx = b._emscripten_bind_btPairCachingGhostObject_activate_0 = function () {
                    return (Rx = b._emscripten_bind_btPairCachingGhostObject_activate_0 = b.asm.Bv).apply(null, arguments)
                }, Sx = b._emscripten_bind_btPairCachingGhostObject_activate_1 = function () {
                    return (Sx = b._emscripten_bind_btPairCachingGhostObject_activate_1 =
                        b.asm.Cv).apply(null, arguments)
                }, Tx = b._emscripten_bind_btPairCachingGhostObject_isActive_0 = function () {
                    return (Tx = b._emscripten_bind_btPairCachingGhostObject_isActive_0 = b.asm.Dv).apply(null, arguments)
                }, Ux = b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0 = function () {
                    return (Ux = b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0 = b.asm.Ev).apply(null, arguments)
                }, Vx = b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0 = function () {
                    return (Vx = b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0 =
                        b.asm.Fv).apply(null, arguments)
                }, Wx = b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0 = function () {
                    return (Wx = b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0 = b.asm.Gv).apply(null, arguments)
                }, Xx = b._emscripten_bind_btPairCachingGhostObject_getRestitution_0 = function () {
                    return (Xx = b._emscripten_bind_btPairCachingGhostObject_getRestitution_0 = b.asm.Hv).apply(null, arguments)
                }, Yx = b._emscripten_bind_btPairCachingGhostObject_getFriction_0 = function () {
                    return (Yx = b._emscripten_bind_btPairCachingGhostObject_getFriction_0 =
                        b.asm.Iv).apply(null, arguments)
                }, Zx = b._emscripten_bind_btPairCachingGhostObject_getRollingFriction_0 = function () {
                    return (Zx = b._emscripten_bind_btPairCachingGhostObject_getRollingFriction_0 = b.asm.Jv).apply(null, arguments)
                }, $x = b._emscripten_bind_btPairCachingGhostObject_setRestitution_1 = function () {
                    return ($x = b._emscripten_bind_btPairCachingGhostObject_setRestitution_1 = b.asm.Kv).apply(null, arguments)
                }, ay = b._emscripten_bind_btPairCachingGhostObject_setFriction_1 = function () {
                    return (ay = b._emscripten_bind_btPairCachingGhostObject_setFriction_1 =
                        b.asm.Lv).apply(null, arguments)
                }, by = b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1 = function () {
                    return (by = b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1 = b.asm.Mv).apply(null, arguments)
                }, cy = b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0 = function () {
                    return (cy = b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0 = b.asm.Nv).apply(null, arguments)
                }, dy = b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0 = function () {
                    return (dy = b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0 =
                        b.asm.Ov).apply(null, arguments)
                }, ey = b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1 = function () {
                    return (ey = b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1 = b.asm.Pv).apply(null, arguments)
                }, fy = b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1 = function () {
                    return (fy = b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1 = b.asm.Qv).apply(null, arguments)
                }, gy = b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1 = function () {
                    return (gy = b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1 =
                        b.asm.Rv).apply(null, arguments)
                }, hy = b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1 = function () {
                    return (hy = b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1 = b.asm.Sv).apply(null, arguments)
                }, iy = b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1 = function () {
                    return (iy = b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1 = b.asm.Tv).apply(null, arguments)
                }, jy = b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0 = function () {
                    return (jy =
                        b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0 = b.asm.Uv).apply(null, arguments)
                }, ky = b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1 = function () {
                    return (ky = b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1 = b.asm.Vv).apply(null, arguments)
                }, ly = b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0 = function () {
                    return (ly = b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0 = b.asm.Wv).apply(null, arguments)
                }, my = b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1 =
                    function () {
                        return (my = b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1 = b.asm.Xv).apply(null, arguments)
                    }, ny = b._emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0 = function () {
                    return (ny = b._emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0 = b.asm.Yv).apply(null, arguments)
                }, oy = b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0 = function () {
                    return (oy = b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0 = b.asm.Zv).apply(null, arguments)
                },
                py = b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1 = function () {
                    return (py = b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1 = b.asm._v).apply(null, arguments)
                }, qy = b._emscripten_bind_btPairCachingGhostObject___destroy___0 = function () {
                    return (qy = b._emscripten_bind_btPairCachingGhostObject___destroy___0 = b.asm.$v).apply(null, arguments)
                }, ry = b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 = function () {
                    return (ry = b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 =
                        b.asm.aw).apply(null, arguments)
                }, sy = b._emscripten_bind_btGhostPairCallback___destroy___0 = function () {
                    return (sy = b._emscripten_bind_btGhostPairCallback___destroy___0 = b.asm.bw).apply(null, arguments)
                }, ty = b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0 = function () {
                    return (ty = b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0 = b.asm.cw).apply(null, arguments)
                }, uy = b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0 = function () {
                    return (uy = b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0 =
                        b.asm.dw).apply(null, arguments)
                }, vy = b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1 = function () {
                    return (vy = b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1 = b.asm.ew).apply(null, arguments)
                }, wy = b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0 = function () {
                    return (wy = b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0 = b.asm.fw).apply(null, arguments)
                }, xy = b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1 = function () {
                    return (xy = b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1 =
                        b.asm.gw).apply(null, arguments)
                }, yy = b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0 = function () {
                    return (yy = b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0 = b.asm.hw).apply(null, arguments)
                }, zy = b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1 = function () {
                    return (zy = b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1 = b.asm.iw).apply(null, arguments)
                }, Ay = b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0 = function () {
                    return (Ay = b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0 =
                        b.asm.jw).apply(null, arguments)
                }, By = b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1 = function () {
                    return (By = b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1 = b.asm.kw).apply(null, arguments)
                }, Cy = b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0 = function () {
                    return (Cy = b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0 = b.asm.lw).apply(null, arguments)
                }, Dy = b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1 = function () {
                    return (Dy = b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1 =
                        b.asm.mw).apply(null, arguments)
                }, Ey = b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0 = function () {
                    return (Ey = b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0 = b.asm.nw).apply(null, arguments)
                }, Fy = b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1 = function () {
                    return (Fy = b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1 = b.asm.ow).apply(null, arguments)
                }, Gy = b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0 = function () {
                    return (Gy = b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0 =
                        b.asm.pw).apply(null, arguments)
                }, Hy = b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1 = function () {
                    return (Hy = b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1 = b.asm.qw).apply(null, arguments)
                }, Iy = b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0 = function () {
                    return (Iy = b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0 = b.asm.rw).apply(null, arguments)
                }, Jy = b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1 = function () {
                    return (Jy = b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1 =
                        b.asm.sw).apply(null, arguments)
                }, Ky = b._emscripten_bind_btSoftBodyWorldInfo___destroy___0 = function () {
                    return (Ky = b._emscripten_bind_btSoftBodyWorldInfo___destroy___0 = b.asm.tw).apply(null, arguments)
                }, Ly = b._emscripten_bind_Face_get_m_n_1 = function () {
                    return (Ly = b._emscripten_bind_Face_get_m_n_1 = b.asm.uw).apply(null, arguments)
                }, My = b._emscripten_bind_Face_set_m_n_2 = function () {
                    return (My = b._emscripten_bind_Face_set_m_n_2 = b.asm.vw).apply(null, arguments)
                }, Ny = b._emscripten_bind_Face_get_m_normal_0 = function () {
                    return (Ny =
                        b._emscripten_bind_Face_get_m_normal_0 = b.asm.ww).apply(null, arguments)
                }, Oy = b._emscripten_bind_Face_set_m_normal_1 = function () {
                    return (Oy = b._emscripten_bind_Face_set_m_normal_1 = b.asm.xw).apply(null, arguments)
                }, Py = b._emscripten_bind_Face_get_m_ra_0 = function () {
                    return (Py = b._emscripten_bind_Face_get_m_ra_0 = b.asm.yw).apply(null, arguments)
                }, Qy = b._emscripten_bind_Face_set_m_ra_1 = function () {
                    return (Qy = b._emscripten_bind_Face_set_m_ra_1 = b.asm.zw).apply(null, arguments)
                }, Ry = b._emscripten_bind_Face___destroy___0 =
                    function () {
                        return (Ry = b._emscripten_bind_Face___destroy___0 = b.asm.Aw).apply(null, arguments)
                    }, Sy = b._emscripten_bind_tFaceArray_size_0 = function () {
                    return (Sy = b._emscripten_bind_tFaceArray_size_0 = b.asm.Bw).apply(null, arguments)
                }, Ty = b._emscripten_bind_tFaceArray_at_1 = function () {
                    return (Ty = b._emscripten_bind_tFaceArray_at_1 = b.asm.Cw).apply(null, arguments)
                }, Uy = b._emscripten_bind_tFaceArray___destroy___0 = function () {
                    return (Uy = b._emscripten_bind_tFaceArray___destroy___0 = b.asm.Dw).apply(null, arguments)
                }, Vy = b._emscripten_bind_Node_get_m_x_0 =
                    function () {
                        return (Vy = b._emscripten_bind_Node_get_m_x_0 = b.asm.Ew).apply(null, arguments)
                    }, Wy = b._emscripten_bind_Node_set_m_x_1 = function () {
                    return (Wy = b._emscripten_bind_Node_set_m_x_1 = b.asm.Fw).apply(null, arguments)
                }, Xy = b._emscripten_bind_Node_get_m_q_0 = function () {
                    return (Xy = b._emscripten_bind_Node_get_m_q_0 = b.asm.Gw).apply(null, arguments)
                }, Yy = b._emscripten_bind_Node_set_m_q_1 = function () {
                    return (Yy = b._emscripten_bind_Node_set_m_q_1 = b.asm.Hw).apply(null, arguments)
                }, Zy = b._emscripten_bind_Node_get_m_v_0 = function () {
                    return (Zy =
                        b._emscripten_bind_Node_get_m_v_0 = b.asm.Iw).apply(null, arguments)
                }, $y = b._emscripten_bind_Node_set_m_v_1 = function () {
                    return ($y = b._emscripten_bind_Node_set_m_v_1 = b.asm.Jw).apply(null, arguments)
                }, az = b._emscripten_bind_Node_get_m_f_0 = function () {
                    return (az = b._emscripten_bind_Node_get_m_f_0 = b.asm.Kw).apply(null, arguments)
                }, bz = b._emscripten_bind_Node_set_m_f_1 = function () {
                    return (bz = b._emscripten_bind_Node_set_m_f_1 = b.asm.Lw).apply(null, arguments)
                }, cz = b._emscripten_bind_Node_get_m_n_0 = function () {
                    return (cz = b._emscripten_bind_Node_get_m_n_0 =
                        b.asm.Mw).apply(null, arguments)
                }, dz = b._emscripten_bind_Node_set_m_n_1 = function () {
                    return (dz = b._emscripten_bind_Node_set_m_n_1 = b.asm.Nw).apply(null, arguments)
                }, ez = b._emscripten_bind_Node_get_m_im_0 = function () {
                    return (ez = b._emscripten_bind_Node_get_m_im_0 = b.asm.Ow).apply(null, arguments)
                }, fz = b._emscripten_bind_Node_set_m_im_1 = function () {
                    return (fz = b._emscripten_bind_Node_set_m_im_1 = b.asm.Pw).apply(null, arguments)
                }, gz = b._emscripten_bind_Node_get_m_area_0 = function () {
                    return (gz = b._emscripten_bind_Node_get_m_area_0 =
                        b.asm.Qw).apply(null, arguments)
                }, hz = b._emscripten_bind_Node_set_m_area_1 = function () {
                    return (hz = b._emscripten_bind_Node_set_m_area_1 = b.asm.Rw).apply(null, arguments)
                }, iz = b._emscripten_bind_Node___destroy___0 = function () {
                    return (iz = b._emscripten_bind_Node___destroy___0 = b.asm.Sw).apply(null, arguments)
                }, jz = b._emscripten_bind_tNodeArray_size_0 = function () {
                    return (jz = b._emscripten_bind_tNodeArray_size_0 = b.asm.Tw).apply(null, arguments)
                }, kz = b._emscripten_bind_tNodeArray_at_1 = function () {
                    return (kz = b._emscripten_bind_tNodeArray_at_1 =
                        b.asm.Uw).apply(null, arguments)
                }, lz = b._emscripten_bind_tNodeArray___destroy___0 = function () {
                    return (lz = b._emscripten_bind_tNodeArray___destroy___0 = b.asm.Vw).apply(null, arguments)
                }, mz = b._emscripten_bind_Material_get_m_kLST_0 = function () {
                    return (mz = b._emscripten_bind_Material_get_m_kLST_0 = b.asm.Ww).apply(null, arguments)
                }, nz = b._emscripten_bind_Material_set_m_kLST_1 = function () {
                    return (nz = b._emscripten_bind_Material_set_m_kLST_1 = b.asm.Xw).apply(null, arguments)
                }, oz = b._emscripten_bind_Material_get_m_kAST_0 = function () {
                    return (oz =
                        b._emscripten_bind_Material_get_m_kAST_0 = b.asm.Yw).apply(null, arguments)
                }, pz = b._emscripten_bind_Material_set_m_kAST_1 = function () {
                    return (pz = b._emscripten_bind_Material_set_m_kAST_1 = b.asm.Zw).apply(null, arguments)
                }, qz = b._emscripten_bind_Material_get_m_kVST_0 = function () {
                    return (qz = b._emscripten_bind_Material_get_m_kVST_0 = b.asm._w).apply(null, arguments)
                }, rz = b._emscripten_bind_Material_set_m_kVST_1 = function () {
                    return (rz = b._emscripten_bind_Material_set_m_kVST_1 = b.asm.$w).apply(null, arguments)
                }, sz = b._emscripten_bind_Material_get_m_flags_0 =
                    function () {
                        return (sz = b._emscripten_bind_Material_get_m_flags_0 = b.asm.ax).apply(null, arguments)
                    }, tz = b._emscripten_bind_Material_set_m_flags_1 = function () {
                    return (tz = b._emscripten_bind_Material_set_m_flags_1 = b.asm.bx).apply(null, arguments)
                }, uz = b._emscripten_bind_Material___destroy___0 = function () {
                    return (uz = b._emscripten_bind_Material___destroy___0 = b.asm.cx).apply(null, arguments)
                }, vz = b._emscripten_bind_tMaterialArray_size_0 = function () {
                    return (vz = b._emscripten_bind_tMaterialArray_size_0 = b.asm.dx).apply(null,
                        arguments)
                }, wz = b._emscripten_bind_tMaterialArray_at_1 = function () {
                    return (wz = b._emscripten_bind_tMaterialArray_at_1 = b.asm.ex).apply(null, arguments)
                }, xz = b._emscripten_bind_tMaterialArray___destroy___0 = function () {
                    return (xz = b._emscripten_bind_tMaterialArray___destroy___0 = b.asm.fx).apply(null, arguments)
                }, yz = b._emscripten_bind_Anchor_get_m_node_0 = function () {
                    return (yz = b._emscripten_bind_Anchor_get_m_node_0 = b.asm.gx).apply(null, arguments)
                }, zz = b._emscripten_bind_Anchor_set_m_node_1 = function () {
                    return (zz = b._emscripten_bind_Anchor_set_m_node_1 =
                        b.asm.hx).apply(null, arguments)
                }, Az = b._emscripten_bind_Anchor_get_m_local_0 = function () {
                    return (Az = b._emscripten_bind_Anchor_get_m_local_0 = b.asm.ix).apply(null, arguments)
                }, Bz = b._emscripten_bind_Anchor_set_m_local_1 = function () {
                    return (Bz = b._emscripten_bind_Anchor_set_m_local_1 = b.asm.jx).apply(null, arguments)
                }, Cz = b._emscripten_bind_Anchor_get_m_body_0 = function () {
                    return (Cz = b._emscripten_bind_Anchor_get_m_body_0 = b.asm.kx).apply(null, arguments)
                }, Dz = b._emscripten_bind_Anchor_set_m_body_1 = function () {
                    return (Dz =
                        b._emscripten_bind_Anchor_set_m_body_1 = b.asm.lx).apply(null, arguments)
                }, Ez = b._emscripten_bind_Anchor_get_m_influence_0 = function () {
                    return (Ez = b._emscripten_bind_Anchor_get_m_influence_0 = b.asm.mx).apply(null, arguments)
                }, Fz = b._emscripten_bind_Anchor_set_m_influence_1 = function () {
                    return (Fz = b._emscripten_bind_Anchor_set_m_influence_1 = b.asm.nx).apply(null, arguments)
                }, Gz = b._emscripten_bind_Anchor_get_m_c0_0 = function () {
                    return (Gz = b._emscripten_bind_Anchor_get_m_c0_0 = b.asm.ox).apply(null, arguments)
                }, Hz = b._emscripten_bind_Anchor_set_m_c0_1 =
                    function () {
                        return (Hz = b._emscripten_bind_Anchor_set_m_c0_1 = b.asm.px).apply(null, arguments)
                    }, Iz = b._emscripten_bind_Anchor_get_m_c1_0 = function () {
                    return (Iz = b._emscripten_bind_Anchor_get_m_c1_0 = b.asm.qx).apply(null, arguments)
                }, Jz = b._emscripten_bind_Anchor_set_m_c1_1 = function () {
                    return (Jz = b._emscripten_bind_Anchor_set_m_c1_1 = b.asm.rx).apply(null, arguments)
                }, Kz = b._emscripten_bind_Anchor_get_m_c2_0 = function () {
                    return (Kz = b._emscripten_bind_Anchor_get_m_c2_0 = b.asm.sx).apply(null, arguments)
                }, Lz = b._emscripten_bind_Anchor_set_m_c2_1 =
                    function () {
                        return (Lz = b._emscripten_bind_Anchor_set_m_c2_1 = b.asm.tx).apply(null, arguments)
                    }, Mz = b._emscripten_bind_Anchor___destroy___0 = function () {
                    return (Mz = b._emscripten_bind_Anchor___destroy___0 = b.asm.ux).apply(null, arguments)
                }, Nz = b._emscripten_bind_tAnchorArray_size_0 = function () {
                    return (Nz = b._emscripten_bind_tAnchorArray_size_0 = b.asm.vx).apply(null, arguments)
                }, Oz = b._emscripten_bind_tAnchorArray_at_1 = function () {
                    return (Oz = b._emscripten_bind_tAnchorArray_at_1 = b.asm.wx).apply(null, arguments)
                }, Pz = b._emscripten_bind_tAnchorArray_clear_0 =
                    function () {
                        return (Pz = b._emscripten_bind_tAnchorArray_clear_0 = b.asm.xx).apply(null, arguments)
                    }, Qz = b._emscripten_bind_tAnchorArray_push_back_1 = function () {
                    return (Qz = b._emscripten_bind_tAnchorArray_push_back_1 = b.asm.yx).apply(null, arguments)
                }, Rz = b._emscripten_bind_tAnchorArray_pop_back_0 = function () {
                    return (Rz = b._emscripten_bind_tAnchorArray_pop_back_0 = b.asm.zx).apply(null, arguments)
                }, Sz = b._emscripten_bind_tAnchorArray___destroy___0 = function () {
                    return (Sz = b._emscripten_bind_tAnchorArray___destroy___0 = b.asm.Ax).apply(null,
                        arguments)
                }, Tz = b._emscripten_bind_Config_get_kVCF_0 = function () {
                    return (Tz = b._emscripten_bind_Config_get_kVCF_0 = b.asm.Bx).apply(null, arguments)
                }, Uz = b._emscripten_bind_Config_set_kVCF_1 = function () {
                    return (Uz = b._emscripten_bind_Config_set_kVCF_1 = b.asm.Cx).apply(null, arguments)
                }, Vz = b._emscripten_bind_Config_get_kDP_0 = function () {
                    return (Vz = b._emscripten_bind_Config_get_kDP_0 = b.asm.Dx).apply(null, arguments)
                }, Wz = b._emscripten_bind_Config_set_kDP_1 = function () {
                    return (Wz = b._emscripten_bind_Config_set_kDP_1 = b.asm.Ex).apply(null,
                        arguments)
                }, Xz = b._emscripten_bind_Config_get_kDG_0 = function () {
                    return (Xz = b._emscripten_bind_Config_get_kDG_0 = b.asm.Fx).apply(null, arguments)
                }, Yz = b._emscripten_bind_Config_set_kDG_1 = function () {
                    return (Yz = b._emscripten_bind_Config_set_kDG_1 = b.asm.Gx).apply(null, arguments)
                }, Zz = b._emscripten_bind_Config_get_kLF_0 = function () {
                    return (Zz = b._emscripten_bind_Config_get_kLF_0 = b.asm.Hx).apply(null, arguments)
                }, $z = b._emscripten_bind_Config_set_kLF_1 = function () {
                    return ($z = b._emscripten_bind_Config_set_kLF_1 = b.asm.Ix).apply(null,
                        arguments)
                }, aA = b._emscripten_bind_Config_get_kPR_0 = function () {
                    return (aA = b._emscripten_bind_Config_get_kPR_0 = b.asm.Jx).apply(null, arguments)
                }, bA = b._emscripten_bind_Config_set_kPR_1 = function () {
                    return (bA = b._emscripten_bind_Config_set_kPR_1 = b.asm.Kx).apply(null, arguments)
                }, cA = b._emscripten_bind_Config_get_kVC_0 = function () {
                    return (cA = b._emscripten_bind_Config_get_kVC_0 = b.asm.Lx).apply(null, arguments)
                }, dA = b._emscripten_bind_Config_set_kVC_1 = function () {
                    return (dA = b._emscripten_bind_Config_set_kVC_1 = b.asm.Mx).apply(null,
                        arguments)
                }, eA = b._emscripten_bind_Config_get_kDF_0 = function () {
                    return (eA = b._emscripten_bind_Config_get_kDF_0 = b.asm.Nx).apply(null, arguments)
                }, fA = b._emscripten_bind_Config_set_kDF_1 = function () {
                    return (fA = b._emscripten_bind_Config_set_kDF_1 = b.asm.Ox).apply(null, arguments)
                }, gA = b._emscripten_bind_Config_get_kMT_0 = function () {
                    return (gA = b._emscripten_bind_Config_get_kMT_0 = b.asm.Px).apply(null, arguments)
                }, hA = b._emscripten_bind_Config_set_kMT_1 = function () {
                    return (hA = b._emscripten_bind_Config_set_kMT_1 = b.asm.Qx).apply(null,
                        arguments)
                }, iA = b._emscripten_bind_Config_get_kCHR_0 = function () {
                    return (iA = b._emscripten_bind_Config_get_kCHR_0 = b.asm.Rx).apply(null, arguments)
                }, jA = b._emscripten_bind_Config_set_kCHR_1 = function () {
                    return (jA = b._emscripten_bind_Config_set_kCHR_1 = b.asm.Sx).apply(null, arguments)
                }, kA = b._emscripten_bind_Config_get_kKHR_0 = function () {
                    return (kA = b._emscripten_bind_Config_get_kKHR_0 = b.asm.Tx).apply(null, arguments)
                }, lA = b._emscripten_bind_Config_set_kKHR_1 = function () {
                    return (lA = b._emscripten_bind_Config_set_kKHR_1 =
                        b.asm.Ux).apply(null, arguments)
                }, mA = b._emscripten_bind_Config_get_kSHR_0 = function () {
                    return (mA = b._emscripten_bind_Config_get_kSHR_0 = b.asm.Vx).apply(null, arguments)
                }, nA = b._emscripten_bind_Config_set_kSHR_1 = function () {
                    return (nA = b._emscripten_bind_Config_set_kSHR_1 = b.asm.Wx).apply(null, arguments)
                }, oA = b._emscripten_bind_Config_get_kAHR_0 = function () {
                    return (oA = b._emscripten_bind_Config_get_kAHR_0 = b.asm.Xx).apply(null, arguments)
                }, pA = b._emscripten_bind_Config_set_kAHR_1 = function () {
                    return (pA = b._emscripten_bind_Config_set_kAHR_1 =
                        b.asm.Yx).apply(null, arguments)
                }, qA = b._emscripten_bind_Config_get_kSRHR_CL_0 = function () {
                    return (qA = b._emscripten_bind_Config_get_kSRHR_CL_0 = b.asm.Zx).apply(null, arguments)
                }, rA = b._emscripten_bind_Config_set_kSRHR_CL_1 = function () {
                    return (rA = b._emscripten_bind_Config_set_kSRHR_CL_1 = b.asm._x).apply(null, arguments)
                }, sA = b._emscripten_bind_Config_get_kSKHR_CL_0 = function () {
                    return (sA = b._emscripten_bind_Config_get_kSKHR_CL_0 = b.asm.$x).apply(null, arguments)
                }, tA = b._emscripten_bind_Config_set_kSKHR_CL_1 = function () {
                    return (tA =
                        b._emscripten_bind_Config_set_kSKHR_CL_1 = b.asm.ay).apply(null, arguments)
                }, uA = b._emscripten_bind_Config_get_kSSHR_CL_0 = function () {
                    return (uA = b._emscripten_bind_Config_get_kSSHR_CL_0 = b.asm.by).apply(null, arguments)
                }, vA = b._emscripten_bind_Config_set_kSSHR_CL_1 = function () {
                    return (vA = b._emscripten_bind_Config_set_kSSHR_CL_1 = b.asm.cy).apply(null, arguments)
                }, wA = b._emscripten_bind_Config_get_kSR_SPLT_CL_0 = function () {
                    return (wA = b._emscripten_bind_Config_get_kSR_SPLT_CL_0 = b.asm.dy).apply(null, arguments)
                }, xA = b._emscripten_bind_Config_set_kSR_SPLT_CL_1 =
                    function () {
                        return (xA = b._emscripten_bind_Config_set_kSR_SPLT_CL_1 = b.asm.ey).apply(null, arguments)
                    }, yA = b._emscripten_bind_Config_get_kSK_SPLT_CL_0 = function () {
                    return (yA = b._emscripten_bind_Config_get_kSK_SPLT_CL_0 = b.asm.fy).apply(null, arguments)
                }, zA = b._emscripten_bind_Config_set_kSK_SPLT_CL_1 = function () {
                    return (zA = b._emscripten_bind_Config_set_kSK_SPLT_CL_1 = b.asm.gy).apply(null, arguments)
                }, AA = b._emscripten_bind_Config_get_kSS_SPLT_CL_0 = function () {
                    return (AA = b._emscripten_bind_Config_get_kSS_SPLT_CL_0 = b.asm.hy).apply(null,
                        arguments)
                }, BA = b._emscripten_bind_Config_set_kSS_SPLT_CL_1 = function () {
                    return (BA = b._emscripten_bind_Config_set_kSS_SPLT_CL_1 = b.asm.iy).apply(null, arguments)
                }, CA = b._emscripten_bind_Config_get_maxvolume_0 = function () {
                    return (CA = b._emscripten_bind_Config_get_maxvolume_0 = b.asm.jy).apply(null, arguments)
                }, DA = b._emscripten_bind_Config_set_maxvolume_1 = function () {
                    return (DA = b._emscripten_bind_Config_set_maxvolume_1 = b.asm.ky).apply(null, arguments)
                }, EA = b._emscripten_bind_Config_get_timescale_0 = function () {
                    return (EA =
                        b._emscripten_bind_Config_get_timescale_0 = b.asm.ly).apply(null, arguments)
                }, FA = b._emscripten_bind_Config_set_timescale_1 = function () {
                    return (FA = b._emscripten_bind_Config_set_timescale_1 = b.asm.my).apply(null, arguments)
                }, GA = b._emscripten_bind_Config_get_viterations_0 = function () {
                    return (GA = b._emscripten_bind_Config_get_viterations_0 = b.asm.ny).apply(null, arguments)
                }, HA = b._emscripten_bind_Config_set_viterations_1 = function () {
                    return (HA = b._emscripten_bind_Config_set_viterations_1 = b.asm.oy).apply(null, arguments)
                },
                IA = b._emscripten_bind_Config_get_piterations_0 = function () {
                    return (IA = b._emscripten_bind_Config_get_piterations_0 = b.asm.py).apply(null, arguments)
                }, JA = b._emscripten_bind_Config_set_piterations_1 = function () {
                    return (JA = b._emscripten_bind_Config_set_piterations_1 = b.asm.qy).apply(null, arguments)
                }, KA = b._emscripten_bind_Config_get_diterations_0 = function () {
                    return (KA = b._emscripten_bind_Config_get_diterations_0 = b.asm.ry).apply(null, arguments)
                }, LA = b._emscripten_bind_Config_set_diterations_1 = function () {
                    return (LA =
                        b._emscripten_bind_Config_set_diterations_1 = b.asm.sy).apply(null, arguments)
                }, MA = b._emscripten_bind_Config_get_citerations_0 = function () {
                    return (MA = b._emscripten_bind_Config_get_citerations_0 = b.asm.ty).apply(null, arguments)
                }, NA = b._emscripten_bind_Config_set_citerations_1 = function () {
                    return (NA = b._emscripten_bind_Config_set_citerations_1 = b.asm.uy).apply(null, arguments)
                }, OA = b._emscripten_bind_Config_get_collisions_0 = function () {
                    return (OA = b._emscripten_bind_Config_get_collisions_0 = b.asm.vy).apply(null, arguments)
                },
                PA = b._emscripten_bind_Config_set_collisions_1 = function () {
                    return (PA = b._emscripten_bind_Config_set_collisions_1 = b.asm.wy).apply(null, arguments)
                }, QA = b._emscripten_bind_Config___destroy___0 = function () {
                    return (QA = b._emscripten_bind_Config___destroy___0 = b.asm.xy).apply(null, arguments)
                }, RA = b._emscripten_bind_btSoftBody_btSoftBody_4 = function () {
                    return (RA = b._emscripten_bind_btSoftBody_btSoftBody_4 = b.asm.yy).apply(null, arguments)
                }, SA = b._emscripten_bind_btSoftBody_checkLink_2 = function () {
                    return (SA = b._emscripten_bind_btSoftBody_checkLink_2 =
                        b.asm.zy).apply(null, arguments)
                }, TA = b._emscripten_bind_btSoftBody_checkFace_3 = function () {
                    return (TA = b._emscripten_bind_btSoftBody_checkFace_3 = b.asm.Ay).apply(null, arguments)
                }, UA = b._emscripten_bind_btSoftBody_appendMaterial_0 = function () {
                    return (UA = b._emscripten_bind_btSoftBody_appendMaterial_0 = b.asm.By).apply(null, arguments)
                }, VA = b._emscripten_bind_btSoftBody_appendNode_2 = function () {
                    return (VA = b._emscripten_bind_btSoftBody_appendNode_2 = b.asm.Cy).apply(null, arguments)
                }, WA = b._emscripten_bind_btSoftBody_appendLink_4 =
                    function () {
                        return (WA = b._emscripten_bind_btSoftBody_appendLink_4 = b.asm.Dy).apply(null, arguments)
                    }, XA = b._emscripten_bind_btSoftBody_appendFace_4 = function () {
                    return (XA = b._emscripten_bind_btSoftBody_appendFace_4 = b.asm.Ey).apply(null, arguments)
                }, YA = b._emscripten_bind_btSoftBody_appendTetra_5 = function () {
                    return (YA = b._emscripten_bind_btSoftBody_appendTetra_5 = b.asm.Fy).apply(null, arguments)
                }, ZA = b._emscripten_bind_btSoftBody_appendAnchor_4 = function () {
                    return (ZA = b._emscripten_bind_btSoftBody_appendAnchor_4 = b.asm.Gy).apply(null,
                        arguments)
                }, $A = b._emscripten_bind_btSoftBody_addForce_1 = function () {
                    return ($A = b._emscripten_bind_btSoftBody_addForce_1 = b.asm.Hy).apply(null, arguments)
                }, aB = b._emscripten_bind_btSoftBody_addForce_2 = function () {
                    return (aB = b._emscripten_bind_btSoftBody_addForce_2 = b.asm.Iy).apply(null, arguments)
                }, bB = b._emscripten_bind_btSoftBody_addAeroForceToNode_2 = function () {
                    return (bB = b._emscripten_bind_btSoftBody_addAeroForceToNode_2 = b.asm.Jy).apply(null, arguments)
                }, cB = b._emscripten_bind_btSoftBody_getTotalMass_0 = function () {
                    return (cB =
                        b._emscripten_bind_btSoftBody_getTotalMass_0 = b.asm.Ky).apply(null, arguments)
                }, dB = b._emscripten_bind_btSoftBody_setTotalMass_2 = function () {
                    return (dB = b._emscripten_bind_btSoftBody_setTotalMass_2 = b.asm.Ly).apply(null, arguments)
                }, eB = b._emscripten_bind_btSoftBody_setMass_2 = function () {
                    return (eB = b._emscripten_bind_btSoftBody_setMass_2 = b.asm.My).apply(null, arguments)
                }, fB = b._emscripten_bind_btSoftBody_transform_1 = function () {
                    return (fB = b._emscripten_bind_btSoftBody_transform_1 = b.asm.Ny).apply(null, arguments)
                },
                gB = b._emscripten_bind_btSoftBody_translate_1 = function () {
                    return (gB = b._emscripten_bind_btSoftBody_translate_1 = b.asm.Oy).apply(null, arguments)
                }, hB = b._emscripten_bind_btSoftBody_rotate_1 = function () {
                    return (hB = b._emscripten_bind_btSoftBody_rotate_1 = b.asm.Py).apply(null, arguments)
                }, iB = b._emscripten_bind_btSoftBody_scale_1 = function () {
                    return (iB = b._emscripten_bind_btSoftBody_scale_1 = b.asm.Qy).apply(null, arguments)
                }, jB = b._emscripten_bind_btSoftBody_generateClusters_1 = function () {
                    return (jB = b._emscripten_bind_btSoftBody_generateClusters_1 =
                        b.asm.Ry).apply(null, arguments)
                }, kB = b._emscripten_bind_btSoftBody_generateClusters_2 = function () {
                    return (kB = b._emscripten_bind_btSoftBody_generateClusters_2 = b.asm.Sy).apply(null, arguments)
                }, lB = b._emscripten_bind_btSoftBody_generateBendingConstraints_2 = function () {
                    return (lB = b._emscripten_bind_btSoftBody_generateBendingConstraints_2 = b.asm.Ty).apply(null, arguments)
                }, mB = b._emscripten_bind_btSoftBody_upcast_1 = function () {
                    return (mB = b._emscripten_bind_btSoftBody_upcast_1 = b.asm.Uy).apply(null, arguments)
                }, nB =
                    b._emscripten_bind_btSoftBody_getRestLengthScale_0 = function () {
                        return (nB = b._emscripten_bind_btSoftBody_getRestLengthScale_0 = b.asm.Vy).apply(null, arguments)
                    }, oB = b._emscripten_bind_btSoftBody_setRestLengthScale_1 = function () {
                    return (oB = b._emscripten_bind_btSoftBody_setRestLengthScale_1 = b.asm.Wy).apply(null, arguments)
                }, pB = b._emscripten_bind_btSoftBody_setAnisotropicFriction_2 = function () {
                    return (pB = b._emscripten_bind_btSoftBody_setAnisotropicFriction_2 = b.asm.Xy).apply(null, arguments)
                }, qB = b._emscripten_bind_btSoftBody_getCollisionShape_0 =
                    function () {
                        return (qB = b._emscripten_bind_btSoftBody_getCollisionShape_0 = b.asm.Yy).apply(null, arguments)
                    }, rB = b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1 = function () {
                    return (rB = b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1 = b.asm.Zy).apply(null, arguments)
                }, sB = b._emscripten_bind_btSoftBody_setActivationState_1 = function () {
                    return (sB = b._emscripten_bind_btSoftBody_setActivationState_1 = b.asm._y).apply(null, arguments)
                }, tB = b._emscripten_bind_btSoftBody_forceActivationState_1 = function () {
                    return (tB =
                        b._emscripten_bind_btSoftBody_forceActivationState_1 = b.asm.$y).apply(null, arguments)
                }, uB = b._emscripten_bind_btSoftBody_activate_0 = function () {
                    return (uB = b._emscripten_bind_btSoftBody_activate_0 = b.asm.az).apply(null, arguments)
                }, vB = b._emscripten_bind_btSoftBody_activate_1 = function () {
                    return (vB = b._emscripten_bind_btSoftBody_activate_1 = b.asm.bz).apply(null, arguments)
                }, wB = b._emscripten_bind_btSoftBody_isActive_0 = function () {
                    return (wB = b._emscripten_bind_btSoftBody_isActive_0 = b.asm.cz).apply(null, arguments)
                },
                xB = b._emscripten_bind_btSoftBody_isKinematicObject_0 = function () {
                    return (xB = b._emscripten_bind_btSoftBody_isKinematicObject_0 = b.asm.dz).apply(null, arguments)
                }, yB = b._emscripten_bind_btSoftBody_isStaticObject_0 = function () {
                    return (yB = b._emscripten_bind_btSoftBody_isStaticObject_0 = b.asm.ez).apply(null, arguments)
                }, zB = b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0 = function () {
                    return (zB = b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0 = b.asm.fz).apply(null, arguments)
                }, AB = b._emscripten_bind_btSoftBody_getRestitution_0 =
                    function () {
                        return (AB = b._emscripten_bind_btSoftBody_getRestitution_0 = b.asm.gz).apply(null, arguments)
                    }, BB = b._emscripten_bind_btSoftBody_getFriction_0 = function () {
                    return (BB = b._emscripten_bind_btSoftBody_getFriction_0 = b.asm.hz).apply(null, arguments)
                }, CB = b._emscripten_bind_btSoftBody_getRollingFriction_0 = function () {
                    return (CB = b._emscripten_bind_btSoftBody_getRollingFriction_0 = b.asm.iz).apply(null, arguments)
                }, DB = b._emscripten_bind_btSoftBody_setRestitution_1 = function () {
                    return (DB = b._emscripten_bind_btSoftBody_setRestitution_1 =
                        b.asm.jz).apply(null, arguments)
                }, EB = b._emscripten_bind_btSoftBody_setFriction_1 = function () {
                    return (EB = b._emscripten_bind_btSoftBody_setFriction_1 = b.asm.kz).apply(null, arguments)
                }, FB = b._emscripten_bind_btSoftBody_setRollingFriction_1 = function () {
                    return (FB = b._emscripten_bind_btSoftBody_setRollingFriction_1 = b.asm.lz).apply(null, arguments)
                }, GB = b._emscripten_bind_btSoftBody_getWorldTransform_0 = function () {
                    return (GB = b._emscripten_bind_btSoftBody_getWorldTransform_0 = b.asm.mz).apply(null, arguments)
                }, HB = b._emscripten_bind_btSoftBody_getCollisionFlags_0 =
                    function () {
                        return (HB = b._emscripten_bind_btSoftBody_getCollisionFlags_0 = b.asm.nz).apply(null, arguments)
                    }, IB = b._emscripten_bind_btSoftBody_setCollisionFlags_1 = function () {
                    return (IB = b._emscripten_bind_btSoftBody_setCollisionFlags_1 = b.asm.oz).apply(null, arguments)
                }, JB = b._emscripten_bind_btSoftBody_setWorldTransform_1 = function () {
                    return (JB = b._emscripten_bind_btSoftBody_setWorldTransform_1 = b.asm.pz).apply(null, arguments)
                }, KB = b._emscripten_bind_btSoftBody_setCollisionShape_1 = function () {
                    return (KB = b._emscripten_bind_btSoftBody_setCollisionShape_1 =
                        b.asm.qz).apply(null, arguments)
                }, LB = b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1 = function () {
                    return (LB = b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1 = b.asm.rz).apply(null, arguments)
                }, MB = b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1 = function () {
                    return (MB = b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1 = b.asm.sz).apply(null, arguments)
                }, NB = b._emscripten_bind_btSoftBody_getUserIndex_0 = function () {
                    return (NB = b._emscripten_bind_btSoftBody_getUserIndex_0 = b.asm.tz).apply(null,
                        arguments)
                }, OB = b._emscripten_bind_btSoftBody_setUserIndex_1 = function () {
                    return (OB = b._emscripten_bind_btSoftBody_setUserIndex_1 = b.asm.uz).apply(null, arguments)
                }, PB = b._emscripten_bind_btSoftBody_getUserPointer_0 = function () {
                    return (PB = b._emscripten_bind_btSoftBody_getUserPointer_0 = b.asm.vz).apply(null, arguments)
                }, QB = b._emscripten_bind_btSoftBody_setUserPointer_1 = function () {
                    return (QB = b._emscripten_bind_btSoftBody_setUserPointer_1 = b.asm.wz).apply(null, arguments)
                }, RB = b._emscripten_bind_btSoftBody_getBroadphaseHandle_0 =
                    function () {
                        return (RB = b._emscripten_bind_btSoftBody_getBroadphaseHandle_0 = b.asm.xz).apply(null, arguments)
                    }, SB = b._emscripten_bind_btSoftBody_get_m_cfg_0 = function () {
                    return (SB = b._emscripten_bind_btSoftBody_get_m_cfg_0 = b.asm.yz).apply(null, arguments)
                }, TB = b._emscripten_bind_btSoftBody_set_m_cfg_1 = function () {
                    return (TB = b._emscripten_bind_btSoftBody_set_m_cfg_1 = b.asm.zz).apply(null, arguments)
                }, UB = b._emscripten_bind_btSoftBody_get_m_nodes_0 = function () {
                    return (UB = b._emscripten_bind_btSoftBody_get_m_nodes_0 = b.asm.Az).apply(null,
                        arguments)
                }, VB = b._emscripten_bind_btSoftBody_set_m_nodes_1 = function () {
                    return (VB = b._emscripten_bind_btSoftBody_set_m_nodes_1 = b.asm.Bz).apply(null, arguments)
                }, WB = b._emscripten_bind_btSoftBody_get_m_faces_0 = function () {
                    return (WB = b._emscripten_bind_btSoftBody_get_m_faces_0 = b.asm.Cz).apply(null, arguments)
                }, XB = b._emscripten_bind_btSoftBody_set_m_faces_1 = function () {
                    return (XB = b._emscripten_bind_btSoftBody_set_m_faces_1 = b.asm.Dz).apply(null, arguments)
                }, YB = b._emscripten_bind_btSoftBody_get_m_materials_0 = function () {
                    return (YB =
                        b._emscripten_bind_btSoftBody_get_m_materials_0 = b.asm.Ez).apply(null, arguments)
                }, ZB = b._emscripten_bind_btSoftBody_set_m_materials_1 = function () {
                    return (ZB = b._emscripten_bind_btSoftBody_set_m_materials_1 = b.asm.Fz).apply(null, arguments)
                }, $B = b._emscripten_bind_btSoftBody_get_m_anchors_0 = function () {
                    return ($B = b._emscripten_bind_btSoftBody_get_m_anchors_0 = b.asm.Gz).apply(null, arguments)
                }, aC = b._emscripten_bind_btSoftBody_set_m_anchors_1 = function () {
                    return (aC = b._emscripten_bind_btSoftBody_set_m_anchors_1 = b.asm.Hz).apply(null,
                        arguments)
                }, bC = b._emscripten_bind_btSoftBody___destroy___0 = function () {
                    return (bC = b._emscripten_bind_btSoftBody___destroy___0 = b.asm.Iz).apply(null, arguments)
                },
                cC = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0 = function () {
                    return (cC = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0 = b.asm.Jz).apply(null, arguments)
                },
                dC = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1 =
                    function () {
                        return (dC = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1 = b.asm.Kz).apply(null, arguments)
                    }, eC = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0 = function () {
                    return (eC = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0 = b.asm.Lz).apply(null, arguments)
                }, fC = b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0 = function () {
                    return (fC = b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0 =
                        b.asm.Mz).apply(null, arguments)
                }, gC = b._emscripten_bind_btDefaultSoftBodySolver___destroy___0 = function () {
                    return (gC = b._emscripten_bind_btDefaultSoftBodySolver___destroy___0 = b.asm.Nz).apply(null, arguments)
                }, hC = b._emscripten_bind_btSoftBodyArray_size_0 = function () {
                    return (hC = b._emscripten_bind_btSoftBodyArray_size_0 = b.asm.Oz).apply(null, arguments)
                }, iC = b._emscripten_bind_btSoftBodyArray_at_1 = function () {
                    return (iC = b._emscripten_bind_btSoftBodyArray_at_1 = b.asm.Pz).apply(null, arguments)
                }, jC = b._emscripten_bind_btSoftBodyArray___destroy___0 =
                    function () {
                        return (jC = b._emscripten_bind_btSoftBodyArray___destroy___0 = b.asm.Qz).apply(null, arguments)
                    }, kC = b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5 = function () {
                    return (kC = b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5 = b.asm.Rz).apply(null, arguments)
                }, lC = b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3 = function () {
                    return (lC = b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3 = b.asm.Sz).apply(null, arguments)
                }, mC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1 =
                    function () {
                        return (mC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1 = b.asm.Tz).apply(null, arguments)
                    }, nC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1 = function () {
                    return (nC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1 = b.asm.Uz).apply(null, arguments)
                }, oC = b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0 = function () {
                    return (oC = b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0 = b.asm.Vz).apply(null, arguments)
                }, pC = b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0 =
                    function () {
                        return (pC = b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0 = b.asm.Wz).apply(null, arguments)
                    }, qC = b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0 = function () {
                    return (qC = b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0 = b.asm.Xz).apply(null, arguments)
                }, rC = b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3 = function () {
                    return (rC = b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3 = b.asm.Yz).apply(null, arguments)
                }, sC = b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0 =
                    function () {
                        return (sC = b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0 = b.asm.Zz).apply(null, arguments)
                    }, tC = b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0 = function () {
                    return (tC = b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0 = b.asm._z).apply(null, arguments)
                }, uC = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1 = function () {
                    return (uC = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1 = b.asm.$z).apply(null, arguments)
                }, vC = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2 =
                    function () {
                        return (vC = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2 = b.asm.aA).apply(null, arguments)
                    }, wC = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3 = function () {
                    return (wC = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3 = b.asm.bA).apply(null, arguments)
                }, xC = b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0 = function () {
                    return (xC = b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0 = b.asm.cA).apply(null, arguments)
                }, yC = b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5 =
                    function () {
                        return (yC = b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5 = b.asm.dA).apply(null, arguments)
                    }, zC = b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3 = function () {
                    return (zC = b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3 = b.asm.eA).apply(null, arguments)
                }, AC = b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2 = function () {
                    return (AC = b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2 = b.asm.fA).apply(null, arguments)
                }, BC = b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1 =
                    function () {
                        return (BC = b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1 = b.asm.gA).apply(null, arguments)
                    }, CC = b._emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1 = function () {
                    return (CC = b._emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1 = b.asm.hA).apply(null, arguments)
                }, DC = b._emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0 = function () {
                    return (DC = b._emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0 = b.asm.iA).apply(null, arguments)
                }, EC = b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0 =
                    function () {
                        return (EC = b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0 = b.asm.jA).apply(null, arguments)
                    }, FC = b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3 = function () {
                    return (FC = b._emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3 = b.asm.kA).apply(null, arguments)
                }, GC = b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1 = function () {
                    return (GC = b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1 = b.asm.lA).apply(null, arguments)
                }, HC = b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0 =
                    function () {
                        return (HC = b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0 = b.asm.mA).apply(null, arguments)
                    }, IC = b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1 = function () {
                    return (IC = b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1 = b.asm.nA).apply(null, arguments)
                }, JC = b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3 = function () {
                    return (JC = b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3 = b.asm.oA).apply(null, arguments)
                }, KC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1 =
                    function () {
                        return (KC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1 = b.asm.pA).apply(null, arguments)
                    }, LC = b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1 = function () {
                    return (LC = b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1 = b.asm.qA).apply(null, arguments)
                }, MC = b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2 = function () {
                    return (MC = b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2 = b.asm.rA).apply(null, arguments)
                }, NC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1 =
                    function () {
                        return (NC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1 = b.asm.sA).apply(null, arguments)
                    }, OC = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1 = function () {
                    return (OC = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1 = b.asm.tA).apply(null, arguments)
                }, PC = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2 = function () {
                    return (PC = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2 = b.asm.uA).apply(null, arguments)
                }, QC = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3 =
                    function () {
                        return (QC = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3 = b.asm.vA).apply(null, arguments)
                    }, RC = b._emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1 = function () {
                    return (RC = b._emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1 = b.asm.wA).apply(null, arguments)
                }, SC = b._emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1 = function () {
                    return (SC = b._emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1 = b.asm.xA).apply(null,
                        arguments)
                }, TC = b._emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1 = function () {
                    return (TC = b._emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1 = b.asm.yA).apply(null, arguments)
                }, UC = b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1 = function () {
                    return (UC = b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1 = b.asm.zA).apply(null, arguments)
                }, VC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1 = function () {
                    return (VC = b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1 =
                        b.asm.AA).apply(null, arguments)
                }, WC = b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0 = function () {
                    return (WC = b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0 = b.asm.BA).apply(null, arguments)
                }, XC = b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1 = function () {
                    return (XC = b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1 = b.asm.CA).apply(null, arguments)
                }, YC = b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2 = function () {
                    return (YC =
                        b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2 = b.asm.DA).apply(null, arguments)
                }, ZC = b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3 = function () {
                    return (ZC = b._emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3 = b.asm.EA).apply(null, arguments)
                }, $C = b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0 = function () {
                    return ($C = b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0 = b.asm.FA).apply(null, arguments)
                }, aD = b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0 =
                    function () {
                        return (aD = b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0 = b.asm.GA).apply(null, arguments)
                    }, bD = b._emscripten_bind_btSoftBodyHelpers_CreateRope_5 = function () {
                    return (bD = b._emscripten_bind_btSoftBodyHelpers_CreateRope_5 = b.asm.HA).apply(null, arguments)
                }, cD = b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9 = function () {
                    return (cD = b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9 = b.asm.IA).apply(null, arguments)
                }, dD = b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10 = function () {
                    return (dD =
                        b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10 = b.asm.JA).apply(null, arguments)
                }, eD = b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4 = function () {
                    return (eD = b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4 = b.asm.KA).apply(null, arguments)
                }, fD = b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5 = function () {
                    return (fD = b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5 = b.asm.LA).apply(null, arguments)
                }, gD = b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4 = function () {
                    return (gD =
                        b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4 = b.asm.MA).apply(null, arguments)
                }, hD = b._emscripten_bind_btSoftBodyHelpers___destroy___0 = function () {
                    return (hD = b._emscripten_bind_btSoftBodyHelpers___destroy___0 = b.asm.NA).apply(null, arguments)
                }, iD = b._emscripten_enum_PHY_ScalarType_PHY_FLOAT = function () {
                    return (iD = b._emscripten_enum_PHY_ScalarType_PHY_FLOAT = b.asm.OA).apply(null, arguments)
                }, jD = b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE = function () {
                    return (jD = b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE =
                        b.asm.PA).apply(null, arguments)
                }, kD = b._emscripten_enum_PHY_ScalarType_PHY_INTEGER = function () {
                    return (kD = b._emscripten_enum_PHY_ScalarType_PHY_INTEGER = b.asm.QA).apply(null, arguments)
                }, lD = b._emscripten_enum_PHY_ScalarType_PHY_SHORT = function () {
                    return (lD = b._emscripten_enum_PHY_ScalarType_PHY_SHORT = b.asm.RA).apply(null, arguments)
                }, mD = b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 = function () {
                    return (mD = b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 = b.asm.SA).apply(null, arguments)
                }, nD = b._emscripten_enum_PHY_ScalarType_PHY_UCHAR =
                    function () {
                        return (nD = b._emscripten_enum_PHY_ScalarType_PHY_UCHAR = b.asm.TA).apply(null, arguments)
                    }, oD = b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE = function () {
                    return (oD = b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE = b.asm.UA).apply(null, arguments)
                }, pD = b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART = function () {
                    return (pD = b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART = b.asm.VA).apply(null, arguments)
                }, qD = b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE =
                    function () {
                        return (qD = b._emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE = b.asm.WA).apply(null, arguments)
                    }, rD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP = function () {
                    return (rD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP = b.asm.XA).apply(null, arguments)
                }, sD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP = function () {
                    return (sD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP = b.asm.YA).apply(null, arguments)
                }, tD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM =
                    function () {
                        return (tD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM = b.asm.ZA).apply(null, arguments)
                    }, uD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM = function () {
                    return (uD = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM = b.asm._A).apply(null, arguments)
                };
            b._malloc = function () {
                return (b._malloc = b.asm.aB).apply(null, arguments)
            };
            b.UTF8ToString = ua;
            b.addFunction = function (a, c) {
                if (!oa) {
                    oa = new WeakMap;
                    for (var d = Aa.length, e = 0; e < 0 + d; e++) {
                        var g = Ra(e);
                        g && oa.set(g, e)
                    }
                }
                if (oa.has(a)) return oa.get(a);
                if (na.length) d = na.pop(); else {
                    try {
                        Aa.grow(1)
                    } catch (T) {
                        if (!(T instanceof RangeError)) throw T;
                        throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                    }
                    d = Aa.length - 1
                }
                try {
                    e = d, Aa.set(e, a), Sa[e] = a
                } catch (T) {
                    if (!(T instanceof TypeError)) throw T;
                    if ("function" == typeof WebAssembly.Function) {
                        g = {i: "i32", j: "i64", f: "f32", d: "f64"};
                        var n = {
                            parameters: [], results: "v" == c[0] ?
                                [] : [g[c[0]]]
                        };
                        for (e = 1; e < c.length; ++e) n.parameters.push(g[c[e]]);
                        e = new WebAssembly.Function(n, a)
                    } else {
                        g = [1, 0, 1, 96];
                        n = c.slice(0, 1);
                        c = c.slice(1);
                        var D = {i: 127, j: 126, f: 125, d: 124};
                        g.push(c.length);
                        for (e = 0; e < c.length; ++e) g.push(D[c[e]]);
                        "v" == n ? g.push(0) : g = g.concat([1, D[n]]);
                        g[1] = g.length - 2;
                        c = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(g, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
                        c = new WebAssembly.Module(c);
                        e = (new WebAssembly.Instance(c, {e: {f: a}})).exports.f
                    }
                    c = d;
                    Aa.set(c, e);
                    Sa[c] = e
                }
                oa.set(a, d);
                return d
            };
            var vD;
            Ja = function wD() {
                vD || xD();
                vD || (Ja = wD)
            };

            function xD() {
                function a() {
                    if (!vD && (vD = !0, b.calledRun = !0, !sa)) {
                        Fa = !0;
                        Qa(Ca);
                        aa(b);
                        if (b.onRuntimeInitialized) b.onRuntimeInitialized();
                        if (b.postRun) for ("function" == typeof b.postRun && (b.postRun = [b.postRun]); b.postRun.length;) {
                            var c = b.postRun.shift();
                            Ea.unshift(c)
                        }
                        Qa(Ea)
                    }
                }

                if (!(0 < Ha)) {
                    if (b.preRun) for ("function" == typeof b.preRun && (b.preRun = [b.preRun]); b.preRun.length;) Ga();
                    Qa(Ba);
                    0 < Ha || (b.setStatus ? (b.setStatus("Running..."), setTimeout(function () {
                        setTimeout(function () {
                            b.setStatus("")
                        }, 1);
                        a()
                    }, 1)) : a())
                }
            }

            b.run = xD;
            if (b.preInit) for ("function" == typeof b.preInit && (b.preInit = [b.preInit]); 0 < b.preInit.length;) b.preInit.pop()();
            xD();

            function f() {
            }

            f.prototype = Object.create(f.prototype);
            f.prototype.constructor = f;
            f.prototype.cB = f;
            f.dB = {};
            b.WrapperObject = f;

            function h(a) {
                return (a || f).dB
            }

            b.getCache = h;

            function k(a, c) {
                var d = h(c), e = d[a];
                if (e) return e;
                e = Object.create((c || f).prototype);
                e.bB = a;
                return d[a] = e
            }

            b.wrapPointer = k;
            b.castObject = function (a, c) {
                return k(a.bB, c)
            };
            b.NULL = k(0);
            b.destroy = function (a) {
                if (!a.__destroy__) throw"Error: Cannot destroy object. (Did you create it yourself?)";
                a.__destroy__();
                delete h(a.cB)[a.bB]
            };
            b.compare = function (a, c) {
                return a.bB === c.bB
            };
            b.getPointer = function (a) {
                return a.bB
            };
            b.getClass = function (a) {
                return a.cB
            };
            var yD = 0, zD = 0, AD = 0, BD = [], CD = 0;

            function DD() {
                if (CD) {
                    for (var a = 0; a < BD.length; a++) b._free(BD[a]);
                    BD.length = 0;
                    b._free(yD);
                    yD = 0;
                    zD += CD;
                    CD = 0
                }
                yD || (zD += 128, (yD = b._malloc(zD)) || qa(void 0));
                AD = 0
            }

            function ED(a, c) {
                yD || qa(void 0);
                a = a.length * c.BYTES_PER_ELEMENT;
                a = a + 7 & -8;
                AD + a >= zD ? (0 < a || qa(void 0), CD += a, c = b._malloc(a), BD.push(c)) : (c = yD + AD, AD += a);
                return c
            }

            function FD(a, c, d) {
                d >>>= 0;
                switch (c.BYTES_PER_ELEMENT) {
                    case 2:
                        d >>>= 1;
                        break;
                    case 4:
                        d >>>= 2;
                        break;
                    case 8:
                        d >>>= 3
                }
                for (var e = 0; e < a.length; e++) c[d + e] = a[e]
            }

            function GD(a) {
                if ("string" === typeof a) {
                    for (var c = 0, d = 0; d < a.length; ++d) {
                        var e = a.charCodeAt(d);
                        55296 <= e && 57343 >= e && (e = 65536 + ((e & 1023) << 10) | a.charCodeAt(++d) & 1023);
                        127 >= e ? ++c : c = 2047 >= e ? c + 2 : 65535 >= e ? c + 3 : c + 4
                    }
                    c = Array(c + 1);
                    e = c.length;
                    d = 0;
                    if (0 < e) {
                        e = d + e - 1;
                        for (var g = 0; g < a.length; ++g) {
                            var n = a.charCodeAt(g);
                            if (55296 <= n && 57343 >= n) {
                                var D = a.charCodeAt(++g);
                                n = 65536 + ((n & 1023) << 10) | D & 1023
                            }
                            if (127 >= n) {
                                if (d >= e) break;
                                c[d++] = n
                            } else {
                                if (2047 >= n) {
                                    if (d + 1 >= e) break;
                                    c[d++] = 192 | n >> 6
                                } else {
                                    if (65535 >= n) {
                                        if (d + 2 >= e) break;
                                        c[d++] = 224 |
                                            n >> 12
                                    } else {
                                        if (d + 3 >= e) break;
                                        c[d++] = 240 | n >> 18;
                                        c[d++] = 128 | n >> 12 & 63
                                    }
                                    c[d++] = 128 | n >> 6 & 63
                                }
                                c[d++] = 128 | n & 63
                            }
                        }
                        c[d] = 0
                    }
                    a = ED(c, wa);
                    FD(c, wa, a);
                    return a
                }
                return a
            }

            function HD(a) {
                if ("object" === typeof a) {
                    var c = ED(a, ya);
                    FD(a, ya, c);
                    return c
                }
                return a
            }

            function l() {
                throw"cannot construct a btCollisionShape, no constructor in IDL";
            }

            l.prototype = Object.create(f.prototype);
            l.prototype.constructor = l;
            l.prototype.cB = l;
            l.dB = {};
            b.btCollisionShape = l;
            l.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wa(c, a)
            };
            l.prototype.getLocalScaling = function () {
                return k(Xa(this.bB), m)
            };
            l.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Ya(d, a, c)
            };
            l.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Za(c, a)
            };
            l.prototype.getMargin = function () {
                return $a(this.bB)
            };
            l.prototype.__destroy__ = function () {
                ab(this.bB)
            };

            function ID() {
                throw"cannot construct a btCollisionWorld, no constructor in IDL";
            }

            ID.prototype = Object.create(f.prototype);
            ID.prototype.constructor = ID;
            ID.prototype.cB = ID;
            ID.dB = {};
            b.btCollisionWorld = ID;
            ID.prototype.getDispatcher = function () {
                return k(bb(this.bB), JD)
            };
            ID.prototype.rayTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                cb(e, a, c, d)
            };
            ID.prototype.getPairCache = function () {
                return k(db(this.bB), KD)
            };
            ID.prototype.getDispatchInfo = function () {
                return k(eb(this.bB), p)
            };
            ID.prototype.addCollisionObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? fb(e, a) : void 0 === d ? gb(e, a, c) : hb(e, a, c, d)
            };
            ID.prototype.removeCollisionObject = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ib(c, a)
            };
            ID.prototype.getBroadphase = function () {
                return k(jb(this.bB), LD)
            };
            ID.prototype.convexSweepTest = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                kb(n, a, c, d, e, g)
            };
            ID.prototype.contactPairTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                lb(e, a, c, d)
            };
            ID.prototype.contactTest = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                mb(d, a, c)
            };
            ID.prototype.updateSingleAabb = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nb(c, a)
            };
            ID.prototype.setDebugDrawer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ob(c, a)
            };
            ID.prototype.getDebugDrawer = function () {
                return k(pb(this.bB), MD)
            };
            ID.prototype.debugDrawWorld = function () {
                qb(this.bB)
            };
            ID.prototype.debugDrawObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                rb(e, a, c, d)
            };
            ID.prototype.__destroy__ = function () {
                sb(this.bB)
            };

            function q() {
                throw"cannot construct a btCollisionObject, no constructor in IDL";
            }

            q.prototype = Object.create(f.prototype);
            q.prototype.constructor = q;
            q.prototype.cB = q;
            q.dB = {};
            b.btCollisionObject = q;
            q.prototype.setAnisotropicFriction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                tb(d, a, c)
            };
            q.prototype.getCollisionShape = function () {
                return k(ub(this.bB), l)
            };
            q.prototype.setContactProcessingThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vb(c, a)
            };
            q.prototype.setActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wb(c, a)
            };
            q.prototype.forceActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xb(c, a)
            };
            q.prototype.activate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                void 0 === a ? yb(c) : zb(c, a)
            };
            q.prototype.isActive = function () {
                return !!Ab(this.bB)
            };
            q.prototype.isKinematicObject = function () {
                return !!Bb(this.bB)
            };
            q.prototype.isStaticObject = function () {
                return !!Cb(this.bB)
            };
            q.prototype.isStaticOrKinematicObject = function () {
                return !!Db(this.bB)
            };
            q.prototype.getRestitution = function () {
                return Eb(this.bB)
            };
            q.prototype.getFriction = function () {
                return Fb(this.bB)
            };
            q.prototype.getRollingFriction = function () {
                return Gb(this.bB)
            };
            q.prototype.setRestitution = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hb(c, a)
            };
            q.prototype.setFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ib(c, a)
            };
            q.prototype.setRollingFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Jb(c, a)
            };
            q.prototype.getWorldTransform = function () {
                return k(Kb(this.bB), r)
            };
            q.prototype.getCollisionFlags = function () {
                return Lb(this.bB)
            };
            q.prototype.setCollisionFlags = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mb(c, a)
            };
            q.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Nb(c, a)
            };
            q.prototype.setCollisionShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ob(c, a)
            };
            q.prototype.setCcdMotionThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Pb(c, a)
            };
            q.prototype.setCcdSweptSphereRadius = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qb(c, a)
            };
            q.prototype.getUserIndex = function () {
                return Rb(this.bB)
            };
            q.prototype.setUserIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Sb(c, a)
            };
            q.prototype.getUserPointer = function () {
                return k(Tb(this.bB), ND)
            };
            q.prototype.setUserPointer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ub(c, a)
            };
            q.prototype.getBroadphaseHandle = function () {
                return k(Vb(this.bB), OD)
            };
            q.prototype.__destroy__ = function () {
                Wb(this.bB)
            };

            function PD() {
                throw"cannot construct a btConcaveShape, no constructor in IDL";
            }

            PD.prototype = Object.create(l.prototype);
            PD.prototype.constructor = PD;
            PD.prototype.cB = PD;
            PD.dB = {};
            b.btConcaveShape = PD;
            PD.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Xb(c, a)
            };
            PD.prototype.getLocalScaling = function () {
                return k(Yb(this.bB), m)
            };
            PD.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Zb(d, a, c)
            };
            PD.prototype.__destroy__ = function () {
                $b(this.bB)
            };

            function QD() {
                throw"cannot construct a btCollisionAlgorithm, no constructor in IDL";
            }

            QD.prototype = Object.create(f.prototype);
            QD.prototype.constructor = QD;
            QD.prototype.cB = QD;
            QD.dB = {};
            b.btCollisionAlgorithm = QD;
            QD.prototype.__destroy__ = function () {
                ac(this.bB)
            };

            function RD() {
                throw"cannot construct a btTypedConstraint, no constructor in IDL";
            }

            RD.prototype = Object.create(f.prototype);
            RD.prototype.constructor = RD;
            RD.prototype.cB = RD;
            RD.dB = {};
            b.btTypedConstraint = RD;
            RD.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bc(c, a)
            };
            RD.prototype.getBreakingImpulseThreshold = function () {
                return cc(this.bB)
            };
            RD.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ec(c, a)
            };
            RD.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return fc(d, a, c)
            };
            RD.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                gc(e, a, c, d)
            };
            RD.prototype.__destroy__ = function () {
                hc(this.bB)
            };

            function SD() {
                throw"cannot construct a btDynamicsWorld, no constructor in IDL";
            }

            SD.prototype = Object.create(ID.prototype);
            SD.prototype.constructor = SD;
            SD.prototype.cB = SD;
            SD.dB = {};
            b.btDynamicsWorld = SD;
            SD.prototype.addAction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ic(c, a)
            };
            SD.prototype.removeAction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jc(c, a)
            };
            SD.prototype.getSolverInfo = function () {
                return k(kc(this.bB), t)
            };
            SD.prototype.setInternalTickCallback = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? lc(e, a) : void 0 === d ? mc(e, a, c) : nc(e, a, c, d)
            };
            SD.prototype.getDispatcher = function () {
                return k(oc(this.bB), JD)
            };
            SD.prototype.rayTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                pc(e, a, c, d)
            };
            SD.prototype.getPairCache = function () {
                return k(qc(this.bB), KD)
            };
            SD.prototype.getDispatchInfo = function () {
                return k(rc(this.bB), p)
            };
            SD.prototype.addCollisionObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? sc(e, a) : void 0 === d ? tc(e, a, c) : uc(e, a, c, d)
            };
            SD.prototype.removeCollisionObject = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vc(c, a)
            };
            SD.prototype.getBroadphase = function () {
                return k(wc(this.bB), LD)
            };
            SD.prototype.convexSweepTest = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                xc(n, a, c, d, e, g)
            };
            SD.prototype.contactPairTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                yc(e, a, c, d)
            };
            SD.prototype.contactTest = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                zc(d, a, c)
            };
            SD.prototype.updateSingleAabb = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ac(c, a)
            };
            SD.prototype.setDebugDrawer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Bc(c, a)
            };
            SD.prototype.getDebugDrawer = function () {
                return k(Cc(this.bB), MD)
            };
            SD.prototype.debugDrawWorld = function () {
                Dc(this.bB)
            };
            SD.prototype.debugDrawObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Ec(e, a, c, d)
            };
            SD.prototype.__destroy__ = function () {
                Fc(this.bB)
            };

            function MD() {
                throw"cannot construct a btIDebugDraw, no constructor in IDL";
            }

            MD.prototype = Object.create(f.prototype);
            MD.prototype.constructor = MD;
            MD.prototype.cB = MD;
            MD.dB = {};
            b.btIDebugDraw = MD;
            MD.prototype.drawLine = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Gc(e, a, c, d)
            };
            MD.prototype.drawContactPoint = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                Hc(n, a, c, d, e, g)
            };
            MD.prototype.reportErrorWarning = function (a) {
                var c = this.bB;
                DD();
                a = a && "object" === typeof a ? a.bB : GD(a);
                Ic(c, a)
            };
            MD.prototype.draw3dText = function (a, c) {
                var d = this.bB;
                DD();
                a && "object" === typeof a && (a = a.bB);
                c = c && "object" === typeof c ? c.bB : GD(c);
                Jc(d, a, c)
            };
            MD.prototype.setDebugMode = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Kc(c, a)
            };
            MD.prototype.getDebugMode = function () {
                return Lc(this.bB)
            };
            MD.prototype.__destroy__ = function () {
                Mc(this.bB)
            };

            function m(a, c, d) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                this.bB = void 0 === a ? Nc() : void 0 === c ? _emscripten_bind_btVector3_btVector3_1(a) : void 0 === d ? _emscripten_bind_btVector3_btVector3_2(a, c) : Oc(a, c, d);
                h(m)[this.bB] = this
            }

            m.prototype = Object.create(f.prototype);
            m.prototype.constructor = m;
            m.prototype.cB = m;
            m.dB = {};
            b.btVector3 = m;
            m.prototype.length = m.prototype.length = function () {
                return Pc(this.bB)
            };
            m.prototype.x = m.prototype.x = function () {
                return Qc(this.bB)
            };
            m.prototype.y = m.prototype.y = function () {
                return Rc(this.bB)
            };
            m.prototype.z = m.prototype.z = function () {
                return Sc(this.bB)
            };
            m.prototype.setX = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Tc(c, a)
            };
            m.prototype.setY = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Uc(c, a)
            };
            m.prototype.setZ = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Vc(c, a)
            };
            m.prototype.setValue = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Wc(e, a, c, d)
            };
            m.prototype.normalize = m.prototype.normalize = function () {
                Xc(this.bB)
            };
            m.prototype.rotate = m.prototype.rotate = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return k(Yc(d, a, c), m)
            };
            m.prototype.dot = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return Zc(c, a)
            };
            m.prototype.op_mul = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k($c(c, a), m)
            };
            m.prototype.op_add = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(ad(c, a), m)
            };
            m.prototype.op_sub = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(bd(c, a), m)
            };
            m.prototype.__destroy__ = function () {
                cd(this.bB)
            };

            function TD() {
                throw"cannot construct a btQuadWord, no constructor in IDL";
            }

            TD.prototype = Object.create(f.prototype);
            TD.prototype.constructor = TD;
            TD.prototype.cB = TD;
            TD.dB = {};
            b.btQuadWord = TD;
            TD.prototype.x = TD.prototype.x = function () {
                return dd(this.bB)
            };
            TD.prototype.y = TD.prototype.y = function () {
                return ed(this.bB)
            };
            TD.prototype.z = TD.prototype.z = function () {
                return fd(this.bB)
            };
            TD.prototype.w = TD.prototype.w = function () {
                return gd(this.bB)
            };
            TD.prototype.setX = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hd(c, a)
            };
            TD.prototype.setY = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jd(c, a)
            };
            TD.prototype.setZ = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                kd(c, a)
            };
            TD.prototype.setW = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ld(c, a)
            };
            TD.prototype.__destroy__ = function () {
                md(this.bB)
            };

            function UD() {
                throw"cannot construct a btMotionState, no constructor in IDL";
            }

            UD.prototype = Object.create(f.prototype);
            UD.prototype.constructor = UD;
            UD.prototype.cB = UD;
            UD.dB = {};
            b.btMotionState = UD;
            UD.prototype.getWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nd(c, a)
            };
            UD.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                od(c, a)
            };
            UD.prototype.__destroy__ = function () {
                pd(this.bB)
            };

            function u() {
                throw"cannot construct a RayResultCallback, no constructor in IDL";
            }

            u.prototype = Object.create(f.prototype);
            u.prototype.constructor = u;
            u.prototype.cB = u;
            u.dB = {};
            b.RayResultCallback = u;
            u.prototype.hasHit = function () {
                return !!qd(this.bB)
            };
            u.prototype.get_m_collisionFilterGroup = u.prototype.eB = function () {
                return rd(this.bB)
            };
            u.prototype.set_m_collisionFilterGroup = u.prototype.gB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sd(c, a)
            };
            Object.defineProperty(u.prototype, "m_collisionFilterGroup", {get: u.prototype.eB, set: u.prototype.gB});
            u.prototype.get_m_collisionFilterMask = u.prototype.fB = function () {
                return td(this.bB)
            };
            u.prototype.set_m_collisionFilterMask = u.prototype.hB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ud(c, a)
            };
            Object.defineProperty(u.prototype, "m_collisionFilterMask", {get: u.prototype.fB, set: u.prototype.hB});
            u.prototype.get_m_closestHitFraction = u.prototype.iB = function () {
                return vd(this.bB)
            };
            u.prototype.set_m_closestHitFraction = u.prototype.jB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wd(c, a)
            };
            Object.defineProperty(u.prototype, "m_closestHitFraction", {get: u.prototype.iB, set: u.prototype.jB});
            u.prototype.get_m_collisionObject = u.prototype.mB = function () {
                return k(xd(this.bB), q)
            };
            u.prototype.set_m_collisionObject = u.prototype.tB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yd(c, a)
            };
            Object.defineProperty(u.prototype, "m_collisionObject", {get: u.prototype.mB, set: u.prototype.tB});
            u.prototype.get_m_flags = u.prototype.kB = function () {
                return zd(this.bB)
            };
            u.prototype.set_m_flags = u.prototype.lB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ad(c, a)
            };
            Object.defineProperty(u.prototype, "m_flags", {get: u.prototype.kB, set: u.prototype.lB});
            u.prototype.__destroy__ = function () {
                Bd(this.bB)
            };

            function VD() {
                throw"cannot construct a ContactResultCallback, no constructor in IDL";
            }

            VD.prototype = Object.create(f.prototype);
            VD.prototype.constructor = VD;
            VD.prototype.cB = VD;
            VD.dB = {};
            b.ContactResultCallback = VD;
            VD.prototype.addSingleResult = function (a, c, d, e, g, n, D) {
                var T = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                return Cd(T, a, c, d, e, g, n, D)
            };
            VD.prototype.__destroy__ = function () {
                Dd(this.bB)
            };

            function v() {
                throw"cannot construct a ConvexResultCallback, no constructor in IDL";
            }

            v.prototype = Object.create(f.prototype);
            v.prototype.constructor = v;
            v.prototype.cB = v;
            v.dB = {};
            b.ConvexResultCallback = v;
            v.prototype.hasHit = function () {
                return !!Ed(this.bB)
            };
            v.prototype.get_m_collisionFilterGroup = v.prototype.eB = function () {
                return Fd(this.bB)
            };
            v.prototype.set_m_collisionFilterGroup = v.prototype.gB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gd(c, a)
            };
            Object.defineProperty(v.prototype, "m_collisionFilterGroup", {get: v.prototype.eB, set: v.prototype.gB});
            v.prototype.get_m_collisionFilterMask = v.prototype.fB = function () {
                return Hd(this.bB)
            };
            v.prototype.set_m_collisionFilterMask = v.prototype.hB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Id(c, a)
            };
            Object.defineProperty(v.prototype, "m_collisionFilterMask", {get: v.prototype.fB, set: v.prototype.hB});
            v.prototype.get_m_closestHitFraction = v.prototype.iB = function () {
                return Jd(this.bB)
            };
            v.prototype.set_m_closestHitFraction = v.prototype.jB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Kd(c, a)
            };
            Object.defineProperty(v.prototype, "m_closestHitFraction", {get: v.prototype.iB, set: v.prototype.jB});
            v.prototype.__destroy__ = function () {
                Ld(this.bB)
            };

            function WD() {
                throw"cannot construct a btConvexShape, no constructor in IDL";
            }

            WD.prototype = Object.create(l.prototype);
            WD.prototype.constructor = WD;
            WD.prototype.cB = WD;
            WD.dB = {};
            b.btConvexShape = WD;
            WD.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Md(c, a)
            };
            WD.prototype.getLocalScaling = function () {
                return k(Nd(this.bB), m)
            };
            WD.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Od(d, a, c)
            };
            WD.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Pd(c, a)
            };
            WD.prototype.getMargin = function () {
                return Qd(this.bB)
            };
            WD.prototype.__destroy__ = function () {
                Rd(this.bB)
            };

            function XD(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Sd(a, c);
                h(XD)[this.bB] = this
            }

            XD.prototype = Object.create(l.prototype);
            XD.prototype.constructor = XD;
            XD.prototype.cB = XD;
            XD.dB = {};
            b.btCapsuleShape = XD;
            XD.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Td(c, a)
            };
            XD.prototype.getMargin = function () {
                return Ud(this.bB)
            };
            XD.prototype.getUpAxis = function () {
                return Vd(this.bB)
            };
            XD.prototype.getRadius = function () {
                return Wd(this.bB)
            };
            XD.prototype.getHalfHeight = function () {
                return Xd(this.bB)
            };
            XD.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yd(c, a)
            };
            XD.prototype.getLocalScaling = function () {
                return k(Zd(this.bB), m)
            };
            XD.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                $d(d, a, c)
            };
            XD.prototype.__destroy__ = function () {
                ae(this.bB)
            };

            function YD(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = be(a);
                h(YD)[this.bB] = this
            }

            YD.prototype = Object.create(l.prototype);
            YD.prototype.constructor = YD;
            YD.prototype.cB = YD;
            YD.dB = {};
            b.btCylinderShape = YD;
            YD.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ce(c, a)
            };
            YD.prototype.getMargin = function () {
                return de(this.bB)
            };
            YD.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ee(c, a)
            };
            YD.prototype.getLocalScaling = function () {
                return k(fe(this.bB), m)
            };
            YD.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                ge(d, a, c)
            };
            YD.prototype.__destroy__ = function () {
                he(this.bB)
            };

            function ZD(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = ie(a, c);
                h(ZD)[this.bB] = this
            }

            ZD.prototype = Object.create(l.prototype);
            ZD.prototype.constructor = ZD;
            ZD.prototype.cB = ZD;
            ZD.dB = {};
            b.btConeShape = ZD;
            ZD.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                je(c, a)
            };
            ZD.prototype.getLocalScaling = function () {
                return k(ke(this.bB), m)
            };
            ZD.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                le(d, a, c)
            };
            ZD.prototype.__destroy__ = function () {
                me(this.bB)
            };

            function $D() {
                throw"cannot construct a btStridingMeshInterface, no constructor in IDL";
            }

            $D.prototype = Object.create(f.prototype);
            $D.prototype.constructor = $D;
            $D.prototype.cB = $D;
            $D.dB = {};
            b.btStridingMeshInterface = $D;
            $D.prototype.setScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ne(c, a)
            };
            $D.prototype.__destroy__ = function () {
                oe(this.bB)
            };

            function aE() {
                throw"cannot construct a btTriangleMeshShape, no constructor in IDL";
            }

            aE.prototype = Object.create(PD.prototype);
            aE.prototype.constructor = aE;
            aE.prototype.cB = aE;
            aE.dB = {};
            b.btTriangleMeshShape = aE;
            aE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pe(c, a)
            };
            aE.prototype.getLocalScaling = function () {
                return k(qe(this.bB), m)
            };
            aE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                re(d, a, c)
            };
            aE.prototype.__destroy__ = function () {
                se(this.bB)
            };

            function bE() {
                throw"cannot construct a btPrimitiveManagerBase, no constructor in IDL";
            }

            bE.prototype = Object.create(f.prototype);
            bE.prototype.constructor = bE;
            bE.prototype.cB = bE;
            bE.dB = {};
            b.btPrimitiveManagerBase = bE;
            bE.prototype.is_trimesh = function () {
                return !!te(this.bB)
            };
            bE.prototype.get_primitive_count = function () {
                return ue(this.bB)
            };
            bE.prototype.get_primitive_box = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                ve(d, a, c)
            };
            bE.prototype.get_primitive_triangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                we(d, a, c)
            };
            bE.prototype.__destroy__ = function () {
                xe(this.bB)
            };

            function w() {
                throw"cannot construct a btGImpactShapeInterface, no constructor in IDL";
            }

            w.prototype = Object.create(PD.prototype);
            w.prototype.constructor = w;
            w.prototype.cB = w;
            w.dB = {};
            b.btGImpactShapeInterface = w;
            w.prototype.updateBound = function () {
                ye(this.bB)
            };
            w.prototype.postUpdate = function () {
                ze(this.bB)
            };
            w.prototype.getShapeType = function () {
                return Ae(this.bB)
            };
            w.prototype.getName = function () {
                return ua(Be(this.bB))
            };
            w.prototype.getGImpactShapeType = function () {
                return Ce(this.bB)
            };
            w.prototype.getPrimitiveManager = function () {
                return k(De(this.bB), bE)
            };
            w.prototype.getNumChildShapes = function () {
                return Ee(this.bB)
            };
            w.prototype.childrenHasTransform = function () {
                return !!Fe(this.bB)
            };
            w.prototype.needsRetrieveTriangles = function () {
                return !!Ge(this.bB)
            };
            w.prototype.needsRetrieveTetrahedrons = function () {
                return !!He(this.bB)
            };
            w.prototype.getBulletTriangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Ie(d, a, c)
            };
            w.prototype.getBulletTetrahedron = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Je(d, a, c)
            };
            w.prototype.getChildShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ke(c, a), l)
            };
            w.prototype.getChildTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Le(c, a), r)
            };
            w.prototype.setChildTransform = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Me(d, a, c)
            };
            w.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ne(c, a)
            };
            w.prototype.getLocalScaling = function () {
                return k(Oe(this.bB), m)
            };
            w.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Pe(d, a, c)
            };
            w.prototype.__destroy__ = function () {
                Qe(this.bB)
            };

            function cE() {
                throw"cannot construct a btActivatingCollisionAlgorithm, no constructor in IDL";
            }

            cE.prototype = Object.create(QD.prototype);
            cE.prototype.constructor = cE;
            cE.prototype.cB = cE;
            cE.dB = {};
            b.btActivatingCollisionAlgorithm = cE;
            cE.prototype.__destroy__ = function () {
                Re(this.bB)
            };

            function dE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = void 0 === a ? Se() : Te(a);
                h(dE)[this.bB] = this
            }

            dE.prototype = Object.create(f.prototype);
            dE.prototype.constructor = dE;
            dE.prototype.cB = dE;
            dE.dB = {};
            b.btDefaultCollisionConfiguration = dE;
            dE.prototype.__destroy__ = function () {
                Ue(this.bB)
            };

            function JD() {
                throw"cannot construct a btDispatcher, no constructor in IDL";
            }

            JD.prototype = Object.create(f.prototype);
            JD.prototype.constructor = JD;
            JD.prototype.cB = JD;
            JD.dB = {};
            b.btDispatcher = JD;
            JD.prototype.getNumManifolds = function () {
                return Ve(this.bB)
            };
            JD.prototype.getManifoldByIndexInternal = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(We(c, a), eE)
            };
            JD.prototype.__destroy__ = function () {
                Xe(this.bB)
            };

            function fE(a, c, d, e, g) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                this.bB = void 0 === e ? Ye(a, c, d) : void 0 === g ? _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_4(a, c, d, e) : Ze(a, c, d, e, g);
                h(fE)[this.bB] = this
            }

            fE.prototype = Object.create(RD.prototype);
            fE.prototype.constructor = fE;
            fE.prototype.cB = fE;
            fE.dB = {};
            b.btGeneric6DofConstraint = fE;
            fE.prototype.setLinearLowerLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $e(c, a)
            };
            fE.prototype.setLinearUpperLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                af(c, a)
            };
            fE.prototype.setAngularLowerLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bf(c, a)
            };
            fE.prototype.setAngularUpperLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                cf(c, a)
            };
            fE.prototype.getFrameOffsetA = function () {
                return k(df(this.bB), r)
            };
            fE.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ef(c, a)
            };
            fE.prototype.getBreakingImpulseThreshold = function () {
                return ff(this.bB)
            };
            fE.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                gf(c, a)
            };
            fE.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return hf(d, a, c)
            };
            fE.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                jf(e, a, c, d)
            };
            fE.prototype.__destroy__ = function () {
                kf(this.bB)
            };

            function x(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = lf(a, c, d, e);
                h(x)[this.bB] = this
            }

            x.prototype = Object.create(SD.prototype);
            x.prototype.constructor = x;
            x.prototype.cB = x;
            x.dB = {};
            b.btDiscreteDynamicsWorld = x;
            x.prototype.setGravity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                mf(c, a)
            };
            x.prototype.getGravity = function () {
                return k(nf(this.bB), m)
            };
            x.prototype.addRigidBody = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? of(e, a) : void 0 === d ? _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(e, a, c) : pf(e, a, c, d)
            };
            x.prototype.removeRigidBody = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qf(c, a)
            };
            x.prototype.addConstraint = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                void 0 === c ? rf(d, a) : sf(d, a, c)
            };
            x.prototype.removeConstraint = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tf(c, a)
            };
            x.prototype.stepSimulation = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                return void 0 === c ? uf(e, a) : void 0 === d ? vf(e, a, c) : wf(e, a, c, d)
            };
            x.prototype.setContactAddedCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xf(c, a)
            };
            x.prototype.setContactProcessedCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yf(c, a)
            };
            x.prototype.setContactDestroyedCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zf(c, a)
            };
            x.prototype.getDispatcher = function () {
                return k(Af(this.bB), JD)
            };
            x.prototype.rayTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Bf(e, a, c, d)
            };
            x.prototype.getPairCache = function () {
                return k(Cf(this.bB), KD)
            };
            x.prototype.getDispatchInfo = function () {
                return k(Df(this.bB), p)
            };
            x.prototype.addCollisionObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? Ef(e, a) : void 0 === d ? Ff(e, a, c) : Gf(e, a, c, d)
            };
            x.prototype.removeCollisionObject = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hf(c, a)
            };
            x.prototype.getBroadphase = function () {
                return k(If(this.bB), LD)
            };
            x.prototype.convexSweepTest = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                Jf(n, a, c, d, e, g)
            };
            x.prototype.contactPairTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Kf(e, a, c, d)
            };
            x.prototype.contactTest = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Lf(d, a, c)
            };
            x.prototype.updateSingleAabb = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mf(c, a)
            };
            x.prototype.setDebugDrawer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Nf(c, a)
            };
            x.prototype.getDebugDrawer = function () {
                return k(Of(this.bB), MD)
            };
            x.prototype.debugDrawWorld = function () {
                Pf(this.bB)
            };
            x.prototype.debugDrawObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Qf(e, a, c, d)
            };
            x.prototype.addAction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Rf(c, a)
            };
            x.prototype.removeAction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Sf(c, a)
            };
            x.prototype.getSolverInfo = function () {
                return k(Tf(this.bB), t)
            };
            x.prototype.setInternalTickCallback = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? Uf(e, a) : void 0 === d ? Vf(e, a, c) : Wf(e, a, c, d)
            };
            x.prototype.__destroy__ = function () {
                Xf(this.bB)
            };

            function gE() {
                throw"cannot construct a btVehicleRaycaster, no constructor in IDL";
            }

            gE.prototype = Object.create(f.prototype);
            gE.prototype.constructor = gE;
            gE.prototype.cB = gE;
            gE.dB = {};
            b.btVehicleRaycaster = gE;
            gE.prototype.castRay = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Yf(e, a, c, d)
            };
            gE.prototype.__destroy__ = function () {
                Zf(this.bB)
            };

            function hE() {
                throw"cannot construct a btActionInterface, no constructor in IDL";
            }

            hE.prototype = Object.create(f.prototype);
            hE.prototype.constructor = hE;
            hE.prototype.cB = hE;
            hE.dB = {};
            b.btActionInterface = hE;
            hE.prototype.updateAction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                $f(d, a, c)
            };
            hE.prototype.__destroy__ = function () {
                ag(this.bB)
            };

            function y() {
                this.bB = bg();
                h(y)[this.bB] = this
            }

            y.prototype = Object.create(q.prototype);
            y.prototype.constructor = y;
            y.prototype.cB = y;
            y.dB = {};
            b.btGhostObject = y;
            y.prototype.getNumOverlappingObjects = function () {
                return cg(this.bB)
            };
            y.prototype.getOverlappingObject = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(dg(c, a), q)
            };
            y.prototype.setAnisotropicFriction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                eg(d, a, c)
            };
            y.prototype.getCollisionShape = function () {
                return k(fg(this.bB), l)
            };
            y.prototype.setContactProcessingThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                gg(c, a)
            };
            y.prototype.setActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hg(c, a)
            };
            y.prototype.forceActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ig(c, a)
            };
            y.prototype.activate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                void 0 === a ? jg(c) : kg(c, a)
            };
            y.prototype.isActive = function () {
                return !!lg(this.bB)
            };
            y.prototype.isKinematicObject = function () {
                return !!mg(this.bB)
            };
            y.prototype.isStaticObject = function () {
                return !!ng(this.bB)
            };
            y.prototype.isStaticOrKinematicObject = function () {
                return !!og(this.bB)
            };
            y.prototype.getRestitution = function () {
                return pg(this.bB)
            };
            y.prototype.getFriction = function () {
                return qg(this.bB)
            };
            y.prototype.getRollingFriction = function () {
                return rg(this.bB)
            };
            y.prototype.setRestitution = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sg(c, a)
            };
            y.prototype.setFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tg(c, a)
            };
            y.prototype.setRollingFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ug(c, a)
            };
            y.prototype.getWorldTransform = function () {
                return k(vg(this.bB), r)
            };
            y.prototype.getCollisionFlags = function () {
                return wg(this.bB)
            };
            y.prototype.setCollisionFlags = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xg(c, a)
            };
            y.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yg(c, a)
            };
            y.prototype.setCollisionShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zg(c, a)
            };
            y.prototype.setCcdMotionThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ag(c, a)
            };
            y.prototype.setCcdSweptSphereRadius = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Bg(c, a)
            };
            y.prototype.getUserIndex = function () {
                return Cg(this.bB)
            };
            y.prototype.setUserIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dg(c, a)
            };
            y.prototype.getUserPointer = function () {
                return k(Eg(this.bB), ND)
            };
            y.prototype.setUserPointer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fg(c, a)
            };
            y.prototype.getBroadphaseHandle = function () {
                return k(Gg(this.bB), OD)
            };
            y.prototype.__destroy__ = function () {
                Hg(this.bB)
            };

            function iE() {
                throw"cannot construct a btSoftBodySolver, no constructor in IDL";
            }

            iE.prototype = Object.create(f.prototype);
            iE.prototype.constructor = iE;
            iE.prototype.cB = iE;
            iE.dB = {};
            b.btSoftBodySolver = iE;
            iE.prototype.__destroy__ = function () {
                Ig(this.bB)
            };

            function ND() {
                throw"cannot construct a VoidPtr, no constructor in IDL";
            }

            ND.prototype = Object.create(f.prototype);
            ND.prototype.constructor = ND;
            ND.prototype.cB = ND;
            ND.dB = {};
            b.VoidPtr = ND;
            ND.prototype.__destroy__ = function () {
                Jg(this.bB)
            };

            function jE() {
                this.bB = Kg();
                h(jE)[this.bB] = this
            }

            jE.prototype = Object.create(MD.prototype);
            jE.prototype.constructor = jE;
            jE.prototype.cB = jE;
            jE.dB = {};
            b.DebugDrawer = jE;
            jE.prototype.drawLine = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Lg(e, a, c, d)
            };
            jE.prototype.drawContactPoint = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                Mg(n, a, c, d, e, g)
            };
            jE.prototype.reportErrorWarning = function (a) {
                var c = this.bB;
                DD();
                a = a && "object" === typeof a ? a.bB : GD(a);
                Ng(c, a)
            };
            jE.prototype.draw3dText = function (a, c) {
                var d = this.bB;
                DD();
                a && "object" === typeof a && (a = a.bB);
                c = c && "object" === typeof c ? c.bB : GD(c);
                Og(d, a, c)
            };
            jE.prototype.setDebugMode = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Pg(c, a)
            };
            jE.prototype.getDebugMode = function () {
                return Qg(this.bB)
            };
            jE.prototype.__destroy__ = function () {
                Rg(this.bB)
            };

            function z(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = void 0 === a ? Sg() : void 0 === c ? _emscripten_bind_btVector4_btVector4_1(a) : void 0 === d ? _emscripten_bind_btVector4_btVector4_2(a, c) : void 0 === e ? _emscripten_bind_btVector4_btVector4_3(a, c, d) : Tg(a, c, d, e);
                h(z)[this.bB] = this
            }

            z.prototype = Object.create(m.prototype);
            z.prototype.constructor = z;
            z.prototype.cB = z;
            z.dB = {};
            b.btVector4 = z;
            z.prototype.w = z.prototype.w = function () {
                return Ug(this.bB)
            };
            z.prototype.setValue = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                Vg(g, a, c, d, e)
            };
            z.prototype.length = z.prototype.length = function () {
                return Wg(this.bB)
            };
            z.prototype.x = z.prototype.x = function () {
                return Xg(this.bB)
            };
            z.prototype.y = z.prototype.y = function () {
                return Yg(this.bB)
            };
            z.prototype.z = z.prototype.z = function () {
                return Zg(this.bB)
            };
            z.prototype.setX = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $g(c, a)
            };
            z.prototype.setY = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ah(c, a)
            };
            z.prototype.setZ = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bh(c, a)
            };
            z.prototype.normalize = z.prototype.normalize = function () {
                ch(this.bB)
            };
            z.prototype.rotate = z.prototype.rotate = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return k(dh(d, a, c), m)
            };
            z.prototype.dot = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return eh(c, a)
            };
            z.prototype.op_mul = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(fh(c, a), m)
            };
            z.prototype.op_add = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(gh(c, a), m)
            };
            z.prototype.op_sub = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(hh(c, a), m)
            };
            z.prototype.__destroy__ = function () {
                ih(this.bB)
            };

            function A(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = jh(a, c, d, e);
                h(A)[this.bB] = this
            }

            A.prototype = Object.create(TD.prototype);
            A.prototype.constructor = A;
            A.prototype.cB = A;
            A.dB = {};
            b.btQuaternion = A;
            A.prototype.setValue = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                kh(g, a, c, d, e)
            };
            A.prototype.setEulerZYX = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                lh(e, a, c, d)
            };
            A.prototype.setRotation = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                mh(d, a, c)
            };
            A.prototype.normalize = A.prototype.normalize = function () {
                nh(this.bB)
            };
            A.prototype.length2 = function () {
                return oh(this.bB)
            };
            A.prototype.length = A.prototype.length = function () {
                return ph(this.bB)
            };
            A.prototype.dot = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return qh(c, a)
            };
            A.prototype.normalized = function () {
                return k(rh(this.bB), A)
            };
            A.prototype.getAxis = function () {
                return k(sh(this.bB), m)
            };
            A.prototype.inverse = A.prototype.inverse = function () {
                return k(th(this.bB), A)
            };
            A.prototype.getAngle = function () {
                return uh(this.bB)
            };
            A.prototype.getAngleShortestPath = function () {
                return vh(this.bB)
            };
            A.prototype.angle = A.prototype.angle = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return wh(c, a)
            };
            A.prototype.angleShortestPath = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return xh(c, a)
            };
            A.prototype.op_add = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(yh(c, a), A)
            };
            A.prototype.op_sub = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(zh(c, a), A)
            };
            A.prototype.op_mul = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ah(c, a), A)
            };
            A.prototype.op_mulq = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Bh(c, a), A)
            };
            A.prototype.op_div = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ch(c, a), A)
            };
            A.prototype.x = A.prototype.x = function () {
                return Dh(this.bB)
            };
            A.prototype.y = A.prototype.y = function () {
                return Eh(this.bB)
            };
            A.prototype.z = A.prototype.z = function () {
                return Fh(this.bB)
            };
            A.prototype.w = A.prototype.w = function () {
                return Gh(this.bB)
            };
            A.prototype.setX = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hh(c, a)
            };
            A.prototype.setY = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ih(c, a)
            };
            A.prototype.setZ = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Jh(c, a)
            };
            A.prototype.setW = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Kh(c, a)
            };
            A.prototype.__destroy__ = function () {
                Lh(this.bB)
            };

            function kE() {
                throw"cannot construct a btMatrix3x3, no constructor in IDL";
            }

            kE.prototype = Object.create(f.prototype);
            kE.prototype.constructor = kE;
            kE.prototype.cB = kE;
            kE.dB = {};
            b.btMatrix3x3 = kE;
            kE.prototype.setEulerZYX = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Mh(e, a, c, d)
            };
            kE.prototype.getRotation = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Nh(c, a)
            };
            kE.prototype.getRow = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Oh(c, a), m)
            };
            kE.prototype.__destroy__ = function () {
                Ph(this.bB)
            };

            function r(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = void 0 === a ? Qh() : void 0 === c ? _emscripten_bind_btTransform_btTransform_1(a) : Rh(a, c);
                h(r)[this.bB] = this
            }

            r.prototype = Object.create(f.prototype);
            r.prototype.constructor = r;
            r.prototype.cB = r;
            r.dB = {};
            b.btTransform = r;
            r.prototype.setIdentity = function () {
                Sh(this.bB)
            };
            r.prototype.setOrigin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Th(c, a)
            };
            r.prototype.setRotation = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Uh(c, a)
            };
            r.prototype.getOrigin = function () {
                return k(Vh(this.bB), m)
            };
            r.prototype.getRotation = function () {
                return k(Wh(this.bB), A)
            };
            r.prototype.getBasis = function () {
                return k(Xh(this.bB), kE)
            };
            r.prototype.setFromOpenGLMatrix = function (a) {
                var c = this.bB;
                DD();
                "object" == typeof a && (a = HD(a));
                Yh(c, a)
            };
            r.prototype.inverse = r.prototype.inverse = function () {
                return k(Zh(this.bB), r)
            };
            r.prototype.op_mul = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k($h(c, a), r)
            };
            r.prototype.__destroy__ = function () {
                ai(this.bB)
            };

            function lE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = void 0 === a ? bi() : void 0 === c ? ci(a) : di(a, c);
                h(lE)[this.bB] = this
            }

            lE.prototype = Object.create(UD.prototype);
            lE.prototype.constructor = lE;
            lE.prototype.cB = lE;
            lE.dB = {};
            b.btDefaultMotionState = lE;
            lE.prototype.getWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ei(c, a)
            };
            lE.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fi(c, a)
            };
            lE.prototype.get_m_graphicsWorldTrans = lE.prototype.dD = function () {
                return k(gi(this.bB), r)
            };
            lE.prototype.set_m_graphicsWorldTrans = lE.prototype.VF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hi(c, a)
            };
            Object.defineProperty(lE.prototype, "m_graphicsWorldTrans", {get: lE.prototype.dD, set: lE.prototype.VF});
            lE.prototype.__destroy__ = function () {
                ii(this.bB)
            };

            function mE() {
                throw"cannot construct a btCollisionObjectWrapper, no constructor in IDL";
            }

            mE.prototype = Object.create(f.prototype);
            mE.prototype.constructor = mE;
            mE.prototype.cB = mE;
            mE.dB = {};
            b.btCollisionObjectWrapper = mE;
            mE.prototype.getWorldTransform = function () {
                return k(ji(this.bB), r)
            };
            mE.prototype.getCollisionObject = function () {
                return k(ki(this.bB), q)
            };
            mE.prototype.getCollisionShape = function () {
                return k(li(this.bB), l)
            };

            function B(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = mi(a, c);
                h(B)[this.bB] = this
            }

            B.prototype = Object.create(u.prototype);
            B.prototype.constructor = B;
            B.prototype.cB = B;
            B.dB = {};
            b.ClosestRayResultCallback = B;
            B.prototype.hasHit = function () {
                return !!ni(this.bB)
            };
            B.prototype.get_m_rayFromWorld = B.prototype.FB = function () {
                return k(oi(this.bB), m)
            };
            B.prototype.set_m_rayFromWorld = B.prototype.PB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pi(c, a)
            };
            Object.defineProperty(B.prototype, "m_rayFromWorld", {get: B.prototype.FB, set: B.prototype.PB});
            B.prototype.get_m_rayToWorld = B.prototype.GB = function () {
                return k(qi(this.bB), m)
            };
            B.prototype.set_m_rayToWorld = B.prototype.QB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ri(c, a)
            };
            Object.defineProperty(B.prototype, "m_rayToWorld", {get: B.prototype.GB, set: B.prototype.QB});
            B.prototype.get_m_hitNormalWorld = B.prototype.oB = function () {
                return k(si(this.bB), m)
            };
            B.prototype.set_m_hitNormalWorld = B.prototype.vB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ti(c, a)
            };
            Object.defineProperty(B.prototype, "m_hitNormalWorld", {get: B.prototype.oB, set: B.prototype.vB});
            B.prototype.get_m_hitPointWorld = B.prototype.pB = function () {
                return k(ui(this.bB), m)
            };
            B.prototype.set_m_hitPointWorld = B.prototype.wB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vi(c, a)
            };
            Object.defineProperty(B.prototype, "m_hitPointWorld", {get: B.prototype.pB, set: B.prototype.wB});
            B.prototype.get_m_collisionFilterGroup = B.prototype.eB = function () {
                return wi(this.bB)
            };
            B.prototype.set_m_collisionFilterGroup = B.prototype.gB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xi(c, a)
            };
            Object.defineProperty(B.prototype, "m_collisionFilterGroup", {get: B.prototype.eB, set: B.prototype.gB});
            B.prototype.get_m_collisionFilterMask = B.prototype.fB = function () {
                return yi(this.bB)
            };
            B.prototype.set_m_collisionFilterMask = B.prototype.hB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zi(c, a)
            };
            Object.defineProperty(B.prototype, "m_collisionFilterMask", {get: B.prototype.fB, set: B.prototype.hB});
            B.prototype.get_m_closestHitFraction = B.prototype.iB = function () {
                return Ai(this.bB)
            };
            B.prototype.set_m_closestHitFraction = B.prototype.jB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Bi(c, a)
            };
            Object.defineProperty(B.prototype, "m_closestHitFraction", {get: B.prototype.iB, set: B.prototype.jB});
            B.prototype.get_m_collisionObject = B.prototype.mB = function () {
                return k(Ci(this.bB), q)
            };
            B.prototype.set_m_collisionObject = B.prototype.tB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Di(c, a)
            };
            Object.defineProperty(B.prototype, "m_collisionObject", {get: B.prototype.mB, set: B.prototype.tB});
            B.prototype.get_m_flags = B.prototype.kB = function () {
                return Ei(this.bB)
            };
            B.prototype.set_m_flags = B.prototype.lB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fi(c, a)
            };
            Object.defineProperty(B.prototype, "m_flags", {get: B.prototype.kB, set: B.prototype.lB});
            B.prototype.__destroy__ = function () {
                Gi(this.bB)
            };

            function nE() {
                throw"cannot construct a btConstCollisionObjectArray, no constructor in IDL";
            }

            nE.prototype = Object.create(f.prototype);
            nE.prototype.constructor = nE;
            nE.prototype.cB = nE;
            nE.dB = {};
            b.btConstCollisionObjectArray = nE;
            nE.prototype.size = nE.prototype.size = function () {
                return Hi(this.bB)
            };
            nE.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ii(c, a), q)
            };
            nE.prototype.__destroy__ = function () {
                Ji(this.bB)
            };

            function oE() {
                throw"cannot construct a btScalarArray, no constructor in IDL";
            }

            oE.prototype = Object.create(f.prototype);
            oE.prototype.constructor = oE;
            oE.prototype.cB = oE;
            oE.dB = {};
            b.btScalarArray = oE;
            oE.prototype.size = oE.prototype.size = function () {
                return Ki(this.bB)
            };
            oE.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return Li(c, a)
            };
            oE.prototype.__destroy__ = function () {
                Mi(this.bB)
            };

            function C(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Ni(a, c);
                h(C)[this.bB] = this
            }

            C.prototype = Object.create(u.prototype);
            C.prototype.constructor = C;
            C.prototype.cB = C;
            C.dB = {};
            b.AllHitsRayResultCallback = C;
            C.prototype.hasHit = function () {
                return !!Oi(this.bB)
            };
            C.prototype.get_m_collisionObjects = C.prototype.MC = function () {
                return k(Pi(this.bB), nE)
            };
            C.prototype.set_m_collisionObjects = C.prototype.DF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qi(c, a)
            };
            Object.defineProperty(C.prototype, "m_collisionObjects", {get: C.prototype.MC, set: C.prototype.DF});
            C.prototype.get_m_rayFromWorld = C.prototype.FB = function () {
                return k(Ri(this.bB), m)
            };
            C.prototype.set_m_rayFromWorld = C.prototype.PB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Si(c, a)
            };
            Object.defineProperty(C.prototype, "m_rayFromWorld", {get: C.prototype.FB, set: C.prototype.PB});
            C.prototype.get_m_rayToWorld = C.prototype.GB = function () {
                return k(Ti(this.bB), m)
            };
            C.prototype.set_m_rayToWorld = C.prototype.QB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ui(c, a)
            };
            Object.defineProperty(C.prototype, "m_rayToWorld", {get: C.prototype.GB, set: C.prototype.QB});
            C.prototype.get_m_hitNormalWorld = C.prototype.oB = function () {
                return k(Vi(this.bB), pE)
            };
            C.prototype.set_m_hitNormalWorld = C.prototype.vB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wi(c, a)
            };
            Object.defineProperty(C.prototype, "m_hitNormalWorld", {get: C.prototype.oB, set: C.prototype.vB});
            C.prototype.get_m_hitPointWorld = C.prototype.pB = function () {
                return k(Xi(this.bB), pE)
            };
            C.prototype.set_m_hitPointWorld = C.prototype.wB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yi(c, a)
            };
            Object.defineProperty(C.prototype, "m_hitPointWorld", {get: C.prototype.pB, set: C.prototype.wB});
            C.prototype.get_m_hitFractions = C.prototype.iD = function () {
                return k(Zi(this.bB), oE)
            };
            C.prototype.set_m_hitFractions = C.prototype.$F = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $i(c, a)
            };
            Object.defineProperty(C.prototype, "m_hitFractions", {get: C.prototype.iD, set: C.prototype.$F});
            C.prototype.get_m_collisionFilterGroup = C.prototype.eB = function () {
                return aj(this.bB)
            };
            C.prototype.set_m_collisionFilterGroup = C.prototype.gB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bj(c, a)
            };
            Object.defineProperty(C.prototype, "m_collisionFilterGroup", {get: C.prototype.eB, set: C.prototype.gB});
            C.prototype.get_m_collisionFilterMask = C.prototype.fB = function () {
                return cj(this.bB)
            };
            C.prototype.set_m_collisionFilterMask = C.prototype.hB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                dj(c, a)
            };
            Object.defineProperty(C.prototype, "m_collisionFilterMask", {get: C.prototype.fB, set: C.prototype.hB});
            C.prototype.get_m_closestHitFraction = C.prototype.iB = function () {
                return ej(this.bB)
            };
            C.prototype.set_m_closestHitFraction = C.prototype.jB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fj(c, a)
            };
            Object.defineProperty(C.prototype, "m_closestHitFraction", {get: C.prototype.iB, set: C.prototype.jB});
            C.prototype.get_m_collisionObject = C.prototype.mB = function () {
                return k(gj(this.bB), q)
            };
            C.prototype.set_m_collisionObject = C.prototype.tB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hj(c, a)
            };
            Object.defineProperty(C.prototype, "m_collisionObject", {get: C.prototype.mB, set: C.prototype.tB});
            C.prototype.get_m_flags = C.prototype.kB = function () {
                return ij(this.bB)
            };
            C.prototype.set_m_flags = C.prototype.lB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jj(c, a)
            };
            Object.defineProperty(C.prototype, "m_flags", {get: C.prototype.kB, set: C.prototype.lB});
            C.prototype.__destroy__ = function () {
                kj(this.bB)
            };

            function E() {
                throw"cannot construct a btManifoldPoint, no constructor in IDL";
            }

            E.prototype = Object.create(f.prototype);
            E.prototype.constructor = E;
            E.prototype.cB = E;
            E.dB = {};
            b.btManifoldPoint = E;
            E.prototype.getPositionWorldOnA = function () {
                return k(lj(this.bB), m)
            };
            E.prototype.getPositionWorldOnB = function () {
                return k(mj(this.bB), m)
            };
            E.prototype.getAppliedImpulse = function () {
                return nj(this.bB)
            };
            E.prototype.getDistance = function () {
                return oj(this.bB)
            };
            E.prototype.get_m_localPointA = E.prototype.yD = function () {
                return k(pj(this.bB), m)
            };
            E.prototype.set_m_localPointA = E.prototype.pG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qj(c, a)
            };
            Object.defineProperty(E.prototype, "m_localPointA", {get: E.prototype.yD, set: E.prototype.pG});
            E.prototype.get_m_localPointB = E.prototype.zD = function () {
                return k(rj(this.bB), m)
            };
            E.prototype.set_m_localPointB = E.prototype.qG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sj(c, a)
            };
            Object.defineProperty(E.prototype, "m_localPointB", {get: E.prototype.zD, set: E.prototype.qG});
            E.prototype.get_m_positionWorldOnB = E.prototype.QD = function () {
                return k(tj(this.bB), m)
            };
            E.prototype.set_m_positionWorldOnB = E.prototype.HG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                uj(c, a)
            };
            Object.defineProperty(E.prototype, "m_positionWorldOnB", {get: E.prototype.QD, set: E.prototype.HG});
            E.prototype.get_m_positionWorldOnA = E.prototype.PD = function () {
                return k(vj(this.bB), m)
            };
            E.prototype.set_m_positionWorldOnA = E.prototype.GG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wj(c, a)
            };
            Object.defineProperty(E.prototype, "m_positionWorldOnA", {get: E.prototype.PD, set: E.prototype.GG});
            E.prototype.get_m_normalWorldOnB = E.prototype.KD = function () {
                return k(xj(this.bB), m)
            };
            E.prototype.set_m_normalWorldOnB = E.prototype.BG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yj(c, a)
            };
            Object.defineProperty(E.prototype, "m_normalWorldOnB", {get: E.prototype.KD, set: E.prototype.BG});
            E.prototype.get_m_userPersistentData = E.prototype.rE = function () {
                return zj(this.bB)
            };
            E.prototype.set_m_userPersistentData = E.prototype.jH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Aj(c, a)
            };
            Object.defineProperty(E.prototype, "m_userPersistentData", {get: E.prototype.rE, set: E.prototype.jH});
            E.prototype.__destroy__ = function () {
                Bj(this.bB)
            };

            function qE() {
                this.bB = Cj();
                h(qE)[this.bB] = this
            }

            qE.prototype = Object.create(VD.prototype);
            qE.prototype.constructor = qE;
            qE.prototype.cB = qE;
            qE.dB = {};
            b.ConcreteContactResultCallback = qE;
            qE.prototype.addSingleResult = function (a, c, d, e, g, n, D) {
                var T = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                return Dj(T, a, c, d, e, g, n, D)
            };
            qE.prototype.__destroy__ = function () {
                Ej(this.bB)
            };

            function rE() {
                throw"cannot construct a LocalShapeInfo, no constructor in IDL";
            }

            rE.prototype = Object.create(f.prototype);
            rE.prototype.constructor = rE;
            rE.prototype.cB = rE;
            rE.dB = {};
            b.LocalShapeInfo = rE;
            rE.prototype.get_m_shapePart = rE.prototype.ZD = function () {
                return Fj(this.bB)
            };
            rE.prototype.set_m_shapePart = rE.prototype.QG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gj(c, a)
            };
            Object.defineProperty(rE.prototype, "m_shapePart", {get: rE.prototype.ZD, set: rE.prototype.QG});
            rE.prototype.get_m_triangleIndex = rE.prototype.nE = function () {
                return Hj(this.bB)
            };
            rE.prototype.set_m_triangleIndex = rE.prototype.fH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ij(c, a)
            };
            Object.defineProperty(rE.prototype, "m_triangleIndex", {get: rE.prototype.nE, set: rE.prototype.fH});
            rE.prototype.__destroy__ = function () {
                Jj(this.bB)
            };

            function F(a, c, d, e, g) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                this.bB = Kj(a, c, d, e, g);
                h(F)[this.bB] = this
            }

            F.prototype = Object.create(f.prototype);
            F.prototype.constructor = F;
            F.prototype.cB = F;
            F.dB = {};
            b.LocalConvexResult = F;
            F.prototype.get_m_hitCollisionObject = F.prototype.DB = function () {
                return k(Lj(this.bB), q)
            };
            F.prototype.set_m_hitCollisionObject = F.prototype.NB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mj(c, a)
            };
            Object.defineProperty(F.prototype, "m_hitCollisionObject", {get: F.prototype.DB, set: F.prototype.NB});
            F.prototype.get_m_localShapeInfo = F.prototype.AD = function () {
                return k(Nj(this.bB), rE)
            };
            F.prototype.set_m_localShapeInfo = F.prototype.rG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Oj(c, a)
            };
            Object.defineProperty(F.prototype, "m_localShapeInfo", {get: F.prototype.AD, set: F.prototype.rG});
            F.prototype.get_m_hitNormalLocal = F.prototype.kD = function () {
                return k(Pj(this.bB), m)
            };
            F.prototype.set_m_hitNormalLocal = F.prototype.bG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qj(c, a)
            };
            Object.defineProperty(F.prototype, "m_hitNormalLocal", {get: F.prototype.kD, set: F.prototype.bG});
            F.prototype.get_m_hitPointLocal = F.prototype.mD = function () {
                return k(Rj(this.bB), m)
            };
            F.prototype.set_m_hitPointLocal = F.prototype.dG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Sj(c, a)
            };
            Object.defineProperty(F.prototype, "m_hitPointLocal", {get: F.prototype.mD, set: F.prototype.dG});
            F.prototype.get_m_hitFraction = F.prototype.hD = function () {
                return Tj(this.bB)
            };
            F.prototype.set_m_hitFraction = F.prototype.ZF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Uj(c, a)
            };
            Object.defineProperty(F.prototype, "m_hitFraction", {get: F.prototype.hD, set: F.prototype.ZF});
            F.prototype.__destroy__ = function () {
                Vj(this.bB)
            };

            function G(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Wj(a, c);
                h(G)[this.bB] = this
            }

            G.prototype = Object.create(v.prototype);
            G.prototype.constructor = G;
            G.prototype.cB = G;
            G.dB = {};
            b.ClosestConvexResultCallback = G;
            G.prototype.hasHit = function () {
                return !!Xj(this.bB)
            };
            G.prototype.get_m_hitCollisionObject = G.prototype.DB = function () {
                return k(Yj(this.bB), q)
            };
            G.prototype.set_m_hitCollisionObject = G.prototype.NB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Zj(c, a)
            };
            Object.defineProperty(G.prototype, "m_hitCollisionObject", {get: G.prototype.DB, set: G.prototype.NB});
            G.prototype.get_m_convexFromWorld = G.prototype.RC = function () {
                return k(ak(this.bB), m)
            };
            G.prototype.set_m_convexFromWorld = G.prototype.IF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bk(c, a)
            };
            Object.defineProperty(G.prototype, "m_convexFromWorld", {get: G.prototype.RC, set: G.prototype.IF});
            G.prototype.get_m_convexToWorld = G.prototype.SC = function () {
                return k(ck(this.bB), m)
            };
            G.prototype.set_m_convexToWorld = G.prototype.JF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                dk(c, a)
            };
            Object.defineProperty(G.prototype, "m_convexToWorld", {get: G.prototype.SC, set: G.prototype.JF});
            G.prototype.get_m_hitNormalWorld = G.prototype.oB = function () {
                return k(ek(this.bB), m)
            };
            G.prototype.set_m_hitNormalWorld = G.prototype.vB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fk(c, a)
            };
            Object.defineProperty(G.prototype, "m_hitNormalWorld", {get: G.prototype.oB, set: G.prototype.vB});
            G.prototype.get_m_hitPointWorld = G.prototype.pB = function () {
                return k(gk(this.bB), m)
            };
            G.prototype.set_m_hitPointWorld = G.prototype.wB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hk(c, a)
            };
            Object.defineProperty(G.prototype, "m_hitPointWorld", {get: G.prototype.pB, set: G.prototype.wB});
            G.prototype.get_m_collisionFilterGroup = G.prototype.eB = function () {
                return ik(this.bB)
            };
            G.prototype.set_m_collisionFilterGroup = G.prototype.gB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jk(c, a)
            };
            Object.defineProperty(G.prototype, "m_collisionFilterGroup", {get: G.prototype.eB, set: G.prototype.gB});
            G.prototype.get_m_collisionFilterMask = G.prototype.fB = function () {
                return kk(this.bB)
            };
            G.prototype.set_m_collisionFilterMask = G.prototype.hB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                lk(c, a)
            };
            Object.defineProperty(G.prototype, "m_collisionFilterMask", {get: G.prototype.fB, set: G.prototype.hB});
            G.prototype.get_m_closestHitFraction = G.prototype.iB = function () {
                return mk(this.bB)
            };
            G.prototype.set_m_closestHitFraction = G.prototype.jB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nk(c, a)
            };
            Object.defineProperty(G.prototype, "m_closestHitFraction", {get: G.prototype.iB, set: G.prototype.jB});
            G.prototype.__destroy__ = function () {
                ok(this.bB)
            };

            function sE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = void 0 === c ? pk(a) : qk(a, c);
                h(sE)[this.bB] = this
            }

            sE.prototype = Object.create(WD.prototype);
            sE.prototype.constructor = sE;
            sE.prototype.cB = sE;
            sE.dB = {};
            b.btConvexTriangleMeshShape = sE;
            sE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                rk(c, a)
            };
            sE.prototype.getLocalScaling = function () {
                return k(sk(this.bB), m)
            };
            sE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                tk(d, a, c)
            };
            sE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                uk(c, a)
            };
            sE.prototype.getMargin = function () {
                return vk(this.bB)
            };
            sE.prototype.__destroy__ = function () {
                wk(this.bB)
            };

            function tE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = xk(a);
                h(tE)[this.bB] = this
            }

            tE.prototype = Object.create(l.prototype);
            tE.prototype.constructor = tE;
            tE.prototype.cB = tE;
            tE.dB = {};
            b.btBoxShape = tE;
            tE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yk(c, a)
            };
            tE.prototype.getMargin = function () {
                return zk(this.bB)
            };
            tE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ak(c, a)
            };
            tE.prototype.getLocalScaling = function () {
                return k(Bk(this.bB), m)
            };
            tE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Ck(d, a, c)
            };
            tE.prototype.__destroy__ = function () {
                Dk(this.bB)
            };

            function uE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Ek(a, c);
                h(uE)[this.bB] = this
            }

            uE.prototype = Object.create(XD.prototype);
            uE.prototype.constructor = uE;
            uE.prototype.cB = uE;
            uE.dB = {};
            b.btCapsuleShapeX = uE;
            uE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fk(c, a)
            };
            uE.prototype.getMargin = function () {
                return Gk(this.bB)
            };
            uE.prototype.getUpAxis = function () {
                return Hk(this.bB)
            };
            uE.prototype.getRadius = function () {
                return Ik(this.bB)
            };
            uE.prototype.getHalfHeight = function () {
                return Jk(this.bB)
            };
            uE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Kk(c, a)
            };
            uE.prototype.getLocalScaling = function () {
                return k(Lk(this.bB), m)
            };
            uE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Mk(d, a, c)
            };
            uE.prototype.__destroy__ = function () {
                Nk(this.bB)
            };

            function vE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Ok(a, c);
                h(vE)[this.bB] = this
            }

            vE.prototype = Object.create(XD.prototype);
            vE.prototype.constructor = vE;
            vE.prototype.cB = vE;
            vE.dB = {};
            b.btCapsuleShapeZ = vE;
            vE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Pk(c, a)
            };
            vE.prototype.getMargin = function () {
                return Qk(this.bB)
            };
            vE.prototype.getUpAxis = function () {
                return Rk(this.bB)
            };
            vE.prototype.getRadius = function () {
                return Sk(this.bB)
            };
            vE.prototype.getHalfHeight = function () {
                return Tk(this.bB)
            };
            vE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Uk(c, a)
            };
            vE.prototype.getLocalScaling = function () {
                return k(Vk(this.bB), m)
            };
            vE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Wk(d, a, c)
            };
            vE.prototype.__destroy__ = function () {
                Xk(this.bB)
            };

            function wE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = Yk(a);
                h(wE)[this.bB] = this
            }

            wE.prototype = Object.create(YD.prototype);
            wE.prototype.constructor = wE;
            wE.prototype.cB = wE;
            wE.dB = {};
            b.btCylinderShapeX = wE;
            wE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Zk(c, a)
            };
            wE.prototype.getMargin = function () {
                return $k(this.bB)
            };
            wE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                al(c, a)
            };
            wE.prototype.getLocalScaling = function () {
                return k(bl(this.bB), m)
            };
            wE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                cl(d, a, c)
            };
            wE.prototype.__destroy__ = function () {
                dl(this.bB)
            };

            function xE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = el(a);
                h(xE)[this.bB] = this
            }

            xE.prototype = Object.create(YD.prototype);
            xE.prototype.constructor = xE;
            xE.prototype.cB = xE;
            xE.dB = {};
            b.btCylinderShapeZ = xE;
            xE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fl(c, a)
            };
            xE.prototype.getMargin = function () {
                return gl(this.bB)
            };
            xE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hl(c, a)
            };
            xE.prototype.getLocalScaling = function () {
                return k(il(this.bB), m)
            };
            xE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                jl(d, a, c)
            };
            xE.prototype.__destroy__ = function () {
                kl(this.bB)
            };

            function yE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = ll(a);
                h(yE)[this.bB] = this
            }

            yE.prototype = Object.create(l.prototype);
            yE.prototype.constructor = yE;
            yE.prototype.cB = yE;
            yE.dB = {};
            b.btSphereShape = yE;
            yE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ml(c, a)
            };
            yE.prototype.getMargin = function () {
                return nl(this.bB)
            };
            yE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ol(c, a)
            };
            yE.prototype.getLocalScaling = function () {
                return k(pl(this.bB), m)
            };
            yE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                ql(d, a, c)
            };
            yE.prototype.__destroy__ = function () {
                rl(this.bB)
            };

            function zE(a, c, d) {
                DD();
                a && "object" === typeof a && (a = a.bB);
                "object" == typeof c && (c = HD(c));
                d && "object" === typeof d && (d = d.bB);
                this.bB = sl(a, c, d);
                h(zE)[this.bB] = this
            }

            zE.prototype = Object.create(l.prototype);
            zE.prototype.constructor = zE;
            zE.prototype.cB = zE;
            zE.dB = {};
            b.btMultiSphereShape = zE;
            zE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tl(c, a)
            };
            zE.prototype.getLocalScaling = function () {
                return k(ul(this.bB), m)
            };
            zE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                vl(d, a, c)
            };
            zE.prototype.__destroy__ = function () {
                wl(this.bB)
            };

            function AE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = xl(a, c);
                h(AE)[this.bB] = this
            }

            AE.prototype = Object.create(ZD.prototype);
            AE.prototype.constructor = AE;
            AE.prototype.cB = AE;
            AE.dB = {};
            b.btConeShapeX = AE;
            AE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yl(c, a)
            };
            AE.prototype.getLocalScaling = function () {
                return k(zl(this.bB), m)
            };
            AE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Al(d, a, c)
            };
            AE.prototype.__destroy__ = function () {
                Bl(this.bB)
            };

            function BE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Cl(a, c);
                h(BE)[this.bB] = this
            }

            BE.prototype = Object.create(ZD.prototype);
            BE.prototype.constructor = BE;
            BE.prototype.cB = BE;
            BE.dB = {};
            b.btConeShapeZ = BE;
            BE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dl(c, a)
            };
            BE.prototype.getLocalScaling = function () {
                return k(El(this.bB), m)
            };
            BE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Fl(d, a, c)
            };
            BE.prototype.__destroy__ = function () {
                Gl(this.bB)
            };

            function CE() {
                throw"cannot construct a btIntArray, no constructor in IDL";
            }

            CE.prototype = Object.create(f.prototype);
            CE.prototype.constructor = CE;
            CE.prototype.cB = CE;
            CE.dB = {};
            b.btIntArray = CE;
            CE.prototype.size = CE.prototype.size = function () {
                return Hl(this.bB)
            };
            CE.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return Il(c, a)
            };
            CE.prototype.__destroy__ = function () {
                Jl(this.bB)
            };

            function DE() {
                throw"cannot construct a btFace, no constructor in IDL";
            }

            DE.prototype = Object.create(f.prototype);
            DE.prototype.constructor = DE;
            DE.prototype.cB = DE;
            DE.dB = {};
            b.btFace = DE;
            DE.prototype.get_m_indices = DE.prototype.pD = function () {
                return k(Kl(this.bB), CE)
            };
            DE.prototype.set_m_indices = DE.prototype.gG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ll(c, a)
            };
            Object.defineProperty(DE.prototype, "m_indices", {get: DE.prototype.pD, set: DE.prototype.gG});
            DE.prototype.get_m_plane = DE.prototype.OD = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return Ml(c, a)
            };
            DE.prototype.set_m_plane = DE.prototype.FG = function (a, c) {
                var d = this.bB;
                DD();
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Nl(d, a, c)
            };
            Object.defineProperty(DE.prototype, "m_plane", {get: DE.prototype.OD, set: DE.prototype.FG});
            DE.prototype.__destroy__ = function () {
                Ol(this.bB)
            };

            function pE() {
                throw"cannot construct a btVector3Array, no constructor in IDL";
            }

            pE.prototype = Object.create(f.prototype);
            pE.prototype.constructor = pE;
            pE.prototype.cB = pE;
            pE.dB = {};
            b.btVector3Array = pE;
            pE.prototype.size = pE.prototype.size = function () {
                return Pl(this.bB)
            };
            pE.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ql(c, a), m)
            };
            pE.prototype.__destroy__ = function () {
                Rl(this.bB)
            };

            function EE() {
                throw"cannot construct a btFaceArray, no constructor in IDL";
            }

            EE.prototype = Object.create(f.prototype);
            EE.prototype.constructor = EE;
            EE.prototype.cB = EE;
            EE.dB = {};
            b.btFaceArray = EE;
            EE.prototype.size = EE.prototype.size = function () {
                return Sl(this.bB)
            };
            EE.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Tl(c, a), DE)
            };
            EE.prototype.__destroy__ = function () {
                Ul(this.bB)
            };

            function FE() {
                throw"cannot construct a btConvexPolyhedron, no constructor in IDL";
            }

            FE.prototype = Object.create(f.prototype);
            FE.prototype.constructor = FE;
            FE.prototype.cB = FE;
            FE.dB = {};
            b.btConvexPolyhedron = FE;
            FE.prototype.get_m_vertices = FE.prototype.tE = function () {
                return k(Vl(this.bB), pE)
            };
            FE.prototype.set_m_vertices = FE.prototype.lH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wl(c, a)
            };
            Object.defineProperty(FE.prototype, "m_vertices", {get: FE.prototype.tE, set: FE.prototype.lH});
            FE.prototype.get_m_faces = FE.prototype.CB = function () {
                return k(Xl(this.bB), EE)
            };
            FE.prototype.set_m_faces = FE.prototype.MB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yl(c, a)
            };
            Object.defineProperty(FE.prototype, "m_faces", {get: FE.prototype.CB, set: FE.prototype.MB});
            FE.prototype.__destroy__ = function () {
                Zl(this.bB)
            };

            function GE(a, c) {
                DD();
                "object" == typeof a && (a = HD(a));
                c && "object" === typeof c && (c = c.bB);
                this.bB = void 0 === a ? $l() : void 0 === c ? am(a) : bm(a, c);
                h(GE)[this.bB] = this
            }

            GE.prototype = Object.create(l.prototype);
            GE.prototype.constructor = GE;
            GE.prototype.cB = GE;
            GE.dB = {};
            b.btConvexHullShape = GE;
            GE.prototype.addPoint = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                void 0 === c ? cm(d, a) : dm(d, a, c)
            };
            GE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                em(c, a)
            };
            GE.prototype.getMargin = function () {
                return fm(this.bB)
            };
            GE.prototype.getNumVertices = function () {
                return gm(this.bB)
            };
            GE.prototype.initializePolyhedralFeatures = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return !!hm(c, a)
            };
            GE.prototype.recalcLocalAabb = function () {
                im(this.bB)
            };
            GE.prototype.getConvexPolyhedron = function () {
                return k(jm(this.bB), FE)
            };
            GE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                km(c, a)
            };
            GE.prototype.getLocalScaling = function () {
                return k(lm(this.bB), m)
            };
            GE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                mm(d, a, c)
            };
            GE.prototype.__destroy__ = function () {
                nm(this.bB)
            };

            function HE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = om(a);
                h(HE)[this.bB] = this
            }

            HE.prototype = Object.create(f.prototype);
            HE.prototype.constructor = HE;
            HE.prototype.cB = HE;
            HE.dB = {};
            b.btShapeHull = HE;
            HE.prototype.buildHull = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return !!pm(c, a)
            };
            HE.prototype.numVertices = function () {
                return qm(this.bB)
            };
            HE.prototype.getVertexPointer = function () {
                return k(rm(this.bB), m)
            };
            HE.prototype.__destroy__ = function () {
                sm(this.bB)
            };

            function IE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = void 0 === a ? tm() : um(a);
                h(IE)[this.bB] = this
            }

            IE.prototype = Object.create(l.prototype);
            IE.prototype.constructor = IE;
            IE.prototype.cB = IE;
            IE.dB = {};
            b.btCompoundShape = IE;
            IE.prototype.addChildShape = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                wm(d, a, c)
            };
            IE.prototype.removeChildShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xm(c, a)
            };
            IE.prototype.removeChildShapeByIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ym(c, a)
            };
            IE.prototype.getNumChildShapes = function () {
                return zm(this.bB)
            };
            IE.prototype.getChildShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Am(c, a), l)
            };
            IE.prototype.updateChildTransform = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === d ? Bm(e, a, c) : Cm(e, a, c, d)
            };
            IE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dm(c, a)
            };
            IE.prototype.getMargin = function () {
                return Em(this.bB)
            };
            IE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fm(c, a)
            };
            IE.prototype.getLocalScaling = function () {
                return k(Gm(this.bB), m)
            };
            IE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Hm(d, a, c)
            };
            IE.prototype.__destroy__ = function () {
                Im(this.bB)
            };

            function JE() {
                throw"cannot construct a btIndexedMesh, no constructor in IDL";
            }

            JE.prototype = Object.create(f.prototype);
            JE.prototype.constructor = JE;
            JE.prototype.cB = JE;
            JE.dB = {};
            b.btIndexedMesh = JE;
            JE.prototype.get_m_numTriangles = JE.prototype.MD = function () {
                return Jm(this.bB)
            };
            JE.prototype.set_m_numTriangles = JE.prototype.DG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Km(c, a)
            };
            Object.defineProperty(JE.prototype, "m_numTriangles", {get: JE.prototype.MD, set: JE.prototype.DG});
            JE.prototype.__destroy__ = function () {
                Lm(this.bB)
            };

            function KE() {
                throw"cannot construct a btIndexedMeshArray, no constructor in IDL";
            }

            KE.prototype = Object.create(f.prototype);
            KE.prototype.constructor = KE;
            KE.prototype.cB = KE;
            KE.dB = {};
            b.btIndexedMeshArray = KE;
            KE.prototype.size = KE.prototype.size = function () {
                return Mm(this.bB)
            };
            KE.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Nm(c, a), JE)
            };
            KE.prototype.__destroy__ = function () {
                Om(this.bB)
            };

            function LE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = void 0 === a ? Pm() : void 0 === c ? Qm(a) : Rm(a, c);
                h(LE)[this.bB] = this
            }

            LE.prototype = Object.create($D.prototype);
            LE.prototype.constructor = LE;
            LE.prototype.cB = LE;
            LE.dB = {};
            b.btTriangleMesh = LE;
            LE.prototype.addTriangle = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                void 0 === e ? Sm(g, a, c, d) : Tm(g, a, c, d, e)
            };
            LE.prototype.findOrAddVertex = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return Um(d, a, c)
            };
            LE.prototype.addIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Vm(c, a)
            };
            LE.prototype.getIndexedMeshArray = function () {
                return k(Wm(this.bB), KE)
            };
            LE.prototype.setScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Xm(c, a)
            };
            LE.prototype.__destroy__ = function () {
                Ym(this.bB)
            };

            function ME() {
                this.bB = Zm();
                h(ME)[this.bB] = this
            }

            ME.prototype = Object.create(PD.prototype);
            ME.prototype.constructor = ME;
            ME.prototype.cB = ME;
            ME.dB = {};
            b.btEmptyShape = ME;
            ME.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $m(c, a)
            };
            ME.prototype.getLocalScaling = function () {
                return k(an(this.bB), m)
            };
            ME.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                bn(d, a, c)
            };
            ME.prototype.__destroy__ = function () {
                cn(this.bB)
            };

            function NE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = dn(a, c);
                h(NE)[this.bB] = this
            }

            NE.prototype = Object.create(PD.prototype);
            NE.prototype.constructor = NE;
            NE.prototype.cB = NE;
            NE.dB = {};
            b.btStaticPlaneShape = NE;
            NE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                en(c, a)
            };
            NE.prototype.getLocalScaling = function () {
                return k(fn(this.bB), m)
            };
            NE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                gn(d, a, c)
            };
            NE.prototype.__destroy__ = function () {
                hn(this.bB)
            };

            function OE(a, c, d) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                this.bB = void 0 === d ? jn(a, c) : kn(a, c, d);
                h(OE)[this.bB] = this
            }

            OE.prototype = Object.create(aE.prototype);
            OE.prototype.constructor = OE;
            OE.prototype.cB = OE;
            OE.dB = {};
            b.btBvhTriangleMeshShape = OE;
            OE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ln(c, a)
            };
            OE.prototype.getLocalScaling = function () {
                return k(mn(this.bB), m)
            };
            OE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                nn(d, a, c)
            };
            OE.prototype.__destroy__ = function () {
                on(this.bB)
            };

            function PE(a, c, d, e, g, n, D, T, Da) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                T && "object" === typeof T && (T = T.bB);
                Da && "object" === typeof Da && (Da = Da.bB);
                this.bB = pn(a, c, d, e, g, n, D, T, Da);
                h(PE)[this.bB] = this
            }

            PE.prototype = Object.create(PD.prototype);
            PE.prototype.constructor = PE;
            PE.prototype.cB = PE;
            PE.dB = {};
            b.btHeightfieldTerrainShape = PE;
            PE.prototype.setMargin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qn(c, a)
            };
            PE.prototype.getMargin = function () {
                return rn(this.bB)
            };
            PE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sn(c, a)
            };
            PE.prototype.getLocalScaling = function () {
                return k(tn(this.bB), m)
            };
            PE.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                un(d, a, c)
            };
            PE.prototype.__destroy__ = function () {
                vn(this.bB)
            };

            function QE(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = wn(a, c, d, e);
                h(QE)[this.bB] = this
            }

            QE.prototype = Object.create(f.prototype);
            QE.prototype.constructor = QE;
            QE.prototype.cB = QE;
            QE.dB = {};
            b.btAABB = QE;
            QE.prototype.invalidate = function () {
                xn(this.bB)
            };
            QE.prototype.increment_margin = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yn(c, a)
            };
            QE.prototype.copy_with_margin = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                zn(d, a, c)
            };
            QE.prototype.__destroy__ = function () {
                An(this.bB)
            };

            function RE() {
                this.bB = Bn();
                h(RE)[this.bB] = this
            }

            RE.prototype = Object.create(f.prototype);
            RE.prototype.constructor = RE;
            RE.prototype.cB = RE;
            RE.dB = {};
            b.btPrimitiveTriangle = RE;
            RE.prototype.__destroy__ = function () {
                Cn(this.bB)
            };

            function SE(a, c, d) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                this.bB = Dn(a, c, d);
                h(SE)[this.bB] = this
            }

            SE.prototype = Object.create(f.prototype);
            SE.prototype.constructor = SE;
            SE.prototype.cB = SE;
            SE.dB = {};
            b.btTriangleShapeEx = SE;
            SE.prototype.getAabb = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                En(e, a, c, d)
            };
            SE.prototype.applyTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fn(c, a)
            };
            SE.prototype.buildTriPlane = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gn(c, a)
            };
            SE.prototype.__destroy__ = function () {
                Hn(this.bB)
            };

            function TE() {
                this.bB = In();
                h(TE)[this.bB] = this
            }

            TE.prototype = Object.create(f.prototype);
            TE.prototype.constructor = TE;
            TE.prototype.cB = TE;
            TE.dB = {};
            b.btTetrahedronShapeEx = TE;
            TE.prototype.setVertices = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                Jn(g, a, c, d, e)
            };
            TE.prototype.__destroy__ = function () {
                Kn(this.bB)
            };

            function UE() {
                throw"cannot construct a CompoundPrimitiveManager, no constructor in IDL";
            }

            UE.prototype = Object.create(bE.prototype);
            UE.prototype.constructor = UE;
            UE.prototype.cB = UE;
            UE.dB = {};
            b.CompoundPrimitiveManager = UE;
            UE.prototype.get_primitive_count = function () {
                return Ln(this.bB)
            };
            UE.prototype.get_primitive_box = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Mn(d, a, c)
            };
            UE.prototype.get_primitive_triangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Nn(d, a, c)
            };
            UE.prototype.is_trimesh = function () {
                return !!On(this.bB)
            };
            UE.prototype.get_m_compoundShape = UE.prototype.NC = function () {
                return k(Pn(this.bB), H)
            };
            UE.prototype.set_m_compoundShape = UE.prototype.EF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qn(c, a)
            };
            Object.defineProperty(UE.prototype, "m_compoundShape", {get: UE.prototype.NC, set: UE.prototype.EF});
            UE.prototype.__destroy__ = function () {
                Rn(this.bB)
            };

            function H(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = void 0 === a ? Sn() : Tn(a);
                h(H)[this.bB] = this
            }

            H.prototype = Object.create(w.prototype);
            H.prototype.constructor = H;
            H.prototype.cB = H;
            H.dB = {};
            b.btGImpactCompoundShape = H;
            H.prototype.childrenHasTransform = function () {
                return !!Un(this.bB)
            };
            H.prototype.getPrimitiveManager = function () {
                return k(Vn(this.bB), bE)
            };
            H.prototype.getCompoundPrimitiveManager = function () {
                return k(Wn(this.bB), UE)
            };
            H.prototype.getNumChildShapes = function () {
                return Xn(this.bB)
            };
            H.prototype.addChildShape = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Yn(d, a, c)
            };
            H.prototype.getChildShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Zn(c, a), l)
            };
            H.prototype.getChildAabb = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                $n(g, a, c, d, e)
            };
            H.prototype.getChildTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(ao(c, a), r)
            };
            H.prototype.setChildTransform = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                bo(d, a, c)
            };
            H.prototype.calculateLocalInertia = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                co(d, a, c)
            };
            H.prototype.getName = function () {
                return ua(eo(this.bB))
            };
            H.prototype.getGImpactShapeType = function () {
                return fo(this.bB)
            };
            H.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                go(c, a)
            };
            H.prototype.getLocalScaling = function () {
                return k(ho(this.bB), m)
            };
            H.prototype.updateBound = function () {
                io(this.bB)
            };
            H.prototype.postUpdate = function () {
                jo(this.bB)
            };
            H.prototype.getShapeType = function () {
                return ko(this.bB)
            };
            H.prototype.needsRetrieveTriangles = function () {
                return !!lo(this.bB)
            };
            H.prototype.needsRetrieveTetrahedrons = function () {
                return !!mo(this.bB)
            };
            H.prototype.getBulletTriangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                no(d, a, c)
            };
            H.prototype.getBulletTetrahedron = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                oo(d, a, c)
            };
            H.prototype.__destroy__ = function () {
                po(this.bB)
            };

            function I(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = void 0 === a ? qo() : ro(a);
                h(I)[this.bB] = this
            }

            I.prototype = Object.create(bE.prototype);
            I.prototype.constructor = I;
            I.prototype.cB = I;
            I.dB = {};
            b.TrimeshPrimitiveManager = I;
            I.prototype.lock = I.prototype.lock = function () {
                so(this.bB)
            };
            I.prototype.unlock = I.prototype.unlock = function () {
                to(this.bB)
            };
            I.prototype.is_trimesh = function () {
                return !!uo(this.bB)
            };
            I.prototype.get_vertex_count = function () {
                return vo(this.bB)
            };
            I.prototype.get_indices = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                wo(g, a, c, d, e)
            };
            I.prototype.get_vertex = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                xo(d, a, c)
            };
            I.prototype.get_bullet_triangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                yo(d, a, c)
            };
            I.prototype.get_m_margin = I.prototype.DD = function () {
                return zo(this.bB)
            };
            I.prototype.set_m_margin = I.prototype.uG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ao(c, a)
            };
            Object.defineProperty(I.prototype, "m_margin", {get: I.prototype.DD, set: I.prototype.uG});
            I.prototype.get_m_meshInterface = I.prototype.GD = function () {
                return k(Bo(this.bB), $D)
            };
            I.prototype.set_m_meshInterface = I.prototype.xG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Co(c, a)
            };
            Object.defineProperty(I.prototype, "m_meshInterface", {get: I.prototype.GD, set: I.prototype.xG});
            I.prototype.get_m_part = I.prototype.ND = function () {
                return Do(this.bB)
            };
            I.prototype.set_m_part = I.prototype.EG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Eo(c, a)
            };
            Object.defineProperty(I.prototype, "m_part", {get: I.prototype.ND, set: I.prototype.EG});
            I.prototype.get_m_lock_count = I.prototype.BD = function () {
                return Fo(this.bB)
            };
            I.prototype.set_m_lock_count = I.prototype.sG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Go(c, a)
            };
            Object.defineProperty(I.prototype, "m_lock_count", {get: I.prototype.BD, set: I.prototype.sG});
            I.prototype.get_numverts = I.prototype.DE = function () {
                return Ho(this.bB)
            };
            I.prototype.set_numverts = I.prototype.vH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Io(c, a)
            };
            Object.defineProperty(I.prototype, "numverts", {get: I.prototype.DE, set: I.prototype.vH});
            I.prototype.get_type = I.prototype.HE = function () {
                return Jo(this.bB)
            };
            I.prototype.set_type = I.prototype.zH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ko(c, a)
            };
            Object.defineProperty(I.prototype, "type", {get: I.prototype.HE, set: I.prototype.zH});
            I.prototype.get_stride = I.prototype.FE = function () {
                return Lo(this.bB)
            };
            I.prototype.set_stride = I.prototype.xH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mo(c, a)
            };
            Object.defineProperty(I.prototype, "stride", {get: I.prototype.FE, set: I.prototype.xH});
            I.prototype.get_indexstride = I.prototype.ZB = function () {
                return No(this.bB)
            };
            I.prototype.set_indexstride = I.prototype.QE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Oo(c, a)
            };
            Object.defineProperty(I.prototype, "indexstride", {get: I.prototype.ZB, set: I.prototype.QE});
            I.prototype.get_numfaces = I.prototype.CE = function () {
                return Po(this.bB)
            };
            I.prototype.set_numfaces = I.prototype.uH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qo(c, a)
            };
            Object.defineProperty(I.prototype, "numfaces", {get: I.prototype.CE, set: I.prototype.uH});
            I.prototype.get_indicestype = I.prototype.$B = function () {
                return Ro(this.bB)
            };
            I.prototype.set_indicestype = I.prototype.RE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                So(c, a)
            };
            Object.defineProperty(I.prototype, "indicestype", {get: I.prototype.$B, set: I.prototype.RE});
            I.prototype.__destroy__ = function () {
                To(this.bB)
            };

            function VE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = Uo(a, c);
                h(VE)[this.bB] = this
            }

            VE.prototype = Object.create(w.prototype);
            VE.prototype.constructor = VE;
            VE.prototype.cB = VE;
            VE.dB = {};
            b.btGImpactMeshShapePart = VE;
            VE.prototype.getTrimeshPrimitiveManager = function () {
                return k(Vo(this.bB), I)
            };
            VE.prototype.getVertexCount = function () {
                return Wo(this.bB)
            };
            VE.prototype.getVertex = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Xo(d, a, c)
            };
            VE.prototype.getPart = function () {
                return Yo(this.bB)
            };
            VE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Zo(c, a)
            };
            VE.prototype.getLocalScaling = function () {
                return k($o(this.bB), m)
            };
            VE.prototype.updateBound = function () {
                ap(this.bB)
            };
            VE.prototype.postUpdate = function () {
                bp(this.bB)
            };
            VE.prototype.getShapeType = function () {
                return cp(this.bB)
            };
            VE.prototype.needsRetrieveTriangles = function () {
                return !!dp(this.bB)
            };
            VE.prototype.needsRetrieveTetrahedrons = function () {
                return !!ep(this.bB)
            };
            VE.prototype.getBulletTriangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                fp(d, a, c)
            };
            VE.prototype.getBulletTetrahedron = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                gp(d, a, c)
            };
            VE.prototype.__destroy__ = function () {
                hp(this.bB)
            };

            function WE(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = ip(a);
                h(WE)[this.bB] = this
            }

            WE.prototype = Object.create(w.prototype);
            WE.prototype.constructor = WE;
            WE.prototype.cB = WE;
            WE.dB = {};
            b.btGImpactMeshShape = WE;
            WE.prototype.getMeshInterface = function () {
                return k(jp(this.bB), $D)
            };
            WE.prototype.getMeshPartCount = function () {
                return kp(this.bB)
            };
            WE.prototype.getMeshPart = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(lp(c, a), VE)
            };
            WE.prototype.calculateSerializeBufferSize = function () {
                return mp(this.bB)
            };
            WE.prototype.setLocalScaling = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                np(c, a)
            };
            WE.prototype.getLocalScaling = function () {
                return k(op(this.bB), m)
            };
            WE.prototype.updateBound = function () {
                pp(this.bB)
            };
            WE.prototype.postUpdate = function () {
                qp(this.bB)
            };
            WE.prototype.getShapeType = function () {
                return rp(this.bB)
            };
            WE.prototype.needsRetrieveTriangles = function () {
                return !!sp(this.bB)
            };
            WE.prototype.needsRetrieveTetrahedrons = function () {
                return !!tp(this.bB)
            };
            WE.prototype.getBulletTriangle = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                up(d, a, c)
            };
            WE.prototype.getBulletTetrahedron = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                vp(d, a, c)
            };
            WE.prototype.__destroy__ = function () {
                wp(this.bB)
            };

            function XE(a, c) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                this.bB = void 0 === a ? xp() : void 0 === c ? _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_1(a) : yp(a, c);
                h(XE)[this.bB] = this
            }

            XE.prototype = Object.create(f.prototype);
            XE.prototype.constructor = XE;
            XE.prototype.cB = XE;
            XE.dB = {};
            b.btCollisionAlgorithmConstructionInfo = XE;
            XE.prototype.get_m_dispatcher1 = XE.prototype.XC = function () {
                return k(zp(this.bB), JD)
            };
            XE.prototype.set_m_dispatcher1 = XE.prototype.OF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ap(c, a)
            };
            Object.defineProperty(XE.prototype, "m_dispatcher1", {get: XE.prototype.XC, set: XE.prototype.OF});
            XE.prototype.get_m_manifold = XE.prototype.CD = function () {
                return k(Bp(this.bB), eE)
            };
            XE.prototype.set_m_manifold = XE.prototype.tG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Cp(c, a)
            };
            Object.defineProperty(XE.prototype, "m_manifold", {get: XE.prototype.CD, set: XE.prototype.tG});
            XE.prototype.__destroy__ = function () {
                Dp(this.bB)
            };

            function YE(a, c, d) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                this.bB = Ep(a, c, d);
                h(YE)[this.bB] = this
            }

            YE.prototype = Object.create(cE.prototype);
            YE.prototype.constructor = YE;
            YE.prototype.cB = YE;
            YE.dB = {};
            b.btGImpactCollisionAlgorithm = YE;
            YE.prototype.registerAlgorithm = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fp(c, a)
            };
            YE.prototype.__destroy__ = function () {
                Gp(this.bB)
            };

            function ZE() {
                this.bB = Hp();
                h(ZE)[this.bB] = this
            }

            ZE.prototype = Object.create(f.prototype);
            ZE.prototype.constructor = ZE;
            ZE.prototype.cB = ZE;
            ZE.dB = {};
            b.btDefaultCollisionConstructionInfo = ZE;
            ZE.prototype.__destroy__ = function () {
                Ip(this.bB)
            };

            function eE() {
                this.bB = Jp();
                h(eE)[this.bB] = this
            }

            eE.prototype = Object.create(f.prototype);
            eE.prototype.constructor = eE;
            eE.prototype.cB = eE;
            eE.dB = {};
            b.btPersistentManifold = eE;
            eE.prototype.getBody0 = function () {
                return k(Kp(this.bB), q)
            };
            eE.prototype.getBody1 = function () {
                return k(Lp(this.bB), q)
            };
            eE.prototype.getNumContacts = function () {
                return Mp(this.bB)
            };
            eE.prototype.getContactPoint = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Np(c, a), E)
            };
            eE.prototype.__destroy__ = function () {
                Op(this.bB)
            };

            function $E(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = Pp(a);
                h($E)[this.bB] = this
            }

            $E.prototype = Object.create(JD.prototype);
            $E.prototype.constructor = $E;
            $E.prototype.cB = $E;
            $E.dB = {};
            b.btCollisionDispatcher = $E;
            $E.prototype.getNumManifolds = function () {
                return Qp(this.bB)
            };
            $E.prototype.getManifoldByIndexInternal = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Rp(c, a), eE)
            };
            $E.prototype.__destroy__ = function () {
                Sp(this.bB)
            };

            function aF() {
                throw"cannot construct a btOverlappingPairCallback, no constructor in IDL";
            }

            aF.prototype = Object.create(f.prototype);
            aF.prototype.constructor = aF;
            aF.prototype.cB = aF;
            aF.dB = {};
            b.btOverlappingPairCallback = aF;
            aF.prototype.__destroy__ = function () {
                Tp(this.bB)
            };

            function KD() {
                throw"cannot construct a btOverlappingPairCache, no constructor in IDL";
            }

            KD.prototype = Object.create(f.prototype);
            KD.prototype.constructor = KD;
            KD.prototype.cB = KD;
            KD.dB = {};
            b.btOverlappingPairCache = KD;
            KD.prototype.setInternalGhostPairCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Up(c, a)
            };
            KD.prototype.getNumOverlappingPairs = function () {
                return Vp(this.bB)
            };
            KD.prototype.__destroy__ = function () {
                Wp(this.bB)
            };

            function bF(a, c, d, e, g) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                this.bB = void 0 === d ? Xp(a, c) : void 0 === e ? Yp(a, c, d) : void 0 === g ? Zp(a, c, d, e) : $p(a, c, d, e, g);
                h(bF)[this.bB] = this
            }

            bF.prototype = Object.create(f.prototype);
            bF.prototype.constructor = bF;
            bF.prototype.cB = bF;
            bF.dB = {};
            b.btAxisSweep3 = bF;
            bF.prototype.__destroy__ = function () {
                aq(this.bB)
            };

            function LD() {
                throw"cannot construct a btBroadphaseInterface, no constructor in IDL";
            }

            LD.prototype = Object.create(f.prototype);
            LD.prototype.constructor = LD;
            LD.prototype.cB = LD;
            LD.dB = {};
            b.btBroadphaseInterface = LD;
            LD.prototype.getOverlappingPairCache = function () {
                return k(bq(this.bB), KD)
            };
            LD.prototype.__destroy__ = function () {
                cq(this.bB)
            };

            function cF() {
                throw"cannot construct a btCollisionConfiguration, no constructor in IDL";
            }

            cF.prototype = Object.create(f.prototype);
            cF.prototype.constructor = cF;
            cF.prototype.cB = cF;
            cF.dB = {};
            b.btCollisionConfiguration = cF;
            cF.prototype.__destroy__ = function () {
                dq(this.bB)
            };

            function dF() {
                this.bB = eq();
                h(dF)[this.bB] = this
            }

            dF.prototype = Object.create(f.prototype);
            dF.prototype.constructor = dF;
            dF.prototype.cB = dF;
            dF.dB = {};
            b.btDbvtBroadphase = dF;
            dF.prototype.__destroy__ = function () {
                fq(this.bB)
            };

            function OD() {
                throw"cannot construct a btBroadphaseProxy, no constructor in IDL";
            }

            OD.prototype = Object.create(f.prototype);
            OD.prototype.constructor = OD;
            OD.prototype.cB = OD;
            OD.dB = {};
            b.btBroadphaseProxy = OD;
            OD.prototype.get_m_collisionFilterGroup = OD.prototype.eB = function () {
                return gq(this.bB)
            };
            OD.prototype.set_m_collisionFilterGroup = OD.prototype.gB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hq(c, a)
            };
            Object.defineProperty(OD.prototype, "m_collisionFilterGroup", {get: OD.prototype.eB, set: OD.prototype.gB});
            OD.prototype.get_m_collisionFilterMask = OD.prototype.fB = function () {
                return iq(this.bB)
            };
            OD.prototype.set_m_collisionFilterMask = OD.prototype.hB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jq(c, a)
            };
            Object.defineProperty(OD.prototype, "m_collisionFilterMask", {get: OD.prototype.fB, set: OD.prototype.hB});
            OD.prototype.__destroy__ = function () {
                kq(this.bB)
            };

            function J(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = void 0 === e ? lq(a, c, d) : mq(a, c, d, e);
                h(J)[this.bB] = this
            }

            J.prototype = Object.create(f.prototype);
            J.prototype.constructor = J;
            J.prototype.cB = J;
            J.dB = {};
            b.btRigidBodyConstructionInfo = J;
            J.prototype.get_m_linearDamping = J.prototype.vD = function () {
                return nq(this.bB)
            };
            J.prototype.set_m_linearDamping = J.prototype.mG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                oq(c, a)
            };
            Object.defineProperty(J.prototype, "m_linearDamping", {get: J.prototype.vD, set: J.prototype.mG});
            J.prototype.get_m_angularDamping = J.prototype.zC = function () {
                return pq(this.bB)
            };
            J.prototype.set_m_angularDamping = J.prototype.qF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qq(c, a)
            };
            Object.defineProperty(J.prototype, "m_angularDamping", {get: J.prototype.zC, set: J.prototype.qF});
            J.prototype.get_m_friction = J.prototype.cD = function () {
                return rq(this.bB)
            };
            J.prototype.set_m_friction = J.prototype.UF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sq(c, a)
            };
            Object.defineProperty(J.prototype, "m_friction", {get: J.prototype.cD, set: J.prototype.UF});
            J.prototype.get_m_rollingFriction = J.prototype.WD = function () {
                return tq(this.bB)
            };
            J.prototype.set_m_rollingFriction = J.prototype.NG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                uq(c, a)
            };
            Object.defineProperty(J.prototype, "m_rollingFriction", {get: J.prototype.WD, set: J.prototype.NG});
            J.prototype.get_m_restitution = J.prototype.UD = function () {
                return vq(this.bB)
            };
            J.prototype.set_m_restitution = J.prototype.LG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wq(c, a)
            };
            Object.defineProperty(J.prototype, "m_restitution", {get: J.prototype.UD, set: J.prototype.LG});
            J.prototype.get_m_linearSleepingThreshold = J.prototype.wD = function () {
                return xq(this.bB)
            };
            J.prototype.set_m_linearSleepingThreshold = J.prototype.nG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yq(c, a)
            };
            Object.defineProperty(J.prototype, "m_linearSleepingThreshold", {get: J.prototype.wD, set: J.prototype.nG});
            J.prototype.get_m_angularSleepingThreshold = J.prototype.AC = function () {
                return zq(this.bB)
            };
            J.prototype.set_m_angularSleepingThreshold = J.prototype.rF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Aq(c, a)
            };
            Object.defineProperty(J.prototype, "m_angularSleepingThreshold", {
                get: J.prototype.AC,
                set: J.prototype.rF
            });
            J.prototype.get_m_additionalDamping = J.prototype.uC = function () {
                return !!Bq(this.bB)
            };
            J.prototype.set_m_additionalDamping = J.prototype.lF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Cq(c, a)
            };
            Object.defineProperty(J.prototype, "m_additionalDamping", {get: J.prototype.uC, set: J.prototype.lF});
            J.prototype.get_m_additionalDampingFactor = J.prototype.vC = function () {
                return Dq(this.bB)
            };
            J.prototype.set_m_additionalDampingFactor = J.prototype.mF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Eq(c, a)
            };
            Object.defineProperty(J.prototype, "m_additionalDampingFactor", {get: J.prototype.vC, set: J.prototype.mF});
            J.prototype.get_m_additionalLinearDampingThresholdSqr = J.prototype.wC = function () {
                return Fq(this.bB)
            };
            J.prototype.set_m_additionalLinearDampingThresholdSqr = J.prototype.nF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gq(c, a)
            };
            Object.defineProperty(J.prototype, "m_additionalLinearDampingThresholdSqr", {
                get: J.prototype.wC,
                set: J.prototype.nF
            });
            J.prototype.get_m_additionalAngularDampingThresholdSqr = J.prototype.tC = function () {
                return Hq(this.bB)
            };
            J.prototype.set_m_additionalAngularDampingThresholdSqr = J.prototype.kF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Iq(c, a)
            };
            Object.defineProperty(J.prototype, "m_additionalAngularDampingThresholdSqr", {
                get: J.prototype.tC,
                set: J.prototype.kF
            });
            J.prototype.get_m_additionalAngularDampingFactor = J.prototype.sC = function () {
                return Jq(this.bB)
            };
            J.prototype.set_m_additionalAngularDampingFactor = J.prototype.jF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Kq(c, a)
            };
            Object.defineProperty(J.prototype, "m_additionalAngularDampingFactor", {
                get: J.prototype.sC,
                set: J.prototype.jF
            });
            J.prototype.__destroy__ = function () {
                Lq(this.bB)
            };

            function K(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = Mq(a);
                h(K)[this.bB] = this
            }

            K.prototype = Object.create(q.prototype);
            K.prototype.constructor = K;
            K.prototype.cB = K;
            K.dB = {};
            b.btRigidBody = K;
            K.prototype.getCenterOfMassTransform = function () {
                return k(Nq(this.bB), r)
            };
            K.prototype.setCenterOfMassTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Oq(c, a)
            };
            K.prototype.setSleepingThresholds = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Pq(d, a, c)
            };
            K.prototype.getLinearDamping = function () {
                return Qq(this.bB)
            };
            K.prototype.getAngularDamping = function () {
                return Rq(this.bB)
            };
            K.prototype.setDamping = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Sq(d, a, c)
            };
            K.prototype.setMassProps = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Tq(d, a, c)
            };
            K.prototype.getLinearFactor = function () {
                return k(Uq(this.bB), m)
            };
            K.prototype.setLinearFactor = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Vq(c, a)
            };
            K.prototype.applyTorque = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wq(c, a)
            };
            K.prototype.applyLocalTorque = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Xq(c, a)
            };
            K.prototype.applyForce = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Yq(d, a, c)
            };
            K.prototype.applyCentralForce = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Zq(c, a)
            };
            K.prototype.applyCentralLocalForce = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $q(c, a)
            };
            K.prototype.applyTorqueImpulse = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ar(c, a)
            };
            K.prototype.applyImpulse = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                br(d, a, c)
            };
            K.prototype.applyCentralImpulse = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                cr(c, a)
            };
            K.prototype.updateInertiaTensor = function () {
                dr(this.bB)
            };
            K.prototype.getLinearVelocity = function () {
                return k(er(this.bB), m)
            };
            K.prototype.getAngularVelocity = function () {
                return k(fr(this.bB), m)
            };
            K.prototype.setLinearVelocity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                gr(c, a)
            };
            K.prototype.setAngularVelocity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hr(c, a)
            };
            K.prototype.getMotionState = function () {
                return k(ir(this.bB), UD)
            };
            K.prototype.setMotionState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jr(c, a)
            };
            K.prototype.getAngularFactor = function () {
                return k(kr(this.bB), m)
            };
            K.prototype.setAngularFactor = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                lr(c, a)
            };
            K.prototype.upcast = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(mr(c, a), K)
            };
            K.prototype.getAabb = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                nr(d, a, c)
            };
            K.prototype.applyGravity = function () {
                or(this.bB)
            };
            K.prototype.getGravity = function () {
                return k(pr(this.bB), m)
            };
            K.prototype.setGravity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qr(c, a)
            };
            K.prototype.getBroadphaseProxy = function () {
                return k(rr(this.bB), OD)
            };
            K.prototype.clearForces = function () {
                sr(this.bB)
            };
            K.prototype.setAnisotropicFriction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                tr(d, a, c)
            };
            K.prototype.getCollisionShape = function () {
                return k(ur(this.bB), l)
            };
            K.prototype.setContactProcessingThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vr(c, a)
            };
            K.prototype.setActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wr(c, a)
            };
            K.prototype.forceActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xr(c, a)
            };
            K.prototype.activate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                void 0 === a ? yr(c) : zr(c, a)
            };
            K.prototype.isActive = function () {
                return !!Ar(this.bB)
            };
            K.prototype.isKinematicObject = function () {
                return !!Br(this.bB)
            };
            K.prototype.isStaticObject = function () {
                return !!Cr(this.bB)
            };
            K.prototype.isStaticOrKinematicObject = function () {
                return !!Dr(this.bB)
            };
            K.prototype.getRestitution = function () {
                return Er(this.bB)
            };
            K.prototype.getFriction = function () {
                return Fr(this.bB)
            };
            K.prototype.getRollingFriction = function () {
                return Gr(this.bB)
            };
            K.prototype.setRestitution = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hr(c, a)
            };
            K.prototype.setFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ir(c, a)
            };
            K.prototype.setRollingFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Jr(c, a)
            };
            K.prototype.getWorldTransform = function () {
                return k(Kr(this.bB), r)
            };
            K.prototype.getCollisionFlags = function () {
                return Lr(this.bB)
            };
            K.prototype.setCollisionFlags = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mr(c, a)
            };
            K.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Nr(c, a)
            };
            K.prototype.setCollisionShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Or(c, a)
            };
            K.prototype.setCcdMotionThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Pr(c, a)
            };
            K.prototype.setCcdSweptSphereRadius = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qr(c, a)
            };
            K.prototype.getUserIndex = function () {
                return Rr(this.bB)
            };
            K.prototype.setUserIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Sr(c, a)
            };
            K.prototype.getUserPointer = function () {
                return k(Tr(this.bB), ND)
            };
            K.prototype.setUserPointer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ur(c, a)
            };
            K.prototype.getBroadphaseHandle = function () {
                return k(Vr(this.bB), OD)
            };
            K.prototype.__destroy__ = function () {
                Wr(this.bB)
            };

            function L() {
                this.bB = Xr();
                h(L)[this.bB] = this
            }

            L.prototype = Object.create(f.prototype);
            L.prototype.constructor = L;
            L.prototype.cB = L;
            L.dB = {};
            b.btConstraintSetting = L;
            L.prototype.get_m_tau = L.prototype.kE = function () {
                return Yr(this.bB)
            };
            L.prototype.set_m_tau = L.prototype.cH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Zr(c, a)
            };
            Object.defineProperty(L.prototype, "m_tau", {get: L.prototype.kE, set: L.prototype.cH});
            L.prototype.get_m_damping = L.prototype.TC = function () {
                return $r(this.bB)
            };
            L.prototype.set_m_damping = L.prototype.KF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                as(c, a)
            };
            Object.defineProperty(L.prototype, "m_damping", {get: L.prototype.TC, set: L.prototype.KF});
            L.prototype.get_m_impulseClamp = L.prototype.oD = function () {
                return bs(this.bB)
            };
            L.prototype.set_m_impulseClamp = L.prototype.fG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                cs(c, a)
            };
            Object.defineProperty(L.prototype, "m_impulseClamp", {get: L.prototype.oD, set: L.prototype.fG});
            L.prototype.__destroy__ = function () {
                ds(this.bB)
            };

            function eF(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = void 0 === d ? es(a, c) : void 0 === e ? _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(a, c, d) : gs(a, c, d, e);
                h(eF)[this.bB] = this
            }

            eF.prototype = Object.create(RD.prototype);
            eF.prototype.constructor = eF;
            eF.prototype.cB = eF;
            eF.dB = {};
            b.btPoint2PointConstraint = eF;
            eF.prototype.setPivotA = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hs(c, a)
            };
            eF.prototype.setPivotB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                is(c, a)
            };
            eF.prototype.getPivotInA = function () {
                return k(js(this.bB), m)
            };
            eF.prototype.getPivotInB = function () {
                return k(ks(this.bB), m)
            };
            eF.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ls(c, a)
            };
            eF.prototype.getBreakingImpulseThreshold = function () {
                return ms(this.bB)
            };
            eF.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ns(c, a)
            };
            eF.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return ps(d, a, c)
            };
            eF.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                qs(e, a, c, d)
            };
            eF.prototype.get_m_setting = eF.prototype.YD = function () {
                return k(rs(this.bB), L)
            };
            eF.prototype.set_m_setting = eF.prototype.PG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ss(c, a)
            };
            Object.defineProperty(eF.prototype, "m_setting", {get: eF.prototype.YD, set: eF.prototype.PG});
            eF.prototype.__destroy__ = function () {
                ts(this.bB)
            };

            function fF(a, c, d, e, g) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                this.bB = void 0 === e ? us(a, c, d) : void 0 === g ? _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_4(a, c, d, e) : vs(a, c, d, e, g);
                h(fF)[this.bB] = this
            }

            fF.prototype = Object.create(fE.prototype);
            fF.prototype.constructor = fF;
            fF.prototype.cB = fF;
            fF.dB = {};
            b.btGeneric6DofSpringConstraint = fF;
            fF.prototype.enableSpring = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                xs(d, a, c)
            };
            fF.prototype.setStiffness = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                ys(d, a, c)
            };
            fF.prototype.setDamping = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                zs(d, a, c)
            };
            fF.prototype.setEquilibriumPoint = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                void 0 === a ? As(d) : void 0 === c ? Bs(d, a) : Cs(d, a, c)
            };
            fF.prototype.setLinearLowerLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ds(c, a)
            };
            fF.prototype.setLinearUpperLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Es(c, a)
            };
            fF.prototype.setAngularLowerLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fs(c, a)
            };
            fF.prototype.setAngularUpperLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gs(c, a)
            };
            fF.prototype.getFrameOffsetA = function () {
                return k(Hs(this.bB), r)
            };
            fF.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Is(c, a)
            };
            fF.prototype.getBreakingImpulseThreshold = function () {
                return Js(this.bB)
            };
            fF.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ks(c, a)
            };
            fF.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return Ls(d, a, c)
            };
            fF.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Ms(e, a, c, d)
            };
            fF.prototype.__destroy__ = function () {
                Ns(this.bB)
            };

            function gF() {
                this.bB = Os();
                h(gF)[this.bB] = this
            }

            gF.prototype = Object.create(f.prototype);
            gF.prototype.constructor = gF;
            gF.prototype.cB = gF;
            gF.dB = {};
            b.btSequentialImpulseConstraintSolver = gF;
            gF.prototype.__destroy__ = function () {
                Ps(this.bB)
            };

            function hF(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = void 0 === d ? Qs(a, c) : void 0 === e ? _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_3(a, c, d) : Rs(a, c, d, e);
                h(hF)[this.bB] = this
            }

            hF.prototype = Object.create(RD.prototype);
            hF.prototype.constructor = hF;
            hF.prototype.cB = hF;
            hF.dB = {};
            b.btConeTwistConstraint = hF;
            hF.prototype.setLimit = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Ss(d, a, c)
            };
            hF.prototype.setAngularOnly = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ts(c, a)
            };
            hF.prototype.setDamping = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Us(c, a)
            };
            hF.prototype.enableMotor = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Vs(c, a)
            };
            hF.prototype.setMaxMotorImpulse = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ws(c, a)
            };
            hF.prototype.setMaxMotorImpulseNormalized = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Xs(c, a)
            };
            hF.prototype.setMotorTarget = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ys(c, a)
            };
            hF.prototype.setMotorTargetInConstraintSpace = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Zs(c, a)
            };
            hF.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $s(c, a)
            };
            hF.prototype.getBreakingImpulseThreshold = function () {
                return at(this.bB)
            };
            hF.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bt(c, a)
            };
            hF.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return ct(d, a, c)
            };
            hF.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                dt(e, a, c, d)
            };
            hF.prototype.__destroy__ = function () {
                et(this.bB)
            };

            function iF(a, c, d, e, g, n, D) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                this.bB = void 0 === d ? ft(a, c) : void 0 === e ? gt(a, c, d) : void 0 === g ? ht(a, c, d, e) : void 0 === n ? it(a, c, d, e, g) : void 0 === D ? jt(a, c, d, e, g, n) : kt(a, c, d, e, g, n, D);
                h(iF)[this.bB] = this
            }

            iF.prototype = Object.create(RD.prototype);
            iF.prototype.constructor = iF;
            iF.prototype.cB = iF;
            iF.dB = {};
            b.btHingeConstraint = iF;
            iF.prototype.setLimit = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                void 0 === g ? lt(n, a, c, d, e) : mt(n, a, c, d, e, g)
            };
            iF.prototype.enableAngularMotor = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                nt(e, a, c, d)
            };
            iF.prototype.setAngularOnly = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ot(c, a)
            };
            iF.prototype.enableMotor = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pt(c, a)
            };
            iF.prototype.setMaxMotorImpulse = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qt(c, a)
            };
            iF.prototype.setMotorTarget = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                rt(d, a, c)
            };
            iF.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                st(c, a)
            };
            iF.prototype.getBreakingImpulseThreshold = function () {
                return tt(this.bB)
            };
            iF.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ut(c, a)
            };
            iF.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return vt(d, a, c)
            };
            iF.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                wt(e, a, c, d)
            };
            iF.prototype.__destroy__ = function () {
                xt(this.bB)
            };

            function jF(a, c, d, e, g) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                this.bB = void 0 === e ? yt(a, c, d) : void 0 === g ? _emscripten_bind_btSliderConstraint_btSliderConstraint_4(a, c, d, e) : zt(a, c, d, e, g);
                h(jF)[this.bB] = this
            }

            jF.prototype = Object.create(RD.prototype);
            jF.prototype.constructor = jF;
            jF.prototype.cB = jF;
            jF.dB = {};
            b.btSliderConstraint = jF;
            jF.prototype.setLowerLinLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                At(c, a)
            };
            jF.prototype.setUpperLinLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Bt(c, a)
            };
            jF.prototype.setLowerAngLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ct(c, a)
            };
            jF.prototype.setUpperAngLimit = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dt(c, a)
            };
            jF.prototype.setPoweredLinMotor = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Et(c, a)
            };
            jF.prototype.setMaxLinMotorForce = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ft(c, a)
            };
            jF.prototype.setTargetLinMotorVelocity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gt(c, a)
            };
            jF.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ht(c, a)
            };
            jF.prototype.getBreakingImpulseThreshold = function () {
                return It(this.bB)
            };
            jF.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Jt(c, a)
            };
            jF.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return Kt(d, a, c)
            };
            jF.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Lt(e, a, c, d)
            };
            jF.prototype.__destroy__ = function () {
                Mt(this.bB)
            };

            function kF(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = Nt(a, c, d, e);
                h(kF)[this.bB] = this
            }

            kF.prototype = Object.create(RD.prototype);
            kF.prototype.constructor = kF;
            kF.prototype.cB = kF;
            kF.dB = {};
            b.btFixedConstraint = kF;
            kF.prototype.enableFeedback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ot(c, a)
            };
            kF.prototype.getBreakingImpulseThreshold = function () {
                return Pt(this.bB)
            };
            kF.prototype.setBreakingImpulseThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qt(c, a)
            };
            kF.prototype.getParam = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return Rt(d, a, c)
            };
            kF.prototype.setParam = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                St(e, a, c, d)
            };
            kF.prototype.__destroy__ = function () {
                Tt(this.bB)
            };

            function lF() {
                throw"cannot construct a btConstraintSolver, no constructor in IDL";
            }

            lF.prototype = Object.create(f.prototype);
            lF.prototype.constructor = lF;
            lF.prototype.cB = lF;
            lF.dB = {};
            b.btConstraintSolver = lF;
            lF.prototype.__destroy__ = function () {
                Ut(this.bB)
            };

            function p() {
                throw"cannot construct a btDispatcherInfo, no constructor in IDL";
            }

            p.prototype = Object.create(f.prototype);
            p.prototype.constructor = p;
            p.prototype.cB = p;
            p.dB = {};
            b.btDispatcherInfo = p;
            p.prototype.get_m_timeStep = p.prototype.mE = function () {
                return Vt(this.bB)
            };
            p.prototype.set_m_timeStep = p.prototype.eH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wt(c, a)
            };
            Object.defineProperty(p.prototype, "m_timeStep", {get: p.prototype.mE, set: p.prototype.eH});
            p.prototype.get_m_stepCount = p.prototype.dE = function () {
                return Xt(this.bB)
            };
            p.prototype.set_m_stepCount = p.prototype.WG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yt(c, a)
            };
            Object.defineProperty(p.prototype, "m_stepCount", {get: p.prototype.dE, set: p.prototype.WG});
            p.prototype.get_m_dispatchFunc = p.prototype.VC = function () {
                return Zt(this.bB)
            };
            p.prototype.set_m_dispatchFunc = p.prototype.MF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $t(c, a)
            };
            Object.defineProperty(p.prototype, "m_dispatchFunc", {get: p.prototype.VC, set: p.prototype.MF});
            p.prototype.get_m_timeOfImpact = p.prototype.lE = function () {
                return au(this.bB)
            };
            p.prototype.set_m_timeOfImpact = p.prototype.dH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bu(c, a)
            };
            Object.defineProperty(p.prototype, "m_timeOfImpact", {get: p.prototype.lE, set: p.prototype.dH});
            p.prototype.get_m_useContinuous = p.prototype.oE = function () {
                return !!cu(this.bB)
            };
            p.prototype.set_m_useContinuous = p.prototype.gH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                du(c, a)
            };
            Object.defineProperty(p.prototype, "m_useContinuous", {get: p.prototype.oE, set: p.prototype.gH});
            p.prototype.get_m_enableSatConvex = p.prototype.$C = function () {
                return !!eu(this.bB)
            };
            p.prototype.set_m_enableSatConvex = p.prototype.RF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fu(c, a)
            };
            Object.defineProperty(p.prototype, "m_enableSatConvex", {get: p.prototype.$C, set: p.prototype.RF});
            p.prototype.get_m_enableSPU = p.prototype.ZC = function () {
                return !!gu(this.bB)
            };
            p.prototype.set_m_enableSPU = p.prototype.QF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hu(c, a)
            };
            Object.defineProperty(p.prototype, "m_enableSPU", {get: p.prototype.ZC, set: p.prototype.QF});
            p.prototype.get_m_useEpa = p.prototype.qE = function () {
                return !!iu(this.bB)
            };
            p.prototype.set_m_useEpa = p.prototype.iH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ju(c, a)
            };
            Object.defineProperty(p.prototype, "m_useEpa", {get: p.prototype.qE, set: p.prototype.iH});
            p.prototype.get_m_allowedCcdPenetration = p.prototype.xC = function () {
                return ku(this.bB)
            };
            p.prototype.set_m_allowedCcdPenetration = p.prototype.oF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                lu(c, a)
            };
            Object.defineProperty(p.prototype, "m_allowedCcdPenetration", {get: p.prototype.xC, set: p.prototype.oF});
            p.prototype.get_m_useConvexConservativeDistanceUtil = p.prototype.pE = function () {
                return !!mu(this.bB)
            };
            p.prototype.set_m_useConvexConservativeDistanceUtil = p.prototype.hH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nu(c, a)
            };
            Object.defineProperty(p.prototype, "m_useConvexConservativeDistanceUtil", {
                get: p.prototype.pE,
                set: p.prototype.hH
            });
            p.prototype.get_m_convexConservativeDistanceThreshold = p.prototype.QC = function () {
                return ou(this.bB)
            };
            p.prototype.set_m_convexConservativeDistanceThreshold = p.prototype.HF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pu(c, a)
            };
            Object.defineProperty(p.prototype, "m_convexConservativeDistanceThreshold", {
                get: p.prototype.QC,
                set: p.prototype.HF
            });
            p.prototype.__destroy__ = function () {
                qu(this.bB)
            };

            function t() {
                throw"cannot construct a btContactSolverInfo, no constructor in IDL";
            }

            t.prototype = Object.create(f.prototype);
            t.prototype.constructor = t;
            t.prototype.cB = t;
            t.dB = {};
            b.btContactSolverInfo = t;
            t.prototype.get_m_splitImpulse = t.prototype.aE = function () {
                return !!ru(this.bB)
            };
            t.prototype.set_m_splitImpulse = t.prototype.TG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                su(c, a)
            };
            Object.defineProperty(t.prototype, "m_splitImpulse", {get: t.prototype.aE, set: t.prototype.TG});
            t.prototype.get_m_splitImpulsePenetrationThreshold = t.prototype.bE = function () {
                return tu(this.bB)
            };
            t.prototype.set_m_splitImpulsePenetrationThreshold = t.prototype.UG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                uu(c, a)
            };
            Object.defineProperty(t.prototype, "m_splitImpulsePenetrationThreshold", {
                get: t.prototype.bE,
                set: t.prototype.UG
            });
            t.prototype.get_m_numIterations = t.prototype.LD = function () {
                return vu(this.bB)
            };
            t.prototype.set_m_numIterations = t.prototype.CG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wu(c, a)
            };
            Object.defineProperty(t.prototype, "m_numIterations", {get: t.prototype.LD, set: t.prototype.CG});
            t.prototype.__destroy__ = function () {
                xu(this.bB)
            };

            function M() {
                this.bB = yu();
                h(M)[this.bB] = this
            }

            M.prototype = Object.create(f.prototype);
            M.prototype.constructor = M;
            M.prototype.cB = M;
            M.dB = {};
            b.btVehicleTuning = M;
            M.prototype.get_m_suspensionStiffness = M.prototype.sB = function () {
                return zu(this.bB)
            };
            M.prototype.set_m_suspensionStiffness = M.prototype.zB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Au(c, a)
            };
            Object.defineProperty(M.prototype, "m_suspensionStiffness", {get: M.prototype.sB, set: M.prototype.zB});
            M.prototype.get_m_suspensionCompression = M.prototype.eE = function () {
                return Bu(this.bB)
            };
            M.prototype.set_m_suspensionCompression = M.prototype.XG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Cu(c, a)
            };
            Object.defineProperty(M.prototype, "m_suspensionCompression", {get: M.prototype.eE, set: M.prototype.XG});
            M.prototype.get_m_suspensionDamping = M.prototype.fE = function () {
                return Du(this.bB)
            };
            M.prototype.set_m_suspensionDamping = M.prototype.YG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Eu(c, a)
            };
            Object.defineProperty(M.prototype, "m_suspensionDamping", {get: M.prototype.fE, set: M.prototype.YG});
            M.prototype.get_m_maxSuspensionTravelCm = M.prototype.rB = function () {
                return Fu(this.bB)
            };
            M.prototype.set_m_maxSuspensionTravelCm = M.prototype.yB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gu(c, a)
            };
            Object.defineProperty(M.prototype, "m_maxSuspensionTravelCm", {get: M.prototype.rB, set: M.prototype.yB});
            M.prototype.get_m_frictionSlip = M.prototype.nB = function () {
                return Hu(this.bB)
            };
            M.prototype.set_m_frictionSlip = M.prototype.uB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Iu(c, a)
            };
            Object.defineProperty(M.prototype, "m_frictionSlip", {get: M.prototype.nB, set: M.prototype.uB});
            M.prototype.get_m_maxSuspensionForce = M.prototype.qB = function () {
                return Ju(this.bB)
            };
            M.prototype.set_m_maxSuspensionForce = M.prototype.xB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ku(c, a)
            };
            Object.defineProperty(M.prototype, "m_maxSuspensionForce", {get: M.prototype.qB, set: M.prototype.xB});

            function mF() {
                throw"cannot construct a btVehicleRaycasterResult, no constructor in IDL";
            }

            mF.prototype = Object.create(f.prototype);
            mF.prototype.constructor = mF;
            mF.prototype.cB = mF;
            mF.dB = {};
            b.btVehicleRaycasterResult = mF;
            mF.prototype.get_m_hitPointInWorld = mF.prototype.lD = function () {
                return k(Lu(this.bB), m)
            };
            mF.prototype.set_m_hitPointInWorld = mF.prototype.cG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mu(c, a)
            };
            Object.defineProperty(mF.prototype, "m_hitPointInWorld", {get: mF.prototype.lD, set: mF.prototype.cG});
            mF.prototype.get_m_hitNormalInWorld = mF.prototype.jD = function () {
                return k(Nu(this.bB), m)
            };
            mF.prototype.set_m_hitNormalInWorld = mF.prototype.aG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ou(c, a)
            };
            Object.defineProperty(mF.prototype, "m_hitNormalInWorld", {get: mF.prototype.jD, set: mF.prototype.aG});
            mF.prototype.get_m_distFraction = mF.prototype.YC = function () {
                return Pu(this.bB)
            };
            mF.prototype.set_m_distFraction = mF.prototype.PF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qu(c, a)
            };
            Object.defineProperty(mF.prototype, "m_distFraction", {get: mF.prototype.YC, set: mF.prototype.PF});
            mF.prototype.__destroy__ = function () {
                Ru(this.bB)
            };

            function nF(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = Su(a);
                h(nF)[this.bB] = this
            }

            nF.prototype = Object.create(gE.prototype);
            nF.prototype.constructor = nF;
            nF.prototype.cB = nF;
            nF.dB = {};
            b.btDefaultVehicleRaycaster = nF;
            nF.prototype.castRay = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                Tu(e, a, c, d)
            };
            nF.prototype.__destroy__ = function () {
                Uu(this.bB)
            };

            function N() {
                throw"cannot construct a RaycastInfo, no constructor in IDL";
            }

            N.prototype = Object.create(f.prototype);
            N.prototype.constructor = N;
            N.prototype.cB = N;
            N.dB = {};
            b.RaycastInfo = N;
            N.prototype.get_m_contactNormalWS = N.prototype.OC = function () {
                return k(Vu(this.bB), m)
            };
            N.prototype.set_m_contactNormalWS = N.prototype.FF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wu(c, a)
            };
            Object.defineProperty(N.prototype, "m_contactNormalWS", {get: N.prototype.OC, set: N.prototype.FF});
            N.prototype.get_m_contactPointWS = N.prototype.PC = function () {
                return k(Xu(this.bB), m)
            };
            N.prototype.set_m_contactPointWS = N.prototype.GF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yu(c, a)
            };
            Object.defineProperty(N.prototype, "m_contactPointWS", {get: N.prototype.PC, set: N.prototype.GF});
            N.prototype.get_m_suspensionLength = N.prototype.gE = function () {
                return Zu(this.bB)
            };
            N.prototype.set_m_suspensionLength = N.prototype.ZG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $u(c, a)
            };
            Object.defineProperty(N.prototype, "m_suspensionLength", {get: N.prototype.gE, set: N.prototype.ZG});
            N.prototype.get_m_hardPointWS = N.prototype.gD = function () {
                return k(av(this.bB), m)
            };
            N.prototype.set_m_hardPointWS = N.prototype.YF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bv(c, a)
            };
            Object.defineProperty(N.prototype, "m_hardPointWS", {get: N.prototype.gD, set: N.prototype.YF});
            N.prototype.get_m_wheelDirectionWS = N.prototype.vE = function () {
                return k(cv(this.bB), m)
            };
            N.prototype.set_m_wheelDirectionWS = N.prototype.nH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                dv(c, a)
            };
            Object.defineProperty(N.prototype, "m_wheelDirectionWS", {get: N.prototype.vE, set: N.prototype.nH});
            N.prototype.get_m_wheelAxleWS = N.prototype.uE = function () {
                return k(ev(this.bB), m)
            };
            N.prototype.set_m_wheelAxleWS = N.prototype.mH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fv(c, a)
            };
            Object.defineProperty(N.prototype, "m_wheelAxleWS", {get: N.prototype.uE, set: N.prototype.mH});
            N.prototype.get_m_isInContact = N.prototype.rD = function () {
                return !!gv(this.bB)
            };
            N.prototype.set_m_isInContact = N.prototype.iG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hv(c, a)
            };
            Object.defineProperty(N.prototype, "m_isInContact", {get: N.prototype.rD, set: N.prototype.iG});
            N.prototype.get_m_groundObject = N.prototype.fD = function () {
                return iv(this.bB)
            };
            N.prototype.set_m_groundObject = N.prototype.XF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jv(c, a)
            };
            Object.defineProperty(N.prototype, "m_groundObject", {get: N.prototype.fD, set: N.prototype.XF});
            N.prototype.__destroy__ = function () {
                kv(this.bB)
            };

            function O() {
                throw"cannot construct a btWheelInfoConstructionInfo, no constructor in IDL";
            }

            O.prototype = Object.create(f.prototype);
            O.prototype.constructor = O;
            O.prototype.cB = O;
            O.dB = {};
            b.btWheelInfoConstructionInfo = O;
            O.prototype.get_m_chassisConnectionCS = O.prototype.JC = function () {
                return k(lv(this.bB), m)
            };
            O.prototype.set_m_chassisConnectionCS = O.prototype.AF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                mv(c, a)
            };
            Object.defineProperty(O.prototype, "m_chassisConnectionCS", {get: O.prototype.JC, set: O.prototype.AF});
            O.prototype.get_m_wheelDirectionCS = O.prototype.IB = function () {
                return k(nv(this.bB), m)
            };
            O.prototype.set_m_wheelDirectionCS = O.prototype.SB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ov(c, a)
            };
            Object.defineProperty(O.prototype, "m_wheelDirectionCS", {get: O.prototype.IB, set: O.prototype.SB});
            O.prototype.get_m_wheelAxleCS = O.prototype.HB = function () {
                return k(pv(this.bB), m)
            };
            O.prototype.set_m_wheelAxleCS = O.prototype.RB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                qv(c, a)
            };
            Object.defineProperty(O.prototype, "m_wheelAxleCS", {get: O.prototype.HB, set: O.prototype.RB});
            O.prototype.get_m_suspensionRestLength = O.prototype.iE = function () {
                return rv(this.bB)
            };
            O.prototype.set_m_suspensionRestLength = O.prototype.aH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sv(c, a)
            };
            Object.defineProperty(O.prototype, "m_suspensionRestLength", {get: O.prototype.iE, set: O.prototype.aH});
            O.prototype.get_m_maxSuspensionTravelCm = O.prototype.rB = function () {
                return tv(this.bB)
            };
            O.prototype.set_m_maxSuspensionTravelCm = O.prototype.yB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                uv(c, a)
            };
            Object.defineProperty(O.prototype, "m_maxSuspensionTravelCm", {get: O.prototype.rB, set: O.prototype.yB});
            O.prototype.get_m_wheelRadius = O.prototype.wE = function () {
                return vv(this.bB)
            };
            O.prototype.set_m_wheelRadius = O.prototype.oH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                wv(c, a)
            };
            Object.defineProperty(O.prototype, "m_wheelRadius", {get: O.prototype.wE, set: O.prototype.oH});
            O.prototype.get_m_suspensionStiffness = O.prototype.sB = function () {
                return xv(this.bB)
            };
            O.prototype.set_m_suspensionStiffness = O.prototype.zB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yv(c, a)
            };
            Object.defineProperty(O.prototype, "m_suspensionStiffness", {get: O.prototype.sB, set: O.prototype.zB});
            O.prototype.get_m_wheelsDampingCompression = O.prototype.JB = function () {
                return zv(this.bB)
            };
            O.prototype.set_m_wheelsDampingCompression = O.prototype.TB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Av(c, a)
            };
            Object.defineProperty(O.prototype, "m_wheelsDampingCompression", {
                get: O.prototype.JB,
                set: O.prototype.TB
            });
            O.prototype.get_m_wheelsDampingRelaxation = O.prototype.KB = function () {
                return Bv(this.bB)
            };
            O.prototype.set_m_wheelsDampingRelaxation = O.prototype.UB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Cv(c, a)
            };
            Object.defineProperty(O.prototype, "m_wheelsDampingRelaxation", {get: O.prototype.KB, set: O.prototype.UB});
            O.prototype.get_m_frictionSlip = O.prototype.nB = function () {
                return Dv(this.bB)
            };
            O.prototype.set_m_frictionSlip = O.prototype.uB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ev(c, a)
            };
            Object.defineProperty(O.prototype, "m_frictionSlip", {get: O.prototype.nB, set: O.prototype.uB});
            O.prototype.get_m_maxSuspensionForce = O.prototype.qB = function () {
                return Fv(this.bB)
            };
            O.prototype.set_m_maxSuspensionForce = O.prototype.xB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gv(c, a)
            };
            Object.defineProperty(O.prototype, "m_maxSuspensionForce", {get: O.prototype.qB, set: O.prototype.xB});
            O.prototype.get_m_bIsFrontWheel = O.prototype.BB = function () {
                return !!Hv(this.bB)
            };
            O.prototype.set_m_bIsFrontWheel = O.prototype.LB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Iv(c, a)
            };
            Object.defineProperty(O.prototype, "m_bIsFrontWheel", {get: O.prototype.BB, set: O.prototype.LB});
            O.prototype.__destroy__ = function () {
                Jv(this.bB)
            };

            function P(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = Kv(a);
                h(P)[this.bB] = this
            }

            P.prototype = Object.create(f.prototype);
            P.prototype.constructor = P;
            P.prototype.cB = P;
            P.dB = {};
            b.btWheelInfo = P;
            P.prototype.getSuspensionRestLength = function () {
                return Lv(this.bB)
            };
            P.prototype.updateWheel = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Mv(d, a, c)
            };
            P.prototype.get_m_suspensionStiffness = P.prototype.sB = function () {
                return Nv(this.bB)
            };
            P.prototype.set_m_suspensionStiffness = P.prototype.zB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ov(c, a)
            };
            Object.defineProperty(P.prototype, "m_suspensionStiffness", {get: P.prototype.sB, set: P.prototype.zB});
            P.prototype.get_m_frictionSlip = P.prototype.nB = function () {
                return Pv(this.bB)
            };
            P.prototype.set_m_frictionSlip = P.prototype.uB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qv(c, a)
            };
            Object.defineProperty(P.prototype, "m_frictionSlip", {get: P.prototype.nB, set: P.prototype.uB});
            P.prototype.get_m_engineForce = P.prototype.aD = function () {
                return Rv(this.bB)
            };
            P.prototype.set_m_engineForce = P.prototype.SF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Sv(c, a)
            };
            Object.defineProperty(P.prototype, "m_engineForce", {get: P.prototype.aD, set: P.prototype.SF});
            P.prototype.get_m_rollInfluence = P.prototype.VD = function () {
                return Tv(this.bB)
            };
            P.prototype.set_m_rollInfluence = P.prototype.MG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Uv(c, a)
            };
            Object.defineProperty(P.prototype, "m_rollInfluence", {get: P.prototype.VD, set: P.prototype.MG});
            P.prototype.get_m_suspensionRestLength1 = P.prototype.jE = function () {
                return Vv(this.bB)
            };
            P.prototype.set_m_suspensionRestLength1 = P.prototype.bH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wv(c, a)
            };
            Object.defineProperty(P.prototype, "m_suspensionRestLength1", {get: P.prototype.jE, set: P.prototype.bH});
            P.prototype.get_m_wheelsRadius = P.prototype.xE = function () {
                return Xv(this.bB)
            };
            P.prototype.set_m_wheelsRadius = P.prototype.pH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yv(c, a)
            };
            Object.defineProperty(P.prototype, "m_wheelsRadius", {get: P.prototype.xE, set: P.prototype.pH});
            P.prototype.get_m_wheelsDampingCompression = P.prototype.JB = function () {
                return Zv(this.bB)
            };
            P.prototype.set_m_wheelsDampingCompression = P.prototype.TB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $v(c, a)
            };
            Object.defineProperty(P.prototype, "m_wheelsDampingCompression", {
                get: P.prototype.JB,
                set: P.prototype.TB
            });
            P.prototype.get_m_wheelsDampingRelaxation = P.prototype.KB = function () {
                return aw(this.bB)
            };
            P.prototype.set_m_wheelsDampingRelaxation = P.prototype.UB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bw(c, a)
            };
            Object.defineProperty(P.prototype, "m_wheelsDampingRelaxation", {get: P.prototype.KB, set: P.prototype.UB});
            P.prototype.get_m_steering = P.prototype.cE = function () {
                return cw(this.bB)
            };
            P.prototype.set_m_steering = P.prototype.VG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                dw(c, a)
            };
            Object.defineProperty(P.prototype, "m_steering", {get: P.prototype.cE, set: P.prototype.VG});
            P.prototype.get_m_maxSuspensionForce = P.prototype.qB = function () {
                return ew(this.bB)
            };
            P.prototype.set_m_maxSuspensionForce = P.prototype.xB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fw(c, a)
            };
            Object.defineProperty(P.prototype, "m_maxSuspensionForce", {get: P.prototype.qB, set: P.prototype.xB});
            P.prototype.get_m_maxSuspensionTravelCm = P.prototype.rB = function () {
                return gw(this.bB)
            };
            P.prototype.set_m_maxSuspensionTravelCm = P.prototype.yB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hw(c, a)
            };
            Object.defineProperty(P.prototype, "m_maxSuspensionTravelCm", {get: P.prototype.rB, set: P.prototype.yB});
            P.prototype.get_m_wheelsSuspensionForce = P.prototype.yE = function () {
                return iw(this.bB)
            };
            P.prototype.set_m_wheelsSuspensionForce = P.prototype.qH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jw(c, a)
            };
            Object.defineProperty(P.prototype, "m_wheelsSuspensionForce", {get: P.prototype.yE, set: P.prototype.qH});
            P.prototype.get_m_bIsFrontWheel = P.prototype.BB = function () {
                return !!kw(this.bB)
            };
            P.prototype.set_m_bIsFrontWheel = P.prototype.LB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                lw(c, a)
            };
            Object.defineProperty(P.prototype, "m_bIsFrontWheel", {get: P.prototype.BB, set: P.prototype.LB});
            P.prototype.get_m_raycastInfo = P.prototype.TD = function () {
                return k(mw(this.bB), N)
            };
            P.prototype.set_m_raycastInfo = P.prototype.KG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nw(c, a)
            };
            Object.defineProperty(P.prototype, "m_raycastInfo", {get: P.prototype.TD, set: P.prototype.KG});
            P.prototype.get_m_chassisConnectionPointCS = P.prototype.KC = function () {
                return k(ow(this.bB), m)
            };
            P.prototype.set_m_chassisConnectionPointCS = P.prototype.BF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pw(c, a)
            };
            Object.defineProperty(P.prototype, "m_chassisConnectionPointCS", {
                get: P.prototype.KC,
                set: P.prototype.BF
            });
            P.prototype.get_m_worldTransform = P.prototype.zE = function () {
                return k(qw(this.bB), r)
            };
            P.prototype.set_m_worldTransform = P.prototype.rH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                rw(c, a)
            };
            Object.defineProperty(P.prototype, "m_worldTransform", {get: P.prototype.zE, set: P.prototype.rH});
            P.prototype.get_m_wheelDirectionCS = P.prototype.IB = function () {
                return k(sw(this.bB), m)
            };
            P.prototype.set_m_wheelDirectionCS = P.prototype.SB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tw(c, a)
            };
            Object.defineProperty(P.prototype, "m_wheelDirectionCS", {get: P.prototype.IB, set: P.prototype.SB});
            P.prototype.get_m_wheelAxleCS = P.prototype.HB = function () {
                return k(uw(this.bB), m)
            };
            P.prototype.set_m_wheelAxleCS = P.prototype.RB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vw(c, a)
            };
            Object.defineProperty(P.prototype, "m_wheelAxleCS", {get: P.prototype.HB, set: P.prototype.RB});
            P.prototype.get_m_rotation = P.prototype.XD = function () {
                return ww(this.bB)
            };
            P.prototype.set_m_rotation = P.prototype.OG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xw(c, a)
            };
            Object.defineProperty(P.prototype, "m_rotation", {get: P.prototype.XD, set: P.prototype.OG});
            P.prototype.get_m_deltaRotation = P.prototype.UC = function () {
                return yw(this.bB)
            };
            P.prototype.set_m_deltaRotation = P.prototype.LF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zw(c, a)
            };
            Object.defineProperty(P.prototype, "m_deltaRotation", {get: P.prototype.UC, set: P.prototype.LF});
            P.prototype.get_m_brake = P.prototype.DC = function () {
                return Aw(this.bB)
            };
            P.prototype.set_m_brake = P.prototype.uF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Bw(c, a)
            };
            Object.defineProperty(P.prototype, "m_brake", {get: P.prototype.DC, set: P.prototype.uF});
            P.prototype.get_m_clippedInvContactDotSuspension = P.prototype.LC = function () {
                return Cw(this.bB)
            };
            P.prototype.set_m_clippedInvContactDotSuspension = P.prototype.CF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dw(c, a)
            };
            Object.defineProperty(P.prototype, "m_clippedInvContactDotSuspension", {
                get: P.prototype.LC,
                set: P.prototype.CF
            });
            P.prototype.get_m_suspensionRelativeVelocity = P.prototype.hE = function () {
                return Ew(this.bB)
            };
            P.prototype.set_m_suspensionRelativeVelocity = P.prototype.$G = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fw(c, a)
            };
            Object.defineProperty(P.prototype, "m_suspensionRelativeVelocity", {
                get: P.prototype.hE,
                set: P.prototype.$G
            });
            P.prototype.get_m_skidInfo = P.prototype.$D = function () {
                return Gw(this.bB)
            };
            P.prototype.set_m_skidInfo = P.prototype.SG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hw(c, a)
            };
            Object.defineProperty(P.prototype, "m_skidInfo", {get: P.prototype.$D, set: P.prototype.SG});
            P.prototype.__destroy__ = function () {
                Iw(this.bB)
            };

            function oF(a, c, d, e) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                this.bB = void 0 === e ? Jw(a, c, d) : Kw(a, c, d, e);
                h(oF)[this.bB] = this
            }

            oF.prototype = Object.create(hE.prototype);
            oF.prototype.constructor = oF;
            oF.prototype.cB = oF;
            oF.dB = {};
            b.btKinematicCharacterController = oF;
            oF.prototype.setUpAxis = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Lw(c, a)
            };
            oF.prototype.setWalkDirection = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Mw(c, a)
            };
            oF.prototype.setVelocityForTimeInterval = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Nw(d, a, c)
            };
            oF.prototype.warp = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ow(c, a)
            };
            oF.prototype.preStep = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Pw(c, a)
            };
            oF.prototype.playerStep = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Qw(d, a, c)
            };
            oF.prototype.setFallSpeed = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Rw(c, a)
            };
            oF.prototype.setJumpSpeed = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Sw(c, a)
            };
            oF.prototype.setMaxJumpHeight = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Tw(c, a)
            };
            oF.prototype.canJump = function () {
                return !!Uw(this.bB)
            };
            oF.prototype.jump = function () {
                Vw(this.bB)
            };
            oF.prototype.setGravity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ww(c, a)
            };
            oF.prototype.getGravity = function () {
                return Xw(this.bB)
            };
            oF.prototype.setMaxSlope = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yw(c, a)
            };
            oF.prototype.getMaxSlope = function () {
                return Zw(this.bB)
            };
            oF.prototype.getGhostObject = function () {
                return k($w(this.bB), Q)
            };
            oF.prototype.setUseGhostSweepTest = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ax(c, a)
            };
            oF.prototype.onGround = function () {
                return !!bx(this.bB)
            };
            oF.prototype.setUpInterpolate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                cx(c, a)
            };
            oF.prototype.updateAction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                dx(d, a, c)
            };
            oF.prototype.__destroy__ = function () {
                ex(this.bB)
            };

            function R(a, c, d) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                this.bB = fx(a, c, d);
                h(R)[this.bB] = this
            }

            R.prototype = Object.create(hE.prototype);
            R.prototype.constructor = R;
            R.prototype.cB = R;
            R.dB = {};
            b.btRaycastVehicle = R;
            R.prototype.applyEngineForce = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                gx(d, a, c)
            };
            R.prototype.setSteeringValue = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                hx(d, a, c)
            };
            R.prototype.getWheelTransformWS = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(ix(c, a), r)
            };
            R.prototype.updateWheelTransform = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                jx(d, a, c)
            };
            R.prototype.addWheel = function (a, c, d, e, g, n, D) {
                var T = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                return k(kx(T, a, c, d, e, g, n, D), P)
            };
            R.prototype.getNumWheels = function () {
                return lx(this.bB)
            };
            R.prototype.getRigidBody = function () {
                return k(mx(this.bB), K)
            };
            R.prototype.getWheelInfo = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(nx(c, a), P)
            };
            R.prototype.setBrake = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                ox(d, a, c)
            };
            R.prototype.setCoordinateSystem = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                px(e, a, c, d)
            };
            R.prototype.getCurrentSpeedKmHour = function () {
                return qx(this.bB)
            };
            R.prototype.getChassisWorldTransform = function () {
                return k(rx(this.bB), r)
            };
            R.prototype.rayCast = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return sx(c, a)
            };
            R.prototype.updateVehicle = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tx(c, a)
            };
            R.prototype.resetSuspension = function () {
                ux(this.bB)
            };
            R.prototype.getSteeringValue = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return vx(c, a)
            };
            R.prototype.updateWheelTransformsWS = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                void 0 === c ? wx(d, a) : xx(d, a, c)
            };
            R.prototype.setPitchControl = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                yx(c, a)
            };
            R.prototype.updateSuspension = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zx(c, a)
            };
            R.prototype.updateFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ax(c, a)
            };
            R.prototype.getRightAxis = function () {
                return Bx(this.bB)
            };
            R.prototype.getUpAxis = function () {
                return Cx(this.bB)
            };
            R.prototype.getForwardAxis = function () {
                return Dx(this.bB)
            };
            R.prototype.getForwardVector = function () {
                return k(Ex(this.bB), m)
            };
            R.prototype.getUserConstraintType = function () {
                return Fx(this.bB)
            };
            R.prototype.setUserConstraintType = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Gx(c, a)
            };
            R.prototype.setUserConstraintId = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hx(c, a)
            };
            R.prototype.getUserConstraintId = function () {
                return Ix(this.bB)
            };
            R.prototype.updateAction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Jx(d, a, c)
            };
            R.prototype.__destroy__ = function () {
                Kx(this.bB)
            };

            function Q() {
                this.bB = Lx();
                h(Q)[this.bB] = this
            }

            Q.prototype = Object.create(y.prototype);
            Q.prototype.constructor = Q;
            Q.prototype.cB = Q;
            Q.dB = {};
            b.btPairCachingGhostObject = Q;
            Q.prototype.setAnisotropicFriction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                Mx(d, a, c)
            };
            Q.prototype.getCollisionShape = function () {
                return k(Nx(this.bB), l)
            };
            Q.prototype.setContactProcessingThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Ox(c, a)
            };
            Q.prototype.setActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Px(c, a)
            };
            Q.prototype.forceActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qx(c, a)
            };
            Q.prototype.activate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                void 0 === a ? Rx(c) : Sx(c, a)
            };
            Q.prototype.isActive = function () {
                return !!Tx(this.bB)
            };
            Q.prototype.isKinematicObject = function () {
                return !!Ux(this.bB)
            };
            Q.prototype.isStaticObject = function () {
                return !!Vx(this.bB)
            };
            Q.prototype.isStaticOrKinematicObject = function () {
                return !!Wx(this.bB)
            };
            Q.prototype.getRestitution = function () {
                return Xx(this.bB)
            };
            Q.prototype.getFriction = function () {
                return Yx(this.bB)
            };
            Q.prototype.getRollingFriction = function () {
                return Zx(this.bB)
            };
            Q.prototype.setRestitution = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $x(c, a)
            };
            Q.prototype.setFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ay(c, a)
            };
            Q.prototype.setRollingFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                by(c, a)
            };
            Q.prototype.getWorldTransform = function () {
                return k(cy(this.bB), r)
            };
            Q.prototype.getCollisionFlags = function () {
                return dy(this.bB)
            };
            Q.prototype.setCollisionFlags = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ey(c, a)
            };
            Q.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fy(c, a)
            };
            Q.prototype.setCollisionShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                gy(c, a)
            };
            Q.prototype.setCcdMotionThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hy(c, a)
            };
            Q.prototype.setCcdSweptSphereRadius = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                iy(c, a)
            };
            Q.prototype.getUserIndex = function () {
                return jy(this.bB)
            };
            Q.prototype.setUserIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ky(c, a)
            };
            Q.prototype.getUserPointer = function () {
                return k(ly(this.bB), ND)
            };
            Q.prototype.setUserPointer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                my(c, a)
            };
            Q.prototype.getBroadphaseHandle = function () {
                return k(ny(this.bB), OD)
            };
            Q.prototype.getNumOverlappingObjects = function () {
                return oy(this.bB)
            };
            Q.prototype.getOverlappingObject = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(py(c, a), q)
            };
            Q.prototype.__destroy__ = function () {
                qy(this.bB)
            };

            function pF() {
                this.bB = ry();
                h(pF)[this.bB] = this
            }

            pF.prototype = Object.create(f.prototype);
            pF.prototype.constructor = pF;
            pF.prototype.cB = pF;
            pF.dB = {};
            b.btGhostPairCallback = pF;
            pF.prototype.__destroy__ = function () {
                sy(this.bB)
            };

            function S() {
                this.bB = ty();
                h(S)[this.bB] = this
            }

            S.prototype = Object.create(f.prototype);
            S.prototype.constructor = S;
            S.prototype.cB = S;
            S.dB = {};
            b.btSoftBodyWorldInfo = S;
            S.prototype.get_air_density = S.prototype.VB = function () {
                return uy(this.bB)
            };
            S.prototype.set_air_density = S.prototype.ME = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vy(c, a)
            };
            Object.defineProperty(S.prototype, "air_density", {get: S.prototype.VB, set: S.prototype.ME});
            S.prototype.get_water_density = S.prototype.JE = function () {
                return wy(this.bB)
            };
            S.prototype.set_water_density = S.prototype.BH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xy(c, a)
            };
            Object.defineProperty(S.prototype, "water_density", {get: S.prototype.JE, set: S.prototype.BH});
            S.prototype.get_water_offset = S.prototype.LE = function () {
                return yy(this.bB)
            };
            S.prototype.set_water_offset = S.prototype.DH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zy(c, a)
            };
            Object.defineProperty(S.prototype, "water_offset", {get: S.prototype.LE, set: S.prototype.DH});
            S.prototype.get_m_maxDisplacement = S.prototype.FD = function () {
                return Ay(this.bB)
            };
            S.prototype.set_m_maxDisplacement = S.prototype.wG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                By(c, a)
            };
            Object.defineProperty(S.prototype, "m_maxDisplacement", {get: S.prototype.FD, set: S.prototype.wG});
            S.prototype.get_water_normal = S.prototype.KE = function () {
                return k(Cy(this.bB), m)
            };
            S.prototype.set_water_normal = S.prototype.CH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dy(c, a)
            };
            Object.defineProperty(S.prototype, "water_normal", {get: S.prototype.KE, set: S.prototype.CH});
            S.prototype.get_m_broadphase = S.prototype.EC = function () {
                return k(Ey(this.bB), LD)
            };
            S.prototype.set_m_broadphase = S.prototype.vF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fy(c, a)
            };
            Object.defineProperty(S.prototype, "m_broadphase", {get: S.prototype.EC, set: S.prototype.vF});
            S.prototype.get_m_dispatcher = S.prototype.WC = function () {
                return k(Gy(this.bB), JD)
            };
            S.prototype.set_m_dispatcher = S.prototype.NF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hy(c, a)
            };
            Object.defineProperty(S.prototype, "m_dispatcher", {get: S.prototype.WC, set: S.prototype.NF});
            S.prototype.get_m_gravity = S.prototype.eD = function () {
                return k(Iy(this.bB), m)
            };
            S.prototype.set_m_gravity = S.prototype.WF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Jy(c, a)
            };
            Object.defineProperty(S.prototype, "m_gravity", {get: S.prototype.eD, set: S.prototype.WF});
            S.prototype.__destroy__ = function () {
                Ky(this.bB)
            };

            function U() {
                throw"cannot construct a Face, no constructor in IDL";
            }

            U.prototype = Object.create(f.prototype);
            U.prototype.constructor = U;
            U.prototype.cB = U;
            U.dB = {};
            b.Face = U;
            U.prototype.get_m_n = U.prototype.EB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ly(c, a), Node)
            };
            U.prototype.set_m_n = U.prototype.OB = function (a, c) {
                var d = this.bB;
                DD();
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                My(d, a, c)
            };
            Object.defineProperty(U.prototype, "m_n", {get: U.prototype.EB, set: U.prototype.OB});
            U.prototype.get_m_normal = U.prototype.JD = function () {
                return k(Ny(this.bB), m)
            };
            U.prototype.set_m_normal = U.prototype.AG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Oy(c, a)
            };
            Object.defineProperty(U.prototype, "m_normal", {get: U.prototype.JD, set: U.prototype.AG});
            U.prototype.get_m_ra = U.prototype.SD = function () {
                return Py(this.bB)
            };
            U.prototype.set_m_ra = U.prototype.JG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qy(c, a)
            };
            Object.defineProperty(U.prototype, "m_ra", {get: U.prototype.SD, set: U.prototype.JG});
            U.prototype.__destroy__ = function () {
                Ry(this.bB)
            };

            function qF() {
                throw"cannot construct a tFaceArray, no constructor in IDL";
            }

            qF.prototype = Object.create(f.prototype);
            qF.prototype.constructor = qF;
            qF.prototype.cB = qF;
            qF.dB = {};
            b.tFaceArray = qF;
            qF.prototype.size = qF.prototype.size = function () {
                return Sy(this.bB)
            };
            qF.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Ty(c, a), U)
            };
            qF.prototype.__destroy__ = function () {
                Uy(this.bB)
            };

            function Node() {
                throw"cannot construct a Node, no constructor in IDL";
            }

            Node.prototype = Object.create(f.prototype);
            Node.prototype.constructor = Node;
            Node.prototype.cB = Node;
            Node.dB = {};
            b.Node = Node;
            Node.prototype.get_m_x = Node.prototype.AE = function () {
                return k(Vy(this.bB), m)
            };
            Node.prototype.set_m_x = Node.prototype.sH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wy(c, a)
            };
            Object.defineProperty(Node.prototype, "m_x", {get: Node.prototype.AE, set: Node.prototype.sH});
            Node.prototype.get_m_q = Node.prototype.RD = function () {
                return k(Xy(this.bB), m)
            };
            Node.prototype.set_m_q = Node.prototype.IG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yy(c, a)
            };
            Object.defineProperty(Node.prototype, "m_q", {get: Node.prototype.RD, set: Node.prototype.IG});
            Node.prototype.get_m_v = Node.prototype.sE = function () {
                return k(Zy(this.bB), m)
            };
            Node.prototype.set_m_v = Node.prototype.kH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $y(c, a)
            };
            Object.defineProperty(Node.prototype, "m_v", {get: Node.prototype.sE, set: Node.prototype.kH});
            Node.prototype.get_m_f = Node.prototype.bD = function () {
                return k(az(this.bB), m)
            };
            Node.prototype.set_m_f = Node.prototype.TF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bz(c, a)
            };
            Object.defineProperty(Node.prototype, "m_f", {get: Node.prototype.bD, set: Node.prototype.TF});
            Node.prototype.get_m_n = Node.prototype.EB = function () {
                return k(cz(this.bB), m)
            };
            Node.prototype.set_m_n = Node.prototype.OB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                dz(c, a)
            };
            Object.defineProperty(Node.prototype, "m_n", {get: Node.prototype.EB, set: Node.prototype.OB});
            Node.prototype.get_m_im = Node.prototype.nD = function () {
                return ez(this.bB)
            };
            Node.prototype.set_m_im = Node.prototype.eG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fz(c, a)
            };
            Object.defineProperty(Node.prototype, "m_im", {get: Node.prototype.nD, set: Node.prototype.eG});
            Node.prototype.get_m_area = Node.prototype.BC = function () {
                return gz(this.bB)
            };
            Node.prototype.set_m_area = Node.prototype.sF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hz(c, a)
            };
            Object.defineProperty(Node.prototype, "m_area", {get: Node.prototype.BC, set: Node.prototype.sF});
            Node.prototype.__destroy__ = function () {
                iz(this.bB)
            };

            function rF() {
                throw"cannot construct a tNodeArray, no constructor in IDL";
            }

            rF.prototype = Object.create(f.prototype);
            rF.prototype.constructor = rF;
            rF.prototype.cB = rF;
            rF.dB = {};
            b.tNodeArray = rF;
            rF.prototype.size = rF.prototype.size = function () {
                return jz(this.bB)
            };
            rF.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(kz(c, a), Node)
            };
            rF.prototype.__destroy__ = function () {
                lz(this.bB)
            };

            function V() {
                throw"cannot construct a Material, no constructor in IDL";
            }

            V.prototype = Object.create(f.prototype);
            V.prototype.constructor = V;
            V.prototype.cB = V;
            V.dB = {};
            b.Material = V;
            V.prototype.get_m_kLST = V.prototype.tD = function () {
                return mz(this.bB)
            };
            V.prototype.set_m_kLST = V.prototype.kG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nz(c, a)
            };
            Object.defineProperty(V.prototype, "m_kLST", {get: V.prototype.tD, set: V.prototype.kG});
            V.prototype.get_m_kAST = V.prototype.sD = function () {
                return oz(this.bB)
            };
            V.prototype.set_m_kAST = V.prototype.jG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pz(c, a)
            };
            Object.defineProperty(V.prototype, "m_kAST", {get: V.prototype.sD, set: V.prototype.jG});
            V.prototype.get_m_kVST = V.prototype.uD = function () {
                return qz(this.bB)
            };
            V.prototype.set_m_kVST = V.prototype.lG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                rz(c, a)
            };
            Object.defineProperty(V.prototype, "m_kVST", {get: V.prototype.uD, set: V.prototype.lG});
            V.prototype.get_m_flags = V.prototype.kB = function () {
                return sz(this.bB)
            };
            V.prototype.set_m_flags = V.prototype.lB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tz(c, a)
            };
            Object.defineProperty(V.prototype, "m_flags", {get: V.prototype.kB, set: V.prototype.lB});
            V.prototype.__destroy__ = function () {
                uz(this.bB)
            };

            function sF() {
                throw"cannot construct a tMaterialArray, no constructor in IDL";
            }

            sF.prototype = Object.create(f.prototype);
            sF.prototype.constructor = sF;
            sF.prototype.cB = sF;
            sF.dB = {};
            b.tMaterialArray = sF;
            sF.prototype.size = sF.prototype.size = function () {
                return vz(this.bB)
            };
            sF.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(wz(c, a), V)
            };
            sF.prototype.__destroy__ = function () {
                xz(this.bB)
            };

            function W() {
                throw"cannot construct a Anchor, no constructor in IDL";
            }

            W.prototype = Object.create(f.prototype);
            W.prototype.constructor = W;
            W.prototype.cB = W;
            W.dB = {};
            b.Anchor = W;
            W.prototype.get_m_node = W.prototype.HD = function () {
                return k(yz(this.bB), Node)
            };
            W.prototype.set_m_node = W.prototype.yG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zz(c, a)
            };
            Object.defineProperty(W.prototype, "m_node", {get: W.prototype.HD, set: W.prototype.yG});
            W.prototype.get_m_local = W.prototype.xD = function () {
                return k(Az(this.bB), m)
            };
            W.prototype.set_m_local = W.prototype.oG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Bz(c, a)
            };
            Object.defineProperty(W.prototype, "m_local", {get: W.prototype.xD, set: W.prototype.oG});
            W.prototype.get_m_body = W.prototype.CC = function () {
                return k(Cz(this.bB), K)
            };
            W.prototype.set_m_body = W.prototype.tF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Dz(c, a)
            };
            Object.defineProperty(W.prototype, "m_body", {get: W.prototype.CC, set: W.prototype.tF});
            W.prototype.get_m_influence = W.prototype.qD = function () {
                return Ez(this.bB)
            };
            W.prototype.set_m_influence = W.prototype.hG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Fz(c, a)
            };
            Object.defineProperty(W.prototype, "m_influence", {get: W.prototype.qD, set: W.prototype.hG});
            W.prototype.get_m_c0 = W.prototype.FC = function () {
                return k(Gz(this.bB), kE)
            };
            W.prototype.set_m_c0 = W.prototype.wF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Hz(c, a)
            };
            Object.defineProperty(W.prototype, "m_c0", {get: W.prototype.FC, set: W.prototype.wF});
            W.prototype.get_m_c1 = W.prototype.GC = function () {
                return k(Iz(this.bB), m)
            };
            W.prototype.set_m_c1 = W.prototype.xF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Jz(c, a)
            };
            Object.defineProperty(W.prototype, "m_c1", {get: W.prototype.GC, set: W.prototype.xF});
            W.prototype.get_m_c2 = W.prototype.HC = function () {
                return Kz(this.bB)
            };
            W.prototype.set_m_c2 = W.prototype.yF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Lz(c, a)
            };
            Object.defineProperty(W.prototype, "m_c2", {get: W.prototype.HC, set: W.prototype.yF});
            W.prototype.__destroy__ = function () {
                Mz(this.bB)
            };

            function tF() {
                throw"cannot construct a tAnchorArray, no constructor in IDL";
            }

            tF.prototype = Object.create(f.prototype);
            tF.prototype.constructor = tF;
            tF.prototype.cB = tF;
            tF.dB = {};
            b.tAnchorArray = tF;
            tF.prototype.size = tF.prototype.size = function () {
                return Nz(this.bB)
            };
            tF.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(Oz(c, a), W)
            };
            tF.prototype.clear = tF.prototype.clear = function () {
                Pz(this.bB)
            };
            tF.prototype.push_back = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Qz(c, a)
            };
            tF.prototype.pop_back = function () {
                Rz(this.bB)
            };
            tF.prototype.__destroy__ = function () {
                Sz(this.bB)
            };

            function X() {
                throw"cannot construct a Config, no constructor in IDL";
            }

            X.prototype = Object.create(f.prototype);
            X.prototype.constructor = X;
            X.prototype.cB = X;
            X.dB = {};
            b.Config = X;
            X.prototype.get_kVCF = X.prototype.rC = function () {
                return Tz(this.bB)
            };
            X.prototype.set_kVCF = X.prototype.iF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Uz(c, a)
            };
            Object.defineProperty(X.prototype, "kVCF", {get: X.prototype.rC, set: X.prototype.iF});
            X.prototype.get_kDP = X.prototype.eC = function () {
                return Vz(this.bB)
            };
            X.prototype.set_kDP = X.prototype.WE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Wz(c, a)
            };
            Object.defineProperty(X.prototype, "kDP", {get: X.prototype.eC, set: X.prototype.WE});
            X.prototype.get_kDG = X.prototype.dC = function () {
                return Xz(this.bB)
            };
            X.prototype.set_kDG = X.prototype.VE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                Yz(c, a)
            };
            Object.defineProperty(X.prototype, "kDG", {get: X.prototype.dC, set: X.prototype.VE});
            X.prototype.get_kLF = X.prototype.gC = function () {
                return Zz(this.bB)
            };
            X.prototype.set_kLF = X.prototype.YE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                $z(c, a)
            };
            Object.defineProperty(X.prototype, "kLF", {get: X.prototype.gC, set: X.prototype.YE});
            X.prototype.get_kPR = X.prototype.iC = function () {
                return aA(this.bB)
            };
            X.prototype.set_kPR = X.prototype.$E = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                bA(c, a)
            };
            Object.defineProperty(X.prototype, "kPR", {get: X.prototype.iC, set: X.prototype.$E});
            X.prototype.get_kVC = X.prototype.qC = function () {
                return cA(this.bB)
            };
            X.prototype.set_kVC = X.prototype.hF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                dA(c, a)
            };
            Object.defineProperty(X.prototype, "kVC", {get: X.prototype.qC, set: X.prototype.hF});
            X.prototype.get_kDF = X.prototype.cC = function () {
                return eA(this.bB)
            };
            X.prototype.set_kDF = X.prototype.UE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fA(c, a)
            };
            Object.defineProperty(X.prototype, "kDF", {get: X.prototype.cC, set: X.prototype.UE});
            X.prototype.get_kMT = X.prototype.hC = function () {
                return gA(this.bB)
            };
            X.prototype.set_kMT = X.prototype.ZE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hA(c, a)
            };
            Object.defineProperty(X.prototype, "kMT", {get: X.prototype.hC, set: X.prototype.ZE});
            X.prototype.get_kCHR = X.prototype.bC = function () {
                return iA(this.bB)
            };
            X.prototype.set_kCHR = X.prototype.TE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                jA(c, a)
            };
            Object.defineProperty(X.prototype, "kCHR", {get: X.prototype.bC, set: X.prototype.TE});
            X.prototype.get_kKHR = X.prototype.fC = function () {
                return kA(this.bB)
            };
            X.prototype.set_kKHR = X.prototype.XE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                lA(c, a)
            };
            Object.defineProperty(X.prototype, "kKHR", {get: X.prototype.fC, set: X.prototype.XE});
            X.prototype.get_kSHR = X.prototype.jC = function () {
                return mA(this.bB)
            };
            X.prototype.set_kSHR = X.prototype.aF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nA(c, a)
            };
            Object.defineProperty(X.prototype, "kSHR", {get: X.prototype.jC, set: X.prototype.aF});
            X.prototype.get_kAHR = X.prototype.aC = function () {
                return oA(this.bB)
            };
            X.prototype.set_kAHR = X.prototype.SE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                pA(c, a)
            };
            Object.defineProperty(X.prototype, "kAHR", {get: X.prototype.aC, set: X.prototype.SE});
            X.prototype.get_kSRHR_CL = X.prototype.mC = function () {
                return qA(this.bB)
            };
            X.prototype.set_kSRHR_CL = X.prototype.dF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                rA(c, a)
            };
            Object.defineProperty(X.prototype, "kSRHR_CL", {get: X.prototype.mC, set: X.prototype.dF});
            X.prototype.get_kSKHR_CL = X.prototype.kC = function () {
                return sA(this.bB)
            };
            X.prototype.set_kSKHR_CL = X.prototype.bF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tA(c, a)
            };
            Object.defineProperty(X.prototype, "kSKHR_CL", {get: X.prototype.kC, set: X.prototype.bF});
            X.prototype.get_kSSHR_CL = X.prototype.oC = function () {
                return uA(this.bB)
            };
            X.prototype.set_kSSHR_CL = X.prototype.fF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                vA(c, a)
            };
            Object.defineProperty(X.prototype, "kSSHR_CL", {get: X.prototype.oC, set: X.prototype.fF});
            X.prototype.get_kSR_SPLT_CL = X.prototype.nC = function () {
                return wA(this.bB)
            };
            X.prototype.set_kSR_SPLT_CL = X.prototype.eF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                xA(c, a)
            };
            Object.defineProperty(X.prototype, "kSR_SPLT_CL", {get: X.prototype.nC, set: X.prototype.eF});
            X.prototype.get_kSK_SPLT_CL = X.prototype.lC = function () {
                return yA(this.bB)
            };
            X.prototype.set_kSK_SPLT_CL = X.prototype.cF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                zA(c, a)
            };
            Object.defineProperty(X.prototype, "kSK_SPLT_CL", {get: X.prototype.lC, set: X.prototype.cF});
            X.prototype.get_kSS_SPLT_CL = X.prototype.pC = function () {
                return AA(this.bB)
            };
            X.prototype.set_kSS_SPLT_CL = X.prototype.gF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                BA(c, a)
            };
            Object.defineProperty(X.prototype, "kSS_SPLT_CL", {get: X.prototype.pC, set: X.prototype.gF});
            X.prototype.get_maxvolume = X.prototype.BE = function () {
                return CA(this.bB)
            };
            X.prototype.set_maxvolume = X.prototype.tH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                DA(c, a)
            };
            Object.defineProperty(X.prototype, "maxvolume", {get: X.prototype.BE, set: X.prototype.tH});
            X.prototype.get_timescale = X.prototype.GE = function () {
                return EA(this.bB)
            };
            X.prototype.set_timescale = X.prototype.yH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                FA(c, a)
            };
            Object.defineProperty(X.prototype, "timescale", {get: X.prototype.GE, set: X.prototype.yH});
            X.prototype.get_viterations = X.prototype.IE = function () {
                return GA(this.bB)
            };
            X.prototype.set_viterations = X.prototype.AH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                HA(c, a)
            };
            Object.defineProperty(X.prototype, "viterations", {get: X.prototype.IE, set: X.prototype.AH});
            X.prototype.get_piterations = X.prototype.EE = function () {
                return IA(this.bB)
            };
            X.prototype.set_piterations = X.prototype.wH = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                JA(c, a)
            };
            Object.defineProperty(X.prototype, "piterations", {get: X.prototype.EE, set: X.prototype.wH});
            X.prototype.get_diterations = X.prototype.YB = function () {
                return KA(this.bB)
            };
            X.prototype.set_diterations = X.prototype.PE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                LA(c, a)
            };
            Object.defineProperty(X.prototype, "diterations", {get: X.prototype.YB, set: X.prototype.PE});
            X.prototype.get_citerations = X.prototype.WB = function () {
                return MA(this.bB)
            };
            X.prototype.set_citerations = X.prototype.NE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                NA(c, a)
            };
            Object.defineProperty(X.prototype, "citerations", {get: X.prototype.WB, set: X.prototype.NE});
            X.prototype.get_collisions = X.prototype.XB = function () {
                return OA(this.bB)
            };
            X.prototype.set_collisions = X.prototype.OE = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                PA(c, a)
            };
            Object.defineProperty(X.prototype, "collisions", {get: X.prototype.XB, set: X.prototype.OE});
            X.prototype.__destroy__ = function () {
                QA(this.bB)
            };

            function Y(a, c, d, e) {
                DD();
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                "object" == typeof e && (e = HD(e));
                this.bB = RA(a, c, d, e);
                h(Y)[this.bB] = this
            }

            Y.prototype = Object.create(q.prototype);
            Y.prototype.constructor = Y;
            Y.prototype.cB = Y;
            Y.dB = {};
            b.btSoftBody = Y;
            Y.prototype.checkLink = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return !!SA(d, a, c)
            };
            Y.prototype.checkFace = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                return !!TA(e, a, c, d)
            };
            Y.prototype.appendMaterial = function () {
                return k(UA(this.bB), V)
            };
            Y.prototype.appendNode = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                VA(d, a, c)
            };
            Y.prototype.appendLink = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                WA(g, a, c, d, e)
            };
            Y.prototype.appendFace = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                XA(g, a, c, d, e)
            };
            Y.prototype.appendTetra = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                YA(n, a, c, d, e, g)
            };
            Y.prototype.appendAnchor = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                ZA(g, a, c, d, e)
            };
            Y.prototype.addForce = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                void 0 === c ? $A(d, a) : aB(d, a, c)
            };
            Y.prototype.addAeroForceToNode = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                bB(d, a, c)
            };
            Y.prototype.getTotalMass = function () {
                return cB(this.bB)
            };
            Y.prototype.setTotalMass = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                dB(d, a, c)
            };
            Y.prototype.setMass = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                eB(d, a, c)
            };
            Y.prototype.transform = Y.prototype.transform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                fB(c, a)
            };
            Y.prototype.translate = Y.prototype.translate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                gB(c, a)
            };
            Y.prototype.rotate = Y.prototype.rotate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                hB(c, a)
            };
            Y.prototype.scale = Y.prototype.scale = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                iB(c, a)
            };
            Y.prototype.generateClusters = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return void 0 === c ? jB(d, a) : kB(d, a, c)
            };
            Y.prototype.generateBendingConstraints = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                return lB(d, a, c)
            };
            Y.prototype.upcast = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(mB(c, a), Y)
            };
            Y.prototype.getRestLengthScale = function () {
                return nB(this.bB)
            };
            Y.prototype.setRestLengthScale = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                oB(c, a)
            };
            Y.prototype.setAnisotropicFriction = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                pB(d, a, c)
            };
            Y.prototype.getCollisionShape = function () {
                return k(qB(this.bB), l)
            };
            Y.prototype.setContactProcessingThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                rB(c, a)
            };
            Y.prototype.setActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                sB(c, a)
            };
            Y.prototype.forceActivationState = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                tB(c, a)
            };
            Y.prototype.activate = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                void 0 === a ? uB(c) : vB(c, a)
            };
            Y.prototype.isActive = function () {
                return !!wB(this.bB)
            };
            Y.prototype.isKinematicObject = function () {
                return !!xB(this.bB)
            };
            Y.prototype.isStaticObject = function () {
                return !!yB(this.bB)
            };
            Y.prototype.isStaticOrKinematicObject = function () {
                return !!zB(this.bB)
            };
            Y.prototype.getRestitution = function () {
                return AB(this.bB)
            };
            Y.prototype.getFriction = function () {
                return BB(this.bB)
            };
            Y.prototype.getRollingFriction = function () {
                return CB(this.bB)
            };
            Y.prototype.setRestitution = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                DB(c, a)
            };
            Y.prototype.setFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                EB(c, a)
            };
            Y.prototype.setRollingFriction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                FB(c, a)
            };
            Y.prototype.getWorldTransform = function () {
                return k(GB(this.bB), r)
            };
            Y.prototype.getCollisionFlags = function () {
                return HB(this.bB)
            };
            Y.prototype.setCollisionFlags = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                IB(c, a)
            };
            Y.prototype.setWorldTransform = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                JB(c, a)
            };
            Y.prototype.setCollisionShape = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                KB(c, a)
            };
            Y.prototype.setCcdMotionThreshold = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                LB(c, a)
            };
            Y.prototype.setCcdSweptSphereRadius = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                MB(c, a)
            };
            Y.prototype.getUserIndex = function () {
                return NB(this.bB)
            };
            Y.prototype.setUserIndex = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                OB(c, a)
            };
            Y.prototype.getUserPointer = function () {
                return k(PB(this.bB), ND)
            };
            Y.prototype.setUserPointer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                QB(c, a)
            };
            Y.prototype.getBroadphaseHandle = function () {
                return k(RB(this.bB), OD)
            };
            Y.prototype.get_m_cfg = Y.prototype.IC = function () {
                return k(SB(this.bB), X)
            };
            Y.prototype.set_m_cfg = Y.prototype.zF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                TB(c, a)
            };
            Object.defineProperty(Y.prototype, "m_cfg", {get: Y.prototype.IC, set: Y.prototype.zF});
            Y.prototype.get_m_nodes = Y.prototype.ID = function () {
                return k(UB(this.bB), rF)
            };
            Y.prototype.set_m_nodes = Y.prototype.zG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                VB(c, a)
            };
            Object.defineProperty(Y.prototype, "m_nodes", {get: Y.prototype.ID, set: Y.prototype.zG});
            Y.prototype.get_m_faces = Y.prototype.CB = function () {
                return k(WB(this.bB), qF)
            };
            Y.prototype.set_m_faces = Y.prototype.MB = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                XB(c, a)
            };
            Object.defineProperty(Y.prototype, "m_faces", {get: Y.prototype.CB, set: Y.prototype.MB});
            Y.prototype.get_m_materials = Y.prototype.ED = function () {
                return k(YB(this.bB), sF)
            };
            Y.prototype.set_m_materials = Y.prototype.vG = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                ZB(c, a)
            };
            Object.defineProperty(Y.prototype, "m_materials", {get: Y.prototype.ED, set: Y.prototype.vG});
            Y.prototype.get_m_anchors = Y.prototype.yC = function () {
                return k($B(this.bB), tF)
            };
            Y.prototype.set_m_anchors = Y.prototype.pF = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                aC(c, a)
            };
            Object.defineProperty(Y.prototype, "m_anchors", {get: Y.prototype.yC, set: Y.prototype.pF});
            Y.prototype.__destroy__ = function () {
                bC(this.bB)
            };

            function uF(a) {
                a && "object" === typeof a && (a = a.bB);
                this.bB = void 0 === a ? cC() : dC(a);
                h(uF)[this.bB] = this
            }

            uF.prototype = Object.create(dE.prototype);
            uF.prototype.constructor = uF;
            uF.prototype.cB = uF;
            uF.dB = {};
            b.btSoftBodyRigidBodyCollisionConfiguration = uF;
            uF.prototype.__destroy__ = function () {
                eC(this.bB)
            };

            function vF() {
                this.bB = fC();
                h(vF)[this.bB] = this
            }

            vF.prototype = Object.create(iE.prototype);
            vF.prototype.constructor = vF;
            vF.prototype.cB = vF;
            vF.dB = {};
            b.btDefaultSoftBodySolver = vF;
            vF.prototype.__destroy__ = function () {
                gC(this.bB)
            };

            function wF() {
                throw"cannot construct a btSoftBodyArray, no constructor in IDL";
            }

            wF.prototype = Object.create(f.prototype);
            wF.prototype.constructor = wF;
            wF.prototype.cB = wF;
            wF.dB = {};
            b.btSoftBodyArray = wF;
            wF.prototype.size = wF.prototype.size = function () {
                return hC(this.bB)
            };
            wF.prototype.at = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                return k(iC(c, a), Y)
            };
            wF.prototype.__destroy__ = function () {
                jC(this.bB)
            };

            function Z(a, c, d, e, g) {
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                this.bB = kC(a, c, d, e, g);
                h(Z)[this.bB] = this
            }

            Z.prototype = Object.create(x.prototype);
            Z.prototype.constructor = Z;
            Z.prototype.cB = Z;
            Z.dB = {};
            b.btSoftRigidDynamicsWorld = Z;
            Z.prototype.addSoftBody = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                lC(e, a, c, d)
            };
            Z.prototype.removeSoftBody = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                mC(c, a)
            };
            Z.prototype.removeCollisionObject = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                nC(c, a)
            };
            Z.prototype.getWorldInfo = function () {
                return k(oC(this.bB), S)
            };
            Z.prototype.getSoftBodyArray = function () {
                return k(pC(this.bB), wF)
            };
            Z.prototype.getDispatcher = function () {
                return k(qC(this.bB), JD)
            };
            Z.prototype.rayTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                rC(e, a, c, d)
            };
            Z.prototype.getPairCache = function () {
                return k(sC(this.bB), KD)
            };
            Z.prototype.getDispatchInfo = function () {
                return k(tC(this.bB), p)
            };
            Z.prototype.addCollisionObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? uC(e, a) : void 0 === d ? vC(e, a, c) : wC(e, a, c, d)
            };
            Z.prototype.getBroadphase = function () {
                return k(xC(this.bB), LD)
            };
            Z.prototype.convexSweepTest = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                yC(n, a, c, d, e, g)
            };
            Z.prototype.contactPairTest = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                zC(e, a, c, d)
            };
            Z.prototype.contactTest = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                AC(d, a, c)
            };
            Z.prototype.updateSingleAabb = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                BC(c, a)
            };
            Z.prototype.setDebugDrawer = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                CC(c, a)
            };
            Z.prototype.getDebugDrawer = function () {
                return k(DC(this.bB), MD)
            };
            Z.prototype.debugDrawWorld = function () {
                EC(this.bB)
            };
            Z.prototype.debugDrawObject = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                FC(e, a, c, d)
            };
            Z.prototype.setGravity = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                GC(c, a)
            };
            Z.prototype.getGravity = function () {
                return k(HC(this.bB), m)
            };
            Z.prototype.addRigidBody = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? IC(e, a) : void 0 === d ? _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(e, a, c) : JC(e, a, c, d)
            };
            Z.prototype.removeRigidBody = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                KC(c, a)
            };
            Z.prototype.addConstraint = function (a, c) {
                var d = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                void 0 === c ? LC(d, a) : MC(d, a, c)
            };
            Z.prototype.removeConstraint = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                NC(c, a)
            };
            Z.prototype.stepSimulation = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                return void 0 === c ? OC(e, a) : void 0 === d ? PC(e, a, c) : QC(e, a, c, d)
            };
            Z.prototype.setContactAddedCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                RC(c, a)
            };
            Z.prototype.setContactProcessedCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                SC(c, a)
            };
            Z.prototype.setContactDestroyedCallback = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                TC(c, a)
            };
            Z.prototype.addAction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                UC(c, a)
            };
            Z.prototype.removeAction = function (a) {
                var c = this.bB;
                a && "object" === typeof a && (a = a.bB);
                VC(c, a)
            };
            Z.prototype.getSolverInfo = function () {
                return k(WC(this.bB), t)
            };
            Z.prototype.setInternalTickCallback = function (a, c, d) {
                var e = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                void 0 === c ? XC(e, a) : void 0 === d ? YC(e, a, c) : ZC(e, a, c, d)
            };
            Z.prototype.__destroy__ = function () {
                $C(this.bB)
            };

            function xF() {
                this.bB = aD();
                h(xF)[this.bB] = this
            }

            xF.prototype = Object.create(f.prototype);
            xF.prototype.constructor = xF;
            xF.prototype.cB = xF;
            xF.dB = {};
            b.btSoftBodyHelpers = xF;
            xF.prototype.CreateRope = function (a, c, d, e, g) {
                var n = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                return k(bD(n, a, c, d, e, g), Y)
            };
            xF.prototype.CreatePatch = function (a, c, d, e, g, n, D, T, Da) {
                var dc = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                T && "object" === typeof T && (T = T.bB);
                Da && "object" === typeof Da && (Da = Da.bB);
                return k(cD(dc, a, c, d, e, g, n, D, T, Da), Y)
            };
            xF.prototype.CreatePatchUV = function (a, c, d, e, g, n, D, T, Da, dc) {
                var yF = this.bB;
                DD();
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                n && "object" === typeof n && (n = n.bB);
                D && "object" === typeof D && (D = D.bB);
                T && "object" === typeof T && (T = T.bB);
                Da && "object" === typeof Da && (Da = Da.bB);
                "object" == typeof dc && (dc = HD(dc));
                return k(dD(yF, a, c, d, e, g, n, D, T, Da, dc), Y)
            };
            xF.prototype.CreateEllipsoid = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                return k(eD(g, a, c, d, e), Y)
            };
            xF.prototype.CreateFromTriMesh = function (a, c, d, e, g) {
                var n = this.bB;
                DD();
                a && "object" === typeof a && (a = a.bB);
                "object" == typeof c && (c = HD(c));
                if ("object" == typeof d && "object" === typeof d) {
                    var D = ED(d, xa);
                    FD(d, xa, D);
                    d = D
                }
                e && "object" === typeof e && (e = e.bB);
                g && "object" === typeof g && (g = g.bB);
                return k(fD(n, a, c, d, e, g), Y)
            };
            xF.prototype.CreateFromConvexHull = function (a, c, d, e) {
                var g = this.bB;
                a && "object" === typeof a && (a = a.bB);
                c && "object" === typeof c && (c = c.bB);
                d && "object" === typeof d && (d = d.bB);
                e && "object" === typeof e && (e = e.bB);
                return k(gD(g, a, c, d, e), Y)
            };
            xF.prototype.__destroy__ = function () {
                hD(this.bB)
            };
            (function () {
                function a() {
                    b.PHY_FLOAT = iD();
                    b.PHY_DOUBLE = jD();
                    b.PHY_INTEGER = kD();
                    b.PHY_SHORT = lD();
                    b.PHY_FIXEDPOINT88 = mD();
                    b.PHY_UCHAR = nD();
                    b.CONST_GIMPACT_COMPOUND_SHAPE = oD();
                    b.CONST_GIMPACT_TRIMESH_SHAPE_PART = pD();
                    b.CONST_GIMPACT_TRIMESH_SHAPE = qD();
                    b.BT_CONSTRAINT_ERP = rD();
                    b.BT_CONSTRAINT_STOP_ERP = sD();
                    b.BT_CONSTRAINT_CFM = tD();
                    b.BT_CONSTRAINT_STOP_CFM = uD()
                }

                Fa ? a() : Ca.unshift(a)
            })();
            b.CONTACT_ADDED_CALLBACK_SIGNATURE = "iiiiiiii";
            b.CONTACT_DESTROYED_CALLBACK_SIGNATURE = "ii";
            b.CONTACT_PROCESSED_CALLBACK_SIGNATURE = "iiii";
            b.INTERNAL_TICK_CALLBACK_SIGNATURE = "vif";
            this.Ammo = b;


            return Ammo.ready
        }
    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = Ammo;
else if (typeof define === 'function' && define['amd'])
    define([], function () {
        return Ammo;
    });
else if (typeof exports === 'object')
    exports["Ammo"] = Ammo;
