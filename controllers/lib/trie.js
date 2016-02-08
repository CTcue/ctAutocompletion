
// Simplefied version of
// https://github.com/nisaacson/node-autocomplete


var Trie = function() {
  this.words = 0;
  this.children = [];
};


Trie.prototype.addValue = function(item, index) {
  if (!index) {
    index = 0;
  }
  if (item === null) {
    return;
  }

  var isObject = false;

  if (typeof item === 'object') {
    isObject = true;
  }

  if ((isObject && index === item.key.length) || (!isObject && index === item.length)) {
    this.words += 1;
    this.value = isObject ? item.value : item;
    return;
  }

  var key = isObject ? item.key[index] : item[index];
  if (this.children[key] === undefined) {
    this.children[key] = new Trie();
  }

  var child = this.children[key];
      child.addValue(item, index + 1);
};


Trie.prototype.allChildWords = function(prefix) {
  var tmp, key, child;
  if (!prefix) {
    prefix = '';
  }

  var words = [];
  if (this.words > 0) {
    if(this.value.lenth === 0) {
      tmp = new Object();
      tmp.key = prefix;
      tmp.value = prefix
      words.push(tmp);
    }
    else {
      tmp = new Object();
      tmp.key = prefix;
      tmp.value = this.value;
      words.push(tmp);
    }
  }

  for (key in this.children) {
    child = this.children[key];
    words = words.concat(child.allChildWords(prefix + key));
  }

  return words;
}

/**
 * Perform an autocomplete match
 *
 * @param {String} prefix
 * @param {Number} index
 */
Trie.prototype.autocomplete = function(prefix, index) {
  if (!index) {
    index = 0;
  }

  if (prefix.length === 0) {
    return [];
  }

  var key = prefix[index];
  var child = this.children[key];

  if (!child) {
    return [];
  }
  else {
    if (index === prefix.length - 1) {
      return child.allChildWords(prefix);
    }
    else {
      return child.autocomplete(prefix, index + 1);
    }
  }
};


var Autocomplete = function Autocomplete(elements) {
  this.trie = new Trie();
  var self = this;

  elements.forEach(function(element) {
    if (typeof element === 'object') {
      var item = {}
      item.key = element[0]
      item.value = element[1]

      self.trie.addValue(item)
    }
    else {
      self.trie.addValue(element)
    }
  })
}

Autocomplete.prototype.search = function(prefix) {
  return this.trie.autocomplete(prefix);
}

module.exports = Autocomplete;