var defineMovingObject = function(
	_,
	Backbone
) {
	console.log('player loaded');
	if (typeof Mduel == 'undefined') {
		var Mduel = {};
	}
	if (typeof Mduel.Player == 'undefined') {
		Mduel.MovingObject = {};
	}

	Mduel.MovingObject = Backbone.Model.extend({
		defaults: {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			bx: 0,
			by: 0,
			bw: 0,
			bh: 0
		},
		initialize: function() {      
		},

		getBoundingBox: function() {
			throw 'getBoundingBox must be defined in the inheriting object';
		},

		//all the gets
		getPositionX: function() {
			return this.get('x');
		},
		getPositionY: function() {
			return this.get('y');
		},
		getVelocityX: function() {
			return this.get('vx');
		},
		getVelocityY: function() {
			return this.get('vy');
		},

		//all the sets
		setPositionX: function(x) {
			this.set('x', x);
		},
		setPositionY: function(y) {
			this.set('y', y);
		},
		setPosition: function(x, y) {
			this.set({
				x: x,
				y: y
			});
		},
		setVelocityX: function(vx) {
			this.set('vx', vx);
		},
		setVelocityY: function(vy) {
			this.set('vy', vy);
		},
		setVelocity: function(vx, vy) {
			this.set({
				vx: vx,
				vy: vy
			});
		},

		//all the changes
		change: function(key, delta) {
			this.set(key, this.get(key) + delta)
		},
		changePositionX: function(x) {
			return this.change('x', x);
		},
		changePositionY: function(y) {
			return this.change('y', y);
		},
		changeVelocityX: function(vx) {
			return this.change('vx', vx);
		},
		changeVelocityY: function(vy) {
			return this.change('vy', vy);
		}
	});

	return Mduel.MovingObject;
};

if(typeof define !== 'undefined') {  
	define([
		'underscore',
		'backbone'
	], defineMovingObject);
} else if(typeof module !== 'undefined.') {
	module.exports = defineMovingObject(
		require('underscore'),
		require('backbone')
	);
}