# Minecraft Server JS [![Build Status](https://api.travis-ci.com/cesars-pizza/All-Version-Minecraft-Server.png)](https://api.travis-ci.com/cesars-pizza/Minecraft-Server-JS)

By Cesar Vigil from the amazing work of the [Minecraft Wiki](minecraft.wiki)

The goal of this project is to implement the server protocol of every archived version of Minecraft with released multiplater (including snapshots and April Fools updates). Instead of being an implementation of the full game and all of it's features like crafting and world generation. It is a bare bones world with claimable plots to create small builds in.

## Progress

The latest version supported in this project is Java Edition Alpha v1.1.2_01, released on September 23rd, 2010.

This is 27 / 961 Versions to be supported as of snapshot 25w36b being the latest.

[//--------------------------------------------------------------------------------------------------] (2.8%)

View the [changelog](https://github.com/cesars-pizza/All-Version-Minecraft-Server/blob/main/CHANGELOG.md) for details on changes in this version.

## How To Use

Node JS is required to start and operate this server. It can be downloaded from [nodejs.org](https://nodejs.org/en/download/current)

Open the project folder in your desired console / terminal and run the command `node server.cjs`

Any settings including the server port and name can be edited inside of `config.json`

## Commands

### /save

Saves all players and builds

### /close

Disconnects all players and turns off the server

### /tp [player]

Teleports to other player

### /plotTp [plotX] [plotZ]

Teleports to any specific plot.

### /settings

Allows for the modification of player settings

plotInfo: Whether or not to show info of other players plots when being entered. Can be set to enable or disable.

plot.blockUpdate: Whether or not blocks will send updates to other blocks when changed. Can be set to enableDefault or disableDefault. Can be set to enable or disable when in a plot.

plot.redstoneUpdate: Whether or not redstone components will function. Can be set to enableDefault or disableDefault. Can be set to enable or disable when in a plot. (currently does nothing)

plot.liquidUpdate: Whether or not water and lava will flow. Can be set to enableDefault or disableDefault. Can be set to enable or disable when in a plot.

plot.publicInteractions: Whether or not other players are able to interact with blocks such as doors, levers, and buttons. Can be set to enable or disable when in a plot.

plot.time: The time of day the plot is in. Can be set to "day", "noon", "night", "midnight", or any Long value when in a plot. Available starting in Alpha v1.0.17_04

### /swapInv

Swaps the items in the inventory to allow all available block and items to be accessed. Only available starting in Alpha v1.1.0.

## Copyright

This project does not use any code sourced directly from Minecraft. It simply follows a protocol found within the game. 

The protocol and information that this project is built upon is protected by the terms of [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0).

This project is free to share and adapt so long as it is given proper credit.