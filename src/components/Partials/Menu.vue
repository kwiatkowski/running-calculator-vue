<template>
    <nav class="app__nav">
        <router-link
        :to="{ name: 'list' }"
        class="app__nav-link"
        v-html="$t('calc.navigation.list')"
        exact
        ></router-link>

        <!--
        <router-link
        :to="{ name: 'charts' }"
        class="app__nav-link"
        v-html="$t('calc.navigation.charts')"
        ></router-link>
        -->

        <router-link
        :to="{ name: 'plan-run' }"
        class="app__nav-link"
        v-html="$t('calc.navigation.plan_run')"
        ></router-link>
    </nav>
</template>
