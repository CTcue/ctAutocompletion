define( [
	"../core"
], function( jQuery ) {

// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	***REMOVED***

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	***REMOVED*** catch ( e ) {
		xml = undefined;
	***REMOVED***

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	***REMOVED***
	return xml;
***REMOVED***;

return jQuery.parseXML;

***REMOVED*** );
