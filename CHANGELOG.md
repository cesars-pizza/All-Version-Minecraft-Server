# Changelog

This is a general overview of how the server protocol changes from version to version.

For more information, view the [development spreadsheet](https://docs.google.com/spreadsheets/d/1rxPJ9sm80nxbCEAkAXiAbzHODu7CdnCulBLebjD1Lhk/edit?usp=sharing).

## Java Edition Alpha v1.0.16_02

This version can't be distinguished from v1.0.16.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol?oldid=2769659)

## Java Edition Alpha v1.0.16_01

This version can't be distinguished from v1.0.16.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol?oldid=2769659)

## Java Edition Alpha v1.0.16

Protocol Version set to 14.

### Packets

Added Handshake clientbound and serverbound packet for account authentication (obsolete).

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol?oldid=2769659)

## Java Edition Alpha v1.0.15

Protocol Version set to 13.

This is the first version of Minecraft Alpha with public multiplayer support.

### Added Features

Added 32 new blocks.

Added items.

Allows blocks like water and lava to be placed, despite being previously in the game.

Some blocks can be interacted with to change their state such as doors and levers.

### Removed Features

Removed all wool colors except for white.

Creative mode has been replaced exclusively with survival mode.

### Packets

All the packets have been replaced in this version with a new protocol

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol?oldid=2769659)

## Java Edition Classic 0.30

This version can't be distinguished from 0.28_01.

This is the final version of Minecraft Classic.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.29_02

This version can't be distinguished from 0.28_01.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.29_01

This version can't be distinguished from 0.28_01.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.29

This version can't be distinguished from 0.28_01.

### Added Features

This version fixes the issue with rotation of other players.

Players can once again break bedrock.

### Packets

Added the Update User Type clientbound packet to change whether or not the player can break bedrock after they've connected.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.28_01

Protocol Version set to 7.

This is the first version to have blockstates.

### Added Features

This version adds 7 new blocks: iron block, smooth stone slab, bricks, tnt, bookshelf, mossy cobblestone, and obsidian.

This version also adds access to more blocks that were previously in the game.

Right click is now set to always place and left click is set to always break.

The option to allow players to break bedrock no longer works, meaning if you set your plot floor to bedrock, you have to go on a different version to fix it.

The rotation of other players is flipped across the X axis. This can't be corrected because it is fixed in later versions that can't be distinguished from this version.

### Packets

Disconnect Player clientbound packet has been readded.

### Notes

Placing two half slabs on top of each other creates a double slab. The only way to have multiple half slabs on top of each other is by going from top to bottom.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.23a_01

This version can't be distinguished from 0.0.20a_01.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.22a_05

This version can't be distinguished from 0.0.20a_01.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.21a

This version can't be distinguished from 0.0.20a_01.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.20a_02

This version can't be distinguished from 0.0.20a_01.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.20a_01

Protocol Version Set to 6.

### Added Features

This version adds 21 new blocks, over doubling the number of blocks previously in the game. The added blocks are wool (With different colors), dandelions, poppys, mushrooms, and the gold block.

A menu can be opened by pressing B which gives access to almost all available blocks in this version.

### Packets

The Player Identification serverbound packet has an new unsused byte field always set to 0.

The Server Identification clientbound packet has a new user type field that determines whether or not the player can break bedrock (Always enabled on this server).

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.19a_06

This version can't be distinguished by the server from 0.0.19a_04.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.19a_04

Protocol Version set to 5

### Added Features

Sponges and Glass Blocks were added to the game, replacing Cobblestone and Sand in the hotbar.

The hotbar has a new gui displaying all selectable blocks.

Falling blocks are no longer calculated client-side, removing ghost blocks of them and leaving the floating blocks.

### Packets

The Disconnect clientbound packet no longer works and has been replaced with setting the server name and status to the disconnect text and never sending the level finalize packet.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.18a_02

This version can't be distinguished by the server from 0.0.17a.

### Added Features

Player skins can now be seen. This only works if you use a proxy to get the skins from the correct site. All players use the wide model no matter what they select their skin to have.

Added more supported characters in chat.

### Packets

The Set Position and Orientaion clientbound packet now workd completely for player ID -1 (255)

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.17a

Protocol version number set to 4

### Added Features

Added Player List, accessed by clicking tab. Shows a list of all players.

The player's hitbox is now centered around their recorded position.

### Packets

The Spawn Player clientbound packet now works completely for player ID -1 (255)

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.16a_02

Protocol version numbers were added with this version's being 3 (Previous versions exist with protocol numbers that aren't archived which is why is doesn't start at 0 or 1).

### General

The client now displays the server's name and status while loading the terrain.

### Added Features

Chat was added to the game. This allows the server to send messages when a player joins and quits and as clarification of why the player is teleported when a block is placed inside them. It also allows for a message to show up whenever you enter a plot containing information about it. This allows for new server commands.

The client now detects if players are inside blocks being placed. This removes the previous function of teleporting players off of your plot when you place a block inside of them and allows players to block player building.

### Packets

The Player Identification serverbound packet added a protocol version and verification key field, although the verification key field is unused.

The Server Identification clientbound packet added a protocol version and server status field.

The Spawn Player clientbound packet pitch field is set to `256 - pitch` when the player ID is set to -1 (255).

The Disconnect clientbound packet was added making disconnecting much simpler and clearer.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).

## Java Edition Classic 0.0.15a (Multiplayer Test 1)
This is the first version of Minecraft with multiplayer and is the baseline.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol).