# organ-grinder-monkey
Not as lethal as the Chaos Monkey, still a monkey nonetheless. If you feel confident
about your infrastructure you might want to use [scimmia](https://github.com/lazywithclass/scimmia).

Require and configure this module to shutdown ec2-instances, with your configuration but without notice.


## How to use it

The following example will 

* terminate a random instance between all that have the specified tags
* within a 1 ms timeout
* log `'terminating`' before terminating

```javascript
var tags = {names: ['tag1', 'tag2'], values: ['1', '2']};
var timeout = 1;
function beforeHook(cb) {
  console.log('terminating!');
  return cb();
}

require('./index')(timeout, tags, beforeHook);
```

The following example will change tag

* change tag `tag1` from `1` to `2` to a random instance between all that have the specified tags
* within a 1ms timeout
* log `'terminating`' before terminating

```javascript
var timeout = 1;
function beforeHook(cb) {
  console.log('terminating!');
  return cb();
}
var oldTags = {names: ['tag1'], values: ['1']};
// note the uppercase keys, this is the syntax directly used by the sdk
var newTags = [{Key: 'tag1', Value: '2'}];
require('./index').changeTag(timeout, oldTags, newTags, beforeHook);
```
