'use strict';
module.exports = (mongoose, models) => {
  // Defines the car schema
  let CarSchema = mongoose.Schema({
      make: {type: String, required: true},
      model: {type: String, required: true},
      year: {type: String, required: true},
      miles: {type: String, default: 'N/A'},
      color: {type: String, default: 'N/A'},
      interiorColor: {type: String, default: 'N/A'},
      price: {type: String, default: 'Inquire'},
      vin: {type: String, default: 'N/A'},
      highlights: {type: String, default: 'N/A'},
      description: {type: String, default: 'N/A'},
      carfax: {type: String, default: 'N/A'},
      engine: {type: String, default: 'N/A'},
      transmission: {type: String, default: 'N/A'},
      picture: {type: mongoose.Schema.Types.Mixed, required: true},
      morePictures: mongoose.Schema.Types.Mixed, // this is not required
      createdAt: {type: Date, default: Date.now},
      sold: {type: Boolean, default: false},
      stockNumber: {type: String, default: 'N/A'},
      carfaxFile: mongoose.Schema.Types.Mixed,
      video: {type: String, default: 'N/A'}
  });

  // Sets the createdAt parameter equal to the current time
  CarSchema.pre('save', function(next){
      var now = new Date();
      if (!this.createdAt) {
          this.createdAt = now;
      }
      next();
  });

  // Exports the CarSchema for use elsewhere.
  let Car = mongoose.model('Car', CarSchema);
  models.Car = Car;
};
