<template>
    <div class="modal-dialog" style="position:fixed; z-index:1501; width:35vw; height: auto; min-width:300px; max-width:600px;">
        <div class="modal-content awesome-scroll" style="max-height: 500px; overflow-y: scroll; overflow-x: hidden;">
            <div class="modal-header d-flex justify-content-center" style="position: sticky; z-index: 30; top: 0; background-color: white;">
                <div class="fsplll modal-title text-align-center">
                    <transition name="login-form-fade" mode="out-in">
                        <span v-if="!store.getters.GET_IS_LOGIN">로그인</span>
                        <span v-else>내 정보</span>
                    </transition>
                </div>
            </div>
            <transition name="login-form-fade" mode="out-in">
                <form class="fspms" v-if="!store.getters.GET_IS_LOGIN">
                    <div class="modal-body">
                        <div class="form-floating mb-3 mt-3">
                            <input id="idBox" type="text" class="form-control" placeholder="Enter ID" v-model="params.inputId"> 
                            <label for="idBox">ID</label>
                        </div>

                        <div class="form-floating mb-3 mt-3">                           
                            <input id="pwBox" type="password" class="form-control" placeholder="Enter password" v-model="params.inputPw">
                            <label for="pwBox">Password</label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <input type="submit" :class="`container-fluid mb-1 btn btn-success`"
                        @click.prevent="methods.loginNout" value="로그인">
                    </div>
                    <div class="container-fluid d-flex flex-column fsps" v-if="!store.getters.GET_IS_LOGIN">
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('FindIdVue')">아이디 찾으러가기</a>
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('FindPwVue')">비밀번호 찾으러가기</a>
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('RegistVue')">아이디가 없으신가요?</a>
                        <a class="d-flex justify-content-center" @click.prevent="methods.changeRegistForm('RegistCertVue')">인증토큰 입력하러가기</a>
                    </div>
                </form>
                <div v-else>
                    <div class="modal-body d-flex flex-column" style="background-color: #e7e7e7;">
                        <transition name="fast-fade" mode="out-in">
                            <div v-if="params.step === 100 || params.step === -1" class="container-fluid d-flex flex-wrap justify-content-center text-center">
                                <div id="loadingding" class="d-flex justify-content-center">
                                    <i class="bi bi-hourglass align-self-center icon-size-standard"></i>
                                </div>
                                <div class="container-fluid ">{{params.waittingString}}</div>                
                            </div>
                            <div v-else-if="params.step === 0" class="container-fluid d-flex flex-wrap justify-content-center text-center p-0">
                                <div class="w-100 d-flex row justify-content-center border-radius-c" style="border: 3px #767676 solid;background-color: white; padding: 0 0 1rem 0;">
                                    <div class="p-0 m-3" style="width:70px;align-self:center;height:70px;border-radius: 50%;box-shadow: 0 0 1px 1px black;overflow: hidden;">
                                        <img :src="params.myInfo.logoPath? params.myInfo.logoPath: '/images/board/logos/none.png'" @error="'/images/board/logos/none.png'" alt="" srcset="" class="w-100 h-100" >
                                    </div>
                                    <div class="d-flex flex-wrap py-0 px-4" style="text-align: center;">
                                        <div class="fspll w-100" style="align-self:end;">{{params.myInfo.name}}</div>
                                        <div class="fspm w-100"><i class="bi bi-envelope"></i>&nbsp;{{params.myInfo.email}}</div>
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <div class="fspm w-100 mt-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-cash-coin"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.cash}}
                                            </div>

                                            <div class="container-fluid d-flex justify-content-end p-0">
                                                <div class="btn btn-primary btn-sm">
                                                    지갑 충전
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 mb-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-cash"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.money}}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <div class="fspm w-100 mt-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-phone"></i>
                                            </div>
                                            <div class="">
                                                {{methods.printPhoneNum()}}
                                            </div>
                                        </div>
                                        
                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-house"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.address}}
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 mb-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-award"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.admin==='o'? '관리자': params.myInfo.admin==='m'? '매니저': '유저'}}
                                            </div>
                                        </div>

                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->
                                    </div>
                                </div>
                                <!-- <input type="file" @change.capture="methods.valuedChange" id="imageFiles" accept="image/gif, image/jpeg, image/png">
                                <input type="submit" placeholder="변경" @click.prevent="methods.changeLogo"> -->
                            </div>
                            <div v-else-if="params.step === 1" class="container-fluid d-flex flex-wrap justify-content-center text-center p-0">
                                <div class="w-100 d-flex row justify-content-center border-radius-c" style="border: 3px #767676 solid;background-color: white; padding: 0 0 0 0;">
                                    <div class="p-0 mt-3" style="width:70px;align-self:center;height:70px;border-radius: 50%;box-shadow: 0 0 1px 1px black;overflow: hidden;">
                                        <img @click="methods.logoImageChange" @error="'/images/board/logos/none.png'"
                                        id="previewLogo" :src="params.myInfo.logoPath? params.myInfo.logoPath: '/images/board/logos/none.png'" alt="" srcset="" class="w-100 h-100 over-cursor" >
                                    </div>
                                    <div class="d-flex container-fluid justify-content-center mb-3">
                                        <input type="file" @change.capture="methods.valuedChange" id="imageFiles" accept="image/gif, image/jpeg, image/png">
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <div class="fspm w-100 mt-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-tag"></i>
                                            </div>
                                            <div class="d-flex">
                                                <input id="changeName" type="text" :value="params.myInfo.name"
                                                @change="methods.change(1)">
                                                <div id="nameSide" class="jjollu is-have-plain-transition"></div>
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-envelope"></i>
                                            </div>
                                            <div class="">
                                                <input id="changeEmail" type="text" :value="params.myInfo.email" @change="methods.change(2)">
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-phone"></i>
                                            </div>
                                            <div class="">
                                                <input id="changePhoneNum" type="text" :value="methods.printPhoneNum()" @change="methods.change(3)">
                                                <!-- {{methods.printPhoneNum()}} -->
                                            </div>
                                        </div>
                                        
                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-house"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.address}}
                                            </div>
                                        </div>

                                        <!-- <div class="fspm w-100 mt-3 mb-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-award"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.admin==='o'? '관리자': params.myInfo.admin==='m'? '매니저': '유저'}}
                                            </div>
                                        </div> -->

                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->
                                    </div>
                                </div>

                                <!-- <input type="submit" placeholder="변경" @click.prevent="methods.changeLogo"> -->
                            </div>
                        </transition>
                        
                    </div>

                    <div class="modal-footer fspm">
                        <transition name="fast-fade" mode="out-in">
                            <input v-if="store.getters.GET_IS_LOGIN && params.step !== -1" type="submit" class="container-fluid btn btn-success mb-1" 
                            @click="params.step === 0? methods.openLo1(): methods.openLo2()" :value="params.step === 0? '정보수정': '변경'">
                        </transition>

                        <input type="submit" :class="`container-fluid mb-1 btn btn-danger`"
                        @click.prevent="methods.loginNout" value="로그아웃">
                        
                        <input v-if="store.getters.GET_IS_LOGIN" type="submit" class="container-fluid btn btn-primary mb-1" 
                        @click.prevent="methods.deleteId" value="회원탈퇴">
                    </div>
                </div>
            </transition>
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
    name: 'LoginNOutVue',
    setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');
        const router = useRouter();

        const fileReader = new FileReader();

        const IDRegExp = /^[0-9A-Za-z]{3,}$/; // 특수문자를 금지한 문자 3개이상
        const PWRegExp = /^.{6,}$/; // 아무런 문자 6개 이상
        const EmailRegExp = /^([^\W]{3,})@([^\W]{3,})(\.[a-zA-Z]{2,})+$/; // (3글자이상)
        const NameRegExp = /^[0-9a-zA-Z가-힣_]{3,12}$/; // (_를 포함한 3글자이상 12글자 이하)
        const PhoneRegExp = /^(010){1}[0-9]{8}$/; // 휴대폰번호 12자
        
        const { IMP } = window;
        
        IMP.init('imp84365986');


        const params = ref({
            inputId: '',
            inputPw: '',
            myInfo: null,
            updateInfo: {
                logo: {after: null, isChanged: false},
                name: {after: null, isChanged: false},
                pw: {after: null, isChanged: false},
                phone: {after: null, isChanged: false},
                email: {after: null, isChanged: false},
                address: {after: null, isChanged: false},
            },
            resultKey: [],
            step: 100, waittingString: '불러오는 중',
        });
        const methods = {
            login: ()=>{
                // store.commit('CREATE_LOADING');
                AXIOS.post(
                    '/login', 
                    {
                        'id': params.value.inputId, 
                        'pw': params.value.inputPw, 
                        // 'oneTimeCookie': params.value.params
                        }, 
                    { withCredentials: true,})
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg:'성공적으로 로그인 됐습니다.', time: 2, type:"success"});
                    //store.commit('CLOSE_FOREGROUND', {});
                    methods.myInfo();
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                })
                .finally((data)=>{
                    params.value.inputId = '';
                    params.value.inputPw = '';
                    // store.commit('REMOVE_LOADING');
                    store.commit('LOGIN_CHECK');
                });
            },
            logout: ()=>{
                // store.commit('CREATE_LOADING');
                AXIOS.post(
                    '/logout', 
                    { withCredentials: true,})
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg:'성공적으로 로그아웃 됐습니다.', time: 2, type:"success"});
                    params.value.myInfo = null;
                    // store.commit('CLOSE_FOREGROUND', {});
                })
                .catch((error)=>{
                    console.log(error);
                })
                .finally((data)=>{
                    // store.commit('REMOVE_LOADING');
                    store.commit('LOGIN_CHECK');
                });
            },
            loginNout: ()=>{
                if(store.getters.GET_IS_LOGIN) { // 로그인 된 상태
                    methods.logout();
                } else{ // 로그아웃 된 상태
                    methods.login();
                }
            },
            routeURL: (url)=>{
                store.commit('CLOSE_FOREGROUND', {});
                router.push(url);
            }, 
            changeRegistForm: (paramName)=>{
                store.commit('CHANGE_FOREGROUND_COMPONENT', {name: paramName});
            },
            myInfo: async ()=>{
                try{
                    store.commit('UPDATE_INFO');

                    params.value.myInfo = null;

                    setTimeout(()=>{
                        params.value.myInfo = store.getters.GET_MY_INFO;
                        console.log(params.value.myInfo);
                    }, 1500);
                }
                catch(error){
                    console.log(error);
                }
            },
            deleteId: ()=>{
                // store.commit('CREATE_LOADING');
                AXIOS.delete('/info/out')
                .then((res)=>{
                    console.log(res.data);
                    store.commit('CREATE_ALERT', {msg:res.data.result, time: 2, type:"success"});
                })
                .catch((err)=>{
                    console.log(err);
                    store.commit('CREATE_ALERT', {msg:err.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{
                    // store.commit('REMOVE_LOADING');
                    store.commit('LOGIN_CHECK');
                });
            },
            change: (i)=>{
                switch(i){
                    case 0:
                        params.value.updateInfo.logo.isChanged = true;
                    break;

                    case 1:
                        if(NameRegExp.test(document.getElementById("changeName").value)
                            || document.getElementById("changeName").value == params.value.myInfo.name){
                            document.getElementById("nameSide").style.background = "green";
                            // console.log("이름 바꾼거 확인했고 값은 "+document.getElementById("changeName").value+" 이다.");
                            params.value.updateInfo.name.isChanged = true;
                        } else{
                            document.getElementById("nameSide").style.background = "red";
                            params.value.updateInfo.name.isChanged = false;
                        }
                        
                    break;

                    case 2:
                        params.value.updateInfo.email.isChanged = true;
                    break;

                    case 3:
                        params.value.updateInfo.address.isChanged = true;
                    break;

                    case 4:
                        params.value.updateInfo.pw.isChanged = true;
                    break;
                }
            },
            changeLogo: ()=>{
                var tempFormData = new FormData();

                var imgFiles = document.getElementById('imageFiles');

                for(var i = 0; i < imgFiles.files.length; i++){
                    tempFormData.append('imageFiles', imgFiles.files[i]);
                }

                

                if(imgFiles.files.length > 0){
                    AXIOS.put(`/community/logo`, tempFormData, {headers:{"Content-Type": "multipart/form-data"}})
                    .then((response)=>{
                        store.commit('CREATE_ALERT', {msg:response.data.result, time: 2, type:"success"});
                        methods.myInfo();
                    })
                    .catch((error)=>{
                        if(error.response.data.result === null ||
                            error.response.data.result === undefined &&
                            error.response.data.indexOf('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE') !== -1){
                            store.commit('CREATE_ALERT', {msg:'이미지 파일을 다시 확인해주세요.', time: 2, type:"danger"});
                        } else{
                            store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                        }
                    })
                    .finally((data)=>{
                        store.commit('LOGIN_CHECK');
                    });
                }
                else{
                    store.commit('CREATE_ALERT', {msg:'로고로 사용할 파일을 넣어주세요.', time: 2, type:"danger"});
                }
            },
            valuedChange: (e)=>{
                // console.log(e.target);
                if($(e.target).prop('files').length > 0){
                    console.log($(e.target).prop('files')[0]);
                    fileReader.readAsDataURL($(e.target).prop('files')[0]);
                } else{
                    let previewElement = document.getElementById('previewLogo');

                    if(previewElement){
                        previewElement.src = '/images/board/logos/none.png';
                        previewElement.height = previewElement.width;
                    }
                }
            },
            printPhoneNum: ()=>{
                // return `${params.value.myInfo.phone.slice(0,3)}-${params.value.myInfo.phone.slice(3,7)}-${params.value.myInfo.phone.slice(7)}`;
                return params.value.myInfo.phone;
            },
            logoImageChange: ()=>{
                methods.change(0);
                document.getElementById('imageFiles').click();
            },
            getLogoHeight: ()=>{
                return document.getElementById('realLogo').width;
            },
            printQuestion: ()=>{
                // const modifyInfo = (boolstat)=>{
                //     if(boolstat){
                //         console.log("정보 변경 수락", params.value.myInfo);
                //     } else{
                //         console.log("정보 변경 취소");
                //     }

                //     methods.openLo0();
                // };

                // store.commit('CREATE_QUESTION', {questionText: '정보를 변경하시겠습니까?', yesText: '변경하기', noText:'취소', method: modifyInfo});

                console.log();

                methods.openLo0();
            },
            openLo: async (nextStep, waittingString, consoleString, progressCallBack)=>{
                try{
                    params.value.waittingString = waittingString;

                    if(params.value.step !== -1){
                        params.value.step = -1;

                        for(var cbFunc in progressCallBack){
                            try{
                                await progressCallBack[cbFunc]();
                            }
                            catch(error){
                                console.log(error);
                            }
                        }

                        setTimeout(()=>{
                            params.value.myInfo = store.getters.GET_MY_INFO;
                            params.value.step = nextStep;  
                            console.log(consoleString);
                        }, 1500);
                    }
                    
                }
                catch(error){
                    console.log(error);
                }
            },
            openLo0:()=>{
                const funcList = [
                    async ()=>{params.value.waittingString="대기 중"}, 
                    async ()=>{console.log("Hello World1");}, 
                    async ()=>{console.log("Hello World2");}
                ];

                store.commit('UPDATE_INFO');
                methods.openLo(0, "불러오는 중", "내 정보 창 오픈", funcList);
            },
            openLo1:()=>{
                params.value.updateInfo = {
                    logo: {after: null, isChanged: false},
                    name: {after: null, isChanged: false},
                    pw: {after: null, isChanged: false},
                    phone: {after: null, isChanged: false},
                    email: {after: null, isChanged: false},
                    address: {after: null, isChanged: false},
                };

                methods.openLo(1, "변경 창 여는 중", "변경 창 오픈");
            },
            openLo2: ()=>{
                const funcList = [
                    async ()=>{ // logo change request
                        if(params.value.updateInfo.logo.isChanged){
                            try {
                                let tempFormData = new FormData();
                                let imgFiles = document.getElementById('imageFiles');

                                for(var i = 0; i < imgFiles.files.length; i++){
                                    tempFormData.append('imageFiles', imgFiles.files[i]);
                                }

                                let result = await AXIOS.put(`/community/logo`, tempFormData, {headers:{"Content-Type": "multipart/form-data"}});
                                
                                if(result.status === 200){
                                    params.value.waittingString = result.data.result;
                                } else{
                                    params.value.waittingString = "로고 변경에 실패했습니다.";
                                }
                            }
                            catch (error) {
                                throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.name.isChanged){
                            
                            try{
                                // params.value.waittingString = "이름을 바꿧습니다.";
                                if(NameRegExp.test(document.getElementById("changeName").value)){
                                    console.log("이름 바꾼거 확인했고 값은 "+document.getElementById("changeName").value+" 이다.");
                                }
                            }
                            catch(error){
                                throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.phone.isChanged){
                            try{
                                // params.value.waittingString = "번호를 바꿧습니다.";
                            }
                            catch(error){
                                throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.email.isChanged){
                            try{
                                // params.value.waittingString = "이메일을 바꿧습니다.";
                            }
                            catch(error){
                                throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.address.isChanged){
                            try{
                                // params.value.waittingString = "주소를 바꿧습니다.";
                            }
                            catch(error){
                                throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.pw.isChanged){
                            try{

                            }
                            catch(error){
                                throw error;
                            }
                        }
                    },
                    async ()=>{
                        try{
                            console.log(params.value.updateInfo);
                            await store.commit('UPDATE_INFO');
                        }
                        catch(error){
                            console.log(error);
                        }
                    }
                ];



                methods.openLo(0, "변경 중", "변경 후 내 정보 창 오픈", funcList);
            },
        };

        onMounted(()=>{
            console.log('onMounted');
            if(store.getters.GET_IS_LOGIN){
                methods.openLo0();
            }

            fileReader.onload = (e)=>{
                let previewElement = document.getElementById('previewLogo');
                if(previewElement){
                    previewElement.src = e.target.result;
                    previewElement.height = previewElement.width;
                }
            };
        });

        if(store.getters.GET_IS_LOGIN){
            methods.myInfo();
        }

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
a, a:hover{
    text-decoration: none;
    cursor: pointer;
}

.login-form-fade-enter-from,
.login-form-fade-leave-to{
    opacity: 0;
}

.login-form-fade-enter-active,
.login-form-fade-leave-active{
    transition: all 0.5s ease;
}

#loadingding{
    animation: loadingAnimation 2s infinite ease;
}

.jjollu{
    margin: 0 0 0 15px;
    padding: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: black;
    align-self: center;
}

@keyframes loadingAnimation {
    0%{

    }
    100%{
        transform: rotate(2turn);
    }
}

</style>