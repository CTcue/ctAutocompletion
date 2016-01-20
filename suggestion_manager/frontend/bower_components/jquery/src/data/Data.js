define( [
	"../core",
	"../var/rnotwhite",
	"./var/acceptData"
], function( jQuery, rnotwhite, acceptData ) {

function Data() {
	this.expando = jQuery.expando + Data.uid++;
***REMOVED***

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {***REMOVED***;

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		***REMOVED*** ***REMOVED***
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			***REMOVED*** );
		***REMOVED***
		return owner[ this.expando ];
	***REMOVED***,
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {***REMOVED***;
		***REMOVED***

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {***REMOVED***;

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				***REMOVED*** ***REMOVED***
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					***REMOVED*** );
				***REMOVED***
			***REMOVED***
		***REMOVED***

		return value;
	***REMOVED***,
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties ***REMOVED*** ] args
		***REMOVED*** ***REMOVED***

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			***REMOVED***
		***REMOVED***
		return cache;
	***REMOVED***,
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	***REMOVED***,
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		***REMOVED***

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	***REMOVED***,
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		***REMOVED***

		if ( key === undefined ) {
			this.register( owner );

		***REMOVED*** ***REMOVED***

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			***REMOVED*** ***REMOVED***
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				***REMOVED*** ***REMOVED***

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				***REMOVED***
			***REMOVED***

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			***REMOVED***
		***REMOVED***

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			***REMOVED*** ***REMOVED***
				delete owner[ this.expando ];
			***REMOVED***
		***REMOVED***
	***REMOVED***,
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	***REMOVED***
***REMOVED***;

return Data;
***REMOVED*** );
