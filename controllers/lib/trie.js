
// Simplefied version of
// https://github.com/nisaacson/node-autocomplete


var Trie = function() {
  this.words = 0;
  this.children = [];
***REMOVED***;


Trie.prototype.addValue = function(item, index) {
  if (!index) {
    index = 0;
  ***REMOVED***
  if (item === null) {
    return;
  ***REMOVED***

  var isObject = false;

  if (typeof item === 'object') {
    isObject = true;
  ***REMOVED***

  if ((isObject && index === item.key.length) || (!isObject && index === item.length)) {
    this.words += 1;
    this.value = isObject ? item.value : item;
    return;
  ***REMOVED***

  var key = isObject ? item.key[index] : item[index];
  if (this.children[key] === undefined) {
    this.children[key] = new Trie();
  ***REMOVED***

  var child = this.children[key];
      child.addValue(item, index + 1);
***REMOVED***;


Trie.prototype.allChildWords = function(prefix) {
  var tmp, key, child;
  if (!prefix) {
    prefix = '';
  ***REMOVED***

  var words = [];
  if (this.words > 0) {
    if(this.value.lenth === 0) {
      tmp = new Object();
      tmp.key = prefix;
      tmp.value = prefix
      words.push(tmp);
***REMOVED***
    ***REMOVED***
      tmp = new Object();
      tmp.key = prefix;
      tmp.value = this.value;
      words.push(tmp);
***REMOVED***
  ***REMOVED***

  for (key in this.children) {
    child = this.children[key];
    words = words.concat(child.allChildWords(prefix + key));
  ***REMOVED***

  return words;
***REMOVED***

/**
 * Perform an autocomplete match
 *
 * @param {String***REMOVED*** prefix
 * @param {Number***REMOVED*** index
 */
Trie.prototype.autocomplete = function(prefix, index) {
  if (!index) {
    index = 0;
  ***REMOVED***

  if (prefix.length === 0) {
    return [];
  ***REMOVED***

  var key = prefix[index];
  var child = this.children[key];

  if (!child) {
    return [];
  ***REMOVED***
  ***REMOVED***
    if (index === prefix.length - 1) {
      return child.allChildWords(prefix);
***REMOVED***
    ***REMOVED***
      return child.autocomplete(prefix, index + 1);
***REMOVED***
  ***REMOVED***
***REMOVED***;


var Autocomplete = function Autocomplete(elements) {
  this.trie = new Trie();
  var self = this;

  elements.forEach(function(element) {
    if (typeof element === 'object') {
      var item = {***REMOVED***
      item.key = element[0]
      item.value = element[1]

      self.trie.addValue(item)
***REMOVED***
    ***REMOVED***
      self.trie.addValue(element)
***REMOVED***
  ***REMOVED***)
***REMOVED***

Autocomplete.prototype.search = function(prefix) {
  return this.trie.autocomplete(prefix);
***REMOVED***

module.exports = Autocomplete;