var hexToRgba = function (hex, al) {
  var hexColor = /^#/.test(hex) ? hex.slice(1) : hex,
    alp = hex === 'transparent' ? 0 : Math.ceil(al),
    r, g, b;
  hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff';
  if (hexColor.length === 3) {
    hexColor = hexColor.replace(/(\w)(\w)(\w)/gi, '$1$1$2$2$3$3');
  }
  r = hexColor.slice(0, 2);
  g = hexColor.slice(2, 4);
  b = hexColor.slice(4, 6);
  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  return {
    hex: '#' + hexColor,
    alpha: alp,
    rgba: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (alp / 100).toFixed(2) + ')'
  };
};