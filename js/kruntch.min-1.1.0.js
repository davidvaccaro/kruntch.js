(function(e,t){function r(e){if(e==" "||e=="\r"||e=="\n")return true;return false}function s(e){if(e>="a"&&e<="z"||e>="A"&&e<="Z")return true;return false}function o(e){if(e>="0"&&e<="9")return true;return false}function u(e){if(s(e)==true||o(e)==true)return true;return false}function a(e){if(e==":"||e=="_"||e=="-"||e=="!"||u(e)==true)return true;return false}function c(e){return!isNaN(parseFloat(e))&&isFinite(e)}function h(e,t){var n={};for(m in e)n[m]=e[m];for(m in t)n[m]=t[m];return n}function p(e){return h({},e)}function d(e){var t=p(e);t.sub={};for(var n in e.sub)t.sub[n]=d(e.sub[n]);return t}function v(e,t,n,r){var i;var s=e+"";var o=-1;if(typeof t==="string"){if(r){i=t.toLowerCase();while((o=s.toLowerCase().indexOf(t,o>=0?o+n.length:0))!==-1){s=s.substring(0,o)+n+s.substring(o+t.length)}}else{return e.split(t).join(n)}}return s}function g(e,n){var r=e;var i=n.split(".");for(var s=0;s<i.length;s++){r=e;e=e[i[s]];if(typeof e=="function")e=e.call(r)}if(e==t||e==null)e="";return e}function y(e,t,n){return(new Function("return ("+e.root.conditions[n]+")")).call(t)}function b(e,t,n){return(new Function("return ("+e.root.wheres[n]+")")).call(t)}function w(e,n,r,i){var s={items:[],names:[],lookup:{},at:function(e){if(c(e)==true)return this.items[e];return this.lookup[e]}};var o=g(n,r);if(o==t)return s;var u=[];if(!(o instanceof Array)){var a=[];u=[];for(var f in o){u.push(f);a.push(o[f])}o=a}if(i!=t){var l=new Function("return ("+e.root.wheres[i]+")");var h=[];var p=[];for(var d=0;d<o.length;d++){var v=o[d];var m=u[d];v.Parent=n;if(l.call(v)==true){h.push(v);if(m!=null&&m!=null)p.push(m)}}o=h;u=p}s.items=o;s.names=u;for(var y=0;y<s.names.length;y++)s.lookup[s.names[y]]=s.items[y];return s}function E(e){var n={any:t,first:t,last:t,empty:t,nth:[]};for(var r in e.sub){var i=e.sub[r];if(i.name=="first")n.first=i;else if(i.name=="last")n.last=i;else if(i.name=="empty")n.empty=i;else if(i.name=="nth"){n.nth.push({template:i,every:t,at:t,where:t});var s=n.nth[n.nth.length-1];s.every=i.attrs["every"];s.at=i.attrs["at"];s.where=i.attrs["where"];if(s.at!=t&&s.at.indexOf(",")>-1){var o=s.at.split(",");s.at=o[0];for(var u=1;u<o.length;u++)n.nth.push({template:d(i),every:s.every,at:o[u],where:s.where})}}}n.any=p(e);n.any.sub={};for(var r in e.sub){var i=e.sub[r];if(i.name=="first"||i.name=="last"||i.name=="empty"||i.name=="nth"){n.any.text=v(n.any.text,r,"",true)}else{n.any.sub[r]=i}}if(n.first!=t||n.last!=t||n.empty!=t||n.nth.length>0)n.hasTargets=true;else n.hasTargets=false;return n}function S(e,n,r,i){if(e.details==t)e.details=E(e);var s=t;if(e.details.hasTargets==true){if(e.details.first!=t&&n==0)s=e.details.first;else if(e.details.last!=t&&n==r-1)s=e.details.last;else if(e.details.empty!=t&&n==-1&&r==0)s=e.details.empty;else{for(var o=0;o<e.details.nth.length;o++){if(e.details.nth[o].every!=t&&n%e.details.nth[o].every==0){if(e.details.nth[o].where!=t&&b(e,i,e.details.nth[o].where)==false)continue;s=e.details.nth[o].template;break}if(e.details.nth[o].at!=t&&n==e.details.nth[o].at){if(e.details.nth[o].where!=t&&b(e,i,e.details.nth[o].where)==false)continue;s=e.details.nth[o].template;break}if(e.details.nth[o].where!=t&&b(e,i,e.details.nth[o].where)==true){s=e.details.nth[o].template;break}}if(s==t)s=e.details.any}}else s=e.details.any;return s}function x(e){var n={first:t,last:t,empty:t,nth:[]};for(var r in e.sub){var i=e.sub[r];if(i.name=="first")n.first=i;else if(i.name=="last")n.last=i;else if(i.name=="empty")n.empty=i;else if(i.name=="nth"){n.nth.push({template:i,at:t});var s=n.nth[n.nth.length-1];s.at=i.attrs["at"];if(s.at!=t&&s.at.indexOf(",")>-1){var o=s.at.split(",");s.at=o[0];for(var u=1;u<o.length;u++)n.nth.push({template:d(i),at:o[u]})}}}return n}function T(e){var t=null;if(y(e,e.view,e.attrs["condition"])==true){t=p(e);t.sub={};for(var n in e.sub){var r=e.sub[n];if(r.name=="elseif"||r.name=="else"){t.text=v(t.text,n,"",true)}else{t.sub[n]=r}}}else{var s=[];for(var n in e.sub){var r=e.sub[n];if(r.name=="elseif")s.push(r);else if(r.name=="else"){s.push(r);break}}for(i=0;i<s.length;i++){if(s[i].name=="else"){t=s[i];break}if(y(e,e.view,s[i].attrs["condition"])==true){t=s[i];break}}}return t!=null?_(t,e.view):""}function N(e){var n="";var r=w(e,e.view,e.attrs["each"],e.attrs["where"]);if(r.items.length>0){for(var i=0;i<r.items.length;i++){var s=r.items[i];if(s==null||s==t)continue;var o=s.toString();var u=r.names!=t&&r.names.length>0?r.names[i]:(i+1).toString();var a=o!=t&&o!={}.toString()?o:"";var f=S(e,i,r.items.length,s);s.Parent=e.view;f.index=u;f.count=r.items.length;f.str=a;n+=_(f,s)}}else{var f=S(e,-1,0,null);if(f!=t){f.index=-1;f.count=0;f.str="";n+=_(f,e.view)}}return n}function C(e){var n="";var r=w(e,e.view,e.attrs["in"],e.attrs["where"]);if(e.details==t)e.details=x(e);if(r.items.length>0){for(var i=0;i<e.details.nth.length;i++){var s=r.at(e.details.nth[i].at);if(s==null||s==t)continue;var o=s.toString();var u=e.details.nth[i].at;var a=o!=t&&o!={}.toString()?o:"";var f=e.details.nth[i].template;s.Parent=e.view;f.index=u;f.count=r.items.length;f.str=a;n+=_(f,s)}}else{var f=e.details.empty;if(f!=t){s.Parent=e.view;f.index=-1;f.count=0;f.str="";n+=_(f,e.view)}}return n}function k(e,n,i){var s=0;var o=0;var u=i.text;var f={name:"",root:e.root,parent:e,view:t,text:"",attrs:{},sub:{}};if(u.charAt(s)=="<")s++;while(s<u.length&&r(u.charAt(s))==true)s++;while(s<u.length&&a(u.charAt(s))==true)f.name+=u.charAt(s++);f.name=f.name.toLowerCase();while(s<u.length){var l="";while(s<u.length&&r(u.charAt(s))==true)s++;if(u.charAt(s)=="/"||u.charAt(s)==">")break;while(s<u.length&&a(u.charAt(s))==true)l+=u.charAt(s++);l=l.toLowerCase();while(s<u.length&&r(u.charAt(s))==true)s++;if(u.charAt(s)=="="){s++;while(s<u.length&&r(u.charAt(s))==true)s++;if(u.charAt(s)=='"'||u.charAt(s)=="'"){var c=u.charAt(s);s++;o=u.indexOf(c,s);f.attrs[l]=u.slice(s,o).trim();s=o+1}}}if(s==u.length||u.charAt(s)==">"){while(n.HasMoreTokens()==true){i=n.NextToken();if(i.iskeyelement==true){if(i.isend==false){var h="_k1_st_"+(f.root.baseid++).toString();f.sub[h]=k(f,n,i);i={text:h,iskeyelement:false}}else break}f.text+=i.text}}return f}function L(e){var t=new f(e.pre);e.text="";e.sub={};while(t.HasMoreTokens()==true){var n=t.NextToken();if(n.iskeyelement==true){var r="_k1_st_"+(e.baseid++).toString();e.sub[r]=k(e,t,n);n={text:r,iskeyelement:false}}e.text+=n.text}return e}function A(e){e.properties=new Object;e.scripts=new Object;e.code=new Object;e.conditions=new Object;e.wheres=new Object;e.pre=e.raw;var t,n;while((t=e.pre.indexOf("{{"))>=0){var i="_k1_"+(e.baseid++).toString();n=e.pre.indexOf("}}",t);var s=e.pre.slice(t,n+2);e.pre=[e.pre.slice(0,t),i,e.pre.slice(n+2)].join("");e.scripts[i]=s.trim()}while((t=e.pre.indexOf("["))>=0){var i="_k1_"+(e.baseid++).toString();n=e.pre.indexOf("]",t);var o=e.pre.slice(t,n+1);e.pre=[e.pre.slice(0,t),i,e.pre.slice(n+1)].join("");e.properties[i]=o.trim()}while((t=e.pre.indexOf("{"))>=0){var i="_k1_"+(e.baseid++).toString();n=e.pre.indexOf("}",t);var u=e.pre.slice(t,n+1);e.pre=[e.pre.slice(0,t),i,e.pre.slice(n+1)].join("");e.code[i]=u.trim()}this.parsePropCodes=function(i){var s=new Object;t=0;while((t=e.pre.indexOf(i,t))>=0){while(r(e.pre.charAt(t))==false&&e.pre.charAt(t)!="=")t++;while(r(e.pre.charAt(t))==true)t++;if(e.pre.charAt(t)=="="){t++;while(r(e.pre.charAt(t))==true)t++;if(e.pre.charAt(t)=='"'||e.pre.charAt(t)=="'"){var o=e.pre.charAt(t);t++;n=e.pre.indexOf(o,t);var u="_k1_"+(e.baseid++).toString();var a=e.pre.slice(t,n);e.pre=[e.pre.slice(0,t),u,e.pre.slice(n)].join("");s[u]=a.trim()}}}return s};e.conditions=this.parsePropCodes("condition");e.wheres=this.parsePropCodes("where");return e}function O(e,n){var r={tio:n,baseid:(new Date).getTime(),name:"root",raw:t,pre:t,root:t,parent:t,view:t,text:"",sub:{}};r.root=r;var i=/^[a-z0-9]+$/i;if(i.test(e)==true)r.raw=n.Read(e);else r.raw=e;r=A(r);r=L(r);return r}function M(e,n,r){var i={};if(r.bindings==t){r.bindings=[];for(var s in e){if(r.text.indexOf(s)>=0){r.bindings.push(s);r.text=v(r.text,s,"",true)}}}i=h(i,n);i.Ready=t;for(var o=0;o<r.bindings.length;o++){var s=r.bindings[o];var u=e[s];u=u.substring(2,u.length-2).trim();u="return {"+u+"}";i=h(i,(new Function(u)).call(i))}return i}function _(e,t){e.view=M(e.root.scripts,t,e);var n=e.text.toString();for(var r in e.sub){var i="";var s=e.sub[r];s.view=e.view;if(s.name=="if")i=T(s);else if(s.name=="for")i=N(s);else if(s.name=="with")i=C(s);n=v(n,r,i,true)}for(var o in e.root.code){if(n.indexOf(o)>=0){var u=e.root.code[o];u=u.substring(1,u.length-1);n=v(n,o,(new Function(u)).call(e.view),true)}}for(var a in e.root.properties){if(n.indexOf(a)>=0){var f=e.root.properties[a];f=f.substring(1,f.length-1).trim();if(f=="#")n=v(n,a,e.index,true);else if(f=="##")n=v(n,a,e.count,true);else if(f=="$")n=v(n,a,e.str,true);else n=v(n,a,g(e.view,f),true)}}return n}function D(e,n,r){var i=O(e,r);var s=_(i,n);if(r!=t&&r!=null)r.Write(e,s);if(i.view.Ready!=t)i.view.Ready.call(i.view);return s}var n={"if":true,"for":true,"with":true,elseif:true,"else":true,first:true,last:true,nth:true,empty:true};var f=function(e){function o(){if(i>=s.length)return false;return true}function u(){if(this.HasMoreTokens()==false)return{text:"",iskeyelement:false};var e="";while(i<s.length){var o=false;var u=0;while(i<s.length&&s.charAt(i)!="<")e+=s.charAt(i++);u=i;u++;while(u<s.length&&r(s.charAt(u))==true)u++;if(s.charAt(u)=="/"){o=true;u++;while(u<s.length&&r(s.charAt(u))==true)u++}var f="";while(u<s.length&&a(s.charAt(u))==true&&s.charAt(u)!=">")f+=s.charAt(u++);f=f.trim();if(n[f]==true){if(e!="")return{text:e,iskeyelement:false};else{i=u;e="<"+(o==true?"/":"")+f;while(i<s.length&&s.charAt(i)!=">")e+=s.charAt(i++);e+=">";i++;return{text:e,iskeyelement:true,isend:o}}}else{i=u;if(f!=""&&f!=t&&f!=null)e+="<"+(o==true?"/":"")+f}}return{text:e,iskeyelement:false}}var i=0;var s=e;return{HasMoreTokens:o,NextToken:u}};var l=function(e){function n(e,t){var n=document.createElement("div");n.innerHTML=t;var r=[];for(var i=0;i<n.childNodes.length;i++)r.push(n.childNodes[i]);for(i=0;i<r.length;i++)e.appendChild(r[i]);return}function r(r,i){if(e==t||e==null)return;if(e.Write!=t){e.Write(i);return}n(e,i);return}function i(n){if(e!=t&&e.Read!=t){return e.Read(n)}var r=document.getElementsByTagName("*");for(var i=0;i<r.length;i++){var s=r[i].getAttribute("data-templateid");if(s!=t&&s!=null&&s==n){if(r[i].nodeName.toUpperCase()=="TEXTAREA")return r[i].value;else return r[i].innerHTML}}return""}return{Read:i,Write:r}};e.Apply=function(n,r,i,s,o){if(s==t)s=false;if(s==true){window.setTimeout(function(){e.Apply(n,r,i,false,o)},1);return""}var u=D(n,r,new l(i));if(o!=t)o(u);return u};e.Bind=function(e,t){var n=O(e,new l(document,{}));return M(n.root.scripts,t,n)}})(window.Kruntch=window.Kruntch||{})