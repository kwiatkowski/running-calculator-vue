<template>
    <template v-if="data.difference">
        <span
        :class="[
            data.isProgress ? 'progress' : null,
            data.isProgress === false ? 'regress' : null
        ]"
        v-tooltip
        :title="getTooltip"
        data-bs-trigger="hover"
        data-bs-html="true"
        >
            {{ data.value.display }}
        </span>
    </template>

    <template v-else>
        {{ data.value.display }}
    </template>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    computed: {
        getTooltip() {
            if (this.data.difference && this.data.difference.percent != 0) {
                let displayString = this.data.difference.display

                if (this.data.unit) {
                    displayString += ' ' + this.data.unit
                }
            
                if (this.data.difference.percent && this.data.difference.percent != 0) {
                    displayString += '<br>(' + (this.data.difference.percent > 0 ? '+' : '') + this.data.difference.percent + '%)'
                }

                return displayString
            } else {
                return null
            }
        }
    }
}
</script>
