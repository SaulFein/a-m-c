'use strict';
module.exports = (mongoose, models) => {
  // Defines the home schema
  let HomeSchema = mongoose.Schema({
      description: {type: String, default: 'N/A'},
      picture: {type: mongoose.Schema.Types.Mixed},
      morePictures: mongoose.Schema.Types.Mixed, // this is not required
      createdAt: {type: Date, default: Date.now},
      video: {type: String, default: 'N/A'}
  });

  // Sets the createdAt parameter equal to the current time
  HomeSchema.pre('save', function(next){
      var now = new Date();
      if (!this.createdAt) {
          this.createdAt = now;
      }
      next();
  });

  // Exports the CarSchema for use elsewhere.
  let Home = mongoose.model('Home', HomeSchema);
  models.Home = Home;
};
