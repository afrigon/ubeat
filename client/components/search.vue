<template lang="pug">
    form.form-search.padding-0.flex.flex-center(:id="mobile ? 'form-search-mobile' : 'form-search'" :class="{ mobile: mobile, active: opened, 'hide-after-m': mobile, 'hide-until-l': !mobile }" method="GET" action="/api/search")
        .input-wrapper.margin-0.margin-up-5.grey.darken-5
            input.search-input(@click.stop="" type="search" name="q" autocomplete="off")
            label Search
        div.search-filter-wrapper.grey.darken-5
            select#search-filter.gone(v-model="$store.getters.getFilterFlags" name="filter" multiple v-if="!mobile")
                option(value="1")
                option(value="2")
                option(value="4")
                option(value="8")
            .notch-left.absolute
            .notch-right.absolute
            ul.capitalize.clickable.text-white.margin-0.padding-left-15.padding-right-15
                li.text-size-small-8.primary-border(:class="{ active: (flags & 1) !== 0 }" @click.stop="toggleFilter(1)") artist
                li.text-size-small-8.primary-border(:class="{ active: (flags & 2) !== 0 }" @click.stop="toggleFilter(2)") album
                li.text-size-small-8.primary-border(:class="{ active: (flags & 4) !== 0 }" @click.stop="toggleFilter(4)") song                                    
                li.text-size-small-8.primary-border(:class="{ active: (flags & 8) !== 0 }" @click.stop="toggleFilter(8)") user
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import { TOGGLE_FILTER_FLAGS } from '@/store/mutation-types'
    import { FScript, MaterialInput } from '@/script/fscript'

    export default {
        props: ['mobile'],
        data: () => ({
            opened: false
        }),
        computed: {
            ...mapState({
                flags: state => state.search.filterFlags
            })
        },
        mounted () {
            const form = document.getElementById(`form-search${this.mobile ? '-mobile' : ''}`)
            if (!form) return console.log('could not find search form')

            const input = form.querySelectorAll('.search-input')[0]
            if (!input) return console.log('could not find search input')

            const filter = form.querySelectorAll('.search-filter-wrapper')[0]
            if (!filter) return console.log('could not find search filter')

            input.addEventListener('focus', (event) => {
                return (this.opened = true)
            })
            document.body.addEventListener('click', this.closeForm)

            if (!this.mobile) return
            FScript.addComponent(new MaterialInput())

            const button = document.getElementById('search-action')
            if (!button) return

            button.addEventListener('click', () => {
                input.focus()
                return (this.opened = true)
            })
        },
        destroyed () {
            document.body.removeEventListener('click', this.closeForm)
        },
        methods: {
            ...mapMutations({
                toggleFilter: TOGGLE_FILTER_FLAGS
            }),
            closeForm () {
                const form = document.getElementById(`form-search${this.mobile ? '-mobile' : ''}`)
                if (!form) return
                const input = form.querySelectorAll('.search-input')[0]
                input && (input.value = '')
                return (this.opened = false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    li {
        display: inline-block;
        font-weight: 200;
        padding: 10px 15px 5px 15px;
    }

    .form-search {
        height: 100%;
        min-width: 330px;

        &.active .search-filter-wrapper { transform: translateY(0); }

        .input-wrapper label.active { transform: translateY(-8px) scale(.8); }
        .input-wrapper {
            height: 100%;
            margin: 0 !important;

            label { margin-top: 3px; }
        }

        .search-filter-wrapper {
            position: absolute;
            top: 70px;
            transition: top 300ms ease-out, opacity 300ms ease-in;
            z-index: -1;
            transform: translateY(-100%);
            will-change: transform;
            transition: 300ms transform ease-out;
            border-radius: 0 0 15px 15px;

            ul {
                height: 100%;

                .active { background-color: #353535; }
                :not(.active) { border-color: transparent !important; }

                li {
                    border-bottom: 3px solid; 
                    will-change: border;
                    transition: border 300ms ease;

                    &:hover { background-color: #353535; }
                }
            }

            .notch-left, .notch-right {
                background-repeat: no-repeat;
                -moz-background-size: 100% 100%;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
                width: 16px;
                height: 16px;
                top: -1px;
            }

            .notch-left {
                background: -moz-radial-gradient(0 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
                background: -o-radial-gradient(0 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
                background: -webkit-radial-gradient(0 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
                background-position: bottom left;
                left: -15px;
            }

            .notch-right {
                background: -moz-radial-gradient(100% 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
                background: -o-radial-gradient(100% 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
                background: -webkit-radial-gradient(100% 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
                background-position: bottom right;
                right: -15px;
            }
        }
        
        &.mobile {
            min-width: 100%;
            position: absolute;
            z-index: 1000;
            will-change: transform;
            transition: transform 300ms ease-out;
            transform: translateY(-100%);

            &.active { transform: translateY(0); }

            .input-wrapper {
                padding: 0 5%;
                label { left: calc(5% + 15px); }
                input { padding-bottom: 0px !important; }
            }

            .search-filter-wrapper-mobile, ul {
                width: 90vw;
                text-align: center;

                li {
                    font-size: 17px;
                    padding: 15px 0 !important;
                    margin: 15px 0;
                    display: block;
                    border-bottom: 0px solid;
                    border-right: 10px solid;
                }
            }
        }
    }
</style>

