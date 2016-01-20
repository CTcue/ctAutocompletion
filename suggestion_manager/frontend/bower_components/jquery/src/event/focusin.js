define( [
	"../core",
	"../data/var/dataPriv",
	"./support",

	"../event",
	"./trigger"
], function( jQuery, dataPriv, support ) {

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" ***REMOVED***, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		***REMOVED***;

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				***REMOVED***
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			***REMOVED***,
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				***REMOVED*** ***REMOVED***
					dataPriv.access( doc, fix, attaches );
				***REMOVED***
			***REMOVED***
		***REMOVED***;
	***REMOVED*** );
***REMOVED***

return jQuery;
***REMOVED*** );
