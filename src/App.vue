<template>
    <div id="app" class="body">
        <nav-menu></nav-menu>
        <router-view></router-view>
        <footer-view></footer-view>
    </div>
</template>

<script>
    import Navigation from '@/components/Navigation'
    import Footer from '@/components/Footer'

    export default {
        name: 'app',
        components: {
            'nav-menu': Navigation,
            'footer-view': Footer
        }
    }
</script>
