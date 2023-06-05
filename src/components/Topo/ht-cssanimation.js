!function(H,O,b){"use strict";var g,f,k="ht",C=H[k],q=C.Default,Y=["transitionend","webkitTransitionEnd"],j=null,u=H.parseInt,z=H.isNaN,I={linear:"cubic-bezier(0.250, 0.250, 0.750, 0.750)",ease:"cubic-bezier(0.250, 0.100, 0.250, 1.000)","ease-in":"cubic-bezier(0.420, 0.000, 1.000, 1.000)","ease-out":"cubic-bezier(0.000, 0.000, 0.580, 1.000)","ease-in-out":"cubic-bezier(0.420, 0.000, 0.580, 1.000)","ease-in-quad":"cubic-bezier(0.550, 0.085, 0.680, 0.530)","ease-in-cubic":"cubic-bezier(0.550, 0.055, 0.675, 0.190)","ease-in-quart":"cubic-bezier(0.895, 0.030, 0.685, 0.220)","ease-in-quint":"cubic-bezier(0.755, 0.050, 0.855, 0.060)","ease-in-sine":"cubic-bezier(0.470, 0.000, 0.745, 0.715)","ease-in-expo":"cubic-bezier(0.950, 0.050, 0.795, 0.035)","ease-in-circ":"cubic-bezier(0.600, 0.040, 0.980, 0.335)","ease-in-back":"cubic-bezier(0.600, -0.280, 0.735, 0.045)","ease-out-quad":"cubic-bezier(0.250, 0.460, 0.450, 0.940)","ease-out-cubic":"cubic-bezier(0.215, 0.610, 0.355, 1.000)","ease-out-quart":"cubic-bezier(0.165, 0.840, 0.440, 1.000)","ease-out-quint":"cubic-bezier(0.230, 1.000, 0.320, 1.000)","ease-out-sine":"cubic-bezier(0.390, 0.575, 0.565, 1.000)","ease-out-expo":"cubic-bezier(0.190, 1.000, 0.220, 1.000)","ease-out-circ":"cubic-bezier(0.075, 0.820, 0.165, 1.000)","ease-out-back":"cubic-bezier(0.175, 0.885, 0.320, 1.275)","ease-in-out-quad":"cubic-bezier(0.455, 0.030, 0.515, 0.955)","ease-in-out-cubic":"cubic-bezier(0.645, 0.045, 0.355, 1.000)","ease-in-out-quart":"cubic-bezier(0.770, 0.000, 0.175, 1.000)","ease-in-out-quint":"cubic-bezier(0.860, 0.000, 0.070, 1.000)","ease-in-out-sine":"cubic-bezier(0.445, 0.050, 0.550, 0.950)","ease-in-out-expo":"cubic-bezier(1.000, 0.000, 0.000, 1.000)","ease-in-out-circ":"cubic-bezier(0.785, 0.135, 0.150, 0.860)","ease-in-out-back":"cubic-bezier(0.680, -0.550, 0.265, 1.550)"},S=q.animate=function(R){var w=this;return w instanceof S?("string"==typeof R&&(R=document.querySelector(R)),g===b&&(g=function(){var k={webkitTransform:"-webkit-transform",msTransform:"-ms-transform",transform:"transform"},w=document.createElement("p");for(var X in k)if(j!=w.style[X])return k[X];return j}()),f===b&&(f=function(){var R=document.body.style;return"transition"in R||"webkitTransition"in R}()),w._el=R,w.$1m={},w.$2m=[],w.$3m=[],w.duration(),w.$4m=new C.Notifier,void 0):new S(R)};q.def(S,O,{transform:function($){var d=this;return d.$3m.push($),"-webkit-transform"===g?(d.$5m(g,d.$3m.join(" ")),d.$6m(g),d.$5m("transform",d.$3m.join(" ")),d.$6m("transform")):(d.$5m(g,d.$3m.join(" ")),d.$6m(g)),d},translate:function(Z,h){Z=Z==j?0:Z,h=h==j?0:h;var x=z(Z)?Z:Z+"px",a=z(h)?h:h+"px";return this.transform("translate("+x+", "+a+")")},translateX:function(y){return y=y==j?0:y,y=z(y)?y:y+"px",this.transform("translateX("+y+")")},tx:function(x){this.translateX(x)},translateY:function(T){return T=T==j?0:T,T=z(T)?T:T+"px",this.transform("translateY("+T+")")},ty:function(q){this.translateY(q)},scale:function(Q,y){return Q=z(Q)?1:Q,y=y==j||z(y)?Q:y,this.transform("scale("+Q+", "+y+")")},scaleX:function(q){return q=z(q)?1:q,this.transform("scaleX("+q+")")},scaleY:function(h){return h=z(h)?1:h,this.transform("scaleY("+h+")")},rotate:function(E){return E=u(E)||0,this.transform("rotate("+E+"deg)")},skew:function(X,$){return X=u(X)||0,$=u($)||0,this.transform("skew("+X+"deg, "+$+"deg)")},skewX:function(Q){return Q=u(Q)||0,this.transform("skewX("+Q+"deg)")},skewY:function(C){return C=u(C)||0,this.transform("skewY("+C+"deg)")},$7m:function(d){this._el.$17m=d;for(var U=0;U<Y.length;U++)this._el.addEventListener(Y[U],d)},$8m:function(c){for(var J=0;J<Y.length;J++)this._el.removeEventListener(Y[J],c);delete this._el.$17m},$9m:function(v){function M(){F.$8m(M),v.apply(n,arguments)}var F=this,n=F._el;n.$17m&&F.$8m(n.$17m),F.$7m(M)},$5m:function(N,d){this.$1m[N]=d},$10m:function(){var B=this.$1m,I=this._el.style;for(var j in B){var n=B[j];if(j.indexOf("transition-property")>=0){var c=I.getPropertyValue(j);c&&(c.indexOf(n)>=0?n=c:n.indexOf(c)>=0||(n=c+", "+n))}I.setProperty(j,n)}},$11m:function(U,K){this.$5m("-webkit-"+U,K),this.$5m(U,K)},$12m:function(){var c=this._el.style;c.webkitTransition=c.transition=""},duration:function(v){return z(v)&&(v=200),this.$14m=v,this.$11m("transition-duration",v+"ms"),this},delay:function(Z){return Z=u(Z)||0,this.$11m("transition-delay",Z+"ms"),this},ease:function(c){return c=I[c]||c||"ease",this.$11m("transition-timing-function",c),this},$6m:function(o){this.$2m.indexOf(o)<0&&this.$2m.push(o)},set:function(R,N){return this.$5m(R,N),this.$6m(R),this},then:function(y){var N=this,J=this.$4m;if(!(y instanceof S)){var t=new S(N._el);return t.$3m=this.$3m.slice(0),N.then(t),t.$15m=N,N.$16m=t,t}return J.add(function(j){"end"===j.kind&&y.end(N.$13m)}),this},pop:function(){return this.$15m},end:function(t){var K=this,u=K.$4m;K.$11m("transition-property",K.$2m.join(", ")),K.$10m(),t&&(K.$13m=t);var M=function(p){K.$12m(),u.fire({kind:"end"}),K.$16m||K.$13m&&K.$13m.call(K,p)};0!==K.$14m&&f?K.$9m(function(s){q.callLater(function(){M(s)},j,j,0)}):M({target:K._el,mock:1})}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);