define( [
	"../var/document",
	"../var/support"
], function( document, support ) {

( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	***REMOVED*** catch ( e ) {
		support.deleteExpando = false;
	***REMOVED***

	// Null elements to avoid leaks in IE.
	div = null;
***REMOVED*** )();

return support;

***REMOVED*** );
