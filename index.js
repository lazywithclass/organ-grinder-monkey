var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: 'your-access-key', secretAccessKey: 'your-secret-access'});
AWS.config.update({region: 'your-region'});

var ec2 = new AWS.EC2();

module.exports.changeTag = function(timeout, oldTags, newTags, beforeHook) {
  timeout = timeout || 60 * 60 * 1000;
  beforeHook = beforeHook || function(cb) { cb(); };
  
  setTimeout(function() {
    beforeHook(changeTag);
  }, timeout * Math.random());

  function changeTag() {
    getInstanceId(oldTags, function(id) {
      ec2.createTags({ Resources: [id], Tags: newTags }, function(err, data) {
        if (err) console.log(err);
      });
    });
  }
}; 

module.exports.terminate = function(timeout, tags, beforeHook) {
  timeout = timeout || 60 * 60 * 1000;
  beforeHook = beforeHook || function(cb) { cb(); };
  
  setTimeout(function() {
    beforeHook(terminate);
  }, timeout * Math.random());

  function terminate() {
    getInstanceId(tags, function(id) {
      ec2.terminateInstances({ InstanceIds: [ id ] }, function(err, data) { 
        if (err) console.log(err);
      });
    });
  }
};

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
