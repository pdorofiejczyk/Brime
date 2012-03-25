var ToolOptionAbstract = new Class({
  Extends: Events,
  
  _container: null,
  
  _option_name: '',
  
  initialize: function() {
    this._container = new Element('div', {'id': this._option_name, 'class': 'tool_option'});
    
    this._init();
  },
  
  _init: function() {
    throw new Error('_init() have to be implemented');
  },
  
  _on_option_changed: function(value) {
    this.fireEvent('optionChanged', value);
  },
  
  get_container: function() {
    return this._container;
  }
});
