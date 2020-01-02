/**
 * Writing data for hacking stem experiments
 */
//% weight=94 color=#EC7505 icon="\uf1b3"
namespace hourOfCode {
    // the agentDestroy and hazardsRemain functions are supposed to
    // look indistinguishable from lesson to lesson, since only one
    // set will ever appear at a time. their display names should
    // not specifically include which lesson they are a part of
    let targetsL4 = 5
    let targetsL5 = 10
    let targetsL6 = 49
    let counterL4 = 9
    let counterL5 = 30
    let counterL6 = 60
    let shortHazard = 31   // fern and tallgrass
    let tallHazard = 175   // double plant (variants: peony, rose bush, double tallgrass, large fern, lilac, sunflower)
    let airBlock = Block.Air
    let brokeNonHazard = false
    let taskIsComplete = false
    let monitorCount = 18

    // hidden from user, used by other functions
    //% block
    function completeTask() {
        if (!taskIsComplete) {
            mobs.execute(
                mobs.target(TargetSelectorKind.NearestPlayer),
                positions.create(0, 0, 0),
                "scoreboard players set @s success 1"
            )
            taskIsComplete = true
        }
    }

    /**
     * Opens a gate
     */
    //% block="ooopen gate"
    //% weight=90
    export function openDoor() {
        completeTask()
    }

    /**
     * Detects if there is a dry fern next to the agent in the specified direction
     * @param dir the direction to detect the dry fern
     */
    //% block="agent detect dry fern %dir"
    //% weight=80
    export function agentDetectDryFern(dir: SixDirection) {
        return agent.inspect(AgentInspection.Block, dir) == shortHazard
    }

    /**
     * Detects if there is dry grass next to the agent in the specified direction
     * @param dir the direction to detect the dry grass
     */
    //% block="agent detect dry grass %dir"
    //% weight=80
    export function agentDetectDryGrass(dir: SixDirection) {
        return agent.inspect(AgentInspection.Block, dir) == tallHazard
    }

    /**
     * Detects if there is dry brush next to the agent in the specified direction
     * @param dir the direction to detect the dry brush
     */
    //% block="agent detect dry brush %dir"
    //% weight=80
    export function agentDetectDryBrush(dir: SixDirection) {
        let currentTarget = agent.inspect(AgentInspection.Block, dir)
        return currentTarget == tallHazard || currentTarget == shortHazard
    }
    
    /**
     * Check for any hazards in a direction
     * @param dir the direction to check for hazards
     */
    //% block="agent analyze %dir"
    //% weight=70
    export function agentAnalyze(dir: SixDirection) {
        let targetBlock = agent.inspect(AgentInspection.Block, dir)
        if (targetBlock == shortHazard || targetBlock == tallHazard) {
            mobs.execute(
                mobs.target(TargetSelectorKind.NearestPlayer),
                positions.create(0, 0, 0),
                "playsound random.levelup @p"
            )
            completeTask()
        }
    }

    /**
     * Checks that there are fire hazards
     */
    //% block="hazards remain"
    //% weight=45
    export function hazardsRemainL4() {
        let timeout = 10
        if (agent.inspect(AgentInspection.Block, SixDirection.Forward) == airBlock) {
            counterL4--
            if (targetsL4 <= 0) {
                completeTask()
                return false
            } else if (counterL4 < 0) {
                return false
            } else if (brokeNonHazard) {
                return false
            }
            while (agent.inspect(AgentInspection.Block, SixDirection.Forward) == airBlock) {
                loops.pause(100)
                if (timeout-- <= 0) {
                    return false
                }
            }
        }
        return true
    }

    /**
     * Commands the agent to destroy a block in the given direction
     * @param dir the direction to destroy a block at
     */
    //% block="agent destroy %dir"
    //% weight=40
    export function agentDestroyL4(dir: SixDirection) {
        let targetBlock4 = agent.inspect(AgentInspection.Block, dir)
        if (targetBlock4 == shortHazard || targetBlock4 == tallHazard) {
            targetsL4--
        } else if (targetBlock4 != airBlock) {
            brokeNonHazard = true
        }
        agent.destroy(dir)
    }

    /**
     * Checks that there are fire hazards
     */
    //% block="hazards remain"
    //% weight=55
    export function hazardsRemainL5() {
        counterL5--
        if (brokeNonHazard) {
            return false
        } else if (counterL5 < 0) {
            return false
        } else if (targetsL5 <= 0) {
            completeTask()
            return false
        } else {
            return true
        }
    }

    /**
     * Commands the agent to destroy a block in the given direction
     * @param dir the direction to destroy a block at
     */
    //% block="agent destroy %dir"
    //% weight=50
    export function agentDestroyL5(dir: SixDirection) {
        let targetZ5 = 70
        let agentZ5 = agent.getPosition().getValue(Axis.Z)
        let targetBlock5 = agent.inspect(AgentInspection.Block, dir)
        if (targetBlock5 == shortHazard || targetBlock5 == tallHazard) {
            if (Math.abs(agentZ5 - targetZ5) <= 1) {
                targetsL5--
            } else {
                brokeNonHazard = true
            }
        } else if (targetBlock5 != airBlock) {
            brokeNonHazard = true
        }
        agent.destroy(dir)
    }

    /**
     * Checks that there are fire hazards
     */
    //% block="hazards remain"
    //% weight=65
    export function hazardsRemainL6() {
        counterL6--
        if (brokeNonHazard) {
            return false
        } else if (counterL6 < 0) {
            return false
        } else if (targetsL6 <= 0) {
            completeTask()
            return false
        } else {
            return true
        }
    }

    /**
     * Commands the agent to destroy a block in the given direction
     * @param dir the direction to destroy a block at
     */
    //% block="agent destroy %dir"
    //% weight=60
    export function agentDestroyL6(dir: SixDirection) {
        let targetX6 = -8
        let targetZ6 = 77
        let radius = 5
        let agentX6 = agent.getPosition().getValue(Axis.X)
        let agentZ6 = agent.getPosition().getValue(Axis.Z)
        let targetBlock6 = agent.inspect(AgentInspection.Block, dir)
        if (targetBlock6 == shortHazard || targetBlock6 == tallHazard) {
            if (Math.abs(agentX6 - targetX6) <= radius && Math.abs(agentZ6 - targetZ6) <= radius) {
                targetsL6--
            } else {
                brokeNonHazard = true
            }
        } else if (targetBlock6 != airBlock) {
            brokeNonHazard = true
        }
        agent.destroy(dir)
    }
    
    /**
     * Agent watches the monitor for hazards
     */
    //% block="agent look for hazards"
    //% weight=75
    export function agentLookForHazards() {
        monitorCount--
        loops.pause(500)
        if (taskIsComplete) {
            return false
        } else if (monitorCount < 0) {
            return false
        } else {
            return true
        }
    }

    /**
     * Sees that there is a hazard on the monitor
     */
    //% block="hazard found"
    //% weight=74
    export function agentSeeHazard() {
        let hiddenTarget = positions.createWorld(-63, 68, -78)
        let successBlock = Block.GoldBlock
        return blocks.testForBlock(successBlock, hiddenTarget)
    }
    
    /**
     * Warns the team of a high-risk area
     */
    //% block="alert team"
    //% weight = 70
    export function alertTeam() {
        agent.attack(SixDirection.Up)
        if (agentSeeHazard()) {
           completeTask()
        } else {
           monitorCount = -1
        }
    }
    
    let NORTH = -180
    let EAST = -90
    let SOUTH = 0
    let WEST = 90
    let UNIT_NORTH = positions.create(0, 0, -1)
    let UNIT_EAST = positions.create(1, 0, 0)
    let UNIT_SOUTH = positions.create(0, 0, 1)
    let UNIT_WEST = positions.create(-1, 0, 0)
    let UNIT_UP = positions.create(0, 1, 0)
    let UNIT_DOWN = positions.create(0, -1, 0)

    /**
     * Places an item or block in the world
     */
    //% block="agent place %b %dir"
    //% weight = 99
    export function fakePlace(b: Block, dir: SixDirection) {
        let agentOrientation = agent.getOrientation()
        let agentPosition = agent.getPosition()
        agent.attack(SixDirection.Up)
        if (agent.inspect(AgentInspection.Block, dir) == Block.Air) {
            if (dir == SixDirection.Up) {
                blocks.place(b, positions.add(
                    agentPosition,
                    UNIT_UP
                ))
            } else if (dir == SixDirection.Down) {
                blocks.place(b, positions.add(
                    agentPosition,
                    UNIT_DOWN
                ))
            } else if (agentOrientation == NORTH) {
                if (dir == SixDirection.Forward) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_NORTH
                    ))
                } else if (dir == SixDirection.Right) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_EAST
                    ))
                } else if (dir == SixDirection.Back) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_SOUTH
                    ))
                } else if (dir == SixDirection.Left) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_WEST
                    ))
                }
            } else if (agentOrientation == EAST) {
                if (dir == SixDirection.Forward) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_EAST
                    ))
                } else if (dir == SixDirection.Right) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_SOUTH
                    ))
                } else if (dir == SixDirection.Back) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_WEST
                    ))
                } else if (dir == SixDirection.Left) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_NORTH
                    ))
                }
            } else if (agentOrientation == SOUTH) {
                if (dir == SixDirection.Forward) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_SOUTH
                    ))
                } else if (dir == SixDirection.Right) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_WEST
                    ))
                } else if (dir == SixDirection.Back) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_NORTH
                    ))
                } else if (dir == SixDirection.Left) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_EAST
                    ))
                }
            } else if (agentOrientation == WEST) {
                if (dir == SixDirection.Forward) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_WEST
                    ))
                } else if (dir == SixDirection.Right) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_NORTH
                    ))
                } else if (dir == SixDirection.Back) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_EAST
                    ))
                } else if (dir == SixDirection.Left) {
                    blocks.place(b, positions.add(
                        agentPosition,
                        UNIT_SOUTH
                    ))
                }
            }
        }
    }
}
