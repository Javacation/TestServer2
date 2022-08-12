<template>
    <div id="NotifiPartWrapper" :class="`d-flex flex-wrap container-fluid justify-content-center text-center`">
        
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'NotifiPart',
    props:{
        content: JSON,
    },
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

</style>