// import hex2RGB from '../lib/hex2RGB'
; (function (window) {
  if (!window || !window.document) throw new Error('window已被修改')


  function Round2(options) {
    var defaults = {
      wrap: 'body',
      canvas: null,
      bgColor: '#000',
      length: 500,
    }
    this.options = Object.assign({}, defaults, options)
    this.init()
  }

  Round2.prototype = {
    constructor: Round2,
    init: function () {
      this.wrap = document.querySelector(this.options.wrap)
      this.canvas = document.querySelector(this.options.canvas)
      var box = window.getComputedStyle(this.wrap)
      this.height = parseInt(box.height)
      this.width = parseInt(box.width)
      this.R = Math.min(this.width, this.height) / 2
      if (!this.canvas) this.createCanvas()
      this.canvas.id = 'canvas_round'
      this.canvas.className = 'kay-canvas canvas_round'
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx = this.canvas.getContext('2d')

      this.render()
    },
    createCanvas: function () {
      this.canvas = document.createElement('canvas')
      this.wrap.appendChild(this.canvas)
    },
    updateBg: function () {
      var ctx = this.ctx
      ctx.fillStyle = this.hex2RGB(this.options.bgColor, .1).rgba
      ctx.fillRect(0, 0, this.width, this.height)
    },
    createStars: function () {
      var len = this.options.length,
        i = 0
      this.stars = []
      for (i = 0; i < len; i++) {
        var star = {}
        star.index = i
        star.x = Math.random() * this.R * 2 - this.R 
        star.y = Math.random() * this.R * 2 - this.R 
        star.deg = Math.atan2(star.y, star.x)
        star.j = star.deg / Math.PI * 180
        star.r = Math.sqrt(star.x * star.x + star.y * star.y)
        star.v = 0
        star.a = 0
        star.alpha = 1
        this.stars.push(star);
        (function(s){
          setTimeout(function(){
            s.a = 0.01
            s.time = 1
          }, s.r * 10)
        })(star)
        
      }
    },
    compute(star) {
      star.j -= star.v
      star.deg = star.j * Math.PI / 180
      star.x = Math.sin(star.deg) * star.r + this.width / 2
      star.y = Math.cos(star.deg) * star.r + this.height / 2
      star.time = star.time ? star.time + 1 : 0
      if(star.time < 300) star.v += star.a / 5
      if(star.time >= 300 && star.time < 600) {
        star.x += Math.sin(star.time * 0.5) 
        star.y += Math.cos(star.time * 0.5)
      }
      if(star.time >= 600 && star.time < 800) {
        star.alpha = star.alpha - 0.005 > 0 ? star.alpha - 0.005 : 0
        star.x += Math.sin(star.time * 0.5) 
        star.y += Math.cos(star.time * 0.5)
      }
      if(star.time >= 850 && star.time < 1200) {
        star.alpha = star.alpha + 0.002 < 1 ? star.alpha + 0.002 : 1
        star.x += Math.sin(star.time * 0.5) 
        star.y += Math.cos(star.time * 0.5)
      }
      if(star.time >= 1200 && star.time < 2000) {
        if(star.v > -0.5) star.v -= star.a / 5
        if(star.v >= 0) {
          star.x += Math.sin(star.time * star.v) 
          star.y += Math.cos(star.time * star.v)
        }
      }
      if(star.time >= 2000) {
        star.v = 0
        star.time = 1
      }
    },
    update(){
      var ctx = this.ctx
      var i = 0
      var len = this.options.length
      if (!this.stars) this.createStars()
      for (; i < len; i++) {
        var star = this.stars[i]
        this.compute(star)
        ctx.beginPath();
        ctx.fillStyle = 'hsla('+star.j+', 100%, 70%, '+star.alpha+')'
        ctx.rect(star.x, star.y, 1, 1)
        ctx.fill()
        ctx.closePath()
      }
    },
    render() {
      var _this = this
      setInterval(function () {
        _this.updateBg()
        _this.update()
      }, 16)
    },
    hex2RGB: function (hex, al) {
      var hexColor = /^#/.test(hex) ? hex.slice(1) : hex,
        alp = hex === 'transparent' ? 0 : al,
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
        rgba: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alp.toFixed(2) + ')'
      };
    }
  }

  if (!window.KayCanvas) window.KayCanvas = {}
  window.KayCanvas.Round2 = Round2
})(this)