const Redis=require('ioredis')

const redis=new Redis({
    host:process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT),
    // username:process.env.REDIS_USERNAME,
    // password:process.env.REDIS_PASSWORD
})

//EVENT LISTENERS

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.log("Redis error:", err.message));

module.exports=redis;