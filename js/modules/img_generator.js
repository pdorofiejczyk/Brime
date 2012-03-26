var ImageGenerator = new Class({
  
  _canvas_el: null,
  
  _canvas: null,
  
  _width: 0,
  
  _height: 0,
  
  initialize: function(width, height) {
    this._width = width;
    this._height = height;
    
    this._canvas_el = new Element('canvas', {width: this._width, height: this._height});
    //this._canvas_el.setStyle('display', 'none');
    this._canvas_el.addEvent('DOMInjected', function(){
      this._canvas = new fabric.StaticCanvas(this._canvas_el);
    }.bind(this));
    
    this._canvas_el.DOMInject($(document.body));
  },
  
  obj_to_data_url: function(objj) {
  var obj = Object.clone(objj);
    this._canvas.clear();
    if(obj.isType('group')) {
      var objects = obj.getObjects();
      for(var i = 0; i < objects.length; i++ ) {
      
        this._canvas.add(objects[i]);console.log('tusdf', objects[i]);
      }
    }
    else {
      this._canvas.add(obj);
    }
    console.log(this._canvas.toDataURL('png'));
    return ''
  }
  
});
