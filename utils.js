window.Wes = {};
Wes.iterateCanvas = function(canvasImageData, fun) {
   var data = canvasImageData.data;
   for(var i = 0; i < data.length; i+=4) {
      fun([data[i],data[i+1],data[i+2],data[i+3]], data, i);
   }
};
