(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[0],{89:function(e,t,n){},95:function(e,t,n){},97:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(25),s=n.n(c),i=n(16),o=n(2),l=n(4),u=n.n(l),d=n(15),b=n(53),j=n(5),m="/",x=function(){var e=Object(d.a)(u.a.mark((function e(t){var n,a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(m,"api/search/game"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({game_id:t})});case 2:return n=e.sent,e.next=5,n.json();case 5:if("fail"!==(a=e.sent).result){e.next=8;break}return e.abrupt("return",{gameExists:!1,online:0});case 8:if("success"!==a.result){e.next=10;break}return e.abrupt("return",{gameExists:!0,online:a.online});case 10:return e.abrupt("return",{gameExists:!1,online:0});case 11:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),h=n(51),p=Object(h.io)("".concat("/","game"),{withCredentials:!0}),f=(n(89),n(9)),O=n(1),g=function(e){var t=e.onClick,n=e.value;return Object(O.jsx)("button",{className:"square",onClick:t,children:n})},v=function(e){var t=e.mode,n=e.gameId,r=Object(a.useState)([]),c=Object(j.a)(r,2),s=c[0],i=c[1],l=Object(a.useState)(!0),x=Object(j.a)(l,2),h=x[0],v=x[1],y=Object(a.useState)(null),N=Object(j.a)(y,2),k=N[0],C=N[1],T=Object(a.useState)(!1),S=Object(j.a)(T,2),E=S[0],I=S[1],G="CREATE"===t?"X":"O",J=Object(o.f)(),D=Object(a.useRef)(s);Object(a.useEffect)((function(){D.current=s}));var _=function(e){return Object(f.c)(e,{position:"bottom-center",hideProgressBar:!0,draggable:!1,autoClose:5e3,pauseOnHover:!1,closeOnClick:!0,transition:f.a})};Object(a.useEffect)((function(){var e=w(s);e?(e.winner&&!e.gameTied&&C("Winner : ".concat(e.winner)),e.gameTied&&!e.winner&&C("Game Tied")):C("Next Player : ".concat(h?"CREATE"===t?"You":"X":"JOIN"===t?"You":"O"))}),[s]),Object(a.useEffect)((function(){return A(),p.on("moved",R),p.on("restarted",(function(){A(),_("Game Restarted !")})),function(){p.off("moved",R)}}),[]);var R=function(e){var t=Object(b.a)(D.current);t[e.position]=e.player,i(t),v("X"===e.next);var n=w(t);n&&I(!0),(null===n||void 0===n?void 0:n.gameTied)&&_("Game Tied"),(null===n||void 0===n?void 0:n.winner)&&(n.winner===G?_("You won \ud83c\udf89\ufe0f"):_("You lost"))},A=function(){var e=Object(d.a)(u.a.mark((function e(){var t,a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return I(!1),e.next=3,fetch("".concat(m,"api/fetch/game/").concat(n));case 3:return t=e.sent,e.next=6,t.json();case 6:"success"===(a=e.sent).result?(i(a.board),v("X"===a.next),w(a.board)&&I(!0)):"fail"===a.result&&J.replace({pathname:"/"});case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Y=function(e){return Object(O.jsx)(g,{value:s[e],onClick:function(){return function(e){var a=s.slice(),r=w(s);r||s[e]?(null===r||void 0===r?void 0:r.gameTied)?_("Game Tied"):(null===r||void 0===r?void 0:r.winner)&&(r.winner===G?_("You won \ud83c\udf89\ufe0f"):_("You lost")):"CREATE"===t&&h?(a[e]="X",i(a),v(!1),p.emit("move",{player:a[e],position:e,game_id:n})):"JOIN"!==t||h||(a[e]="O",i(a),v(!0),p.emit("move",{player:a[e],position:e,game_id:n}))}(e)}})};return Object(O.jsxs)("div",{className:"flex flex-col space-y-4 items-center",children:[Object(O.jsx)("p",{className:"text-gray-500 text-sm md:text-base",children:k}),Object(O.jsxs)("div",{children:[Object(O.jsxs)("div",{className:"board-row",children:[Y(0),Y(1),Y(2)]}),Object(O.jsxs)("div",{className:"board-row",children:[Y(3),Y(4),Y(5)]}),Object(O.jsxs)("div",{className:"board-row",children:[Y(6),Y(7),Y(8)]})]}),Object(O.jsxs)("p",{children:["Playing as : ",Object(O.jsx)("b",{children:G})]}),E&&Object(O.jsx)("button",{onClick:function(){return p.emit("restartGame",{game_id:n})},children:"Restart"})]})};function w(e){for(var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],n=0;n<t.length;n++){var a=Object(j.a)(t[n],3),r=a[0],c=a[1],s=a[2];if(e[r]&&e[r]===e[c]&&e[r]===e[s])return{winner:e[r],gameTied:!1}}return!1===e.includes(null)?{winner:null,gameTied:!0}:null}var y=function(){var e,t,n=Object(a.useState)(0),r=Object(j.a)(n,2),c=r[0],s=r[1],l=Object(o.g)(),b=Object(o.f)(),m=function(e){return s(e.online.length)},h=null===(e=l.state)||void 0===e?void 0:e.gameId,f=(null===(t=l.state)||void 0===t?void 0:t.mode)||"JOIN",g=function(){var e=Object(d.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x(h.toString());case 2:e.sent||b.replace({pathname:"/"});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){void 0!==l.state&&h&&g()}),[]),Object(a.useEffect)((function(){return void 0!==l.state&&h&&p.emit("join",{game_id:h,player:"CREATE"===f?"X":"O"}),p.on("connected",m),p.on("disconnected",m),function(){p.emit("leave",{game_id:h,player:"CREATE"===f?"X":"O"}),p.off("connected")}}),[]),l.state&&h||b.replace({pathname:"/"}),Object(O.jsxs)("div",{className:"flex flex-col items-center px-4",style:{height:window.innerHeight},children:[Object(O.jsx)(i.b,{to:"/",className:"underline text-gray-500",children:"Go Home"}),Object(O.jsxs)("p",{className:"self-end md:text-lg",children:["Joined: ",c]}),Object(O.jsx)("div",{className:"flex-grow-1 h-full justify-center flex flex-col",children:Object(O.jsx)(v,{gameId:h,mode:f})}),Object(O.jsxs)("a",{target:"_blank",href:window.location.origin+"/join/"+h,className:"my-4 text-gray-500 text-sm md:text-base",rel:"noreferrer",children:["Game: ",h]})]})},N=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"An error occured";return Object(f.c)(e,{position:"bottom-center",hideProgressBar:!0,draggable:!1,autoClose:5e3,pauseOnHover:!1,closeOnClick:!0,transition:f.a,type:"error"})},k=function(){var e=Object(a.useState)(null),t=Object(j.a)(e,2),n=t[0],c=t[1],s=Object(a.useState)(!0),l=Object(j.a)(s,2),b=l[0],h=l[1],p=Object(a.useState)(null),g=Object(j.a)(p,2),v=g[0],w=g[1],y=Object(a.useState)(!1),k=Object(j.a)(y,2),C=k[0],T=k[1],S=Object(a.useState)(!1),E=Object(j.a)(S,2),I=E[0],G=E[1],J=Object(a.useState)(!1),D=Object(j.a)(J,2),_=D[0],R=D[1],A=Object(a.useState)(!1),Y=Object(j.a)(A,2),P=Y[0],X=Y[1],H=Object(o.f)(),B=function(){var e=Object(d.a)(u.a.mark((function e(){var t,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return G(!1),R(!0),e.prev=2,e.next=5,fetch("".concat(m,"api/create/game"));case 5:return t=e.sent,e.next=8,t.json();case 8:"success"===(n=e.sent).result&&(c(n.game_id),R(!1)),e.next=17;break;case 12:e.prev=12,e.t0=e.catch(2),console.error(e.t0),R(!1),N();case 17:case"end":return e.stop()}}),e,null,[[2,12]])})));return function(){return e.apply(this,arguments)}}(),F=function(){var e=Object(d.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(v){e.next=2;break}return e.abrupt("return",null);case 2:return e.prev=2,X(!0),e.next=6,x(v);case 6:(t=e.sent)?(h(!0),X(!1),2!==t.online?H.push({pathname:"/game",state:{gameId:v,mode:"JOIN"}}):T(!0)):(T(!1),h(!1),X(!1)),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(2),console.error(e.t0),N(),X(!1);case 15:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(){return e.apply(this,arguments)}}();return Object(O.jsxs)("div",{className:"flex flex-col w-screen  items-center justify-center px-4",style:{height:window.innerHeight},children:[Object(O.jsx)("nav",{className:"stroke navbar navbar-expand-lg navbar-light fixed-top",children:Object(O.jsxs)("div",{className:"container",children:[Object(O.jsx)(i.b,{className:"navbar-brand",to:"/login",children:"Jogo do Galo"}),Object(O.jsxs)("div",{className:"collapse navbar-collapse",id:"navbarTogglerDemo02",children:[Object(O.jsx)("ul",{className:"navbar-nav ml-auto"}),Object(O.jsx)("ul",{className:"navbar-nav",children:Object(O.jsxs)(r.a.Fragment,{children:[Object(O.jsx)(i.c,{className:"nav-link",to:"/login",children:"Login"}),Object(O.jsx)(i.c,{className:"nav-link",to:"/registo",children:"Sign up"})]})})]})]})}),Object(O.jsxs)("div",{className:"flex flex-col space-y-4 h-full items-center justify-center",children:[Object(O.jsxs)("span",{className:"flex",children:[Object(O.jsx)("p",{className:"text-4xl font-bold mt-2",children:"Tic-Tac-Toe"}),Object(O.jsx)("p",{className:"font-light text-xl ",children:"Online"})]}),Object(O.jsx)("h3",{className:"text-xl text-center pt-4",children:"Get Started"}),Object(O.jsxs)("div",{className:"flex space-x-4 flex-wrap",children:[Object(O.jsx)("button",{className:"border border-black bg-transparent text-black hover:bg-black hover:text-white px-4 py-3 transition",type:"submit",onClick:function(){return H.push({pathname:"/computer"})},children:"vs. Computer"}),Object(O.jsx)("button",{className:"bg-black text-white px-4 py-3 hover:bg-white hover:text-black border border-black transition",onClick:B,children:_?"Creating...":"Create a new game"}),Object(O.jsx)("button",{onClick:function(){return G(!I)},className:"border border-black bg-transparent text-black hover:bg-black hover:text-white px-4 py-3 transition",children:P?"Joining...":"Join a game"})]}),n&&Object(O.jsxs)("div",{className:"flex items-center flex-col text-center py-4 px-4",children:[Object(O.jsxs)("h4",{className:"text-lg font-semibold",children:["Game Created.",Object(O.jsx)("br",{}),"Game ID : ",n]}),Object(O.jsx)("p",{className:"text-sm md:text-base",children:"Ask the other player to enter this ID while Joining the game. Or use the link below (Tap to copy) :"}),Object(O.jsx)("button",{onClick:function(){return function(e){var t;null===(t=navigator.clipboard)||void 0===t||t.writeText(e),Object(f.c)("Copied",{position:"bottom-center",hideProgressBar:!0,draggable:!1,autoClose:5e3,pauseOnHover:!1,closeOnClick:!0,transition:f.a,bodyClassName:"flex items-center flex-row  text-black rounded-lg"})}(window.location+"join/"+n)},className:"my-4 text-gray-700",children:window.location+"join/"+n}),void 0!==navigator.share&&Object(O.jsx)("button",{className:"text-lg font-medium ",onClick:function(){return function(e){if(navigator.share)try{navigator.share({title:"Tic Tac Toe Online",text:"You're invited to play Tic Tac Toe Online",url:e})}catch(t){console.error(t)}else console.error("Sharing not supported")}(window.location+"join/"+n)},children:"Share"}),Object(O.jsx)("button",{className:"bg-black text-white transition hover:bg-white hover:text-black  w-full md:w-64 py-3 my-4 border border-black",onClick:function(){return H.push({pathname:"/game",state:{gameId:n,mode:"CREATE"}})},children:"Start Game"})]}),I&&Object(O.jsxs)("div",{className:"",children:[Object(O.jsxs)("div",{className:"flex flex-row space-x-4 justify-center",children:[Object(O.jsx)("input",{type:"text",name:"gameID",id:"gameID",className:"bg-gray-100 px-4 py-3 rounded-md w-48",placeholder:"Game ID",onChange:function(e){w(e.target.value)}}),Object(O.jsx)("button",{className:"text-white bg-black py-3 px-6",onClick:F,children:"Join"})]}),Object(O.jsxs)("div",{children:[C&&Object(O.jsx)("h3",{className:"my-4 text-red-700",children:"Both players have already joined."}),!b&&Object(O.jsx)("h3",{className:"my-4 text-red-700",children:"Game doesn't exist. Create one to start playing."})]})]})]}),Object(O.jsxs)("div",{className:" mb-4 text-center flex flex-col text-sm md:text-base",children:[Object(O.jsx)("a",{href:"https://github.com/NiketanG/tic-tac-toe-online",target:"_blank",rel:"noreferrer",className:"underline text-gray-600",children:"Learn More"}),Object(O.jsxs)("p",{children:["Designed and Developed by"," ",Object(O.jsx)("a",{href:"http://bit.ly/nikketan",children:"Niketan Gulekar"})," \xa9",(new Date).getFullYear()]})]})]})},C=function(){var e=Object(o.h)(),t=Object(o.f)(),n=function(){var n=Object(d.a)(u.a.mark((function n(){var a,r;return u.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,fetch("".concat(m,"api/search/game"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({game_id:e.gameId})});case 2:return a=n.sent,n.next=5,a.json();case 5:"fail"===(r=n.sent).result&&(N("Game does'nt exist"),t.replace({pathname:"/"})),"success"===r.result&&t.replace({pathname:"/game",state:{gameId:e.gameId,mode:"JOIN"}});case 8:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return Object(a.useEffect)((function(){n()}),[]),Object(O.jsxs)("div",{className:"flex flex-col items-center justify-center h-screen ",children:[Object(O.jsx)("p",{className:"text-2xl md:text-4xl my-2",children:"Joining Game"}),Object(O.jsxs)("p",{className:"my-8",children:["Game ID: ",e.gameId]})]})},T=(n(95),n(96),function(){return Object(O.jsxs)(i.a,{children:[Object(O.jsxs)(o.c,{children:[Object(O.jsx)(o.a,{exact:!0,path:"/",component:k}),Object(O.jsx)(o.a,{path:"/game",component:y}),Object(O.jsx)(o.a,{path:"/join/:gameId",component:C})]}),Object(O.jsx)(f.b,{limit:3})]})});s.a.render(Object(O.jsx)(r.a.StrictMode,{children:Object(O.jsx)(T,{})}),document.getElementById("root"))}},[[97,1,2]]]);
//# sourceMappingURL=main.61e5de63.chunk.js.map