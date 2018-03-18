<template id="confirm-template" lang="pug">
    i.material-icons.circle.red.text-white.lighten-1.delete-all.clickable(@click="showConfirm" v-if="!confirm") delete_forever
    span.confirmation-zone(v-else)
        span.confirm-message.text-white Sure?
        span.buttons
            button.red.lighten-1.text-white.yes-button(@click="{{ click() }}") Yes
            button.grey.text-white.no-button(@click="hideConfirm") No
</template>

<script>
    export default {
        props: ['click'],
        data: () => ({
            confirm: false
        }),
        methods: {
            showConfirm () {
                this.confirm = true
            },
            hideConfirm () {
                this.confirm = false
            }
        }

    }
</script>


<style lang="scss" scoped>
    .confirmation-zone {
        .confirm-message {
            display: inline-block;
            padding : 5px 10px;
        }
        .buttons {
            display: inline-block;
            button {
                text-align: center;
                font-size: 1rem;

                display: inline-block;
                padding: .7em 1em;
                border: none;
                transition: .25s background-color;
                text-decoration: none;
            }
        }
    }
</style>

