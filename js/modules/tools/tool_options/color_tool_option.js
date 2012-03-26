var ColorToolOption = new Class({
  Extends: ToolOptionAbstract,
  
  _option_name: 'color_tool_option',
  
  _color: [0, 0, 0],
  
  _color_roller: null,
  
  _init: function() {
    this._color_roller = new MooRainbow(this._container, {
      imgPath: 'js/lib/moorainbow/images/',
      startColor: this._color,
      onComplete: function(color) {
        this.set_value(color.rgb);
        console.log(color.rgb);
        this._on_option_changed(color.rgb);
      }.bind(this)
    });
    this._container.setStyles({
      'width': '50px',
      'height': '30px'
    });
    
    this.set_value(this._color);

  },
  
  set_value: function(value) {
    this._value = value;
    this._container.setStyle('background-color', 'rgb('+this._value[0]+', '+this._value[1]+', '+this._value[2]+')');
  }
});
