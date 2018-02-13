<template lang="pug">
    transition(name="error-show" appear)
        .section.error-wrapper
            .row.text-white.container
                strong.error-title.text-size-2 Error
                .error.text-size-small-7 {{ message }}
</template>

<script>
    export default {
        props: ['message'],
        data: () => ({
            show: null
        }),
        mounted () {
            setTimeout(() => (this.show = true), 2000)
        }
    }
</script>


<style lang="scss">
    .error-wrapper {
        background-color: #c64d47;
        border-radius: 0 0 4px 4px;
        padding: 10px 30px;
        border: 1px solid #993a35;
        margin: auto;
        text-align: left;
    }

    .error-show-enter-active, .error-show-leave-active {
        will-change: transform;
        transition: transform 250ms ease-out;
        transform: translateY(0);
    }
    .error-show-enter, .error-show-leave {
        transform: translateY(-100%);
    }
</style>

