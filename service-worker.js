if(!self.define){let s,e={};const a=(a,i)=>(a=new URL(a+".js",i).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(i,c)=>{const f=s||("document"in self?document.currentScript.src:"")||location.href;if(e[f])return;let t={};const r=s=>a(s,f),d={module:{uri:f},exports:t,require:r};e[f]=Promise.all(i.map((s=>d[s]||r(s)))).then((s=>(c(...s),t)))}}define(["./workbox-84c915bb"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.clientsClaim(),s.precacheAndRoute([{url:"assets/404.html-C0F-AdPk.js",revision:"751f3e534e97523423ac3b2ce5fa1d75"},{url:"assets/app-D-OzhOP5.js",revision:"7968d7badb214b4414038b97e6386945"},{url:"assets/blogs.html-qaocA6EH.js",revision:"9a4a57969401c597dfb4929fd6b88281"},{url:"assets/books.html-dKhk4_Hl.js",revision:"8eb92c95da360e8fdc1951a60b6f0db1"},{url:"assets/community-examples.html-CpERaE7r.js",revision:"467ba105b43cbf7d5e6fec4a23d8abc8"},{url:"assets/community.html-CC3-Av1Z.js",revision:"f0cb61c522418d294ebd9ea94b1b5cfb"},{url:"assets/docker.html-CExcp1fA.js",revision:"df797eecbdf3b94fe13a5ffb8cd419e7"},{url:"assets/index-DTEEl-sV.js",revision:"46a193641571106d3b7b43f9bc2a2735"},{url:"assets/index-DuqNHZ2Z.js",revision:"e4256a68f8a595d1f7f59878f5945bdc"},{url:"assets/index.html-CYyUHG5K.js",revision:"1bb0dd4633c731c5a6d324c8142b6214"},{url:"assets/mention-of-nuxt.html-BmFAdEMk.js",revision:"20c6b19ec13fc858068117b6359151ac"},{url:"assets/modules.html-DqmBYwOQ.js",revision:"abab0144e0543cac54f573643eeeeac5"},{url:"assets/nuxt-v1-label-BCGWK3Tw.js",revision:"e6bba900fb088d1403d7fc794e05741f"},{url:"assets/official-examples.html-DsNHsFKm.js",revision:"5dac46f4b19f7b8a06168f4c2ff87a31"},{url:"assets/official-resources.html-KrO8y9xz.js",revision:"0cd790d6c39b8d1d29f9f164ac7d35fc"},{url:"assets/open-source-projects-using-nuxt.html-C43dfeaj.js",revision:"ab830f6d48bdc3766cd5c8c5b3bed390"},{url:"assets/projects-using-nuxt.html-DHdUNuof.js",revision:"7f84d7ab7035715d66c3c0e44c461e6d"},{url:"assets/setupDevtools-7MC2TMWH-BP7-Leof.js",revision:"9b785766a85c62995e09d05d7031d55a"},{url:"assets/showcase.html-lqSMY4MV.js",revision:"d0edff5e3787fdfd45374c27f81298cc"},{url:"assets/starter-template.html-Yceb1TXG.js",revision:"05fd9b00ba1284e2caae4a383d6f2c4a"},{url:"assets/style-BX3cNoat.css",revision:"3d37f463a88e438b7299dfcc842bec99"},{url:"assets/tools.html-Cw7aODKq.js",revision:"b11cbaec223d37cd0fc80645fbf64ab0"},{url:"assets/tutorials.html-CzyazzzX.js",revision:"73f6f38df172faae09a49b9d03615c1e"},{url:"icons/nuxt-v1-label.svg",revision:"dcf77077d730cad3615aff936bd34621"},{url:"icons/nuxt-v2-label.svg",revision:"adf60c785ea93a01b9bb545f5981f815"},{url:"icons/nuxt-v3-label.svg",revision:"3126cfd42bd79ef123332103338b096f"},{url:"icons/safari-pinned-tab.svg",revision:"88bae38ca7ddda2d0f167057fff6bc39"},{url:"index.html",revision:"df539b1bfa3e967cf5dd605cc8af2aa7"},{url:"404.html",revision:"7cf97b0480d942eaae55fab56af5eb3d"}],{}),s.cleanupOutdatedCaches()}));
