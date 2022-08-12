<template>
    <div id="NotifiListWrapper" :class="`d-flex flex-wrap container-fluid justify-content-center text-center`">
        <div id="notifiTitle" class="w-100 fspll font-bold my-4">
            알림
        </div>

        <transition-group name="fast-fade" tag="ul" style="listStyle:none;" class="w-100 p-0 m-0">
            <li v-for="item, key in params.notifiList" :key="key" class="w-100 p-0 mx-0 alert alert-info border-radius-a text-start d-flex flex-wrap px-3 py-1">
                <div class="w-100">
                    <span class="opacity-half">{{methods.convertDate(item.notifidate)}}</span>
                </div>
                <div class="text-align-center w-100">{{item.publisher}} 님이 {{item.content}}</div>
            </li>
        </transition-group>

        <div v-if="params.listIsEnd" @click="methods.getNotifi" id="moreButton" class="w-100 over-cursor border-radius-b my-3 btn btn-outline-primary btm-sm">
            더보기
        </div>

        <div v-else id="notifiExist" class="w-100 fspll font-bold my-4">
            마지막 알림입니다.
        </div>

        <div v-if="params.isAdd" id="closeButton" class="w-100 over-cursor">
            닫기
        </div>

    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

const yyyymmdd_HHMMSS = (dateTime)=>{
    let result = 'yyyy-mm-dd HH:MM:ss';
    try{
        var timeZone = new Date(dateTime);
        var time = timeZone.toString().split(' ')[4];
        var date = null;

        var year = timeZone.getFullYear();
        var month = timeZone.getMonth()+1;
        var day = timeZone.getDate();

        date = `${year}-${("00"+month.toString()).slice(-2)}-${("00"+day.toString()).slice(-2)}`;
        result = date + ' ' + time;
    }
    catch(error){
        console.log(error);
    }

    return result;
}

export default {
    name:'NotifiList',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            notifiList: [], listIsEnd: true, isAdd: false
        });

        const methods = {
            getNotifi: ()=>{
                let index = params.value.notifiList.length;
                AXIOS.get(`/info/notifi?nindex=${index === 0? 100000000: params.value.notifiList[index-1].nindex}`)
                .then((res)=>{
                    let resar = res.data.result;
                    params.value.notifiList.push(...resar);

                    console.log(resar.length);
                    if(resar.length === 0){
                        params.value.listIsEnd = false;
                    } else{
                        params.value.listIsEnd = true;
                    }
                })
                .catch((err)=>{

                });
            },
            convertDate: (date)=>{
                return yyyymmdd_HHMMSS(date);
            }
        };

        onMounted(()=>{
            methods.getNotifi();
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#notifiTitle, #notifiExist{
    border-top: 1px black solid;
    border-bottom: 1px black solid;
}

.opacity-half{
    opacity: 0.5;
}
</style>