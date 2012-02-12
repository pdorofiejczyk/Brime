var EditorModule = new Class({
  Extends: Module,
  
  _module_name: 'editor',
  
  _canvas: null,
  
  init: function() {},
  
  _on_dom_injected: function() {
    this._canvas = new fabric.Canvas(this._container, { backgroundImage: this.options.background_image });
  },
  
  _create_container: function() {
    return new Element('canvas', {'id': this._module_name, 'width': this.options.width, 'height': this.options.height});
  },
  
  on_image: function(img) {
    var oImg = img.set({ left: 250, top: 250, angle: 0 });
    this._canvas.add(oImg);
    this._canvas.renderAll();
  }
});
