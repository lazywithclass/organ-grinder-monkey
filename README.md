# organ-grinder-monkey
Not as lethal as the Chaos Monkey, still a monkey nonetheless. If you feel confident
about your infrastructure you might want to use [scimmia](https://github.com/lazywithclass/scimmia)

Require and configure this module to shutdown ec2-instances, with your configuration but without notice.


## How to use it

The following example will terminate 

* within a 1 ms timeout
* all running instances that have the specified tags
* before terminating it will log `'terminating`'

```javascript
var tags = {names: ['tag1', 'tag2'], values: ['1', '2']};
var timeout = 1;
function beforeHook(cb) {
  console.log('terminating!');
  return cb();
}

require('./index')(timeout, tags, beforeHook);
```