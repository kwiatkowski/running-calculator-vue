import { createVNode, render, h } from 'vue'
import LoaderComponent from '~/components/Core/Loader/Loader.vue'

const LoaderDirective = {
    mounted(el, binding) {
        const loaderProps = {
            loader: binding.value.loader,
            type: binding.value.type || null,
            text: binding.value.text || null
        }

        const vnode = createVNode(LoaderComponent, loaderProps)
        const app = h('div', { id: 'loader-container' }, [vnode])

        render(app, el)
    },
    updated(el, binding) {
        const { isLoading, isError } = binding.value.loader

        if (isLoading) {
            el.classList.add('is-loading')
        } else {
            el.classList.remove('is-loading')
        }

        if (isError) {
            el.classList.add('is-error')
        } else {
            el.classList.remove('is-error')
        }
    }
}

export default {
    install(app) {
        app.directive('loader', LoaderDirective)
    }
}
