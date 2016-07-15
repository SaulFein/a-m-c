'use strict';

module.exports = (mongoose, models) => {
  let bcrypt = require('bcrypt');
  let jwt = require('jsonwebtoken');

  let UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
  });

  UserSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    console.log('password hashed');
    next();
  });

  UserSchema.methods.hashPassword = function(password) {
    let hash = this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    return hash;
  };

  UserSchema.methods.compareHash = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  UserSchema.methods.generateToken = function() {
    console.log('generating token')
    return jwt.sign({_id: this._id}, process.env.APP_SECRET || 'change this');
  };

  let User = mongoose.model('User', UserSchema);
  models.User = User;
};
