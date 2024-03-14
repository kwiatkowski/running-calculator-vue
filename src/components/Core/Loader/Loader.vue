<template>
  <div
    v-if="showLoader || showError"
    class="loader__wrap"
  >
    <template v-if="showLoader">
      <div
        v-if="!type"
        class="loader"
      >
        <span class="loader__circle"></span>
        <span class="loader__circle"></span>
        <span class="loader__circle"></span>
        <span class="loader__circle"></span>
      </div>

      <div
        v-if="text"
        class="loader__text"
        v-html="text"
      ></div>
    </template>

    <div
    v-if="showError"
    class="loader__error"
    >
      <ul>
        <li v-for="message in errorMessages" :key="message">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loader: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    ignoreError: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showLoader() {
      return this.loader.some(loader => loader.isLoading);
    },
    showError() {
      return this.loader.some(loader => loader.isError && loader.apiErrors && !this.ignoreError);
    },
    errorMessages() {
      return this.loader
        .filter(loader => loader.isError && loader.apiErrors && !this.ignoreError)
        .map(loader => loader.apiErrors.message)
    }
  }
}
</script>