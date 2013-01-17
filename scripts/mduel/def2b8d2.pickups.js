var definePickups = function(Animations, Images, Util, MovingObject, Debug, _) {
   console.log('pickups loaded');
   if (typeof Mduel == 'undefined') {
      var Mduel = {};
   }
   if (typeof Mduel.Pickups == 'undefined') {
      Mduel.Pickups = {};
   }

   Mduel.Animations = Animations;
   Mduel.Images = Images;
   Mduel.Util = Util;
   Mduel.Debug = Debug;

   var memoize = function(func, hasher) {
      var memo = {};
      return function() {
         var key = hasher.apply(this, arguments);
         return hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
      };
   };

   var calculateBoundingBox = memoize(function(image, frame) {
      var x = frame.x;
      var y = frame.y;
      var width = frame.width;
      var height = frame.height;
      var left = width, 
         top = height, 
         right = 0, 
         bottom = 0;

      var canvas = document.createElement('canvas');
      canvas.height = image.height;
      canvas.width = image.width;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
      var myImageData = ctx.getImageData(0, 0, image.width, image.height); // Parameters are left, top, width and height
      for(var x = 0; x < myImageData.width; x++) {
         for(var y = 0; y < myImageData.height; y++) {
            var idx = (x + y * myImageData.width) * 4;
            if(myImageData.data[idx + 3]) {
               if(x < left) left = x;
               if(y < top) top = y;
               if(x > right) right = x;
               if(y > bottom) bottom = y;
            }
         }
      }
      return {
         x: left,
         y: top,
         width: right - left,
         height: bottom - top
      };         
   }, function(image, frame) { return '' + image.src + JSON.stringify(frame); });


   Mduel.Pickups.Pickup = MovingObject.extend({
      initialize: function() {
         var bubble = Mduel.Animations.bubble();
         var image = Mduel.Animations[this.get('type')]();
         this.set('bubble', bubble);
         this.set('image', image);
      },

      getBoundingBox: function() {
         var image = Mduel.Images.pickups;
         var frame = this.get('bubble').getSprite();
         var box = calculateBoundingBox(image, frame);
         return { 
            x: this.getPositionX() + box.x, 
            y: this.getPositionY() + box.y, 
            width: box.width, 
            height: box.height 
         };
      },

      drawAnimation: function(ctx, elapsed, animation, pos) {
         animation.animate(elapsed);
         var frame = animation.getSprite();
         ctx.drawImage(Mduel.Images.pickups, 
            // Source X and Y coordinates
            frame.x, frame.y, 
            // Source Width and Height
            frame.width, frame.height, 
            // Destination X and Y coordinates
            this.getPositionX(), this.getPositionY(),
            // Destination Width and Height
            frame.width, frame.height);
      },
      
      update: function(elapsed) {
         // Update position
         var vx = this.getVelocityX();
         var vy = this.getVelocityY();
         if(vx !== 0) {
            this.changePositionX(vx);
         }
         if(vy !== 0) {
            this.changePositionY(vy);
         }
         if(this.getPositionX() < 0) {
            this.setVelocityX(Math.abs(this.getVelocityX()));
         } else if(this.getPositionX() > (640 - 30)) {
            this.setVelocityX(-Math.abs(this.getVelocityX()));
         }
         if(this.getPositionY() < 0) {
            this.setVelocityY(Math.abs(this.getVelocityY()));
         } else if(this.getPositionY() > (400 - 30 - 30)) {
            this.setVelocityY(-Math.abs(this.getVelocityY()));
         }         
      },

      draw: function(ctx, elapsed) {
         this.drawAnimation(ctx, elapsed, this.get('bubble'));
         this.drawAnimation(ctx, elapsed, this.get('image'));
         if(Mduel.Debug.debug) {
            var box = this.getBoundingBox();
            //draw the bounding box so we can work on collision detection
            ctx.strokeStyle = "white";
            ctx.strokeRect(box.x, box.y, box.width, box.height);
         }
      }
   });

   Mduel.Pickups.Pickups = Backbone.Collection.extend({
      initialize: function() {
      },

      update: function(elapsed) {
         this.each(function(pickup) {
            pickup.update(elapsed);
         });
         if(this.length < 3 && Math.random() < 0.01) {
            this.create();
         }
      },
      
      draw: function(ctx, elapsed) {
         this.each(function(pickup) {
            pickup.draw(ctx, elapsed);
         })
      },

      create: function() {
         var vx = Math.random() + 0.4;
         var vy = 1.8 - vx;
         vx = Math.random() < 0.5 ? vx : -vx;
         vy = Math.random() < 0.5 ? vy : -vy;
         var types = [
            'skull',
            'lightning',
            'invisibility',
            'mine',
            'gun',
            'explode'
         ];
         var pickup = new Mduel.Pickups.Pickup({
            x: 320 - 16,
            y: 20,
            vx: vx,
            vy: vy,
            type: types[Math.floor(Math.random() * types.length)]
         });
         this.add(pickup);
      }
   });
   
   return Mduel.Pickups;
};

if(typeof define !== 'undefined') {
   define([
      'mduel/animations', 
      'mduel/images',
      'mduel/util',
      'mduel/movingObject',
      'mduel/debug',
      'underscore'
   ], definePickups);
} else if(typeof module !== 'undefined') {
   module.exports = definePickups(
      require('../mduel/animations'),
      require('../mduel/images'),
      require('../mduel/util'),
      require('../mduel/movingObject'),
      require('../mduel/debug'),
      require('underscore')
   );   
}