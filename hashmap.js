/**
 * JS HashMap implements HashMap and HashSet in JavaScript.
 *
 * Author: http://t.sina.com.cn/hoverruan
 *           http://twitter.com/hoverruan
 *  Email: hoverruan at gmail.com
 */

function HashMap() {
    this._buckets = {};
    this._len = 0;
}

HashMap.prototype.codeFor = function(obj) {
    if (typeof obj !== 'object') return new String(obj);
    return (typeof obj.hash === 'function') ? obj.hash() : obj.toString();
};

HashMap.prototype.equals = function(a, b) {
    return (typeof a === 'object' && typeof a.equals === 'function') ?
            a.equals(b) :
            a === b;
};

HashMap.prototype.put = function(key, value) {
    var code = this.codeFor(key);
    var bucket = this._buckets[code];
    if (!bucket) {
        bucket = this._buckets[code] = [];
    }
    var replaced = false;
    var pair, oldValue;
    for (var i = 0, len = bucket.length; i < len; i++) {
        pair = bucket[i];
        if (this.equals(pair.key, key)) {
            oldValue = pair.value;
            pair.value = value;
            replaced = true;
            break;
        }
    }
    if (!replaced) {
        pair = {key: key, value: value};
        bucket.push(pair);
        this._len++;
    }
    return oldValue;
};

HashMap.prototype.add = HashMap.prototype.put;

HashMap.prototype._bucketForKey = function(key) {
    var hashCode = this.codeFor(key);
    return this._buckets[hashCode] || null;
};

HashMap.prototype._assoc = function(key) {
    var bucket = this._bucketForKey(key);
    if (!bucket) return null;
    for (var i = 0, len = bucket.length; i < len; i++) {
        var pair = bucket[i];
        if (this.equals(pair.key, key)) return pair;
    }
    return null;
};

HashMap.prototype.get = function(key) {
    var pair = this._assoc(key);

    return pair ? pair.value : null;
};

HashMap.prototype.hasKey = function(key) {
    return !!this._assoc(key);
};

HashMap.prototype.containsKey = HashMap.prototype.hasKey;

HashMap.prototype.hasValue = function(value) {
    var has = false;
    this.forEach(function(k, v) {
        if (has) return;
        if (this.equals(value, v)) has = true;
    });
};

HashMap.prototype.remove = function(key) {
    var bucket = this._bucketForKey(key);
    if (!bucket) return null;
    for (var i = 0, len = bucket.length; i < len; i++) {
        var pair = bucket[i];
        if (this.equals(pair.key, key)) {
            bucket.splice(i, 1);
            this._len--;
            return pair.value;
        }
    }
    return null;
};

HashMap.prototype.size = function() {
    return this._len;
};

HashMap.prototype.isEmpty = function() {
    return this.size() <= 0;
};

HashMap.prototype.toString = function() {
    return 'HashMap(' + this._len + ')';
};

HashMap.prototype.forEach = function(block, context) {
    var code, bucket, i, pair;

    for (code in this._buckets) {
        if (!this._buckets.hasOwnProperty(code)) continue;
        bucket = this._buckets[code];
        i = bucket.length;
        while (i--) {
            pair = bucket[i];
            block.call(context || null, pair.key, pair.value);
        }
    }
};

HashMap.prototype.keys = function() {
    var keys = [];
    this.forEach(function(key, value) {
        keys.push(key);
    });
    return keys;
};

HashMap.prototype.values = function() {
    var values = [];
    this.forEach(function(key, value) {
        values.push(value);
    });
    return values;
};

function HashSet() {
    this._map = new HashMap();
    this._present = new Object();
}

HashSet.prototype.add = function(value) {
    this._map.put(value, this._present);
};

HashSet.prototype.remove = function(value) {
    return this._map.remove(value) === this._present;
};

HashSet.prototype.size = function() {
    return this._map.size();
};

HashSet.prototype.toString = function() {
    return 'HashSet(' + this.size() + ')';
};

HashSet.prototype.forEach = function(block, context) {
    this._map.forEach(function(key, value) {
        block.call(context || null, key);
    }, context || null);
};

HashSet.prototype.contains = function(value) {
    return this._map.hasKey(value);
};

HashSet.prototype.isEmpty = function() {
    return this._map.isEmpty();
};