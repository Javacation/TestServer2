<template>
    <div id="DmPartWrapper" :class="`d-flex flex-wrap w-100 justify-content-center text-center`">
        <div :style="`${params.currentStep === -1? 'height: 0px;': ''}`"
        class="w-100 p-0 m-0 mb-2 d-flex justify-content-around text-center align-items-center">
            <transition name="fast-fade" mode="out-in">
                <div v-if="params.currentStep !== -1"
                class="w-100 m-0 p-0 d-flex justify-content-around align-items-center">
                    <div class="d-flex flex-wrap">
                        <div :class="`step d-flex ${params.currentStep === 1? 'current-step-1': ''}`"><div class="align-self-center  w-100">1</div></div>
                    </div>
                    
                    <div class="d-flex flex-wrap">
                        <div :class="`step d-flex ${params.currentStep === 2? 'current-step-2': ''}`"><div class="align-self-center  w-100">2</div></div>
                    </div>

                    <div class="d-flex flex-wrap">
                        <div :class="`step d-flex ${params.currentStep === 4? 'current-step-3': ''}`"><div class="align-self-center  w-100">3</div></div>
                    </div>
                </div>
            </transition>
        </div>
        <div class="w-100 p-0 m-0 d-flex flex-wrap">
            <div id="currentStepNumberWrapper" v-if="params.currentStep === 3"
            :class="`align-items-center w-100 text-center d-flex alert alert-primary py-1 ${params.currentStep === 3?'justify-content-around':''}`">

                <div v-if="params.currentStep === 3"
                class="w-auto h-auto">
                    상대: {{params.targetId}}
                </div>

                <div v-if="params.currentStep === 3"
                class="w-auto h-auto">
                    <label>Auto Scroll:</label> &nbsp;<input type="checkbox" name="" id="autoScrollCheck" v-model="params.autoScroll">
                </div>

                <div class="w-auto h-auto" v-html="params.stepList[params.currentStep]">
                </div>
                
            </div>
            <transition name="fast-fade" mode="out-in">
                <DmStep1 @GOSTEPTWO="methods.connectRoom" v-if="params.currentStep === 1"/>
                <DmStep3 @CHAT="methods.step3ChatSend" @DISCONNECT="methods.disconnect" :payload="params.chatList" v-else-if="params.currentStep === 3"/>
                <DMWaitting :payload="params.currentText" v-else/>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated, watchEffect, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';
import DmStep1 from './dmFolderParts/DmStep1.vue';
import DmStep3 from './dmFolderParts/DmStep3.vue';
import DMWaitting from './dmFolderParts/DMWaitting.vue';

export default {
    components: { DmStep1, DmStep3, DMWaitting },
    name:'DmList',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            currentStep: -1, currentText: '대기중',
            stepList: [
                '아래 버튼을 눌러 시작해주세요!', 'DM 상대를 입력해주세요!', '처리중입니다.', '<div id="disconnectButton" class="btn btn-danger fsps">연결종료</div>'
            ],
            targetId: null, socket: store.getters.GET_SOCKET, targetName: '',
            chatList: [], autoScroll: true
        });

        const methods = {
            resetStep: async (payload)=>{
                params.value.currentText = '초기화중...';
                params.value.currentStep = -1;

                try {
                    params.value.targetId = null;
                    params.value.targetName = null;
                    await methods.chatListReset();
                    await methods.chatRoomJoin(null);
                    setTimeout(()=>{
                        params.value.currentStep = 1;
                    }, 1000);
                }
                catch (error) {
                    console.log(error);
                }
            },
            connectRoom: (payload0)=>{
                params.value.currentText = '연결중...';
                params.value.currentStep = 2;

                params.value.targetId = payload0.target;
                methods.chatListReset();
                methods.chatRoomJoin(params.value.targetId);
            },
            step3ChatSend: (payload)=>{
                if(payload.text.length > 0)
                    params.value.socket.emit("chatSend", {sendText: payload.text});
            },
            chatListReset: ()=>{
                params.value.chatList = [];
            },
            chatRoomJoin: (targetId)=>{ // null is room leave
                params.value.socket.emit("joinRoom", {targetID: targetId});
            },
            disconnect: ()=>{
                methods.resetStep();
            },
            changeCurrentText: (payload)=>{
                params.value.currentText = payload.text;
            },
        };

        watch(()=>params.value.autoScroll, (after, before)=>{
            // console.log(after, before);
        });

        onMounted(()=>{
            $('#DMRootContainer').animate({scrollTop: $('#DMRootContainer').scrollTop()+$('#DmRootWrapper').offset().top}, 300);
            params.value.socket.on("joinRoomResult", (payload)=>{
                if(payload.result === 10){
                    setTimeout(()=>{
                        params.value.targetName = payload.result;

                        params.value.currentText = '대화 불러오는중...';
                        params.value.currentStep = 4;

                        setTimeout(async ()=>{
                            try {
                                

                                params.value.socket.on("chatReceive", (payload)=>{
                                    params.value.chatList.push(payload);

                                    var chatWrapper = $('#chatContentWrapper');

                                    if(chatWrapper && params.value.autoScroll){
                                        chatWrapper.animate({scrollTop: chatWrapper.prop('scrollHeight')-1}, 300);
                                    }
                                });
                            }
                            catch (error) {
                                console.log(error);

                                methods.resetStep();
                            }
                        }, 1000);
                    }, 1000);
                } else{
                    params.value.socket.off("chatReceive");
                }
            });

            methods.resetStep();
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            methods.resetStep();
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#DmPartWrapper{
    min-height: 150px;
}

#currentStepNumberWrapper{
    height: fit-content;
}

.line{
    height: 3px;
    background-color: black;
}

.step{
    width: 50px;
    height: 50px;
    border-radius: 30%;
    border: 5px solid rgba(0, 0, 0, 0.4);
}

.current-step-1{
    border-color: rgb(255, 51, 51);
}

.current-step-2{
    border-color: rgb(26, 102, 241);
}

.current-step-3{
    border-color: rgb(5, 250, 156);
}


</style>