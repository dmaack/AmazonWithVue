const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: { // creating the 1:1 relationship to another schema, avoid complicating
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }
})

UserSchema.pre('save', function(next) { // pre means to please check the password encryption first then save the object to the DB
    let user = this;
    if(this.isModified('password') || this.isNew) { // the if/else will check if whether the user is a new object or if the password has been modified, if either is true -> we will encrypt the password by calling the bycrpy library 
        bcrypt.genSalt(10, function(err, salt) { // generates a 10 character token
            if(err) {
                return next(err)
            }

            bcrypt.hash(user.password, salt, null, function(err, hash) { // then will hash the 10 characters with the users password
                if(err) {
                    return next(err)
                }
                
                user.password = hash;
                next(); // we are done so move on
            })
        })
    } else {
        return next();
    }
})

UserSchema.methods.comparePassword = function(password, next) {
    let user = this;
    return bcrypt.compareSync(password, user.password)
};

module.exports = mongoose.model('User', UserSchema);

