var monkey = require('./index'),
    exec = require('child_process').exec,
    async = require('async');

var msInADay = 86400000;

function changeTag(instanceId, done) {
  var oldTags = { names: ['some-tag'], values: ['true'] };
  var newTags = [{ Key: 'some-tag', Value: 'false' }];
  monkey.changeTag(msInADay, oldTags, newTags, function(cb) {
    exec('notify-send "...did he say terminate or update...?"');
    console.log('...did he say terminate or update...?');
    cb();
  }, done);
}

function terminate(instanceId, done) {
  var tags = { names: ['some-tag'], values: ['false'] };
  monkey.terminate(1, tags, function(cb) {
    exec('notify-send "wait... let me fix this server..."');
    console.log('wait... let me fix this server...');
    cb();
  }, done);
}

var instanceId;
async.forever(
  function(next) {
    async.series([
      function(next) {
        changeTag(null, function(err, data, id) {
          instanceId = id;
          next();
        });
      },
      function(next) {
        terminate(instanceId, next);
      }
    ], function(err) {
      exec('notify-send "monkey is done, sir!"');
      console.log('monkey is done, sir!');
      next(err);
    });
  },
  function(err) {
    if (err) {
      exec('notify-send "...ehm... someone broke it!"');
      console.log(err.message, err.stack);
    };
  }
);
