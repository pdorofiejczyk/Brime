var LayersModule = new Class({
  Extends: Module,
  
  _module_name: 'layers',
  
  _obj_to_layer: {},
  
  _layer_to_obj: {},
  
  _layers: [],
  
  _layers_counter: 0,
  
  _selected_layer: null,
  
  _layers_wrapper: null,
  
  init: function() {
    this._container.setStyles({
      width: this.options.width,
      height: this.options.height
    });
    
    this._layers_wrapper = new Element('div', {'id': 'layers_wrapper'});
      this._layers_wrapper.inject(this._container);
  },
  
  _get_obj_layer: function(obj) {
    return this._layers[this._obj_to_layer[obj]];
  },
  
  _step_move_layer: function(obj, direction) {
    direction = direction == 'before' ? direction : 'after';
    
    var layer_id = this._obj_to_layer[obj];
    var layer2_id = direction == 'before' ? layer_id+1 : layer_id-1;
    
    var layer = this._layers[layer_id];
    var layer2 = this._layers[layer2_id];
    
    console.log(layer_id, layer, layer2_id, layer2);
    
    if(layer2 != undefined) {
      layer.get_container().inject(layer2.get_container(), direction);
      
      this._layers[layer_id] = layer2;
      this._layers[layer2_id] = layer;
      
      var obj2 = this._layer_to_obj[layer2_id];
      
      this._obj_to_layer[obj] = layer2_id;
      this._obj_to_layer[obj2] = layer_id;
      
      this._layer_to_obj[layer_id] = obj2;
      this._layer_to_obj[layer2_id] = obj;
      
      console.log(this._layers);
      
      return true;
    }
    
    return false;
  },
  
  on_obj_modified: function(obj) {
    var small_object = Object.clone(obj);
      small_object.fullScale(this.options.scale);
      
    this._get_obj_layer(obj).update_obj(small_object);
  },
  
  on_obj_selected: function(obj) {
    if(this._selected_layer != null) {
      this._selected_layer.deselect();
    }
    
    this._selected_layer = this._get_obj_layer(obj);
    this._selected_layer.select();
  },
  
  on_new_layer: function(obj) {
    this._obj_to_layer[obj] = this._layers_counter;
    this._layer_to_obj[this._layers_counter] = obj;
    var small_object = Object.clone(obj);
      small_object.fullScale(this.options.scale);
      console.log(this.options.scale, small_object);
    
    this._layers[this._layers_counter] = new Layer(small_object, 'Layer '+this._layers_counter, this.options.width, this.options.height);
    
    this._layers[this._layers_counter].get_container().DOMInject(this._layers_wrapper, 'top');
    
    this._layers[this._layers_counter].addEvent('layerSelected', function(obj) {
      if(this._selected_layer != null) {
        this._selected_layer.deselect();
      }
      
      this.fireEvent('layerSelected', obj);
    }.bind(this, obj));
    
    this._layers[this._layers_counter].addEvent('bringForward', function(obj) {
      if(this._step_move_layer(obj, 'before')) {
        this.fireEvent('bringForward', obj);
      }
    }.bind(this, obj));
    
    this._layers[this._layers_counter].addEvent('sendBackwards', function(obj) {
      if(this._step_move_layer(obj, 'after')) {
        this.fireEvent('sendBackwards', obj);
      }
    }.bind(this, obj));
    
    this._layers_counter++;
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
    
    this._canvas_element = new Element('canvas', {'width': ((width > height) ? height : width), 'height': ((width > height) ? height : width)});
      this._canvas_element.inject(this._container);
      
    var buttons = new Element('div', {'class': 'buttons'});
      buttons.inject(this._container);
    
    this._bring_forward_button = new Element('div', {'class': 'bring_forward_button', 'text': '^'});
      this._bring_forward_button.inject(buttons);
    this._send_backwards_button = new Element('div', {'class': 'send_backwards_button', 'text': 'v'});
      this._send_backwards_button.inject(buttons);
    
    var name_element = new Element('span', {'class': 'name', 'text': layer_name});
      name_element.inject(this._container);
      
    this._container.addEvent('DOMInjected', function(){
      this._canvas = new fabric.StaticCanvas(this._canvas_element);
      this._canvas.add(this._object);
    }.bind(this));
    
    this._init_events();
  },
  
  _init_events: function() {
    this._canvas_element.addEvent('click', function() {
      this.select();
      this.fireEvent('layerSelected');
    }.bind(this));
    
    this._bring_forward_button.addEvent('click', function() {
      this.fireEvent('bringForward');
    }.bind(this));
    
    this._send_backwards_button.addEvent('click', function() {
      this.fireEvent('sendBackwards');
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
