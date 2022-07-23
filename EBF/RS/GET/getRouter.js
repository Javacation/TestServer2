const path = require('path');
const express = require('express');
const router = express.Router();
const communityFunction = require('./MET/community');
const infoFunction = require('./MET/info');
const infoAdminFunction = require('./MET/infoAdmin');
const infoAnotherFunction = require('./MET/infoAnother');
const cashChargeFunction = require('./MET/cashChargeMobile');
const fileListFunction = require('./MET/fileList');
/*
boards
    query
        page: 글 페이지 (default 1)
        pagesize: 글 페이지 사이즈 (default 10)
        bindex: 해당 번호 이하의 글을 찾아볼 때 전달
        btype: 찾아볼 글 종류 타입 0 - none, 1 - humor, 2 - info, 3 - notice
        bupid: 조회할 ID (아이디 가져옴) pagesize만큼 가져옴
        // ======폐기=========
        isExist: 있는지 확인
        pageIndex: 기본 1, 페이지 번호
        pageSize: 기본 10, 페이지 사이즈
        bindex: 기본 2147480000, 글 번호 (이하로 검색)
        bType: 검색할 글 타입 (없으면 전체검색)
        order: 정렬순서 (없으면 무조건 내림차순)
        findStr: 기본 ('.*') 찾을 문자열
        

        codef: 기본 0, 0 - 인덱스이하로 검색, 1 - 닉네임, 인덱스이하로 검색, 2 - 아이디, 인덱스이하로 검색, 3 - follow검색, 4 - 친구검색, 5 - follow 또는 친구 검색, 6 - 팔로우면서 친구
        codeo: 기본 0, 0 - 인덱스로 정렬, 1 - 좋아요로 정렬, 2 - 조회수로 정렬, 3 - 댓글수로 정렬, 4 - 신고수로 정렬(관리자만)
board
    query
        bindex: 특정 글 번호

comments
    query
        page: 댓글 페이지 (default 1)
        pagesize: 댓글 페이지 사이즈 (default 20)
        cindex: 조회할 댓글 번호 (댓글 가져옴) 1개
        bindex: 조회할 글 번호 (댓글 가져옴) pagesize만큼 가져옴
        cupid: 조회할 ID (아이디 가져옴) pagesize만큼 가져옴

follows
    query
        없음
blocks
    query
        없음
user
    query
        userName 찾으려 하는 유저이름 또는 아이디
        page 기본 1
        pageSize 기본 5
*/
router.get('/community/:target', (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'boards'){
        // communityFunction.read_boards_f(req, res);
        communityFunction.new_read_boards_f(req, res);
    } else if(target_id === 'board'){
        communityFunction.read_board_f(req, res);
    } else if(target_id === 'comments'){
        communityFunction.read_comments_f(req, res);
    } else if(target_id === 'follows'){
        communityFunction.read_all_follower_f(req, res);
    } else if(target_id === 'blocks'){
        communityFunction.read_all_block_f(req, res);
    } else if(target_id === 'newboards' && false){
        // communityFunction.new_read_boards_f(req, res);
    } else if(target_id === 'user'){
        communityFunction.get_user_list_f(req, res);
    } else{
        res.status(400).send({
            result: '잘못된 URL 파라미터 값을 입력했습니다.',
            cose: 400
        });
    }
    
});

/*
    현재 세션의(로그인한 유저의) 비밀번호를 제외한 기본정보
    친구, 소유한 자동차, 소유한 총기, 매치 히스토리를 제공

boards
    query
        page: 페이지 크기 (기본 1)
        pagesize: 페이지 사이즈 크기 (기본 10)
        order: 설정안할경우 DESC

comments
    query
        page: 페이지 크기 (기본 1)
        pagesize: 페이지 사이즈 크기 (기본 10)
        order: 설정안할경우 DESC

admin
    query code: 0 - boards
        id: 조회할 ID
        page: 페이지 크기 (기본 1)
        pagesize: 페이지 사이즈 크기 (기본 10)
        order: 설정안할경우 DESC
    query code: 1 - comments
        id: 조회할 ID
        page: 페이지 크기 (기본 1)
        pagesize: 페이지 사이즈 크기 (기본 10)
        order: 설정안할경우 DESC
    query code: 2 - boardObject
        index: 조회할 글번호
        page: 페이지 크기 (기본 1)
        pagesize: 페이지 사이즈 크기 (기본 10)
    query code: 3 - commentObject
        index: 조회할 댓글번호
        page: 페이지 크기 (기본 1)
        pagesize: 페이지 사이즈 크기 (기본 10)
*/
router.get('/info/:target', async (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'base'){
        infoFunction.base_f(req, res);
    } else if(target_id === 'friend'){
        infoFunction.friends_f(req, res);
    } else if(target_id === 'mycar'){
        infoFunction.mycar_f(req, res);
    } else if(target_id === 'mygun'){
        infoFunction.mygun_f(req, res);
    } else if(target_id === 'matchistory'){
        infoFunction.matchistory_f(req, res);
    } else if(target_id === 'cashistory'){
        infoFunction.cash_history_f(req, res);
    } else if(target_id === 'boards'){
        infoFunction.myboards_f(req, res);
    } else if(target_id === 'comments'){
        infoFunction.mycomments_f(req, res);
    } else if(target_id === 'all'){
        infoFunction.all_f(req, res);
    } else if(target_id === 'admin' && req.query){
        if(parseInt(req.query.code) === 0){
            infoAdminFunction.read_boards_admin_f(req, res);
        } else if(parseInt(req.query.code) === 1){
            infoAdminFunction.read_comments_admin_f(req, res);
        } else if(parseInt(req.query.code) === 2){
            infoAdminFunction.why_object_this_board_f(req, res)
        } else if(parseInt(req.query.code) === 3){
            infoAdminFunction.why_object_this_comment_f(req, res)
        } else{
            res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            });
        }
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

/*
    게임내의 총, 자동차, 트랙, 아이템 정보 제공
*/
router.get('/info/another/:target', async (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'gun'){
        infoAnotherFunction.guninfo_f(req, res);
    } else if(target_id === 'car'){
        infoAnotherFunction.carinfo_f(req, res);
    } else if(target_id === 'track'){
        infoAnotherFunction.trackinfo_f(req, res);
    } else if(target_id === 'item'){
        infoAnotherFunction.iteminfo_f(req, res);
    } else if(target_id === 'user' && req.query){
        if(parseInt(req.query.code) === 0){ // code=0, id
            infoAnotherFunction.user_profile_f(req, res);
        } else if(parseInt(req.query.code) === 1){ // code=1, id, page(default 1)
            infoAnotherFunction.user_match_history_f(req, res);
        } else{
            res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            });
        }
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

/*
    모바일용 충전 함수
*/
router.get('/cash/mobile', (req, res)=>{
    cashChargeFunction.mobile_pay_success_f(req, res);
})

router.get('/file/:type', (req, res)=>{
    if(req.params.type === 'list'){
        fileListFunction.get_all_list_f(req, res);
    } else if(req.params.type === 'games'){
        fileListFunction.get_game_f(req, res);
    } else if(req.params.type === 'servers'){
        fileListFunction.get_server_f(req, res);
    } else if(req.params.type === 'mobiles'){
        fileListFunction.get_mobile_f(req, res);
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

router.get('/', (req,res)=>{
    res.redirect('/main');
});

router.get(/^(\/main)(\/[\w])*/, (req, res)=>{
    res.sendFile(path.join(__dirname, '../../HV', 'index.html'));
});

// router.get(/^.*$/, (req, res)=>{
//     res.redirect('/main/lost');
// });



module.exports = router;