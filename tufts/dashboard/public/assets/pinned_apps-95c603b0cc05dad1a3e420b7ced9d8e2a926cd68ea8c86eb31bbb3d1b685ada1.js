jQuery(function(){let a='<div class="app-launcher-spinner"><div class="spinner-border" role="status"></div></div>';function r(e){$(e.currentTarget).before(a),$(".app-launcher-container").addClass("app-launcher-disabled"),$("[data-toggle='launcher-button']").removeClass("app-launcher-hover")}function c(){$(".app-launcher-container").removeClass("app-launcher-disabled"),$("[data-toggle='launcher-button']").addClass("app-launcher-hover"),$("div.app-launcher-spinner").remove()}$("[data-toggle='launcher-button'] .launcher-click").each((e,n)=>{$(n).on("click",r)}),$(window).on("pageshow",c)});
//# sourceMappingURL=/pun/sys/dashboard/assets/pinned_apps.js-e05f5c30a4ecd2cec10d4e85dbd98cd24fa93d1fdf2f2373c782b7fcf7762915.map
//!
;
