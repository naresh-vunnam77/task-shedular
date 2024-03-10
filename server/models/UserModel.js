const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    email: {
      type: String,
      unique: [true, 'ERROR_EMAIL_DUPLICATE'],
      trim: true,
      match: [/^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'ERROR_EMAIL_INVALID'],
      required: [true, 'ERROR_EMAIL_REQUIRED']
    },
    password: {
      type: String,
      required: [true, 'ERROR_PASSWORD_REQUIRED'],
      minLength: [6, 'ERROR_PASSWORD_LENGTH'],
      seect: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Encrypt user Password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT Tokens
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    "f6sdsABWqRZHEFfSnJVC9y4eBAY7RSfZ",
    { expiresIn: "1d" }
  );
};

// Match user entered password to password in db
UserSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function (next) {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set password token expiry

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
