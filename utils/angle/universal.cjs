const { World, Socket, Position, Player, Rotation } = require("../../data_structures.cjs");
const utils = require('../utils.cjs')

function GetDirectionNESW(yaw) {
    if (utils.math.NegMod(yaw + 45, 360) < 90) return "south"
    else if (utils.math.NegMod(yaw - 45, 360) < 90) return "west"
    else if (utils.math.NegMod(yaw - 135, 360) < 90) return "north"
    else if (utils.math.NegMod(yaw - 225, 360) < 90) return "east"

    return "???"
}

function GetDirection16(yaw) {
    if (utils.math.NegMod(yaw + 11.25, 360) < 22.5) return "south"
    else if (utils.math.NegMod(yaw - 11.25, 360) < 22.5) return "south-southwest"
    else if (utils.math.NegMod(yaw - 33.75, 360) < 22.5) return "southwest"
    else if (utils.math.NegMod(yaw - 56.25, 360) < 22.5) return "west-southwest"
    else if (utils.math.NegMod(yaw - 78.75, 360) < 22.5) return "west"
    else if (utils.math.NegMod(yaw - 101.25, 360) < 22.5) return "west-northwest"
    else if (utils.math.NegMod(yaw - 123.75, 360) < 22.5) return "northwest"
    else if (utils.math.NegMod(yaw - 146.25, 360) < 22.5) return "north-northwest"
    else if (utils.math.NegMod(yaw - 168.75, 360) < 22.5) return "north"
    else if (utils.math.NegMod(yaw - 191.25, 360) < 22.5) return "north-northeast"
    else if (utils.math.NegMod(yaw - 213.75, 360) < 22.5) return "northeast"
    else if (utils.math.NegMod(yaw - 236.25, 360) < 22.5) return "east-northeast"
    else if (utils.math.NegMod(yaw - 258.75, 360) < 22.5) return "east"
    else if (utils.math.NegMod(yaw - 281.25, 360) < 22.5) return "east-southeast"
    else if (utils.math.NegMod(yaw - 303.75, 360) < 22.5) return "southeast"
    else if (utils.math.NegMod(yaw - 326.25, 360) < 22.5) return "south-southeast"

    return "???"
}

function GetDirection16Num(yaw) {
    if (utils.math.NegMod(yaw + 11.25, 360) < 22.5) return 0
    else if (utils.math.NegMod(yaw - 11.25, 360) < 22.5) return 1
    else if (utils.math.NegMod(yaw - 33.75, 360) < 22.5) return 2
    else if (utils.math.NegMod(yaw - 56.25, 360) < 22.5) return 3
    else if (utils.math.NegMod(yaw - 78.75, 360) < 22.5) return 4
    else if (utils.math.NegMod(yaw - 101.25, 360) < 22.5) return 5
    else if (utils.math.NegMod(yaw - 123.75, 360) < 22.5) return 6
    else if (utils.math.NegMod(yaw - 146.25, 360) < 22.5) return 7
    else if (utils.math.NegMod(yaw - 168.75, 360) < 22.5) return 8
    else if (utils.math.NegMod(yaw - 191.25, 360) < 22.5) return 9
    else if (utils.math.NegMod(yaw - 213.75, 360) < 22.5) return 10
    else if (utils.math.NegMod(yaw - 236.25, 360) < 22.5) return 11
    else if (utils.math.NegMod(yaw - 258.75, 360) < 22.5) return 12
    else if (utils.math.NegMod(yaw - 281.25, 360) < 22.5) return 13
    else if (utils.math.NegMod(yaw - 303.75, 360) < 22.5) return 14
    else if (utils.math.NegMod(yaw - 326.25, 360) < 22.5) return 15

    return 0
}

module.exports = {GetDirectionNESW, GetDirection16, GetDirection16Num}