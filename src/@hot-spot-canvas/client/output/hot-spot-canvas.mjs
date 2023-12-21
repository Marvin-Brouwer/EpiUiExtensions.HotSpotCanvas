import { For as i, Show as c } from "@builder.io/mitosis";
function o(t) {
  function n(e) {
    var a = new URL(e.hero.imageUrl, e.siteHost);
    return a.searchParams.append("w", e.hero.canvasWidth.toString()), a.searchParams.append("h", e.hero.canvasHeight.toString()), a.searchParams.append("mode", "crop"), a.toString();
  }
  return /* @__PURE__ */ React.createElement("div", { class: "hot-spot-canvas", style: { width: "".concat(t.hero.canvasWidth, "px"), height: "".concat(t.hero.canvasHeight, "px") } }, /* @__PURE__ */ React.createElement("img", { src: n(t), width: t.hero.canvasWidth, height: t.hero.canvasHeight }), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement(i, { each: t.hero.hotSpots }, function(e) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", { style: { left: "".concat(e.coordinates.x, "px"), top: "".concat(e.coordinates.y, "px") }, class: "hot-spot-canvas-hot-spot" }, /* @__PURE__ */ React.createElement(c, { when: e.content.contentType.includes("Page") }, t.pageWrapper(e)), /* @__PURE__ */ React.createElement(c, { when: e.content.contentType.includes("Product") }, t.productWrapper(e)), /* @__PURE__ */ React.createElement(c, { when: e.content.contentType.includes("Variation") }, t.variantWrapper(e))));
  })));
}
function h(t, n) {
  return r([t, n.contentUrl]);
}
function r(t, n) {
  n === void 0 && (n = "/");
  var e = new RegExp(n + "{1,}", "g");
  return ("/" + t.join(n)).replace(e, n);
}
function u(t, n) {
  var e = r(n), a = new URL(t);
  return a.pathname = e, a;
}
export {
  o as default,
  h as getContentUrl,
  r as pathJoin,
  u as urlJoin
};
