<template lang="pug">
    .playlist.clickable(v-bind:id="genre" v-bind:data-color="color")
        .filter.black
        i.play.material-icons.text-white play_circle_outline
        svg.live(version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve")
            circle(cx="0" cy="0" r="12.247" transform="translate(50 50)")
                animateTransform(attributeName="transform" type="scale" dur="3s" repeatCount="indefinite" from="1 1" to="0.5 0.5" additive="sum" values="1 1 ; 0.8 0.8 ; 1 1" keyTimes="0;0.5;1")
            g
                path(d="M35.499,68.75c-0.578,0-1.159-0.199-1.631-0.606C33.536,67.857,25.75,61.019,25.75,50c0-11.019,7.786-17.858,8.118-18.144c1.046-0.901,2.625-0.784,3.526,0.261c0.9,1.044,0.785,2.618-0.255,3.521C37.044,35.721,30.75,41.347,30.75,50c0,8.753,6.318,14.302,6.382,14.356c1.046,0.901,1.163,2.48,0.261,3.526C36.899,68.456,36.201,68.75,35.499,68.75z")
                path(d="M64.405,68.75c-0.702,0-1.4-0.294-1.895-0.867c-0.901-1.046-0.784-2.625,0.261-3.526c0.058-0.05,6.383-5.683,6.383-14.356c0-8.753-6.318-14.301-6.383-14.356c-1.045-0.901-1.162-2.48-0.261-3.526c0.902-1.045,2.479-1.163,3.526-0.261c0.331,0.286,8.117,7.125,8.117,18.144c0,11.019-7.786,17.857-8.117,18.144C65.564,68.551,64.983,68.75,64.405,68.75z")
                animateTransform(attributeName="transform" type="rotate" dur="7s" repeatCount="indefinite" values="0 50 50;30 50 50;-210 50 50;-180 50 50 ; -180 50 50;-150 50 50;-390 50 50;-360 50 50;-360 50 50" keyTimes="0;0.05;0.15;0.25 ; 0.5;0.55;0.65;0.75;1" keySplines="0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0 0 1 1" calcMode="spline")
            g
                path(d="M24.835,86.247c-1.153,0-2.311-0.397-3.253-1.21C20.941,84.485,5.904,71.277,5.904,50s15.038-34.485,15.678-35.037c2.091-1.804,5.25-1.569,7.052,0.522c1.8,2.087,1.57,5.237-0.511,7.042C27.911,22.714,15.904,33.475,15.904,50c0,16.588,12.099,27.368,12.221,27.475c2.072,1.814,2.295,4.969,0.489,7.048C27.624,85.662,26.233,86.247,24.835,86.247z")
                path(d="M75.06,86.25c-1.404,0-2.8-0.588-3.789-1.735c-1.803-2.092-1.569-5.249,0.522-7.052C71.901,77.368,84,66.588,84,50c0-16.746-12.085-27.358-12.207-27.463c-2.092-1.803-2.325-4.96-0.522-7.052c1.804-2.09,4.961-2.325,7.052-0.522C78.963,15.515,94,28.723,94,50S78.963,84.485,78.322,85.037C77.378,85.852,76.216,86.25,75.06,86.25z")
                animateTransform(attributeName="transform" type="rotate" dur="7s" repeatCount="indefinite" values="0 50 50;-30 50 50;210 50 50;180 50 50 ; 180 50 50;150 50 50;390 50 50;360 50 50;360 50 50" keyTimes="0;0.05;0.15;0.25 ; 0.5;0.55;0.65;0.75;1" keySplines="0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0 0 1 1 ; 0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0.42 0 0.58 1 ; 0 0 1 1" calcMode="spline")
</template>

<script>
    export default {
        props: ['genre', 'color'],
        mounted () {
            this.createEvent(this.genre, this.color)
        },
        methods: {
            createEvent (genre, color) {
                document.getElementById(genre).addEventListener('click', (event) => {
                    this.$router.replace({ path: '/', query: { station: genre } })
                })
            }
        }
    }
</script>


<style lang="scss">
    .playlist {
        position: relative;
        $size: 150;
        background-image: url('/static/img/playlists.jpg');
        background-repeat: no-repeat;
        width: #{$size}px;
        height: #{$size}px;
        border-radius: 4px;
        margin: 10px;
        display: inline-block;

        @for $i from 0 to 4 {
            @for $j from 0 to 4 {
                &:nth-child(#{$i * 4 + $j + 1}) {
                    background-position: #{-$size * $j}px #{-$size * $i}px;
                }
            }
        }
        
        .play, .live {
            opacity: 0;
            transition: opacity 300ms ease;
            position: absolute;
            font-size: 60px;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            line-height: 150px;
        }
        .live {
            width: 60px;
            height: 60px;
            top: 50%;
            left: 50%;
            margin-top: -30px;
            margin-left: -30px;

            path, circle {
                fill: rgb(245, 68, 59);
            }
        }
        .filter {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            opacity: 0;
            transition: opacity 300ms ease;
        }
        &:hover .filter, &.playing .filter { opacity: .5; }
        &:hover:not(.playing) { .play { opacity: 1; } }
        &.playing { .live { opacity: 1; } }
        * { pointer-events: none; }
    }
</style>

