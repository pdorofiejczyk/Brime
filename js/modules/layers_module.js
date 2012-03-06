var LayersModule = new Class({
  Extends: Module,
  
  _module_name: 'layers',
  
  _obj_to_layer: {},
  
  _layer_to_obj: {},
  
  _layers: [],
  
  _selected_layer: null,
  
  _layers_wrapper: null,
  
  init: function() {   
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
    
    console.log(wrapper_size, size);
    
    if(wrapper_size > size) {
      this._container.addClass('oversize');
    }
    else {
      this._container.removeClass('oversize');
    }
  },
  
  on_obj_modified: function(obj) {
  console.log('on_obj_modified', obj);
 // var objects = obj.getObjects();
   //for(var i = 0; i < objects.length; i++) {
      this._obj_to_layer[obj].update_obj(obj);
   // }
  },
  
  on_obj_selected: function(obj) {
  var obj = obj.objects || obj;
  console.log('on_obj_selected', obj);
    if(this._selected_layer != null) {
      this._selected_layer.deselect();
    }
    console.log(obj.toString());
    this._selected_layer = this._obj_to_layer[obj[0] ? obj[0] : obj];
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
  
  on_new_obj: function(obj) {
  /*
    if(obj.isType('path')) {
      this._obj_to_layer[obj] = this._selected_layer;
      this._selected_layer.add(obj);
    }
    else {*/
    console.log(obj.uniqueId());
      this._new_layer(obj); 
    //}
  },
  
  _new_layer: function(obj) {
    var new_id = this._layers.length;
    
    var layer = new Layer(obj, 'Warstwa '+new_id, this.options.width, this.options.height, this.options.scale);
    
    this._obj_to_layer[obj] = layer;
    this._layer_to_obj[layer] = obj;
    
    layer.get_container().addEvent('DOMInjected', this._oversize_check.bind(this));
    
    if(this._selected_layer != null) {
      layer.get_container().DOMInject(this._selected_layer.get_container(), 'before');
    }
    else {
      layer.get_container().DOMInject(this._layers_wrapper, 'top');
    }
    
    layer.addEvent('layerSelected', function(group) {
    console.log('layerSelected');
      if(this._selected_layer != null) {
        this._selected_layer.deselect();
      }
      
      this.fireEvent('layerSelected', group);
    }.bind(this));
    
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
    
    if(this._selected_layer != null) {
      var i = this._layers.indexOf(this._selected_layer);
      console.log('sel layer index', i);
      this._layers.splice(i+1, 0, layer);
    }
    else {
      this._layers.push(layer);
    }
    
    console.log('layers', this._layers);
    this.on_obj_selected(obj);
  }
  
  
});

var Layer = new Class({
  Implements: Events,
  
  _container: null,
  
  _canvas_element: null,
  
  _canvas: null,
  
  _layer_name: '',
  
  _big_to_small: {},
  
  _objects: {},
  
  _scale_factor: 1,
  
  initialize: function(object, layer_name, width, height, scale) {
    
    this._scale_factor = scale;
    this._layer_name = layer_name;
    
    this._container = new Element('div', {'class': 'layer'});
    
    this._canvas_element = new Element('canvas', {'width': width, 'height': height});
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
      
    this._container.addEvent('DOMInjected', function(object){
      this._canvas = new fabric.StaticCanvas(this._canvas_element);
      this.add(object);
    }.bind(this, object));
    
    this._init_events();
  },
  
  _scale: function(obj) {
    var small_object = Object.clone(obj);
    if(obj.isType('group')) obj._restoreObjectState(small_object);
    small_object.fullScale(this._scale_factor);
    
    return small_object;
  },
  
  _init_events: function() {
    this._canvas_element.addEvent('click', function() {
      this.select();
      this.fireEvent('layerSelected', this._get_objects()[0]);
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
  
  update_obj: function(object) {
    var i = this._canvas.getObjects().indexOf(this._big_to_small[object]);
    this._canvas.remove(this._big_to_small[object]);
    
    var obj = this._scale(object);
    this._big_to_small[object] = obj;
    this._objects[object]= object;
    
    obj.hasControls = false;
    obj.hasBorders = false;
    this._canvas.insertAt(obj, i);
    this._canvas.renderAll();
  },
  
  add: function(object) {
    var obj = this._scale(object);
    obj.hasControls = false;
    obj.hasBorders = false;
    this._canvas.add(obj);
    this._big_to_small[object] = obj;
    this._objects[object]= object;
    this._canvas.renderAll();
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
  },
  
  _get_objects: function() {
    var objects = [];
    for(id in this._objects) {
      objects.push(this._objects[id]);
    }
    
    return objects;
  }
});
