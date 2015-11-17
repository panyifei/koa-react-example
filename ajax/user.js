var UserService = require("../service").User;

exports.add = function* (){
    UserService.add();
    this.body = { aa: 'bar' };
    this.status=200;
}

exports.delete = function* (){
    UserService.delete();
    this.body = { aa: 'bar' };
    this.status=200;
}

exports.change = function* (){
    UserService.change();
    this.body = { aa: 'bar' };
    this.status=200;
}
