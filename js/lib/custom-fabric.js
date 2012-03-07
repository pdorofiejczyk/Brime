fabric.Object.prototype.fullScale = function(value) {
  this.scaleX = this.scaleX * value;
  this.scaleY = this.scaleY * value;
  this.setTop(this.getTop() * value);
  this.setLeft(this.getLeft() * value);
}

fabric.Object.prototype.unique_id = null;

fabric.Object.prototype.uniqueId = function() {
  if(this.unique_id == null) {
    this.unique_id = Math.floor(Math.random() * 1000);
  }
  
  return this.unique_id;
}

var objToString = function() {
  return "#<fabric." + capitalize(this.type) + ": {id: \"" + this.uniqueId() + "\"}>";
}

fabric.Object.prototype.toString = objToString;
fabric.Group.prototype.toString = objToString;
fabric.Path.prototype.toString = objToString;


//fabric.Canvas.prototype.__onMouseDown = fabric.Canvas.prototype.__onMouseUp = fabric.Canvas.prototype.__onMouseMove = null;

fabric.Canvas.prototype.setOnMouseDown = function(func) {
  this.__onMouseDown = func;
}

fabric.Canvas.prototype.setOnMouseUp = function(func) {
  this.__onMouseUp = func;
}

fabric.Canvas.prototype.setOnMouseMove = function(func) {
  this.__onMouseMove = func;
}

fabric.Canvas.prototype.add = function(obj) {
/*console.log('add',obj);
  var group = null;
  switch(true) {
    case obj.isType('path'):
      group = this.getActiveObject();
      console.log('group', this);
      if(group) {
        group.add(obj);
        return this;
      }
      else {
        group = new fabric.Group([obj]);
      }
    break;
    
    default:
      group = new fabric.Group([obj]);
    break;
  }*/
  var activeObject = this.getActiveObject();
  if(activeObject != null) {
    var returned = this.insertAt(obj, this._objects.indexOf(activeObject)+1);
  }
  else {
    var returned = fabric.StaticCanvas.prototype.add.bind(this)(obj);
  }
  this.fire('object:created', obj);
  this.setActiveObject(obj);
  
  return returned;
}
/*
fabric.Canvas.prototype.drawBorders = function(ctx) {
      if (!this.hasBorders) return;
console.log('draw borders');
      var padding = this.padding,
          padding2 = padding * 2;

      ctx.save();

      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      ctx.strokeStyle = this.borderColor;

      var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
          scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);

      ctx.lineWidth = 1 / this.borderScaleFactor;

      ctx.scale(scaleX, scaleY);

      var w = this.getWidth(),
          h = this.getHeight();

      ctx.strokeRect(
        ~~((w / 2) - padding) + 0.5, // offset needed to make lines look sharper
        ~~((h / 2) - padding) + 0.5,
        ~~(-w - padding2),
        ~~(-h - padding2)
      );

      ctx.restore();
      return this;
    }

fabric.Image.prototype._render = function(ctx) {
      var originalImgSize = this.getOriginalSize();
      ctx.drawImage(
        this.getElement(),
       originalImgSize.width / 2,
       originalImgSize.height / 2,
        originalImgSize.width,
        originalImgSize.height
      );
    }
*/
fabric.Canvas.prototype._prepareForDrawing = function(e) {
  this._isCurrentlyDrawing = true;

  var pointer = this.getPointer(e);

  this._freeDrawingXPoints.length = this._freeDrawingYPoints.length = 0;

  this._freeDrawingXPoints.push(pointer.x);
  this._freeDrawingYPoints.push(pointer.y);

  this.contextTop.beginPath();
  this.contextTop.moveTo(pointer.x, pointer.y);
  this.contextTop.strokeStyle = this.freeDrawingColor;
  this.contextTop.lineWidth = this.freeDrawingLineWidth;
  this.contextTop.lineCap = this.contextTop.lineJoin = 'round';
}

fabric.Canvas.prototype.setActiveObjects = function(objects) {
  this.setActiveGroup(new fabric.Group(objects));
}
/*
fabric.Group.prototype.add = function(object) {
       this.objects.push(object);
       object.setActive(true);
       this._calcBounds();
       this._updateObjectsCoords();
       return this;
     }
     
fabric.Group.prototype._updateObjectsCoords = function() {}

fabric.Group.prototype._calcBounds = function() {

  min = fabric.util.array.min;
  max = fabric.util.array.max;
  var aX = [], 
  aY = [], 
  minX, minY, maxX, maxY, o, width, height, 
  i = 0,
  len = this.objects.length;

  for (; i < len; ++i) {
    o = this.objects[i];
    o.setCoords();
    for (var prop in o.oCoords) {
      aX.push(o.oCoords[prop].x);
      aY.push(o.oCoords[prop].y);
    }
  };

  minX = min(aX);
  maxX = max(aX);
  minY = min(aY);
  maxY = max(aY);
         
  width = (maxX - minX) || 0;
  height = (maxY - minY) || 0;
    
  this.width = width;
  this.height = height;
}
*/

fabric.Canvas.prototype._finalizeDrawingPath = function() {

  this.contextTop.closePath();

  this._isCurrentlyDrawing = false;

  var minX = fabric.util.array.min(this._freeDrawingXPoints),
      minY = fabric.util.array.min(this._freeDrawingYPoints),
      maxX = fabric.util.array.max(this._freeDrawingXPoints),
      maxY = fabric.util.array.max(this._freeDrawingYPoints),
      ctx = this.contextTop,
      path = [ ],
      xPoint,
      yPoint,
      xPoints = this._freeDrawingXPoints,
      yPoints = this._freeDrawingYPoints;

  path.push('M ', xPoints[0] - minX, ' ', yPoints[0] - minY, ' ');

  for (var i = 1; xPoint = xPoints[i], yPoint = yPoints[i]; i++) {
    path.push('L ', xPoint - minX, ' ', yPoint - minY, ' ');
  }


  
  // TODO (kangax): maybe remove Path creation from here, to decouple fabric.Canvas from fabric.Path,
  // and instead fire something like "drawing:completed" event with path string

  path = path.join('');

  if (path === "M 0 0 L 0 0 ") {
    // do not create 0 width/height paths, as they are rendered inconsistently across browsers
    // Firefox 4, for example, renders a dot, whereas Chrome 10 renders nothing
    return;
  }
   var activeObject = this.getActiveObject();
console.log('activeObject', activeObject);
  if(undefined !== activeObject && null !== activeObject && activeObject.isType('path') && activeObject.stroke == this.freeDrawingColor && activeObject.strokeWidth == this.freeDrawingLineWidth) {
  console.log('bf addToPath');
  var p = new fabric.Path(path);
  p.hasControls = false;
  p.set("left", minX + (maxX - minX) / 2).set("top", minY + (maxY - minY) / 2).setCoords();
    activeObject.addToPath(p);
    this.renderAll();
    this.fire('object:modified', {target: activeObject});
  }
  else { 
console.log(path);
    var p = new fabric.Path(path);
    p.hasControls = false;
    p.fill = null;
    p.stroke = this.freeDrawingColor;
    p.strokeWidth = this.freeDrawingLineWidth;
    this.add(p);
    p.set("left", minX + (maxX - minX) / 2).set("top", minY + (maxY - minY) / 2).setCoords();
    this.renderAll();
    this.fire('path:created', { path: p });
  }
}

fabric.Path.prototype._parsePath = function(path) {
  var commandLengths = {
    m: 2,
    l: 2,
    h: 1,
    v: 1,
    c: 6,
    s: 4,
    q: 4,
    t: 2,
    a: 7
  };
  if(!path) {
    path = this.path;
  }
  console.log(path);
  var result = [ ],
      currentPath,
      chunks,
      parsed;

  for (var i = 0, j, chunksParsed, len = path.length; i < len; i++) {
    currentPath = path[i];
    chunks = currentPath.slice(1).trim().replace(/(\d)-/g, '$1###-').split(/\s|,|###/);
    chunksParsed = [ currentPath.charAt(0) ];

    for (var j = 0, jlen = chunks.length; j < jlen; j++) {
      parsed = parseFloat(chunks[j]);
      if (!isNaN(parsed)) {
        chunksParsed.push(parsed);
      }
    }

    var command = chunksParsed[0].toLowerCase(),
        commandLength = commandLengths[command];
        
    if (chunksParsed.length - 1 > commandLength) {
      for (var k = 1, klen = chunksParsed.length; k < klen; k += commandLength) {
        result.push([command].concat(chunksParsed.slice(k, k + commandLength)));
      }
    }
    else {
      result.push(chunksParsed);
    }
  }
console.log(result);
  return result;
}

fabric.Path.prototype.addToPath = function(path) {
  if (!path) {
   throw Error('`path` argument is required');
  }
  console.log('top', this.oCoords.tl.x, path.oCoords.tl.x);
  var p = path.path;
var dt = path.oCoords.tl.x - this.oCoords.tl.x;
var dl = path.oCoords.tl.y - this.oCoords.tl.y;
console.log('dt ', dt, 'dl ', dl);

for(var i = 0; i < p.length; i++) {
  p[i][1]+=dt;
  p[i][2]+=dl;
}
console.log(p);
  this.path = this.path.concat(p);
  this._parseDimensions();
}

