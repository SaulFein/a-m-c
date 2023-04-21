'use strict';
module.exports = (mongoose, models) => {
  // Defines the storage schema

  let StorageSchema = mongoose.Schema({
    description: { type: String, default: 'Storage details coming soon.' },
    storagePictures: { type: mongoose.Schema.Types.Mixed },
    pictureDesc: { type: [String] },
    special: { type: String },
    specialTitle: { type: String, default: 'SPECIAL GOING ON NOW' },
    createdAt: { type: Date, default: Date.now },
    serviceList: { type: String, default: 'Service list coming soon.' },
    mmcbsTitle: { type: String, default: 'OUTDOOR STORAGE AVAILABLE' },
    mmcbsBlurb: {
      type: String,
      default:
        'Our sister store Marymoor Car and Boat Storage offers secure outdoor storage for cars, trucks, boats, RVs, and trailers.  Prices are $10 per total feet of length.',
    },
  });

  // Sets the createdAt parameter equal to the current time
  StorageSchema.pre('save', function (next) {
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
