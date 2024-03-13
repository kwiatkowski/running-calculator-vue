<template>
  <div class="content">
    <h1
    class="section__title"
    v-html="$t('error404.title')"
    ></h1>

    <p
    class="intro-paragraph"
    v-html="$t('error404.text')"
    ></p>

    <p
    class="more-paragraph"
    v-html="$t('error404.more', { counter: counter })"
    ></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 5
    }
  },
  methods: {
    startCountdown() {
      const timer = setInterval(() => {
        if (this.counter > 0) {
          this.counter--
        } else {
          clearInterval(timer)

          this.$router.push({ name: 'list' })
        }
      }, 1000)
    }
  },
  mounted() {
    this.startCountdown()
  }
}
</script>
