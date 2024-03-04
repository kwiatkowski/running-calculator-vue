import { Tooltip } from 'bootstrap'

const TooltipDirective = {
    mounted(el) {
        const tooltip = new Tooltip(el)
    }
}

export default {
    install(app) {
        app.directive('tooltip', TooltipDirective)
    }
}
