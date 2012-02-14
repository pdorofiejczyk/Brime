var EditorModule = new Class({
  Extends: Module,
  
  _module_name: 'editor',
  
  _canvas: null,
  
  init: function() {},
  
  _on_dom_injected: function() {
    this._canvas = new fabric.Canvas(this._container);
    this._init_observers();
  },
  
  _create_container: function() {
    return new Element('canvas', {'id': this._module_name, 'width': this.options.width, 'height': this.options.height});
  },
  
  _init_observers: function() {
    this._canvas.observe('object:modified', this._on_obj_modified.bind(this));
    this._canvas.observe('object:selected', this._on_obj_selected.bind(this));
  },
  
  _on_obj_modified: function(obj) {
    this.fireEvent('objModified', obj.memo.target);
  },
  
  _on_obj_selected: function(obj) {
    this.fireEvent('objSelected', obj.memo.target);
  },
  
  on_obj: function(obj) {
    this._canvas.add(obj);
    this._canvas.renderAll();
    
    this.fireEvent('newObject', obj);
  },
  
  on_obj_selected: function(obj) {
    this._canvas.setActiveObject(obj);
  }
});
