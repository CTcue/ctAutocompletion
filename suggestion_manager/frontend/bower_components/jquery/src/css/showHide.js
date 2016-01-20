define( [
	"../data/var/dataPriv"
], function( dataPriv ) {

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		***REMOVED***

		display = elem.style.display;
		if ( show ) {
			if ( display === "none" ) {

				// Restore a pre-hide() value if we have one
				values[ index ] = dataPriv.get( elem, "display" ) || "";
			***REMOVED***
		***REMOVED*** ***REMOVED***
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember the value we're replacing
				dataPriv.set( elem, "display", display );
			***REMOVED***
		***REMOVED***
	***REMOVED***

	// Set the display of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		***REMOVED***
	***REMOVED***

	return elements;
***REMOVED***

return showHide;

***REMOVED*** );
