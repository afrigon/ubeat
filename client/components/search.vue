<template lang="pug">
    form.padding-0.flex.flex-center(v-bind:id="mobile ? 'form-search-mobile' : 'form-search'" class="form-search" v-bind:class="{ mobile: mobile, 'hide-after-m': mobile, 'hide-until-l': !mobile }" method="GET" action="/api/unsecure/search")
        .input-wrapper.margin-0.margin-up-5.grey.darken-5
            input(v-bind:id="mobile ? 'search-input-mobile' : 'search-input'" type="search" name="q" autocomplete="off")
            label Search
        div.search-filter-wrapper.grey.darken-5(v-bind:id="mobile ? 'search-filter-wrapper-mobile' : 'search-filter-wrapper'")
            select#search-filter.gone(name="filter" multiple="" v-if="!mobile")
                option(value="1")
                option(value="2")
                option(value="4")
                option(value="8")
            .notch-left.absolute
            .notch-right.absolute
            ul.capitalize.clickable.text-white.margin-0.padding-left-15.padding-right-15
                li.filter-button-1.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 1)") artist
                li.filter-button-2.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 2)") album
                li.filter-button-4.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 4)") song                                    
                li.filter-button-8.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 8)") user
</template>

<script>
    export default {
        props: ['mobile'],
        mounted () {
            const input = document.getElementById(this.mobile ? 'search-input-mobile' : 'search-input')
            if (input) {
                input.addEventListener('focus', () => {
                    const target = document.getElementById(this.mobile ? 'search-filter-wrapper-mobile' : 'search-filter-wrapper')
                    target && (target.style.transform = 'translateY(0)')

                    if (this.mobile) {
                        // show mobile options
                        const form = document.getElementById('form-search-mobile')
                        if (form) {
                            const input = form.getElementsByTagName('input')[0]
                            input && input.focus()
    
                            const label = form.getElementsByTagName('label')[0]
                            label && label.classList.add('active')
    
                            return (form.style.transform = 'translateY(0)')
                        }
                    }
                })
                input.addEventListener('blur', () => {
                    const target = document.getElementById(this.mobile ? 'search-filter-wrapper-mobile' : 'search-filter-wrapper')
                    target && (target.style.transform = 'translateY(-100%)')
                    input.value = ''

                    if (this.mobile) {
                        const searchBar = document.getElementById('form-search-mobile')
                        searchBar && (searchBar.style.transform = 'translateY(-100%)')
                    }
                })
            }

            if (this.mobile) {
                const search = document.getElementById('search-action')
                search && search.addEventListener('click', () => {
                    const target = document.getElementById('form-search-mobile')
                    if (target) {
                        const input = target.getElementsByTagName('input')[0]
                        input && input.focus()

                        const label = target.getElementsByTagName('label')[0]
                        label && label.classList.add('active')

                        return (target.style.transform = 'translateY(0)')
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .form-search {
        height: 100%;
        min-width: 330px;

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

