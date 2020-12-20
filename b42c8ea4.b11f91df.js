(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{118:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),d=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=d(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=d(n),b=r,f=p["".concat(i,".").concat(b)]||p[b]||u[b]||o;return n?a.a.createElement(f,c(c({ref:t},l),{},{components:n})):a.a.createElement(f,c({ref:t},l))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var l=2;l<o;l++)i[l]=n[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},99:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return d}));var r=n(3),a=n(7),o=(n(0),n(118)),i={id:"concepts",title:"Concepts",keywords:["nuz","architecture","concepts","definition","package-manager","workflow","packages","core","cli","registry","node"]},c={unversionedId:"introduction/concepts",id:"introduction/concepts",isDocsHomePage:!1,title:"Concepts",description:"As libraries in general and package manager in particular. In order to get the most out of the process of using and contributing to the project, you need to understand the principle of operation and its basic concepts.",source:"@site/docs/introduction/Concepts.md",slug:"/introduction/concepts",permalink:"/introduction/concepts",editUrl:"https://github.com/nuz-app/nuz/edit/next/website/docs/introduction/Concepts.md",version:"current",lastUpdatedAt:1601126087,sidebar:"sidebar",previous:{title:"Motivation",permalink:"/introduction/motivation"},next:{title:"Getting started",permalink:"/introduction/getting-started"}},s=[{value:"Definitions",id:"definitions",children:[{value:"Package manager",id:"package-manager",children:[]},{value:"Registry",id:"registry",children:[]},{value:"Module",id:"module",children:[]}]},{value:"How do it works?",id:"how-do-it-works",children:[]},{value:"Main packages",id:"main-packages",children:[{value:"Core",id:"core",children:[]},{value:"CLI",id:"cli",children:[]},{value:"Registry",id:"registry-1",children:[]}]}],l={toc:s};function d(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"As libraries in general and package manager in particular. In order to get the most out of the process of using and contributing to the project, you need to understand the principle of operation and its basic concepts."),Object(o.b)("h2",{id:"definitions"},"Definitions"),Object(o.b)("h3",{id:"package-manager"},"Package manager"),Object(o.b)("p",null,"A package manager or package-management system is a collection of software tools that automates the process of installing, upgrading, configuring, and removing computer programs for a computer's operating system in a consistent manner."),Object(o.b)("p",null,"A package manager deals with packages, distributions of software and data in archive files. Packages contain metadata, such as the software's name, description of its purpose, version number, vendor, checksum (preferably a cryptographic hash function), and a list of dependencies necessary for the software to run properly. Upon installation, metadata is stored in a local package database. Package managers typically maintain a database of software dependencies and version information to prevent software mismatches and missing prerequisites. They work closely with software repositories, binary repository managers, and app stores."),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},"Source: ",Object(o.b)("a",Object(r.a)({parentName:"em"},{href:"https://en.wikipedia.org/wiki/Package_manager"}),"Package manager from Wikipedia"),".")),Object(o.b)("h4",{id:"the-difference"},"The difference"),Object(o.b)("p",null,"The difference between Nuz and the rest of the world is that Nuz is a dynamic package manager. It follows the same concepts and functions as any other manager, but there are a few different factors. Those factors can be beneficial or limited, depending on the use case to decide and consider whether static or dynamic."),Object(o.b)("p",null,"More about its differences, instead of like any other manager, when you want to use a package, you need to install it first. By calling install, it downloads the package binaries from the registry to locally. Every time you call ",Object(o.b)("strong",{parentName:"p"},"require")," or ",Object(o.b)("strong",{parentName:"p"},"import")," it in the code, it will resolve the package locally, when you need to bundle your app, you need to bundle all the libraries locally into the app bundle and when you don't use it anymore, you need to delete it locally."),Object(o.b)("p",null,"With Nuz, you don't need to perform an installation before using it, it means you don't need to download binrary locally. Only when the ",Object(o.b)("strong",{parentName:"p"},"require")," or ",Object(o.b)("strong",{parentName:"p"},"import")," command is called will Nuz download and initialize the package. Tthat process is do at runtime and you don't need to bundle it in your app, when you need to update you don't need to bundle it again."),Object(o.b)("h3",{id:"registry"},"Registry"),Object(o.b)("p",null,"..."),Object(o.b)("h4",{id:"forget-node_modules"},"Forget node_modules"),Object(o.b)("p",null,"..."),Object(o.b)("h3",{id:"module"},"Module"),Object(o.b)("p",null,"..."),Object(o.b)("h2",{id:"how-do-it-works"},"How do it works?"),Object(o.b)("p",null,"..."),Object(o.b)("h2",{id:"main-packages"},"Main packages"),Object(o.b)("p",null,"..."),Object(o.b)("h3",{id:"core"},"Core"),Object(o.b)("p",null,"..."),Object(o.b)("h3",{id:"cli"},"CLI"),Object(o.b)("p",null,"..."),Object(o.b)("h3",{id:"registry-1"},"Registry"),Object(o.b)("p",null,"..."))}d.isMDXComponent=!0}}]);