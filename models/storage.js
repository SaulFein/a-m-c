'use strict';
module.exports = (mongoose, models) => {
  // Defines the storage schema

  let StorageSchema = mongoose.Schema({
      description: {type: String, default: 'Storage details coming soon.'},
      storagePictures: {type: mongoose.Schema.Types.Mixed},
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
  let Storage = mongoose.model('Storage', StorageSchema);
  models.Storage = Storage;
};
