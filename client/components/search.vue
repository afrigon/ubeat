<template lang="pug">
    form#form-search.padding-0.flex.flex-center.hide-until-l(method="GET" action="/api/unsecure/search")
        .input-wrapper.margin-0.margin-up-5.grey.darken-5
            input(type="search" name="q" autocomplete="off" onfocus="document.getElementById('search-filter-wrapper').style.top = '70px'" onblur="document.getElementById('search-filter-wrapper').style.top = '30px'")
            label Search
        #search-filter-wrapper
            select#search-filter.gone(name="filter" multiple="")
                option(value="1")
                option(value="2")
                option(value="4")
                option(value="8")
            .notch-left.absolute
            .notch-right.absolute
            ul.capitalize.clickable.text-white.grey.darken-5.margin-0.padding-left-15.padding-right-15
                li#filter-button-1.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 1)") artist
                li#filter-button-2.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 2)") album
                li#filter-button-4.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 4)") song                                    
                li#filter-button-8.inline-block.text-thin.text-size-small-8.padding-left-15.padding-right-15.padding-up-10.padding-down-5.primary-border(onmousedown="setFilter(event, 8)") user
</template>

<script>
    export default {
    
    }
</script>

<style lang="scss">
    #form-search {
        height: 100%;
        min-width: 330px;

        #search-filter-wrapper {
            position: absolute;
            height: 33px;
            top: 30px;
            transition: top 300ms ease-out, opacity 300ms ease-in;
            z-index: -1;

            ul {
                border-radius: 0 0 15px 15px;
                height: 100%;

                .active {
                    border-bottom: 3px solid;
                    background-color: #353535;
                }

                li {
                    border: 0px solid;
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
    }
</style>

