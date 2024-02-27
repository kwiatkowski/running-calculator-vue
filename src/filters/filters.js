import 'moment-duration-format'
import moment from 'moment'

export function formatDistance(value, unit = 'm', showUnit = false ) {
    if (value === null && showUnit) {
        return '-'
    }

    const distance = unit === 'm' ? value : value / 1000

    const formattedDistance = showUnit ? `${(unit === 'm' ? distance : distance.toFixed(2))} ${unit}` : distance.toFixed(2)

    return formattedDistance
}
