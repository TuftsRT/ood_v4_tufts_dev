var i;$(document).ready(function(){i=$("#globus_endpoints").data("globusEndpoints")});function e(o){for(let t of i)if(o.startsWith(t.path))return t}function p(o){let t=e(o);if(t){let n=o.replace(t.path,t.endpoint_path);return n=n.replace("//","/"),"https://app.globus.org/file-manager?origin_id="+t.endpoint+"&origin_path="+n}}function a(o,t,n){e(o)?(t.removeClass("disabled"),n.prop("title","Open the current directory with Globus")):(t.addClass("disabled"),n.prop("title","No Globus endpoint associated with this directory"))}export{p as getGlobusLink,a as updateGlobusLink};
//# sourceMappingURL=/pun/sys/dashboard/assets/files/globus.js-1548b6d5d13849c9dc09261197ad46b371d681415481c37692f2544de2a81eff.map
//!
;
