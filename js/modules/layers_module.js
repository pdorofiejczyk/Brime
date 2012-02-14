var LayersModule = new Class({
  Extends: Module,
  
  _module_name: 'layers',
  
  _obj_to_layer: {},
  
  _layers: [],
  
  _layers_counter: 0,
  
  _selected_layer: null,
  
  init: function() {
    this._container.setStyles({
      width: this.options.width,
      height: this.options.height
    });
  },
  
  on_obj_modified: function(obj) {
    var small_object = Object.clone(obj);
      small_object.fullScale(this.options.scale);
      
    this._layers[this._obj_to_layer[obj]].update_obj(small_object);
  },
  
  on_obj_selected: function(obj) {
    if(this._selected_layer != null) {
      this._selected_layer.deselect();
    }
    
    this._selected_layer = this._layers[this._obj_to_layer[obj]];
    this._selected_layer.select();
  },
  
  on_new_layer: function(obj) {
    this._obj_to_layer[obj] = ++this._layers_counter;
    var small_object = Object.clone(obj);
      small_object.fullScale(this.options.scale);
      console.log(this.options.scale, small_object);
    
    this._layers[this._layers_counter] = new Layer(small_object, 'Layer '+this._layers_counter, this.options.height, this.options.height);
    
    this._layers[this._layers_counter].get_container().DOMInject(this._container);
    
    this._layers[this._layers_counter].addEvent('layerSelected', function(obj) {
      if(this._selected_layer != null) {
        this._selected_layer.deselect();
      }
      
      this.fireEvent('layerSelected', obj);
    }.bind(this, obj));
  }
  
  
});

var Layer = new Class({
  Implements: Events,
  
  _container: null,
  
  _canvas_element: null,
  
  _canvas: null,
  
  _object: null,
  
  initialize: function(object, layer_name, width, height) {
    this._object = object;
    this._object.hasControls = false;
    this._object.hasBorders = false;
  
    this._container = new Element('div', {'class': 'layer'});
    this._container.setStyles({'width': width});
    
    this._canvas_element = new Element('canvas', {'width': width, 'height': height});
      this._canvas_element.inject(this._container);
    
    var name_element = new Element('span', {'text': layer_name});
      name_element.inject(this._container);
      
    this._container.addEvent('DOMInjected', function(){
      this._canvas = new fabric.StaticCanvas(this._canvas_element);
      this._canvas.add(this._object);
    }.bind(this));
    
    this._init_events();
  },
  
  _init_events: function() {
    this._container.addEvent('click', function() {
      this.select();
      this.fireEvent('layerSelected');
    }.bind(this));
  },
  
  update_obj: function(obj) {
    this._canvas.remove(this._object);
    this._object = obj;
    this._object.hasControls = false;
    this._object.hasBorders = false;
    this._canvas.add(obj);
  },
  
  get_container: function() {
    return this._container;
  },
  
  select: function() {
    this._container.addClass('selected');
  },
  
  deselect: function() {
    this._container.removeClass('selected');
  }
});
