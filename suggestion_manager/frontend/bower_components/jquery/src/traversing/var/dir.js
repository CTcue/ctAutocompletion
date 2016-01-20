define( [
	"../../core"
], function( jQuery ) {

return function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			***REMOVED***
			matched.push( elem );
		***REMOVED***
	***REMOVED***
	return matched;
***REMOVED***;

***REMOVED*** );
