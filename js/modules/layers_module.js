var LayersModule = new Class({
  Extends: Module,
  
  _module_name: 'layers',
  
  _layers: [],
  
  init: function() {
    this._container.setStyles({
      width: this.options.width,
      height: this.options.height
    });
  },
  
  on_new_layer: function(obj) {
    var small_object = Object.clone(obj);
      small_object.scale(this.options.scale);
      console.log(this.options.scale, small_object);
    
    var layer = new Layer(small_object, 'test', this.options.height, this.options.height);
    
    layer.get_container().DOMInject(this._container);
    
    this.fireEvent('newLayer', obj);
  }
  
  
});

var Layer = new Class({
  _container: null,
  
  _canvas_element: null,
  
  _canvas: null,
  
  initialize: function(object, layer_name, width, height) {
    this._container = new Element('div', {'width': width, 'height': height});
    
    this._canvas_element = new Element('canvas', {'width': width, 'height': height});
      this._canvas_element.inject(this._container);
    
    var name_element = new Element('span', {'text': layer_name});
      name_element.inject(this._container);
      
    this._container.addEvent('DOMInjected', function(){
      this._canvas = new fabric.StaticCanvas(this._canvas_element);
      this._canvas.add(object);
    }.bind(this));
  },
  
  get_container: function() {
    return this._container;
  }
});
