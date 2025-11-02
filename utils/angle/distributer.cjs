function GetDirectionNESW(yaw) {
    return require('./universal.cjs').GetDirectionNESW(yaw)
}

function GetDirection16(yaw) {
    return require('./universal.cjs').GetDirection16(yaw)
}

function GetDirection16Num(yaw) {
    return require('./universal.cjs').GetDirection16Num(yaw)
}

module.exports = {
    GetDirectionNESW, GetDirection16, GetDirection16Num
}