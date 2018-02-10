const remark = require("remark");

const $s = document.getElementById("source");
$s.textContent = require("./index.md");

remark.macros.scale = function(percentage) {
  var url = this;
  return '<img src="' + url + '" style="width: ' + percentage + '" />';
};

const slideshow = remark.create();
