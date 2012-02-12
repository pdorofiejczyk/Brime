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
  
  _body: null,
  
  initialize: function(options) {
    this.setOptions(options);
    
    this.options.layers.scale = this.options.layers.height / this.options.editor.height;
    
    this._body = $(document.body);
    
    this._editor = new EditorModule(this.options.editor);
    this._layers = new LayersModule(this.options.layers);
    
    this._layers.get_container().addEvent('DOMInjected', function() {
      if(this.options.img_url) {
        fabric.Image.fromURL(this.options.img_url, this._layers.on_new_layer.bind(this._layers));
      }
    }.bind(this));
    
    this._editor.get_container().DOMInject(this._body);
    this._layers.get_container().DOMInject(this._body);
    
    this._init_events();
  },
  
  _init_events: function() {
    this._layers.addEvent('newLayer', this._editor.on_image.bind(this._editor));
  }
  
});
