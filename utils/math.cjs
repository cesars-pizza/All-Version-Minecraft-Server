function NegMod(value, mod) {
    while (value >= mod) value -= mod
    while (value < 0) value += mod
    return value
}

module.exports = {NegMod}