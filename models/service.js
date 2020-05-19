'use strict';
module.exports = (mongoose, models) => {
  // Defines the service schema
  let defaultServicDesc = "Authentic Motorcars is pleased to have Randy Johnson on our team as our lead technician. Randy has" +
      "experience working with a wide variety of makes that include Alfa Romeo, BMW, Fiat, Ferrari, Maserati, Porsche, Lancia, Volkswagen, and Lotus." +
      "We like to involve our clients with the service of their vehicles and provide detailed explanations of repairs needed and alternative parts and " +
      "performance options that are available to ensure longevity. Our mission is to help you better understand the mechanicals of your collector vehicle" +
      "so you can plan future maintenance campaigns and restoration phases if needed.";

  let ServiceSchema = mongoose.Schema({
      description: {type: String, default: defaultServicDesc},
      servicePictures: {type: mongoose.Schema.Types.Mixed},
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
