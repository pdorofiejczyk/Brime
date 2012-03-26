var ToolAbstract = new Class({
  
  _icon: null,
  
  _tool_name: '',
  
  _context: null,
  
  _tool_options: {},
  
  _tool_options_container: null,
  
  initialize: function() {
    this._icon = new Element('div', {'id': this._tool_name, 'class': 'tool'});
  },
  
  inject: function(context) {
    if(context instanceof fabric.Canvas) {
      this._context = context;
      this._context.setOnMouseUp(this._on_mouse_up.bind(context));
      this._context.setOnMouseDown(this._on_mouse_down.bind(context));
      this._context.setOnMouseMove(this._on_mouse_move.bind(context));
      console.log('tu');
      this._activate();
    }
    else {
      throw new Error('Context must be instance of fabric.Canvas');
    }
  },
  
  get_icon: function() {
    return this._icon;
  },
  
  select: function() {
    this._icon.addClass('selected');
  },
  
  deselect: function() {
    this._icon.removeClass('selected');
    this._deactivate();
  },
  
  _activate: function() {
    /**
     * Nothing for default
     */
  },
  
  _deactivate: function() {
    /**
     * Nothing for default
     */
  },
  
  _on_mouse_up: function() {
    throw new Error('Method on_mouse_up is not implemented');
  },
  
  _on_mouse_down: function() {
    throw new Error('Method on_mouse_down is not implemented');
  },
  
  _on_mouse_move: function() {
    throw new Error('Method on_mouse_move is not implemented');
  },
  
  _set_up_tool_options: function() {
    this._tool_options_container = new Element('div');
  },
  
  get_tool_options: function() {
    if(!this._tool_options_container) {
      this._set_up_tool_options();
    }
    
    return this._tool_options_container;
  },
});
