(function(global) {
  
  "use strict";
  
  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend,
      min = fabric.util.array.min,
      max = fabric.util.array.max;
  
  if (fabric.MultiObject) {
    fabric.warn('fabric.MultiObject is already defined');
    return;
  }
  
  fabric.MultiObject = fabric.util.createClass(fabric.Object, /** @scope fabric.MultiObject.prototype */ {
    
   /**
    * @property
    * @type String
    */
    type: 'multi-object',
      
   /**
    * @property
    * @type Boolean
    */
    forceFillOverwrite: false,
      
   /**
    * Constructor
    * @method initialize
    * @param {Array} objects
    * @param {Object} [options] Options object
    * @return {fabric.MultiObject} thisArg
    */
    initialize: function(objects, options) {
      
      options = options || { };
      this.objects = objects || [ ];
      this._calcBounds();
      
      this.setOptions(options);
      this.setCoords();
      this._updateObjectsCoords();
      
      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },
    
    _render: function(ctx) {
      for(var i = 0, l = this.objects.length; i < l; i++) {
        ctx.globalCompositeOperation = this.objects[i].fillRule;
        this.objects[i].render(ctx);
      }
    },
    
    add: function(object) {
    console.log('add', object);
      this._restoreObjectsState();
      this.objects.push(object);
      this._modifyBounds(object);
      this._updateObjectsCoords();
    },
    
    
     _restoreObjectState: function(object) {
        
        var groupLeft = this.get('left'),
            groupTop = this.get('top'),
            groupAngle = this.getAngle() * (Math.PI / 180),
            objectLeft = object.get('originalLeft'),
            objectTop = object.get('originalTop'),
            rotatedTop = Math.cos(groupAngle) * object.get('top') + Math.sin(groupAngle) * object.get('left'),
            rotatedLeft = -Math.sin(groupAngle) * object.get('top') + Math.cos(groupAngle) * object.get('left');
        
        object.setAngle(object.getAngle() + this.getAngle());
        
        object.set('left', groupLeft + rotatedLeft * this.get('scaleX'));
        object.set('top', groupTop + rotatedTop * this.get('scaleY'));
        
        object.set('scaleX', object.get('scaleX') * this.get('scaleX'));
        object.set('scaleY', object.get('scaleY') * this.get('scaleY'));
        
        object.setCoords();
        object.hideCorners = false;
        object.setActive(false);
        object.setCoords();
        
        return this;
     },
      
    _restoreObjectsState: function() {
      for(var i = 0, l = this.objects.length; i < l; i++) {
        this._restoreObjectState(this.objects[i]);
      };
      return this;
    },
    
    _updateObjectCoords: function(object, dx, dy) {
        var objectLeft = object.get('left'),
            objectTop = object.get('top');
        
        object.set('originalLeft', objectLeft);
        object.set('originalTop', objectTop);
        
        object.set('left', objectLeft - dx);
        object.set('top', objectTop - dy);
        
        object.setCoords();
        
        // do not display corners of objects enclosed in a group
        object.hideCorners = true;
    },
    
    _updateObjectsCoords: function() {
      var dx = this.left,
          dy = this.top;
      
      for(var i = 0, l = this.objects.length; i < l; i++) {
        this._updateObjectCoords(this.objects[i], dx, dy);
      }
    },
    
    _modifyBounds: function(object) {
      var aX = [],
          aY = [],
          minX, minY, maxX, maxY, o, width, height;
          
      object.setCoords();
      this.setCoords();
      var objects = [this, object];
      for(var i = 0, l = objects.length; i < l; i++) {
        o = objects[i];
        console.log('modifyBounds',i, o.oCoords);
        for (var prop in o.oCoords) {
          aX.push(o.oCoords[prop].x);
          aY.push(o.oCoords[prop].y);
        }
      }
      
      minX = min(aX);
      maxX = max(aX);
      minY = min(aY);
      maxY = max(aY);
      
      console.log(aX, aY);
      
      width = (maxX - minX) || 0;
      height = (maxY - minY) || 0;
      
      this.width = width;
      this.height = height;
      
            
      this.left = (minX + width / 2) || 0;
      this.top = (minY + height / 2) || 0;

    },
    
   /**
    * @private
    * @method _calcBounds
    */
    _calcBounds: function() {
      var aX = [],
          aY = [],
          minX, minY, maxX, maxY, o, width, height,
          i = 0,
          len = this.objects.length;

      for (; i < len; ++i) {
        o = this.objects[i];
        o.setCoords();
        for (var prop in o.oCoords) {
          aX.push(o.oCoords[prop].x);
          aY.push(o.oCoords[prop].y);
        }
      };
      
      minX = min(aX);
      maxX = max(aX);
      minY = min(aY);
      maxY = max(aY);
      
      width = (maxX - minX) || 0;
      height = (maxY - minY) || 0;
      
      this.width = width;
      this.height = height;
      
      this.left = (minX + width / 2) || 0;
      this.top = (minY + height / 2) || 0;
    }
  });
})(typeof exports != 'undefined' ? exports : this);
