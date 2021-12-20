module.exports = class routes{
    constructor(app){
        this.router = app;
        this.routerList();
    }

    routerList(){
        this.router.get('/', function (req, res) {
            res.send('Hello World')
        })
    }
}