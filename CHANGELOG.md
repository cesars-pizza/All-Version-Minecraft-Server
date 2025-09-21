# Changelog

This is a general overview of how the server protocol changes from version to version

For more information, view the [development spreadsheet](https://docs.google.com/spreadsheets/d/1rxPJ9sm80nxbCEAkAXiAbzHODu7CdnCulBLebjD1Lhk/edit?usp=sharing).

## Java Edition Classic 0.0.19a_04

Protocol Version set to 5

### Added Features

Sponges and Glass Blocks were added to the game, replacing Cobblestone and Sand in the hotbar.

The hotbar has a new gui displaying all selectable blocks.

Falling blocks are no longer calculated client-side, removing ghost blocks of them and leaving the floating blocks.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.0.18a_02

This version can't be distinguished by the server from 0.0.17a.

### Added Features

Player skins can now be seen. This only works if you use a proxy to get the skins from the correct site. All players use the wide model no matter what they select their skin to have.

Added more supported characters in chat.

### Packets

The Set Position and Orientaion clientbound packet now workd completely for player ID -1 (255)

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.0.17a

Protocol version number set to 4

### Added Features

Added Player List, accessed by clicking tab. Shows a list of all players.

The player's hitbox is now centered around their recorded position.

### Packets

The Spawn Player clientbound packet now works completely for player ID -1 (255)

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.0.16a_02

Protocol version numbers were added with this version's being 3 (Previous versions exist with protocol numbers that aren't archived which is why is doesn't start at 0 or 1).

### General

The client now displays the server's name and status while loading the terrain.

### Added Features

Chat was added to the game. This allows the server to send messages when a player joins and quits and as clarification of why the player is teleported when a block is placed inside them. It also allows for a message to show up whenever you enter a plot containing information about it.

The client now detects if players are inside blocks being placed. This removes the previous function of teleporting players off of your plot when you place a block inside of them and allows players to block player building.

### Packets

The Player Identification serverbound packet added a protocol version and verification key field, although the verification key field is unused.

The Server Identification clientbound packet added a protocol version and server status field.

The Spawn Player clientbound packet pitch field is set to `256 - pitch` when the player ID is set to -1 (255).

The Disconnect clientbound packet was added making disconnecting much simpler and clearer.

### Documentation

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)

## Java Edition Classic 0.0.15a (Multiplayer Test 1)
This is the first version of Minecraft with multiplayer and is the baseline.

Protocol documented on the [Minecraft Wiki](https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Classic_Protocol)