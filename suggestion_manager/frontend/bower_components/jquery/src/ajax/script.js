define( [
	"../core",
	"../var/document",
	"../ajax"
], function( jQuery, document ) {

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	***REMOVED***,
	contents: {
		script: /\b(?:java|ecma)script\b/
	***REMOVED***,
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		***REMOVED***
	***REMOVED***
***REMOVED*** );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	***REMOVED***
	if ( s.crossDomain ) {
		s.type = "GET";
	***REMOVED***
***REMOVED*** );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				***REMOVED*** ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						***REMOVED***
					***REMOVED***
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			***REMOVED***,
			abort: function() {
				if ( callback ) {
					callback();
				***REMOVED***
			***REMOVED***
		***REMOVED***;
	***REMOVED***
***REMOVED*** );

***REMOVED*** );
