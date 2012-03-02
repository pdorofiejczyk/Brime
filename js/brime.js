Element.prototype.DOMInject = function(l, e) {
  var parent_before_inject = this.getParent('body');
  if(this.inject(l, e) && (this.getParent('body') && parent_before_inject === null)) {
    this.fireEvent('DOMInjected');
  }
}

fabric.Object.prototype.fullScale = function(value) {
  this.scaleX = this.scaleX * value;
  this.scaleY = this.scaleY * value;
  this.setTop(this.getTop() * value);
  this.setLeft(this.getLeft() * value);
}

fabric.Object.prototype.uniqueId = null;

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


fabric.Canvas.prototype.__onMouseDown = fabric.Canvas.prototype.__onMouseUp = fabric.Canvas.prototype.__onMouseMove = null;

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
  
  var returned = fabric.StaticCanvas.prototype.add.bind(this)(obj);
  this.fire('object:created', obj);
  
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
var Brime = new Class({
  Implements: Options,
  
  _editor: null,
  
  _layers: null,
  
  _buttons: null,
  
  _toolbox: null,
  
  _body: null,
  
  _img: null,
  
  initialize: function(options) {
    this.setOptions(options);
    
    this.options.layers.scale = (this.options.layers.width > this.options.layers.height ? this.options.layers.height : this.options.layers.width) / this.options.editor.height;
    
    this._body = $(document.body);
    
    this._editor = new EditorModule(this.options.editor);
    this._layers = new LayersModule(this.options.layers);
    this._buttons = new ButtonsModule();
    this._toolbox = new ToolBoxModule();
    
    this._layers.get_container().addEvent('DOMInjected', function() {
      if(this.options.img_url) {
        this.load_image(this.options.img_url);
      }
    }.bind(this));
    
    this._buttons.get_container().DOMInject(this._body);
    this._toolbox.get_container().DOMInject(this._body);
    this._editor.get_container().DOMInject(this._body);
    this._layers.get_container().DOMInject(this._body);
    
    this._init_events();
    
    this._toolbox.select_default_tool();
  },
  
  _init_events: function() {
    this._editor.addEvent('newObject', this._layers.on_new_obj.bind(this._layers));
    this._editor.addEvent('objModified', this._layers.on_obj_modified.bind(this._layers));
    this._editor.addEvent('objSelected', this._layers.on_obj_selected.bind(this._layers));
    this._editor.addEvent('selectionCleared', this._layers.on_selection_cleared.bind(this._layers));
    
    this._layers.addEvent('layerSelected', this._editor.on_obj_selected.bind(this._editor));
    this._layers.addEvent('bringForward', this._editor.on_obj_bring_forward.bind(this._editor));
    this._layers.addEvent('sendBackwards', this._editor.on_obj_send_backwards.bind(this._editor));
    this._layers.addEvent('delete', this._editor.on_delete.bind(this._editor));
    
    this._buttons.addEvent('fileLoaded', this.load_image.bind(this));
    
    this._toolbox.addEvent('toolSelected', this._editor.on_tool_selected.bind(this._editor));
  },
  
  load_image: function(url) {
    fabric.Image.fromURL(url, this._editor.on_obj.bind(this._editor));
  }
  
});
