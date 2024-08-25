var qp = Object.defineProperty,
  Wp = Object.defineProperties
var Zp = Object.getOwnPropertyDescriptors
var Ic = Object.getOwnPropertySymbols
var Yp = Object.prototype.hasOwnProperty,
  Qp = Object.prototype.propertyIsEnumerable
var Ec = (t, e, r) =>
    e in t
      ? qp(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  g = (t, e) => {
    for (var r in (e ||= {})) Yp.call(e, r) && Ec(t, r, e[r])
    if (Ic) for (var r of Ic(e)) Qp.call(e, r) && Ec(t, r, e[r])
    return t
  },
  U = (t, e) => Wp(t, Zp(e))
var Kt = (t, e, r) =>
  new Promise((n, o) => {
    var i = u => {
        try {
          a(r.next(u))
        } catch (c) {
          o(c)
        }
      },
      s = u => {
        try {
          a(r.throw(u))
        } catch (c) {
          o(c)
        }
      },
      a = u => (u.done ? n(u.value) : Promise.resolve(u.value).then(i, s))
    a((r = r.apply(t, e)).next())
  })
var bc = null
var ts = 1,
  Mc = Symbol("SIGNAL")
function R(t) {
  let e = bc
  return (bc = t), e
}
var _c = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
}
function Kp(t) {
  if (!(os(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === ts)) {
    if (!t.producerMustRecompute(t) && !ns(t)) {
      ;(t.dirty = !1), (t.lastCleanEpoch = ts)
      return
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = ts)
  }
}
function Sc(t) {
  return t && (t.nextProducerIndex = 0), R(t)
}
function Ac(t, e) {
  if (
    (R(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (os(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        rs(t.producerNode[r], t.producerIndexOfThis[r])
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop()
  }
}
function ns(t) {
  zr(t)
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e]
    if (n !== r.version || (Kp(r), n !== r.version)) return !0
  }
  return !1
}
function xc(t) {
  if ((zr(t), os(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      rs(t.producerNode[e], t.producerIndexOfThis[e])
  ;(t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0)
}
function rs(t, e) {
  if ((Jp(t), zr(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      rs(t.producerNode[n], t.producerIndexOfThis[n])
  let r = t.liveConsumerNode.length - 1
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      o = t.liveConsumerNode[e]
    zr(o), (o.producerIndexOfThis[n] = e)
  }
}
function os(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0
}
function zr(t) {
  ;(t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= [])
}
function Jp(t) {
  ;(t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= [])
}
function Xp() {
  throw new Error()
}
var eg = Xp
function Tc(t) {
  eg = t
}
function E(t) {
  return typeof t == "function"
}
function Jt(t) {
  let r = t(n => {
    Error.call(n), (n.stack = new Error().stack)
  })
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  )
}
var qr = Jt(
  t =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, o) => `${o + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r)
    }
)
function Bn(t, e) {
  if (t) {
    let r = t.indexOf(e)
    0 <= r && t.splice(r, 1)
  }
}
var W = class t {
  constructor(e) {
    ;(this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null)
  }
  unsubscribe() {
    let e
    if (!this.closed) {
      this.closed = !0
      let { _parentage: r } = this
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let i of r) i.remove(this)
        else r.remove(this)
      let { initialTeardown: n } = this
      if (E(n))
        try {
          n()
        } catch (i) {
          e = i instanceof qr ? i.errors : [i]
        }
      let { _finalizers: o } = this
      if (o) {
        this._finalizers = null
        for (let i of o)
          try {
            Nc(i)
          } catch (s) {
            ;(e = e ?? []),
              s instanceof qr ? (e = [...e, ...s.errors]) : e.push(s)
          }
      }
      if (e) throw new qr(e)
    }
  }
  add(e) {
    var r
    if (e && e !== this)
      if (this.closed) Nc(e)
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return
          e._addParent(this)
        }
        ;(this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e)
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this
    return r === e || (Array.isArray(r) && r.includes(e))
  }
  _addParent(e) {
    let { _parentage: r } = this
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e
  }
  _removeParent(e) {
    let { _parentage: r } = this
    r === e ? (this._parentage = null) : Array.isArray(r) && Bn(r, e)
  }
  remove(e) {
    let { _finalizers: r } = this
    r && Bn(r, e), e instanceof t && e._removeParent(this)
  }
}
W.EMPTY = (() => {
  let t = new W()
  return (t.closed = !0), t
})()
var is = W.EMPTY
function Wr(t) {
  return (
    t instanceof W ||
    (t && "closed" in t && E(t.remove) && E(t.add) && E(t.unsubscribe))
  )
}
function Nc(t) {
  E(t) ? t() : t.unsubscribe()
}
var Ae = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var Xt = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = Xt
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r)
  },
  clearTimeout(t) {
    let { delegate: e } = Xt
    return (e?.clearTimeout || clearTimeout)(t)
  },
  delegate: void 0,
}
function Zr(t) {
  Xt.setTimeout(() => {
    let { onUnhandledError: e } = Ae
    if (e) e(t)
    else throw t
  })
}
function Hn() {}
var Oc = ss("C", void 0, void 0)
function Rc(t) {
  return ss("E", void 0, t)
}
function Fc(t) {
  return ss("N", t, void 0)
}
function ss(t, e, r) {
  return { kind: t, value: e, error: r }
}
var xt = null
function en(t) {
  if (Ae.useDeprecatedSynchronousErrorHandling) {
    let e = !xt
    if ((e && (xt = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = xt
      if (((xt = null), r)) throw n
    }
  } else t()
}
function Pc(t) {
  Ae.useDeprecatedSynchronousErrorHandling &&
    xt &&
    ((xt.errorThrown = !0), (xt.error = t))
}
var Tt = class extends W {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Wr(e) && e.add(this))
          : (this.destination = rg)
    }
    static create(e, r, n) {
      return new tn(e, r, n)
    }
    next(e) {
      this.isStopped ? us(Fc(e), this) : this._next(e)
    }
    error(e) {
      this.isStopped ? us(Rc(e), this) : ((this.isStopped = !0), this._error(e))
    }
    complete() {
      this.isStopped ? us(Oc, this) : ((this.isStopped = !0), this._complete())
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null))
    }
    _next(e) {
      this.destination.next(e)
    }
    _error(e) {
      try {
        this.destination.error(e)
      } finally {
        this.unsubscribe()
      }
    }
    _complete() {
      try {
        this.destination.complete()
      } finally {
        this.unsubscribe()
      }
    }
  },
  tg = Function.prototype.bind
function as(t, e) {
  return tg.call(t, e)
}
var cs = class {
    constructor(e) {
      this.partialObserver = e
    }
    next(e) {
      let { partialObserver: r } = this
      if (r.next)
        try {
          r.next(e)
        } catch (n) {
          Yr(n)
        }
    }
    error(e) {
      let { partialObserver: r } = this
      if (r.error)
        try {
          r.error(e)
        } catch (n) {
          Yr(n)
        }
      else Yr(e)
    }
    complete() {
      let { partialObserver: e } = this
      if (e.complete)
        try {
          e.complete()
        } catch (r) {
          Yr(r)
        }
    }
  },
  tn = class extends Tt {
    constructor(e, r, n) {
      super()
      let o
      if (E(e) || !e)
        o = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 }
      else {
        let i
        this && Ae.useDeprecatedNextContext
          ? ((i = Object.create(e)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: e.next && as(e.next, i),
              error: e.error && as(e.error, i),
              complete: e.complete && as(e.complete, i),
            }))
          : (o = e)
      }
      this.destination = new cs(o)
    }
  }
function Yr(t) {
  Ae.useDeprecatedSynchronousErrorHandling ? Pc(t) : Zr(t)
}
function ng(t) {
  throw t
}
function us(t, e) {
  let { onStoppedNotification: r } = Ae
  r && Xt.setTimeout(() => r(t, e))
}
var rg = { closed: !0, next: Hn, error: ng, complete: Hn }
var nn = (typeof Symbol == "function" && Symbol.observable) || "@@observable"
function he(t) {
  return t
}
function ls(...t) {
  return ds(t)
}
function ds(t) {
  return t.length === 0
    ? he
    : t.length === 1
      ? t[0]
      : function (r) {
          return t.reduce((n, o) => o(n), r)
        }
}
var F = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r)
    }
    lift(r) {
      let n = new t()
      return (n.source = this), (n.operator = r), n
    }
    subscribe(r, n, o) {
      let i = ig(r) ? r : new tn(r, n, o)
      return (
        en(() => {
          let { operator: s, source: a } = this
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          )
        }),
        i
      )
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r)
      } catch (n) {
        r.error(n)
      }
    }
    forEach(r, n) {
      return (
        (n = kc(n)),
        new n((o, i) => {
          let s = new tn({
            next: a => {
              try {
                r(a)
              } catch (u) {
                i(u), s.unsubscribe()
              }
            },
            error: i,
            complete: o,
          })
          this.subscribe(s)
        })
      )
    }
    _subscribe(r) {
      var n
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r)
    }
    [nn]() {
      return this
    }
    pipe(...r) {
      return ds(r)(this)
    }
    toPromise(r) {
      return (
        (r = kc(r)),
        new r((n, o) => {
          let i
          this.subscribe(
            s => (i = s),
            s => o(s),
            () => n(i)
          )
        })
      )
    }
  }
  return (t.create = e => new t(e)), t
})()
function kc(t) {
  var e
  return (e = t ?? Ae.Promise) !== null && e !== void 0 ? e : Promise
}
function og(t) {
  return t && E(t.next) && E(t.error) && E(t.complete)
}
function ig(t) {
  return (t && t instanceof Tt) || (og(t) && Wr(t))
}
function fs(t) {
  return E(t?.lift)
}
function N(t) {
  return e => {
    if (fs(e))
      return e.lift(function (r) {
        try {
          return t(r, this)
        } catch (n) {
          this.error(n)
        }
      })
    throw new TypeError("Unable to lift unknown Observable type")
  }
}
function A(t, e, r, n, o) {
  return new hs(t, e, r, n, o)
}
var hs = class extends Tt {
  constructor(e, r, n, o, i, s) {
    super(e),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a)
            } catch (u) {
              e.error(u)
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a)
            } catch (u) {
              e.error(u)
            } finally {
              this.unsubscribe()
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n()
            } catch (a) {
              e.error(a)
            } finally {
              this.unsubscribe()
            }
          }
        : super._complete)
  }
  unsubscribe() {
    var e
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this))
    }
  }
}
function rn() {
  return N((t, e) => {
    let r = null
    t._refCount++
    let n = A(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null
        return
      }
      let o = t._connection,
        i = r
      ;(r = null), o && (!i || o === i) && o.unsubscribe(), e.unsubscribe()
    })
    t.subscribe(n), n.closed || (r = t.connect())
  })
}
var on = class extends F {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      fs(e) && (this.lift = e.lift)
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e)
  }
  getSubject() {
    let e = this._subject
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    )
  }
  _teardown() {
    this._refCount = 0
    let { _connection: e } = this
    ;(this._subject = this._connection = null), e?.unsubscribe()
  }
  connect() {
    let e = this._connection
    if (!e) {
      e = this._connection = new W()
      let r = this.getSubject()
      e.add(
        this.source.subscribe(
          A(
            r,
            void 0,
            () => {
              this._teardown(), r.complete()
            },
            n => {
              this._teardown(), r.error(n)
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = W.EMPTY))
    }
    return e
  }
  refCount() {
    return rn()(this)
  }
}
var Lc = Jt(
  t =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed")
    }
)
var ee = (() => {
    class t extends F {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null)
      }
      lift(r) {
        let n = new Qr(this, this)
        return (n.operator = r), n
      }
      _throwIfClosed() {
        if (this.closed) throw new Lc()
      }
      next(r) {
        en(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let n of this.currentObservers) n.next(r)
          }
        })
      }
      error(r) {
        en(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = r)
            let { observers: n } = this
            for (; n.length; ) n.shift().error(r)
          }
        })
      }
      complete() {
        en(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0
            let { observers: r } = this
            for (; r.length; ) r.shift().complete()
          }
        })
      }
      unsubscribe() {
        ;(this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null)
      }
      get observed() {
        var r
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        )
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r)
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        )
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: o, observers: i } = this
        return n || o
          ? is
          : ((this.currentObservers = null),
            i.push(r),
            new W(() => {
              ;(this.currentObservers = null), Bn(i, r)
            }))
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: o, isStopped: i } = this
        n ? r.error(o) : i && r.complete()
      }
      asObservable() {
        let r = new F()
        return (r.source = this), r
      }
    }
    return (t.create = (e, r) => new Qr(e, r)), t
  })(),
  Qr = class extends ee {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r)
    }
    next(e) {
      var r, n
      ;(n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e)
    }
    error(e) {
      var r, n
      ;(n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e)
    }
    complete() {
      var e, r
      ;(r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e)
    }
    _subscribe(e) {
      var r, n
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : is
    }
  }
var K = class extends ee {
  constructor(e) {
    super(), (this._value = e)
  }
  get value() {
    return this.getValue()
  }
  _subscribe(e) {
    let r = super._subscribe(e)
    return !r.closed && e.next(this._value), r
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this
    if (e) throw r
    return this._throwIfClosed(), n
  }
  next(e) {
    super.next((this._value = e))
  }
}
var pe = new F(t => t.complete())
function Vc(t) {
  return t && E(t.schedule)
}
function jc(t) {
  return t[t.length - 1]
}
function Kr(t) {
  return E(jc(t)) ? t.pop() : void 0
}
function lt(t) {
  return Vc(jc(t)) ? t.pop() : void 0
}
function Uc(t, e, r, n) {
  function o(i) {
    return i instanceof r
      ? i
      : new r(function (s) {
          s(i)
        })
  }
  return new (r || (r = Promise))(function (i, s) {
    function a(l) {
      try {
        c(n.next(l))
      } catch (d) {
        s(d)
      }
    }
    function u(l) {
      try {
        c(n.throw(l))
      } catch (d) {
        s(d)
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, u)
    }
    c((n = n.apply(t, e || [])).next())
  })
}
function $c(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0
  if (r) return r.call(t)
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        )
      },
    }
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  )
}
function Nt(t) {
  return this instanceof Nt ? ((this.v = t), this) : new Nt(t)
}
function Bc(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.")
  var n = r.apply(t, e || []),
    o,
    i = []
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this
    }),
    o
  )
  function s(f) {
    return function (m) {
      return Promise.resolve(m).then(f, d)
    }
  }
  function a(f, m) {
    n[f] &&
      ((o[f] = function (M) {
        return new Promise(function (B, O) {
          i.push([f, M, B, O]) > 1 || u(f, M)
        })
      }),
      m && (o[f] = m(o[f])))
  }
  function u(f, m) {
    try {
      c(n[f](m))
    } catch (M) {
      h(i[0][3], M)
    }
  }
  function c(f) {
    f.value instanceof Nt
      ? Promise.resolve(f.value.v).then(l, d)
      : h(i[0][2], f)
  }
  function l(f) {
    u("next", f)
  }
  function d(f) {
    u("throw", f)
  }
  function h(f, m) {
    f(m), i.shift(), i.length && u(i[0][0], i[0][1])
  }
}
function Hc(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.")
  var e = t[Symbol.asyncIterator],
    r
  return e
    ? e.call(t)
    : ((t = typeof $c == "function" ? $c(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this
      }),
      r)
  function n(i) {
    r[i] =
      t[i] &&
      function (s) {
        return new Promise(function (a, u) {
          ;(s = t[i](s)), o(a, u, s.done, s.value)
        })
      }
  }
  function o(i, s, a, u) {
    Promise.resolve(u).then(function (c) {
      i({ value: c, done: a })
    }, s)
  }
}
var Jr = t => t && typeof t.length == "number" && typeof t != "function"
function Xr(t) {
  return E(t?.then)
}
function eo(t) {
  return E(t[nn])
}
function to(t) {
  return Symbol.asyncIterator && E(t?.[Symbol.asyncIterator])
}
function no(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  )
}
function sg() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator
}
var ro = sg()
function oo(t) {
  return E(t?.[ro])
}
function io(t) {
  return Bc(this, arguments, function* () {
    let r = t.getReader()
    try {
      for (;;) {
        let { value: n, done: o } = yield Nt(r.read())
        if (o) return yield Nt(void 0)
        yield yield Nt(n)
      }
    } finally {
      r.releaseLock()
    }
  })
}
function so(t) {
  return E(t?.getReader)
}
function z(t) {
  if (t instanceof F) return t
  if (t != null) {
    if (eo(t)) return ag(t)
    if (Jr(t)) return ug(t)
    if (Xr(t)) return cg(t)
    if (to(t)) return Gc(t)
    if (oo(t)) return lg(t)
    if (so(t)) return dg(t)
  }
  throw no(t)
}
function ag(t) {
  return new F(e => {
    let r = t[nn]()
    if (E(r.subscribe)) return r.subscribe(e)
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    )
  })
}
function ug(t) {
  return new F(e => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r])
    e.complete()
  })
}
function cg(t) {
  return new F(e => {
    t.then(
      r => {
        e.closed || (e.next(r), e.complete())
      },
      r => e.error(r)
    ).then(null, Zr)
  })
}
function lg(t) {
  return new F(e => {
    for (let r of t) if ((e.next(r), e.closed)) return
    e.complete()
  })
}
function Gc(t) {
  return new F(e => {
    fg(t, e).catch(r => e.error(r))
  })
}
function dg(t) {
  return Gc(io(t))
}
function fg(t, e) {
  var r, n, o, i
  return Uc(this, void 0, void 0, function* () {
    try {
      for (r = Hc(t); (n = yield r.next()), !n.done; ) {
        let s = n.value
        if ((e.next(s), e.closed)) return
      }
    } catch (s) {
      o = { error: s }
    } finally {
      try {
        n && !n.done && (i = r.return) && (yield i.call(r))
      } finally {
        if (o) throw o.error
      }
    }
    e.complete()
  })
}
function ae(t, e, r, n = 0, o = !1) {
  let i = e.schedule(function () {
    r(), o ? t.add(this.schedule(null, n)) : this.unsubscribe()
  }, n)
  if ((t.add(i), !o)) return i
}
function ao(t, e = 0) {
  return N((r, n) => {
    r.subscribe(
      A(
        n,
        o => ae(n, t, () => n.next(o), e),
        () => ae(n, t, () => n.complete(), e),
        o => ae(n, t, () => n.error(o), e)
      )
    )
  })
}
function uo(t, e = 0) {
  return N((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e))
  })
}
function zc(t, e) {
  return z(t).pipe(uo(e), ao(e))
}
function qc(t, e) {
  return z(t).pipe(uo(e), ao(e))
}
function Wc(t, e) {
  return new F(r => {
    let n = 0
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule())
    })
  })
}
function Zc(t, e) {
  return new F(r => {
    let n
    return (
      ae(r, e, () => {
        ;(n = t[ro]()),
          ae(
            r,
            e,
            () => {
              let o, i
              try {
                ;({ value: o, done: i } = n.next())
              } catch (s) {
                r.error(s)
                return
              }
              i ? r.complete() : r.next(o)
            },
            0,
            !0
          )
      }),
      () => E(n?.return) && n.return()
    )
  })
}
function co(t, e) {
  if (!t) throw new Error("Iterable cannot be null")
  return new F(r => {
    ae(r, e, () => {
      let n = t[Symbol.asyncIterator]()
      ae(
        r,
        e,
        () => {
          n.next().then(o => {
            o.done ? r.complete() : r.next(o.value)
          })
        },
        0,
        !0
      )
    })
  })
}
function Yc(t, e) {
  return co(io(t), e)
}
function Qc(t, e) {
  if (t != null) {
    if (eo(t)) return zc(t, e)
    if (Jr(t)) return Wc(t, e)
    if (Xr(t)) return qc(t, e)
    if (to(t)) return co(t, e)
    if (oo(t)) return Zc(t, e)
    if (so(t)) return Yc(t, e)
  }
  throw no(t)
}
function G(t, e) {
  return e ? Qc(t, e) : z(t)
}
function D(...t) {
  let e = lt(t)
  return G(t, e)
}
function sn(t, e) {
  let r = E(t) ? t : () => t,
    n = o => o.error(r())
  return new F(e ? o => e.schedule(n, 0, o) : n)
}
function ps(t) {
  return !!t && (t instanceof F || (E(t.lift) && E(t.subscribe)))
}
var Je = Jt(
  t =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence")
    }
)
function x(t, e) {
  return N((r, n) => {
    let o = 0
    r.subscribe(
      A(n, i => {
        n.next(t.call(e, i, o++))
      })
    )
  })
}
var { isArray: hg } = Array
function pg(t, e) {
  return hg(e) ? t(...e) : t(e)
}
function lo(t) {
  return x(e => pg(t, e))
}
var { isArray: gg } = Array,
  { getPrototypeOf: mg, prototype: vg, keys: yg } = Object
function fo(t) {
  if (t.length === 1) {
    let e = t[0]
    if (gg(e)) return { args: e, keys: null }
    if (Dg(e)) {
      let r = yg(e)
      return { args: r.map(n => e[n]), keys: r }
    }
  }
  return { args: t, keys: null }
}
function Dg(t) {
  return t && typeof t == "object" && mg(t) === vg
}
function ho(t, e) {
  return t.reduce((r, n, o) => ((r[n] = e[o]), r), {})
}
function Gn(...t) {
  let e = lt(t),
    r = Kr(t),
    { args: n, keys: o } = fo(t)
  if (n.length === 0) return G([], e)
  let i = new F(Cg(n, e, o ? s => ho(o, s) : he))
  return r ? i.pipe(lo(r)) : i
}
function Cg(t, e, r = he) {
  return n => {
    Kc(
      e,
      () => {
        let { length: o } = t,
          i = new Array(o),
          s = o,
          a = o
        for (let u = 0; u < o; u++)
          Kc(
            e,
            () => {
              let c = G(t[u], e),
                l = !1
              c.subscribe(
                A(
                  n,
                  d => {
                    ;(i[u] = d), l || ((l = !0), a--), a || n.next(r(i.slice()))
                  },
                  () => {
                    --s || n.complete()
                  }
                )
              )
            },
            n
          )
      },
      n
    )
  }
}
function Kc(t, e, r) {
  t ? ae(r, t, e) : e()
}
function Jc(t, e, r, n, o, i, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !u.length && !c && e.complete()
    },
    f = M => (c < n ? m(M) : u.push(M)),
    m = M => {
      i && e.next(M), c++
      let B = !1
      z(r(M, l++)).subscribe(
        A(
          e,
          O => {
            o?.(O), i ? f(O) : e.next(O)
          },
          () => {
            B = !0
          },
          void 0,
          () => {
            if (B)
              try {
                for (c--; u.length && c < n; ) {
                  let O = u.shift()
                  s ? ae(e, s, () => m(O)) : m(O)
                }
                h()
              } catch (O) {
                e.error(O)
              }
          }
        )
      )
    }
  return (
    t.subscribe(
      A(e, f, () => {
        ;(d = !0), h()
      })
    ),
    () => {
      a?.()
    }
  )
}
function q(t, e, r = 1 / 0) {
  return E(e)
    ? q((n, o) => x((i, s) => e(n, i, o, s))(z(t(n, o))), r)
    : (typeof e == "number" && (r = e), N((n, o) => Jc(n, o, t, r)))
}
function an(t = 1 / 0) {
  return q(he, t)
}
function Xc() {
  return an(1)
}
function un(...t) {
  return Xc()(G(t, lt(t)))
}
function po(t) {
  return new F(e => {
    z(t()).subscribe(e)
  })
}
function gs(...t) {
  let e = Kr(t),
    { args: r, keys: n } = fo(t),
    o = new F(i => {
      let { length: s } = r
      if (!s) {
        i.complete()
        return
      }
      let a = new Array(s),
        u = s,
        c = s
      for (let l = 0; l < s; l++) {
        let d = !1
        z(r[l]).subscribe(
          A(
            i,
            h => {
              d || ((d = !0), c--), (a[l] = h)
            },
            () => u--,
            void 0,
            () => {
              ;(!u || !d) && (c || i.next(n ? ho(n, a) : a), i.complete())
            }
          )
        )
      }
    })
  return e ? o.pipe(lo(e)) : o
}
function ye(t, e) {
  return N((r, n) => {
    let o = 0
    r.subscribe(A(n, i => t.call(e, i, o++) && n.next(i)))
  })
}
function dt(t) {
  return N((e, r) => {
    let n = null,
      o = !1,
      i
    ;(n = e.subscribe(
      A(r, void 0, void 0, s => {
        ;(i = z(t(s, dt(t)(e)))),
          n ? (n.unsubscribe(), (n = null), i.subscribe(r)) : (o = !0)
      })
    )),
      o && (n.unsubscribe(), (n = null), i.subscribe(r))
  })
}
function el(t, e, r, n, o) {
  return (i, s) => {
    let a = r,
      u = e,
      c = 0
    i.subscribe(
      A(
        s,
        l => {
          let d = c++
          ;(u = a ? t(u, l, d) : ((a = !0), l)), n && s.next(u)
        },
        o &&
          (() => {
            a && s.next(u), s.complete()
          })
      )
    )
  }
}
function Ot(t, e) {
  return E(e) ? q(t, e, 1) : q(t, 1)
}
function ft(t) {
  return N((e, r) => {
    let n = !1
    e.subscribe(
      A(
        r,
        o => {
          ;(n = !0), r.next(o)
        },
        () => {
          n || r.next(t), r.complete()
        }
      )
    )
  })
}
function Xe(t) {
  return t <= 0
    ? () => pe
    : N((e, r) => {
        let n = 0
        e.subscribe(
          A(r, o => {
            ++n <= t && (r.next(o), t <= n && r.complete())
          })
        )
      })
}
function ms(t) {
  return x(() => t)
}
function go(t = wg) {
  return N((e, r) => {
    let n = !1
    e.subscribe(
      A(
        r,
        o => {
          ;(n = !0), r.next(o)
        },
        () => (n ? r.complete() : r.error(t()))
      )
    )
  })
}
function wg() {
  return new Je()
}
function zn(t) {
  return N((e, r) => {
    try {
      e.subscribe(r)
    } finally {
      r.add(t)
    }
  })
}
function Pe(t, e) {
  let r = arguments.length >= 2
  return n =>
    n.pipe(
      t ? ye((o, i) => t(o, i, n)) : he,
      Xe(1),
      r ? ft(e) : go(() => new Je())
    )
}
function cn(t) {
  return t <= 0
    ? () => pe
    : N((e, r) => {
        let n = []
        e.subscribe(
          A(
            r,
            o => {
              n.push(o), t < n.length && n.shift()
            },
            () => {
              for (let o of n) r.next(o)
              r.complete()
            },
            void 0,
            () => {
              n = null
            }
          )
        )
      })
}
function vs(t, e) {
  let r = arguments.length >= 2
  return n =>
    n.pipe(
      t ? ye((o, i) => t(o, i, n)) : he,
      cn(1),
      r ? ft(e) : go(() => new Je())
    )
}
function ys(t, e) {
  return N(el(t, e, arguments.length >= 2, !0))
}
function Ds(...t) {
  let e = lt(t)
  return N((r, n) => {
    ;(e ? un(t, r, e) : un(t, r)).subscribe(n)
  })
}
function De(t, e) {
  return N((r, n) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && n.complete()
    r.subscribe(
      A(
        n,
        u => {
          o?.unsubscribe()
          let c = 0,
            l = i++
          z(t(u, l)).subscribe(
            (o = A(
              n,
              d => n.next(e ? e(u, d, l, c++) : d),
              () => {
                ;(o = null), a()
              }
            ))
          )
        },
        () => {
          ;(s = !0), a()
        }
      )
    )
  })
}
function Cs(t) {
  return N((e, r) => {
    z(t).subscribe(A(r, () => r.complete(), Hn)), !r.closed && e.subscribe(r)
  })
}
function J(t, e, r) {
  let n = E(t) || e || r ? { next: t, error: e, complete: r } : t
  return n
    ? N((o, i) => {
        var s
        ;(s = n.subscribe) === null || s === void 0 || s.call(n)
        let a = !0
        o.subscribe(
          A(
            i,
            u => {
              var c
              ;(c = n.next) === null || c === void 0 || c.call(n, u), i.next(u)
            },
            () => {
              var u
              ;(a = !1),
                (u = n.complete) === null || u === void 0 || u.call(n),
                i.complete()
            },
            u => {
              var c
              ;(a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, u),
                i.error(u)
            },
            () => {
              var u, c
              a && ((u = n.unsubscribe) === null || u === void 0 || u.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n)
            }
          )
        )
      })
    : he
}
var jl = "https://g.co/ng/security#xss",
  v = class extends Error {
    constructor(e, r) {
      super(Ea(e, r)), (this.code = e)
    }
  }
function Ea(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`
}
function rr(t) {
  return { toString: t }.toString()
}
var mo = "__parameters__"
function Ig(t) {
  return function (...r) {
    if (t) {
      let n = t(...r)
      for (let o in n) this[o] = n[o]
    }
  }
}
function $l(t, e, r) {
  return rr(() => {
    let n = Ig(e)
    function o(...i) {
      if (this instanceof o) return n.apply(this, i), this
      let s = new o(...i)
      return (a.annotation = s), a
      function a(u, c, l) {
        let d = u.hasOwnProperty(mo)
          ? u[mo]
          : Object.defineProperty(u, mo, { value: [] })[mo]
        for (; d.length <= l; ) d.push(null)
        return (d[l] = d[l] || []).push(s), u
      }
    }
    return (
      r && (o.prototype = Object.create(r.prototype)),
      (o.prototype.ngMetadataName = t),
      (o.annotationCls = o),
      o
    )
  })
}
var ue = globalThis
function j(t) {
  for (let e in t) if (t[e] === j) return e
  throw Error("Could not find renamed property on target object.")
}
function Eg(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r])
}
function ce(t) {
  if (typeof t == "string") return t
  if (Array.isArray(t)) return "[" + t.map(ce).join(", ") + "]"
  if (t == null) return "" + t
  if (t.overriddenName) return `${t.overriddenName}`
  if (t.name) return `${t.name}`
  let e = t.toString()
  if (e == null) return "" + e
  let r = e.indexOf(`
`)
  return r === -1 ? e : e.substring(0, r)
}
function tl(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
      ? t
      : t + " " + e
}
var bg = j({ __forward_ref__: j })
function _n(t) {
  return (
    (t.__forward_ref__ = _n),
    (t.toString = function () {
      return ce(this())
    }),
    t
  )
}
function ie(t) {
  return Ul(t) ? t() : t
}
function Ul(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(bg) && t.__forward_ref__ === _n
  )
}
function y(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  }
}
function yt(t) {
  return { providers: t.providers || [], imports: t.imports || [] }
}
function qo(t) {
  return nl(t, Hl) || nl(t, Gl)
}
function Bl(t) {
  return qo(t) !== null
}
function nl(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null
}
function Mg(t) {
  let e = t && (t[Hl] || t[Gl])
  return e || null
}
function rl(t) {
  return t && (t.hasOwnProperty(ol) || t.hasOwnProperty(_g)) ? t[ol] : null
}
var Hl = j({ ɵprov: j }),
  ol = j({ ɵinj: j }),
  Gl = j({ ngInjectableDef: j }),
  _g = j({ ngInjectorDef: j }),
  w = class {
    constructor(e, r) {
      ;(this._desc = e),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof r == "number"
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = y({
              token: this,
              providedIn: r.providedIn || "root",
              factory: r.factory,
            }))
    }
    get multi() {
      return this
    }
    toString() {
      return `InjectionToken ${this._desc}`
    }
  }
function zl(t) {
  return t && !!t.ɵproviders
}
var Sg = j({ ɵcmp: j }),
  Ag = j({ ɵdir: j }),
  xg = j({ ɵpipe: j }),
  Tg = j({ ɵmod: j }),
  Mo = j({ ɵfac: j }),
  qn = j({ __NG_ELEMENT_ID__: j }),
  il = j({ __NG_ENV_ID__: j })
function mn(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t)
}
function Ng(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
      ? t.type.name || t.type.toString()
      : mn(t)
}
function Og(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : ""
  throw new v(-200, t)
}
function ba(t, e) {
  throw new v(-201, !1)
}
var _ = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    )
  })(_ || {}),
  ks
function ql() {
  return ks
}
function Ce(t) {
  let e = ks
  return (ks = t), e
}
function Wl(t, e, r) {
  let n = qo(t)
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value
  if (r & _.Optional) return null
  if (e !== void 0) return e
  ba(t, "Injector")
}
var Rg = {},
  Wn = Rg,
  Ls = "__NG_DI_FLAG__",
  _o = "ngTempTokenPath",
  Fg = "ngTokenPath",
  Pg = /\n/gm,
  kg = "\u0275",
  sl = "__source",
  pn
function Lg() {
  return pn
}
function ht(t) {
  let e = pn
  return (pn = t), e
}
function Vg(t, e = _.Default) {
  if (pn === void 0) throw new v(-203, !1)
  return pn === null
    ? Wl(t, void 0, e)
    : pn.get(t, e & _.Optional ? null : void 0, e)
}
function I(t, e = _.Default) {
  return (ql() || Vg)(ie(t), e)
}
function p(t, e = _.Default) {
  return I(t, Wo(e))
}
function Wo(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
}
function Vs(t) {
  let e = []
  for (let r = 0; r < t.length; r++) {
    let n = ie(t[r])
    if (Array.isArray(n)) {
      if (n.length === 0) throw new v(900, !1)
      let o,
        i = _.Default
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          u = jg(a)
        typeof u == "number" ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a)
      }
      e.push(I(o, i))
    } else e.push(I(n))
  }
  return e
}
function Zl(t, e) {
  return (t[Ls] = e), (t.prototype[Ls] = e), t
}
function jg(t) {
  return t[Ls]
}
function $g(t, e, r, n) {
  let o = t[_o]
  throw (
    (e[sl] && o.unshift(e[sl]),
    (t.message = Ug(
      `
` + t.message,
      o,
      r,
      n
    )),
    (t[Fg] = o),
    (t[_o] = null),
    t)
  )
}
function Ug(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == kg
      ? t.slice(2)
      : t
  let o = ce(e)
  if (Array.isArray(e)) o = e.map(ce).join(" -> ")
  else if (typeof e == "object") {
    let i = []
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s]
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ce(a)))
      }
    o = `{${i.join(", ")}}`
  }
  return `${r}${n ? "(" + n + ")" : ""}[${o}]: ${t.replace(
    Pg,
    `
  `
  )}`
}
var Zo = Zl($l("Optional"), 8)
var Ma = Zl($l("SkipSelf"), 4)
function vn(t, e) {
  let r = t.hasOwnProperty(Mo)
  return r ? t[Mo] : null
}
function _a(t, e) {
  t.forEach(r => (Array.isArray(r) ? _a(r, e) : e(r)))
}
function Yl(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r)
}
function So(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
}
function Bg(t, e, r, n) {
  let o = t.length
  if (o == e) t.push(r, n)
  else if (o === 1) t.push(n, t[0]), (t[0] = r)
  else {
    for (o--, t.push(t[o - 1], t[o]); o > e; ) {
      let i = o - 2
      ;(t[o] = t[i]), o--
    }
    ;(t[e] = r), (t[e + 1] = n)
  }
}
function Hg(t, e, r) {
  let n = or(t, e)
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), Bg(t, n, e, r)), n
}
function ws(t, e) {
  let r = or(t, e)
  if (r >= 0) return t[r | 1]
}
function or(t, e) {
  return Gg(t, e, 1)
}
function Gg(t, e, r) {
  let n = 0,
    o = t.length >> r
  for (; o !== n; ) {
    let i = n + ((o - n) >> 1),
      s = t[i << r]
    if (e === s) return i << r
    s > e ? (o = i) : (n = i + 1)
  }
  return ~(o << r)
}
var yn = {},
  we = [],
  Dn = new w(""),
  Ql = new w("", -1),
  Kl = new w(""),
  Ao = class {
    get(e, r = Wn) {
      if (r === Wn) {
        let n = new Error(`NullInjectorError: No provider for ${ce(e)}!`)
        throw ((n.name = "NullInjectorError"), n)
      }
      return r
    }
  },
  Jl = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t
  })(Jl || {}),
  Ve = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    )
  })(Ve || {}),
  ne = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    )
  })(ne || {})
function zg(t, e, r) {
  let n = t.length
  for (;;) {
    let o = t.indexOf(e, r)
    if (o === -1) return o
    if (o === 0 || t.charCodeAt(o - 1) <= 32) {
      let i = e.length
      if (o + i === n || t.charCodeAt(o + i) <= 32) return o
    }
    r = o + 1
  }
}
function js(t, e, r) {
  let n = 0
  for (; n < r.length; ) {
    let o = r[n]
    if (typeof o == "number") {
      if (o !== 0) break
      n++
      let i = r[n++],
        s = r[n++],
        a = r[n++]
      t.setAttribute(e, s, a, i)
    } else {
      let i = o,
        s = r[++n]
      qg(i) ? t.setProperty(e, i, s) : t.setAttribute(e, i, s), n++
    }
  }
  return n
}
function Xl(t) {
  return t === 3 || t === 4 || t === 6
}
function qg(t) {
  return t.charCodeAt(0) === 64
}
function Zn(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice()
    else {
      let r = -1
      for (let n = 0; n < e.length; n++) {
        let o = e[n]
        typeof o == "number"
          ? (r = o)
          : r === 0 ||
            (r === -1 || r === 2
              ? al(t, r, o, null, e[++n])
              : al(t, r, o, null, null))
      }
    }
  return t
}
function al(t, e, r, n, o) {
  let i = 0,
    s = t.length
  if (e === -1) s = -1
  else
    for (; i < t.length; ) {
      let a = t[i++]
      if (typeof a == "number") {
        if (a === e) {
          s = -1
          break
        } else if (a > e) {
          s = i - 1
          break
        }
      }
    }
  for (; i < t.length; ) {
    let a = t[i]
    if (typeof a == "number") break
    if (a === r) {
      if (n === null) {
        o !== null && (t[i + 1] = o)
        return
      } else if (n === t[i + 1]) {
        t[i + 2] = o
        return
      }
    }
    i++, n !== null && i++, o !== null && i++
  }
  s !== -1 && (t.splice(s, 0, e), (i = s + 1)),
    t.splice(i++, 0, r),
    n !== null && t.splice(i++, 0, n),
    o !== null && t.splice(i++, 0, o)
}
var ed = "ng-template"
function Wg(t, e, r, n) {
  let o = 0
  if (n) {
    for (; o < e.length && typeof e[o] == "string"; o += 2)
      if (e[o] === "class" && zg(e[o + 1].toLowerCase(), r, 0) !== -1) return !0
  } else if (Sa(t)) return !1
  if (((o = e.indexOf(1, o)), o > -1)) {
    let i
    for (; ++o < e.length && typeof (i = e[o]) == "string"; )
      if (i.toLowerCase() === r) return !0
  }
  return !1
}
function Sa(t) {
  return t.type === 4 && t.value !== ed
}
function Zg(t, e, r) {
  let n = t.type === 4 && !r ? ed : t.value
  return e === n
}
function Yg(t, e, r) {
  let n = 4,
    o = t.attrs,
    i = o !== null ? Jg(o) : 0,
    s = !1
  for (let a = 0; a < e.length; a++) {
    let u = e[a]
    if (typeof u == "number") {
      if (!s && !xe(n) && !xe(u)) return !1
      if (s && xe(u)) continue
      ;(s = !1), (n = u | (n & 1))
      continue
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (u !== "" && !Zg(t, u, r)) || (u === "" && e.length === 1))
        ) {
          if (xe(n)) return !1
          s = !0
        }
      } else if (n & 8) {
        if (o === null || !Wg(t, o, u, r)) {
          if (xe(n)) return !1
          s = !0
        }
      } else {
        let c = e[++a],
          l = Qg(u, o, Sa(t), r)
        if (l === -1) {
          if (xe(n)) return !1
          s = !0
          continue
        }
        if (c !== "") {
          let d
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), n & 2 && c !== d)
          ) {
            if (xe(n)) return !1
            s = !0
          }
        }
      }
  }
  return xe(n) || s
}
function xe(t) {
  return (t & 1) === 0
}
function Qg(t, e, r, n) {
  if (e === null) return -1
  let o = 0
  if (n || !r) {
    let i = !1
    for (; o < e.length; ) {
      let s = e[o]
      if (s === t) return o
      if (s === 3 || s === 6) i = !0
      else if (s === 1 || s === 2) {
        let a = e[++o]
        for (; typeof a == "string"; ) a = e[++o]
        continue
      } else {
        if (s === 4) break
        if (s === 0) {
          o += 4
          continue
        }
      }
      o += i ? 1 : 2
    }
    return -1
  } else return Xg(e, t)
}
function Kg(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Yg(t, e[n], r)) return !0
  return !1
}
function Jg(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e]
    if (Xl(r)) return e
  }
  return t.length
}
function Xg(t, e) {
  let r = t.indexOf(4)
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r]
      if (typeof n == "number") return -1
      if (n === e) return r
      r++
    }
  return -1
}
function ul(t, e) {
  return t ? ":not(" + e.trim() + ")" : e
}
function em(t) {
  let e = t[0],
    r = 1,
    n = 2,
    o = "",
    i = !1
  for (; r < t.length; ) {
    let s = t[r]
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r]
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
      } else n & 8 ? (o += "." + s) : n & 4 && (o += " " + s)
    else
      o !== "" && !xe(s) && ((e += ul(i, o)), (o = "")),
        (n = s),
        (i = i || !xe(n))
    r++
  }
  return o !== "" && (e += ul(i, o)), e
}
function tm(t) {
  return t.map(em).join(",")
}
function nm(t) {
  let e = [],
    r = [],
    n = 1,
    o = 2
  for (; n < t.length; ) {
    let i = t[n]
    if (typeof i == "string")
      o === 2 ? i !== "" && e.push(i, t[++n]) : o === 8 && r.push(i)
    else {
      if (!xe(o)) break
      o = i
    }
    n++
  }
  return { attrs: e, classes: r }
}
function He(t) {
  return rr(() => {
    let e = id(t),
      r = U(g({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Jl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Ve.Emulated,
        styles: t.styles || we,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      })
    sd(r)
    let n = t.dependencies
    return (
      (r.directiveDefs = ll(n, !1)), (r.pipeDefs = ll(n, !0)), (r.id = im(r)), r
    )
  })
}
function rm(t) {
  return gt(t) || td(t)
}
function om(t) {
  return t !== null
}
function Dt(t) {
  return rr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || we,
    declarations: t.declarations || we,
    imports: t.imports || we,
    exports: t.exports || we,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }))
}
function cl(t, e) {
  if (t == null) return yn
  let r = {}
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let o = t[n],
        i,
        s,
        a = ne.None
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        e ? ((r[i] = a !== ne.None ? [n, a] : n), (e[i] = s)) : (r[i] = n)
    }
  return r
}
function de(t) {
  return rr(() => {
    let e = id(t)
    return sd(e), e
  })
}
function gt(t) {
  return t[Sg] || null
}
function td(t) {
  return t[Ag] || null
}
function nd(t) {
  return t[xg] || null
}
function rd(t) {
  let e = gt(t) || td(t) || nd(t)
  return e !== null ? e.standalone : !1
}
function od(t, e) {
  let r = t[Tg] || null
  if (!r && e === !0)
    throw new Error(`Type ${ce(t)} does not have '\u0275mod' property.`)
  return r
}
function id(t) {
  let e = {}
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || yn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || we,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: cl(t.inputs, e),
    outputs: cl(t.outputs),
    debugInfo: null,
  }
}
function sd(t) {
  t.features?.forEach(e => e(t))
}
function ll(t, e) {
  if (!t) return null
  let r = e ? nd : rm
  return () => (typeof t == "function" ? t() : t).map(n => r(n)).filter(om)
}
function im(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|")
  for (let o of r) e = (Math.imul(31, e) + o.charCodeAt(0)) << 0
  return (e += 2147483648), "c" + e
}
function Yo(t) {
  return { ɵproviders: t }
}
function sm(...t) {
  return { ɵproviders: ad(!0, t), ɵfromNgModule: !0 }
}
function ad(t, ...e) {
  let r = [],
    n = new Set(),
    o,
    i = s => {
      r.push(s)
    }
  return (
    _a(e, s => {
      let a = s
      $s(a, i, [], n) && ((o ||= []), o.push(a))
    }),
    o !== void 0 && ud(o, i),
    r
  )
}
function ud(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: o } = t[r]
    Aa(o, i => {
      e(i, n)
    })
  }
}
function $s(t, e, r, n) {
  if (((t = ie(t)), !t)) return !1
  let o = null,
    i = rl(t),
    s = !i && gt(t)
  if (!i && !s) {
    let u = t.ngModule
    if (((i = rl(u)), i)) o = u
    else return !1
  } else {
    if (s && !s.standalone) return !1
    o = t
  }
  let a = n.has(o)
  if (s) {
    if (a) return !1
    if ((n.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies
      for (let c of u) $s(c, e, r, n)
    }
  } else if (i) {
    if (i.imports != null && !a) {
      n.add(o)
      let c
      try {
        _a(i.imports, l => {
          $s(l, e, r, n) && ((c ||= []), c.push(l))
        })
      } finally {
      }
      c !== void 0 && ud(c, e)
    }
    if (!a) {
      let c = vn(o) || (() => new o())
      e({ provide: o, useFactory: c, deps: we }, o),
        e({ provide: Kl, useValue: o, multi: !0 }, o),
        e({ provide: Dn, useValue: () => I(o), multi: !0 }, o)
    }
    let u = i.providers
    if (u != null && !a) {
      let c = t
      Aa(u, l => {
        e(l, c)
      })
    }
  } else return !1
  return o !== t && t.providers !== void 0
}
function Aa(t, e) {
  for (let r of t)
    zl(r) && (r = r.ɵproviders), Array.isArray(r) ? Aa(r, e) : e(r)
}
var am = j({ provide: String, useValue: j })
function cd(t) {
  return t !== null && typeof t == "object" && am in t
}
function um(t) {
  return !!(t && t.useExisting)
}
function cm(t) {
  return !!(t && t.useFactory)
}
function Cn(t) {
  return typeof t == "function"
}
function lm(t) {
  return !!t.useClass
}
var Qo = new w(""),
  Co = {},
  dm = {},
  Is
function xa() {
  return Is === void 0 && (Is = new Ao()), Is
}
var le = class {},
  Yn = class extends le {
    get destroyed() {
      return this._destroyed
    }
    constructor(e, r, n, o) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Bs(e, s => this.processProvider(s)),
        this.records.set(Ql, ln(void 0, this)),
        o.has("environment") && this.records.set(le, ln(void 0, this))
      let i = this.records.get(Qo)
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Kl, we, _.Self)))
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0)
      let e = R(null)
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy()
        let r = this._onDestroyHooks
        this._onDestroyHooks = []
        for (let n of r) n()
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          R(e)
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      )
    }
    runInContext(e) {
      this.assertNotDestroyed()
      let r = ht(this),
        n = Ce(void 0),
        o
      try {
        return e()
      } finally {
        ht(r), Ce(n)
      }
    }
    get(e, r = Wn, n = _.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(il))) return e[il](this)
      n = Wo(n)
      let o,
        i = ht(this),
        s = Ce(void 0)
      try {
        if (!(n & _.SkipSelf)) {
          let u = this.records.get(e)
          if (u === void 0) {
            let c = mm(e) && qo(e)
            c && this.injectableDefInScope(c)
              ? (u = ln(Us(e), Co))
              : (u = null),
              this.records.set(e, u)
          }
          if (u != null) return this.hydrate(e, u)
        }
        let a = n & _.Self ? xa() : this.parent
        return (r = n & _.Optional && r === Wn ? null : r), a.get(e, r)
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[_o] = a[_o] || []).unshift(ce(e)), i)) throw a
          return $g(a, e, "R3InjectorError", this.source)
        } else throw a
      } finally {
        Ce(s), ht(i)
      }
    }
    resolveInjectorInitializers() {
      let e = R(null),
        r = ht(this),
        n = Ce(void 0),
        o
      try {
        let i = this.get(Dn, we, _.Self)
        for (let s of i) s()
      } finally {
        ht(r), Ce(n), R(e)
      }
    }
    toString() {
      let e = [],
        r = this.records
      for (let n of r.keys()) e.push(ce(n))
      return `R3Injector[${e.join(", ")}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new v(205, !1)
    }
    processProvider(e) {
      e = ie(e)
      let r = Cn(e) ? e : ie(e && e.provide),
        n = hm(e)
      if (!Cn(e) && e.multi === !0) {
        let o = this.records.get(r)
        o ||
          ((o = ln(void 0, Co, !0)),
          (o.factory = () => Vs(o.multi)),
          this.records.set(r, o)),
          (r = e),
          o.multi.push(e)
      }
      this.records.set(r, n)
    }
    hydrate(e, r) {
      let n = R(null)
      try {
        return (
          r.value === Co && ((r.value = dm), (r.value = r.factory())),
          typeof r.value == "object" &&
            r.value &&
            gm(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        )
      } finally {
        R(n)
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1
      let r = ie(e.providedIn)
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r)
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e)
      r !== -1 && this._onDestroyHooks.splice(r, 1)
    }
  }
function Us(t) {
  let e = qo(t),
    r = e !== null ? e.factory : vn(t)
  if (r !== null) return r
  if (t instanceof w) throw new v(204, !1)
  if (t instanceof Function) return fm(t)
  throw new v(204, !1)
}
function fm(t) {
  if (t.length > 0) throw new v(204, !1)
  let r = Mg(t)
  return r !== null ? () => r.factory(t) : () => new t()
}
function hm(t) {
  if (cd(t)) return ln(void 0, t.useValue)
  {
    let e = ld(t)
    return ln(e, Co)
  }
}
function ld(t, e, r) {
  let n
  if (Cn(t)) {
    let o = ie(t)
    return vn(o) || Us(o)
  } else if (cd(t)) n = () => ie(t.useValue)
  else if (cm(t)) n = () => t.useFactory(...Vs(t.deps || []))
  else if (um(t)) n = () => I(ie(t.useExisting))
  else {
    let o = ie(t && (t.useClass || t.provide))
    if (pm(t)) n = () => new o(...Vs(t.deps))
    else return vn(o) || Us(o)
  }
  return n
}
function ln(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 }
}
function pm(t) {
  return !!t.deps
}
function gm(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  )
}
function mm(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof w)
}
function Bs(t, e) {
  for (let r of t)
    Array.isArray(r) ? Bs(r, e) : r && zl(r) ? Bs(r.ɵproviders, e) : e(r)
}
function nt(t, e) {
  t instanceof Yn && t.assertNotDestroyed()
  let r,
    n = ht(t),
    o = Ce(void 0)
  try {
    return e()
  } finally {
    ht(n), Ce(o)
  }
}
function dd() {
  return ql() !== void 0 || Lg() != null
}
function vm(t) {
  if (!dd()) throw new v(-203, !1)
}
function ym(t) {
  return typeof t == "function"
}
var rt = 0,
  T = 1,
  C = 2,
  re = 3,
  Te = 4,
  Oe = 5,
  xo = 6,
  Qn = 7,
  je = 8,
  wn = 9,
  Ne = 10,
  Z = 11,
  Kn = 12,
  dl = 13,
  ir = 14,
  $e = 15,
  Ko = 16,
  dn = 17,
  In = 18,
  Jo = 19,
  fd = 20,
  pt = 21,
  Es = 22,
  Pt = 23,
  et = 25,
  hd = 1
var kt = 7,
  To = 8,
  No = 9,
  Ie = 10,
  Ta = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    )
  })(Ta || {})
function Rt(t) {
  return Array.isArray(t) && typeof t[hd] == "object"
}
function ot(t) {
  return Array.isArray(t) && t[hd] === !0
}
function pd(t) {
  return (t.flags & 4) !== 0
}
function Xo(t) {
  return t.componentOffset > -1
}
function Na(t) {
  return (t.flags & 1) === 1
}
function mt(t) {
  return !!t.template
}
function Dm(t) {
  return (t[C] & 512) !== 0
}
var Hs = class {
  constructor(e, r, n) {
    ;(this.previousValue = e), (this.currentValue = r), (this.firstChange = n)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function gd(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n)
}
function Ct() {
  return md
}
function md(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = wm), Cm
}
Ct.ngInherit = !0
function Cm() {
  let t = yd(this),
    e = t?.current
  if (e) {
    let r = t.previous
    if (r === yn) t.previous = e
    else for (let n in e) r[n] = e[n]
    ;(t.current = null), this.ngOnChanges(e)
  }
}
function wm(t, e, r, n, o) {
  let i = this.declaredInputs[n],
    s = yd(t) || Im(t, { previous: yn, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i]
  ;(a[i] = new Hs(c && c.currentValue, r, u === yn)), gd(t, e, o, r)
}
var vd = "__ngSimpleChanges__"
function yd(t) {
  return t[vd] || null
}
function Im(t, e) {
  return (t[vd] = e)
}
var fl = null
var ke = function (t, e, r) {
    fl?.(t, e, r)
  },
  Em = "svg",
  bm = "math",
  Mm = !1
function _m() {
  return Mm
}
function Ue(t) {
  for (; Array.isArray(t); ) t = t[rt]
  return t
}
function Dd(t, e) {
  return Ue(e[t])
}
function Ee(t, e) {
  return Ue(e[t.index])
}
function Cd(t, e) {
  return t.data[e]
}
function Sm(t, e) {
  return t[e]
}
function wt(t, e) {
  let r = e[t]
  return Rt(r) ? r : r[rt]
}
function Oa(t) {
  return (t[C] & 128) === 128
}
function Am(t) {
  return ot(t[re])
}
function Oo(t, e) {
  return e == null ? null : t[e]
}
function wd(t) {
  t[dn] = 0
}
function xm(t) {
  t[C] & 1024 || ((t[C] |= 1024), Oa(t) && Jn(t))
}
function Ra(t) {
  return !!(t[C] & 9216 || t[Pt]?.dirty)
}
function Gs(t) {
  t[Ne].changeDetectionScheduler?.notify(1),
    Ra(t)
      ? Jn(t)
      : t[C] & 64 &&
        (_m()
          ? ((t[C] |= 1024), Jn(t))
          : t[Ne].changeDetectionScheduler?.notify())
}
function Jn(t) {
  t[Ne].changeDetectionScheduler?.notify()
  let e = Xn(t)
  for (; e !== null && !(e[C] & 8192 || ((e[C] |= 8192), !Oa(e))); ) e = Xn(e)
}
function Id(t, e) {
  if ((t[C] & 256) === 256) throw new v(911, !1)
  t[pt] === null && (t[pt] = []), t[pt].push(e)
}
function Tm(t, e) {
  if (t[pt] === null) return
  let r = t[pt].indexOf(e)
  r !== -1 && t[pt].splice(r, 1)
}
function Xn(t) {
  let e = t[re]
  return ot(e) ? e[re] : e
}
var S = { lFrame: Nd(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function Nm() {
  return S.lFrame.elementDepthCount
}
function Om() {
  S.lFrame.elementDepthCount++
}
function Rm() {
  S.lFrame.elementDepthCount--
}
function Ed() {
  return S.bindingsEnabled
}
function Fm() {
  return S.skipHydrationRootTNode !== null
}
function Pm(t) {
  return S.skipHydrationRootTNode === t
}
function km() {
  S.skipHydrationRootTNode = null
}
function $() {
  return S.lFrame.lView
}
function be() {
  return S.lFrame.tView
}
function Fa(t) {
  return (S.lFrame.contextLView = t), t[je]
}
function Pa(t) {
  return (S.lFrame.contextLView = null), t
}
function ge() {
  let t = bd()
  for (; t !== null && t.type === 64; ) t = t.parent
  return t
}
function bd() {
  return S.lFrame.currentTNode
}
function Lm() {
  let t = S.lFrame,
    e = t.currentTNode
  return t.isParent ? e : e.parent
}
function sr(t, e) {
  let r = S.lFrame
  ;(r.currentTNode = t), (r.isParent = e)
}
function Md() {
  return S.lFrame.isParent
}
function Vm() {
  S.lFrame.isParent = !1
}
function jm() {
  return S.lFrame.contextLView
}
function _d() {
  let t = S.lFrame,
    e = t.bindingRootIndex
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e
}
function $m() {
  return S.lFrame.bindingIndex
}
function Um(t) {
  return (S.lFrame.bindingIndex = t)
}
function ka() {
  return S.lFrame.bindingIndex++
}
function Sd(t) {
  let e = S.lFrame,
    r = e.bindingIndex
  return (e.bindingIndex = e.bindingIndex + t), r
}
function Bm() {
  return S.lFrame.inI18n
}
function Hm(t, e) {
  let r = S.lFrame
  ;(r.bindingIndex = r.bindingRootIndex = t), zs(e)
}
function Gm() {
  return S.lFrame.currentDirectiveIndex
}
function zs(t) {
  S.lFrame.currentDirectiveIndex = t
}
function zm(t) {
  let e = S.lFrame.currentDirectiveIndex
  return e === -1 ? null : t[e]
}
function Ad(t) {
  S.lFrame.currentQueryIndex = t
}
function qm(t) {
  let e = t[T]
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Oe] : null
}
function xd(t, e, r) {
  if (r & _.SkipSelf) {
    let o = e,
      i = t
    for (; (o = o.parent), o === null && !(r & _.Host); )
      if (((o = qm(i)), o === null || ((i = i[ir]), o.type & 10))) break
    if (o === null) return !1
    ;(e = o), (t = i)
  }
  let n = (S.lFrame = Td())
  return (n.currentTNode = e), (n.lView = t), !0
}
function La(t) {
  let e = Td(),
    r = t[T]
  ;(S.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1)
}
function Td() {
  let t = S.lFrame,
    e = t === null ? null : t.child
  return e === null ? Nd(t) : e
}
function Nd(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  }
  return t !== null && (t.child = e), e
}
function Od() {
  let t = S.lFrame
  return (S.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
}
var Rd = Od
function Va() {
  let t = Od()
  ;(t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0)
}
function Ht() {
  return S.lFrame.selectedIndex
}
function Lt(t) {
  S.lFrame.selectedIndex = t
}
function ja() {
  let t = S.lFrame
  return Cd(t.tView, t.selectedIndex)
}
function Wm() {
  return S.lFrame.currentNamespace
}
var Fd = !0
function $a() {
  return Fd
}
function Ua(t) {
  Fd = t
}
function Zm(t, e, r) {
  let { ngOnChanges: n, ngOnInit: o, ngDoCheck: i } = e.type.prototype
  if (n) {
    let s = md(e)
    ;(r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s)
  }
  o && (r.preOrderHooks ??= []).push(0 - t, o),
    i &&
      ((r.preOrderHooks ??= []).push(t, i),
      (r.preOrderCheckHooks ??= []).push(t, i))
}
function Ba(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let i = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      u && (t.viewHooks ??= []).push(-r, u),
      c &&
        ((t.viewHooks ??= []).push(r, c), (t.viewCheckHooks ??= []).push(r, c)),
      l != null && (t.destroyHooks ??= []).push(r, l)
  }
}
function wo(t, e, r) {
  Pd(t, e, 3, r)
}
function Io(t, e, r, n) {
  ;(t[C] & 3) === r && Pd(t, e, r, n)
}
function bs(t, e) {
  let r = t[C]
  ;(r & 3) === e && ((r &= 16383), (r += 1), (t[C] = r))
}
function Pd(t, e, r, n) {
  let o = n !== void 0 ? t[dn] & 65535 : 0,
    i = n ?? -1,
    s = e.length - 1,
    a = 0
  for (let u = o; u < s; u++)
    if (typeof e[u + 1] == "number") {
      if (((a = e[u]), n != null && a >= n)) break
    } else
      e[u] < 0 && (t[dn] += 65536),
        (a < i || i == -1) &&
          (Ym(t, r, e, u), (t[dn] = (t[dn] & 4294901760) + u + 2)),
        u++
}
function hl(t, e) {
  ke(4, t, e)
  let r = R(null)
  try {
    e.call(t)
  } finally {
    R(r), ke(5, t, e)
  }
}
function Ym(t, e, r, n) {
  let o = r[n] < 0,
    i = r[n + 1],
    s = o ? -r[n] : r[n],
    a = t[s]
  o
    ? t[C] >> 14 < t[dn] >> 16 &&
      (t[C] & 3) === e &&
      ((t[C] += 16384), hl(a, i))
    : hl(a, i)
}
var gn = -1,
  Vt = class {
    constructor(e, r, n) {
      ;(this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n)
    }
  }
function Qm(t) {
  return t instanceof Vt
}
function Km(t) {
  return (t.flags & 8) !== 0
}
function Jm(t) {
  return (t.flags & 16) !== 0
}
function kd(t) {
  return t !== gn
}
function Ro(t) {
  return t & 32767
}
function Xm(t) {
  return t >> 16
}
function Fo(t, e) {
  let r = Xm(t),
    n = e
  for (; r > 0; ) (n = n[ir]), r--
  return n
}
var qs = !0
function pl(t) {
  let e = qs
  return (qs = t), e
}
var ev = 256,
  Ld = ev - 1,
  Vd = 5,
  tv = 0,
  Le = {}
function nv(t, e, r) {
  let n
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(qn) && (n = r[qn]),
    n == null && (n = r[qn] = tv++)
  let o = n & Ld,
    i = 1 << o
  e.data[t + (o >> Vd)] |= i
}
function Po(t, e) {
  let r = jd(t, e)
  if (r !== -1) return r
  let n = e[T]
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Ms(n.data, t),
    Ms(e, null),
    Ms(n.blueprint, null))
  let o = Ha(t, e),
    i = t.injectorIndex
  if (kd(o)) {
    let s = Ro(o),
      a = Fo(o, e),
      u = a[T].data
    for (let c = 0; c < 8; c++) e[i + c] = a[s + c] | u[s + c]
  }
  return (e[i + 8] = o), i
}
function Ms(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
}
function jd(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex
}
function Ha(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex
  let r = 0,
    n = null,
    o = e
  for (; o !== null; ) {
    if (((n = Gd(o)), n === null)) return gn
    if ((r++, (o = o[ir]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16)
  }
  return gn
}
function Ws(t, e, r) {
  nv(t, e, r)
}
function rv(t, e) {
  if (e === "class") return t.classes
  if (e === "style") return t.styles
  let r = t.attrs
  if (r) {
    let n = r.length,
      o = 0
    for (; o < n; ) {
      let i = r[o]
      if (Xl(i)) break
      if (i === 0) o = o + 2
      else if (typeof i == "number")
        for (o++; o < n && typeof r[o] == "string"; ) o++
      else {
        if (i === e) return r[o + 1]
        o = o + 2
      }
    }
  }
  return null
}
function $d(t, e, r) {
  if (r & _.Optional || t !== void 0) return t
  ba(e, "NodeInjector")
}
function Ud(t, e, r, n) {
  if (
    (r & _.Optional && n === void 0 && (n = null), !(r & (_.Self | _.Host)))
  ) {
    let o = t[wn],
      i = Ce(void 0)
    try {
      return o ? o.get(e, n, r & _.Optional) : Wl(e, n, r & _.Optional)
    } finally {
      Ce(i)
    }
  }
  return $d(n, e, r)
}
function Bd(t, e, r, n = _.Default, o) {
  if (t !== null) {
    if (e[C] & 2048 && !(n & _.Self)) {
      let s = uv(t, e, r, n, Le)
      if (s !== Le) return s
    }
    let i = Hd(t, e, r, n, Le)
    if (i !== Le) return i
  }
  return Ud(e, r, n, o)
}
function Hd(t, e, r, n, o) {
  let i = sv(r)
  if (typeof i == "function") {
    if (!xd(e, t, n)) return n & _.Host ? $d(o, r, n) : Ud(e, r, n, o)
    try {
      let s
      if (((s = i(n)), s == null && !(n & _.Optional))) ba(r)
      else return s
    } finally {
      Rd()
    }
  } else if (typeof i == "number") {
    let s = null,
      a = jd(t, e),
      u = gn,
      c = n & _.Host ? e[$e][Oe] : null
    for (
      (a === -1 || n & _.SkipSelf) &&
      ((u = a === -1 ? Ha(t, e) : e[a + 8]),
      u === gn || !ml(n, !1)
        ? (a = -1)
        : ((s = e[T]), (a = Ro(u)), (e = Fo(u, e))));
      a !== -1;

    ) {
      let l = e[T]
      if (gl(i, a, l.data)) {
        let d = ov(a, e, r, s, n, c)
        if (d !== Le) return d
      }
      ;(u = e[a + 8]),
        u !== gn && ml(n, e[T].data[a + 8] === c) && gl(i, a, e)
          ? ((s = l), (a = Ro(u)), (e = Fo(u, e)))
          : (a = -1)
    }
  }
  return o
}
function ov(t, e, r, n, o, i) {
  let s = e[T],
    a = s.data[t + 8],
    u = n == null ? Xo(a) && qs : n != s && (a.type & 3) !== 0,
    c = o & _.Host && i === a,
    l = iv(a, s, r, u, c)
  return l !== null ? En(e, s, l, a) : Le
}
function iv(t, e, r, n, o) {
  let i = t.providerIndexes,
    s = e.data,
    a = i & 1048575,
    u = t.directiveStart,
    c = t.directiveEnd,
    l = i >> 20,
    d = n ? a : a + l,
    h = o ? a + l : c
  for (let f = d; f < h; f++) {
    let m = s[f]
    if ((f < u && r === m) || (f >= u && m.type === r)) return f
  }
  if (o) {
    let f = s[u]
    if (f && mt(f) && f.type === r) return u
  }
  return null
}
function En(t, e, r, n) {
  let o = t[r],
    i = e.data
  if (Qm(o)) {
    let s = o
    s.resolving && Og(Ng(i[r]))
    let a = pl(s.canSeeViewProviders)
    s.resolving = !0
    let u,
      c = s.injectImpl ? Ce(s.injectImpl) : null,
      l = xd(t, n, _.Default)
    try {
      ;(o = t[r] = s.factory(void 0, i, t, n)),
        e.firstCreatePass && r >= n.directiveStart && Zm(r, i[r], e)
    } finally {
      c !== null && Ce(c), pl(a), (s.resolving = !1), Rd()
    }
  }
  return o
}
function sv(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0
  let e = t.hasOwnProperty(qn) ? t[qn] : void 0
  return typeof e == "number" ? (e >= 0 ? e & Ld : av) : e
}
function gl(t, e, r) {
  let n = 1 << t
  return !!(r[e + (t >> Vd)] & n)
}
function ml(t, e) {
  return !(t & _.Self) && !(t & _.Host && e)
}
var Ft = class {
  constructor(e, r) {
    ;(this._tNode = e), (this._lView = r)
  }
  get(e, r, n) {
    return Bd(this._tNode, this._lView, e, Wo(n), r)
  }
}
function av() {
  return new Ft(ge(), $())
}
function ar(t) {
  return rr(() => {
    let e = t.prototype.constructor,
      r = e[Mo] || Zs(e),
      n = Object.prototype,
      o = Object.getPrototypeOf(t.prototype).constructor
    for (; o && o !== n; ) {
      let i = o[Mo] || Zs(o)
      if (i && i !== r) return i
      o = Object.getPrototypeOf(o)
    }
    return i => new i()
  })
}
function Zs(t) {
  return Ul(t)
    ? () => {
        let e = Zs(ie(t))
        return e && e()
      }
    : vn(t)
}
function uv(t, e, r, n, o) {
  let i = t,
    s = e
  for (; i !== null && s !== null && s[C] & 2048 && !(s[C] & 512); ) {
    let a = Hd(i, s, r, n | _.Self, Le)
    if (a !== Le) return a
    let u = i.parent
    if (!u) {
      let c = s[fd]
      if (c) {
        let l = c.get(r, Le, n)
        if (l !== Le) return l
      }
      ;(u = Gd(s)), (s = s[ir])
    }
    i = u
  }
  return o
}
function Gd(t) {
  let e = t[T],
    r = e.type
  return r === 2 ? e.declTNode : r === 1 ? t[Oe] : null
}
function Ga(t) {
  return rv(ge(), t)
}
function vl(t, e = null, r = null, n) {
  let o = zd(t, e, r, n)
  return o.resolveInjectorInitializers(), o
}
function zd(t, e = null, r = null, n, o = new Set()) {
  let i = [r || we, sm(t)]
  return (
    (n = n || (typeof t == "object" ? void 0 : ce(t))),
    new Yn(i, e || xa(), n || null, o)
  )
}
var it = (() => {
  let e = class e {
    static create(n, o) {
      if (Array.isArray(n)) return vl({ name: "" }, o, n, "")
      {
        let i = n.name ?? ""
        return vl({ name: i }, n.parent, n.providers, i)
      }
    }
  }
  ;(e.THROW_IF_NOT_FOUND = Wn),
    (e.NULL = new Ao()),
    (e.ɵprov = y({ token: e, providedIn: "any", factory: () => I(Ql) })),
    (e.__NG_ELEMENT_ID__ = -1)
  let t = e
  return t
})()
var cv = "ngOriginalError"
function _s(t) {
  return t[cv]
}
var Be = class {
    constructor() {
      this._console = console
    }
    handleError(e) {
      let r = this._findOriginalError(e)
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r)
    }
    _findOriginalError(e) {
      let r = e && _s(e)
      for (; r && _s(r); ) r = _s(r)
      return r || null
    }
  },
  qd = new w("", {
    providedIn: "root",
    factory: () => p(Be).handleError.bind(void 0),
  }),
  za = (() => {
    let e = class e {}
    ;(e.__NG_ELEMENT_ID__ = lv), (e.__NG_ENV_ID__ = n => n)
    let t = e
    return t
  })(),
  Ys = class extends za {
    constructor(e) {
      super(), (this._lView = e)
    }
    onDestroy(e) {
      return Id(this._lView, e), () => Tm(this._lView, e)
    }
  }
function lv() {
  return new Ys($())
}
function dv() {
  return ei(ge(), $())
}
function ei(t, e) {
  return new It(Ee(t, e))
}
var It = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n
    }
  }
  e.__NG_ELEMENT_ID__ = dv
  let t = e
  return t
})()
var Qs = class extends ee {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      dd() && (this.destroyRef = p(za, { optional: !0 }) ?? void 0)
  }
  emit(e) {
    let r = R(null)
    try {
      super.next(e)
    } finally {
      R(r)
    }
  }
  subscribe(e, r, n) {
    let o = e,
      i = r || (() => null),
      s = n
    if (e && typeof e == "object") {
      let u = e
      ;(o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u))
    }
    this.__isAsync && ((i = Ss(i)), o && (o = Ss(o)), s && (s = Ss(s)))
    let a = super.subscribe({ next: o, error: i, complete: s })
    return e instanceof W && e.add(a), a
  }
}
function Ss(t) {
  return e => {
    setTimeout(t, void 0, e)
  }
}
var te = Qs
function Wd(t) {
  return (t.flags & 128) === 128
}
var Zd = new Map(),
  fv = 0
function hv() {
  return fv++
}
function pv(t) {
  Zd.set(t[Jo], t)
}
function gv(t) {
  Zd.delete(t[Jo])
}
var yl = "__ngContext__"
function jt(t, e) {
  Rt(e) ? ((t[yl] = e[Jo]), pv(e)) : (t[yl] = e)
}
function Yd(t) {
  return Kd(t[Kn])
}
function Qd(t) {
  return Kd(t[Te])
}
function Kd(t) {
  for (; t !== null && !ot(t); ) t = t[Te]
  return t
}
var Ks
function Jd(t) {
  Ks = t
}
function mv() {
  if (Ks !== void 0) return Ks
  if (typeof document < "u") return document
  throw new v(210, !1)
}
var qa = new w("", { providedIn: "root", factory: () => vv }),
  vv = "ng",
  Wa = new w(""),
  Et = new w("", { providedIn: "platform", factory: () => "unknown" })
var Za = new w("", {
  providedIn: "root",
  factory: () =>
    mv().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
})
var yv = "h",
  Dv = "b"
var Cv = () => null
function Ya(t, e, r = !1) {
  return Cv(t, e, r)
}
var Xd = !1,
  wv = new w("", { providedIn: "root", factory: () => Xd })
var vo
function Iv() {
  if (vo === void 0 && ((vo = null), ue.trustedTypes))
    try {
      vo = ue.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: t => t,
        createScript: t => t,
        createScriptURL: t => t,
      })
    } catch {}
  return vo
}
function Dl(t) {
  return Iv()?.createScriptURL(t) || t
}
var ko = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${jl})`
  }
}
function ur(t) {
  return t instanceof ko ? t.changingThisBreaksApplicationSecurity : t
}
function Qa(t, e) {
  let r = Ev(t)
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0
    throw new Error(`Required a safe ${e}, got a ${r} (see ${jl})`)
  }
  return r === e
}
function Ev(t) {
  return (t instanceof ko && t.getTypeName()) || null
}
var bv = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i
function ef(t) {
  return (t = String(t)), t.match(bv) ? t : "unsafe:" + t
}
var ti = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  )
})(ti || {})
function cr(t) {
  let e = nf()
  return e ? e.sanitize(ti.URL, t) || "" : Qa(t, "URL") ? ur(t) : ef(mn(t))
}
function Mv(t) {
  let e = nf()
  if (e) return Dl(e.sanitize(ti.RESOURCE_URL, t) || "")
  if (Qa(t, "ResourceURL")) return Dl(ur(t))
  throw new v(904, !1)
}
function _v(t, e) {
  return (e === "src" &&
    (t === "embed" ||
      t === "frame" ||
      t === "iframe" ||
      t === "media" ||
      t === "script")) ||
    (e === "href" && (t === "base" || t === "link"))
    ? Mv
    : cr
}
function tf(t, e, r) {
  return _v(e, r)(t)
}
function nf() {
  let t = $()
  return t && t[Ne].sanitizer
}
function rf(t) {
  return t instanceof Function ? t() : t
}
function Sv(t) {
  return (t ?? p(it)).get(Et) === "browser"
}
var tt = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    )
  })(tt || {}),
  Av
function Ka(t, e) {
  return Av(t, e)
}
function fn(t, e, r, n, o) {
  if (n != null) {
    let i,
      s = !1
    ot(n) ? (i = n) : Rt(n) && ((s = !0), (n = n[rt]))
    let a = Ue(n)
    t === 0 && r !== null
      ? o == null
        ? cf(e, r, a)
        : Lo(e, r, a, o || null, !0)
      : t === 1 && r !== null
        ? Lo(e, r, a, o || null, !0)
        : t === 2
          ? zv(e, a, s)
          : t === 3 && e.destroyNode(a),
      i != null && Wv(e, t, i, r, o)
  }
}
function xv(t, e) {
  return t.createText(e)
}
function Tv(t, e, r) {
  t.setValue(e, r)
}
function of(t, e, r) {
  return t.createElement(e, r)
}
function Nv(t, e) {
  sf(t, e), (e[rt] = null), (e[Oe] = null)
}
function Ov(t, e, r, n, o, i) {
  ;(n[rt] = o), (n[Oe] = e), ni(t, n, r, 1, o, i)
}
function sf(t, e) {
  e[Ne].changeDetectionScheduler?.notify(1), ni(t, e, e[Z], 2, null, null)
}
function Rv(t) {
  let e = t[Kn]
  if (!e) return As(t[T], t)
  for (; e; ) {
    let r = null
    if (Rt(e)) r = e[Kn]
    else {
      let n = e[Ie]
      n && (r = n)
    }
    if (!r) {
      for (; e && !e[Te] && e !== t; ) Rt(e) && As(e[T], e), (e = e[re])
      e === null && (e = t), Rt(e) && As(e[T], e), (r = e && e[Te])
    }
    e = r
  }
}
function Fv(t, e, r, n) {
  let o = Ie + n,
    i = r.length
  n > 0 && (r[o - 1][Te] = e),
    n < i - Ie
      ? ((e[Te] = r[o]), Yl(r, Ie + n, e))
      : (r.push(e), (e[Te] = null)),
    (e[re] = r)
  let s = e[Ko]
  s !== null && r !== s && Pv(s, e)
  let a = e[In]
  a !== null && a.insertView(t), Gs(e), (e[C] |= 128)
}
function Pv(t, e) {
  let r = t[No],
    o = e[re][re][$e]
  e[$e] !== o && (t[C] |= Ta.HasTransplantedViews),
    r === null ? (t[No] = [e]) : r.push(e)
}
function af(t, e) {
  let r = t[No],
    n = r.indexOf(e)
  r.splice(n, 1)
}
function Js(t, e) {
  if (t.length <= Ie) return
  let r = Ie + e,
    n = t[r]
  if (n) {
    let o = n[Ko]
    o !== null && o !== t && af(o, n), e > 0 && (t[r - 1][Te] = n[Te])
    let i = So(t, Ie + e)
    Nv(n[T], n)
    let s = i[In]
    s !== null && s.detachView(i[T]),
      (n[re] = null),
      (n[Te] = null),
      (n[C] &= -129)
  }
  return n
}
function uf(t, e) {
  if (!(e[C] & 256)) {
    let r = e[Z]
    r.destroyNode && ni(t, e, r, 3, null, null), Rv(e)
  }
}
function As(t, e) {
  if (e[C] & 256) return
  let r = R(null)
  try {
    ;(e[C] &= -129),
      (e[C] |= 256),
      e[Pt] && xc(e[Pt]),
      Lv(t, e),
      kv(t, e),
      e[T].type === 1 && e[Z].destroy()
    let n = e[Ko]
    if (n !== null && ot(e[re])) {
      n !== e[re] && af(n, e)
      let o = e[In]
      o !== null && o.detachView(t)
    }
    gv(e)
  } finally {
    R(r)
  }
}
function kv(t, e) {
  let r = t.cleanup,
    n = e[Qn]
  if (r !== null)
    for (let i = 0; i < r.length - 1; i += 2)
      if (typeof r[i] == "string") {
        let s = r[i + 3]
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (i += 2)
      } else {
        let s = n[r[i + 1]]
        r[i].call(s)
      }
  n !== null && (e[Qn] = null)
  let o = e[pt]
  if (o !== null) {
    e[pt] = null
    for (let i = 0; i < o.length; i++) {
      let s = o[i]
      s()
    }
  }
}
function Lv(t, e) {
  let r
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let o = e[r[n]]
      if (!(o instanceof Vt)) {
        let i = r[n + 1]
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1]
            ke(4, a, u)
            try {
              u.call(a)
            } finally {
              ke(5, a, u)
            }
          }
        else {
          ke(4, o, i)
          try {
            i.call(o)
          } finally {
            ke(5, o, i)
          }
        }
      }
    }
}
function Vv(t, e, r) {
  return jv(t, e.parent, r)
}
function jv(t, e, r) {
  let n = e
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent)
  if (n === null) return r[rt]
  {
    let { componentOffset: o } = n
    if (o > -1) {
      let { encapsulation: i } = t.data[n.directiveStart + o]
      if (i === Ve.None || i === Ve.Emulated) return null
    }
    return Ee(n, r)
  }
}
function Lo(t, e, r, n, o) {
  t.insertBefore(e, r, n, o)
}
function cf(t, e, r) {
  t.appendChild(e, r)
}
function Cl(t, e, r, n, o) {
  n !== null ? Lo(t, e, r, n, o) : cf(t, e, r)
}
function $v(t, e, r, n) {
  t.removeChild(e, r, n)
}
function Ja(t, e) {
  return t.parentNode(e)
}
function Uv(t, e) {
  return t.nextSibling(e)
}
function Bv(t, e, r) {
  return Gv(t, e, r)
}
function Hv(t, e, r) {
  return t.type & 40 ? Ee(t, r) : null
}
var Gv = Hv,
  wl
function Xa(t, e, r, n) {
  let o = Vv(t, n, e),
    i = e[Z],
    s = n.parent || e[Oe],
    a = Bv(s, n, e)
  if (o != null)
    if (Array.isArray(r))
      for (let u = 0; u < r.length; u++) Cl(i, o, r[u], a, !1)
    else Cl(i, o, r, a, !1)
  wl !== void 0 && wl(i, n, e, r, o)
}
function Eo(t, e) {
  if (e !== null) {
    let r = e.type
    if (r & 3) return Ee(e, t)
    if (r & 4) return Xs(-1, t[e.index])
    if (r & 8) {
      let n = e.child
      if (n !== null) return Eo(t, n)
      {
        let o = t[e.index]
        return ot(o) ? Xs(-1, o) : Ue(o)
      }
    } else {
      if (r & 32) return Ka(e, t)() || Ue(t[e.index])
      {
        let n = lf(t, e)
        if (n !== null) {
          if (Array.isArray(n)) return n[0]
          let o = Xn(t[$e])
          return Eo(o, n)
        } else return Eo(t, e.next)
      }
    }
  }
  return null
}
function lf(t, e) {
  if (e !== null) {
    let n = t[$e][Oe],
      o = e.projection
    return n.projection[o]
  }
  return null
}
function Xs(t, e) {
  let r = Ie + t + 1
  if (r < e.length) {
    let n = e[r],
      o = n[T].firstChild
    if (o !== null) return Eo(n, o)
  }
  return e[kt]
}
function zv(t, e, r) {
  let n = Ja(t, e)
  n && $v(t, n, e, r)
}
function eu(t, e, r, n, o, i, s) {
  for (; r != null; ) {
    let a = n[r.index],
      u = r.type
    if (
      (s && e === 0 && (a && jt(Ue(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (u & 8) eu(t, e, r.child, n, o, i, !1), fn(e, t, o, a, i)
      else if (u & 32) {
        let c = Ka(r, n),
          l
        for (; (l = c()); ) fn(e, t, o, l, i)
        fn(e, t, o, a, i)
      } else u & 16 ? qv(t, e, n, r, o, i) : fn(e, t, o, a, i)
    r = s ? r.projectionNext : r.next
  }
}
function ni(t, e, r, n, o, i) {
  eu(r, n, t.firstChild, e, o, i, !1)
}
function qv(t, e, r, n, o, i) {
  let s = r[$e],
    u = s[Oe].projection[n.projection]
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c]
      fn(e, t, o, l, i)
    }
  else {
    let c = u,
      l = s[re]
    Wd(n) && (c.flags |= 128), eu(t, e, c, l, o, i, !0)
  }
}
function Wv(t, e, r, n, o) {
  let i = r[kt],
    s = Ue(r)
  i !== s && fn(e, t, n, i, o)
  for (let a = Ie; a < r.length; a++) {
    let u = r[a]
    ni(u[T], u, t, e, n, i)
  }
}
function Zv(t, e, r, n, o) {
  if (e) o ? t.addClass(r, n) : t.removeClass(r, n)
  else {
    let i = n.indexOf("-") === -1 ? void 0 : tt.DashCase
    o == null
      ? t.removeStyle(r, n, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= tt.Important)),
        t.setStyle(r, n, o, i))
  }
}
function Yv(t, e, r) {
  t.setAttribute(e, "style", r)
}
function df(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r)
}
function ff(t, e, r) {
  let { mergedAttrs: n, classes: o, styles: i } = r
  n !== null && js(t, e, n),
    o !== null && df(t, e, o),
    i !== null && Yv(t, e, i)
}
var Re = {}
function X(t = 1) {
  hf(be(), $(), Ht() + t, !1)
}
function hf(t, e, r, n) {
  if (!n)
    if ((e[C] & 3) === 3) {
      let i = t.preOrderCheckHooks
      i !== null && wo(e, i, r)
    } else {
      let i = t.preOrderHooks
      i !== null && Io(e, i, 0, r)
    }
  Lt(r)
}
function k(t, e = _.Default) {
  let r = $()
  if (r === null) return I(t, e)
  let n = ge()
  return Bd(n, r, ie(t), e)
}
function pf() {
  let t = "invalid"
  throw new Error(t)
}
function gf(t, e, r, n, o, i) {
  let s = R(null)
  try {
    let a = null
    o & ne.SignalBased && (a = e[n][Mc]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & ne.HasDecoratorInputTransform &&
        (i = t.inputTransforms[n].call(e, i)),
      t.setInput !== null ? t.setInput(e, a, i, r, n) : gd(e, a, n, i)
  } finally {
    R(s)
  }
}
function Qv(t, e) {
  let r = t.hostBindingOpCodes
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let o = r[n]
        if (o < 0) Lt(~o)
        else {
          let i = o,
            s = r[++n],
            a = r[++n]
          Hm(s, i)
          let u = e[i]
          a(2, u)
        }
      }
    } finally {
      Lt(-1)
    }
}
function ri(t, e, r, n, o, i, s, a, u, c, l) {
  let d = e.blueprint.slice()
  return (
    (d[rt] = o),
    (d[C] = n | 4 | 128 | 8 | 64),
    (c !== null || (t && t[C] & 2048)) && (d[C] |= 2048),
    wd(d),
    (d[re] = d[ir] = t),
    (d[je] = r),
    (d[Ne] = s || (t && t[Ne])),
    (d[Z] = a || (t && t[Z])),
    (d[wn] = u || (t && t[wn]) || null),
    (d[Oe] = i),
    (d[Jo] = hv()),
    (d[xo] = l),
    (d[fd] = c),
    (d[$e] = e.type == 2 ? t[$e] : d),
    d
  )
}
function oi(t, e, r, n, o) {
  let i = t.data[e]
  if (i === null) (i = Kv(t, e, r, n, o)), Bm() && (i.flags |= 32)
  else if (i.type & 64) {
    ;(i.type = r), (i.value = n), (i.attrs = o)
    let s = Lm()
    i.injectorIndex = s === null ? -1 : s.injectorIndex
  }
  return sr(i, !0), i
}
function Kv(t, e, r, n, o) {
  let i = bd(),
    s = Md(),
    a = s ? i : i && i.parent,
    u = (t.data[e] = ny(t, a, r, e, n, o))
  return (
    t.firstChild === null && (t.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  )
}
function mf(t, e, r, n) {
  if (r === 0) return -1
  let o = e.length
  for (let i = 0; i < r; i++) e.push(n), t.blueprint.push(n), t.data.push(null)
  return o
}
function vf(t, e, r, n, o) {
  let i = Ht(),
    s = n & 2
  try {
    Lt(-1), s && e.length > et && hf(t, e, et, !1), ke(s ? 2 : 0, o), r(n, o)
  } finally {
    Lt(i), ke(s ? 3 : 1, o)
  }
}
function yf(t, e, r) {
  if (pd(e)) {
    let n = R(null)
    try {
      let o = e.directiveStart,
        i = e.directiveEnd
      for (let s = o; s < i; s++) {
        let a = t.data[s]
        if (a.contentQueries) {
          let u = r[s]
          a.contentQueries(1, u, s)
        }
      }
    } finally {
      R(n)
    }
  }
}
function Df(t, e, r) {
  Ed() && (uy(t, e, r, Ee(r, e)), (r.flags & 64) === 64 && Mf(t, e, r))
}
function Cf(t, e, r = Ee) {
  let n = e.localNames
  if (n !== null) {
    let o = e.index + 1
    for (let i = 0; i < n.length; i += 2) {
      let s = n[i + 1],
        a = s === -1 ? r(e, t) : t[s]
      t[o++] = a
    }
  }
}
function wf(t) {
  let e = t.tView
  return e === null || e.incompleteFirstPass
    ? (t.tView = tu(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e
}
function tu(t, e, r, n, o, i, s, a, u, c, l) {
  let d = et + n,
    h = d + o,
    f = Jv(d, h),
    m = typeof c == "function" ? c() : c
  return (f[T] = {
    type: t,
    blueprint: f,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: l,
  })
}
function Jv(t, e) {
  let r = []
  for (let n = 0; n < e; n++) r.push(n < t ? null : Re)
  return r
}
function Xv(t, e, r, n) {
  let i = n.get(wv, Xd) || r === Ve.ShadowDom,
    s = t.selectRootElement(e, i)
  return ey(s), s
}
function ey(t) {
  ty(t)
}
var ty = () => null
function ny(t, e, r, n, o, i) {
  let s = e ? e.injectorIndex : -1,
    a = 0
  return (
    Fm() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  )
}
function Il(t, e, r, n, o) {
  for (let i in e) {
    if (!e.hasOwnProperty(i)) continue
    let s = e[i]
    if (s === void 0) continue
    n ??= {}
    let a,
      u = ne.None
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s)
    let c = i
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue
      c = o[i]
    }
    t === 0 ? El(n, r, c, a, u) : El(n, r, c, a)
  }
  return n
}
function El(t, e, r, n, o) {
  let i
  t.hasOwnProperty(r) ? (i = t[r]).push(e, n) : (i = t[r] = [e, n]),
    o !== void 0 && i.push(o)
}
function ry(t, e, r) {
  let n = e.directiveStart,
    o = e.directiveEnd,
    i = t.data,
    s = e.attrs,
    a = [],
    u = null,
    c = null
  for (let l = n; l < o; l++) {
    let d = i[l],
      h = r ? r.get(d) : null,
      f = h ? h.inputs : null,
      m = h ? h.outputs : null
    ;(u = Il(0, d.inputs, l, u, f)), (c = Il(1, d.outputs, l, c, m))
    let M = u !== null && s !== null && !Sa(e) ? Dy(u, l, s) : null
    a.push(M)
  }
  u !== null &&
    (u.hasOwnProperty("class") && (e.flags |= 8),
    u.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = u),
    (e.outputs = c)
}
function oy(t) {
  return t === "class"
    ? "className"
    : t === "for"
      ? "htmlFor"
      : t === "formaction"
        ? "formAction"
        : t === "innerHtml"
          ? "innerHTML"
          : t === "readonly"
            ? "readOnly"
            : t === "tabindex"
              ? "tabIndex"
              : t
}
function If(t, e, r, n, o, i, s, a) {
  let u = Ee(e, r),
    c = e.inputs,
    l
  !a && c != null && (l = c[n])
    ? (nu(t, r, l, n, o), Xo(e) && iy(r, e.index))
    : e.type & 3
      ? ((n = oy(n)),
        (o = s != null ? s(o, e.value || "", n) : o),
        i.setProperty(u, n, o))
      : e.type & 12
}
function iy(t, e) {
  let r = wt(e, t)
  r[C] & 16 || (r[C] |= 64)
}
function Ef(t, e, r, n) {
  if (Ed()) {
    let o = n === null ? null : { "": -1 },
      i = ly(t, r),
      s,
      a
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && bf(t, e, r, s, o, a),
      o && dy(r, n, o)
  }
  r.mergedAttrs = Zn(r.mergedAttrs, r.attrs)
}
function bf(t, e, r, n, o, i) {
  for (let c = 0; c < n.length; c++) Ws(Po(r, e), t, n[c].type)
  hy(r, t.data.length, n.length)
  for (let c = 0; c < n.length; c++) {
    let l = n[c]
    l.providersResolver && l.providersResolver(l)
  }
  let s = !1,
    a = !1,
    u = mf(t, e, n.length, null)
  for (let c = 0; c < n.length; c++) {
    let l = n[c]
    ;(r.mergedAttrs = Zn(r.mergedAttrs, l.hostAttrs)),
      py(t, r, e, u, l),
      fy(u, l, o),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64)
    let d = l.type.prototype
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      u++
  }
  ry(t, r, i)
}
function sy(t, e, r, n, o) {
  let i = o.hostBindings
  if (i) {
    let s = t.hostBindingOpCodes
    s === null && (s = t.hostBindingOpCodes = [])
    let a = ~e.index
    ay(s) != a && s.push(a), s.push(r, n, i)
  }
}
function ay(t) {
  let e = t.length
  for (; e > 0; ) {
    let r = t[--e]
    if (typeof r == "number" && r < 0) return r
  }
  return 0
}
function uy(t, e, r, n) {
  let o = r.directiveStart,
    i = r.directiveEnd
  Xo(r) && gy(e, r, t.data[o + r.componentOffset]),
    t.firstCreatePass || Po(r, e),
    jt(n, e)
  let s = r.initialInputs
  for (let a = o; a < i; a++) {
    let u = t.data[a],
      c = En(e, t, a, r)
    if ((jt(c, e), s !== null && yy(e, a - o, c, u, r, s), mt(u))) {
      let l = wt(r.index, e)
      l[je] = En(e, t, a, r)
    }
  }
}
function Mf(t, e, r) {
  let n = r.directiveStart,
    o = r.directiveEnd,
    i = r.index,
    s = Gm()
  try {
    Lt(i)
    for (let a = n; a < o; a++) {
      let u = t.data[a],
        c = e[a]
      zs(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          cy(u, c)
    }
  } finally {
    Lt(-1), zs(s)
  }
}
function cy(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e)
}
function ly(t, e) {
  let r = t.directiveRegistry,
    n = null,
    o = null
  if (r)
    for (let i = 0; i < r.length; i++) {
      let s = r[i]
      if (Kg(e, s.selectors, !1))
        if ((n || (n = []), mt(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = []
            ;(o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              n.unshift(...a, s)
            let u = a.length
            ea(t, e, u)
          } else n.unshift(s), ea(t, e, 0)
        else (o = o || new Map()), s.findHostDirectiveDefs?.(s, n, o), n.push(s)
    }
  return n === null ? null : [n, o]
}
function ea(t, e, r) {
  ;(e.componentOffset = r), (t.components ??= []).push(e.index)
}
function dy(t, e, r) {
  if (e) {
    let n = (t.localNames = [])
    for (let o = 0; o < e.length; o += 2) {
      let i = r[e[o + 1]]
      if (i == null) throw new v(-301, !1)
      n.push(e[o], i)
    }
  }
}
function fy(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t
    mt(e) && (r[""] = t)
  }
}
function hy(t, e, r) {
  ;(t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e)
}
function py(t, e, r, n, o) {
  t.data[n] = o
  let i = o.factory || (o.factory = vn(o.type, !0)),
    s = new Vt(i, mt(o), k)
  ;(t.blueprint[n] = s), (r[n] = s), sy(t, e, n, mf(t, r, o.hostVars, Re), o)
}
function gy(t, e, r) {
  let n = Ee(e, t),
    o = wf(r),
    i = t[Ne].rendererFactory,
    s = 16
  r.signals ? (s = 4096) : r.onPush && (s = 64)
  let a = ii(
    t,
    ri(t, o, null, s, n, e, null, i.createRenderer(n, r), null, null, null)
  )
  t[e.index] = a
}
function my(t, e, r, n, o, i) {
  let s = Ee(t, e)
  vy(e[Z], s, i, t.value, r, n, o)
}
function vy(t, e, r, n, o, i, s) {
  if (i == null) t.removeAttribute(e, o, r)
  else {
    let a = s == null ? mn(i) : s(i, n || "", o)
    t.setAttribute(e, o, a, r)
  }
}
function yy(t, e, r, n, o, i) {
  let s = i[e]
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++]
      gf(n, r, u, c, l, d)
    }
}
function Dy(t, e, r) {
  let n = null,
    o = 0
  for (; o < r.length; ) {
    let i = r[o]
    if (i === 0) {
      o += 4
      continue
    } else if (i === 5) {
      o += 2
      continue
    }
    if (typeof i == "number") break
    if (t.hasOwnProperty(i)) {
      n === null && (n = [])
      let s = t[i]
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(i, s[a + 1], s[a + 2], r[o + 1])
          break
        }
    }
    o += 2
  }
  return n
}
function _f(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null]
}
function Sf(t, e) {
  let r = t.contentQueries
  if (r !== null) {
    let n = R(null)
    try {
      for (let o = 0; o < r.length; o += 2) {
        let i = r[o],
          s = r[o + 1]
        if (s !== -1) {
          let a = t.data[s]
          Ad(i), a.contentQueries(2, e[s], s)
        }
      }
    } finally {
      R(n)
    }
  }
}
function ii(t, e) {
  return t[Kn] ? (t[dl][Te] = e) : (t[Kn] = e), (t[dl] = e), e
}
function ta(t, e, r) {
  Ad(0)
  let n = R(null)
  try {
    e(t, r)
  } finally {
    R(n)
  }
}
function Cy(t) {
  return t[Qn] || (t[Qn] = [])
}
function wy(t) {
  return t.cleanup || (t.cleanup = [])
}
function Af(t, e) {
  let r = t[wn],
    n = r ? r.get(Be, null) : null
  n && n.handleError(e)
}
function nu(t, e, r, n, o) {
  for (let i = 0; i < r.length; ) {
    let s = r[i++],
      a = r[i++],
      u = r[i++],
      c = e[s],
      l = t.data[s]
    gf(l, c, n, a, u, o)
  }
}
function xf(t, e, r) {
  let n = Dd(e, t)
  Tv(t[Z], n, r)
}
function Iy(t, e) {
  let r = wt(e, t),
    n = r[T]
  Ey(n, r)
  let o = r[rt]
  o !== null && r[xo] === null && (r[xo] = Ya(o, r[wn])), ru(n, r, r[je])
}
function Ey(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r])
}
function ru(t, e, r) {
  La(e)
  try {
    let n = t.viewQuery
    n !== null && ta(1, n, r)
    let o = t.template
    o !== null && vf(t, e, o, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[In]?.finishViewCreation(t),
      t.staticContentQueries && Sf(t, e),
      t.staticViewQueries && ta(2, t.viewQuery, r)
    let i = t.components
    i !== null && by(e, i)
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    )
  } finally {
    ;(e[C] &= -5), Va()
  }
}
function by(t, e) {
  for (let r = 0; r < e.length; r++) Iy(t, e[r])
}
function My(t, e, r, n) {
  let o = R(null)
  try {
    let i = e.tView,
      a = t[C] & 4096 ? 4096 : 16,
      u = ri(
        t,
        i,
        r,
        a,
        null,
        e,
        null,
        null,
        n?.injector ?? null,
        n?.embeddedViewInjector ?? null,
        n?.dehydratedView ?? null
      ),
      c = t[e.index]
    u[Ko] = c
    let l = t[In]
    return l !== null && (u[In] = l.createEmbeddedView(i)), ru(i, u, r), u
  } finally {
    R(o)
  }
}
function bl(t, e) {
  return !e || e.firstChild === null || Wd(t)
}
function _y(t, e, r, n = !0) {
  let o = e[T]
  if ((Fv(o, e, t, r), n)) {
    let s = Xs(r, t),
      a = e[Z],
      u = Ja(a, t[kt])
    u !== null && Ov(o, t[Oe], a, e, u, s)
  }
  let i = e[xo]
  i !== null && i.firstChild !== null && (i.firstChild = null)
}
function Vo(t, e, r, n, o = !1) {
  for (; r !== null; ) {
    let i = e[r.index]
    i !== null && n.push(Ue(i)), ot(i) && Sy(i, n)
    let s = r.type
    if (s & 8) Vo(t, e, r.child, n)
    else if (s & 32) {
      let a = Ka(r, e),
        u
      for (; (u = a()); ) n.push(u)
    } else if (s & 16) {
      let a = lf(e, r)
      if (Array.isArray(a)) n.push(...a)
      else {
        let u = Xn(e[$e])
        Vo(u[T], u, a, n, !0)
      }
    }
    r = o ? r.projectionNext : r.next
  }
  return n
}
function Sy(t, e) {
  for (let r = Ie; r < t.length; r++) {
    let n = t[r],
      o = n[T].firstChild
    o !== null && Vo(n[T], n, o, e)
  }
  t[kt] !== t[rt] && e.push(t[kt])
}
var Tf = []
function Ay(t) {
  return t[Pt] ?? xy(t)
}
function xy(t) {
  let e = Tf.pop() ?? Object.create(Ny)
  return (e.lView = t), e
}
function Ty(t) {
  t.lView[Pt] !== t && ((t.lView = null), Tf.push(t))
}
var Ny = U(g({}, _c), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: t => {
      Jn(t.lView)
    },
    consumerOnSignalRead() {
      this.lView[Pt] = this
    },
  }),
  Nf = 100
function Of(t, e = !0, r = 0) {
  let n = t[Ne],
    o = n.rendererFactory,
    i = !1
  i || o.begin?.()
  try {
    Oy(t, r)
  } catch (s) {
    throw (e && Af(t, s), s)
  } finally {
    i || (o.end?.(), n.inlineEffectRunner?.flush())
  }
}
function Oy(t, e) {
  na(t, e)
  let r = 0
  for (; Ra(t); ) {
    if (r === Nf) throw new v(103, !1)
    r++, na(t, 1)
  }
}
function Ry(t, e, r, n) {
  let o = e[C]
  if ((o & 256) === 256) return
  let i = !1
  !i && e[Ne].inlineEffectRunner?.flush(), La(e)
  let s = null,
    a = null
  !i && Fy(t) && ((a = Ay(e)), (s = Sc(a)))
  try {
    wd(e), Um(t.bindingStartIndex), r !== null && vf(t, e, r, 2, n)
    let u = (o & 3) === 3
    if (!i)
      if (u) {
        let d = t.preOrderCheckHooks
        d !== null && wo(e, d, null)
      } else {
        let d = t.preOrderHooks
        d !== null && Io(e, d, 0, null), bs(e, 0)
      }
    if ((Py(e), Rf(e, 0), t.contentQueries !== null && Sf(t, e), !i))
      if (u) {
        let d = t.contentCheckHooks
        d !== null && wo(e, d)
      } else {
        let d = t.contentHooks
        d !== null && Io(e, d, 1), bs(e, 1)
      }
    Qv(t, e)
    let c = t.components
    c !== null && Pf(e, c, 0)
    let l = t.viewQuery
    if ((l !== null && ta(2, l, n), !i))
      if (u) {
        let d = t.viewCheckHooks
        d !== null && wo(e, d)
      } else {
        let d = t.viewHooks
        d !== null && Io(e, d, 2), bs(e, 2)
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Es])) {
      for (let d of e[Es]) d()
      e[Es] = null
    }
    i || (e[C] &= -73)
  } catch (u) {
    throw (Jn(e), u)
  } finally {
    a !== null && (Ac(a, s), Ty(a)), Va()
  }
}
function Fy(t) {
  return t.type !== 2
}
function Rf(t, e) {
  for (let r = Yd(t); r !== null; r = Qd(r))
    for (let n = Ie; n < r.length; n++) {
      let o = r[n]
      Ff(o, e)
    }
}
function Py(t) {
  for (let e = Yd(t); e !== null; e = Qd(e)) {
    if (!(e[C] & Ta.HasTransplantedViews)) continue
    let r = e[No]
    for (let n = 0; n < r.length; n++) {
      let o = r[n],
        i = o[re]
      xm(o)
    }
  }
}
function ky(t, e, r) {
  let n = wt(e, t)
  Ff(n, r)
}
function Ff(t, e) {
  Oa(t) && na(t, e)
}
function na(t, e) {
  let n = t[T],
    o = t[C],
    i = t[Pt],
    s = !!(e === 0 && o & 16)
  if (
    ((s ||= !!(o & 64 && e === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && ns(i))),
    i && (i.dirty = !1),
    (t[C] &= -9217),
    s)
  )
    Ry(n, t, n.template, t[je])
  else if (o & 8192) {
    Rf(t, 1)
    let a = n.components
    a !== null && Pf(t, a, 1)
  }
}
function Pf(t, e, r) {
  for (let n = 0; n < e.length; n++) ky(t, e[n], r)
}
function ou(t) {
  for (t[Ne].changeDetectionScheduler?.notify(); t; ) {
    t[C] |= 64
    let e = Xn(t)
    if (Dm(t) && !e) return t
    t = e
  }
  return null
}
var $t = class {
    get rootNodes() {
      let e = this._lView,
        r = e[T]
      return Vo(r, e, r.firstChild, [])
    }
    constructor(e, r, n = !0) {
      ;(this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1)
    }
    get context() {
      return this._lView[je]
    }
    set context(e) {
      this._lView[je] = e
    }
    get destroyed() {
      return (this._lView[C] & 256) === 256
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this)
      else if (this._attachedToViewContainer) {
        let e = this._lView[re]
        if (ot(e)) {
          let r = e[To],
            n = r ? r.indexOf(this) : -1
          n > -1 && (Js(e, n), So(r, n))
        }
        this._attachedToViewContainer = !1
      }
      uf(this._lView[T], this._lView)
    }
    onDestroy(e) {
      Id(this._lView, e)
    }
    markForCheck() {
      ou(this._cdRefInjectingView || this._lView)
    }
    detach() {
      this._lView[C] &= -129
    }
    reattach() {
      Gs(this._lView), (this._lView[C] |= 128)
    }
    detectChanges() {
      ;(this._lView[C] |= 1024), Of(this._lView, this.notifyErrorHandler)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new v(902, !1)
      this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
      ;(this._appRef = null), sf(this._lView[T], this._lView)
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new v(902, !1)
      ;(this._appRef = e), Gs(this._lView)
    }
  },
  iu = (() => {
    let e = class e {}
    e.__NG_ELEMENT_ID__ = jy
    let t = e
    return t
  })(),
  Ly = iu,
  Vy = class extends Ly {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n)
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r)
    }
    createEmbeddedViewImpl(e, r, n) {
      let o = My(this._declarationLView, this._declarationTContainer, e, {
        embeddedViewInjector: r,
        dehydratedView: n,
      })
      return new $t(o)
    }
  }
function jy() {
  return $y(ge(), $())
}
function $y(t, e) {
  return t.type & 4 ? new Vy(e, t, ei(t, e)) : null
}
var bA = new RegExp(`^(\\d+)*(${Dv}|${yv})*(.*)`)
var Uy = () => null
function Ml(t, e) {
  return Uy(t, e)
}
var jo = class {},
  ra = class {},
  $o = class {}
function By(t) {
  let e = Error(`No component factory found for ${ce(t)}.`)
  return (e[Hy] = t), e
}
var Hy = "ngComponent"
var oa = class {
    resolveComponentFactory(e) {
      throw By(e)
    }
  },
  si = (() => {
    let e = class e {}
    e.NULL = new oa()
    let t = e
    return t
  })(),
  er = class {},
  Gt = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null
      }
    }
    e.__NG_ELEMENT_ID__ = () => Gy()
    let t = e
    return t
  })()
function Gy() {
  let t = $(),
    e = ge(),
    r = wt(e.index, t)
  return (Rt(r) ? r : t)[Z]
}
var zy = (() => {
    let e = class e {}
    e.ɵprov = y({ token: e, providedIn: "root", factory: () => null })
    let t = e
    return t
  })(),
  xs = {}
var _l = new Set()
function su(t) {
  _l.has(t) ||
    (_l.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }))
}
function Sl(...t) {}
function qy() {
  let t = typeof ue.requestAnimationFrame == "function",
    e = ue[t ? "requestAnimationFrame" : "setTimeout"],
    r = ue[t ? "cancelAnimationFrame" : "clearTimeout"]
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")]
    n && (e = n)
    let o = r[Zone.__symbol__("OriginalDelegate")]
    o && (r = o)
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r }
}
var V = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new te(!1)),
        (this.onMicrotaskEmpty = new te(!1)),
        (this.onStable = new te(!1)),
        (this.onError = new te(!1)),
        typeof Zone > "u")
      )
        throw new v(908, !1)
      Zone.assertZonePatched()
      let o = this
      ;(o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !n && r),
        (o.shouldCoalesceRunChangeDetection = n),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = qy().nativeRequestAnimationFrame),
        Yy(o)
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new v(909, !1)
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new v(909, !1)
    }
    run(e, r, n) {
      return this._inner.run(e, r, n)
    }
    runTask(e, r, n, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, e, Wy, Sl, Sl)
      try {
        return i.runTask(s, r, n)
      } finally {
        i.cancelTask(s)
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n)
    }
    runOutsideAngular(e) {
      return this._outer.run(e)
    }
  },
  Wy = {}
function au(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null)
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null))
        } finally {
          t.isStable = !0
        }
    }
}
function Zy(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      ue,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              ;(t.lastRequestAnimationFrameId = -1),
                ia(t),
                (t.isCheckStableRunning = !0),
                au(t),
                (t.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke()
      }
    )),
    ia(t))
}
function Yy(t) {
  let e = () => {
    Zy(t)
  }
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, o, i, s, a) => {
      if (Qy(a)) return r.invokeTask(o, i, s, a)
      try {
        return Al(t), r.invokeTask(o, i, s, a)
      } finally {
        ;((t.shouldCoalesceEventChangeDetection && i.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          xl(t)
      }
    },
    onInvoke: (r, n, o, i, s, a, u) => {
      try {
        return Al(t), r.invoke(o, i, s, a, u)
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), xl(t)
      }
    },
    onHasTask: (r, n, o, i) => {
      r.hasTask(o, i),
        n === o &&
          (i.change == "microTask"
            ? ((t._hasPendingMicrotasks = i.microTask), ia(t), au(t))
            : i.change == "macroTask" && (t.hasPendingMacrotasks = i.macroTask))
    },
    onHandleError: (r, n, o, i) => (
      r.handleError(o, i), t.runOutsideAngular(() => t.onError.emit(i)), !1
    ),
  })
}
function ia(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1)
}
function Al(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null))
}
function xl(t) {
  t._nesting--, au(t)
}
function Qy(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0
}
var hn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    )
  })(hn || {}),
  Ky = { destroy() {} }
function ai(t, e) {
  !e && vm(ai)
  let r = e?.injector ?? p(it)
  if (!Sv(r)) return Ky
  su("NgAfterNextRender")
  let n = r.get(uu),
    o = (n.handler ??= new aa()),
    i = e?.phase ?? hn.MixedReadWrite,
    s = () => {
      o.unregister(u), a()
    },
    a = r.get(za).onDestroy(s),
    u = nt(
      r,
      () =>
        new sa(i, () => {
          s(), t()
        })
    )
  return o.register(u), { destroy: s }
}
var sa = class {
    constructor(e, r) {
      ;(this.phase = e),
        (this.callbackFn = r),
        (this.zone = p(V)),
        (this.errorHandler = p(Be, { optional: !0 })),
        p(jo, { optional: !0 })?.notify(1)
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn)
      } catch (e) {
        this.errorHandler?.handleError(e)
      }
    }
  },
  aa = class {
    constructor() {
      ;(this.executingCallbacks = !1),
        (this.buckets = {
          [hn.EarlyRead]: new Set(),
          [hn.Write]: new Set(),
          [hn.MixedReadWrite]: new Set(),
          [hn.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set())
    }
    register(e) {
      ;(this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e)
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e)
    }
    execute() {
      this.executingCallbacks = !0
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke()
      this.executingCallbacks = !1
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e)
      this.deferredCallbacks.clear()
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear()
      this.deferredCallbacks.clear()
    }
  },
  uu = (() => {
    let e = class e {
      constructor() {
        ;(this.handler = null), (this.internalCallbacks = [])
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute()
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks]
        this.internalCallbacks.length = 0
        for (let o of n) o()
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0)
      }
    }
    e.ɵprov = y({ token: e, providedIn: "root", factory: () => new e() })
    let t = e
    return t
  })()
function ua(t, e, r) {
  let n = r ? t.styles : null,
    o = r ? t.classes : null,
    i = 0
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s]
      if (typeof a == "number") i = a
      else if (i == 1) o = tl(o, a)
      else if (i == 2) {
        let u = a,
          c = e[++s]
        n = tl(n, u + ": " + c + ";")
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = o) : (t.classesWithoutHost = o)
}
var Uo = class extends si {
  constructor(e) {
    super(), (this.ngModule = e)
  }
  resolveComponentFactory(e) {
    let r = gt(e)
    return new bn(r, this.ngModule)
  }
}
function Tl(t) {
  let e = []
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue
    let n = t[r]
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r })
  }
  return e
}
function Jy(t) {
  let e = t.toLowerCase()
  return e === "svg" ? Em : e === "math" ? bm : null
}
var ca = class {
    constructor(e, r) {
      ;(this.injector = e), (this.parentInjector = r)
    }
    get(e, r, n) {
      n = Wo(n)
      let o = this.injector.get(e, xs, n)
      return o !== xs || r === xs ? o : this.parentInjector.get(e, r, n)
    }
  },
  bn = class extends $o {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = Tl(e.inputs)
      if (r !== null)
        for (let o of n)
          r.hasOwnProperty(o.propName) && (o.transform = r[o.propName])
      return n
    }
    get outputs() {
      return Tl(this.componentDef.outputs)
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = tm(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r)
    }
    create(e, r, n, o) {
      let i = R(null)
      try {
        o = o || this.ngModule
        let s = o instanceof le ? o : o?.injector
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s)
        let a = s ? new ca(e, s) : e,
          u = a.get(er, null)
        if (u === null) throw new v(407, !1)
        let c = a.get(zy, null),
          l = a.get(uu, null),
          d = a.get(jo, null),
          h = {
            rendererFactory: u,
            sanitizer: c,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          f = u.createRenderer(null, this.componentDef),
          m = this.componentDef.selectors[0][0] || "div",
          M = n
            ? Xv(f, n, this.componentDef.encapsulation, a)
            : of(f, m, Jy(m)),
          B = 512
        this.componentDef.signals
          ? (B |= 4096)
          : this.componentDef.onPush || (B |= 16)
        let O = null
        M !== null && (O = Ya(M, a, !0))
        let Qe = tu(0, null, null, 1, 0, null, null, null, null, null, null),
          se = ri(null, Qe, null, B, null, null, h, f, a, null, O)
        La(se)
        let Ke, Yt
        try {
          let Se = this.componentDef,
            Qt,
            es = null
          Se.findHostDirectiveDefs
            ? ((Qt = []),
              (es = new Map()),
              Se.findHostDirectiveDefs(Se, Qt, es),
              Qt.push(Se))
            : (Qt = [Se])
          let Gp = Xy(se, M),
            zp = eD(Gp, M, Se, Qt, se, h, f)
          ;(Yt = Cd(Qe, et)),
            M && rD(f, Se, M, n),
            r !== void 0 && oD(Yt, this.ngContentSelectors, r),
            (Ke = nD(zp, Se, Qt, es, se, [iD])),
            ru(Qe, se, null)
        } finally {
          Va()
        }
        return new la(this.componentType, Ke, ei(Yt, se), se, Yt)
      } finally {
        R(i)
      }
    }
  },
  la = class extends ra {
    constructor(e, r, n, o, i) {
      super(),
        (this.location = n),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new $t(o, void 0, !1)),
        (this.componentType = e)
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        o
      if (n !== null && (o = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return
        let i = this._rootLView
        nu(i[T], i, o, e, r), this.previousInputValues.set(e, r)
        let s = wt(this._tNode.index, i)
        ou(s)
      }
    }
    get injector() {
      return new Ft(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(e) {
      this.hostView.onDestroy(e)
    }
  }
function Xy(t, e) {
  let r = t[T],
    n = et
  return (t[n] = e), oi(r, n, 2, "#host", null)
}
function eD(t, e, r, n, o, i, s) {
  let a = o[T]
  tD(n, t, e, s)
  let u = null
  e !== null && (u = Ya(e, o[wn]))
  let c = i.rendererFactory.createRenderer(e, r),
    l = 16
  r.signals ? (l = 4096) : r.onPush && (l = 64)
  let d = ri(o, wf(r), null, l, o[t.index], t, i, c, null, null, u)
  return a.firstCreatePass && ea(a, t, n.length - 1), ii(o, d), (o[t.index] = d)
}
function tD(t, e, r, n) {
  for (let o of t) e.mergedAttrs = Zn(e.mergedAttrs, o.hostAttrs)
  e.mergedAttrs !== null &&
    (ua(e, e.mergedAttrs, !0), r !== null && ff(n, r, e))
}
function nD(t, e, r, n, o, i) {
  let s = ge(),
    a = o[T],
    u = Ee(s, o)
  bf(a, o, s, r, null, n)
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      h = En(o, a, d, s)
    jt(h, o)
  }
  Mf(a, o, s), u && jt(u, o)
  let c = En(o, a, s.directiveStart + s.componentOffset, s)
  if (((t[je] = o[je] = c), i !== null)) for (let l of i) l(c, e)
  return yf(a, s, o), c
}
function rD(t, e, r, n) {
  if (n) js(t, r, ["ng-version", "17.3.12"])
  else {
    let { attrs: o, classes: i } = nm(e.selectors[0])
    o && js(t, r, o), i && i.length > 0 && df(t, r, i.join(" "))
  }
}
function oD(t, e, r) {
  let n = (t.projection = [])
  for (let o = 0; o < e.length; o++) {
    let i = r[o]
    n.push(i != null ? Array.from(i) : null)
  }
}
function iD() {
  let t = ge()
  Ba($()[T], t)
}
var lr = (() => {
  let e = class e {}
  e.__NG_ELEMENT_ID__ = sD
  let t = e
  return t
})()
function sD() {
  let t = ge()
  return uD(t, $())
}
var aD = lr,
  kf = class extends aD {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n)
    }
    get element() {
      return ei(this._hostTNode, this._hostLView)
    }
    get injector() {
      return new Ft(this._hostTNode, this._hostLView)
    }
    get parentInjector() {
      let e = Ha(this._hostTNode, this._hostLView)
      if (kd(e)) {
        let r = Fo(e, this._hostLView),
          n = Ro(e),
          o = r[T].data[n + 8]
        return new Ft(o, r)
      } else return new Ft(null, this._hostLView)
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1)
    }
    get(e) {
      let r = Nl(this._lContainer)
      return (r !== null && r[e]) || null
    }
    get length() {
      return this._lContainer.length - Ie
    }
    createEmbeddedView(e, r, n) {
      let o, i
      typeof n == "number"
        ? (o = n)
        : n != null && ((o = n.index), (i = n.injector))
      let s = Ml(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, i, s)
      return this.insertImpl(a, o, bl(this._hostTNode, s)), a
    }
    createComponent(e, r, n, o, i) {
      let s = e && !ym(e),
        a
      if (s) a = r
      else {
        let m = r || {}
        ;(a = m.index),
          (n = m.injector),
          (o = m.projectableNodes),
          (i = m.environmentInjector || m.ngModuleRef)
      }
      let u = s ? e : new bn(gt(e)),
        c = n || this.parentInjector
      if (!i && u.ngModule == null) {
        let M = (s ? c : this.parentInjector).get(le, null)
        M && (i = M)
      }
      let l = gt(u.componentType ?? {}),
        d = Ml(this._lContainer, l?.id ?? null),
        h = d?.firstChild ?? null,
        f = u.create(c, o, h, i)
      return this.insertImpl(f.hostView, a, bl(this._hostTNode, d)), f
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0)
    }
    insertImpl(e, r, n) {
      let o = e._lView
      if (Am(o)) {
        let a = this.indexOf(e)
        if (a !== -1) this.detach(a)
        else {
          let u = o[re],
            c = new kf(u, u[Oe], u[re])
          c.detach(c.indexOf(e))
        }
      }
      let i = this._adjustIndex(r),
        s = this._lContainer
      return _y(s, o, i, n), e.attachToViewContainerRef(), Yl(Ts(s), i, e), e
    }
    move(e, r) {
      return this.insert(e, r)
    }
    indexOf(e) {
      let r = Nl(this._lContainer)
      return r !== null ? r.indexOf(e) : -1
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = Js(this._lContainer, r)
      n && (So(Ts(this._lContainer), r), uf(n[T], n))
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = Js(this._lContainer, r)
      return n && So(Ts(this._lContainer), r) != null ? new $t(n) : null
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r
    }
  }
function Nl(t) {
  return t[To]
}
function Ts(t) {
  return t[To] || (t[To] = [])
}
function uD(t, e) {
  let r,
    n = e[t.index]
  return (
    ot(n) ? (r = n) : ((r = _f(n, e, null, t)), (e[t.index] = r), ii(e, r)),
    lD(r, e, t, n),
    new kf(r, t, e)
  )
}
function cD(t, e) {
  let r = t[Z],
    n = r.createComment(""),
    o = Ee(e, t),
    i = Ja(r, o)
  return Lo(r, i, n, Uv(r, o), !1), n
}
var lD = hD,
  dD = () => !1
function fD(t, e, r) {
  return dD(t, e, r)
}
function hD(t, e, r, n) {
  if (t[kt]) return
  let o
  r.type & 8 ? (o = Ue(n)) : (o = cD(e, r)), (t[kt] = o)
}
function pD(t) {
  return Object.getPrototypeOf(t.prototype).constructor
}
function bt(t) {
  let e = pD(t.type),
    r = !0,
    n = [t]
  for (; e; ) {
    let o
    if (mt(t)) o = e.ɵcmp || e.ɵdir
    else {
      if (e.ɵcmp) throw new v(903, !1)
      o = e.ɵdir
    }
    if (o) {
      if (r) {
        n.push(o)
        let s = t
        ;(s.inputs = yo(t.inputs)),
          (s.inputTransforms = yo(t.inputTransforms)),
          (s.declaredInputs = yo(t.declaredInputs)),
          (s.outputs = yo(t.outputs))
        let a = o.hostBindings
        a && DD(t, a)
        let u = o.viewQuery,
          c = o.contentQueries
        if (
          (u && vD(t, u),
          c && yD(t, c),
          gD(t, o),
          Eg(t.outputs, o.outputs),
          mt(o) && o.data.animation)
        ) {
          let l = t.data
          l.animation = (l.animation || []).concat(o.data.animation)
        }
      }
      let i = o.features
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s]
          a && a.ngInherit && a(t), a === bt && (r = !1)
        }
    }
    e = Object.getPrototypeOf(e)
  }
  mD(n)
}
function gD(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue
    let n = e.inputs[r]
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let o = Array.isArray(n) ? n[0] : n
      if (!e.inputTransforms.hasOwnProperty(o)) continue
      ;(t.inputTransforms ??= {}), (t.inputTransforms[o] = e.inputTransforms[o])
    }
  }
}
function mD(t) {
  let e = 0,
    r = null
  for (let n = t.length - 1; n >= 0; n--) {
    let o = t[n]
    ;(o.hostVars = e += o.hostVars),
      (o.hostAttrs = Zn(o.hostAttrs, (r = Zn(r, o.hostAttrs))))
  }
}
function yo(t) {
  return t === yn ? {} : t === we ? [] : t
}
function vD(t, e) {
  let r = t.viewQuery
  r
    ? (t.viewQuery = (n, o) => {
        e(n, o), r(n, o)
      })
    : (t.viewQuery = e)
}
function yD(t, e) {
  let r = t.contentQueries
  r
    ? (t.contentQueries = (n, o, i) => {
        e(n, o, i), r(n, o, i)
      })
    : (t.contentQueries = e)
}
function DD(t, e) {
  let r = t.hostBindings
  r
    ? (t.hostBindings = (n, o) => {
        e(n, o), r(n, o)
      })
    : (t.hostBindings = e)
}
function cu(t) {
  let e = t.inputConfig,
    r = {}
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let o = e[n]
      Array.isArray(o) && o[3] && (r[n] = o[3])
    }
  t.inputTransforms = r
}
var vt = class {},
  tr = class {}
var da = class extends vt {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Uo(this))
      let o = od(e)
      ;(this._bootstrapComponents = rf(o.bootstrap)),
        (this._r3Injector = zd(
          e,
          r,
          [
            { provide: vt, useValue: this },
            { provide: si, useValue: this.componentFactoryResolver },
            ...n,
          ],
          ce(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e))
    }
    get injector() {
      return this._r3Injector
    }
    destroy() {
      let e = this._r3Injector
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach(r => r()),
        (this.destroyCbs = null)
    }
    onDestroy(e) {
      this.destroyCbs.push(e)
    }
  },
  fa = class extends tr {
    constructor(e) {
      super(), (this.moduleType = e)
    }
    create(e) {
      return new da(this.moduleType, e, [])
    }
  }
var Bo = class extends vt {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Uo(this)),
      (this.instance = null)
    let r = new Yn(
      [
        ...e.providers,
        { provide: vt, useValue: this },
        { provide: si, useValue: this.componentFactoryResolver },
      ],
      e.parent || xa(),
      e.debugName,
      new Set(["environment"])
    )
    ;(this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers()
  }
  destroy() {
    this.injector.destroy()
  }
  onDestroy(e) {
    this.injector.onDestroy(e)
  }
}
function ui(t, e, r = null) {
  return new Bo({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector
}
var ci = (() => {
  let e = class e {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new K(!1))
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0)
      let n = this.taskId++
      return this.pendingTasks.add(n), n
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1)
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1)
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
function Lf(t) {
  return wD(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1
}
function CD(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r])
  else {
    let r = t[Symbol.iterator](),
      n
    for (; !(n = r.next()).done; ) e(n.value)
  }
}
function wD(t) {
  return t !== null && (typeof t == "function" || typeof t == "object")
}
function Vf(t, e, r) {
  return (t[e] = r)
}
function ID(t, e) {
  return t[e]
}
function Ut(t, e, r) {
  let n = t[e]
  return Object.is(n, r) ? !1 : ((t[e] = r), !0)
}
function ED(t, e, r, n) {
  let o = Ut(t, e, r)
  return Ut(t, e + 1, n) || o
}
function bD(t) {
  return (t.flags & 32) === 32
}
function MD(t, e, r, n, o, i, s, a, u) {
  let c = e.consts,
    l = oi(e, t, 4, s || null, Oo(c, a))
  Ef(e, r, l, Oo(c, u)), Ba(e, l)
  let d = (l.tView = tu(
    2,
    l,
    n,
    o,
    i,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null
  ))
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  )
}
function lu(t, e, r, n, o, i, s, a) {
  let u = $(),
    c = be(),
    l = t + et,
    d = c.firstCreatePass ? MD(l, c, u, e, r, n, o, i, s) : c.data[l]
  sr(d, !1)
  let h = _D(c, u, d, t)
  $a() && Xa(c, u, h, d), jt(h, u)
  let f = _f(h, u, h, d)
  return (
    (u[l] = f),
    ii(u, f),
    fD(f, d, u),
    Na(d) && Df(c, u, d),
    s != null && Cf(u, d, a),
    lu
  )
}
var _D = SD
function SD(t, e, r, n) {
  return Ua(!0), e[Z].createComment("")
}
function li(t, e, r, n) {
  let o = $(),
    i = ka()
  if (Ut(o, i, e)) {
    let s = be(),
      a = ja()
    my(a, o, t, e, r, n)
  }
  return li
}
function jf(t, e, r, n) {
  return Ut(t, ka(), r) ? e + mn(r) + n : Re
}
function AD(t, e, r, n, o, i) {
  let s = $m(),
    a = ED(t, s, r, o)
  return Sd(2), a ? e + mn(r) + n + mn(o) + i : Re
}
function Do(t, e) {
  return (t << 17) | (e << 2)
}
function Bt(t) {
  return (t >> 17) & 32767
}
function xD(t) {
  return (t & 2) == 2
}
function TD(t, e) {
  return (t & 131071) | (e << 17)
}
function ha(t) {
  return t | 2
}
function Mn(t) {
  return (t & 131068) >> 2
}
function Ns(t, e) {
  return (t & -131069) | (e << 2)
}
function ND(t) {
  return (t & 1) === 1
}
function pa(t) {
  return t | 1
}
function OD(t, e, r, n, o, i) {
  let s = i ? e.classBindings : e.styleBindings,
    a = Bt(s),
    u = Mn(s)
  t[n] = r
  let c = !1,
    l
  if (Array.isArray(r)) {
    let d = r
    ;(l = d[1]), (l === null || or(d, l) > 0) && (c = !0)
  } else l = r
  if (o)
    if (u !== 0) {
      let h = Bt(t[a + 1])
      ;(t[n + 1] = Do(h, a)),
        h !== 0 && (t[h + 1] = Ns(t[h + 1], n)),
        (t[a + 1] = TD(t[a + 1], n))
    } else
      (t[n + 1] = Do(a, 0)), a !== 0 && (t[a + 1] = Ns(t[a + 1], n)), (a = n)
  else
    (t[n + 1] = Do(u, 0)),
      a === 0 ? (a = n) : (t[u + 1] = Ns(t[u + 1], n)),
      (u = n)
  c && (t[n + 1] = ha(t[n + 1])),
    Ol(t, l, n, !0),
    Ol(t, l, n, !1),
    RD(e, l, t, n, i),
    (s = Do(a, u)),
    i ? (e.classBindings = s) : (e.styleBindings = s)
}
function RD(t, e, r, n, o) {
  let i = o ? t.residualClasses : t.residualStyles
  i != null &&
    typeof e == "string" &&
    or(i, e) >= 0 &&
    (r[n + 1] = pa(r[n + 1]))
}
function Ol(t, e, r, n) {
  let o = t[r + 1],
    i = e === null,
    s = n ? Bt(o) : Mn(o),
    a = !1
  for (; s !== 0 && (a === !1 || i); ) {
    let u = t[s],
      c = t[s + 1]
    FD(u, e) && ((a = !0), (t[s + 1] = n ? pa(c) : ha(c))),
      (s = n ? Bt(c) : Mn(c))
  }
  a && (t[r + 1] = n ? ha(o) : pa(o))
}
function FD(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
      ? or(t, e) >= 0
      : !1
}
function Me(t, e, r) {
  let n = $(),
    o = ka()
  if (Ut(n, o, e)) {
    let i = be(),
      s = ja()
    If(i, s, n, t, e, n[Z], r, !1)
  }
  return Me
}
function Rl(t, e, r, n, o) {
  let i = e.inputs,
    s = o ? "class" : "style"
  nu(t, r, i[s], s, n)
}
function di(t, e) {
  return PD(t, e, null, !0), di
}
function PD(t, e, r, n) {
  let o = $(),
    i = be(),
    s = Sd(2)
  if ((i.firstUpdatePass && LD(i, t, s, n), e !== Re && Ut(o, s, e))) {
    let a = i.data[Ht()]
    BD(i, a, o, o[Z], t, (o[s + 1] = HD(e, r)), n, s)
  }
}
function kD(t, e) {
  return e >= t.expandoStartIndex
}
function LD(t, e, r, n) {
  let o = t.data
  if (o[r + 1] === null) {
    let i = o[Ht()],
      s = kD(t, r)
    GD(i, n) && e === null && !s && (e = !1),
      (e = VD(o, i, e, n)),
      OD(o, i, e, r, s, n)
  }
}
function VD(t, e, r, n) {
  let o = zm(t),
    i = n ? e.residualClasses : e.residualStyles
  if (o === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = Os(null, t, e, r, n)), (r = nr(r, e.attrs, n)), (i = null))
  else {
    let s = e.directiveStylingLast
    if (s === -1 || t[s] !== o)
      if (((r = Os(o, t, e, r, n)), i === null)) {
        let u = jD(t, e, n)
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = Os(null, t, e, u[1], n)),
          (u = nr(u, e.attrs, n)),
          $D(t, e, n, u))
      } else i = UD(t, e, n)
  }
  return (
    i !== void 0 && (n ? (e.residualClasses = i) : (e.residualStyles = i)), r
  )
}
function jD(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings
  if (Mn(n) !== 0) return t[Bt(n)]
}
function $D(t, e, r, n) {
  let o = r ? e.classBindings : e.styleBindings
  t[Bt(o)] = n
}
function UD(t, e, r) {
  let n,
    o = e.directiveEnd
  for (let i = 1 + e.directiveStylingLast; i < o; i++) {
    let s = t[i].hostAttrs
    n = nr(n, s, r)
  }
  return nr(n, e.attrs, r)
}
function Os(t, e, r, n, o) {
  let i = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((i = e[a]), (n = nr(n, i.hostAttrs, o)), i !== t);

  )
    a++
  return t !== null && (r.directiveStylingLast = a), n
}
function nr(t, e, r) {
  let n = r ? 1 : 2,
    o = -1
  if (e !== null)
    for (let i = 0; i < e.length; i++) {
      let s = e[i]
      typeof s == "number"
        ? (o = s)
        : o === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Hg(t, s, r ? !0 : e[++i]))
    }
  return t === void 0 ? null : t
}
function BD(t, e, r, n, o, i, s, a) {
  if (!(e.type & 3)) return
  let u = t.data,
    c = u[a + 1],
    l = ND(c) ? Fl(u, e, r, o, Mn(c), s) : void 0
  if (!Ho(l)) {
    Ho(i) || (xD(c) && (i = Fl(u, null, r, o, a, s)))
    let d = Dd(Ht(), r)
    Zv(n, s, d, o, i)
  }
}
function Fl(t, e, r, n, o, i) {
  let s = e === null,
    a
  for (; o > 0; ) {
    let u = t[o],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      h = r[o + 1]
    h === Re && (h = d ? we : void 0)
    let f = d ? ws(h, n) : l === n ? h : void 0
    if ((c && !Ho(f) && (f = ws(u, n)), Ho(f) && ((a = f), s))) return a
    let m = t[o + 1]
    o = s ? Bt(m) : Mn(m)
  }
  if (e !== null) {
    let u = i ? e.residualClasses : e.residualStyles
    u != null && (a = ws(u, n))
  }
  return a
}
function Ho(t) {
  return t !== void 0
}
function HD(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = ce(ur(t)))),
    t
  )
}
function GD(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0
}
function zD(t, e, r, n, o, i) {
  let s = e.consts,
    a = Oo(s, o),
    u = oi(e, t, 2, n, a)
  return (
    Ef(e, r, u, Oo(s, i)),
    u.attrs !== null && ua(u, u.attrs, !1),
    u.mergedAttrs !== null && ua(u, u.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, u),
    u
  )
}
function L(t, e, r, n) {
  let o = $(),
    i = be(),
    s = et + t,
    a = o[Z],
    u = i.firstCreatePass ? zD(s, i, o, e, r, n) : i.data[s],
    c = qD(i, o, u, a, e, t)
  o[s] = c
  let l = Na(u)
  return (
    sr(u, !0),
    ff(a, c, u),
    !bD(u) && $a() && Xa(i, o, c, u),
    Nm() === 0 && jt(c, o),
    Om(),
    l && (Df(i, o, u), yf(i, u, o)),
    n !== null && Cf(o, u),
    L
  )
}
function H() {
  let t = ge()
  Md() ? Vm() : ((t = t.parent), sr(t, !1))
  let e = t
  Pm(e) && km(), Rm()
  let r = be()
  return (
    r.firstCreatePass && (Ba(r, t), pd(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      Km(e) &&
      Rl(r, e, $(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      Jm(e) &&
      Rl(r, e, $(), e.stylesWithoutHost, !1),
    H
  )
}
function oe(t, e, r, n) {
  return L(t, e, r, n), H(), oe
}
var qD = (t, e, r, n, o, i) => (Ua(!0), of(n, o, Wm()))
function $f() {
  return $()
}
var Go = "en-US"
var WD = Go
function ZD(t) {
  typeof t == "string" && (WD = t.toLowerCase().replace(/_/g, "-"))
}
function Fe(t, e, r, n) {
  let o = $(),
    i = be(),
    s = ge()
  return QD(i, o, o[Z], s, t, e, n), Fe
}
function YD(t, e, r, n) {
  let o = t.cleanup
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i]
      if (s === r && o[i + 1] === n) {
        let a = e[Qn],
          u = o[i + 2]
        return a.length > u ? a[u] : null
      }
      typeof s == "string" && (i += 2)
    }
  return null
}
function QD(t, e, r, n, o, i, s) {
  let a = Na(n),
    c = t.firstCreatePass && wy(t),
    l = e[je],
    d = Cy(e),
    h = !0
  if (n.type & 3 || s) {
    let M = Ee(n, e),
      B = s ? s(M) : M,
      O = d.length,
      Qe = s ? Ke => s(Ue(Ke[n.index])) : n.index,
      se = null
    if ((!s && a && (se = YD(t, e, o, n.index)), se !== null)) {
      let Ke = se.__ngLastListenerFn__ || se
      ;(Ke.__ngNextListenerFn__ = i), (se.__ngLastListenerFn__ = i), (h = !1)
    } else {
      i = kl(n, e, l, i, !1)
      let Ke = r.listen(B, o, i)
      d.push(i, Ke), c && c.push(o, Qe, O, O + 1)
    }
  } else i = kl(n, e, l, i, !1)
  let f = n.outputs,
    m
  if (h && f !== null && (m = f[o])) {
    let M = m.length
    if (M)
      for (let B = 0; B < M; B += 2) {
        let O = m[B],
          Qe = m[B + 1],
          Yt = e[O][Qe].subscribe(i),
          Se = d.length
        d.push(i, Yt), c && c.push(o, n.index, Se, -(Se + 1))
      }
  }
}
function Pl(t, e, r, n) {
  let o = R(null)
  try {
    return ke(6, e, r), r(n) !== !1
  } catch (i) {
    return Af(t, i), !1
  } finally {
    ke(7, e, r), R(o)
  }
}
function kl(t, e, r, n, o) {
  return function i(s) {
    if (s === Function) return n
    let a = t.componentOffset > -1 ? wt(t.index, e) : e
    ou(a)
    let u = Pl(e, r, n, s),
      c = i.__ngNextListenerFn__
    for (; c; ) (u = Pl(e, r, c, s) && u), (c = c.__ngNextListenerFn__)
    return o && u === !1 && s.preventDefault(), u
  }
}
function dr(t, e, r, n, o) {
  let i = $(),
    s = jf(i, e, r, n)
  if (s !== Re) {
    let a = be(),
      u = ja()
    If(a, u, i, t, s, i[Z], o, !1)
  }
  return dr
}
function Uf(t) {
  let e = jm()
  return Sm(e, et + t)
}
function Y(t, e = "") {
  let r = $(),
    n = be(),
    o = t + et,
    i = n.firstCreatePass ? oi(n, o, 1, e, null) : n.data[o],
    s = KD(n, r, i, e, t)
  ;(r[o] = s), $a() && Xa(n, r, s, i), sr(i, !1)
}
var KD = (t, e, r, n, o) => (Ua(!0), xv(e[Z], n))
function fr(t) {
  return Sn("", t, ""), fr
}
function Sn(t, e, r) {
  let n = $(),
    o = jf(n, t, e, r)
  return o !== Re && xf(n, Ht(), o), Sn
}
function hr(t, e, r, n, o) {
  let i = $(),
    s = AD(i, t, e, r, n, o)
  return s !== Re && xf(i, Ht(), s), hr
}
function JD(t, e, r) {
  let n = be()
  if (n.firstCreatePass) {
    let o = mt(t)
    ga(r, n.data, n.blueprint, o, !0), ga(e, n.data, n.blueprint, o, !1)
  }
}
function ga(t, e, r, n, o) {
  if (((t = ie(t)), Array.isArray(t)))
    for (let i = 0; i < t.length; i++) ga(t[i], e, r, n, o)
  else {
    let i = be(),
      s = $(),
      a = ge(),
      u = Cn(t) ? t : ie(t.provide),
      c = ld(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      h = a.providerIndexes >> 20
    if (Cn(t) || !t.multi) {
      let f = new Vt(c, o, k),
        m = Fs(u, e, o ? l : l + h, d)
      m === -1
        ? (Ws(Po(a, s), i, u),
          Rs(i, t, e.length),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          r.push(f),
          s.push(f))
        : ((r[m] = f), (s[m] = f))
    } else {
      let f = Fs(u, e, l + h, d),
        m = Fs(u, e, l, l + h),
        M = f >= 0 && r[f],
        B = m >= 0 && r[m]
      if ((o && !B) || (!o && !M)) {
        Ws(Po(a, s), i, u)
        let O = tC(o ? eC : XD, r.length, o, n, c)
        !o && B && (r[m].providerFactory = O),
          Rs(i, t, e.length, 0),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          r.push(O),
          s.push(O)
      } else {
        let O = Bf(r[o ? m : f], c, !o && n)
        Rs(i, t, f > -1 ? f : m, O)
      }
      !o && n && B && r[m].componentProviders++
    }
  }
}
function Rs(t, e, r, n) {
  let o = Cn(e),
    i = lm(e)
  if (o || i) {
    let u = (i ? ie(e.useClass) : e).prototype.ngOnDestroy
    if (u) {
      let c = t.destroyHooks || (t.destroyHooks = [])
      if (!o && e.multi) {
        let l = c.indexOf(r)
        l === -1 ? c.push(r, [n, u]) : c[l + 1].push(n, u)
      } else c.push(r, u)
    }
  }
}
function Bf(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1
}
function Fs(t, e, r, n) {
  for (let o = r; o < n; o++) if (e[o] === t) return o
  return -1
}
function XD(t, e, r, n) {
  return ma(this.multi, [])
}
function eC(t, e, r, n) {
  let o = this.multi,
    i
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = En(r, r[T], this.providerFactory.index, n)
    ;(i = a.slice(0, s)), ma(o, i)
    for (let u = s; u < a.length; u++) i.push(a[u])
  } else (i = []), ma(o, i)
  return i
}
function ma(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r]
    e.push(n())
  }
  return e
}
function tC(t, e, r, n, o) {
  let i = new Vt(t, r, k)
  return (
    (i.multi = []),
    (i.index = e),
    (i.componentProviders = 0),
    Bf(i, o, n && !r),
    i
  )
}
function fi(t, e = []) {
  return r => {
    r.providersResolver = (n, o) => JD(n, o ? o(t) : t, e)
  }
}
var nC = (() => {
  let e = class e {
    constructor(n) {
      ;(this._injector = n), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null
      if (!this.cachedInjectors.has(n)) {
        let o = ad(!1, n.type),
          i =
            o.length > 0
              ? ui([o], this._injector, `Standalone[${n.type.name}]`)
              : null
        this.cachedInjectors.set(n, i)
      }
      return this.cachedInjectors.get(n)
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
      } finally {
        this.cachedInjectors.clear()
      }
    }
  }
  e.ɵprov = y({
    token: e,
    providedIn: "environment",
    factory: () => new e(I(le)),
  })
  let t = e
  return t
})()
function Ge(t) {
  su("NgStandalone"),
    (t.getStandaloneInjector = e => e.get(nC).getOrCreateStandaloneInjector(t))
}
function Hf(t, e, r) {
  let n = _d() + t,
    o = $()
  return o[n] === Re ? Vf(o, n, r ? e.call(r) : e()) : ID(o, n)
}
function Gf(t, e, r, n) {
  return oC($(), _d(), t, e, r, n)
}
function rC(t, e) {
  let r = t[e]
  return r === Re ? void 0 : r
}
function oC(t, e, r, n, o, i) {
  let s = e + r
  return Ut(t, s, o) ? Vf(t, s + 1, i ? n.call(i, o) : n(o)) : rC(t, s + 1)
}
var hi = (() => {
  let e = class e {
    log(n) {
      console.log(n)
    }
    warn(n) {
      console.warn(n)
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }))
  let t = e
  return t
})()
var du = new w(""),
  pr = new w(""),
  pi = (() => {
    let e = class e {
      constructor(n, o, i) {
        ;(this._ngZone = n),
          (this.registry = o),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          fu || (iC(i), i.addToWindow(o)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone")
          })
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                V.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    ;(this._isZoneStable = !0), this._runCallbacksIfReady()
                  })
              },
            })
          })
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero")
        return this._runCallbacksIfReady(), this._pendingCount
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        )
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop()
              clearTimeout(n.timeoutId), n.doneCb()
            }
          })
        else {
          let n = this.getPendingTasks()
          this._callbacks = this._callbacks.filter(o =>
            o.updateCb && o.updateCb(n) ? (clearTimeout(o.timeoutId), !1) : !0
          )
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map(n => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : []
      }
      addCallback(n, o, i) {
        let s = -1
        o &&
          o > 0 &&
          (s = setTimeout(() => {
            ;(this._callbacks = this._callbacks.filter(a => a.timeoutId !== s)),
              n()
          }, o)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: i })
      }
      whenStable(n, o, i) {
        if (i && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          )
        this.addCallback(n, o, i), this._runCallbacksIfReady()
      }
      getPendingRequestCount() {
        return this._pendingCount
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this)
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n)
      }
      findProviders(n, o, i) {
        return []
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(V), I(gi), I(pr))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  gi = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map()
      }
      registerApplication(n, o) {
        this._applications.set(n, o)
      }
      unregisterApplication(n) {
        this._applications.delete(n)
      }
      unregisterAllApplications() {
        this._applications.clear()
      }
      getTestability(n) {
        return this._applications.get(n) || null
      }
      getAllTestabilities() {
        return Array.from(this._applications.values())
      }
      getAllRootElements() {
        return Array.from(this._applications.keys())
      }
      findTestabilityInTree(n, o = !0) {
        return fu?.findTestabilityInTree(this, n, o) ?? null
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "platform" }))
    let t = e
    return t
  })()
function iC(t) {
  fu = t
}
var fu
function zt(t) {
  return !!t && typeof t.then == "function"
}
function zf(t) {
  return !!t && typeof t.subscribe == "function"
}
var mi = new w(""),
  qf = (() => {
    let e = class e {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, o) => {
            ;(this.resolve = n), (this.reject = o)
          })),
          (this.appInits = p(mi, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let n = []
        for (let i of this.appInits) {
          let s = i()
          if (zt(s)) n.push(s)
          else if (zf(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c })
            })
            n.push(a)
          }
        }
        let o = () => {
          ;(this.done = !0), this.resolve()
        }
        Promise.all(n)
          .then(() => {
            o()
          })
          .catch(i => {
            this.reject(i)
          }),
          n.length === 0 && o(),
          (this.initialized = !0)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  vi = new w("")
function sC() {
  Tc(() => {
    throw new v(600, !1)
  })
}
function aC(t) {
  return t.isBoundToModule
}
function uC(t, e, r) {
  try {
    let n = r()
    return zt(n)
      ? n.catch(o => {
          throw (e.runOutsideAngular(() => t.handleError(o)), o)
        })
      : n
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n)
  }
}
var gr = (() => {
  let e = class e {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(qd)),
        (this.afterRenderEffectManager = p(uu)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new ee()),
        (this.afterTick = new ee()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(ci).hasPendingTasks.pipe(x(n => !n))),
        (this._injector = p(le))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(n, o) {
      let i = n instanceof $o
      if (!this._injector.get(qf).done) {
        let f = !i && rd(n),
          m = !1
        throw new v(405, m)
      }
      let a
      i ? (a = n) : (a = this._injector.get(si).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType)
      let u = aC(a) ? void 0 : this._injector.get(vt),
        c = o || a.selector,
        l = a.create(it.NULL, [], c, u),
        d = l.location.nativeElement,
        h = l.injector.get(du, null)
      return (
        h?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Ps(this.components, l),
            h?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      this._tick(!0)
    }
    _tick(n) {
      if (this._runningTick) throw new v(101, !1)
      let o = R(null)
      try {
        ;(this._runningTick = !0), this.detectChangesInAttachedViews(n)
      } catch (i) {
        this.internalErrorHandler(i)
      } finally {
        this.afterTick.next(), (this._runningTick = !1), R(o)
      }
    }
    detectChangesInAttachedViews(n) {
      let o = 0,
        i = this.afterRenderEffectManager
      for (;;) {
        if (o === Nf) throw new v(103, !1)
        if (n) {
          let s = o === 0
          this.beforeRender.next(s)
          for (let { _lView: a, notifyErrorHandler: u } of this._views)
            cC(a, s, u)
        }
        if (
          (o++,
          i.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: s }) => va(s)
          ) &&
            (i.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: s }) => va(s)
            )))
        )
          break
      }
    }
    attachView(n) {
      let o = n
      this._views.push(o), o.attachToAppRef(this)
    }
    detachView(n) {
      let o = n
      Ps(this._views, o), o.detachFromAppRef()
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n)
      let o = this._injector.get(vi, [])
      ;[...this._bootstrapListeners, ...o].forEach(i => i(n))
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach(n => n()),
            this._views.slice().forEach(n => n.destroy())
        } finally {
          ;(this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = [])
        }
    }
    onDestroy(n) {
      return this._destroyListeners.push(n), () => Ps(this._destroyListeners, n)
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1)
      let n = this._injector
      n.destroy && !n.destroyed && n.destroy()
    }
    get viewCount() {
      return this._views.length
    }
    warnIfDestroyed() {}
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
function Ps(t, e) {
  let r = t.indexOf(e)
  r > -1 && t.splice(r, 1)
}
function cC(t, e, r) {
  ;(!e && !va(t)) || lC(t, r, e)
}
function va(t) {
  return Ra(t)
}
function lC(t, e, r) {
  let n
  r ? ((n = 0), (t[C] |= 1024)) : t[C] & 64 ? (n = 0) : (n = 1), Of(t, e, n)
}
var ya = class {
    constructor(e, r) {
      ;(this.ngModuleFactory = e), (this.componentFactories = r)
    }
  },
  yi = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new fa(n)
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n))
      }
      compileModuleAndAllComponentsSync(n) {
        let o = this.compileModuleSync(n),
          i = od(n),
          s = rf(i.declarations).reduce((a, u) => {
            let c = gt(u)
            return c && a.push(new bn(c)), a
          }, [])
        return new ya(o, s)
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })()
var dC = (() => {
  let e = class e {
    constructor() {
      ;(this.zone = p(V)), (this.applicationRef = p(gr))
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick()
              })
            },
          }))
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe()
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
function fC(t) {
  return [
    { provide: V, useFactory: t },
    {
      provide: Dn,
      multi: !0,
      useFactory: () => {
        let e = p(dC, { optional: !0 })
        return () => e.initialize()
      },
    },
    {
      provide: Dn,
      multi: !0,
      useFactory: () => {
        let e = p(mC)
        return () => {
          e.initialize()
        }
      },
    },
    { provide: qd, useFactory: hC },
  ]
}
function hC() {
  let t = p(V),
    e = p(Be)
  return r => t.runOutsideAngular(() => e.handleError(r))
}
function pC(t) {
  let e = fC(() => new V(gC(t)))
  return Yo([[], e])
}
function gC(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  }
}
var mC = (() => {
  let e = class e {
    constructor() {
      ;(this.subscription = new W()),
        (this.initialized = !1),
        (this.zone = p(V)),
        (this.pendingTasks = p(ci))
    }
    initialize() {
      if (this.initialized) return
      this.initialized = !0
      let n = null
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              V.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null))
                })
            })
          )
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            V.assertInAngularZone(), (n ??= this.pendingTasks.add())
          })
        )
    }
    ngOnDestroy() {
      this.subscription.unsubscribe()
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
function vC() {
  return (typeof $localize < "u" && $localize.locale) || Go
}
var hu = new w("", {
  providedIn: "root",
  factory: () => p(hu, _.Optional | _.SkipSelf) || vC(),
})
var Wf = new w("")
var bo = null
function yC(t = [], e) {
  return it.create({
    name: e,
    providers: [
      { provide: Qo, useValue: "platform" },
      { provide: Wf, useValue: new Set([() => (bo = null)]) },
      ...t,
    ],
  })
}
function DC(t = []) {
  if (bo) return bo
  let e = yC(t)
  return (bo = e), sC(), CC(e), e
}
function CC(t) {
  t.get(Wa, null)?.forEach(r => r())
}
var An = (() => {
  let e = class e {}
  e.__NG_ELEMENT_ID__ = wC
  let t = e
  return t
})()
function wC(t) {
  return IC(ge(), $(), (t & 16) === 16)
}
function IC(t, e, r) {
  if (Xo(t) && !r) {
    let n = wt(t.index, e)
    return new $t(n, n)
  } else if (t.type & 47) {
    let n = e[$e]
    return new $t(n, e)
  }
  return null
}
var Da = class {
    constructor() {}
    supports(e) {
      return Lf(e)
    }
    create(e) {
      return new Ca(e)
    }
  },
  EC = (t, e) => e,
  Ca = class {
    constructor(e) {
      ;(this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || EC)
    }
    forEachItem(e) {
      let r
      for (r = this._itHead; r !== null; r = r._next) e(r)
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        o = 0,
        i = null
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < Ll(n, o, i)) ? r : n,
          a = Ll(s, o, i),
          u = s.currentIndex
        if (s === n) o--, (n = n._nextRemoved)
        else if (((r = r._next), s.previousIndex == null)) o++
        else {
          i || (i = [])
          let c = a - o,
            l = u - o
          if (c != l) {
            for (let h = 0; h < c; h++) {
              let f = h < i.length ? i[h] : (i[h] = 0),
                m = f + h
              l <= m && m < c && (i[h] = f + 1)
            }
            let d = s.previousIndex
            i[d] = l - c
          }
        }
        a !== u && e(s, a, u)
      }
    }
    forEachPreviousItem(e) {
      let r
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r)
    }
    forEachAddedItem(e) {
      let r
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r)
    }
    forEachMovedItem(e) {
      let r
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r)
    }
    forEachRemovedItem(e) {
      let r
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r)
    }
    forEachIdentityChange(e) {
      let r
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r)
    }
    diff(e) {
      if ((e == null && (e = []), !Lf(e))) throw new v(900, !1)
      return this.check(e) ? this : null
    }
    onDestroy() {}
    check(e) {
      this._reset()
      let r = this._itHead,
        n = !1,
        o,
        i,
        s
      if (Array.isArray(e)) {
        this.length = e.length
        for (let a = 0; a < this.length; a++)
          (i = e[a]),
            (s = this._trackByFn(a, i)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, i, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, i, s, a)),
                Object.is(r.item, i) || this._addIdentityChange(r, i)),
            (r = r._next)
      } else
        (o = 0),
          CD(e, a => {
            ;(s = this._trackByFn(o, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, o)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, o)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              o++
          }),
          (this.length = o)
      return this._truncate(r), (this.collection = e), this.isDirty
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      )
    }
    _reset() {
      if (this.isDirty) {
        let e
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex
        ;(this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null)
      }
    }
    _mismatch(e, r, n, o) {
      let i
      return (
        e === null ? (i = this._itTail) : ((i = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, i, o))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, o)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, i, o))
              : (e = this._addAfter(new wa(r, n), i, o))),
        e
      )
    }
    _verifyReinsertion(e, r, n, o) {
      let i =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null)
      return (
        i !== null
          ? (e = this._reinsertAfter(i, e._prev, o))
          : e.currentIndex != o &&
            ((e.currentIndex = o), this._addToMoves(e, o)),
        e
      )
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next
        this._addToRemovals(this._unlink(e)), (e = r)
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null)
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e)
      let o = e._prevRemoved,
        i = e._nextRemoved
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      )
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      )
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      )
    }
    _insertAfter(e, r, n) {
      let o = r === null ? this._itHead : r._next
      return (
        (e._next = o),
        (e._prev = r),
        o === null ? (this._itTail = e) : (o._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new zo()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      )
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e))
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e)
      let r = e._prev,
        n = e._next
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      )
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      )
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new zo()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      )
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      )
    }
  },
  wa = class {
    constructor(e, r) {
      ;(this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null)
    }
  },
  Ia = class {
    constructor() {
      ;(this._head = null), (this._tail = null)
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e))
    }
    get(e, r) {
      let n
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n
      return null
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      )
    }
  },
  zo = class {
    constructor() {
      this.map = new Map()
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r)
      n || ((n = new Ia()), this.map.set(r, n)), n.add(e)
    }
    get(e, r) {
      let n = e,
        o = this.map.get(n)
      return o ? o.get(e, r) : null
    }
    remove(e) {
      let r = e.trackById
      return this.map.get(r).remove(e) && this.map.delete(r), e
    }
    get isEmpty() {
      return this.map.size === 0
    }
    clear() {
      this.map.clear()
    }
  }
function Ll(t, e, r) {
  let n = t.previousIndex
  if (n === null) return n
  let o = 0
  return r && n < r.length && (o = r[n]), n + e + o
}
function Vl() {
  return new pu([new Da()])
}
var pu = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n
    }
    static create(n, o) {
      if (o != null) {
        let i = o.factories.slice()
        n = n.concat(i)
      }
      return new e(n)
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: o => e.create(n, o || Vl()),
        deps: [[e, new Ma(), new Zo()]],
      }
    }
    find(n) {
      let o = this.factories.find(i => i.supports(n))
      if (o != null) return o
      throw new v(901, !1)
    }
  }
  e.ɵprov = y({ token: e, providedIn: "root", factory: Vl })
  let t = e
  return t
})()
function Zf(t) {
  try {
    let { rootComponent: e, appProviders: r, platformProviders: n } = t,
      o = DC(n),
      i = [pC(), ...(r || [])],
      a = new Bo({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(V)
    return u.run(() => {
      a.resolveInjectorInitializers()
      let c = a.get(Be, null),
        l
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: f => {
            c.handleError(f)
          },
        })
      })
      let d = () => a.destroy(),
        h = o.get(Wf)
      return (
        h.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), h.delete(d)
        }),
        uC(c, u, () => {
          let f = a.get(qf)
          return (
            f.runInitializers(),
            f.donePromise.then(() => {
              let m = a.get(hu, Go)
              ZD(m || Go)
              let M = a.get(gr)
              return e !== void 0 && M.bootstrap(e), M
            })
          )
        })
      )
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
function xn(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false"
}
function Yf(t) {
  let e = gt(t)
  if (!e) return null
  let r = new bn(e)
  return {
    get selector() {
      return r.selector
    },
    get type() {
      return r.componentType
    },
    get inputs() {
      return r.inputs
    },
    get outputs() {
      return r.outputs
    },
    get ngContentSelectors() {
      return r.ngContentSelectors
    },
    get isStandalone() {
      return e.standalone
    },
    get isSignal() {
      return e.signals
    },
  }
}
var Xf = null
function ze() {
  return Xf
}
function eh(t) {
  Xf ??= t
}
var Di = class {}
var fe = new w(""),
  Du = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("")
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => p(bC), providedIn: "platform" }))
    let t = e
    return t
  })(),
  th = new w(""),
  bC = (() => {
    let e = class e extends Du {
      constructor() {
        super(),
          (this._doc = p(fe)),
          (this._location = window.location),
          (this._history = window.history)
      }
      getBaseHrefFromDOM() {
        return ze().getBaseHref(this._doc)
      }
      onPopState(n) {
        let o = ze().getGlobalEventTarget(this._doc, "window")
        return (
          o.addEventListener("popstate", n, !1),
          () => o.removeEventListener("popstate", n)
        )
      }
      onHashChange(n) {
        let o = ze().getGlobalEventTarget(this._doc, "window")
        return (
          o.addEventListener("hashchange", n, !1),
          () => o.removeEventListener("hashchange", n)
        )
      }
      get href() {
        return this._location.href
      }
      get protocol() {
        return this._location.protocol
      }
      get hostname() {
        return this._location.hostname
      }
      get port() {
        return this._location.port
      }
      get pathname() {
        return this._location.pathname
      }
      get search() {
        return this._location.search
      }
      get hash() {
        return this._location.hash
      }
      set pathname(n) {
        this._location.pathname = n
      }
      pushState(n, o, i) {
        this._history.pushState(n, o, i)
      }
      replaceState(n, o, i) {
        this._history.replaceState(n, o, i)
      }
      forward() {
        this._history.forward()
      }
      back() {
        this._history.back()
      }
      historyGo(n = 0) {
        this._history.go(n)
      }
      getState() {
        return this._history.state
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }))
    let t = e
    return t
  })()
function Cu(t, e) {
  if (t.length == 0) return e
  if (e.length == 0) return t
  let r = 0
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  )
}
function Qf(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0)
  return t.slice(0, n) + t.slice(r)
}
function at(t) {
  return t && t[0] !== "?" ? "?" + t : t
}
var ut = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("")
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => p(wu), providedIn: "root" }))
    let t = e
    return t
  })(),
  nh = new w(""),
  wu = (() => {
    let e = class e extends ut {
      constructor(n, o) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            o ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(fe).location?.origin ??
            "")
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()()
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        )
      }
      getBaseHref() {
        return this._baseHref
      }
      prepareExternalUrl(n) {
        return Cu(this._baseHref, n)
      }
      path(n = !1) {
        let o =
            this._platformLocation.pathname + at(this._platformLocation.search),
          i = this._platformLocation.hash
        return i && n ? `${o}${i}` : o
      }
      pushState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + at(s))
        this._platformLocation.pushState(n, o, a)
      }
      replaceState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + at(s))
        this._platformLocation.replaceState(n, o, a)
      }
      forward() {
        this._platformLocation.forward()
      }
      back() {
        this._platformLocation.back()
      }
      getState() {
        return this._platformLocation.getState()
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(Du), I(nh, 8))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  rh = (() => {
    let e = class e extends ut {
      constructor(n, o) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          o != null && (this._baseHref = o)
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()()
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        )
      }
      getBaseHref() {
        return this._baseHref
      }
      path(n = !1) {
        let o = this._platformLocation.hash ?? "#"
        return o.length > 0 ? o.substring(1) : o
      }
      prepareExternalUrl(n) {
        let o = Cu(this._baseHref, n)
        return o.length > 0 ? "#" + o : o
      }
      pushState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + at(s))
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, o, a)
      }
      replaceState(n, o, i, s) {
        let a = this.prepareExternalUrl(i + at(s))
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, o, a)
      }
      forward() {
        this._platformLocation.forward()
      }
      back() {
        this._platformLocation.back()
      }
      getState() {
        return this._platformLocation.getState()
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(Du), I(nh, 8))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Tn = (() => {
    let e = class e {
      constructor(n) {
        ;(this._subject = new te()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n)
        let o = this._locationStrategy.getBaseHref()
        ;(this._basePath = SC(Qf(Kf(o)))),
          this._locationStrategy.onPopState(i => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: i.state,
              type: i.type,
            })
          })
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = [])
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n))
      }
      getState() {
        return this._locationStrategy.getState()
      }
      isCurrentPathEqualTo(n, o = "") {
        return this.path() == this.normalize(n + at(o))
      }
      normalize(n) {
        return e.stripTrailingSlash(_C(this._basePath, Kf(n)))
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        )
      }
      go(n, o = "", i = null) {
        this._locationStrategy.pushState(i, "", n, o),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + at(o)), i)
      }
      replaceState(n, o = "", i = null) {
        this._locationStrategy.replaceState(i, "", n, o),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + at(o)), i)
      }
      forward() {
        this._locationStrategy.forward()
      }
      back() {
        this._locationStrategy.back()
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n)
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe(o => {
            this._notifyUrlChangeListeners(o.url, o.state)
          })),
          () => {
            let o = this._urlChangeListeners.indexOf(n)
            this._urlChangeListeners.splice(o, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null))
          }
        )
      }
      _notifyUrlChangeListeners(n = "", o) {
        this._urlChangeListeners.forEach(i => i(n, o))
      }
      subscribe(n, o, i) {
        return this._subject.subscribe({ next: n, error: o, complete: i })
      }
    }
    ;(e.normalizeQueryParams = at),
      (e.joinWithSlash = Cu),
      (e.stripTrailingSlash = Qf),
      (e.ɵfac = function (o) {
        return new (o || e)(I(ut))
      }),
      (e.ɵprov = y({ token: e, factory: () => MC(), providedIn: "root" }))
    let t = e
    return t
  })()
function MC() {
  return new Tn(I(ut))
}
function _C(t, e) {
  if (!t || !e.startsWith(t)) return e
  let r = e.substring(t.length)
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e
}
function Kf(t) {
  return t.replace(/\/index.html$/, "")
}
function SC(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/)
    return r
  }
  return t
}
function oh(t, e) {
  e = encodeURIComponent(e)
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [o, i] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)]
    if (o.trim() === e) return decodeURIComponent(i)
  }
  return null
}
var gu = class {
    constructor(e, r, n, o) {
      ;(this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = o)
    }
    get first() {
      return this.index === 0
    }
    get last() {
      return this.index === this.count - 1
    }
    get even() {
      return this.index % 2 === 0
    }
    get odd() {
      return !this.even
    }
  },
  ih = (() => {
    let e = class e {
      set ngForOf(n) {
        ;(this._ngForOf = n), (this._ngForOfDirty = !0)
      }
      set ngForTrackBy(n) {
        this._trackByFn = n
      }
      get ngForTrackBy() {
        return this._trackByFn
      }
      constructor(n, o, i) {
        ;(this._viewContainer = n),
          (this._template = o),
          (this._differs = i),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null)
      }
      set ngForTemplate(n) {
        n && (this._template = n)
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1
          let n = this._ngForOf
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy)
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf)
          n && this._applyChanges(n)
        }
      }
      _applyChanges(n) {
        let o = this._viewContainer
        n.forEachOperation((i, s, a) => {
          if (i.previousIndex == null)
            o.createEmbeddedView(
              this._template,
              new gu(i.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            )
          else if (a == null) o.remove(s === null ? void 0 : s)
          else if (s !== null) {
            let u = o.get(s)
            o.move(u, a), Jf(u, i)
          }
        })
        for (let i = 0, s = o.length; i < s; i++) {
          let u = o.get(i).context
          ;(u.index = i), (u.count = s), (u.ngForOf = this._ngForOf)
        }
        n.forEachIdentityChange(i => {
          let s = o.get(i.currentIndex)
          Jf(s, i)
        })
      }
      static ngTemplateContextGuard(n, o) {
        return !0
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(k(lr), k(iu), k(pu))
    }),
      (e.ɵdir = de({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }))
    let t = e
    return t
  })()
function Jf(t, e) {
  t.context.$implicit = e.item
}
var qt = (() => {
    let e = class e {}
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵmod = Dt({ type: e })),
      (e.ɵinj = yt({}))
    let t = e
    return t
  })(),
  Iu = "browser",
  AC = "server"
function xC(t) {
  return t === Iu
}
function Eu(t) {
  return t === AC
}
var sh = (() => {
    let e = class e {}
    e.ɵprov = y({
      token: e,
      providedIn: "root",
      factory: () => (xC(p(Et)) ? new mu(p(fe), window) : new vu()),
    })
    let t = e
    return t
  })(),
  mu = class {
    constructor(e, r) {
      ;(this.document = e), (this.window = r), (this.offset = () => [0, 0])
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e)
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY]
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1])
    }
    scrollToAnchor(e) {
      let r = TC(this.document, e)
      r && (this.scrollToElement(r), r.focus())
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        o = r.top + this.window.pageYOffset,
        i = this.offset()
      this.window.scrollTo(n - i[0], o - i[1])
    }
  }
function TC(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0]
  if (r) return r
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      o = n.currentNode
    for (; o; ) {
      let i = o.shadowRoot
      if (i) {
        let s = i.getElementById(e) || i.querySelector(`[name="${e}"]`)
        if (s) return s
      }
      o = n.nextNode()
    }
  }
  return null
}
var vu = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0]
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  Ci = class {}
var _u = class extends Di {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  Su = class t extends _u {
    static makeCurrent() {
      eh(new t())
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n)
        }
      )
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r)
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e)
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e)
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle")
    }
    getDefaultDocument() {
      return document
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
          ? e
          : r === "body"
            ? e.body
            : null
    }
    getBaseHref(e) {
      let r = NC()
      return r == null ? null : OC(r)
    }
    resetBaseElement() {
      mr = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(e) {
      return oh(document.cookie, e)
    }
  },
  mr = null
function NC() {
  return (
    (mr = mr || document.querySelector("base")),
    mr ? mr.getAttribute("href") : null
  )
}
function OC(t) {
  return new URL(t, document.baseURI).pathname
}
var Au = class {
    addToWindow(e) {
      ;(ue.getAngularTestability = (n, o = !0) => {
        let i = e.findTestabilityInTree(n, o)
        if (i == null) throw new v(5103, !1)
        return i
      }),
        (ue.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (ue.getAllAngularRootElements = () => e.getAllRootElements())
      let r = n => {
        let o = ue.getAllAngularTestabilities(),
          i = o.length,
          s = function () {
            i--, i == 0 && n()
          }
        o.forEach(a => {
          a.whenStable(s)
        })
      }
      ue.frameworkStabilizers || (ue.frameworkStabilizers = []),
        ue.frameworkStabilizers.push(r)
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null
      let o = e.getTestability(r)
      return (
        o ??
        (n
          ? ze().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      )
    }
  },
  RC = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  xu = new w(""),
  dh = (() => {
    let e = class e {
      constructor(n, o) {
        ;(this._zone = o),
          (this._eventNameToPlugin = new Map()),
          n.forEach(i => {
            i.manager = this
          }),
          (this._plugins = n.slice().reverse())
      }
      addEventListener(n, o, i) {
        return this._findPluginFor(o).addEventListener(n, o, i)
      }
      getZone() {
        return this._zone
      }
      _findPluginFor(n) {
        let o = this._eventNameToPlugin.get(n)
        if (o) return o
        if (((o = this._plugins.find(s => s.supports(n))), !o))
          throw new v(5101, !1)
        return this._eventNameToPlugin.set(n, o), o
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(xu), I(V))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  wi = class {
    constructor(e) {
      this._doc = e
    }
  },
  bu = "ng-app-id",
  fh = (() => {
    let e = class e {
      constructor(n, o, i, s = {}) {
        ;(this.doc = n),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Eu(s)),
          this.resetHostNodes()
      }
      addStyles(n) {
        for (let o of n)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o)
      }
      removeStyles(n) {
        for (let o of n)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o)
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM
        n && (n.forEach(o => o.remove()), n.clear())
        for (let o of this.getAllStyles()) this.onStyleRemoved(o)
        this.resetHostNodes()
      }
      addHost(n) {
        this.hostNodes.add(n)
        for (let o of this.getAllStyles()) this.addStyleToHost(n, o)
      }
      removeHost(n) {
        this.hostNodes.delete(n)
      }
      getAllStyles() {
        return this.styleRef.keys()
      }
      onStyleAdded(n) {
        for (let o of this.hostNodes) this.addStyleToHost(o, n)
      }
      onStyleRemoved(n) {
        let o = this.styleRef
        o.get(n)?.elements?.forEach(i => i.remove()), o.delete(n)
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${bu}="${this.appId}"]`)
        if (n?.length) {
          let o = new Map()
          return (
            n.forEach(i => {
              i.textContent != null && o.set(i.textContent, i)
            }),
            o
          )
        }
        return null
      }
      changeUsageCount(n, o) {
        let i = this.styleRef
        if (i.has(n)) {
          let s = i.get(n)
          return (s.usage += o), s.usage
        }
        return i.set(n, { usage: o, elements: [] }), o
      }
      getStyleElement(n, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o)
        if (s?.parentNode === n) return i.delete(o), s.removeAttribute(bu), s
        {
          let a = this.doc.createElement("style")
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(bu, this.appId),
            n.appendChild(a),
            a
          )
        }
      }
      addStyleToHost(n, o) {
        let i = this.getStyleElement(n, o),
          s = this.styleRef,
          a = s.get(o)?.elements
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 })
      }
      resetHostNodes() {
        let n = this.hostNodes
        n.clear(), n.add(this.doc.head)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(fe), I(qa), I(Za, 8), I(Et))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Mu = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Nu = /%COMP%/g,
  hh = "%COMP%",
  FC = `_nghost-${hh}`,
  PC = `_ngcontent-${hh}`,
  kC = !0,
  LC = new w("", { providedIn: "root", factory: () => kC })
function VC(t) {
  return PC.replace(Nu, t)
}
function jC(t) {
  return FC.replace(Nu, t)
}
function ph(t, e) {
  return e.map(r => r.replace(Nu, t))
}
var uh = (() => {
    let e = class e {
      constructor(n, o, i, s, a, u, c, l = null) {
        ;(this.eventManager = n),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Eu(u)),
          (this.defaultRenderer = new vr(n, a, c, this.platformIsServer))
      }
      createRenderer(n, o) {
        if (!n || !o) return this.defaultRenderer
        this.platformIsServer &&
          o.encapsulation === Ve.ShadowDom &&
          (o = U(g({}, o), { encapsulation: Ve.Emulated }))
        let i = this.getOrCreateRenderer(n, o)
        return (
          i instanceof Ii
            ? i.applyToHost(n)
            : i instanceof yr && i.applyStyles(),
          i
        )
      }
      getOrCreateRenderer(n, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id)
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            h = this.platformIsServer
          switch (o.encapsulation) {
            case Ve.Emulated:
              s = new Ii(c, l, o, this.appId, d, a, u, h)
              break
            case Ve.ShadowDom:
              return new Tu(c, l, n, o, a, u, this.nonce, h)
            default:
              s = new yr(c, l, o, d, a, u, h)
              break
          }
          i.set(o.id, s)
        }
        return s
      }
      ngOnDestroy() {
        this.rendererByCompId.clear()
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(dh), I(fh), I(qa), I(LC), I(fe), I(Et), I(V), I(Za))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  vr = class {
    constructor(e, r, n, o) {
      ;(this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null)
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(Mu[r] || r, e)
        : this.doc.createElement(e)
    }
    createComment(e) {
      return this.doc.createComment(e)
    }
    createText(e) {
      return this.doc.createTextNode(e)
    }
    appendChild(e, r) {
      ;(ch(e) ? e.content : e).appendChild(r)
    }
    insertBefore(e, r, n) {
      e && (ch(e) ? e.content : e).insertBefore(r, n)
    }
    removeChild(e, r) {
      e && e.removeChild(r)
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e
      if (!n) throw new v(-5104, !1)
      return r || (n.textContent = ""), n
    }
    parentNode(e) {
      return e.parentNode
    }
    nextSibling(e) {
      return e.nextSibling
    }
    setAttribute(e, r, n, o) {
      if (o) {
        r = o + ":" + r
        let i = Mu[o]
        i ? e.setAttributeNS(i, r, n) : e.setAttribute(r, n)
      } else e.setAttribute(r, n)
    }
    removeAttribute(e, r, n) {
      if (n) {
        let o = Mu[n]
        o ? e.removeAttributeNS(o, r) : e.removeAttribute(`${n}:${r}`)
      } else e.removeAttribute(r)
    }
    addClass(e, r) {
      e.classList.add(r)
    }
    removeClass(e, r) {
      e.classList.remove(r)
    }
    setStyle(e, r, n, o) {
      o & (tt.DashCase | tt.Important)
        ? e.style.setProperty(r, n, o & tt.Important ? "important" : "")
        : (e.style[r] = n)
    }
    removeStyle(e, r, n) {
      n & tt.DashCase ? e.style.removeProperty(r) : (e.style[r] = "")
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n)
    }
    setValue(e, r) {
      e.nodeValue = r
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = ze().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`)
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      )
    }
    decoratePreventDefault(e) {
      return r => {
        if (r === "__ngUnwrap__") return e
        ;(this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault()
      }
    }
  }
function ch(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0
}
var Tu = class extends vr {
    constructor(e, r, n, o, i, s, a, u) {
      super(e, i, s, u),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let c = ph(o.id, o.styles)
      for (let l of c) {
        let d = document.createElement("style")
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d)
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r)
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n)
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r)
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot)
    }
  },
  yr = class extends vr {
    constructor(e, r, n, o, i, s, a, u) {
      super(e, i, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? ph(u, n.styles) : n.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  Ii = class extends yr {
    constructor(e, r, n, o, i, s, a, u) {
      let c = o + "-" + n.id
      super(e, r, n, i, s, a, u, c),
        (this.contentAttr = VC(c)),
        (this.hostAttr = jC(c))
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "")
    }
    createElement(e, r) {
      let n = super.createElement(e, r)
      return super.setAttribute(n, this.contentAttr, ""), n
    }
  },
  $C = (() => {
    let e = class e extends wi {
      constructor(n) {
        super(n)
      }
      supports(n) {
        return !0
      }
      addEventListener(n, o, i) {
        return (
          n.addEventListener(o, i, !1), () => this.removeEventListener(n, o, i)
        )
      }
      removeEventListener(n, o, i) {
        return n.removeEventListener(o, i)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(fe))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  lh = ["alt", "control", "meta", "shift"],
  UC = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  BC = {
    alt: t => t.altKey,
    control: t => t.ctrlKey,
    meta: t => t.metaKey,
    shift: t => t.shiftKey,
  },
  HC = (() => {
    let e = class e extends wi {
      constructor(n) {
        super(n)
      }
      supports(n) {
        return e.parseEventName(n) != null
      }
      addEventListener(n, o, i) {
        let s = e.parseEventName(o),
          a = e.eventCallback(s.fullKey, i, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => ze().onAndCancel(n, s.domEventName, a))
      }
      static parseEventName(n) {
        let o = n.toLowerCase().split("."),
          i = o.shift()
        if (o.length === 0 || !(i === "keydown" || i === "keyup")) return null
        let s = e._normalizeKey(o.pop()),
          a = "",
          u = o.indexOf("code")
        if (
          (u > -1 && (o.splice(u, 1), (a = "code.")),
          lh.forEach(l => {
            let d = o.indexOf(l)
            d > -1 && (o.splice(d, 1), (a += l + "."))
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null
        let c = {}
        return (c.domEventName = i), (c.fullKey = a), c
      }
      static matchEventFullKeyCode(n, o) {
        let i = UC[n.key] || n.key,
          s = ""
        return (
          o.indexOf("code.") > -1 && ((i = n.code), (s = "code.")),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === " " ? (i = "space") : i === "." && (i = "dot"),
              lh.forEach(a => {
                if (a !== i) {
                  let u = BC[a]
                  u(n) && (s += a + ".")
                }
              }),
              (s += i),
              s === o)
        )
      }
      static eventCallback(n, o, i) {
        return s => {
          e.matchEventFullKeyCode(s, n) && i.runGuarded(() => o(s))
        }
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(fe))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function gh(t, e) {
  return Zf(g({ rootComponent: t }, GC(e)))
}
function GC(t) {
  return {
    appProviders: [...QC, ...(t?.providers ?? [])],
    platformProviders: ZC,
  }
}
function mh() {
  return [...YC]
}
function zC() {
  Su.makeCurrent()
}
function qC() {
  return new Be()
}
function WC() {
  return Jd(document), document
}
var ZC = [
  { provide: Et, useValue: Iu },
  { provide: Wa, useValue: zC, multi: !0 },
  { provide: fe, useFactory: WC, deps: [] },
]
var YC = [
    { provide: pr, useClass: Au, deps: [] },
    { provide: du, useClass: pi, deps: [V, gi, pr] },
    { provide: pi, useClass: pi, deps: [V, gi, pr] },
  ],
  QC = [
    { provide: Qo, useValue: "root" },
    { provide: Be, useFactory: qC, deps: [] },
    { provide: xu, useClass: $C, multi: !0, deps: [fe, V, Et] },
    { provide: xu, useClass: HC, multi: !0, deps: [fe] },
    uh,
    fh,
    dh,
    { provide: er, useExisting: uh },
    { provide: Ci, useClass: RC, deps: [] },
    [],
  ]
var vh = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n
    }
    getTitle() {
      return this._doc.title
    }
    setTitle(n) {
      this._doc.title = n || ""
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)(I(fe))
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
var b = "primary",
  Fr = Symbol("RouteTitle"),
  ku = class {
    constructor(e) {
      this.params = e || {}
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e)
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e]
        return Array.isArray(r) ? r[0] : r
      }
      return null
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e]
        return Array.isArray(r) ? r : [r]
      }
      return []
    }
    get keys() {
      return Object.keys(this.params)
    }
  }
function Pn(t) {
  return new ku(t)
}
function JC(t, e, r) {
  let n = r.path.split("/")
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null
  let o = {}
  for (let i = 0; i < n.length; i++) {
    let s = n[i],
      a = t[i]
    if (s.startsWith(":")) o[s.substring(1)] = a
    else if (s !== a.path) return null
  }
  return { consumed: t.slice(0, n.length), posParams: o }
}
function XC(t, e) {
  if (t.length !== e.length) return !1
  for (let r = 0; r < t.length; ++r) if (!qe(t[r], e[r])) return !1
  return !0
}
function qe(t, e) {
  let r = t ? Lu(t) : void 0,
    n = e ? Lu(e) : void 0
  if (!r || !n || r.length != n.length) return !1
  let o
  for (let i = 0; i < r.length; i++)
    if (((o = r[i]), !_h(t[o], e[o]))) return !1
  return !0
}
function Lu(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)]
}
function _h(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1
    let r = [...t].sort(),
      n = [...e].sort()
    return r.every((o, i) => n[i] === o)
  } else return t === e
}
function Sh(t) {
  return t.length > 0 ? t[t.length - 1] : null
}
function At(t) {
  return ps(t) ? t : zt(t) ? G(Promise.resolve(t)) : D(t)
}
var ew = { exact: xh, subset: Th },
  Ah = { exact: tw, subset: nw, ignored: () => !0 }
function yh(t, e, r) {
  return (
    ew[r.paths](t.root, e.root, r.matrixParams) &&
    Ah[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  )
}
function tw(t, e) {
  return qe(t, e)
}
function xh(t, e, r) {
  if (
    !Zt(t.segments, e.segments) ||
    !Mi(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1
  for (let n in e.children)
    if (!t.children[n] || !xh(t.children[n], e.children[n], r)) return !1
  return !0
}
function nw(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every(r => _h(t[r], e[r]))
  )
}
function Th(t, e, r) {
  return Nh(t, e, e.segments, r)
}
function Nh(t, e, r, n) {
  if (t.segments.length > r.length) {
    let o = t.segments.slice(0, r.length)
    return !(!Zt(o, r) || e.hasChildren() || !Mi(o, r, n))
  } else if (t.segments.length === r.length) {
    if (!Zt(t.segments, r) || !Mi(t.segments, r, n)) return !1
    for (let o in e.children)
      if (!t.children[o] || !Th(t.children[o], e.children[o], n)) return !1
    return !0
  } else {
    let o = r.slice(0, t.segments.length),
      i = r.slice(t.segments.length)
    return !Zt(t.segments, o) || !Mi(t.segments, o, n) || !t.children[b]
      ? !1
      : Nh(t.children[b], e, i, n)
  }
}
function Mi(t, e, r) {
  return e.every((n, o) => Ah[r](t[o].parameters, n.parameters))
}
var Mt = class {
    constructor(e = new P([], {}), r = {}, n = null) {
      ;(this.root = e), (this.queryParams = r), (this.fragment = n)
    }
    get queryParamMap() {
      return (this._queryParamMap ??= Pn(this.queryParams)), this._queryParamMap
    }
    toString() {
      return iw.serialize(this)
    }
  },
  P = class {
    constructor(e, r) {
      ;(this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach(n => (n.parent = this))
    }
    hasChildren() {
      return this.numberOfChildren > 0
    }
    get numberOfChildren() {
      return Object.keys(this.children).length
    }
    toString() {
      return _i(this)
    }
  },
  Wt = class {
    constructor(e, r) {
      ;(this.path = e), (this.parameters = r)
    }
    get parameterMap() {
      return (this._parameterMap ??= Pn(this.parameters)), this._parameterMap
    }
    toString() {
      return Rh(this)
    }
  }
function rw(t, e) {
  return Zt(t, e) && t.every((r, n) => qe(r.parameters, e[n].parameters))
}
function Zt(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path)
}
function ow(t, e) {
  let r = []
  return (
    Object.entries(t.children).forEach(([n, o]) => {
      n === b && (r = r.concat(e(o, n)))
    }),
    Object.entries(t.children).forEach(([n, o]) => {
      n !== b && (r = r.concat(e(o, n)))
    }),
    r
  )
}
var Pr = (() => {
    let e = class e {}
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => new Mr(), providedIn: "root" }))
    let t = e
    return t
  })(),
  Mr = class {
    parse(e) {
      let r = new ju(e)
      return new Mt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      )
    }
    serialize(e) {
      let r = `/${Dr(e.root, !0)}`,
        n = uw(e.queryParams),
        o = typeof e.fragment == "string" ? `#${sw(e.fragment)}` : ""
      return `${r}${n}${o}`
    }
  },
  iw = new Mr()
function _i(t) {
  return t.segments.map(e => Rh(e)).join("/")
}
function Dr(t, e) {
  if (!t.hasChildren()) return _i(t)
  if (e) {
    let r = t.children[b] ? Dr(t.children[b], !1) : "",
      n = []
    return (
      Object.entries(t.children).forEach(([o, i]) => {
        o !== b && n.push(`${o}:${Dr(i, !1)}`)
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    )
  } else {
    let r = ow(t, (n, o) =>
      o === b ? [Dr(t.children[b], !1)] : [`${o}:${Dr(n, !1)}`]
    )
    return Object.keys(t.children).length === 1 && t.children[b] != null
      ? `${_i(t)}/${r[0]}`
      : `${_i(t)}/(${r.join("//")})`
  }
}
function Oh(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
}
function Ei(t) {
  return Oh(t).replace(/%3B/gi, ";")
}
function sw(t) {
  return encodeURI(t)
}
function Vu(t) {
  return Oh(t).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
}
function Si(t) {
  return decodeURIComponent(t)
}
function Dh(t) {
  return Si(t.replace(/\+/g, "%20"))
}
function Rh(t) {
  return `${Vu(t.path)}${aw(t.parameters)}`
}
function aw(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${Vu(e)}=${Vu(r)}`)
    .join("")
}
function uw(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map(o => `${Ei(r)}=${Ei(o)}`).join("&")
        : `${Ei(r)}=${Ei(n)}`
    )
    .filter(r => r)
  return e.length ? `?${e.join("&")}` : ""
}
var cw = /^[^\/()?;#]+/
function Ou(t) {
  let e = t.match(cw)
  return e ? e[0] : ""
}
var lw = /^[^\/()?;=#]+/
function dw(t) {
  let e = t.match(lw)
  return e ? e[0] : ""
}
var fw = /^[^=?&#]+/
function hw(t) {
  let e = t.match(fw)
  return e ? e[0] : ""
}
var pw = /^[^&#]+/
function gw(t) {
  let e = t.match(pw)
  return e ? e[0] : ""
}
var ju = class {
  constructor(e) {
    ;(this.url = e), (this.remaining = e)
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new P([], {})
        : new P([], this.parseChildren())
    )
  }
  parseQueryParams() {
    let e = {}
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e)
      while (this.consumeOptional("&"))
    return e
  }
  parseFragment() {
    return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
  }
  parseChildren() {
    if (this.remaining === "") return {}
    this.consumeOptional("/")
    let e = []
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment())
    let r = {}
    this.peekStartsWith("/(") && (this.capture("/"), (r = this.parseParens(!0)))
    let n = {}
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[b] = new P(e, r)),
      n
    )
  }
  parseSegment() {
    let e = Ou(this.remaining)
    if (e === "" && this.peekStartsWith(";")) throw new v(4009, !1)
    return this.capture(e), new Wt(Si(e), this.parseMatrixParams())
  }
  parseMatrixParams() {
    let e = {}
    for (; this.consumeOptional(";"); ) this.parseParam(e)
    return e
  }
  parseParam(e) {
    let r = dw(this.remaining)
    if (!r) return
    this.capture(r)
    let n = ""
    if (this.consumeOptional("=")) {
      let o = Ou(this.remaining)
      o && ((n = o), this.capture(n))
    }
    e[Si(r)] = Si(n)
  }
  parseQueryParam(e) {
    let r = hw(this.remaining)
    if (!r) return
    this.capture(r)
    let n = ""
    if (this.consumeOptional("=")) {
      let s = gw(this.remaining)
      s && ((n = s), this.capture(n))
    }
    let o = Dh(r),
      i = Dh(n)
    if (e.hasOwnProperty(o)) {
      let s = e[o]
      Array.isArray(s) || ((s = [s]), (e[o] = s)), s.push(i)
    } else e[o] = i
  }
  parseParens(e) {
    let r = {}
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = Ou(this.remaining),
        o = this.remaining[n.length]
      if (o !== "/" && o !== ")" && o !== ";") throw new v(4010, !1)
      let i
      n.indexOf(":") > -1
        ? ((i = n.slice(0, n.indexOf(":"))), this.capture(i), this.capture(":"))
        : e && (i = b)
      let s = this.parseChildren()
      ;(r[i] = Object.keys(s).length === 1 ? s[b] : new P([], s)),
        this.consumeOptional("//")
    }
    return r
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e)
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new v(4011, !1)
  }
}
function Fh(t) {
  return t.segments.length > 0 ? new P([], { [b]: t }) : t
}
function Ph(t) {
  let e = {}
  for (let [n, o] of Object.entries(t.children)) {
    let i = Ph(o)
    if (n === b && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) e[s] = a
    else (i.segments.length > 0 || i.hasChildren()) && (e[n] = i)
  }
  let r = new P(t.segments, e)
  return mw(r)
}
function mw(t) {
  if (t.numberOfChildren === 1 && t.children[b]) {
    let e = t.children[b]
    return new P(t.segments.concat(e.segments), e.children)
  }
  return t
}
function kn(t) {
  return t instanceof Mt
}
function vw(t, e, r = null, n = null) {
  let o = kh(t)
  return Lh(o, e, r, n)
}
function kh(t) {
  let e
  function r(i) {
    let s = {}
    for (let u of i.children) {
      let c = r(u)
      s[u.outlet] = c
    }
    let a = new P(i.url, s)
    return i === t && (e = a), a
  }
  let n = r(t.root),
    o = Fh(n)
  return e ?? o
}
function Lh(t, e, r, n) {
  let o = t
  for (; o.parent; ) o = o.parent
  if (e.length === 0) return Ru(o, o, o, r, n)
  let i = yw(e)
  if (i.toRoot()) return Ru(o, o, new P([], {}), r, n)
  let s = Dw(i, o, t),
    a = s.processChildren
      ? Ir(s.segmentGroup, s.index, i.commands)
      : jh(s.segmentGroup, s.index, i.commands)
  return Ru(o, s.segmentGroup, a, r, n)
}
function Ai(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath
}
function _r(t) {
  return typeof t == "object" && t != null && t.outlets
}
function Ru(t, e, r, n, o) {
  let i = {}
  n &&
    Object.entries(n).forEach(([u, c]) => {
      i[u] = Array.isArray(c) ? c.map(l => `${l}`) : `${c}`
    })
  let s
  t === e ? (s = r) : (s = Vh(t, e, r))
  let a = Fh(Ph(s))
  return new Mt(a, i, o)
}
function Vh(t, e, r) {
  let n = {}
  return (
    Object.entries(t.children).forEach(([o, i]) => {
      i === e ? (n[o] = r) : (n[o] = Vh(i, e, r))
    }),
    new P(t.segments, n)
  )
}
var xi = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && Ai(n[0]))
    )
      throw new v(4003, !1)
    let o = n.find(_r)
    if (o && o !== Sh(n)) throw new v(4004, !1)
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    )
  }
}
function yw(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new xi(!0, 0, t)
  let e = 0,
    r = !1,
    n = t.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {}
          return (
            Object.entries(i.outlets).forEach(([u, c]) => {
              a[u] = typeof c == "string" ? c.split("/") : c
            }),
            [...o, { outlets: a }]
          )
        }
        if (i.segmentPath) return [...o, i.segmentPath]
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
          ? (i.split("/").forEach((a, u) => {
              ;(u == 0 && a === ".") ||
                (u == 0 && a === ""
                  ? (r = !0)
                  : a === ".."
                    ? e++
                    : a != "" && o.push(a))
            }),
            o)
          : [...o, i]
    }, [])
  return new xi(r, e, n)
}
var Rn = class {
  constructor(e, r, n) {
    ;(this.segmentGroup = e), (this.processChildren = r), (this.index = n)
  }
}
function Dw(t, e, r) {
  if (t.isAbsolute) return new Rn(e, !0, 0)
  if (!r) return new Rn(e, !1, NaN)
  if (r.parent === null) return new Rn(r, !0, 0)
  let n = Ai(t.commands[0]) ? 0 : 1,
    o = r.segments.length - 1 + n
  return Cw(r, o, t.numberOfDoubleDots)
}
function Cw(t, e, r) {
  let n = t,
    o = e,
    i = r
  for (; i > o; ) {
    if (((i -= o), (n = n.parent), !n)) throw new v(4005, !1)
    o = n.segments.length
  }
  return new Rn(n, !1, o - i)
}
function ww(t) {
  return _r(t[0]) ? t[0].outlets : { [b]: t }
}
function jh(t, e, r) {
  if (((t ??= new P([], {})), t.segments.length === 0 && t.hasChildren()))
    return Ir(t, e, r)
  let n = Iw(t, e, r),
    o = r.slice(n.commandIndex)
  if (n.match && n.pathIndex < t.segments.length) {
    let i = new P(t.segments.slice(0, n.pathIndex), {})
    return (
      (i.children[b] = new P(t.segments.slice(n.pathIndex), t.children)),
      Ir(i, 0, o)
    )
  } else
    return n.match && o.length === 0
      ? new P(t.segments, {})
      : n.match && !t.hasChildren()
        ? $u(t, e, r)
        : n.match
          ? Ir(t, 0, o)
          : $u(t, e, r)
}
function Ir(t, e, r) {
  if (r.length === 0) return new P(t.segments, {})
  {
    let n = ww(r),
      o = {}
    if (
      Object.keys(n).some(i => i !== b) &&
      t.children[b] &&
      t.numberOfChildren === 1 &&
      t.children[b].segments.length === 0
    ) {
      let i = Ir(t.children[b], e, r)
      return new P(t.segments, i.children)
    }
    return (
      Object.entries(n).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = jh(t.children[i], e, s))
      }),
      Object.entries(t.children).forEach(([i, s]) => {
        n[i] === void 0 && (o[i] = s)
      }),
      new P(t.segments, o)
    )
  }
}
function Iw(t, e, r) {
  let n = 0,
    o = e,
    i = { match: !1, pathIndex: 0, commandIndex: 0 }
  for (; o < t.segments.length; ) {
    if (n >= r.length) return i
    let s = t.segments[o],
      a = r[n]
    if (_r(a)) break
    let u = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null
    if (o > 0 && u === void 0) break
    if (u && c && typeof c == "object" && c.outlets === void 0) {
      if (!wh(u, c, s)) return i
      n += 2
    } else {
      if (!wh(u, {}, s)) return i
      n++
    }
    o++
  }
  return { match: !0, pathIndex: o, commandIndex: n }
}
function $u(t, e, r) {
  let n = t.segments.slice(0, e),
    o = 0
  for (; o < r.length; ) {
    let i = r[o]
    if (_r(i)) {
      let u = Ew(i.outlets)
      return new P(n, u)
    }
    if (o === 0 && Ai(r[0])) {
      let u = t.segments[e]
      n.push(new Wt(u.path, Ch(r[0]))), o++
      continue
    }
    let s = _r(i) ? i.outlets[b] : `${i}`,
      a = o < r.length - 1 ? r[o + 1] : null
    s && a && Ai(a)
      ? (n.push(new Wt(s, Ch(a))), (o += 2))
      : (n.push(new Wt(s, {})), o++)
  }
  return new P(n, {})
}
function Ew(t) {
  let e = {}
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = $u(new P([], {}), 0, n))
    }),
    e
  )
}
function Ch(t) {
  let e = {}
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e
}
function wh(t, e, r) {
  return t == r.path && qe(e, r.parameters)
}
var Er = "imperative",
  Q = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    )
  })(Q || {}),
  _e = class {
    constructor(e, r) {
      ;(this.id = e), (this.url = r)
    }
  },
  Ln = class extends _e {
    constructor(e, r, n = "imperative", o = null) {
      super(e, r),
        (this.type = Q.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = o)
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`
    }
  },
  We = class extends _e {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = Q.NavigationEnd)
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
    }
  },
  ve = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    )
  })(ve || {}),
  Ti = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    )
  })(Ti || {}),
  _t = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.reason = n),
        (this.code = o),
        (this.type = Q.NavigationCancel)
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
    }
  },
  St = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.reason = n),
        (this.code = o),
        (this.type = Q.NavigationSkipped)
    }
  },
  Sr = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.error = n),
        (this.target = o),
        (this.type = Q.NavigationError)
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
    }
  },
  Ni = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = Q.RoutesRecognized)
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Uu = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = Q.GuardsCheckStart)
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Bu = class extends _e {
    constructor(e, r, n, o, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = Q.GuardsCheckEnd)
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
    }
  },
  Hu = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = Q.ResolveStart)
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  Gu = class extends _e {
    constructor(e, r, n, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = o),
        (this.type = Q.ResolveEnd)
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
    }
  },
  zu = class {
    constructor(e) {
      ;(this.route = e), (this.type = Q.RouteConfigLoadStart)
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`
    }
  },
  qu = class {
    constructor(e) {
      ;(this.route = e), (this.type = Q.RouteConfigLoadEnd)
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`
    }
  },
  Wu = class {
    constructor(e) {
      ;(this.snapshot = e), (this.type = Q.ChildActivationStart)
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`
    }
  },
  Zu = class {
    constructor(e) {
      ;(this.snapshot = e), (this.type = Q.ChildActivationEnd)
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`
    }
  },
  Yu = class {
    constructor(e) {
      ;(this.snapshot = e), (this.type = Q.ActivationStart)
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`
    }
  },
  Qu = class {
    constructor(e) {
      ;(this.snapshot = e), (this.type = Q.ActivationEnd)
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`
    }
  },
  Oi = class {
    constructor(e, r, n) {
      ;(this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = Q.Scroll)
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`
    }
  },
  Ar = class {},
  xr = class {
    constructor(e) {
      this.url = e
    }
  }
var Ku = class {
    constructor() {
      ;(this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new kr()),
        (this.attachRef = null)
    }
  },
  kr = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map()
      }
      onChildOutletCreated(n, o) {
        let i = this.getOrCreateContext(n)
        ;(i.outlet = o), this.contexts.set(n, i)
      }
      onChildOutletDestroyed(n) {
        let o = this.getContext(n)
        o && ((o.outlet = null), (o.attachRef = null))
      }
      onOutletDeactivated() {
        let n = this.contexts
        return (this.contexts = new Map()), n
      }
      onOutletReAttached(n) {
        this.contexts = n
      }
      getOrCreateContext(n) {
        let o = this.getContext(n)
        return o || ((o = new Ku()), this.contexts.set(n, o)), o
      }
      getContext(n) {
        return this.contexts.get(n) || null
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  Ri = class {
    constructor(e) {
      this._root = e
    }
    get root() {
      return this._root.value
    }
    parent(e) {
      let r = this.pathFromRoot(e)
      return r.length > 1 ? r[r.length - 2] : null
    }
    children(e) {
      let r = Ju(e, this._root)
      return r ? r.children.map(n => n.value) : []
    }
    firstChild(e) {
      let r = Ju(e, this._root)
      return r && r.children.length > 0 ? r.children[0].value : null
    }
    siblings(e) {
      let r = Xu(e, this._root)
      return r.length < 2
        ? []
        : r[r.length - 2].children.map(o => o.value).filter(o => o !== e)
    }
    pathFromRoot(e) {
      return Xu(e, this._root).map(r => r.value)
    }
  }
function Ju(t, e) {
  if (t === e.value) return e
  for (let r of e.children) {
    let n = Ju(t, r)
    if (n) return n
  }
  return null
}
function Xu(t, e) {
  if (t === e.value) return [e]
  for (let r of e.children) {
    let n = Xu(t, r)
    if (n.length) return n.unshift(e), n
  }
  return []
}
var me = class {
  constructor(e, r) {
    ;(this.value = e), (this.children = r)
  }
  toString() {
    return `TreeNode(${this.value})`
  }
}
function On(t) {
  let e = {}
  return t && t.children.forEach(r => (e[r.value.outlet] = r)), e
}
var Fi = class extends Ri {
  constructor(e, r) {
    super(e), (this.snapshot = r), cc(this, e)
  }
  toString() {
    return this.snapshot.toString()
  }
}
function $h(t) {
  let e = bw(t),
    r = new K([new Wt("", {})]),
    n = new K({}),
    o = new K({}),
    i = new K({}),
    s = new K(""),
    a = new Ze(r, n, i, s, o, b, t, e.root)
  return (a.snapshot = e.root), new Fi(new me(a, []), e)
}
function bw(t) {
  let e = {},
    r = {},
    n = {},
    o = "",
    i = new Tr([], e, n, o, r, b, t, null, {})
  return new Pi("", new me(i, []))
}
var Ze = class {
  constructor(e, r, n, o, i, s, a, u) {
    ;(this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(x(c => c[Fr])) ?? D(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = o),
      (this.data = i)
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig
  }
  get root() {
    return this._routerState.root
  }
  get parent() {
    return this._routerState.parent(this)
  }
  get firstChild() {
    return this._routerState.firstChild(this)
  }
  get children() {
    return this._routerState.children(this)
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this)
  }
  get paramMap() {
    return (this._paramMap ??= this.params.pipe(x(e => Pn(e)))), this._paramMap
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(x(e => Pn(e)))),
      this._queryParamMap
    )
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`
  }
}
function uc(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: o } = t
  return (
    e !== null &&
    (r === "always" ||
      o?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, e.params), t.params),
          data: g(g({}, e.data), t.data),
          resolve: g(g(g(g({}, t.data), e.data), o?.data), t._resolvedData),
        })
      : (n = {
          params: g({}, t.params),
          data: g({}, t.data),
          resolve: g(g({}, t.data), t._resolvedData ?? {}),
        }),
    o && Bh(o) && (n.resolve[Fr] = o.title),
    n
  )
}
var Tr = class {
    get title() {
      return this.data?.[Fr]
    }
    constructor(e, r, n, o, i, s, a, u, c) {
      ;(this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = u),
        (this._resolve = c)
    }
    get root() {
      return this._routerState.root
    }
    get parent() {
      return this._routerState.parent(this)
    }
    get firstChild() {
      return this._routerState.firstChild(this)
    }
    get children() {
      return this._routerState.children(this)
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this)
    }
    get paramMap() {
      return (this._paramMap ??= Pn(this.params)), this._paramMap
    }
    get queryParamMap() {
      return (this._queryParamMap ??= Pn(this.queryParams)), this._queryParamMap
    }
    toString() {
      let e = this.url.map(n => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : ""
      return `Route(url:'${e}', path:'${r}')`
    }
  },
  Pi = class extends Ri {
    constructor(e, r) {
      super(r), (this.url = e), cc(this, r)
    }
    toString() {
      return Uh(this._root)
    }
  }
function cc(t, e) {
  ;(e.value._routerState = t), e.children.forEach(r => cc(t, r))
}
function Uh(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Uh).join(", ")} } ` : ""
  return `${t.value}${e}`
}
function Fu(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot
    ;(t.snapshot = r),
      qe(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      qe(e.params, r.params) || t.paramsSubject.next(r.params),
      XC(e.url, r.url) || t.urlSubject.next(r.url),
      qe(e.data, r.data) || t.dataSubject.next(r.data)
  } else
    (t.snapshot = t._futureSnapshot), t.dataSubject.next(t._futureSnapshot.data)
}
function ec(t, e) {
  let r = qe(t.params, e.params) && rw(t.url, e.url),
    n = !t.parent != !e.parent
  return r && !n && (!t.parent || ec(t.parent, e.parent))
}
function Bh(t) {
  return typeof t.title == "string" || t.title === null
}
var lc = (() => {
    let e = class e {
      constructor() {
        ;(this.activated = null),
          (this._activatedRoute = null),
          (this.name = b),
          (this.activateEvents = new te()),
          (this.deactivateEvents = new te()),
          (this.attachEvents = new te()),
          (this.detachEvents = new te()),
          (this.parentContexts = p(kr)),
          (this.location = p(lr)),
          (this.changeDetector = p(An)),
          (this.environmentInjector = p(le)),
          (this.inputBinder = p(ji, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0)
      }
      get activatedComponentRef() {
        return this.activated
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: o, previousValue: i } = n.name
          if (o) return
          this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName()
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this)
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this
      }
      ngOnInit() {
        this.initializeOutletWithName()
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return
        let n = this.parentContexts.getContext(this.name)
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector))
      }
      get isActivated() {
        return !!this.activated
      }
      get component() {
        if (!this.activated) throw new v(4012, !1)
        return this.activated.instance
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1)
        return this._activatedRoute
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
      }
      detach() {
        if (!this.activated) throw new v(4012, !1)
        this.location.detach()
        let n = this.activated
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        )
      }
      attach(n, o) {
        ;(this.activated = n),
          (this._activatedRoute = o),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance)
      }
      deactivate() {
        if (this.activated) {
          let n = this.component
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n)
        }
      }
      activateWith(n, o) {
        if (this.isActivated) throw new v(4013, !1)
        this._activatedRoute = n
        let i = this.location,
          a = n.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new tc(n, u, i.injector)
        ;(this.activated = i.createComponent(a, {
          index: i.length,
          injector: c,
          environmentInjector: o ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵdir = de({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Ct],
      }))
    let t = e
    return t
  })(),
  tc = class t {
    __ngOutletInjector(e) {
      return new t(this.route, this.childContexts, e)
    }
    constructor(e, r, n) {
      ;(this.route = e), (this.childContexts = r), (this.parent = n)
    }
    get(e, r) {
      return e === Ze
        ? this.route
        : e === kr
          ? this.childContexts
          : this.parent.get(e, r)
    }
  },
  ji = new w(""),
  Ih = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map()
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n)
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n)
      }
      subscribeToRouteData(n) {
        let { activatedRoute: o } = n,
          i = Gn([o.queryParams, o.params, o.data])
            .pipe(
              De(
                ([s, a, u], c) => (
                  (u = g(g(g({}, s), a), u)),
                  c === 0 ? D(u) : Promise.resolve(u)
                )
              )
            )
            .subscribe(s => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== o ||
                o.component === null
              ) {
                this.unsubscribeFromRouteData(n)
                return
              }
              let a = Yf(o.component)
              if (!a) {
                this.unsubscribeFromRouteData(n)
                return
              }
              for (let { templateName: u } of a.inputs)
                n.activatedComponentRef.setInput(u, s[u])
            })
        this.outletDataSubscriptions.set(n, i)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function Mw(t, e, r) {
  let n = Nr(t, e._root, r ? r._root : void 0)
  return new Fi(n, e)
}
function Nr(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value
    n._futureSnapshot = e.value
    let o = _w(t, e, r)
    return new me(n, o)
  } else {
    if (t.shouldAttach(e.value)) {
      let i = t.retrieve(e.value)
      if (i !== null) {
        let s = i.route
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map(a => Nr(t, a))),
          s
        )
      }
    }
    let n = Sw(e.value),
      o = e.children.map(i => Nr(t, i))
    return new me(n, o)
  }
}
function _w(t, e, r) {
  return e.children.map(n => {
    for (let o of r.children)
      if (t.shouldReuseRoute(n.value, o.value.snapshot)) return Nr(t, n, o)
    return Nr(t, n)
  })
}
function Sw(t) {
  return new Ze(
    new K(t.url),
    new K(t.params),
    new K(t.queryParams),
    new K(t.fragment),
    new K(t.data),
    t.outlet,
    t.component,
    t
  )
}
var Hh = "ngNavigationCancelingError"
function Gh(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = kn(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    o = zh(!1, ve.Redirect)
  return (o.url = r), (o.navigationBehaviorOptions = n), o
}
function zh(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`)
  return (r[Hh] = !0), (r.cancellationCode = e), r
}
function Aw(t) {
  return qh(t) && kn(t.url)
}
function qh(t) {
  return !!t && t[Hh]
}
var xw = (() => {
  let e = class e {}
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵcmp = He({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Ge],
      decls: 1,
      vars: 0,
      template: function (o, i) {
        o & 1 && oe(0, "router-outlet")
      },
      dependencies: [lc],
      encapsulation: 2,
    }))
  let t = e
  return t
})()
function Tw(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = ui(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  )
}
function dc(t) {
  let e = t.children && t.children.map(dc),
    r = e ? U(g({}, t), { children: e }) : g({}, t)
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== b &&
      (r.component = xw),
    r
  )
}
function Ye(t) {
  return t.outlet || b
}
function Nw(t, e) {
  let r = t.filter(n => Ye(n) === e)
  return r.push(...t.filter(n => Ye(n) !== e)), r
}
function Lr(t) {
  if (!t) return null
  if (t.routeConfig?._injector) return t.routeConfig._injector
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig
    if (r?._loadedInjector) return r._loadedInjector
    if (r?._injector) return r._injector
  }
  return null
}
var Ow = (t, e, r, n) =>
    x(
      o => (
        new nc(e, o.targetRouterState, o.currentRouterState, r, n).activate(t),
        o
      )
    ),
  nc = class {
    constructor(e, r, n, o, i) {
      ;(this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i)
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null
      this.deactivateChildRoutes(r, n, e),
        Fu(this.futureState.root),
        this.activateChildRoutes(r, n, e)
    }
    deactivateChildRoutes(e, r, n) {
      let o = On(r)
      e.children.forEach(i => {
        let s = i.value.outlet
        this.deactivateRoutes(i, o[s], n), delete o[s]
      }),
        Object.values(o).forEach(i => {
          this.deactivateRouteAndItsChildren(i, n)
        })
    }
    deactivateRoutes(e, r, n) {
      let o = e.value,
        i = r ? r.value : null
      if (o === i)
        if (o.component) {
          let s = n.getContext(o.outlet)
          s && this.deactivateChildRoutes(e, r, s.children)
        } else this.deactivateChildRoutes(e, r, n)
      else i && this.deactivateRouteAndItsChildren(r, n)
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r)
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        o = n && e.value.component ? n.children : r,
        i = On(e)
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o)
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated()
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        })
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        o = n && e.value.component ? n.children : r,
        i = On(e)
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o)
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null))
    }
    activateChildRoutes(e, r, n) {
      let o = On(r)
      e.children.forEach(i => {
        this.activateRoutes(i, o[i.value.outlet], n),
          this.forwardEvent(new Qu(i.value.snapshot))
      }),
        e.children.length && this.forwardEvent(new Zu(e.value.snapshot))
    }
    activateRoutes(e, r, n) {
      let o = e.value,
        i = r ? r.value : null
      if ((Fu(o), o === i))
        if (o.component) {
          let s = n.getOrCreateContext(o.outlet)
          this.activateChildRoutes(e, r, s.children)
        } else this.activateChildRoutes(e, r, n)
      else if (o.component) {
        let s = n.getOrCreateContext(o.outlet)
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot)
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Fu(a.route.value),
            this.activateChildRoutes(e, null, s.children)
        } else {
          let a = Lr(o.snapshot)
          ;(s.attachRef = null),
            (s.route = o),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(e, null, s.children)
        }
      } else this.activateChildRoutes(e, null, n)
    }
  },
  ki = class {
    constructor(e) {
      ;(this.path = e), (this.route = this.path[this.path.length - 1])
    }
  },
  Fn = class {
    constructor(e, r) {
      ;(this.component = e), (this.route = r)
    }
  }
function Rw(t, e, r) {
  let n = t._root,
    o = e ? e._root : null
  return Cr(n, o, r, [n.value])
}
function Fw(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null
  return !e || e.length === 0 ? null : { node: t, guards: e }
}
function jn(t, e) {
  let r = Symbol(),
    n = e.get(t, r)
  return n === r ? (typeof t == "function" && !Bl(t) ? t : e.get(t)) : n
}
function Cr(
  t,
  e,
  r,
  n,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = On(e)
  return (
    t.children.forEach(s => {
      Pw(s, i[s.value.outlet], r, n.concat([s.value]), o),
        delete i[s.value.outlet]
    }),
    Object.entries(i).forEach(([s, a]) => br(a, r.getContext(s), o)),
    o
  )
}
function Pw(
  t,
  e,
  r,
  n,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null
  if (s && i.routeConfig === s.routeConfig) {
    let u = kw(s, i, i.routeConfig.runGuardsAndResolvers)
    u
      ? o.canActivateChecks.push(new ki(n))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? Cr(t, e, a ? a.children : null, n, o) : Cr(t, e, r, n, o),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Fn(a.outlet.component, s))
  } else
    s && br(e, a, o),
      o.canActivateChecks.push(new ki(n)),
      i.component
        ? Cr(t, null, a ? a.children : null, n, o)
        : Cr(t, null, r, n, o)
  return o
}
function kw(t, e, r) {
  if (typeof r == "function") return r(t, e)
  switch (r) {
    case "pathParamsChange":
      return !Zt(t.url, e.url)
    case "pathParamsOrQueryParamsChange":
      return !Zt(t.url, e.url) || !qe(t.queryParams, e.queryParams)
    case "always":
      return !0
    case "paramsOrQueryParamsChange":
      return !ec(t, e) || !qe(t.queryParams, e.queryParams)
    case "paramsChange":
    default:
      return !ec(t, e)
  }
}
function br(t, e, r) {
  let n = On(t),
    o = t.value
  Object.entries(n).forEach(([i, s]) => {
    o.component
      ? e
        ? br(s, e.children.getContext(i), r)
        : br(s, null, r)
      : br(s, e, r)
  }),
    o.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Fn(e.outlet.component, o))
        : r.canDeactivateChecks.push(new Fn(null, o))
      : r.canDeactivateChecks.push(new Fn(null, o))
}
function Vr(t) {
  return typeof t == "function"
}
function Lw(t) {
  return typeof t == "boolean"
}
function Vw(t) {
  return t && Vr(t.canLoad)
}
function jw(t) {
  return t && Vr(t.canActivate)
}
function $w(t) {
  return t && Vr(t.canActivateChild)
}
function Uw(t) {
  return t && Vr(t.canDeactivate)
}
function Bw(t) {
  return t && Vr(t.canMatch)
}
function Wh(t) {
  return t instanceof Je || t?.name === "EmptyError"
}
var bi = Symbol("INITIAL_VALUE")
function Vn() {
  return De(t =>
    Gn(t.map(e => e.pipe(Xe(1), Ds(bi)))).pipe(
      x(e => {
        for (let r of e)
          if (r !== !0) {
            if (r === bi) return bi
            if (r === !1 || r instanceof Mt) return r
          }
        return !0
      }),
      ye(e => e !== bi),
      Xe(1)
    )
  )
}
function Hw(t, e) {
  return q(r => {
    let {
      targetSnapshot: n,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = r
    return s.length === 0 && i.length === 0
      ? D(U(g({}, r), { guardsResult: !0 }))
      : Gw(s, n, o, t).pipe(
          q(a => (a && Lw(a) ? zw(n, i, t, e) : D(a))),
          x(a => U(g({}, r), { guardsResult: a }))
        )
  })
}
function Gw(t, e, r, n) {
  return G(t).pipe(
    q(o => Qw(o.component, o.route, r, e, n)),
    Pe(o => o !== !0, !0)
  )
}
function zw(t, e, r, n) {
  return G(e).pipe(
    Ot(o =>
      un(
        Ww(o.route.parent, n),
        qw(o.route, n),
        Yw(t, o.path, r),
        Zw(t, o.route, r)
      )
    ),
    Pe(o => o !== !0, !0)
  )
}
function qw(t, e) {
  return t !== null && e && e(new Yu(t)), D(!0)
}
function Ww(t, e) {
  return t !== null && e && e(new Wu(t)), D(!0)
}
function Zw(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null
  if (!n || n.length === 0) return D(!0)
  let o = n.map(i =>
    po(() => {
      let s = Lr(e) ?? r,
        a = jn(i, s),
        u = jw(a) ? a.canActivate(e, t) : nt(s, () => a(e, t))
      return At(u).pipe(Pe())
    })
  )
  return D(o).pipe(Vn())
}
function Yw(t, e, r) {
  let n = e[e.length - 1],
    i = e
      .slice(0, e.length - 1)
      .reverse()
      .map(s => Fw(s))
      .filter(s => s !== null)
      .map(s =>
        po(() => {
          let a = s.guards.map(u => {
            let c = Lr(s.node) ?? r,
              l = jn(u, c),
              d = $w(l) ? l.canActivateChild(n, t) : nt(c, () => l(n, t))
            return At(d).pipe(Pe())
          })
          return D(a).pipe(Vn())
        })
      )
  return D(i).pipe(Vn())
}
function Qw(t, e, r, n, o) {
  let i = e && e.routeConfig ? e.routeConfig.canDeactivate : null
  if (!i || i.length === 0) return D(!0)
  let s = i.map(a => {
    let u = Lr(e) ?? o,
      c = jn(a, u),
      l = Uw(c) ? c.canDeactivate(t, e, r, n) : nt(u, () => c(t, e, r, n))
    return At(l).pipe(Pe())
  })
  return D(s).pipe(Vn())
}
function Kw(t, e, r, n) {
  let o = e.canLoad
  if (o === void 0 || o.length === 0) return D(!0)
  let i = o.map(s => {
    let a = jn(s, t),
      u = Vw(a) ? a.canLoad(e, r) : nt(t, () => a(e, r))
    return At(u)
  })
  return D(i).pipe(Vn(), Zh(n))
}
function Zh(t) {
  return ls(
    J(e => {
      if (kn(e)) throw Gh(t, e)
    }),
    x(e => e === !0)
  )
}
function Jw(t, e, r, n) {
  let o = e.canMatch
  if (!o || o.length === 0) return D(!0)
  let i = o.map(s => {
    let a = jn(s, t),
      u = Bw(a) ? a.canMatch(e, r) : nt(t, () => a(e, r))
    return At(u)
  })
  return D(i).pipe(Vn(), Zh(n))
}
var Or = class {
    constructor(e) {
      this.segmentGroup = e || null
    }
  },
  Li = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e)
    }
  }
function Nn(t) {
  return sn(new Or(t))
}
function Xw(t) {
  return sn(new v(4e3, !1))
}
function eI(t) {
  return sn(zh(!1, ve.GuardRejected))
}
var rc = class {
    constructor(e, r) {
      ;(this.urlSerializer = e), (this.urlTree = r)
    }
    lineralizeSegments(e, r) {
      let n = [],
        o = r.root
      for (;;) {
        if (((n = n.concat(o.segments)), o.numberOfChildren === 0)) return D(n)
        if (o.numberOfChildren > 1 || !o.children[b]) return Xw(e.redirectTo)
        o = o.children[b]
      }
    }
    applyRedirectCommands(e, r, n) {
      let o = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      )
      if (r.startsWith("/")) throw new Li(o)
      return o
    }
    applyRedirectCreateUrlTree(e, r, n, o) {
      let i = this.createSegmentGroup(e, r.root, n, o)
      return new Mt(
        i,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      )
    }
    createQueryParams(e, r) {
      let n = {}
      return (
        Object.entries(e).forEach(([o, i]) => {
          if (typeof i == "string" && i.startsWith(":")) {
            let a = i.substring(1)
            n[o] = r[a]
          } else n[o] = i
        }),
        n
      )
    }
    createSegmentGroup(e, r, n, o) {
      let i = this.createSegments(e, r.segments, n, o),
        s = {}
      return (
        Object.entries(r.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(e, u, n, o)
        }),
        new P(i, s)
      )
    }
    createSegments(e, r, n, o) {
      return r.map(i =>
        i.path.startsWith(":")
          ? this.findPosParam(e, i, o)
          : this.findOrReturn(i, n)
      )
    }
    findPosParam(e, r, n) {
      let o = n[r.path.substring(1)]
      if (!o) throw new v(4001, !1)
      return o
    }
    findOrReturn(e, r) {
      let n = 0
      for (let o of r) {
        if (o.path === e.path) return r.splice(n), o
        n++
      }
      return e
    }
  },
  oc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  }
function tI(t, e, r, n, o) {
  let i = fc(t, e, r)
  return i.matched
    ? ((n = Tw(e, n)), Jw(n, e, r, o).pipe(x(s => (s === !0 ? i : g({}, oc)))))
    : D(i)
}
function fc(t, e, r) {
  if (e.path === "**") return nI(r)
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? g({}, oc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        }
  let o = (e.matcher || JC)(r, t, e)
  if (!o) return g({}, oc)
  let i = {}
  Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
    i[a] = u.path
  })
  let s =
    o.consumed.length > 0
      ? g(g({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: r.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  }
}
function nI(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Sh(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  }
}
function Eh(t, e, r, n) {
  return r.length > 0 && iI(t, r, n)
    ? {
        segmentGroup: new P(e, oI(n, new P(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && sI(t, r, n)
      ? {
          segmentGroup: new P(t.segments, rI(t, r, n, t.children)),
          slicedSegments: r,
        }
      : { segmentGroup: new P(t.segments, t.children), slicedSegments: r }
}
function rI(t, e, r, n) {
  let o = {}
  for (let i of r)
    if ($i(t, e, i) && !n[Ye(i)]) {
      let s = new P([], {})
      o[Ye(i)] = s
    }
  return g(g({}, n), o)
}
function oI(t, e) {
  let r = {}
  r[b] = e
  for (let n of t)
    if (n.path === "" && Ye(n) !== b) {
      let o = new P([], {})
      r[Ye(n)] = o
    }
  return r
}
function iI(t, e, r) {
  return r.some(n => $i(t, e, n) && Ye(n) !== b)
}
function sI(t, e, r) {
  return r.some(n => $i(t, e, n))
}
function $i(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === ""
}
function aI(t, e, r, n) {
  return Ye(t) !== n && (n === b || !$i(e, r, t)) ? !1 : fc(e, t, r).matched
}
function uI(t, e, r) {
  return e.length === 0 && !t.children[r]
}
var ic = class {}
function cI(t, e, r, n, o, i, s = "emptyOnly") {
  return new sc(t, e, r, n, o, s, i).recognize()
}
var lI = 31,
  sc = class {
    constructor(e, r, n, o, i, s, a) {
      ;(this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new rc(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0)
    }
    noMatchError(e) {
      return new v(4002, `'${e.segmentGroup}'`)
    }
    recognize() {
      let e = Eh(this.urlTree.root, [], [], this.config).segmentGroup
      return this.match(e).pipe(
        x(r => {
          let n = new Tr(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              b,
              this.rootComponentType,
              null,
              {}
            ),
            o = new me(n, r),
            i = new Pi("", o),
            s = vw(n, [], this.urlTree.queryParams, this.urlTree.fragment)
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(i._root, null),
            { state: i, tree: s }
          )
        })
      )
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, b).pipe(
        dt(n => {
          if (n instanceof Li)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root)
          throw n instanceof Or ? this.noMatchError(n) : n
        })
      )
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        o = uc(n, r, this.paramsInheritanceStrategy)
      ;(n.params = Object.freeze(o.params)),
        (n.data = Object.freeze(o.data)),
        e.children.forEach(i => this.inheritParamsAndData(i, n))
    }
    processSegmentGroup(e, r, n, o) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, o, !0).pipe(
            x(i => (i instanceof me ? [i] : []))
          )
    }
    processChildren(e, r, n) {
      let o = []
      for (let i of Object.keys(n.children))
        i === "primary" ? o.unshift(i) : o.push(i)
      return G(o).pipe(
        Ot(i => {
          let s = n.children[i],
            a = Nw(r, i)
          return this.processSegmentGroup(e, a, s, i)
        }),
        ys((i, s) => (i.push(...s), i)),
        ft(null),
        vs(),
        q(i => {
          if (i === null) return Nn(n)
          let s = Yh(i)
          return dI(s), D(s)
        })
      )
    }
    processSegment(e, r, n, o, i, s) {
      return G(r).pipe(
        Ot(a =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            o,
            i,
            s
          ).pipe(
            dt(u => {
              if (u instanceof Or) return D(null)
              throw u
            })
          )
        ),
        Pe(a => !!a),
        dt(a => {
          if (Wh(a)) return uI(n, o, i) ? D(new ic()) : Nn(n)
          throw a
        })
      )
    }
    processSegmentAgainstRoute(e, r, n, o, i, s, a) {
      return aI(n, o, i, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, o, n, i, s)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(e, o, r, n, i, s)
            : Nn(o)
        : Nn(o)
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, o, i, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = fc(r, o, i)
      if (!a) return Nn(r)
      o.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > lI && (this.allowRedirects = !1))
      let d = this.applyRedirects.applyRedirectCommands(u, o.redirectTo, c)
      return this.applyRedirects
        .lineralizeSegments(o, d)
        .pipe(q(h => this.processSegment(e, n, r, h.concat(l), s, !1)))
    }
    matchSegmentAgainstRoute(e, r, n, o, i) {
      let s = tI(r, n, o, e, this.urlSerializer)
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          De(a =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, o).pipe(
                  De(({ routes: u }) => {
                    let c = n._loadedInjector ?? e,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: h,
                      } = a,
                      f = new Tr(
                        l,
                        h,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        hI(n),
                        Ye(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        pI(n)
                      ),
                      { segmentGroup: m, slicedSegments: M } = Eh(r, l, d, u)
                    if (M.length === 0 && m.hasChildren())
                      return this.processChildren(c, u, m).pipe(
                        x(O => (O === null ? null : new me(f, O)))
                      )
                    if (u.length === 0 && M.length === 0)
                      return D(new me(f, []))
                    let B = Ye(n) === i
                    return this.processSegment(c, u, m, M, B ? b : i, !0).pipe(
                      x(O => new me(f, O instanceof me ? [O] : []))
                    )
                  })
                ))
              : Nn(r)
          )
        )
      )
    }
    getChildConfig(e, r, n) {
      return r.children
        ? D({ routes: r.children, injector: e })
        : r.loadChildren
          ? r._loadedRoutes !== void 0
            ? D({ routes: r._loadedRoutes, injector: r._loadedInjector })
            : Kw(e, r, n, this.urlSerializer).pipe(
                q(o =>
                  o
                    ? this.configLoader.loadChildren(e, r).pipe(
                        J(i => {
                          ;(r._loadedRoutes = i.routes),
                            (r._loadedInjector = i.injector)
                        })
                      )
                    : eI(r)
                )
              )
          : D({ routes: [], injector: e })
    }
  }
function dI(t) {
  t.sort((e, r) =>
    e.value.outlet === b
      ? -1
      : r.value.outlet === b
        ? 1
        : e.value.outlet.localeCompare(r.value.outlet)
  )
}
function fI(t) {
  let e = t.value.routeConfig
  return e && e.path === ""
}
function Yh(t) {
  let e = [],
    r = new Set()
  for (let n of t) {
    if (!fI(n)) {
      e.push(n)
      continue
    }
    let o = e.find(i => n.value.routeConfig === i.value.routeConfig)
    o !== void 0 ? (o.children.push(...n.children), r.add(o)) : e.push(n)
  }
  for (let n of r) {
    let o = Yh(n.children)
    e.push(new me(n.value, o))
  }
  return e.filter(n => !r.has(n))
}
function hI(t) {
  return t.data || {}
}
function pI(t) {
  return t.resolve || {}
}
function gI(t, e, r, n, o, i) {
  return q(s =>
    cI(t, e, r, n, s.extractedUrl, o, i).pipe(
      x(({ state: a, tree: u }) =>
        U(g({}, s), { targetSnapshot: a, urlAfterRedirects: u })
      )
    )
  )
}
function mI(t, e) {
  return q(r => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: o },
    } = r
    if (!o.length) return D(r)
    let i = new Set(o.map(u => u.route)),
      s = new Set()
    for (let u of i) if (!s.has(u)) for (let c of Qh(u)) s.add(c)
    let a = 0
    return G(s).pipe(
      Ot(u =>
        i.has(u)
          ? vI(u, n, t, e)
          : ((u.data = uc(u, u.parent, t).resolve), D(void 0))
      ),
      J(() => a++),
      cn(1),
      q(u => (a === s.size ? D(r) : pe))
    )
  })
}
function Qh(t) {
  let e = t.children.map(r => Qh(r)).flat()
  return [t, ...e]
}
function vI(t, e, r, n) {
  let o = t.routeConfig,
    i = t._resolve
  return (
    o?.title !== void 0 && !Bh(o) && (i[Fr] = o.title),
    yI(i, t, e, n).pipe(
      x(
        s => (
          (t._resolvedData = s), (t.data = uc(t, t.parent, r).resolve), null
        )
      )
    )
  )
}
function yI(t, e, r, n) {
  let o = Lu(t)
  if (o.length === 0) return D({})
  let i = {}
  return G(o).pipe(
    q(s =>
      DI(t[s], e, r, n).pipe(
        Pe(),
        J(a => {
          i[s] = a
        })
      )
    ),
    cn(1),
    ms(i),
    dt(s => (Wh(s) ? pe : sn(s)))
  )
}
function DI(t, e, r, n) {
  let o = Lr(e) ?? n,
    i = jn(t, o),
    s = i.resolve ? i.resolve(e, r) : nt(o, () => i(e, r))
  return At(s)
}
function Pu(t) {
  return De(e => {
    let r = t(e)
    return r ? G(r).pipe(x(() => e)) : D(e)
  })
}
var Kh = (() => {
    let e = class e {
      buildTitle(n) {
        let o,
          i = n.root
        for (; i !== void 0; )
          (o = this.getResolvedTitleForRoute(i) ?? o),
            (i = i.children.find(s => s.outlet === b))
        return o
      }
      getResolvedTitleForRoute(n) {
        return n.data[Fr]
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => p(CI), providedIn: "root" }))
    let t = e
    return t
  })(),
  CI = (() => {
    let e = class e extends Kh {
      constructor(n) {
        super(), (this.title = n)
      }
      updateTitle(n) {
        let o = this.buildTitle(n)
        o !== void 0 && this.title.setTitle(o)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(vh))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  jr = new w("", { providedIn: "root", factory: () => ({}) }),
  Rr = new w(""),
  hc = (() => {
    let e = class e {
      constructor() {
        ;(this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(yi))
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n)
        if (n._loadedComponent) return D(n._loadedComponent)
        this.onLoadStartListener && this.onLoadStartListener(n)
        let o = At(n.loadComponent()).pipe(
            x(Jh),
            J(s => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s)
            }),
            zn(() => {
              this.componentLoaders.delete(n)
            })
          ),
          i = new on(o, () => new ee()).pipe(rn())
        return this.componentLoaders.set(n, i), i
      }
      loadChildren(n, o) {
        if (this.childrenLoaders.get(o)) return this.childrenLoaders.get(o)
        if (o._loadedRoutes)
          return D({ routes: o._loadedRoutes, injector: o._loadedInjector })
        this.onLoadStartListener && this.onLoadStartListener(o)
        let s = wI(o, this.compiler, n, this.onLoadEndListener).pipe(
            zn(() => {
              this.childrenLoaders.delete(o)
            })
          ),
          a = new on(s, () => new ee()).pipe(rn())
        return this.childrenLoaders.set(o, a), a
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })()
function wI(t, e, r, n) {
  return At(t.loadChildren()).pipe(
    x(Jh),
    q(o =>
      o instanceof tr || Array.isArray(o) ? D(o) : G(e.compileModuleAsync(o))
    ),
    x(o => {
      n && n(t)
      let i,
        s,
        a = !1
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(r).injector),
            (s = i.get(Rr, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(dc), injector: i }
      )
    })
  )
}
function II(t) {
  return t && typeof t == "object" && "default" in t
}
function Jh(t) {
  return II(t) ? t.default : t
}
var pc = (() => {
    let e = class e {}
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => p(EI), providedIn: "root" }))
    let t = e
    return t
  })(),
  EI = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0
      }
      extract(n) {
        return n
      }
      merge(n, o) {
        return n
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  Xh = new w(""),
  ep = new w("")
function bI(t, e, r) {
  let n = t.get(ep),
    o = t.get(fe)
  return t.get(V).runOutsideAngular(() => {
    if (!o.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), new Promise(c => setTimeout(c))
    let i,
      s = new Promise(c => {
        i = c
      }),
      a = o.startViewTransition(() => (i(), MI(t))),
      { onViewTransitionCreated: u } = n
    return u && nt(t, () => u({ transition: a, from: e, to: r })), s
  })
}
function MI(t) {
  return new Promise(e => {
    ai(e, { injector: t })
  })
}
var gc = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0
    }
    constructor() {
      ;(this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new ee()),
        (this.transitionAbortSubject = new ee()),
        (this.configLoader = p(hc)),
        (this.environmentInjector = p(le)),
        (this.urlSerializer = p(Pr)),
        (this.rootContexts = p(kr)),
        (this.location = p(Tn)),
        (this.inputBindingEnabled = p(ji, { optional: !0 }) !== null),
        (this.titleStrategy = p(Kh)),
        (this.options = p(jr, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = p(pc)),
        (this.createViewTransition = p(Xh, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => D(void 0)),
        (this.rootComponentType = null)
      let n = i => this.events.next(new zu(i)),
        o = i => this.events.next(new qu(i))
      ;(this.configLoader.onLoadEndListener = o),
        (this.configLoader.onLoadStartListener = n)
    }
    complete() {
      this.transitions?.complete()
    }
    handleNavigationRequest(n) {
      let o = ++this.navigationId
      this.transitions?.next(U(g(g({}, this.transitions.value), n), { id: o }))
    }
    setupNavigations(n, o, i) {
      return (
        (this.transitions = new K({
          id: 0,
          currentUrlTree: o,
          currentRawUrl: o,
          extractedUrl: this.urlHandlingStrategy.extract(o),
          urlAfterRedirects: this.urlHandlingStrategy.extract(o),
          rawUrl: o,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: Er,
          restoredState: null,
          currentSnapshot: i.snapshot,
          targetSnapshot: null,
          currentRouterState: i,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          ye(s => s.id !== 0),
          x(s =>
            U(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          De(s => {
            let a = !1,
              u = !1
            return D(s).pipe(
              De(c => {
                if (this.navigationId > s.id)
                  return (
                    this.cancelNavigationTransition(
                      s,
                      "",
                      ve.SupersededByNewNavigation
                    ),
                    pe
                  )
                ;(this.currentTransition = s),
                  (this.currentNavigation = {
                    id: c.id,
                    initialUrl: c.rawUrl,
                    extractedUrl: c.extractedUrl,
                    trigger: c.source,
                    extras: c.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? U(g({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  })
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation
                if (!l && d !== "reload") {
                  let h = ""
                  return (
                    this.events.next(
                      new St(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        h,
                        Ti.IgnoredSameUrlNavigation
                      )
                    ),
                    c.resolve(null),
                    pe
                  )
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return D(c).pipe(
                    De(h => {
                      let f = this.transitions?.getValue()
                      return (
                        this.events.next(
                          new Ln(
                            h.id,
                            this.urlSerializer.serialize(h.extractedUrl),
                            h.source,
                            h.restoredState
                          )
                        ),
                        f !== this.transitions?.getValue()
                          ? pe
                          : Promise.resolve(h)
                      )
                    }),
                    gI(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    J(h => {
                      ;(s.targetSnapshot = h.targetSnapshot),
                        (s.urlAfterRedirects = h.urlAfterRedirects),
                        (this.currentNavigation = U(
                          g({}, this.currentNavigation),
                          { finalUrl: h.urlAfterRedirects }
                        ))
                      let f = new Ni(
                        h.id,
                        this.urlSerializer.serialize(h.extractedUrl),
                        this.urlSerializer.serialize(h.urlAfterRedirects),
                        h.targetSnapshot
                      )
                      this.events.next(f)
                    })
                  )
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: h,
                      extractedUrl: f,
                      source: m,
                      restoredState: M,
                      extras: B,
                    } = c,
                    O = new Ln(h, this.urlSerializer.serialize(f), m, M)
                  this.events.next(O)
                  let Qe = $h(this.rootComponentType).snapshot
                  return (
                    (this.currentTransition = s =
                      U(g({}, c), {
                        targetSnapshot: Qe,
                        urlAfterRedirects: f,
                        extras: U(g({}, B), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = f),
                    D(s)
                  )
                } else {
                  let h = ""
                  return (
                    this.events.next(
                      new St(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        h,
                        Ti.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    c.resolve(null),
                    pe
                  )
                }
              }),
              J(c => {
                let l = new Uu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot
                )
                this.events.next(l)
              }),
              x(
                c => (
                  (this.currentTransition = s =
                    U(g({}, c), {
                      guards: Rw(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              Hw(this.environmentInjector, c => this.events.next(c)),
              J(c => {
                if (((s.guardsResult = c.guardsResult), kn(c.guardsResult)))
                  throw Gh(this.urlSerializer, c.guardsResult)
                let l = new Bu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult
                )
                this.events.next(l)
              }),
              ye(c =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, "", ve.GuardRejected),
                    !1)
              ),
              Pu(c => {
                if (c.guards.canActivateChecks.length)
                  return D(c).pipe(
                    J(l => {
                      let d = new Hu(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      )
                      this.events.next(d)
                    }),
                    De(l => {
                      let d = !1
                      return D(l).pipe(
                        mI(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        J({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                l,
                                "",
                                ve.NoDataFromResolver
                              )
                          },
                        })
                      )
                    }),
                    J(l => {
                      let d = new Gu(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      )
                      this.events.next(d)
                    })
                  )
              }),
              Pu(c => {
                let l = d => {
                  let h = []
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    h.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        J(f => {
                          d.component = f
                        }),
                        x(() => {})
                      )
                    )
                  for (let f of d.children) h.push(...l(f))
                  return h
                }
                return Gn(l(c.targetSnapshot.root)).pipe(ft(null), Xe(1))
              }),
              Pu(() => this.afterPreactivation()),
              De(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root
                  )
                return d ? G(d).pipe(x(() => s)) : D(s)
              }),
              x(c => {
                let l = Mw(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState
                )
                return (
                  (this.currentTransition = s =
                    U(g({}, c), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                )
              }),
              J(() => {
                this.events.next(new Ar())
              }),
              Ow(
                this.rootContexts,
                n.routeReuseStrategy,
                c => this.events.next(c),
                this.inputBindingEnabled
              ),
              Xe(1),
              J({
                next: c => {
                  ;(a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new We(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot
                    ),
                    c.resolve(!0)
                },
                complete: () => {
                  a = !0
                },
              }),
              Cs(
                this.transitionAbortSubject.pipe(
                  J(c => {
                    throw c
                  })
                )
              ),
              zn(() => {
                !a &&
                  !u &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    ve.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === s.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null))
              }),
              dt(c => {
                if (((u = !0), qh(c)))
                  this.events.next(
                    new _t(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode
                    )
                  ),
                    Aw(c) ? this.events.next(new xr(c.url)) : s.resolve(!1)
                else {
                  this.events.next(
                    new Sr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0
                    )
                  )
                  try {
                    s.resolve(n.errorHandler(c))
                  } catch (l) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(l)
                  }
                }
                return pe
              })
            )
          })
        )
      )
    }
    cancelNavigationTransition(n, o, i) {
      let s = new _t(n.id, this.urlSerializer.serialize(n.extractedUrl), o, i)
      this.events.next(s), n.resolve(!1)
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      )
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      )
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
function _I(t) {
  return t !== Er
}
var SI = (() => {
    let e = class e {}
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => p(AI), providedIn: "root" }))
    let t = e
    return t
  })(),
  ac = class {
    shouldDetach(e) {
      return !1
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1
    }
    retrieve(e) {
      return null
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig
    }
  },
  AI = (() => {
    let e = class e extends ac {}
    ;(e.ɵfac = (() => {
      let n
      return function (i) {
        return (n || (n = ar(e)))(i || e)
      }
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  tp = (() => {
    let e = class e {}
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: () => p(xI), providedIn: "root" }))
    let t = e
    return t
  })(),
  xI = (() => {
    let e = class e extends tp {
      constructor() {
        super(...arguments),
          (this.location = p(Tn)),
          (this.urlSerializer = p(Pr)),
          (this.options = p(jr, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(pc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Mt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = $h(null)),
          (this.stateMemento = this.createStateMemento())
      }
      getCurrentUrlTree() {
        return this.currentUrlTree
      }
      getRawUrlTree() {
        return this.rawUrlTree
      }
      restoredState() {
        return this.location.getState()
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId)
      }
      getRouterState() {
        return this.routerState
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        }
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe(o => {
          o.type === "popstate" && n(o.url, o.state)
        })
      }
      handleRouterEvent(n, o) {
        if (n instanceof Ln) this.stateMemento = this.createStateMemento()
        else if (n instanceof St) this.rawUrlTree = o.initialUrl
        else if (n instanceof Ni) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !o.extras.skipLocationChange
          ) {
            let i = this.urlHandlingStrategy.merge(o.finalUrl, o.initialUrl)
            this.setBrowserUrl(i, o)
          }
        } else
          n instanceof Ar
            ? ((this.currentUrlTree = o.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                o.finalUrl,
                o.initialUrl
              )),
              (this.routerState = o.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (o.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, o)))
            : n instanceof _t &&
                (n.code === ve.GuardRejected ||
                  n.code === ve.NoDataFromResolver)
              ? this.restoreHistory(o)
              : n instanceof Sr
                ? this.restoreHistory(o, !0)
                : n instanceof We &&
                  ((this.lastSuccessfulId = n.id),
                  (this.currentPageId = this.browserPageId))
      }
      setBrowserUrl(n, o) {
        let i = this.urlSerializer.serialize(n)
        if (this.location.isCurrentPathEqualTo(i) || o.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, o.extras.state), this.generateNgRouterState(o.id, s))
          this.location.replaceState(i, "", a)
        } else {
          let s = g(
            g({}, o.extras.state),
            this.generateNgRouterState(o.id, this.browserPageId + 1)
          )
          this.location.go(i, "", s)
        }
      }
      restoreHistory(n, o = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let i = this.browserPageId,
            s = this.currentPageId - i
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree())
        } else
          this.canceledNavigationResolution === "replace" &&
            (o && this.resetState(n), this.resetUrlToCurrentUrlTree())
      }
      resetState(n) {
        ;(this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ))
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        )
      }
      generateNgRouterState(n, o) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: o }
          : { navigationId: n }
      }
    }
    ;(e.ɵfac = (() => {
      let n
      return function (i) {
        return (n || (n = ar(e)))(i || e)
      }
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  wr = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    )
  })(wr || {})
function np(t, e) {
  t.events
    .pipe(
      ye(
        r =>
          r instanceof We ||
          r instanceof _t ||
          r instanceof Sr ||
          r instanceof St
      ),
      x(r =>
        r instanceof We || r instanceof St
          ? wr.COMPLETE
          : (
                r instanceof _t
                  ? r.code === ve.Redirect ||
                    r.code === ve.SupersededByNewNavigation
                  : !1
              )
            ? wr.REDIRECTING
            : wr.FAILED
      ),
      ye(r => r !== wr.REDIRECTING),
      Xe(1)
    )
    .subscribe(() => {
      e()
    })
}
function TI(t) {
  throw t
}
var NI = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  OI = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  ct = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree()
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree()
      }
      get events() {
        return this._events
      }
      get routerState() {
        return this.stateManager.getRouterState()
      }
      constructor() {
        ;(this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(hi)),
          (this.stateManager = p(tp)),
          (this.options = p(jr, { optional: !0 }) || {}),
          (this.pendingTasks = p(ci)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(gc)),
          (this.urlSerializer = p(Pr)),
          (this.location = p(Tn)),
          (this.urlHandlingStrategy = p(pc)),
          (this._events = new ee()),
          (this.errorHandler = this.options.errorHandler || TI),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(SI)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(Rr, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(ji, { optional: !0 })),
          (this.eventsSubscription = new W()),
          (this.isNgZoneEnabled = p(V) instanceof V && V.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: n => {
                this.console.warn(n)
              },
            }),
          this.subscribeToNavigationEvents()
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe(o => {
          try {
            let i = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation
            if (i !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(o, s),
                o instanceof _t &&
                  o.code !== ve.Redirect &&
                  o.code !== ve.SupersededByNewNavigation)
              )
                this.navigated = !0
              else if (o instanceof We) this.navigated = !0
              else if (o instanceof xr) {
                let a = this.urlHandlingStrategy.merge(o.url, i.currentRawUrl),
                  u = {
                    info: i.extras.info,
                    skipLocationChange: i.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || _I(i.source),
                  }
                this.scheduleNavigation(a, Er, null, u, {
                  resolve: i.resolve,
                  reject: i.reject,
                  promise: i.promise,
                })
              }
            }
            FI(o) && this._events.next(o)
          } catch (i) {
            this.navigationTransitions.transitionAbortSubject.next(i)
          }
        })
        this.eventsSubscription.add(n)
      }
      resetRootComponentType(n) {
        ;(this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n)
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Er,
              this.stateManager.restoredState()
            )
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, o) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", o)
              }, 0)
            }
          )
      }
      navigateToSyncWithBrowser(n, o, i) {
        let s = { replaceUrl: !0 },
          a = i?.navigationId ? i : null
        if (i) {
          let c = g({}, i)
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c)
        }
        let u = this.parseUrl(n)
        this.scheduleNavigation(u, o, a, s)
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree)
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation
      }
      resetConfig(n) {
        ;(this.config = n.map(dc)), (this.navigated = !1)
      }
      ngOnDestroy() {
        this.dispose()
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe()
      }
      createUrlTree(n, o = {}) {
        let {
            relativeTo: i,
            queryParams: s,
            fragment: a,
            queryParamsHandling: u,
            preserveFragment: c,
          } = o,
          l = c ? this.currentUrlTree.fragment : a,
          d = null
        switch (u) {
          case "merge":
            d = g(g({}, this.currentUrlTree.queryParams), s)
            break
          case "preserve":
            d = this.currentUrlTree.queryParams
            break
          default:
            d = s || null
        }
        d !== null && (d = this.removeEmptyProps(d))
        let h
        try {
          let f = i ? i.snapshot : this.routerState.snapshot.root
          h = kh(f)
        } catch {
          ;(typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (h = this.currentUrlTree.root)
        }
        return Lh(h, n, d, l ?? null)
      }
      navigateByUrl(n, o = { skipLocationChange: !1 }) {
        let i = kn(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(i, this.rawUrlTree)
        return this.scheduleNavigation(s, Er, null, o)
      }
      navigate(n, o = { skipLocationChange: !1 }) {
        return RI(n), this.navigateByUrl(this.createUrlTree(n, o), o)
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n)
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n)
        } catch {
          return this.urlSerializer.parse("/")
        }
      }
      isActive(n, o) {
        let i
        if (
          (o === !0 ? (i = g({}, NI)) : o === !1 ? (i = g({}, OI)) : (i = o),
          kn(n))
        )
          return yh(this.currentUrlTree, n, i)
        let s = this.parseUrl(n)
        return yh(this.currentUrlTree, s, i)
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (o, [i, s]) => (s != null && (o[i] = s), o),
          {}
        )
      }
      scheduleNavigation(n, o, i, s, a) {
        if (this.disposed) return Promise.resolve(!1)
        let u, c, l
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((h, f) => {
              ;(u = h), (c = f)
            }))
        let d = this.pendingTasks.add()
        return (
          np(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d))
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: o,
            restoredState: i,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: u,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch(h => Promise.reject(h))
        )
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })()
function RI(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new v(4008, !1)
}
function FI(t) {
  return !(t instanceof Ar) && !(t instanceof xr)
}
var Ui = (() => {
  let e = class e {
    constructor(n, o, i, s, a, u) {
      ;(this.router = n),
        (this.route = o),
        (this.tabIndexAttribute = i),
        (this.renderer = s),
        (this.el = a),
        (this.locationStrategy = u),
        (this.href = null),
        (this.commands = null),
        (this.onChanges = new ee()),
        (this.preserveFragment = !1),
        (this.skipLocationChange = !1),
        (this.replaceUrl = !1)
      let c = a.nativeElement.tagName?.toLowerCase()
      ;(this.isAnchorElement = c === "a" || c === "area"),
        this.isAnchorElement
          ? (this.subscription = n.events.subscribe(l => {
              l instanceof We && this.updateHref()
            }))
          : this.setTabIndexIfNotOnNativeEl("0")
    }
    setTabIndexIfNotOnNativeEl(n) {
      this.tabIndexAttribute != null ||
        this.isAnchorElement ||
        this.applyAttributeValue("tabindex", n)
    }
    ngOnChanges(n) {
      this.isAnchorElement && this.updateHref(), this.onChanges.next(this)
    }
    set routerLink(n) {
      n != null
        ? ((this.commands = Array.isArray(n) ? n : [n]),
          this.setTabIndexIfNotOnNativeEl("0"))
        : ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null))
    }
    onClick(n, o, i, s, a) {
      let u = this.urlTree
      if (
        u === null ||
        (this.isAnchorElement &&
          (n !== 0 ||
            o ||
            i ||
            s ||
            a ||
            (typeof this.target == "string" && this.target != "_self")))
      )
        return !0
      let c = {
        skipLocationChange: this.skipLocationChange,
        replaceUrl: this.replaceUrl,
        state: this.state,
        info: this.info,
      }
      return this.router.navigateByUrl(u, c), !this.isAnchorElement
    }
    ngOnDestroy() {
      this.subscription?.unsubscribe()
    }
    updateHref() {
      let n = this.urlTree
      this.href =
        n !== null && this.locationStrategy
          ? this.locationStrategy?.prepareExternalUrl(
              this.router.serializeUrl(n)
            )
          : null
      let o =
        this.href === null
          ? null
          : tf(this.href, this.el.nativeElement.tagName.toLowerCase(), "href")
      this.applyAttributeValue("href", o)
    }
    applyAttributeValue(n, o) {
      let i = this.renderer,
        s = this.el.nativeElement
      o !== null ? i.setAttribute(s, n, o) : i.removeAttribute(s, n)
    }
    get urlTree() {
      return this.commands === null
        ? null
        : this.router.createUrlTree(this.commands, {
            relativeTo:
              this.relativeTo !== void 0 ? this.relativeTo : this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: this.preserveFragment,
          })
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)(k(ct), k(Ze), Ga("tabindex"), k(Gt), k(It), k(ut))
  }),
    (e.ɵdir = de({
      type: e,
      selectors: [["", "routerLink", ""]],
      hostVars: 1,
      hostBindings: function (o, i) {
        o & 1 &&
          Fe("click", function (a) {
            return i.onClick(
              a.button,
              a.ctrlKey,
              a.shiftKey,
              a.altKey,
              a.metaKey
            )
          }),
          o & 2 && li("target", i.target)
      },
      inputs: {
        target: "target",
        queryParams: "queryParams",
        fragment: "fragment",
        queryParamsHandling: "queryParamsHandling",
        state: "state",
        info: "info",
        relativeTo: "relativeTo",
        preserveFragment: [
          ne.HasDecoratorInputTransform,
          "preserveFragment",
          "preserveFragment",
          xn,
        ],
        skipLocationChange: [
          ne.HasDecoratorInputTransform,
          "skipLocationChange",
          "skipLocationChange",
          xn,
        ],
        replaceUrl: [
          ne.HasDecoratorInputTransform,
          "replaceUrl",
          "replaceUrl",
          xn,
        ],
        routerLink: "routerLink",
      },
      standalone: !0,
      features: [cu, Ct],
    }))
  let t = e
  return t
})()
var Vi = class {}
var PI = (() => {
    let e = class e {
      constructor(n, o, i, s, a) {
        ;(this.router = n),
          (this.injector = i),
          (this.preloadingStrategy = s),
          (this.loader = a)
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            ye(n => n instanceof We),
            Ot(() => this.preload())
          )
          .subscribe(() => {})
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config)
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe()
      }
      processRoutes(n, o) {
        let i = []
        for (let s of o) {
          s.providers &&
            !s._injector &&
            (s._injector = ui(s.providers, n, `Route: ${s.path}`))
          let a = s._injector ?? n,
            u = s._loadedInjector ?? a
          ;((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            i.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              i.push(this.processRoutes(u, s.children ?? s._loadedRoutes))
        }
        return G(i).pipe(an())
      }
      preloadConfig(n, o) {
        return this.preloadingStrategy.preload(o, () => {
          let i
          o.loadChildren && o.canLoad === void 0
            ? (i = this.loader.loadChildren(n, o))
            : (i = D(null))
          let s = i.pipe(
            q(a =>
              a === null
                ? D(void 0)
                : ((o._loadedRoutes = a.routes),
                  (o._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          )
          if (o.loadComponent && !o._loadedComponent) {
            let a = this.loader.loadComponent(o)
            return G([s, a]).pipe(an())
          } else return s
        })
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(ct), I(yi), I(le), I(Vi), I(hc))
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
    let t = e
    return t
  })(),
  rp = new w(""),
  kI = (() => {
    let e = class e {
      constructor(n, o, i, s, a = {}) {
        ;(this.urlSerializer = n),
          (this.transitions = o),
          (this.viewportScroller = i),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (this.environmentInjector = p(le)),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled")
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents())
      }
      createScrollEvents() {
        return this.transitions.events.subscribe(n => {
          n instanceof Ln
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof We
              ? ((this.lastId = n.id),
                this.scheduleScrollEvent(
                  n,
                  this.urlSerializer.parse(n.urlAfterRedirects).fragment
                ))
              : n instanceof St &&
                n.code === Ti.IgnoredSameUrlNavigation &&
                ((this.lastSource = void 0),
                (this.restoredId = 0),
                this.scheduleScrollEvent(
                  n,
                  this.urlSerializer.parse(n.url).fragment
                ))
        })
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe(n => {
          n instanceof Oi &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
                ? this.viewportScroller.scrollToAnchor(n.anchor)
                : this.options.scrollPositionRestoration !== "disabled" &&
                  this.viewportScroller.scrollToPosition([0, 0]))
        })
      }
      scheduleScrollEvent(n, o) {
        this.zone.runOutsideAngular(() =>
          Kt(this, null, function* () {
            yield new Promise(i => {
              setTimeout(() => {
                i()
              }),
                ai(
                  () => {
                    i()
                  },
                  { injector: this.environmentInjector }
                )
            }),
              this.zone.run(() => {
                this.transitions.events.next(
                  new Oi(
                    n,
                    this.lastSource === "popstate"
                      ? this.store[this.restoredId]
                      : null,
                    o
                  )
                )
              })
          })
        )
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe()
      }
    }
    ;(e.ɵfac = function (o) {
      pf()
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function op(t, ...e) {
  return Yo([
    { provide: Rr, multi: !0, useValue: t },
    [],
    { provide: Ze, useFactory: ip, deps: [ct] },
    { provide: vi, multi: !0, useFactory: sp },
    e.map(r => r.ɵproviders),
  ])
}
function ip(t) {
  return t.routerState.root
}
function $r(t, e) {
  return { ɵkind: t, ɵproviders: e }
}
function sp() {
  let t = p(it)
  return e => {
    let r = t.get(gr)
    if (e !== r.components[0]) return
    let n = t.get(ct),
      o = t.get(ap)
    t.get(mc) === 1 && n.initialNavigation(),
      t.get(up, null, _.Optional)?.setUpPreloading(),
      t.get(rp, null, _.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe())
  }
}
var ap = new w("", { factory: () => new ee() }),
  mc = new w("", { providedIn: "root", factory: () => 1 })
function LI() {
  return $r(2, [
    { provide: mc, useValue: 0 },
    {
      provide: mi,
      multi: !0,
      deps: [it],
      useFactory: e => {
        let r = e.get(th, Promise.resolve())
        return () =>
          r.then(
            () =>
              new Promise(n => {
                let o = e.get(ct),
                  i = e.get(ap)
                np(o, () => {
                  n(!0)
                }),
                  (e.get(gc).afterPreactivation = () => (
                    n(!0), i.closed ? D(void 0) : i
                  )),
                  o.initialNavigation()
              })
          )
      },
    },
  ])
}
function VI() {
  return $r(3, [
    {
      provide: mi,
      multi: !0,
      useFactory: () => {
        let e = p(ct)
        return () => {
          e.setUpLocationChangeListener()
        }
      },
    },
    { provide: mc, useValue: 2 },
  ])
}
var up = new w("")
function jI(t) {
  return $r(0, [
    { provide: up, useExisting: PI },
    { provide: Vi, useExisting: t },
  ])
}
function $I() {
  return $r(8, [Ih, { provide: ji, useExisting: Ih }])
}
function UI(t) {
  let e = [
    { provide: Xh, useValue: bI },
    {
      provide: ep,
      useValue: g({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ]
  return $r(9, e)
}
var bh = new w("ROUTER_FORROOT_GUARD"),
  BI = [
    Tn,
    { provide: Pr, useClass: Mr },
    ct,
    kr,
    { provide: Ze, useFactory: ip, deps: [ct] },
    hc,
    [],
  ],
  Bi = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, o) {
        return {
          ngModule: e,
          providers: [
            BI,
            [],
            { provide: Rr, multi: !0, useValue: n },
            { provide: bh, useFactory: qI, deps: [[ct, new Zo(), new Ma()]] },
            { provide: jr, useValue: o || {} },
            o?.useHash ? GI() : zI(),
            HI(),
            o?.preloadingStrategy ? jI(o.preloadingStrategy).ɵproviders : [],
            o?.initialNavigation ? WI(o) : [],
            o?.bindToComponentInputs ? $I().ɵproviders : [],
            o?.enableViewTransitions ? UI().ɵproviders : [],
            ZI(),
          ],
        }
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: Rr, multi: !0, useValue: n }],
        }
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(I(bh, 8))
    }),
      (e.ɵmod = Dt({ type: e })),
      (e.ɵinj = yt({}))
    let t = e
    return t
  })()
function HI() {
  return {
    provide: rp,
    useFactory: () => {
      let t = p(sh),
        e = p(V),
        r = p(jr),
        n = p(gc),
        o = p(Pr)
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new kI(o, n, t, e, r)
      )
    },
  }
}
function GI() {
  return { provide: ut, useClass: rh }
}
function zI() {
  return { provide: ut, useClass: wu }
}
function qI(t) {
  return "guarded"
}
function WI(t) {
  return [
    t.initialNavigation === "disabled" ? VI().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? LI().ɵproviders : [],
  ]
}
var Mh = new w("")
function ZI() {
  return [
    { provide: Mh, useFactory: sp },
    { provide: vi, multi: !0, useExisting: Mh },
  ]
}
var YI = t => ["/details", t],
  lp = (() => {
    let e = class e {}
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵcmp = He({
        type: e,
        selectors: [["app-housing-location"]],
        inputs: { housingLocation: "housingLocation" },
        standalone: !0,
        features: [Ge],
        decls: 8,
        vars: 9,
        consts: [
          [1, "listing"],
          [1, "listing-photo", 3, "src", "alt"],
          [1, "listing-heading"],
          [1, "listing-location"],
          [3, "routerLink"],
        ],
        template: function (o, i) {
          o & 1 &&
            (L(0, "section", 0),
            oe(1, "img", 1),
            L(2, "h2", 2),
            Y(3),
            H(),
            L(4, "p", 3),
            Y(5),
            H(),
            L(6, "a", 4),
            Y(7, "Learn More"),
            H()()),
            o & 2 &&
              (X(),
              dr("alt", "Exterior photo of ", i.housingLocation.name, ""),
              Me("src", i.housingLocation.photo, cr),
              X(2),
              fr(i.housingLocation.name),
              X(2),
              hr(
                " ",
                i.housingLocation.city,
                ", ",
                i.housingLocation.state,
                " "
              ),
              X(),
              Me("routerLink", Gf(7, YI, i.housingLocation.id)))
        },
        dependencies: [qt, Bi, Ui],
        styles: [
          '.listing[_ngcontent-%COMP%]{background:var(--accent-color);border-radius:30px;padding-bottom:30px}.listing-heading[_ngcontent-%COMP%]{color:var(--primary-color);padding:10px 20px 0}.listing-photo[_ngcontent-%COMP%]{height:250px;width:100%;object-fit:cover;border-radius:30px 30px 0 0}.listing-location[_ngcontent-%COMP%]{padding:10px 20px 20px}.listing-location[_ngcontent-%COMP%]:before{content:url(/assets/location-pin.svg) / ""}section.listing[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding-left:20px;text-decoration:none;color:var(--primary-color)}section.listing[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:after{content:"\\203a";margin-left:5px}',
        ],
      }))
    let t = e
    return t
  })()
var Hi = (() => {
  let e = class e {
    constructor() {
      ;(this.baseUrl = "https://angular.io/assets/images/tutorials/faa"),
        (this.url = "http://localhost:3000/locations")
    }
    getAllHousingLocations() {
      return Kt(this, null, function* () {
        return (yield (yield fetch(this.url)).json()) ?? []
      })
    }
    getHousingLocationById(n) {
      return Kt(this, null, function* () {
        return (yield (yield fetch(`${this.url}/${n}`)).json()) ?? {}
      })
    }
    submitApplication(n, o, i) {
      console.log(
        `Homes application received: firstName: ${n}, lastName: ${o}, email: ${i}.`
      )
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: "root" }))
  let t = e
  return t
})()
function QI(t, e) {
  if ((t & 1 && oe(0, "app-housing-location", 6), t & 2)) {
    let r = e.$implicit
    Me("housingLocation", r)
  }
}
var dp = (() => {
  let e = class e {
    constructor() {
      ;(this.housingLocationList = []),
        (this.housingService = p(Hi)),
        (this.filteredLocationList = []),
        this.housingService.getAllHousingLocations().then(n => {
          ;(this.housingLocationList = n), (this.filteredLocationList = n)
        })
    }
    filterResults(n) {
      if ((console.log({ text: n }), !n)) {
        this.filteredLocationList = this.housingLocationList
        return
      }
      this.filteredLocationList = this.housingLocationList.filter(o =>
        o?.city.toLowerCase().includes(n.toLowerCase())
      )
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵcmp = He({
      type: e,
      selectors: [["app-home"]],
      standalone: !0,
      features: [Ge],
      decls: 8,
      vars: 1,
      consts: [
        ["filter", ""],
        [3, "submit"],
        ["type", "text", "placeholder", "Filter by city"],
        ["type", "button", 1, "primary", 3, "click"],
        [1, "results"],
        [3, "housingLocation", 4, "ngFor", "ngForOf"],
        [3, "housingLocation"],
      ],
      template: function (o, i) {
        if (o & 1) {
          let s = $f()
          L(0, "section")(1, "form", 1),
            Fe("submit", function (u) {
              return Fa(s), Pa(u.preventDefault())
            }),
            oe(2, "input", 2, 0),
            L(4, "button", 3),
            Fe("click", function () {
              Fa(s)
              let u = Uf(3)
              return Pa(i.filterResults(u.value))
            }),
            Y(5, " Search "),
            H()()(),
            L(6, "section", 4),
            lu(7, QI, 1, 1, "app-housing-location", 5),
            H()
        }
        o & 2 && (X(7), Me("ngForOf", i.filteredLocationList))
      },
      dependencies: [qt, ih, lp],
      styles: [
        ".results[_ngcontent-%COMP%]{display:grid;column-gap:14px;row-gap:14px;grid-template-columns:repeat(auto-fill,minmax(400px,400px));margin-top:50px;justify-content:space-around}input[type=text][_ngcontent-%COMP%]{border:solid 1px var(--primary-color);padding:10px;border-radius:8px;margin-right:4px;display:inline-block;width:30%}button[_ngcontent-%COMP%]{padding:10px;border:solid 1px var(--primary-color);background:var(--primary-color);color:#fff;border-radius:8px}@media (min-width: 500px) and (max-width: 768px){.results[_ngcontent-%COMP%]{grid-template-columns:repeat(2,1fr)}input[type=text][_ngcontent-%COMP%]{width:70%}}@media (max-width: 499px){.results[_ngcontent-%COMP%]{grid-template-columns:1fr}}",
      ],
    }))
  let t = e
  return t
})()
var KI = () => ["/"],
  fp = (() => {
    let e = class e {
      constructor() {
        this.title = "homes"
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)()
    }),
      (e.ɵcmp = He({
        type: e,
        selectors: [["app-root"]],
        standalone: !0,
        features: [Ge],
        decls: 6,
        vars: 2,
        consts: [
          [3, "routerLink"],
          [1, "brand-name"],
          [
            "src",
            "/assets/logo.svg",
            "alt",
            "logo",
            "aria-hidden",
            "true",
            1,
            "brand-logo",
          ],
          [1, "content"],
        ],
        template: function (o, i) {
          o & 1 &&
            (L(0, "main")(1, "a", 0)(2, "header", 1),
            oe(3, "img", 2),
            H()(),
            L(4, "section", 3),
            oe(5, "router-outlet"),
            H()()),
            o & 2 && (X(), Me("routerLink", Hf(1, KI)))
        },
        dependencies: [Bi, lc, Ui],
        styles: [
          "[_nghost-%COMP%]{--content-padding: 10px}header[_ngcontent-%COMP%]{display:block;height:60px;padding:var(--content-padding);box-shadow:0 5px 25px var(--shadow-color)}.content[_ngcontent-%COMP%]{padding:var(--content-padding)}",
        ],
      }))
    let t = e
    return t
  })()
var Cp = (() => {
    let e = class e {
      constructor(n, o) {
        ;(this._renderer = n),
          (this._elementRef = o),
          (this.onChange = i => {}),
          (this.onTouched = () => {})
      }
      setProperty(n, o) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, o)
      }
      registerOnTouched(n) {
        this.onTouched = n
      }
      registerOnChange(n) {
        this.onChange = n
      }
      setDisabledState(n) {
        this.setProperty("disabled", n)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(k(Gt), k(It))
    }),
      (e.ɵdir = de({ type: e }))
    let t = e
    return t
  })(),
  JI = (() => {
    let e = class e extends Cp {}
    ;(e.ɵfac = (() => {
      let n
      return function (i) {
        return (n || (n = ar(e)))(i || e)
      }
    })()),
      (e.ɵdir = de({ type: e, features: [bt] }))
    let t = e
    return t
  })(),
  wp = new w("")
var XI = { provide: wp, useExisting: _n(() => Ji), multi: !0 }
function eE() {
  let t = ze() ? ze().getUserAgent() : ""
  return /android (\d+)/.test(t.toLowerCase())
}
var tE = new w(""),
  Ji = (() => {
    let e = class e extends Cp {
      constructor(n, o, i) {
        super(n, o),
          (this._compositionMode = i),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !eE())
      }
      writeValue(n) {
        let o = n ?? ""
        this.setProperty("value", o)
      }
      _handleInput(n) {
        ;(!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n)
      }
      _compositionStart() {
        this._composing = !0
      }
      _compositionEnd(n) {
        ;(this._composing = !1), this._compositionMode && this.onChange(n)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(k(Gt), k(It), k(tE, 8))
    }),
      (e.ɵdir = de({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (o, i) {
          o & 1 &&
            Fe("input", function (a) {
              return i._handleInput(a.target.value)
            })("blur", function () {
              return i.onTouched()
            })("compositionstart", function () {
              return i._compositionStart()
            })("compositionend", function (a) {
              return i._compositionEnd(a.target.value)
            })
        },
        features: [fi([XI]), bt],
      }))
    let t = e
    return t
  })()
var Ip = new w(""),
  Ep = new w("")
function bp(t) {
  return t != null
}
function Mp(t) {
  return zt(t) ? G(t) : t
}
function _p(t) {
  let e = {}
  return (
    t.forEach(r => {
      e = r != null ? g(g({}, e), r) : e
    }),
    Object.keys(e).length === 0 ? null : e
  )
}
function Sp(t, e) {
  return e.map(r => r(t))
}
function nE(t) {
  return !t.validate
}
function Ap(t) {
  return t.map(e => (nE(e) ? e : r => e.validate(r)))
}
function rE(t) {
  if (!t) return null
  let e = t.filter(bp)
  return e.length == 0
    ? null
    : function (r) {
        return _p(Sp(r, e))
      }
}
function xp(t) {
  return t != null ? rE(Ap(t)) : null
}
function oE(t) {
  if (!t) return null
  let e = t.filter(bp)
  return e.length == 0
    ? null
    : function (r) {
        let n = Sp(r, e).map(Mp)
        return gs(n).pipe(x(_p))
      }
}
function Tp(t) {
  return t != null ? oE(Ap(t)) : null
}
function hp(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e]
}
function Np(t) {
  return t._rawValidators
}
function Op(t) {
  return t._rawAsyncValidators
}
function vc(t) {
  return t ? (Array.isArray(t) ? t : [t]) : []
}
function zi(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e
}
function pp(t, e) {
  let r = vc(e)
  return (
    vc(t).forEach(o => {
      zi(r, o) || r.push(o)
    }),
    r
  )
}
function gp(t, e) {
  return vc(e).filter(r => !zi(t, r))
}
var qi = class {
    constructor() {
      ;(this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = [])
    }
    get value() {
      return this.control ? this.control.value : null
    }
    get valid() {
      return this.control ? this.control.valid : null
    }
    get invalid() {
      return this.control ? this.control.invalid : null
    }
    get pending() {
      return this.control ? this.control.pending : null
    }
    get disabled() {
      return this.control ? this.control.disabled : null
    }
    get enabled() {
      return this.control ? this.control.enabled : null
    }
    get errors() {
      return this.control ? this.control.errors : null
    }
    get pristine() {
      return this.control ? this.control.pristine : null
    }
    get dirty() {
      return this.control ? this.control.dirty : null
    }
    get touched() {
      return this.control ? this.control.touched : null
    }
    get status() {
      return this.control ? this.control.status : null
    }
    get untouched() {
      return this.control ? this.control.untouched : null
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null
    }
    get path() {
      return null
    }
    _setValidators(e) {
      ;(this._rawValidators = e || []),
        (this._composedValidatorFn = xp(this._rawValidators))
    }
    _setAsyncValidators(e) {
      ;(this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = Tp(this._rawAsyncValidators))
    }
    get validator() {
      return this._composedValidatorFn || null
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e)
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach(e => e()),
        (this._onDestroyCallbacks = [])
    }
    reset(e = void 0) {
      this.control && this.control.reset(e)
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null
    }
  },
  Un = class extends qi {
    get formDirective() {
      return null
    }
    get path() {
      return null
    }
  },
  Hr = class extends qi {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null)
    }
  },
  Wi = class {
    constructor(e) {
      this._cd = e
    }
    get isTouched() {
      return !!this._cd?.control?.touched
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched
    }
    get isPristine() {
      return !!this._cd?.control?.pristine
    }
    get isDirty() {
      return !!this._cd?.control?.dirty
    }
    get isValid() {
      return !!this._cd?.control?.valid
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid
    }
    get isPending() {
      return !!this._cd?.control?.pending
    }
    get isSubmitted() {
      return !!this._cd?.submitted
    }
  },
  iE = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  gT = U(g({}, iE), { "[class.ng-submitted]": "isSubmitted" }),
  Rp = (() => {
    let e = class e extends Wi {
      constructor(n) {
        super(n)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(k(Hr, 2))
    }),
      (e.ɵdir = de({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (o, i) {
          o & 2 &&
            di("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
              "ng-pristine",
              i.isPristine
            )("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
              "ng-invalid",
              i.isInvalid
            )("ng-pending", i.isPending)
        },
        features: [bt],
      }))
    let t = e
    return t
  })(),
  Fp = (() => {
    let e = class e extends Wi {
      constructor(n) {
        super(n)
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(k(Un, 10))
    }),
      (e.ɵdir = de({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (o, i) {
          o & 2 &&
            di("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
              "ng-pristine",
              i.isPristine
            )("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
              "ng-invalid",
              i.isInvalid
            )("ng-pending", i.isPending)("ng-submitted", i.isSubmitted)
        },
        features: [bt],
      }))
    let t = e
    return t
  })()
var Ur = "VALID",
  Gi = "INVALID",
  $n = "PENDING",
  Br = "DISABLED"
function Pp(t) {
  return (Xi(t) ? t.validators : t) || null
}
function sE(t) {
  return Array.isArray(t) ? xp(t) : t || null
}
function kp(t, e) {
  return (Xi(e) ? e.asyncValidators : t) || null
}
function aE(t) {
  return Array.isArray(t) ? Tp(t) : t || null
}
function Xi(t) {
  return t != null && !Array.isArray(t) && typeof t == "object"
}
function uE(t, e, r) {
  let n = t.controls
  if (!(e ? Object.keys(n) : n).length) throw new v(1e3, "")
  if (!n[r]) throw new v(1001, "")
}
function cE(t, e, r) {
  t._forEachChild((n, o) => {
    if (r[o] === void 0) throw new v(1002, "")
  })
}
var Zi = class {
    constructor(e, r) {
      ;(this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r)
    }
    get validator() {
      return this._composedValidatorFn
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e
    }
    get parent() {
      return this._parent
    }
    get valid() {
      return this.status === Ur
    }
    get invalid() {
      return this.status === Gi
    }
    get pending() {
      return this.status == $n
    }
    get disabled() {
      return this.status === Br
    }
    get enabled() {
      return this.status !== Br
    }
    get dirty() {
      return !this.pristine
    }
    get untouched() {
      return !this.touched
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
          ? this.parent.updateOn
          : "change"
    }
    setValidators(e) {
      this._assignValidators(e)
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e)
    }
    addValidators(e) {
      this.setValidators(pp(e, this._rawValidators))
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(pp(e, this._rawAsyncValidators))
    }
    removeValidators(e) {
      this.setValidators(gp(e, this._rawValidators))
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(gp(e, this._rawAsyncValidators))
    }
    hasValidator(e) {
      return zi(this._rawValidators, e)
    }
    hasAsyncValidator(e) {
      return zi(this._rawAsyncValidators, e)
    }
    clearValidators() {
      this.validator = null
    }
    clearAsyncValidators() {
      this.asyncValidator = null
    }
    markAsTouched(e = {}) {
      ;(this.touched = !0),
        this._parent && !e.onlySelf && this._parent.markAsTouched(e)
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild(e => e.markAllAsTouched())
    }
    markAsUntouched(e = {}) {
      ;(this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild(r => {
          r.markAsUntouched({ onlySelf: !0 })
        }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e)
    }
    markAsDirty(e = {}) {
      ;(this.pristine = !1),
        this._parent && !e.onlySelf && this._parent.markAsDirty(e)
    }
    markAsPristine(e = {}) {
      ;(this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild(r => {
          r.markAsPristine({ onlySelf: !0 })
        }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e)
    }
    markAsPending(e = {}) {
      ;(this.status = $n),
        e.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !e.onlySelf && this._parent.markAsPending(e)
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf)
      ;(this.status = Br),
        (this.errors = null),
        this._forEachChild(n => {
          n.disable(U(g({}, e), { onlySelf: !0 }))
        }),
        this._updateValue(),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors(U(g({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach(n => n(!0))
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf)
      ;(this.status = Ur),
        this._forEachChild(n => {
          n.enable(U(g({}, e), { onlySelf: !0 }))
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(U(g({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach(n => n(!1))
    }
    _updateAncestors(e) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched())
    }
    setParent(e) {
      this._parent = e
    }
    getRawValue() {
      return this.value
    }
    updateValueAndValidity(e = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === Ur || this.status === $n) &&
            this._runAsyncValidator(e.emitEvent)),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e)
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild(r => r._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent })
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Br : Ur
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null
    }
    _runAsyncValidator(e) {
      if (this.asyncValidator) {
        ;(this.status = $n), (this._hasOwnPendingAsyncValidator = !0)
        let r = Mp(this.asyncValidator(this))
        this._asyncValidationSubscription = r.subscribe(n => {
          ;(this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(n, { emitEvent: e })
        })
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1))
    }
    setErrors(e, r = {}) {
      ;(this.errors = e), this._updateControlsErrors(r.emitEvent !== !1)
    }
    get(e) {
      let r = e
      return r == null ||
        (Array.isArray(r) || (r = r.split(".")), r.length === 0)
        ? null
        : r.reduce((n, o) => n && n._find(o), this)
    }
    getError(e, r) {
      let n = r ? this.get(r) : this
      return n && n.errors ? n.errors[e] : null
    }
    hasError(e, r) {
      return !!this.getError(e, r)
    }
    get root() {
      let e = this
      for (; e._parent; ) e = e._parent
      return e
    }
    _updateControlsErrors(e) {
      ;(this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(e)
    }
    _initObservables() {
      ;(this.valueChanges = new te()), (this.statusChanges = new te())
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Br
        : this.errors
          ? Gi
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus($n)
            ? $n
            : this._anyControlsHaveStatus(Gi)
              ? Gi
              : Ur
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls(r => r.status === e)
    }
    _anyControlsDirty() {
      return this._anyControls(e => e.dirty)
    }
    _anyControlsTouched() {
      return this._anyControls(e => e.touched)
    }
    _updatePristine(e = {}) {
      ;(this.pristine = !this._anyControlsDirty()),
        this._parent && !e.onlySelf && this._parent._updatePristine(e)
    }
    _updateTouched(e = {}) {
      ;(this.touched = this._anyControlsTouched()),
        this._parent && !e.onlySelf && this._parent._updateTouched(e)
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e
    }
    _setUpdateStrategy(e) {
      Xi(e) && e.updateOn != null && (this._updateOn = e.updateOn)
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty
      return !e && !!r && !this._parent._anyControlsDirty()
    }
    _find(e) {
      return null
    }
    _assignValidators(e) {
      ;(this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = sE(this._rawValidators))
    }
    _assignAsyncValidators(e) {
      ;(this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = aE(this._rawAsyncValidators))
    }
  },
  Yi = class extends Zi {
    constructor(e, r, n) {
      super(Pp(r), kp(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        })
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r)
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange()
    }
    removeControl(e, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange()
    }
    setControl(e, r, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange()
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled
    }
    setValue(e, r = {}) {
      cE(this, !0, e),
        Object.keys(e).forEach(n => {
          uE(this, !0, n),
            this.controls[n].setValue(e[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            })
        }),
        this.updateValueAndValidity(r)
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach(n => {
          let o = this.controls[n]
          o && o.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent })
        }),
        this.updateValueAndValidity(r))
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, o) => {
        n.reset(e ? e[o] : null, { onlySelf: !0, emitEvent: r.emitEvent })
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r)
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, r, n) => ((e[n] = r.getRawValue()), e)
      )
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r
      )
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach(r => {
        let n = this.controls[r]
        n && e(n, r)
      })
    }
    _setUpControls() {
      this._forEachChild(e => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange)
      })
    }
    _updateValue() {
      this.value = this._reduceValue()
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && e(n)) return !0
      return !1
    }
    _reduceValue() {
      let e = {}
      return this._reduceChildren(
        e,
        (r, n, o) => ((n.enabled || this.disabled) && (r[o] = n.value), r)
      )
    }
    _reduceChildren(e, r) {
      let n = e
      return (
        this._forEachChild((o, i) => {
          n = r(n, o, i)
        }),
        n
      )
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1
      return Object.keys(this.controls).length > 0 || this.disabled
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null
    }
  }
var Lp = new w("CallSetDisabledState", {
    providedIn: "root",
    factory: () => yc,
  }),
  yc = "always"
function lE(t, e) {
  return [...e.path, t]
}
function mp(t, e, r = yc) {
  Dc(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    fE(t, e),
    pE(t, e),
    hE(t, e),
    dE(t, e)
}
function vp(t, e, r = !0) {
  let n = () => {}
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    Ki(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}))
}
function Qi(t, e) {
  t.forEach(r => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e)
  })
}
function dE(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = n => {
      e.valueAccessor.setDisabledState(n)
    }
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r)
      })
  }
}
function Dc(t, e) {
  let r = Np(t)
  e.validator !== null
    ? t.setValidators(hp(r, e.validator))
    : typeof r == "function" && t.setValidators([r])
  let n = Op(t)
  e.asyncValidator !== null
    ? t.setAsyncValidators(hp(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n])
  let o = () => t.updateValueAndValidity()
  Qi(e._rawValidators, o), Qi(e._rawAsyncValidators, o)
}
function Ki(t, e) {
  let r = !1
  if (t !== null) {
    if (e.validator !== null) {
      let o = Np(t)
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter(s => s !== e.validator)
        i.length !== o.length && ((r = !0), t.setValidators(i))
      }
    }
    if (e.asyncValidator !== null) {
      let o = Op(t)
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter(s => s !== e.asyncValidator)
        i.length !== o.length && ((r = !0), t.setAsyncValidators(i))
      }
    }
  }
  let n = () => {}
  return Qi(e._rawValidators, n), Qi(e._rawAsyncValidators, n), r
}
function fE(t, e) {
  e.valueAccessor.registerOnChange(r => {
    ;(t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && Vp(t, e)
  })
}
function hE(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    ;(t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && Vp(t, e),
      t.updateOn !== "submit" && t.markAsTouched()
  })
}
function Vp(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1)
}
function pE(t, e) {
  let r = (n, o) => {
    e.valueAccessor.writeValue(n), o && e.viewToModelUpdate(n)
  }
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r)
    })
}
function gE(t, e) {
  t == null, Dc(t, e)
}
function mE(t, e) {
  return Ki(t, e)
}
function vE(t, e) {
  if (!t.hasOwnProperty("model")) return !1
  let r = t.model
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue)
}
function yE(t) {
  return Object.getPrototypeOf(t.constructor) === JI
}
function DE(t, e) {
  t._syncPendingControls(),
    e.forEach(r => {
      let n = r.control
      n.updateOn === "submit" &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1))
    })
}
function CE(t, e) {
  if (!e) return null
  Array.isArray(e)
  let r, n, o
  return (
    e.forEach(i => {
      i.constructor === Ji ? (r = i) : yE(i) ? (n = i) : (o = i)
    }),
    o || n || r || null
  )
}
function wE(t, e) {
  let r = t.indexOf(e)
  r > -1 && t.splice(r, 1)
}
function yp(t, e) {
  let r = t.indexOf(e)
  r > -1 && t.splice(r, 1)
}
function Dp(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  )
}
var Gr = class extends Zi {
  constructor(e = null, r, n) {
    super(Pp(r), kp(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Xi(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (Dp(e) ? (this.defaultValue = e.value) : (this.defaultValue = e))
  }
  setValue(e, r = {}) {
    ;(this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach(n =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r)
  }
  patchValue(e, r = {}) {
    this.setValue(e, r)
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1)
  }
  _updateValue() {}
  _anyControls(e) {
    return !1
  }
  _allControlsDisabled() {
    return this.disabled
  }
  registerOnChange(e) {
    this._onChange.push(e)
  }
  _unregisterOnChange(e) {
    yp(this._onChange, e)
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e)
  }
  _unregisterOnDisabledChange(e) {
    yp(this._onDisabledChange, e)
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1
  }
  _applyFormState(e) {
    Dp(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e)
  }
}
var IE = t => t instanceof Gr
var jp = (() => {
  let e = class e {}
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵdir = de({
      type: e,
      selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
      hostAttrs: ["novalidate", ""],
    }))
  let t = e
  return t
})()
var $p = new w("")
var EE = { provide: Un, useExisting: _n(() => Cc) },
  Cc = (() => {
    let e = class e extends Un {
      constructor(n, o, i) {
        super(),
          (this.callSetDisabledState = i),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new te()),
          this._setValidators(n),
          this._setAsyncValidators(o)
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form))
      }
      ngOnDestroy() {
        this.form &&
          (Ki(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}))
      }
      get formDirective() {
        return this
      }
      get control() {
        return this.form
      }
      get path() {
        return []
      }
      addControl(n) {
        let o = this.form.get(n.path)
        return (
          mp(o, n, this.callSetDisabledState),
          o.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          o
        )
      }
      getControl(n) {
        return this.form.get(n.path)
      }
      removeControl(n) {
        vp(n.control || null, n, !1), wE(this.directives, n)
      }
      addFormGroup(n) {
        this._setUpFormContainer(n)
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n)
      }
      getFormGroup(n) {
        return this.form.get(n.path)
      }
      addFormArray(n) {
        this._setUpFormContainer(n)
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n)
      }
      getFormArray(n) {
        return this.form.get(n.path)
      }
      updateModel(n, o) {
        this.form.get(n.path).setValue(o)
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          DE(this.form, this.directives),
          this.ngSubmit.emit(n),
          n?.target?.method === "dialog"
        )
      }
      onReset() {
        this.resetForm()
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1)
      }
      _updateDomValue() {
        this.directives.forEach(n => {
          let o = n.control,
            i = this.form.get(n.path)
          o !== i &&
            (vp(o || null, n),
            IE(i) && (mp(i, n, this.callSetDisabledState), (n.control = i)))
        }),
          this.form._updateTreeValidity({ emitEvent: !1 })
      }
      _setUpFormContainer(n) {
        let o = this.form.get(n.path)
        gE(o, n), o.updateValueAndValidity({ emitEvent: !1 })
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let o = this.form.get(n.path)
          o && mE(o, n) && o.updateValueAndValidity({ emitEvent: !1 })
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {})
      }
      _updateValidators() {
        Dc(this.form, this), this._oldForm && Ki(this._oldForm, this)
      }
      _checkFormPresent() {
        this.form
      }
    }
    ;(e.ɵfac = function (o) {
      return new (o || e)(k(Ip, 10), k(Ep, 10), k(Lp, 8))
    }),
      (e.ɵdir = de({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (o, i) {
          o & 1 &&
            Fe("submit", function (a) {
              return i.onSubmit(a)
            })("reset", function () {
              return i.onReset()
            })
        },
        inputs: { form: [ne.None, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [fi([EE]), bt, Ct],
      }))
    let t = e
    return t
  })()
var bE = { provide: Hr, useExisting: _n(() => wc) },
  wc = (() => {
    let e = class e extends Hr {
      set isDisabled(n) {}
      constructor(n, o, i, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new te()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(o),
          this._setAsyncValidators(i),
          (this.valueAccessor = CE(this, s))
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          vE(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model))
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this)
      }
      viewToModelUpdate(n) {
        ;(this.viewModel = n), this.update.emit(n)
      }
      get path() {
        return lE(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        )
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0)
      }
    }
    ;(e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (o) {
        return new (o || e)(
          k(Un, 13),
          k(Ip, 10),
          k(Ep, 10),
          k(wp, 10),
          k($p, 8)
        )
      }),
      (e.ɵdir = de({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [ne.None, "formControlName", "name"],
          isDisabled: [ne.None, "disabled", "isDisabled"],
          model: [ne.None, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        features: [fi([bE]), bt, Ct],
      }))
    let t = e
    return t
  })()
var ME = (() => {
  let e = class e {}
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵmod = Dt({ type: e })),
    (e.ɵinj = yt({}))
  let t = e
  return t
})()
var Up = (() => {
  let e = class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [
          { provide: $p, useValue: n.warnOnNgModelWithFormControl ?? "always" },
          { provide: Lp, useValue: n.callSetDisabledState ?? yc },
        ],
      }
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵmod = Dt({ type: e })),
    (e.ɵinj = yt({ imports: [ME] }))
  let t = e
  return t
})()
var Bp = (() => {
  let e = class e {
    submitApplication() {
      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? "",
        this.applyForm.value.lastName ?? "",
        this.applyForm.value.email ?? ""
      )
    }
    constructor() {
      ;(this.route = p(Ze)),
        (this.housingService = p(Hi)),
        (this.applyForm = new Yi({
          firstName: new Gr(""),
          lastName: new Gr(""),
          email: new Gr(""),
        }))
      let n = parseInt(this.route.snapshot.params.id, 10)
      this.housingService.getHousingLocationById(n).then(o => {
        this.housingLocation = o
      })
    }
  }
  ;(e.ɵfac = function (o) {
    return new (o || e)()
  }),
    (e.ɵcmp = He({
      type: e,
      selectors: [["app-details"]],
      standalone: !0,
      features: [Ge],
      decls: 32,
      vars: 10,
      consts: [
        [1, "listing-photo", 3, "src", "alt"],
        [1, "listing-description"],
        [1, "listing-heading"],
        [1, "listing-location"],
        [1, "listing-features"],
        [1, "section-heading"],
        [1, "listing-apply"],
        [3, "submit", "formGroup"],
        ["for", "first-name"],
        ["id", "first-name", "type", "text", "formControlName", "firstName"],
        ["for", "last-name"],
        ["id", "last-name", "type", "text", "formControlName", "lastName"],
        ["for", "email"],
        ["id", "email", "type", "email", "formControlName", "email"],
        ["type", "submit", 1, "primary"],
      ],
      template: function (o, i) {
        o & 1 &&
          (L(0, "article"),
          oe(1, "img", 0),
          L(2, "section", 1)(3, "h2", 2),
          Y(4),
          H(),
          L(5, "p", 3),
          Y(6),
          H()(),
          L(7, "section", 4)(8, "h2", 5),
          Y(9, "About this housing location"),
          H(),
          L(10, "ul")(11, "li"),
          Y(12),
          H(),
          L(13, "li"),
          Y(14),
          H(),
          L(15, "li"),
          Y(16),
          H()()(),
          L(17, "section", 6)(18, "h2", 5),
          Y(19, "Apply now to live here"),
          H(),
          L(20, "form", 7),
          Fe("submit", function () {
            return i.submitApplication()
          }),
          L(21, "label", 8),
          Y(22, "First Name"),
          H(),
          oe(23, "input", 9),
          L(24, "label", 10),
          Y(25, "Last Name"),
          H(),
          oe(26, "input", 11),
          L(27, "label", 12),
          Y(28, "Email"),
          H(),
          oe(29, "input", 13),
          L(30, "button", 14),
          Y(31, "Apply now"),
          H()()()()),
          o & 2 &&
            (X(),
            dr(
              "alt",
              "Exterior photo of ",
              i.housingLocation == null ? null : i.housingLocation.name,
              ""
            ),
            Me(
              "src",
              i.housingLocation == null ? null : i.housingLocation.photo,
              cr
            ),
            X(3),
            fr(i.housingLocation == null ? null : i.housingLocation.name),
            X(2),
            hr(
              " ",
              i.housingLocation == null ? null : i.housingLocation.city,
              ", ",
              i.housingLocation == null ? null : i.housingLocation.state,
              " "
            ),
            X(6),
            Sn(
              "Units available: ",
              i.housingLocation == null
                ? null
                : i.housingLocation.availableUnits,
              ""
            ),
            X(2),
            Sn(
              "Does this location have wifi: ",
              i.housingLocation == null ? null : i.housingLocation.wifi,
              ""
            ),
            X(2),
            Sn(
              " Does this location have laundry: ",
              i.housingLocation == null ? null : i.housingLocation.laundry,
              " "
            ),
            X(4),
            Me("formGroup", i.applyForm))
      },
      dependencies: [qt, Up, jp, Ji, Rp, Fp, Cc, wc],
      styles: [
        '.listing-photo[_ngcontent-%COMP%]{height:600px;width:50%;object-fit:cover;border-radius:30px;float:right}.listing-heading[_ngcontent-%COMP%]{font-size:48pt;font-weight:700;margin-bottom:15px}.listing-location[_ngcontent-%COMP%]:before{content:url(/assets/location-pin.svg) / ""}.listing-location[_ngcontent-%COMP%]{font-size:24pt;margin-bottom:15px}.listing-features[_ngcontent-%COMP%] > .section-heading[_ngcontent-%COMP%]{color:var(--secondary-color);font-size:24pt;margin-bottom:15px}.listing-features[_ngcontent-%COMP%]{margin-bottom:20px}.listing-features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{font-size:14pt}li[_ngcontent-%COMP%]{list-style-type:none}.listing-apply[_ngcontent-%COMP%]   .section-heading[_ngcontent-%COMP%]{font-size:18pt;margin-bottom:15px}label[_ngcontent-%COMP%], input[_ngcontent-%COMP%]{display:block}label[_ngcontent-%COMP%]{color:var(--secondary-color);font-weight:700;text-transform:uppercase;font-size:12pt}input[_ngcontent-%COMP%]{font-size:16pt;margin-bottom:15px;padding:10px;width:400px;border-top:none;border-right:none;border-left:none;border-bottom:solid .3px}@media (max-width: 1024px){.listing-photo[_ngcontent-%COMP%]{width:100%;height:400px}}',
      ],
    }))
  let t = e
  return t
})()
var SE = [
    { path: "", component: dp, title: "Home page" },
    { path: "details/:id", component: Bp, title: "Home details" },
  ],
  Hp = SE
gh(fp, { providers: [mh(), op(Hp)] }).catch(t => console.error(t))
