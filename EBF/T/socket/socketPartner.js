const SOCKETIO = require('socket.io');
const socket_io_json = {};
const tokenManager = require('../tokenManager');
const redisPartner = require('../RedisPartener');
const dbReserved = require('../dbReserved');
const dotEnv = require('../../CP/envHell');
const { io } = require('socket.io-client');

const hexChanger = (str)=>{
    return str
    .split('%20').join(' ')
    .split('%21').join('!')
    .split('%22').join('"')
    .split('%23').join('#')
    .split('%24').join('$')
    .split('%25').join('%')
    .split('%26').join('&')
    .split('%27').join('\'')
    .split('%28').join('(')
    .split('%29').join(')')
    .split('%2A').join('*')
    .split('%2B').join('+')
    .split('%2C').join(',')
    .split('%2D').join('-')
    .split('%2E').join('.')
    .split('%2F').join('/')
    .split('%3A').join(':')
    .split('%3B').join(';')
    .split('%3C').join('<')
    .split('%3D').join('=')
    .split('%3E').join('>')
    .split('%3F').join('?')
    .split('%40').join('@')
    .split('%5B').join('[')
    .split('%5C').join('\\')
    .split('%5D').join(']')
    .split('%5E').join('^')
    .split('%5F').join('_')
    .split('%60').join('`')
    .split('%7B').join('{')
    .split('%7C').join('|')
    .split('%7D').join('}')
    .split('%7E').join('~')
    ;
}

module.exports = {
    new_socket: (httpServer)=>{
        try {
            socket_io_json.socket_io = SOCKETIO(httpServer, {cors: {origin: '*', methods: ["GET", "POST"]}});
        }
        catch (error) {
            console.log(error);
        }
    },

    socket_on: async ()=>{
        socket_io_json.socket_io.on('connection', async function(socket) {
            // socket.join('test_room_0');
            // socket_io_json.socket_io.to('test_room_0').emit('test_room_0_send', {data: 'data'});

            socket.on('upload_boards', ()=>{
                socket_io_json.socket_io.emit('refreshOn', null);
            });

            socket.on('login_status_on', async (data)=>{
                var result = {
                    result: [],
                    code: 0,
                };

                var cookieList = data.split(';');

                for(var i in cookieList){
                    if(cookieList[i].indexOf('accessToken=') != -1){
                        var tempList = cookieList[i].split('accessToken=');
                        var atk = hexChanger(tempList[1]);

                        socket.atk = atk;

                        try {
                            socket.atkSep = await tokenManager.verifyToken2(socket.atk, socket.handshake.headers['x-forwarded-for'] || socket.handshake.address);

                            if(Number.isInteger(socket.atkSep)){
                                tokenManager.tokenVerifyValue(socket.atkSep, result);

                                socket.atk = null;
                                socket.atkSep = null;
                            } else{
                                await redisPartner.set_expire(Number.MAX_SAFE_INTEGER, socket.atk, JSON.stringify(socket.atkSep));

                                result.result.push(...[socket.atk, socket.atkSep]);
                                result.code = 0;

                                socket.join(socket.atkSep.id);
                            }
                        } 
                        catch (error) {
                            result.code = 1;

                            console.log(error);
                        }  
                        break;
                    }
                }

                socket.emit('login_status_on_result', result);
            });

            socket.on('login_status_off', async (data)=>{
                var result = {
                    result: 'success',
                    code: 0,
                };

                try {
                    await redisPartner.del_is_exist(socket.atk || '');
                    
                    if(socket.atkSep){
                        socket.leave(socket.atkSep.id);
                    }
                    // console.log(await redisPartner.del(socket.atk));
                } 
                catch (error) {
                    console.log(error);
                }

                socket.atk = null;
                socket.atkSep = null;

                socket.emit('login_status_off_result', result);
            });

            socket.on('login_check', async ()=>{
                var result = {
                    result: {},
                    code: 0,
                };

                var PA1, PA2, PA3;
                var dbresult, dbfield;

                if(!socket.atk){
                    result.result.loginStatus = false;
                    result.code = -1;
                } else{
                    let loginString = JSON.parse(await redisPartner.get(socket.atk || ''));

                    PA1 = '*';
                    PA2 = 'userinfo';
                    PA3 = `id='${loginString.id}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(loginString.auth !== dbresult[0].admin){
                        loginString.auth = dbresult[0].admin;
                        await redisPartner.set_expire(Number.MAX_SAFE_INTEGER, socket.atk, JSON.stringify(socket.atkSep));

                        result.result.loginValid = dbresult[0].admin;
                    } else{
                        result.result.loginValid = loginString.auth;
                    }

                    result.result.loginStatus = true;
                }

                socket.emit('login_check_result', result);
            });

            socket.on('disconnect', async ()=>{
                try {
                    await redisPartner.del_is_exist(socket.atk || '');
                } 
                catch (error) {
                    console.log(error);
                }
            });
        });
    },
    socket_io_json: socket_io_json,
};