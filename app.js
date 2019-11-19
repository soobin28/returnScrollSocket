//app이라는 변수에 express를 담아줌
var app = require('express')(); 
//http 변수에 http를 담아두고 Server함수에 app을 담아줌
var http = require('http').Server(app);
var io = require('socket.io')(http);

// mysql 모듈 불러오기
var mysql = require('mysql');
var firebase = require('firebase');

var connection = mysql.createConnection({
    host: "192.168.0.19",
    port: 3306,
    user: "root",
    password: "mysql",
    database: "returnscroll"
})
connection.connect();

// firebase연결 
var config = {
    apiKey: "AIzaSyA7j7VIOlWLMgEaEnEsYCzQHyKomE2Gqy0",
    authDomain: "returnscroll-chat-test.firebaseapp.com",
    databaseURL: "https://returnscroll-chat-test.firebaseio.com",
    projectId: "returnscroll-chat-test",
    storageBucket: "returnscroll-chat-test.appspot.com",
    messagingSenderId: "799698114360",
    appId: "1:799698114360:web:cbfb27e64e06d87d2793cd",
    measurementId: "G-TZX3GVXWHF"
  };

firebase.initializeApp(config);

//http는 82번 포트를 사용한다.
http.listen(82, function(){
    //콘솔창에 출력
    console.log('listening on *:82');
});

var rooms = new Array(); // 생성된 방의 정보를 담을 배열,,
// var chatMember = new Array(); // 접속한 멤버들 담을 배열
var roomName = ""; //  방의 이름을 담을 변수,.,

 // 여기 uri로 들어왔을 때 실행되는 함수
io.on('connection', function (socket) {
    //console.log('한명의 유저가 접속을 했습니다.');

    console.log('소켓통신 connect');
    socket.on('disconnect', function(){
        console.log('소켓통신 disconnect');
    });

    //처음들어왔을때 membernick값 받기
    socket.on('send_userid', function(user_id){
       
        console.log('send_userid : '+ user_id );
        socket.userId = user_id;
        socket.join(socket.room);
        //다시, 소켓을 통해 이벤트를 전송한다
        io.emit("send_userid_android",user_id);
    
    });
  

     //맨 처음 안드로이드 위치값 받기 (sts)
     socket.on('send_a_latlng', function(userid,lat,lng){
       
        console.log('send_a_latlng : '+ userid+"/" +lat +","+ lng );
        //처음 위치값을 보내줌 -> (sts)
        io.emit('send_a_latlng_server',userid, lat,lng);
    });

    //방에 들어온 안드로이드 유저 위치값 받기
    socket.on('send_room_a_latlng', function(userid,lat,lng){
        console.log('send_room_a_latlng : '+ userid +"/" +lat +","+ lng );
               
        //socket.emit('send_room_latlng_server',socket.userId, lat,lng);
        //방에 위치값 뿌려줌
        //socket.broadcast.to(socket.room).emit('send_room_a_latlng_server',userid, lat,lng);
        //io.emit('send_room_a_latlng_server',userid, lat,lng);
       // console.log('send_room_latlng_broadcat_server : '+ userid +"/" +lat +","+ lng );
    });

     //방에 들어온 웹 유저 위치값 받기
     socket.on('send_room_w_latlng', function(userid,lat,lng){
        console.log('send_room_w_latlng : '+ userid +"/" +lat +","+ lng );
        //socket.emit('send_room_latlng_server',socket.userId, lat,lng);
        //방에 위치값 뿌려줌
       // socket.broadcast.to(socket.room).emit('send_room_w_latlng_server',userid, lat,lng);
        //io.emit('send_room_w_latlng_server',userid, lat,lng);
        //console.log('send_room_w_latlng_broadcat_server : '+ userid +"/" +lat +","+ lng );
    });
    //////////////
    //웹요청하기
    socket.on('request_room_w_latlng', function(userid,memberid){
        console.log(`${userid}가 ${memberid}에게 위치 요청`)
       
        socket.broadcast.to(socket.room).emit('request_room_w_latlng_server',userid, memberid);
        
        // io.emit('send_room_a_latlng_server',userid, lat,lng);
        // console.log('send_room_latlng_broadcat_server : '+ userid +"/" +lat +","+ lng );
    });

    socket.on('send_member_w_latlng', function(userid,lat, lng, start, arrive){
        console.log(`${userid}한테 위치 보냄 ${lat} / ${lng} /${start} /${arrive}`)
        socket.broadcast.to(socket.room).emit('send_member_w_latlng_server',userid,lat, lng,start,arrive);
    });

     //안드로이드 요청하기
     socket.on('request_room_a_latlng', function(userid,memberid){
        console.log(`${userid}가 ${memberid}에게 위치 요청`)
       
        socket.broadcast.to(socket.room).emit('request_room_a_latlng_server',userid, memberid);
        
        // io.emit('send_room_a_latlng_server',userid, lat,lng);
        // console.log('send_room_latlng_broadcat_server : '+ userid +"/" +lat +","+ lng );
    });

    socket.on('send_member_a_latlng', function(userid,lat, lng, start, arrive){
        console.log(`${userid}한테 위치 보냄 ${lat} / ${lng} /${start} /${arrive}`)
        socket.broadcast.to(socket.room).emit('send_member_a_latlng_server',userid,lat, lng,start,arrive);
    });

     //웹-안드로이드 요청하기
     socket.on('request_room_wa_latlng', function(userid,memberid){
        console.log(`${userid}가 ${memberid}에게 위치 요청`)
       
        socket.broadcast.to(socket.room).emit('request_room_wa_latlng_server',userid, memberid);
        
        // io.emit('send_room_a_latlng_server',userid, lat,lng);
        // console.log('send_room_latlng_broadcat_server : '+ userid +"/" +lat +","+ lng );
    });

    socket.on('send_member_wa_latlng', function(userid,lat, lng, start, arrive){
        console.log(`${userid}한테 위치 보냄 ${lat} / ${lng} /${start} /${arrive}`)
        socket.broadcast.to(socket.room).emit('send_member_wa_latlng_server',userid,lat, lng,start,arrive);
    });

     //안드로이드-웹 요청하기
     socket.on('request_room_aw_latlng', function(userid,memberid){
        console.log(`${userid}가 ${memberid}에게 위치 요청`)
       
        socket.broadcast.to(socket.room).emit('request_room_aw_latlng_server',userid, memberid);
        
        // io.emit('send_room_a_latlng_server',userid, lat,lng);
        // console.log('send_room_latlng_broadcat_server : '+ userid +"/" +lat +","+ lng );
    });

    socket.on('send_member_aw_latlng', function(userid,lat, lng, start, arrive){
        console.log(`${userid}한테 위치 보냄 ${lat} / ${lng} /${start} /${arrive}`)
        socket.broadcast.to(socket.room).emit('send_member_aw_latlng_server',userid,lat, lng,start,arrive);
    });
    

///////////////////위치변경
    //안드로이드에서 위치변경 값 받기 
    socket.on('send_a_latlng2', function(userid,lat,lng){
        console.log('send_a_latlng2 : '+ userid+"/" +lat +","+ lng );
       //서버에서 sts로 안드로이드 위치변경 보냄
       io.emit('send_a_latlng2_server',userid, lat,lng);
   });

   //안드로이드에서 변경된 위치값 룸으로 받음
   socket.on('send_room_a_latlng2', function(userid,lat,lng){
    console.log('send_room_a_latlng2 : '+ userid +"/" +lat +","+ lng );
    
    //socket.emit('send_room_latlng2_server',socket.userId, lat,lng);
    //룸에 변경된 안드로이드 위치값 뿌려줌
    socket.broadcast.to(socket.room).emit('send_room_a_latlng2_server',userid, lat,lng);
   // io.emit('send_room_a_latlng2_server',userid, lat,lng);
    console.log('send_room_a_latlng_broadcat2_server : '+userid +"/" +lat +","+ lng );
    });

     //웹에서 위치변경 값 받기 
     socket.on('send_room_w_latlng2', function(userid,lat,lng){
        console.log('send_room_w_latlng2 : '+ userid+"/" +lat +","+ lng );
        //룸에서 웹 위치값 변경 뿌려줌
        socket.broadcast.to(socket.room).emit('send_room_w_latlng2_server',userid, lat,lng);
       // io.emit('send_room_w_latlng2_server',userid, lat,lng);
        console.log('send_room_w_latlng_broadcat2_server : '+userid +"/" +lat +","+ lng );
   });


    // 클라이언트가 이름을 보내면 처리하는 이벤트 핸들러 => on()
    socket.on('s_send_userName',(user_id,user_name, time, room_num)=> {
        // console.log(user_name, time)
        // 1. 접속한 유저 정보를 소켓(클라이언트를 식별하는 객체)에 기록
        socket.user_id     = user_id
        socket.user_name   = user_name
        socket.room        = room_num
        socket.connectTime = time
        // 2. 방에 조인
        socket.join(socket.room)
        // 3. 기존방에 있던 멤버들에게 전송
        // socket.broadcast.to(socket.room)
        // .emit('c_send_msg', '관리자', `${socket.user_name}님이 입장하였습니다.`, '')
        // // 4. 방금 조인은 유저에게 반송
        // socket.emit('c_send_msg','관리자',`${socket.user_name}님 환영합니다.`, '')
        // // 5. 접속한 유저에게 방정보 전송
        // socket.emit('c_send_roomInfo', rooms, socket.room)

        var room = Number(socket.room);

        // 접속한 방의 정보 알아냄.
        var selectSql = "SELECT roomId, roomName, roomDate FROM chatroom WHERE roomId = ?"
        connection.query(selectSql, [room], function(err, result){
            // firebase에서 데이터 찾아냄
            firebase.database().ref('/chatingRoom/'+result[0].roomId).once('value',function(data){
                var roomId = data.val();
                if(roomId == null){
                    // 방정보가 저장된 적 없을때 => 방정보랑 접속한 유저정보 같이 저장
                    console.log(result[0].roomName); // 방이름
                    var chatRoom ={
                        chatRoomId : room,
                        chatRoomName : result[0].roomName,
                        entryDate : new Date()
                    }
                    socket.emit('c_send_roomInfo', rooms, socket.room)
                    // 채팅방 update
                    var updates = {};
                    updates['/chatingRoom/'+ result[0].roomId ] = chatRoom;
                    firebase.database().ref().update(updates);
                    var updates2 = {};
                    updates2['/chatingRoom/'+ result[0].roomId +'/chatRoomUser/'+user_id+'/connect'] = true;
                    firebase.database().ref().update(updates2);
                    // 방금 조인은 유저에게 반송
                    socket.emit('c_send_msg','관리자',`${socket.user_name}님 환영합니다.`, '')
                }else{
                    // 방의 정보가 있을 때 => 처음접속(방에 chatRoomUser를 update), 접속중(메세지 보여줌), 접속한 적 있을 때(connect값을 true로 수정)
                    // 방에 유저가 접속해있는지의 여부 확인함. (connect값 )
                    firebase.database().ref('/chatingRoom/'+room_num+'/chatRoomUser').once('value',function(data){
                        var userIdObj = data.val();  // 방에 접속중인 유저의 리스트
                        var userId = Object.keys(userIdObj); // 결과 값의 key값을 뽑아내기
                        console.log('접속중인 유저의 아이디 : '+userId);

                        //  접속한 유저 수 만큼 반복
                        for(var i in userId){
                            // 방안에 접속해 있는 유저 불러오기 (채팅방에- 들어왔을 때 새로고침이 되도록)
                            console.log('방안에'+i+'번 userId : '+userId[i]);
                            
                            // 유저정보  불러옴
                            firebase.database().ref('/Users/'+userId[i]+'/chatingRoom/'+room_num).once('value',function(data){
                                var value = data.val();
                                console.log('value '+value.connect+'/'+value.user_nick);
                                if(value.connect == true){  // 접속해 있으면
                                    //socket.emit('c_send_member',userId[i],value.user_nick);
                                    socket.emit('c_send_updateMember',value.user_nick);
                                }
                            })
                            // 파이어베이스 저장된 유저 아이디 == 접속한 유저 아이디 => 접속한 적이 있다는 뜻
                            if(userId[i] == user_id){ 
                                firebase.database().ref('/chatingRoom/'+room_num+'/chatRoomUser/'+userId[i]+'/connect').once('value',function(data){
                                    var connect = data.val();
                                    console.log(userId[i]+'의 connect값은 '+connect);
                                    if(connect == true){
                                        // 메세지 불러옴
                                        msg(room_num,userId[i]);
                                    }else{
                                        // connect의 값이 false인 경우 => 다시 접속여부를 true로 바꿈
                                        var updates={};
                                        updates['/chatingRoom/'+ result[0].roomId +'/chatRoomUser/'+user_id+'/connect'] = true;
                                        firebase.database().ref().update(updates);
                                    }
                                })
                            }else{ //처음접속했다는 뜻
                                // 5. 접속한 유저에게 방정보 전송
                                socket.emit('c_send_roomInfo', rooms, socket.room)

                                // 처음 접속한 사람의 정보를 방정보에 넣어줌
                                var updates={};
                                updates['/chatingRoom/'+ result[0].roomId +'/chatRoomUser/'+user_id+'/connect'] = true;
                                firebase.database().ref().update(updates);
                            }
                        }
                    });
                }
            })
        })

        // 접속중일 경우 메세지를 불러올때
        function msg(room_num,userId){
            firebase.database().ref('/chatingRoom/'+room_num+'/messages').once('value',function(data){
                var postKey = data.val();
                if(postKey == null){
                    console.log('메세지 키 값 : '+postKey+' / 메세지 없으므로 return');
                    return;
                }else{
                    var msgKey = Object.keys(postKey); // 결과 값의 key값을 뽑아내기
                    console.log(msgKey);
                    for(var i in msgKey){
                        console.log('post키값'+ msgKey[i]);

                        firebase.database().ref('/chatingRoom/'+room_num+'/messages/'+msgKey[i]).once('value',function(data){
                            var msgKeyValue = data.val();
                            //console.log('message ㅣ '+msgKeyValue.message);
                            console.log('msg값 : '+msgKeyValue.message+'/'+msgKeyValue.senddate+'/'+msgKeyValue.sender);
                            var sender = msgKeyValue.senderNick;
                            var msg = msgKeyValue.message;
                            var sendDate = msgKeyValue.senddate;

                            socket.emit('c_send_msg', sender, msg, sendDate)
                        })
                    }
                }
            });
        }
        
        var userInfo={
            connect : true,
            user_nick : user_name
        };
        var updates = {};
        updates['/Users/'+ socket.user_id+'/chatingRoom/'+room_num] =userInfo;
        firebase.database().ref().update(updates);
    })




    // 디비에 값을 넣고 삭제하기 위해 회원의 아이디를 받아서 소켓에 저장해둠
    socket.on('s_send_userId',(user_id,room_num)=>{
        // 유저 별 채팅방 접속 리스트
        var userRoomData = {
            chatRoomNo: room_num,
            userId:user_id,
            connect : true
        };
        var updates = {};
        updates['/UsersRooms/'+ user_id +'/'+ room_num] = userRoomData;
        firebase.database().ref().update(updates);
    });
    
    // 클라이언트가 메세지를 보내면 방송한다
    socket.on('s_send_msg', (msg, time)=>{
        // 이 방에 있는 모든 멤버들한테 방송
        console.log('메세지를 보낸 사람', socket.user_name)
        io.sockets.in( socket.room ).emit('c_send_msg', socket.user_name, msg, time)

        var newPostKey = firebase.database().ref().child('posts').push().key;
        var msg = {
            sender: socket.user_id,
            senderNick : socket.user_name,
            message:msg,
            senddate: new Date()
        };
        var updates = {};
        updates['/chatingRoom/'+socket.room+'/messages/'+ newPostKey] = msg;
        firebase.database().ref().update(updates);
        
    })
    // 버튼으로 보내기 했을 때
    socket.on('s_send_msg_btn', (room_id, user_id,user_nick, msg, time)=>{
        // 이 방에 있는 모든 멤버들한테 방송
        console.log('메세지를 보낸 사람', user_nick,' 방번호 ',room_id);
        io.sockets.in( room_id ).emit('c_send_msg', user_nick, msg, time)

        var newPostKey = firebase.database().ref().child('posts').push().key;
        var msg = {
            sender: user_id,
            senderNick : user_nick,
            message:msg,
            senddate: new Date()
        };
        var updates = {};
        updates['/chatingRoom/'+room_id+'/messages/'+ newPostKey] = msg;
        firebase.database().ref().update(updates);
        
    })

    // 접속중일 경우 메세지를 불러올때
    function msgView(room_num){
        firebase.database().ref('/chatingRoom/'+room_num+'/messages').once('value',function(data){
            var postKey = data.val();
            var msgKey = Object.keys(postKey); // 결과 값의 key값을 뽑아내기
            console.log(msgKey);
            for(var i in msgKey){
                console.log('post키값'+ msgKey[i]);

                firebase.database().ref('/chatingRoom/'+room_num+'/messages/'+msgKey[i]).once('value',function(data){
                    var msgKeyValue = data.val();
                    //console.log('msg값 : '+msgKeyValue.message+'/'+msgKeyValue.senddate+'/'+msgKeyValue.sender);
                    var sender = msgKeyValue.senderNick;
                    var msg = msgKeyValue.message;
                    var sendDate = msgKeyValue.senddate;

                    socket.emit('c_send_msg', sender, msg, sendDate);
                })
            }
        });
    }

    // 버튼의 상태를 저장함
    socket.on('btn_status',(room_num, unick)=>{
        firebase.database().ref('/chatingRoom/'+room_num+'/messages').once('value',function(data){
            var postKey = data.val();
            var msgKey = Object.keys(postKey); // 결과 값의 key값을 뽑아내기
            console.log(msgKey);
            for(var i in msgKey){
                console.log('post키값'+ msgKey[i]);
                firebase.database().ref('/chatingRoom/'+room_num+'/messages/'+msgKey[i]).once('value',function(data){
                    var msgKeyValue = data.val();
                    console.log('버튼의 상태를 알기위함 : '+msgKeyValue.object, msgKeyValue.status);
                    // 출발 or 도착을 한 대상의 아이디가 입장한 사람의 아이디와 같을때 . 
                    if(msgKeyValue.object == unick){
                        if(msgKeyValue.status == 'start'){
                            socket.emit('btn_status_show','start');
                        }else if(msgKeyValue.status == 'end'){
                            socket.emit('btn_status_show','end');
                        }
                    }

                    // console.log('msg값 : '+msgKeyValue.message+'/'+msgKeyValue.senddate+'/'+msgKeyValue.sender);
                    // var sender = msgKeyValue.senderNick;
                    // var msg = msgKeyValue.message;
                    // var sendDate = msgKeyValue.senddate;

                    // socket.emit('c_send_msg', sender, msg, sendDate)
                })
            }
        });
    })

    socket.on('status_delete',(room_num, unick)=>{
        firebase.database().ref('/chatingRoom/'+room_num+'/messages').once('value',function(data){
            var postKey = data.val();
            var msgKey = Object.keys(postKey); // 결과 값의 key값을 뽑아내기
            for(var i in msgKey){
                firebase.database().ref('/chatingRoom/'+room_num+'/messages/'+msgKey[i]).once('value',function(data){
                    var msgKeyValue = data.val();
                    console.log('삭제할거 : '+msgKeyValue.object, msgKeyValue.status);
                    // 출발 or 도착을 한 대상의 아이디가 입장한 사람의 아이디와 같을때 . 
                    if(msgKeyValue.object == unick && msgKeyValue.status =='start'){
                        firebase.database().ref('/chatingRoom/'+room_num+'/messages/'+msgKey[i]).remove();
                    }
                })
            }
        });
    })

    // 멤버가 도착지를 입력하고 길찾기를 시작했을 때. userId가 접속자, memberId가 확인하고 싶은 사람
    socket.on('send_start_user', (msg, userId, memberId,room_num, date)=>{
        console.log(userId+'가 '+memberId+'이 출발했다는 정보를 받음');
        console.log('출발 메세지 내용은 ? '+msg)

        var newPostKey = firebase.database().ref().child('posts').push().key;

        console.log('룸넘버 : '+room_num);
        var msg = {
            sender: 'admin',
            senderNick : '관리자',
            message:msg,
            senddate: new Date(),
            object : userId,
            status : 'start'
        };

        var updates = {};
        updates['/chatingRoom/'+room_num+'/messages/'+ newPostKey] = msg;
        firebase.database().ref().update(updates);
        msgView(room_num);

        socket.broadcast.to(socket.room).emit('c_send_msg', '관리자', msg, date);
    })
    // 멤버가 도착을 했을 때, 길찾기를 종료했을 때. userId가 접속자, memberId가 확인하고 싶은 사람
    socket.on('send_end_user', (msg, userId, memberId,room_num, date)=>{
        console.log(userId+'가 '+memberId+'이 도착했다는 정보를 받음');
        console.log('도착 메세지 내용은 ? '+msg)
        var newPostKey = firebase.database().ref().child('posts').push().key;

        var msg = {
            sender: 'admin',
            senderNick : '관리자',
            message:msg,
            senddate: new Date(),
            object : userId,
            status : 'end'
        };

        var updates = {};
        updates['/chatingRoom/'+room_num+'/messages/'+ newPostKey] = msg;
        firebase.database().ref().update(updates);
        msgView(room_num);
        socket.broadcast.to(socket.room).emit('c_send_msg','관리자',msg,date);
    })

    // 클라이언트가 현재 접속중인 방의 리스트를 골라서 보내준다.
    socket.on('s_chating_room',(user_id)=>{
        console.log('======================현재 접속중인 채팅방========================')
        firebase.database().ref('/Users/'+user_id+'/chatingRoom').once('value',function(data){
            if(data.val() == null){
                // 채팅방에 접속중인 리스트가 없을 경우
                socket.emit('c_chating_room_none');
            }else{
                // 접속중인 채팅방이 있을 경우
                var roomId = data.val();
                var keys = Object.keys(roomId); // 결과 값의 key값을 뽑아내기
                console.log(keys);
                
                var connectRoomList = new Array();
                for(var i in keys){
                    // console.log('key값들 : '+ keys[i]);
                    getRoom(user_id, keys[i], connectRoomList, keys.length);

                }
            }
        });
    });

    // 접속중인 방 리스트 불러오기
    var count = 0;
    async function getRoom(user_id, key, connectRoomList, len) {
        await firebase.database().ref('/Users/'+user_id+'/chatingRoom/'+key+'/connect').once('value',function(data){
            var connectResult = data.val();
            // console.log(key+'방의 connect값 : '+connectResult)
            if(connectResult === true){
                // 접속중인 방들 
                connectRoomList.push(key);
            }

            count++;
            if(count == len) {
                console.log('접속중인 방의 리스트 : '+connectRoomList);
                for(var i=0;i<connectRoomList.length;i++){
                    // console.log(connectRoomList[i]);
                    var sql = "SELECT roomId, roomName FROM chatroom WHERE roomId = ?";
                    connection.query(sql, [connectRoomList[i]],function(err,rows){
                        if(err)console.log('방정보 불러오기 err : '+err);
                        // console.log("방정보 : "+rows);
                        socket.emit('c_chating_room_list',rows);
                    });
                }
            }
        });
    }


    // 채팅방 나가기를 한 유저와 그 방의 번호
    socket.on('s_chatRoom_exit',(user_id, room_num)=>{
        
        console.log('접속해제 할 사람 : '+user_id+ ', 접속해제할 방번호 : '+room_num)
        var sql = "DELETE FROM chatuser WHERE chatUserId = ? AND chatRoomId = ?";
        var user = user_id;
        var room = Number(room_num);
        // MYSQL 데이터 삭제
        connection.query(sql, [user, room], function(err, rows){
            if(err){
                console.log('채팅방퇴장 회원 DB 삭제 실패!!!!!!!!!!!!!!!!!!!!!!!! => '+err)
            }else{
                if(rows.affectedRows > 0){
                    console.log('정상처리됨');
                }else{
                    console.log('에러처리,,')
                }
            }
        })

        // 현재 채팅방에 참여중인 멤버들의 리스트를 불러옴
        // var room = Number(room_num);
        // var sql = "SELECT ch.chatUserId AS uid, ch.chatRoomId AS roomId, u.nick AS nick";
        // sql += " FROM chatuser ch, users u";
        // sql += " WHERE ch.chatRoomId = ? AND ch.chatUserId = u.uid;";

        // var execSql = connection.query(sql, [room], function(err, rows){
        //     if(err)console.log('select 실패'+err)
        //     else{
        //         console.log('rows '+rows[0]);
        //         console.log('소켓 룸 정보 : '+socket.room)
        //         socket.broadcast.to(socket.room).emit('c_send_updateMember', rows);
        //     }
        // })

        // 방에서 나간 유저 connect 정보 수정
        var updates = {};
        updates['/Users/'+ user_id +'/chatingRoom/'+room_num+'/connect'] = false;
        firebase.database().ref().update(updates);
        // 
        var updates2 = {};
        updates2['/chatingRoom/'+ room_num +'/chatRoomUser/'+user_id+'/connect'] = false;
        firebase.database().ref().update(updates2);

        socket.broadcast.to(socket.room)
            .emit('c_send_msg', '관리자', `${socket.user_name}님이 퇴장하였습니다.`, new Date())   
    
    
    })
    
    // 클라이언트가 방을 바꿔달라고 했다, 변경하고 정보 전송
    // socket.on('s_send_roomChg',(newRoom)=>{
    //     // 1. 기존방에서 떠난다
    //     socket.leave(socket.room)
    //     // 2. 기존 방 멤버들에게 방송
    //     socket.broadcast.to(socket.room)
    //         .emit('c_send_msg', '관리자', `${socket.user_name}님이 퇴장하였습니다.`, new Date())

    //     // 3. 새로운 방 진입 절차 시작
    //     // 3-1. 방정보 설정
    //     socket.room = newRoom
    //     // 3-1-1. 조인
    //     socket.join(socket.room)
    //     // 3-2. 새로운 방 멤버들에게 방송
    //     socket.broadcast.to(socket.room)
    //     .emit('c_send_msg', '관리자', `${socket.user_name}님이 입장하였습니다.`, new Date())   
    //     // 3-3. 본인한테 방송
    //     socket.emit('c_send_msg', '관리자', `${socket.user_name}님 환영합니다.`, new Date())
    //     // 3-4. 새로운 방정보 방송
    //     socket.emit('c_send_roomInfo',rooms, socket.room)
    // })

    // 친구추가
    socket.on('s_add_friend', (sender, recipient)=>{
        console.log(sender+'님이 '+recipient+'님을 초대하려함.');
        var data = [sender, recipient];

        var selectSql = "SELECT * FROM friendadd WHERE sender = ? AND recipient = ? AND confirmation = 1";
        connection.query(selectSql, data,  function(err, result){
            if(err)console.log(err)
            else{
                // 결과 값이 없을 때 즉, 친구신청을 한번도 한 적이 없을때
                if(result == false){
                    // 친구신청하는 테이블에 데이터 추가
                    console.log("친구신청을 한번도 한 적이 없는 상태. friendadd 테이블에 데이터 추가")
                     
                    var friendSelect = "SELECT * FROM friendlist WHERE userId = ? AND friendId = ?" 
                    // 일방적인 친구관계인지 검사
                    connection.query(friendSelect,[recipient,sender],function(err, results){
                        if(results == false){
                            // 결과 null이면
                            var sql = "INSERT INTO friendadd (sender, recipient, confirmation) VALUES (?,?,0)"
                            var execSql = connection.query(sql, [sender, recipient], function(err, rows){
                                if(err){
                                    console.log('친구추가 실패 => '+err)
                                    socket.emit('c_add_friend_result', '이미 추가된 친구입니다.');
                                }else{
                                    if(rows.affectedRows > 0){
                                        socket.emit('c_add_freind_result', recipient+' 님에게 친구 신청을 했습니다.');
                                    }else{
                                        console.log('친구추가 에러')
                                        socket.emit('c_add_friend_result', '이미 추가된 친구입니다.');
                                    }
                                }
                            })
                        }else{
                            // 결과값이 있을 때, 즉 일방적인 친구 일때
                            var data = [sender, recipient];
                            var friendInsert = "INSERT INTO friendList VALUES (NULL,?,?)";
                            connection.query(friendInsert,data,function(err, rows){
                                if(err)console.log(err)
                                else{
                                    socket.emit('c_add_friend_result', recipient+'님이 친구 리스트에 추가되었습니다');
                                }
                            })
                        }
                    })
                }
                // 친구신청을 한번이라도 한 사이 일 때.
                else{ 
                    // 현재 친구사이인지 검사
                    console.log("친구신청을 한번이라도 한 상태")
                    var friendSelect = "SELECT * FROM friendlist WHERE userId = ? AND friendId = ?" 
                    connection.query(friendSelect,data,function(err, results){
                        if(err)console.log(err)
                        else{
                            // 결과값이 null일때, 현재 친구가 아니라는 뜻. => 친구신청(add테이블)
                            if(results == false){
                                // 일방적인지 검사 (sender랑 recipient 바꿔서 검사)
                                var friendSelect = "SELECT * FROM friendlist WHERE userId = ? AND friendId = ?" 
                                // 일방적인 친구관계인지 검사
                                connection.query(friendSelect,[recipient,sender],function(err, results){
                                    if(err)console.log(err)
                                    else{
                                        if(results == false){
                                            // 결과값이 없을 때, 즉 일방이 아닐때 (친구추가)
                                            // 친구신청 다시
                                            console.log("친구신청을 다시")
                                            // add 테이블의 데이터 삭제한 후, 다시 insert
                                            var deleteAddFriend = "DELETE FROM friendadd WHERE sender = ? AND recipient = ?"
                                            connection.query(deleteAddFriend,[sender, recipient],function(err,rows){
                                                if(err)console.log(err)
                                                else{
                                                    console.log('friendadd 테이블의 데이터를 삭제하였습니다. ')
                                                    // 친구신청하는 테이블에 데이터 추가
                                                    var sql = "INSERT INTO friendadd (sender, recipient, confirmation) VALUES (?,?,0)"
                                                    var execSql = connection.query(sql, [sender, recipient], function(err, rows){
                                                        if(err){
                                                            //console.log('친구추가 실패 => '+err)
                                                            socket.emit('c_add_friend_result', ' 친구추가 실패');
                                                        }else{
                                                            if(rows.affectedRows > 0){
                                                                socket.emit('c_add_freind_result', recipient+' 님에게 친구 신청을 했습니다.');
                                                            }else{
                                                                //console.log('친구추가 에러')
                                                                socket.emit('c_add_friend_result', '친구추가 실패');
                                                            }
                                                        }
                                                    })
                                                }
                                            })
                                            //socket.emit('c_add_friend_result', recipient+'님 과는 현재 친구사이입니다');
                                        }else{
                                            // 결과값이 있을 때, 즉 일방적인 친구 일때
                                            var data = [sender, recipient];
                                            var friendInsert = "INSERT INTO friendList VALUES (NULL,?,?)";
                                            connection.query(friendInsert,data,function(err, rows){
                                                if(err)console.log(err)
                                                else{
                                                    socket.emit('c_add_friend_result', recipient+'님이 친구 리스트에 추가되었습니다');
                                                }
                                            })
                                        }
                                    }
                                })


                            }     
                            
                        }
                    })
                }
            }
        });


        // console.log("실제 수행된 INSERT sql문 확인 : "+execSql.sql);

        // recipient한테 친구신청이 왔다는 것을 알려줘야지  

    });

});
 