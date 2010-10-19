var pix = ['simonbelmont.png','tails.png','knives.png','scott.png','yotsu.png'];
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
   vals.sort(hsvSort);
   return { colors: colors, distinct: distinct, vals: vals };
}
function hsvSort (a,b) {
   var hsvA = Color.rgbToHsv(a[0], a[1], a[2]), 
       hsvB = Color.rgbToHsv(b[0], b[1], b[2]);

   if (hsvA[0] > hsvB[0]) {
      return 1;
   } else if (hsvA[1] > hsvB[1]) {
      return 1;
   } else if (hsvA[2] > hsvB[2]) {
      return 1;
   } 
   if(hsvA[0] == hsvB[0] && 
      hsvA[1] == hsvB[1] && 
      hsvA[2] == hsvB[2])
      return 0;
   return -1;
}
function sumColorSort (a,b) {
   var A = a[0] + a[1] + a[2] + a[3];
   var B = b[0] + b[1] + b[2] + b[3];
   if (A > B ) return 1
   if (A < B ) return -1;
   return 0;
}
function naiveColorSort (a,b) {
   if(a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3])
      return 0;
   if (a[0] > b[0]) {
      return 1;
   } else if (a[1] > b[1]) {
      return 1;
   } else if (a[2] > b[2]) {
      return 1;
   } else if (a[3] > b[3]) {
      return -1;
   }
}
function results(distinct, vals, colors) {
   var ctx = document.getElementById('canvas2').getContext('2d');
   var w = ctx.canvas.width, h = ctx.canvas.height;
   ctx.clearRect(0,0,w,h);
   var divs = Math.ceil( Math.sqrt(distinct) );
   var x = 0;
   for (var i=0;i<divs;i++) {
      for (var j=0;j<divs;j++) {
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
   draw(pix[show]);
}
