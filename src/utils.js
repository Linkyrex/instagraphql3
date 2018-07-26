function timeDifference(current, previous) {

    const milliSecondsPerMinute = 60 * 1000
    const milliSecondsPerHour = milliSecondsPerMinute * 60
    const milliSecondsPerDay = milliSecondsPerHour * 24
    const milliSecondsPerMonth = milliSecondsPerDay * 30
    const milliSecondsPerYear = milliSecondsPerDay * 365

    const elapsed = current - previous

    if (elapsed < milliSecondsPerMinute / 3) {
        return 'Gerade eben'
    }

    if (elapsed < milliSecondsPerMinute) {
        return 'vor weniger als einer Minute'
    }

    else if (elapsed < milliSecondsPerHour) {
        return 'vor ' +  Math.round(elapsed/milliSecondsPerMinute) + ' Minuten'
    }

    else if (elapsed < milliSecondsPerDay ) {
        return 'vor ' +  Math.round(elapsed/milliSecondsPerHour ) + ' Stunden'
    }

    else if (elapsed < milliSecondsPerMonth) {
        return 'vor ' +  Math.round(elapsed/milliSecondsPerDay) + ' Tagen'
    }

    else if (elapsed < milliSecondsPerYear) {
        return 'vor ' +  Math.round(elapsed/milliSecondsPerMonth) + ' Monaten'
    }

    else {
        return 'vor ' +  Math.round(elapsed/milliSecondsPerYear ) + ' Jahren'
    }
}

export function timeDifferenceForDate(date) {
    const now = new Date().getTime()
    const updated = new Date(date).getTime()
    return timeDifference(now, updated)
}