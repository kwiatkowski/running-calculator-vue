import { createVNode, render, h } from 'vue'
import LoaderComponent from '~/components/Core/Loader/Loader.vue'


const LoaderDirective = {
    mounted(el, binding) {
        updateClasses(el, binding)
        renderLoader(el, binding)
    },
    updated(el, binding) {
        updateClasses(el, binding)
    }
}

function updateClasses(el, binding) {
    const loaders = Array.isArray(binding.value.loader) ? binding.value.loader : [binding.value.loader];

    let isError = false;
    let isLoading = false;

    loaders.forEach(loader => {
        if (loader.isError) {
            isError = true;
        }

        if (loader.isLoading) {
            isLoading = true;
        }
    });

    if (isError) {
        el.classList.remove('is-loading')
        el.classList.remove('is-loading--' + binding.arg)
        el.classList.add('is-error')
    } else {
        if (isLoading) {
            el.classList.add('is-loading')
            if (binding.arg) {
                el.classList.add('is-loading--' + binding.arg)
            }
        } else {
            el.classList.remove('is-loading')
            if (binding.arg) {
                el.classList.remove('is-loading--' + binding.arg)
            }
        }

        el.classList.remove('is-error')
    }
}

function renderLoader(el, binding) {
    const loaderProps = {
        loader: Array.isArray(binding.value.loader) ? binding.value.loader : [binding.value.loader] || {},
        type: binding.arg || null,
        text: binding.value.text || null,
        ignoreError: binding.value.ignoreError || null,
    }

    const vnode = createVNode(LoaderComponent, loaderProps)
    const app = h('div', [vnode])

    render(app, el)
}

export default {
    install(app) {
        app.directive('loader', LoaderDirective)
    }
}
