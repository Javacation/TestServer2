const redisPartner = require('./EBF/T/RedisPartener');

redisPartner.set_expire(1000, 'hello', 'hello world');

setTimeout(async ()=>{
    console.log(await redisPartner.get('hello'));
}, 1000)