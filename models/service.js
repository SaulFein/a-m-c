'use strict';
module.exports = (mongoose, models) => {
  // Defines the service schema
  let defaultServicDesc = "More info coming soon.";

  let ServiceSchema = mongoose.Schema({
      description: {type: String, default: defaultServicDesc},
      servicePictures: {type: mongoose.Schema.Types.Mixed},
      pictureDesc: {type: [String]},
      special: {type: String},
      createdAt: {type: Date, default: Date.now},
      serviceList: {type: String, default: 'Service list coming soon.'}
  });

  // Sets the createdAt parameter equal to the current time
  ServiceSchema.pre('save', function(next){
      var now = new Date();
      if (!this.createdAt) {
          this.createdAt = now;
      }
      next();
  });

  // Exports the ServiceSchema for use elsewhere.
  let Service = mongoose.model('Service', ServiceSchema);
  models.Service = Service;
};
