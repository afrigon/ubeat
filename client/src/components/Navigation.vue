<template>
    <header class="no-scroll grey darken-5 margin-0 flex flex-spaced">
        <div class="hide-after-s margin-left-30 margin-right-30 scroll-animate fadeInRight" style="flex-grow: 4">
            <i class="material-icons l text-white">menu</i>
        </div>
        <nav class="underline-animate padding-0 margin-0 scroll-animate fadeInScale" style="flex-grow: 4">
            <a class="block clickable" href="index.html">
                <div class="logo">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1500 1500" enable-background="new 0 0 1500 1500" xml:space="preserve">
                        <path id="logo-letter" fill="#FFFFFF" d="M637.529,1317.249c-33.94-10.352-63.983-25.649-90.111-45.892c-26.135-20.234-46.534-46.528-61.189-78.878c-14.663-32.343-21.99-69.077-21.99-110.188v-382.91c0-21.348,6.693-38.557,20.079-51.629c13.385-13.063,29.474-19.6,48.281-19.6c18.8,0,34.972,6.536,48.522,19.6c13.541,13.072,20.316,30.281,20.316,51.629v379.564c0,24.858,4.22,46.93,12.668,66.208c8.44,19.288,19.675,34.502,33.701,45.653c14.02,11.16,29.556,19.601,46.609,25.336c17.045,5.736,35.136,8.605,54.257,8.605c19.122,0,37.287-2.869,54.497-8.605c17.21-5.735,32.984-14.176,47.326-25.336c14.341-11.151,25.733-26.365,34.18-45.653c8.439-19.278,12.669-41.35,12.669-66.208V699.381c0-21.348,6.767-38.557,20.316-51.629c13.543-13.063,29.712-19.6,48.521-19.6c18.479,0,34.493,6.536,48.043,19.6c13.543,13.072,20.317,30.281,20.317,51.629v382.91c0,41.111-7.41,77.764-22.229,109.949c-14.819,32.194-35.301,58.402-61.428,78.638c-26.135,20.243-56.334,35.614-90.588,46.132c-34.262,10.517-71.468,15.773-111.624,15.773C708.518,1332.783,671.47,1327.601,637.529,1317.249z"/>
                        <g id="logo-headphones">
                            <path fill="#FFFFFF" d="M452,616.259v183.568c0,0-4.175,35.313-47.88,35.313c0,0-44.12,10.926-44.12-39.335V616.259c0,0-1.467-43.357,44.425-43.357C450.317,572.902,452,616.259,452,616.259z"/>
                            <path fill="#FFFFFF" d="M342,616.259v182.345c0,0-121.767,5.945-121.767-91.173C220.233,610.314,342,616.259,342,616.259z"/>
                            <path fill="#FFFFFF" d="M1050,792.787V609.219c0,0,4.177-35.313,47.882-35.313c0,0,44.118-10.927,44.118,39.335v179.546c0,0,1.468,43.357-44.425,43.357S1050,792.787,1050,792.787z"/>
                            <path fill="#FFFFFF" d="M1158,796.156V613.812c0,0,121.767-5.945,121.767,91.172C1279.767,802.101,1158,796.156,1158,796.156z"/>
                            <path fill="#FFFFFF" d="M1212.129,662.557c-0.269,0-0.536-0.004-0.805-0.013c-13.51-0.436-24.109-11.742-23.673-25.252c0.01-0.399,1.118-61.066-12.209-118.695c-12.097-52.301-38.969-127.472-98.302-188.577c-73.355-75.547-179.717-113.852-316.127-113.852c-136.802,0-244.602,38.531-320.405,114.522C322.548,449.046,321.604,636.536,321.607,638.242C321.641,651.759,310.71,663,297.192,663c-0.021,0-0.042,0-0.062,0c-13.489,0-24.441-11.14-24.474-24.637c-0.004-1.971,0.067-66.26,16.373-129.586c21.647-84.066,62.078-157.62,116.923-212.602c85.322-85.533,204.781-128.93,355.062-128.93c150.381,0,268.686,43.42,351.625,129.081c53.361,55.11,91.708,128.753,110.895,212.981c14.437,63.383,13.107,127.593,13.043,129.567C1236.149,652.115,1225.28,662.557,1212.129,662.557z"/>
                        </g>
                    </svg>
                </div>
            </a>
            <ul class="margin-left-30 capitalize hide-until-m">
                <router-link to="/"><li>Home</li></router-link>
                <router-link to="/album"><li>Album</li></router-link>
                <router-link to="/artist"><li>Artist</li></router-link>
            </ul>
        </nav>
        <form id="form-search" class="padding-0 flex flex-center hide-until-l">
            <div class="input-wrapper margin-0 margin-up-5 grey darken-5">
                <input type="search" name="q" onfocus="document.getElementById('search-filter-wrapper').style.top = '70px'" onblur="document.getElementById('search-filter-wrapper').style.top = '30px'"/>
                <label>Search</label>
            </div>
            <div id="search-filter-wrapper">
                <select id="search-filter" name="filter" class="gone" multiple>
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="4"></option>
                    <option value="8"></option>
                </select>
                <div class="notch-left absolute"></div>
                <div class="notch-right absolute"></div>
                <ul class="capitalize clickable text-white grey darken-5 margin-0 padding-left-15 padding-right-15">
                    <li id="filter-button-1" onmousedown="setFilter(event, 1)" class="inline-block text-thin text-size-small-8 padding-left-15 padding-right-15 padding-up-10 padding-down-5 primary-border">artist</li>
                    <li id="filter-button-2" onmousedown="setFilter(event, 2)" class="inline-block text-thin text-size-small-8 padding-left-15 padding-right-15 padding-up-10 padding-down-5 primary-border">album</li>
                    <li id="filter-button-4" onmousedown="setFilter(event, 4)" class="inline-block text-thin text-size-small-8 padding-left-15 padding-right-15 padding-up-10 padding-down-5 primary-border">song</li>
                    <li id="filter-button-8" onmousedown="setFilter(event, 8)" class="inline-block text-thin text-size-small-8 padding-left-15 padding-right-15 padding-up-10 padding-down-5 primary-border">user</li>
                </ul>
            </div>
        </form>
        <div id="avatar" class="text-right flex flex-right scroll-animate fadeInLeft" style="flex-grow: 4">
            <p class="text-white inline-block margin-0 margin-right-20 truncate hide-until-l">alexfrigon154</p>
            <div class="margin-left-30 margin-right-30 flex flex-center clickable">
                <img class="circle primary-border" src="/static/card.jpg" />
                <i class="material-icons text-white">keyboard_arrow_down</i>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        mounted () {
            this.load()
        },
        watch: { '$route': 'load' },
        methods: {
            load () {
                const letter = document.getElementById('logo-letter')
                const headphones = document.getElementById('logo-headphones')
                setTimeout(() => { return (letter.style.opacity = 1) }, 200)
                setTimeout(() => { return (headphones.style.opacity = 1) }, 800)
                setTimeout(() => { return (letter.style.transform = 'none') }, 1200)
            }
        }
    }
</script>

<style>
    .logo:hover{ border-color: #E0E0E0; }
    .logo:hover .logo-main { fill: #E0E0E0; }
    #logo-letter { transform: translateY(-300px); }
    #logo-headphones, #logo-letter {
        transition: opacity 1.5s ease, transform 1s ease, fill 0.5s ease;
        opacity: 0;
    }
    #logo-headphones path { transition: fill 0.5s ease; }

    header nav.underline-animate li::after { opacity: 0.75; }
    .input-wrapper label.active { transform: translateY(-8px) scale(.8); }

    #form-search { height: 100%; min-width: 350px; }
    #search-filter-wrapper {
        position: absolute;
        height: 40px;
        top: 30px;
        transition: top 300ms ease-out, opacity 300ms ease-in;
        z-index: -1;
    }
    #search-filter-wrapper ul { border-radius: 0 0 15px 15px; height: 100%; }
    #search-filter-wrapper ul li { 
        border: 0px solid;
        transition: border 300ms ease;
    }
    #search-filter-wrapper ul li:hover { background-color: #353535; }
    #search-filter-wrapper ul .active { border-bottom: 3px solid; background-color: #353535; }

    .notch-left {
        background: -moz-radial-gradient(0 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
        background: -o-radial-gradient(0 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
        background: -webkit-radial-gradient(0 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
        background-position: bottom left;
        -moz-background-size: 100% 100%;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 16px;
        height: 16px;
        left: -15px;
        top: -1px;
    }

    .notch-right {
        background: -moz-radial-gradient(100% 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
        background: -o-radial-gradient(100% 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
        background: -webkit-radial-gradient(100% 100%, circle, rgba(0,0,0,0) 14px, #212121 15px);
        background-position: bottom right;
        -moz-background-size: 100% 100%;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 16px;
        height: 16px;
        right: -15px;
        top: -1px;
    }

    #avatar img {
        width: 40px;
        height: 40px;
        border: solid 2px;
    }

    #avatar p {
        min-width: 150px;
    }
</style>
