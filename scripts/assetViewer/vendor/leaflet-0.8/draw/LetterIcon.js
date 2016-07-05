L.LetterIcon = L.Icon.extend({
	options: {
		className: 'leaflet-div-icon',
		color: 'rgb(106,150,187)',
		radius: 20
	},

	initialize: function(letter, iconId, options) {
		this._letter = letter;
		this._id = iconId;
		L.setOptions(this, options);
	},

	createIcon: function() {
		var radius = this.options.radius,
			diameter = radius * 2 + 1;
		var div = document.createElement('div');
		div.id = this._id;
		div.innerHTML = this._letter;
		div.className = 'leaflet-marker-icon';
		div.style.marginLeft = (-radius-2) + 'px';
		div.style.marginTop  = (-radius-2) + 'px';
		div.style.width      = diameter + 'px';
		div.style.height     = diameter + 'px';
		div.style.borderRadius = (radius + 2) + 'px';
		div.style.borderWidth = '3px';
		div.style.borderColor = 'white';
		div.style.borderStyle = 'solid';
		div.style.fontSize   = '14px';
		div.style.fontFamily = 'sans-serif';
		div.style.fontWeight = 'bold';
		div.style.textAlign  = 'center';
		div.style.lineHeight = ( diameter - 4) + 'px';
//		div.style.lineHeight = '29px';
		div.style.color      = 'white';
		div.style.backgroundColor = this.options.color;
		div.style.padding = '0';
//		div.style.box-shadow = '3px 3px 12px 0px black';
		this._setIconStyles(div, 'icon');
		return div;
	},

	createShadow: function() { return null; }
//	createShadow: function() { 
//		div.style.box-shadow = '3px 3px 12px 0px rgba(138,138,138,0.75)';
//	}
});

L.letterIcon = function(letter, iconId, options) {
	return new L.LetterIcon(letter, iconId, options);
};