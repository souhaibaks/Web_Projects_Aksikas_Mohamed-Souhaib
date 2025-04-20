<template>
<div>
    {{ ID }}
</div>

</template>

<script>
import { useRoute } from 'vue-router';
//import {db} from '../firebase'
//import {getDoc} from 'firebase/firestore'
export default{
    setup() {
        const route = useRoute()
        const ID = route.params.id

        return {
            ID
        }
    }
}

</script>