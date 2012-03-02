var LayersModule = new Class({
  Extends: Module,
  
  _module_name: 'layers',
  
  _flat_types: [
    'path'
  ],
  
  _obj_to_layer: {},
  
  _layers: [],
  
  _layers_wrapper: null,
  
  _selected_layer: null,
  
  init: function() {   
    this._layers_wrapper = new Element('div', {'id': 'layers_wrapper'});
      this._layers_wrapper.inject(this._container);
  },
  
  _is_flat_type: function(obj) {
    for(var i = 0; i < this._flat_types.length; i++) {
    console.log('_is_flat_type');
      if(obj.isType(this._flat_types[i])) return true; 
    }
    
    return false;
  },
  
  _new_layer: function(obj) {
    
    var layer = new Layer(this.options.width, this.options.height, this.options.scale);
      layer.get_container().addEvent('DOMInjected', layer.add.bind(layer, obj));
      
    this._obj_to_layer[layer._group] = layer;
    this._layers.push(layer);
   
    layer.get_container().DOMInject(this._layers_wrapper, 'top');
    
   layer.addEvent('layerSelected', function(layer) {
    console.log('layerSelected');
      if(this._selected_layer != null) {
        this._selected_layer.deselect();
      }
      this._selected_layer = layer;
      layer.select();
      this.fireEvent('layerSelected', layer._group);
    }.bind(this, layer));
    
    layer.addEvent('bringForward', function(layer) {
      if(this._step_move_layer(obj, 'forward')) {
        this.fireEvent('bringForward', layer._group);
      }
    }.bind(this, layer));
    
    layer.addEvent('sendBackwards', function(layer) {
      if(this._step_move_layer(obj, 'backward')) {
        this.fireEvent('sendBackwards', layer._group);
      }
    }.bind(this, layer));

    layer.addEvent('delete', function(layer) {
      if(this.delete_layer(obj)) {
        this.fireEvent('delete', layer._group);
      }
    }.bind(this, layer));
  },
  
  _add_to_selected_layer: function(obj) {
    this._selected_layer.add(obj);
    this.fireEvent('layerSelected', this._selected_layer._group);
  },
  
  on_new_obj: function(obj) {
    console.log('on_new_obj', obj);
    if(this._is_flat_type(obj) && this._selected_layer !== null) {
    console.log('flat type');
      this._add_to_selected_layer(obj);
    }
    else {
    console.log('not flat');
      this._new_layer(obj);
    }
  },
  
  on_obj_modified: function(obj) {
    console.log('on_obj_modified', obj);
    this._obj_to_layer[obj].update_obj(obj);
  },
  
  on_obj_selected: function(obj) {
    console.log('on_obj_selected', obj);
  },
  
  on_selection_cleared: function() {
    console.log('on_selection_cleared');
  }
});

var Layer = new Class({
  Implements: Events,
  
  _container: null,
  
  _canvas_element: null,
  
  _canvas: null,
  
  _group: null,
  
  _scale_factor: 1,
  
  initialize: function(width, height, scale) {
  
    this._scale_factor = scale;
    
    this._group = new fabric.Group();
    
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
      
    this._container.addEvent('DOMInjected', function(){
      this._canvas = new fabric.StaticCanvas(this._canvas_element);
    }.bind(this));
    
    this._init_events();
  },
  
  _scale: function(obj, restore) {
    var small_object = Object.clone(obj);
      if(restore) this._group._restoreObjectState(small_object);
      small_object.fullScale(this._scale_factor);
    
    return small_object;
  },
  
  _init_events: function() {
    this._canvas_element.addEvent('click', function() {
      this.select();
      this.fireEvent('layerSelected', this._group);
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
  console.log('update_obj');
    this._canvas.clear();
    
    if(object.isType('group')) { 
    console.log('is group'); 
      this._group = object;
      var objects = this._group.getObjects();
      
      for(var i = 0; i < objects.length; i++) {
        var obj = this._scale(objects[i], true);
        this._add(obj);
      }
    }
    else {
      this._group = new fabric.Group(object);
      this._add(object);
    }
    
    this._canvas.renderAll();
  },
  
  _add: function(obj) {
  console.log('Layer._add ', obj);
    obj.hasControls = false;
    obj.hasBorders = false;
    this._canvas.add(obj);
  },
  
  add: function(object) {
    console.log('Layer.add ', object);
    this._group.add(object);
    this._add(this._scale(object));
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
