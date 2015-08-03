var utils = exports;
var counter = 0;

utils.decorateTypes = function (item) {

    console.log(item);
    var matchType   = typeof item.match   === 'string' ? 'string' : 'regex';
    var replaceType = typeof item.replace;

    var output = {
        match:       item.match,
        replace:     item.replace || item.fn,
        paths:       item.paths   || [],
        matchType:   matchType,
        replaceType: replaceType,
        id:          item.id,
        active:      true
    };

    return output;
};

utils.decorateInputs = function (item) {
    if (item.matchType === 'regex') {
        item.matchInput = item.match.source;
        var flagnames = ['global', 'multiline', 'ignoreCase'];
        var flags = flagnames.filter(function (name) {
            return item.match[name];
        })
        .map(function (item) {
            return item.charAt(0);
        })
        .join('');

        item.matchFlags = flags;
    }
    if (item.matchType === 'string') {
        item.matchInput = item.match;
    }
    if (item.replaceType === 'string') {
        item.replaceInput = item.replace;
    }
    if (item.replaceType === 'function') {
        item.replaceInput = item.replace
            .toString()
            .replace(/(^.*?\{|\}$)/g, "")
            .trim();
    }
    return item;
};

utils.addId = function (item) {

    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');

    ['matchInput', 'matchType', 'replaceInput', 'replaceType']
        .forEach(function (key) {
            shasum.update(item[key]);
        });

    item.id = shasum.digest('hex');

    return item;
};