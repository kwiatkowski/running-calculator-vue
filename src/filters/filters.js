export function formatDistance(value, unit = 'm', showUnit = false ) {
    if (showUnit && (value === '-' || value === null || value === undefined)) {
        return '-'
    }

    const distance = unit === 'm' ? value : value / 1000

    const formattedDistance = showUnit ? `${(unit === 'm' ? distance : distance.toFixed(2))} ${unit}` : distance.toFixed(2)

    return formattedDistance
}
