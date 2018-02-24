<template lang="pug">
    .loading
        svg.spinner(width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
            circle(:stroke="color" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")
</template>

<script>
    export default {
        props: ['color']
    }
</script>


<style lang="scss" scoped>
    .loading {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2500;
        background-color: #454545;
        opacity: 0.7;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

