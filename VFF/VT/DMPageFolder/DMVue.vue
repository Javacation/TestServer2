<template>
    <div 
    id="DMRootContainerWrapper" class="d-flex justify-content-center align-items-center m-0 p-0">

        <transition name="fast-fade" mode="out-in" @after-leave="methods.closeDMVue">
            <div v-if="store.state.dmViewOn"
            @click="methods.beforeCloseDMVue" 
            id="DMRootBackground" class="over-cursor m-0 p-0">

            </div>
        </transition>

        

        <div id="DMRootContainer" class="d-flex flex-wrap justify-content-center invisible-scrollbar">
            <div id="DMHeaderWrapper" class="d-flex justify-content-around align-items-center text-center">
                <div class="w-25"><span class="fspl">메인</span></div>
                <div class="w-25"><span class="fspl">메인</span></div>
                <div class="w-25"><span class="fspl">메인</span></div>
                <div class="w-25"><span class="fspll"><i class="bi bi-x over-cursor" @click="methods.beforeCloseDMVue" ></i></span></div>
            </div>
            <div id="DMContentWrapper" class="d-flex flex-wrap justify-content-center align-items-center m-0">
                <div id="DMContents" class="d-flex flex-wrap justify-content-center align-items-center m-0 border-radius-b">
                    <DMTestPartVue :name="'DM'" :alertType="'info'"/>
                    <DMTestPartVue :name="'1:1문의'" :alertType="'primary'"/>
                    <DMTestPartVue :name="'고객센터'" :alertType="'success'"/>
                    <DMTestPartVue :name="'DM'" :alertType="'info'"/>
                    <DMTestPartVue :name="'1:1문의'" :alertType="'primary'"/>
                    <DMTestPartVue :name="'고객센터'" :alertType="'success'"/>
                    <DMTestPartVue :name="'DM'" :alertType="'info'"/>
                    <DMTestPartVue :name="'1:1문의'" :alertType="'primary'"/>
                    <DMTestPartVue :name="'고객센터'" :alertType="'success'"/>
                    <DMTestPartVue :name="'DM'" :alertType="'info'"/>
                    <DMTestPartVue :name="'1:1문의'" :alertType="'primary'"/>
                    <DMTestPartVue :name="'고객센터'" :alertType="'success'"/>
                    <DMTestPartVue :name="'DM'" :alertType="'info'"/>
                    <DMTestPartVue :name="'1:1문의'" :alertType="'primary'"/>
                    <DMTestPartVue :name="'고객센터'" :alertType="'success'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';

import DMTestPartVue from './dmParts/DMTestPartVue.vue';

export default {
    name:'DMVue',
    components: {
        DMTestPartVue
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            index: 0
        });

        const methods = {
            closeDMVue: ()=>{
                store.commit("SET_IS_DM_VIEW", {isView: false});
            },
            beforeCloseDMVue: ()=>{
                store.commit("SET_DM_VIEW_ON", {isOn: false});
            },
        }

        onMounted(()=>{
            
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

#DMRootContainerWrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
}

#DMRootContainer{
    width: fit-content;
    height: fit-content;
    border: 10px black solid;
    border-radius: 10%;
    background-color: white;
    overflow: scroll;
    z-index: 1200;
}

#DMContentWrapper{
    width: 100%;
    padding: 20px 10px;
}

#DMHeader{
    margin-bottom: 1rem;
}

#DMHeaderWrapper{
    position: sticky;
    top:0;
    background: white;
    width: 100%;
    border-bottom: 2px black solid;
    min-height: 50px;
    z-index: 50;
    padding: 1rem 0 0.5rem 0;
}

#DMContents{
    width: 100%;
    padding: 10px;
    box-shadow: 0px 0px 2px;
}

#DMRootBackground{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    z-index: 1100;
}

@media screen and (min-width: 1000px){
    #DMRootContainer{
        max-width: 500px;
        max-height: 800px;

        min-width: 500px;
        min-height: 500px;
    }
}

@media screen and (max-width: 1000px){
    #DMRootContainer{
        max-width: 50vw;
        max-height: 80vh;
        min-width: 320px;
        min-height: 500px;
    }
}

</style>