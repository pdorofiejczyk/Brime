var LayersModule = new Class({
  Extends: Module,
  
  _module_name: 'layers',
  
  _obj_to_layer: {},
  
  _layer_to_obj: {},
  
  _layers: [],
  
  _selected_layer: null,
  
  _layers_wrapper: null,
  
  init: function() {
    this._container.setStyles({
      width: this.options.width + 50,
      height: this.options.height + 50
    });
    
    this._layers_wrapper = new Element('div', {'id': 'layers_wrapper'});
      this._layers_wrapper.inject(this._container);
  },
  
  _step_move_layer: function(obj, direction) {
    direction = direction == 'forward' ? 'before' : 'after';
    
    var layer = this._obj_to_layer[obj];

    var layer_id = this._layers.indexOf(layer);
    var layer2_id = direction == 'before' ? layer_id+1 : layer_id-1;
    
    console.log(layer_id, layer2_id);
    
    var layer2 = this._layers[layer2_id];
    
    if(layer2 != undefined) {
      layer.get_container().inject(layer2.get_container(), direction);
      
      this._layers[layer_id] = layer2;
      this._layers[layer2_id] = layer;
      
      return true;
    }
    
    return false;
  },
  
  _oversize_check: function() {
    if (this.options.width < this.options.height) {
      var wrapper_size = this._layers_wrapper.getSize().y;
      var size = this.options.height;
    } 
    else {
      var wrapper_size = this._layers_wrapper.getSize().x;
      var size = this.options.width;
    }
    
    if(wrapper_size > size) {
      this._container.addClass('oversize');
    }
    else {
      this._container.removeClass('oversize');
    }
  },
  
  on_obj_modified: function(obj) {
    var small_object = Object.clone(obj);
      small_object.fullScale(this.options.scale);
      
    this._obj_to_layer[obj].update_obj(small_object);
  },
  
  on_obj_selected: function(obj) {
    if(this._selected_layer != null) {
      this._selected_layer.deselect();
    }
    
    this._selected_layer = this._obj_to_layer[obj];
    this._selected_layer.select();
  },
  
  on_selection_cleared: function() {
    if(this._selected_layer != null) {
      this._selected_layer.deselect();
      this._selected_layer = null;
    }
  },

  delete_layer: function(obj) {
    var layer = this._obj_to_layer[obj];
    
    if(confirm('Czy na pewno chcesz usunąć warstwę '+layer.get_name()+' ?')) {
      if(layer.get_container().dispose()) {
        this._oversize_check();
        delete this._obj_to_layer[obj];
        delete this._layer_to_obj[layer];
        this._layers.splice(this._layers.indexOf(layer), 1);
        
        this.fireEvent('delete', obj);
      }
    }
  },
  
  on_new_layer: function(obj) {
    var new_id = this._layers.length;
    
    var small_object = Object.clone(obj);
      small_object.fullScale(this.options.scale);
      console.log(this.options.scale, small_object);
    
    var layer = new Layer(small_object, 'Warstwa '+new_id, this.options.width, this.options.height);
    
    this._obj_to_layer[obj] = layer;
    this._layer_to_obj[layer] = obj;
    
    layer.get_container().addEvent('DOMInjected', this._oversize_check.bind(this));
    
    layer.get_container().DOMInject(this._layers_wrapper, 'top');
    
    layer.addEvent('layerSelected', function(obj) {
      if(this._selected_layer != null) {
        this._selected_layer.deselect();
      }
      
      this.fireEvent('layerSelected', obj);
    }.bind(this, obj));
    
    layer.addEvent('bringForward', function(obj) {
      if(this._step_move_layer(obj, 'forward')) {
        this.fireEvent('bringForward', obj);
      }
    }.bind(this, obj));
    
    layer.addEvent('sendBackwards', function(obj) {
      if(this._step_move_layer(obj, 'backward')) {
        this.fireEvent('sendBackwards', obj);
      }
    }.bind(this, obj));

    layer.addEvent('delete', function(obj) {
      if(this.delete_layer(obj)) {
        this.fireEvent('delete', obj);
      }
    }.bind(this, obj));
    
    this._layers.push(layer);
  }
  
  
});

var Layer = new Class({
  Implements: Events,
  
  _container: null,
  
  _canvas_element: null,
  
  _canvas: null,
  
  _object: null,
  
  _layer_name: '',
  
  initialize: function(object, layer_name, width, height) {
    this._object = object;
    this._object.hasControls = false;
    this._object.hasBorders = false;
    
    this._layer_name = layer_name;
  
    this._container = new Element('div', {'class': 'layer'});
    
    this._canvas_element = new Element('canvas', {'width': ((width > height) ? height : width), 'height': ((width > height) ? height : width)});
      this._canvas_element.inject(this._container);
      
    var buttons = new Element('div', {'class': 'buttons'});
      buttons.inject(this._container);
    
    this._bring_forward_button = new Element('div', {'class': 'button bring_forward_button', 'text': '^'});
      this._bring_forward_button.inject(buttons);
    this._delete_button = new Element('div', {'class': 'button delete_button', 'text': 'x'}); 
      this._delete_button.inject(buttons);
    this._send_backwards_button = new Element('div', {'class': 'button send_backwards_button', 'text': 'v'});
      this._send_backwards_button.inject(buttons);
    
    var name_element = new Element('span', {'class': 'name', 'text': this._layer_name});
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

    this._delete_button.addEvent('click', function() {
      this.fireEvent('delete');
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
  },
  
  get_name: function() {
    return this._layer_name;
  }
});
