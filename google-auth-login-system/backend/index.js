const http=require('http')

const Router=require('./router')

const router=new Router();

const initiateRouter=require('./rest-router')
const restRouter=new initiateRouter(router);

const callServer=restRouter.init();
http.createServer(callServer).listen(3003, ()=>{
    console.log('server is started on 3003');
})


