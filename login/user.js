var bcrypt = require('bcrypt-nodejs');
var uuid = require('node-uuid');
var db = require('./db');
//-------------------------------------------------------------------
//model service
//
//
//
var AccountScheme = {
  id: 'String',
  index:{
    username:'String',
    email:'String'
  },
  auth:{
    salt:'String',
    hashedPassword:'String',
    resetToken: 'String'
  },
  accessRight:'String'
};

var UserScheme = {

  name:{
    first:'String',
    middle:'String',
    last:'String'
  },
  username:'String',
  timestamp:'date',


};

var JWT = (function(){
  function encode(){};
  function decode(){};
  function authenticate(){};
  function init(){}
  return function(){
    this.jwt_init=init;
    this.jwt_value='';
    this.jwt_encode= encode;
    this.jwt_decode= decode;
    this.jwt_authenticate= authenticate;
    };
    return this
  }
})();



var Password = (function(password, next){

  function hashPassword(next){
    var salt = salt || bcrypt.genSaltSync();
    bcrypt.hash(password, salt, null, (function(err, hashedPassword){
          if (err) return next(err);
          next(null, hashedPassword, salt);
      }).bind(this)
      );
    };
  function validate(password, next){
    if (!password || password.length === 0) {
      return next(null, false);
    }
    return this.hashPassword(password, this.attributes.auth.salt, (function(err, hashedPassword){
      this.isLogin = hashedPassword === this.attributes.auth.hashedPassword;

      next(err, this.isLogin);
    }).bind(this)
    );
  };

  return function(){
    this.password_init=init;
    this.password_resetToken= null;
    this.password_validate= validate;
    this.password_salt= bcrypt.genSaltSync();
    this.password_hashPassword= hashPassword
    return this
  }
})();

var Auth = function(authInfo){
  this.isAuthorized = false;
  function authorize(strategy, key){
    this[strategy].validate(key, (function(err, status){
      this.authorized = status;
      var token = this.jwt.genToken();
      return {status:status,token: token}
    }).bind(this));
  }

  function unauthorize(){
    this.authorized = false;
    return this
  }
  function requestEmailToken(){

    return this
  }
  return function(){
    this.authorize =authorize;
    this.unauthorize= unauthorize ;
    this.requestEmailToken = requestEmailToken;
    return this
  }
}
JWT.call(Auth.prototype);
Password.call(Auth.prototype);


/*****************************************************
*
*
****************************************************/


var Collection = function() {
  this.attributes = {};

};

Collection.prototype.save =function(next){
  saveToDb(this.attributes, (function(){next();}).bind(this))
};
Collection.prototype.find = function(index) {
  this.model.fetchBy(index, function(err, this){
    return this
  })

}

var Account = function(accountInfo, next) {
  Collection.call(this);
  this.init(accountInfo, (function(err){next.call(this,err);} ).bind(this) );
};
var Account = {
  authenticate:
}

Account.prototype.init = function(accountInfo, next) {

    this.auth = new Auth(accountInfo.auth, function(err){
      next.call(this,err);
    }).bind(this));

};



function User(accountInfo, userInfo, next){
  Account.call(this, accountInfo, next);
  this.attributes['info'] = userInfo;
  this.attributes.accessRight = 'user';
}

User.prototype = Object.create(Account.prototype);
User.prototype.constructor = User;
//User.prototype.index = RenderAccountPage();
User.prototype.resetUserInfo = function() {

  return this
}

function Admin(accountInfo, adminInfo, next){
  Account.call(this, accountInfo, next);
  this.attributes['info'] = adminInfo;
  this.attributes.accessRight = 'admin';
}

Admin.prototype = Object.create(Account.prototype);
Admin.prototype.constructor = Admin;
Admin.prototype.resetAdminInfo = function() {
  return this
}

module.exports = {user:User, admin:Admin};
