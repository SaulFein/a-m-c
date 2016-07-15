// Dependencies
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Defines the car schema
var CarSchema = new Schema({
    make: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: String, required: true},
    color: {type: String, default: 'N/A'},
    vin: {type: String, default: 'N/A'},
    highlights: {type: String, default: 'N/A'},
    description: {type: String, default: 'N/A'},
    carfax: {type: String, default: 'N/A'},
    engine: {type: String, default: 'N/A'},
    transmission: {type: String, default: 'N/A'},
    picture: {type: Schema.Types.Mixed, required: true},
    morePictures: Schema.Types.Mixed, // this is not required
    createdAt: {type: Date, default: Date.now},
});

// Sets the createdAt parameter equal to the current time
CarSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

// Exports the CarSchema for use elsewhere.
module.exports = mongoose.model('car', CarSchema);
