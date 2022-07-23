<template>
    <div class="modal-dialog" style="position:fixed; z-index:1501; width:35%; height: auto; min-width:400px;">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <h4 class="modal-title text-align-center">
                    <span>충전창</span>
                </h4>
            </div>
            <form>
                <div class="modal-body">
                    이메일
                    <div class="form-floating mb-3 mt-3">
                        <input 
                        id="emailBox"
                        type="text" 
                        class="form-control"
                        placeholder="a1"
                        disabled> 
                        <label for="emailBox">{{params.myInfoBox[params.requestEmail]}}</label>
                    </div>

                    휴대폰 번호
                    <div class="form-floating mb-3 mt-3">
                        <input 
                        id="phoneBox"
                        type="text" 
                        class="form-control"
                        placeholder="a2"
                        disabled> 
                        <label for="phoneBox">{{params.myInfoBox[params.requestPhone]}}</label>
                    </div>

                    주소
                    <div class="mb-3 mt-3">
                        <input 
                        id="addressBox"
                        type="text" 
                        class="form-control"
                        readonly :value="params.myInfoBox[params.requestAddress]"> 
                    </div>

                    충전할 금액
                    <div class="mb-3 mt-3">
                        <input 
                        id="priceBox"
                        type="text" 
                        class="form-control"
                        :placeholder="params.seletedMoney != '직접입력'? params.seletedMoney: '충전할 금액을 입력해주세요.'"
                        :disabled="params.seletedMoney != '직접입력'"> 
                    </div>

                    <select class="form-select" v-model="params.seletedMoney" @change="methods.selectValueChanger">
                        <option >직접입력</option>
                        <option >1</option>
                        <option >1000</option>
                        <option >5000</option>
                        <option >10000</option>
                        <option >30000</option>
                        <option >50000</option>
                    </select>

                </div>

                <div class="modal-footer">
                    <input type="submit" class="container-fluid btn btn-success" @click.prevent="methods.requestPay" value="충전하기">
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount, watch, Component, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name: 'CashChargeVue',
    setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');
        const route = useRoute();
        const router = useRouter();

        const EmailRegExp = /^([^\W]{3,})@([^\W]{3,})(\.[a-zA-Z]{2,})+$/; // (3글자이상)
        const PhoneRegExp = /^(010){1}[0-9]{8}$/; // 휴대폰번호 12자

        const { IMP } = window;
        

        IMP.init('imp84365986');


        const params = ref({
            seletedMoney: '직접입력',
            myInfoBox: {},
            requestMoney: '',
            requestEmail: 'email',
            requestPhone: 'phone',
            requestAddress: 'address',
        });

        const methods = {
            selectValueChanger: ()=>{
                params.value.requestMoney = params.value.seletedMoney;
            },
            requestPay: async function () {
                var reqPrice = $('#priceBox').attr("placeholder").indexOf("충전");
                var merchant_uid = '';
                var isValid = false;
                if(reqPrice == -1) reqPrice = $('#priceBox').attr("placeholder");
                else reqPrice = $('#priceBox').val();

                console.log(reqPrice? reqPrice: '금액 지정 안했음!');
                console.log(params.value.myInfoBox[params.value.requestEmail]);
                console.log(params.value.myInfoBox[params.value.requestPhone]);
                console.log(params.value.myInfoBox[params.value.requestAddress]);

                if(!reqPrice){
                    store.commit('CREATE_ALERT', {msg:'금액을 지정해주세요!', time: 2, type:"danger"});
                } else if(!Number.isInteger(parseInt(reqPrice))){
                    store.commit('CREATE_ALERT', {msg:'금액을 확인해주세요!', time: 2, type:"danger"});
                } else if(!EmailRegExp.test(params.value.myInfoBox[params.value.requestEmail])){
                    store.commit('CREATE_ALERT', {msg:'이메일 형식을 확인해주세요!', time: 2, type:"danger"});
                } else if(!PhoneRegExp.test(params.value.myInfoBox[params.value.requestPhone])){
                    store.commit('CREATE_ALERT', {msg:'휴대폰 형식을 확인해주세요!', time: 2, type:"danger"});
                } else{
                    var bodyData = {
                        email: params.value.myInfoBox[params.value.requestEmail],
                        phone: params.value.myInfoBox[params.value.requestPhone],
                        address: params.value.myInfoBox[params.value.requestAddress],
                        price: reqPrice,
                    };

                    try{
                        await AXIOS.post('/cash/requid', bodyData)
                        .then((response)=>{
                            merchant_uid = response.data.result;
                            isValid = true;
                        })
                        .catch((error)=>{
                            store.commit('CREATE_ALERT', {msg: error.response.data, time: 2, type:"danger"});
                            console.log(error.response.data);
                        });
                    }
                    catch(error){
                        console.log(error);
                    }
                    
                    if(isValid){
                        let requestData = {
                            pg: "html5_inicis",
                            pay_method: "card",
                            merchant_uid: merchant_uid.substring(0, 39),
                            name: "캐쉬 충전",
                            amount: reqPrice,
                            buyer_email: bodyData.email,
                            buyer_name: store.state.myInfo.name,
                            buyer_tel: bodyData.phone.substr(0, 3) + '-' + bodyData.phone.substr(3, 4) + '-' + bodyData.phone.substr(7, 4),
                            buyer_addr: bodyData.address,
                            buyer_postcode: "",
                            custom_data: merchant_uid,
                            // notice_url: 'http://www.accromemories.p-e.kr/cash/resulthook',
                        };

                        if(store.getters.GET_IS_MOBILE){
                            requestData.m_redirect_url = `https://${window.location.hostname}/cash/mobile?name=${requestData.buyer_name}&ordername=${requestData.name}&email=${requestData.buyer_email}&phone=${requestData.buyer_tel}&addr=${requestData.buyer_addr}&price=${requestData.amount}&custom_data=${requestData.custom_data}&next_url=${route.path}`;
                        } else{
                            requestData.m_redirect_url = undefined;
                        }

                        IMP.request_pay(requestData,
                        (rsp)=>{
                            if(rsp.success){
                                try{
                                    var rspJson = {
                                        "imp_uid": rsp.imp_uid,
                                        "merchant_uid": rsp.custom_data,
                                        "name": rsp.buyer_name,
                                        "orderName": rsp.name,
                                        "email": rsp.buyer_email,
                                        "phone": rsp.buyer_tel,
                                        "address": rsp.buyer_addr,
                                        "price": rsp.paid_amount,
                                    };

                                    AXIOS.post("/cash/success", rspJson)
                                    .then((response)=>{
                                        store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                                        console.log(response.data);
                                    })
                                    .catch((error)=>{
                                        store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                                        console.log(error.response.data);
                                    });
                                }
                                catch(error){
                                    console.log(error);
                                }
                            } else{
                                console.log(rsp);
                            }
                        });
                    } else{
                        store.commit('CREATE_ALERT', {msg: "결제 요청 실패", time: 2, type:"danger"});
                    }
                }
            },
        };

        onMounted(async ()=>{
            store.commit('LOGIN_CHECK');

            if(!store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그인 후 이용해주시기 바랍니다.', time: 2, type:"danger"});

                store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
            }
            else{
                try{
                    var s = await store.commit('UPDATE_INFO');
                    params.value.myInfoBox = store.getters.GET_MY_INFO;

                    console.log(params.value.myInfoBox);
                    params.value.seletedMoney = '직접입력';
                }
                catch(error){
                    console.log(error);

                    store.commit('CREATE_ALERT', {msg:'정보를 불러오는 중 문제가 발생했습니다.', time: 2, type:"danger"});

                    store.commit('CLOSE_FOREGROUND');
                }
            }
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
</style>