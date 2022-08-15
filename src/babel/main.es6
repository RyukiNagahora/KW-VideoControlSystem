const $ = require('jquery')
const firebaseConfig = {
    apiKey: "AIzaSyB-5mrOUrgavzMvLKP90fx4k8KG_RcYvz4",
    authDomain: "kw-syncvideocontrolesystem.firebaseapp.com",
    projectId: "kw-syncvideocontrolesystem",
    storageBucket: "kw-syncvideocontrolesystem.appspot.com",
    messagingSenderId: "235319764426",
    appId: "1:235319764426:web:ceed119799c82d74759b33"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let _isInit = false
let _player1;


GetParam()
function GetParam()
{
    let param = location.search
    if (param === "?controller")
    {
        $('.controller').css('display', 'block')
    }
}

//
//
$(window).on('load', () => {

    ctrlBtnSettings()

    onYouTubePlayerAPIReady()

    setFbEvent()

    $('.cover').on('click', () => {
        $('.cover').hide()
    })
})

//
//
function ctrlBtnSettings()
{
    $('.play-btn').on('click', function() {
        let vidNum = $(this)[0].getAttribute('vidNum')
        console.log(vidNum);
        var washingtonRef = db.collection("vidState").doc("state");

        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
            state: parseInt(vidNum)
        })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    })
}

//
//
function onYouTubePlayerAPIReady(){
    console.log("YT Ready");
  
    _player1 = new YT.Player("player", { // （"player1"は動画iframeのID）
        videoId: '-LezXrCqXt8',
        events: {
            /* 「onReady:」は、iframe動画の準備が整ったら
                実行されます */
            onReady: function onPlayerReady(e) {
                console.log('on YT Ready')
                _isInit = true
            },
            /* 「onStateChange:」は、iframe動画の状態が変わる事に実行されます。
                「e.data」として渡されるパラメータは以下になります。
                e.data → -1（未開始）
                e.data → 0（終了）        e.data == YT.PlayerState.ENDED
                e.data → 1（再生中）    e.data == YT.PlayerState.PLAYING
                e.data → 2（停止）        e.data == YT.PlayerState.PAUSED
                e.data → 3（ﾊﾞｯﾌｧ中）    e.data == YT.PlayerState.BUFFERING
                e.data → 5（頭出し済み）e.data == YT.PlayerState.CUED
            */
            onStateChange: function(e){
                if (e.data == YT.PlayerState.ENDED || e.data == YT.PlayerState.PAUSED) {
                    // 一時停止・終了した場合
                    console.log('e.data = ' + e.data);
                    $('#yt1 .player-cover').show(); // カバーの表示
                }
            },
        }
    });
}

//
//
function setFbEvent()
{
    db.collection("vidState").doc("state")
    .onSnapshot((doc) => {
        let data = doc.data()
        console.log("Current data: ", data);
        if (data.state == 0)
        {
            playYT(1)
        }
    });
}

//
//
function playYT(num)
{
    if (_isInit)
    {
        _player1.playVideo()
    }
}