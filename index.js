var AWS = require('aws-sdk'), ec2 = new AWS.EC2();

module.exports.changeTag = function(timeout, oldTag, newTags, beforeHook) {
  timeout = timeout || 60 * 60 * 1000;
  beforeHook = beforeHook || function(cb) { cb(); };
  
  setTimeout(function() {
    beforeHook(changeTag);
  }, timeout * Math.random());

  function changeTag() {
    var params = {
      Filters: [
        { Name: 'instance-state-name', Values: ['running'] },
        { Name: 'tag-key', Values: oldTag.names },
        { Name: 'tag-value', Values: oldTag.values }
      ]
    };
    
    ec2.describeInstances(params, function(error, data) {
      if (error) return console.log(error); 

      var instanceIds = data.Reservations.map(function(reservation) {
        return reservation.Instances[0].InstanceId;
      });

      var instanceId = instanceIds[Math.floor(Math.random() * instanceIds.length)];

      var params = {
        Resources: [ instanceId ],
        Tags: newTags
      };

      ec2.createTags(params, function(err, data) {
        if (error) console.log(err);
        console.log(data);
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

      ec2.terminateInstances({ InstanceIds: [ instanceId ] }, function(err, data) { 
        if (error) console.log(err);
        console.log(data);
      });
    });
  }
};
