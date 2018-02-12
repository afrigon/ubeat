<template lang="pug">
    .section.error-wrapper(on)
        .row.text-white.container
            strong.error-title.text-size-2 Error
            .error.text-size-small-7 {{ message }}
</template>

<script>
    export default {
        props: ['message']
    }
</script>


<style lang="scss">
    .error-wrapper {
        will-change: transform;
        transform: translateY(-100%);
        transition: transform 250ms ease-out;
        background-color: #c64d47;
        border-radius: 4px;
        padding: 10px 30px;
        border: 1px solid #993a35;
        margin: auto;
        text-align: left;
    }
</style>

