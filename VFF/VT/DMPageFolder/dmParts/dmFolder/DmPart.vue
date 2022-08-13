<template>
    <div id="DmPartWrapper" :class="`d-flex flex-wrap w-100 justify-content-center text-center`">
        <div class="w-100 p-0 m-0 d-flex justify-content-around text-center align-items-center">
            <div class="d-flex flex-wrap">
                <div :class="`step d-flex`"><div class="align-self-center  w-100">1</div></div>
            </div>
            
            <div class="d-flex flex-wrap">
                <div :class="`step d-flex`"><div class="align-self-center  w-100">2</div></div>
            </div>

            <div class="d-flex flex-wrap">
                <div :class="`step d-flex`"><div class="align-self-center  w-100">3</div></div>
            </div>
        </div>
        <div class="w-100 p-0 m-0 d-flex flex-wrap">
            <div id="currentStepNumberWrapper" class="w-100">

            </div>
            <div class="w-100">
                <input class="w-100" type="text" placeholder="DM 상대를 입력해주세요.">
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'DmList',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
        });

        const methods = {

        };

        onMounted(()=>{
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
#DmPartWrapper{
    min-height: 150px;
}

.line{
    height: 3px;
    background-color: black;
}

.step{
    width: 50px;
    height: 50px;
    border-radius: 30%;
    border: 3px solid rgba(0, 0, 0, 0.4);
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