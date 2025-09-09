var t="product_cli_modal",l=`${t}_spinner`,a=`${t}_header`,u=`${t}_button`,d=`<button id="${u}" class="btn-close float-end" data-bs-dismiss="modal"></button>`;jQuery(function(){$('[data-toggle="cli"]').on("click",n=>h(n)),$(`#${a}`).replaceWith(`
    <h2>
      <span>no action</pan>
      ${d}
    </h2>
  `)});function h(n){let o=$(`#${n.target.id}`);if(o===void 0||o.data()=={})return;let c=o.data("title"),i=o.data("cmd"),r=o.data("target"),s=`$ <code><strong>${i}</strong></code>
`;$(`#${a}`).replaceWith(`
    <h2>
      <span>${c}</pan>
      ${d}
    </h2>
  `);let e=new XMLHttpRequest;e.onreadystatechange=function(){this.status==200&&($(`#${t} .product-cli-body`).html(`${s}${this.responseText}`),$(`#${t} .product-cli-body`).scrollTop($(`#${t} .product-cli-body`)[0].scrollHeight))},e.onloadend=function(){$(`#${l}`).replaceWith(`
      <button class="btn-close float-end" data-bs-dismiss="modal">&times;</button>
    `),this.status!=200&&$(`#${t} .product-cli-body`).html(`${s}A fatal error has occurred`)},e.open("PATCH",r),e.setRequestHeader("X-CSRF-Token",$('meta[name="csrf-token"]').attr("content")),e.setRequestHeader("X-Requested-With","XMLHttpRequest"),e.send(),window.jQuery(`#${t}`).modal("show")}
//# sourceMappingURL=/pun/sys/dashboard/assets/products_show.js-116b63462c57e1f9c96f54a939533be3c5de54ad39e46aeefedadca8e287a220.map
//!
;
