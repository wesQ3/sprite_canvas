var pix = ['simonbelmont.png','tails.png','knives.png','scott.png'];
var current = 0;
function draw(pic) {
   var canvas = document.getElementById('canvas');
   var ctx = canvas.getContext('2d'); 
   var img = new Image();
   img.src = pic;
   img.onload = function() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      var bits = analyze(ctx, img);
      results(bits.distinct, bits.vals, bits.colors);
   }
}
function analyze(ctx, img) {
   var canvas = ctx.getImageData(0,0, img.width,img.height);
   var data = canvas.data;
   //console.log(canvas.width * canvas.height);
   colors = {}, distinct = 0, vals = [];
   for(var i = 0; i < data.length; i+=4) {
      var r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
      if (colors[r] == null) { colors[r] = {}; }
      if (colors[r][g] == null) { colors[r][g] = {}; }
      if (colors[r][g][b] == null) { colors[r][g][b] = {}; }
      if (colors[r][g][b][a] == null) { 
         // first time we've seen it
         if (r==data[0] && g==data[1] && b==data[2] && a==data[3]) 
            continue; // skip the origin color, its the bg
         distinct++;
         vals.push([r,g,b,a]);
         colors[r][g][b][a] = 0;
      }
      colors[r][g][b][a]++;
   }
   //console.log(colors, distinct, vals);
   return { colors: colors, distinct: distinct, vals: vals };
}
function results(distinct, vals, colors) {
   var ctx = document.getElementById('canvas2').getContext('2d');
   var w = ctx.canvas.width, h = ctx.canvas.height;
   ctx.clearRect(0,0,w,h);
   var divs = distinct % 2 ? distinct + 1 : distinct;
   divs = 4;
   var x = 0;
   for (var i=0;i<4;i++) {
      for (var j=0;j<4;j++) {
         var c = vals[x++] || [0,0,0,0];
         //console.log(i,j,c);
         ctx.fillStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+','+c[3]+')';
         ctx.fillRect(i*w/divs, j*h/divs, w/divs, h/divs);
      }
   }
   addResult('Colors: '+distinct);
   var totes = 0;
   for (r in colors) {
      for (g in colors[r]) {
         for (b in colors[r][g]) {
            for (a in colors[r][g][b]) {
               totes += colors[r][g][b][a];
               //addResult('Bead color '
            }
         }
      }
   }
   addResult('pixels: '+totes);
}
function addResult (text) {
   var s = document.createElement('span');
   s.innerHTML = text;
   document.getElementById('result').appendChild(s);
}
function doIt() {
   document.getElementById('result').innerHTML='';
   var show = current++ % pix.length;
   console.log(show);
   draw(pix[show]);
}
