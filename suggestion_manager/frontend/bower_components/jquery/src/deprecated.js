define( [
	"./core"
], function( jQuery ) {

jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	***REMOVED***,
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	***REMOVED***,

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	***REMOVED***,
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	***REMOVED***,
	size: function() {
		return this.length;
	***REMOVED***
***REMOVED*** );

jQuery.fn.andSelf = jQuery.fn.addBack;

***REMOVED*** );

