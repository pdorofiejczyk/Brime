Element.prototype.DOMInject = function(l, e) {
  var parent_before_inject = this.getParent('body');
  if(this.inject(l, e) && (this.getParent('body') && parent_before_inject === null)) {
    this.fireEvent('DOMInjected');
  }
}

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
