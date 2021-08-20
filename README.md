# <center>FirstBot, In-Person Among Us Discord Bot

#### <center>FirstBot is a Discord bot written in Typescript. The purpose of the bot is to allow people to play in-person Among Us. The bot will automatically assign tasks and roles to players as well as determine win conditions. 

#### <center>This is my first time making a project in Typescript as well as my first time writing a Discord Bot. This code is FAR from perfect. The bot was written so it could be used with my friends and wasn't meant to be spectacual. Instead of rewriting the code, in the future I will probably just move on to new projects.

***
### <center>For information on how to play Among Us you can visit this link [Among Us](https://www.ign.com/wikis/among-us/How_To_Play)
***

### <center>Bot Commands

| Command | Description | Arguments / Properties |
| :-: | :-: | :-: |
| create  | Create an Among Us Game | number of players, short tasks, common tasks,<br>long tasks, moderators, and impostes
| edit    | Edit the game properties | number of players, short tasks, common tasks,<br>long tasks, moderators, and impostes
| join | Join the game| **N/A** |
| leave | Leave the game | **N/A** |
| start | Start the game | Game creator only |
| stop | Terminate the game | Game creator only |
| mod | Become a moderator | **N/A** |
| done | Mark a task as complete | Imposters and players only |
| dead | Mark a player as dead | Imposters and moderators only |
| report | Report a dead body | Impoters and players only |
| meeting | Call an emergency meeting | Imposters and players only |
| help | List all available commands | **N/A** |


##### The prefix prepended onto commands can be changed in the config.json file.