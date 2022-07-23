const express = require('express');
const router = express.Router();
const registFunction = require('./MET/regist');
const loginLogoutFunction = require('./MET/loginLogout');
const infoAdminFunction = require('./MET/infoAdmin');
const checkCookie = require('./MET/checkCookie');
const findFunction = require('./MET/find');
const communityFunction = require('./MET/community');
const cashChargeFunction = require('./MET/cashCharge');
const cashCancelFunction = require('./MET/cashCancel');
const purchaseFunction = require('./MET/product');
const dbReserved = require('../../T/dbReserved');


/*
현재 로그인이 되있는지 확인하는 요청
true일 경우 로그인은 되있음 권한 값 받음
false일 경우 로그인 되있지 않음
*/
router.post('/checkToken', (req, res)=>{
    checkCookie.cookie_check_f(req, res);
});

/*
reqtkn (회원가입)
    body
        id: 아이디
        pw: 비밀번호
        email: 이메일
        name: 이름
        phone: 전화번호
        address: 주소
certkn (회원가입 인증)
    body
        cert: 메일로 받은 인증문자
*/
router.post('/regist/:target', (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'reqtkn'){
        registFunction.regist_f(req, res);
    } else if(target_id === 'certkn'){
        registFunction.regist_cert_f(req, res);
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});


/*
login (로그인)
    body
        id: 아이디
        pw: 비밀번호
*/
router.post('/login', (req, res)=>{
    loginLogoutFunction.login_f(req, res);
});

/*
logout (로그아웃)
*/
router.post('/logout', (req, res)=>{
    loginLogoutFunction.logout_f(req, res); 
});

/*
admini (데이터 삽입)
    body
        table: 테이블명
        valueName: 데이터가 들어갈 컬럼명
        value: 값
adminr (데이터 조회)
    query
        page: 페이지 번호 조정
        pageSize: 페이지 사이즈 조정
    body
        table: 테이블명
        colname: 조회할 컬럼명
        condition: 조건 삽입
find (비밀번호 찾기)
    body
        id: 아이디
        email: 이메일
find (아이디 찾기)
    body
        email: 이메일
    
*/
router.post('/info/:target', async (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'admini'){
        infoAdminFunction.info_admin_insert_f(req, res);
    } else if(target_id === 'adminr'){
        infoAdminFunction.info_admin_select_f(req, res);
    } else if(target_id === 'findpw'){
        findFunction.find_f(req, res);
    } else if(target_id === 'findid'){
        findFunction.find_id_f(req, res);
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

/*
board (게시글 쓰기)
    body
        title       : 글 제목
        content     : 글 내용
        hideLevel   : 공개범위 (0 all, 1 friend,follower, 2 friend, 3 myself)
        type        : 글 종류 (1 none, 2 humor, 3 info, 4 notice <- 관리자만 올릴 수 있음) 
*/
router.post('/community/board', communityFunction.write_board_f);

/*
follow (팔로우 하기)
    body
        boardIndex: 팔로우 할 id가 올린 게시글 번호
        followId: 팔로우 할 id
block (차단 하기)
    body
        boardIndex: 팔로우 할 id가 올린 게시글 번호
        blockId: 팔로우 할 id
comment (댓글 달기)
    body
        content: 댓글 내용
        bindex: 댓글을 달 게시글 번호
objectboard (게시글 신고하기)
    body
        bindex: 신고할 게시글 번호
        because: 신고사유
objectcomment (댓글 신고하기)
    body
        bindex: 신고할 게시글 번호
        because: 신고사유
*/
router.post('/community/:target', (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'follow'){
        communityFunction.regist_follow_f(req, res);
    } else if(target_id === 'block'){
        communityFunction.regist_block_f(req, res);
    } else if(target_id === 'comment'){
        communityFunction.write_comment_f(req, res);
    } 
    // else if(target_id === 'objectboard'){
    //     communityFunction.object_board_f(req, res);
    // } else if(target_id === 'objectcomment'){
    //     communityFunction.object_comment_f(req, res);
    // } 
    else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

/*
requid (캐쉬 충전 주문번호요청)
    body
        price: 충전할 금액 (필수)
        email: 이메일
        phone: 휴대폰 번호 (필수)
        address: 이메일 주소

success (캐쉬 충전 성공시 사용)
    body
        imp_uid: 주문번호 (필수)
        merchant_uid: 고유번호 (필수)
        name: 주문자 이름
        orderName: 제품 이름
        phone: 휴대폰 번호
        email: 응답받은 이메일
        address: 응답받은 주소
        price: 결제금액

cancel (결제 취소)
    body
        imp_uid: 주문번호 (필수)
        merchant_uid: 고유번호 (필수)

resulthook (결제 훅)
    body
        imp_uid
        merchant_uid
*/
router.post('/cash/:target', (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'test'){
        res.status(200).end("테스트 훅");
    } else if(target_id === 'requid'){
        cashChargeFunction.request_uid_f(req, res);
    } else if(target_id === "success"){
        cashChargeFunction.pay_success_f(req, res);
    } else if(target_id === "cancel"){
        cashCancelFunction.cancle_pay_f(req, res);
    } else if(target_id === "resulthook"){
        cashChargeFunction.pay_result_hook_f(req, res);
    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

/*
gun
    query
        type: 조회할 상점 타입 (0-gun, 1-car)
        num: 구매할 상품 번호
*/
router.post('/shop/:target', (req, res)=>{
    let target_id = req.params.target;

    if(target_id === 'what'){
        purchaseFunction.purchase_whatever_f(req, res);
    } else if(false){

    } else{
        res.status(400).send({
                result: '잘못된 URL 파라미터 값을 입력했습니다.',
                cose: 400
            }
        );
    }
});

module.exports = router;