var Module = new Class({
  Implements: [Events, Options],
  
  _container: null,
  
  _module_name: '',
  
  initialize: function(options) {
    this.setOptions(options);
    
    this._container = this._create_container();
    
    this._container.addEvent('DOMInjected', this._on_dom_injected.bind(this));
    
    this.init();
  },
  
  init: function() {},
  
  _on_dom_injected: function() {},
  
  _create_container: function() {
    return new Element('div', {'id': this._module_name});
  },
  
  get_container: function() {
    return this._container;
  }
});
