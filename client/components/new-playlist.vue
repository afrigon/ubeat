<template lang="pug">
    div.dark.no-scroll.flex.flex-spaced.flex-vertical.scroll-invisible.create-playlist-modal
        .absolute.close-icon(@click="$emit('close')")
            i.material-icons.text-white.l.clickable close
        .container.margin-up-50.full-width
            h1.text-white.text-size-3.text-light.text-center Create a new playlist
            .section
                .row.text-center
                    .input-wrapper(:class="{ 'input-error': nameError }")
                        input#name(type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="name" v-model="name")
                        label(for="name") Name
                        span(v-if="nameError" class="input-error-message") Your playlist must have a name.
                    button.hoverable-light.primary.text-white.submit-button(@click="validatePlaylist") Create playlist
</template>

<script>
    import { FScript, MaterialInput } from '@/script/fscript'

    export default {
        data: () => ({
            name: null,
            validatedOnce: false
        }),
        methods: {
            validatePlaylist () {
                if (!this.name) {
                    this.validatedOnce = true
                    return
                }

                this.$emit('createPlaylist', this.name)
            }
        },
        computed: {
            nameError () {
                return (this.validatedOnce && !this.name)
            }
        },
        mounted () {
            FScript.addComponent(new MaterialInput())
        }
    }
</script>

<style lang="scss" scoped>
    .full-width {
        width: 100%;
        max-width: 100%;
    }

    .create-playlist-modal {
        z-index: 10001;
        top: 100px;
        left: 30px;
        right: 30px;
        background-color: #454545 !important;
        border-radius: 4px;
        max-width: 500px;
        margin: 0 auto;
    }

    .close-icon {
        top: 0px; right: 15px;
    }
</style>
