var EditorModule = new Class({
  Extends: Module,
  
  _module_name: 'editor',
  
  _canvas: null,
  
  _objects: null,
  
  _tool: null,
  
  init: function() {},
  
  _on_dom_injected: function() {
    this._canvas = new fabric.Canvas(this._container);
    this._objects = this._canvas.getObjects();
    this._init_observers();
  },
  
  _create_container: function() {
    return new Element('canvas', {'id': this._module_name, 'width': this.options.width, 'height': this.options.height});
  },
  
  _init_observers: function() {
    this._canvas.observe('object:modified', this._on_obj_modified.bind(this));
    this._canvas.observe('object:selected', this._on_obj_selected.bind(this));
    this._canvas.observe('selection:cleared', this._on_selection_cleared.bind(this));
  },
  
  _on_obj_modified: function(obj) {
    console.log( obj.memo.target);
    this.fireEvent('objModified', obj.memo.target);
  },
  
  _on_obj_selected: function(obj) {
    this.fireEvent('objSelected', obj.memo.target);
  },
  
  _on_selection_cleared: function() {
    this.fireEvent('selectionCleared');
  },
  
  on_obj: function(obj) {
    this._canvas.add(obj);
    this._canvas.renderAll();
    
    this.fireEvent('newObject', obj);
  },
  
  on_obj_selected: function(obj) {
    this._canvas.setActiveObject(obj);
  },
  
  on_obj_bring_forward: function(obj) {
    var id = this._objects.indexOf(obj);
    if(this._objects[id+1] != undefined) {
      this._canvas.remove(obj);
      this._canvas.insertAt(obj, id+1, false);
    }
  },
  
  on_obj_send_backwards: function(obj) {
    var id = this._objects.indexOf(obj);
    if(this._objects[id-1] != undefined) {
      this._canvas.remove(obj);
      this._canvas.insertAt(obj, id-1, false);
    }
  },
  
  on_delete: function(obj) {
    this._canvas.remove(obj);
  },
  
  on_tool_selected: function(tool) {
  console.log('on_tool_selected', tool);
    if(tool instanceof ToolAbstract) {
      this._tool = tool;
      this._tool.inject(this._canvas);
    }
    else {
      throw new Error('Tool must be instance of ToolAbstract');
    }
  }
});
