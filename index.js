var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-access',
  region: 'your-region'
});
var ec2 = new AWS.EC2();

module.exports.changeTag = function(timeout, oldTags, newTags, instanceId, beforeHook, afterHook) {
  schedule(timeout, beforeHook, function() {
    getInstanceId(oldTags, function(id) {
      instanceId = instanceId || id;
      ec2.createTags({ Resources: [instanceId], Tags: newTags }, function(err, data) {
        if (err) console.log(err);
        afterHook(err, data, instanceId);
      });
    });
  });
};

module.exports.terminate = function(timeout, tags, instanceId, beforeHook, afterHook) {
  schedule(timeout, beforeHook, function() {
    getInstanceId(tags, function(id) {
      instanceId = instanceId || id;
      ec2.terminateInstances({ InstanceIds: [ instanceId ] }, function(err, data) {
        if (err) console.log(err);
        afterHook(err, data, instanceId);
      });
    });
  });
};

function schedule(timeout, beforeHook, action) {
  timeout = timeout || 60 * 60 * 1000;
  beforeHook = beforeHook || function(cb) { cb(); };
  setTimeout(function() {
    beforeHook(action);
  }, timeout * Math.random());
}

function getInstanceId(tags, cb) {
  var params = {
    Filters: [
      { Name: 'instance-state-name', Values: ['running'] },
      { Name: 'tag-key', Values: tags.names },
      { Name: 'tag-value', Values: tags.values }
    ]
  };

  ec2.describeInstances(params, function(error, data) {
    if (error) return console.log(error);
    var instanceIds = data.Reservations.map(function(reservation) {
      return reservation.Instances[0].InstanceId;
    });
    var instanceId = instanceIds[Math.floor(Math.random() * instanceIds.length)];
    cb(instanceId);
  });
}
