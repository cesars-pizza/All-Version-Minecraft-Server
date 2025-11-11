function NegMod(value, mod) {
    while (value >= mod) value -= mod
    while (value < 0) value += mod
    return value
}

/**
 * @param {{min: {x: number, z: number}, max: {x: number, z: number}}} newBoxBounds 
 * @param {{min: {x: number, z: number}, max: {x: number, z: number}}} oldBoxBounds 
 * @returns {{new: [{min: {x: number, z: number}, max: {x: number, z: number}}], obsolete: [{min: {x: number, z: number}, max: {x: number, z: number}}]}}
 */
function CalculateCollidingBoxes(newBoxBounds, oldBoxBounds, maxActingSize) {
    var openBoxes = [false, false, false, false, false, false, false, false]

    if (((newBoxBounds.max.z <= oldBoxBounds.max.z && newBoxBounds.max.z >= oldBoxBounds.min.z) || (newBoxBounds.min.z <= oldBoxBounds.max.z && newBoxBounds.min.z >= oldBoxBounds.min.z)) && (newBoxBounds.min.x < oldBoxBounds.min.x)) openBoxes[0] = true
    var newBoxNegX = {
        min: {
            x: newBoxBounds.min.x,
            z: Math.max(newBoxBounds.min.z, oldBoxBounds.min.z)
        }, max: {
            x: Math.min(newBoxBounds.max.x, oldBoxBounds.min.x - 1),
            z: Math.min(newBoxBounds.max.z, oldBoxBounds.max.z)
        }
    }

    if (((newBoxBounds.max.z <= oldBoxBounds.max.z && newBoxBounds.max.z >= oldBoxBounds.min.z) || (newBoxBounds.min.z <= oldBoxBounds.max.z && newBoxBounds.min.z >= oldBoxBounds.min.z)) && (newBoxBounds.max.x > oldBoxBounds.max.x)) openBoxes[1] = true
    var newBoxPosX = {
        min: {
            x: Math.max(newBoxBounds.min.x, oldBoxBounds.max.x + 1),
            z: Math.max(newBoxBounds.min.z, oldBoxBounds.min.z)
        }, max: {
            x: newBoxBounds.max.x,
            z: Math.min(newBoxBounds.max.z, oldBoxBounds.max.z)
        }
    }

    if (newBoxBounds.min.z < oldBoxBounds.min.z) openBoxes[2] = true
    var newBoxNegZ = {
        min: {
            x: newBoxBounds.min.x,
            z: newBoxBounds.min.z
        }, max: {
            x: newBoxBounds.max.x,
            z: Math.min(newBoxBounds.max.z, oldBoxBounds.min.z - 1)
        }
    }
    
    if (newBoxBounds.max.z > oldBoxBounds.max.z) openBoxes[3] = true
    var newBoxPosZ = {
        min: {
            x: newBoxBounds.min.x,
            z: Math.max(newBoxBounds.min.z, oldBoxBounds.max.z + 1)
        }, max: {
            x: newBoxBounds.max.x,
            z: newBoxBounds.max.z
        }
    }

    if (((oldBoxBounds.max.z <= newBoxBounds.max.z && oldBoxBounds.max.z >= newBoxBounds.min.z) || (oldBoxBounds.min.z <= newBoxBounds.max.z && oldBoxBounds.min.z >= newBoxBounds.min.z)) && (oldBoxBounds.min.x < newBoxBounds.min.x)) openBoxes[4] = true
    var oldBoxNegX = {
        min: {
            x: oldBoxBounds.min.x,
            z: Math.max(oldBoxBounds.min.z, newBoxBounds.min.z)
        }, max: {
            x: Math.min(oldBoxBounds.max.x, newBoxBounds.min.x - 1),
            z: Math.min(oldBoxBounds.max.z, newBoxBounds.max.z)
        }
    }

    if (((oldBoxBounds.max.z <= newBoxBounds.max.z && oldBoxBounds.max.z >= newBoxBounds.min.z) || (oldBoxBounds.min.z <= newBoxBounds.max.z && oldBoxBounds.min.z >= newBoxBounds.min.z)) && (oldBoxBounds.max.x > newBoxBounds.max.x)) openBoxes[5] = true
    var oldBoxPosX = {
        min: {
            x: Math.max(oldBoxBounds.min.x, newBoxBounds.max.x + 1),
            z: Math.max(oldBoxBounds.min.z, newBoxBounds.min.z)
        }, max: {
            x: oldBoxBounds.max.x,
            z: Math.min(oldBoxBounds.max.z, newBoxBounds.max.z)
        }
    }

    if (oldBoxBounds.min.z < newBoxBounds.min.z) openBoxes[6] = true
    var oldBoxNegZ = {
        min: {
            x: oldBoxBounds.min.x,
            z: oldBoxBounds.min.z
        }, max: {
            x: oldBoxBounds.max.x,
            z: Math.min(oldBoxBounds.max.z, newBoxBounds.min.z - 1)
        }
    }
    
    if (oldBoxBounds.max.z > newBoxBounds.max.z) openBoxes[7] = true
    var oldBoxPosZ = {
        min: {
            x: oldBoxBounds.min.x,
            z: Math.max(oldBoxBounds.min.z, newBoxBounds.max.z + 1)
        }, max: {
            x: oldBoxBounds.max.x,
            z: oldBoxBounds.max.z
        }
    }

    if (maxActingSize <= 0 || maxActingSize == undefined || isNaN(maxActingSize) || maxActingSize == null) maxActingSize = Infinity

    var returnValue = {
        new: [],
        obsolete: []
    }

    if (openBoxes[0]) {
        var subRowBoxes = []

        while ((newBoxNegX.max.x - newBoxNegX.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: newBoxNegX.min.x,
                    z: newBoxNegX.min.z
                }, max: {
                    x: newBoxNegX.min.x + maxActingSize - 1,
                    z: newBoxNegX.max.z
                }
            })

            newBoxNegX.min.x += maxActingSize
        }
        subRowBoxes.push(newBoxNegX)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.new.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.new.push(subRowBoxes[i])
        }
    }

    if (openBoxes[1]) {
        var subRowBoxes = []

        while ((newBoxPosX.max.x - newBoxPosX.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: newBoxPosX.min.x,
                    z: newBoxPosX.min.z
                }, max: {
                    x: newBoxPosX.min.x + maxActingSize - 1,
                    z: newBoxPosX.max.z
                }
            })

            newBoxPosX.min.x += maxActingSize
        }
        subRowBoxes.push(newBoxPosX)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.new.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.new.push(subRowBoxes[i])
        }
    }

    if (openBoxes[2]) {
        var subRowBoxes = []

        while ((newBoxNegZ.max.x - newBoxNegZ.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: newBoxNegZ.min.x,
                    z: newBoxNegZ.min.z
                }, max: {
                    x: newBoxNegZ.min.x + maxActingSize - 1,
                    z: newBoxNegZ.max.z
                }
            })

            newBoxNegZ.min.x += maxActingSize
        }
        subRowBoxes.push(newBoxNegZ)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.new.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.new.push(subRowBoxes[i])
        }
    }

    if (openBoxes[3]) {
        var subRowBoxes = []

        while ((newBoxPosZ.max.x - newBoxPosZ.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: newBoxPosZ.min.x,
                    z: newBoxPosZ.min.z
                }, max: {
                    x: newBoxPosZ.min.x + maxActingSize - 1,
                    z: newBoxPosZ.max.z
                }
            })

            newBoxPosZ.min.x += maxActingSize
        }
        subRowBoxes.push(newBoxPosZ)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.new.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.new.push(subRowBoxes[i])
        }
    }

    if (openBoxes[4]) {
        var subRowBoxes = []

        while ((oldBoxNegX.max.x - oldBoxNegX.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: oldBoxNegX.min.x,
                    z: oldBoxNegX.min.z
                }, max: {
                    x: oldBoxNegX.min.x + maxActingSize - 1,
                    z: oldBoxNegX.max.z
                }
            })

            oldBoxNegX.min.x += maxActingSize
        }
        subRowBoxes.push(oldBoxNegX)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.obsolete.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.obsolete.push(subRowBoxes[i])
        }
    }

    if (openBoxes[5]) {
        var subRowBoxes = []

        while ((oldBoxPosX.max.x - oldBoxPosX.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: oldBoxPosX.min.x,
                    z: oldBoxPosX.min.z
                }, max: {
                    x: oldBoxPosX.min.x + maxActingSize - 1,
                    z: oldBoxPosX.max.z
                }
            })

            oldBoxPosX.min.x += maxActingSize
        }
        subRowBoxes.push(oldBoxPosX)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.obsolete.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.obsolete.push(subRowBoxes[i])
        }
    }

    if (openBoxes[6]) {
        var subRowBoxes = []

        while ((oldBoxNegZ.max.x - oldBoxNegZ.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: oldBoxNegZ.min.x,
                    z: oldBoxNegZ.min.z
                }, max: {
                    x: oldBoxNegZ.min.x + maxActingSize - 1,
                    z: oldBoxNegZ.max.z
                }
            })

            oldBoxNegZ.min.x += maxActingSize
        }
        subRowBoxes.push(oldBoxNegZ)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.obsolete.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.obsolete.push(subRowBoxes[i])
        }
    }

    if (openBoxes[7]) {
        var subRowBoxes = []

        while ((oldBoxPosZ.max.x - oldBoxPosZ.min.x + 1) > maxActingSize) {
            subRowBoxes.push({
                min: {
                    x: oldBoxPosZ.min.x,
                    z: oldBoxPosZ.min.z
                }, max: {
                    x: oldBoxPosZ.min.x + maxActingSize - 1,
                    z: oldBoxPosZ.max.z
                }
            })

            oldBoxPosZ.min.x += maxActingSize
        }
        subRowBoxes.push(oldBoxPosZ)

        for (var i = 0; i < subRowBoxes.length; i++) {
            while ((subRowBoxes[i].max.z - subRowBoxes[i].min.z + 1) > maxActingSize) {
                returnValue.obsolete.push({
                    min: {
                        x: subRowBoxes[i].min.x,
                        z: subRowBoxes[i].min.z
                    }, max: {
                        x: subRowBoxes[i].max.x,
                        z: subRowBoxes[i].min.z + maxActingSize - 1
                    }
                })

                subRowBoxes[i].min.z += maxActingSize
            }
            returnValue.obsolete.push(subRowBoxes[i])
        }
    }

    return returnValue
}

module.exports = {NegMod, CalculateCollidingBoxes}