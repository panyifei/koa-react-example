var koa = require('koa');
var koa_static = require('koa-static');
var views = require('co-views');
var route = require('koa-route');
var app = koa();
var Ajax = require("./ajax");


//这个是用来将表单进行解析
//var parse = require('co-body');

app.use(koa_static(__dirname));

//处理没有页面的情况
app.use(pageNotFound);

app.use(function*(next){
    this.render = views('views', {
        map: {
            jade: 'jade'
        },
        default : 'jade'
    });
    yield next;
});

//这里配置路径的路由
app.use(route.get('/', main));

//这里配置ajax的路由
app.use(route.get('/ajax/addUser', Ajax.user.add));

function *main(){
    this.body = yield this.render('index');
    this.status=200;
}

function *pageNotFound(next){
    yield next;
    if (404 != this.status) return;
    this.status = 404;
    //判断需要的结果是页面还是json
    switch (this.accepts('html', 'json')) {
        case 'html':
            this.type = 'html';
            this.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            this.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            this.type = 'text';
            this.body = 'Page Not Found';
    }
}


app.listen(3000);
console.log('Listening on port 3000!');
