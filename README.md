# **Cosmic Blitz**

## **Planning**

-   Game Concept: Similar/Heavily inspired by [Astro Party](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.winudf.com%2Fv2%2Fimage1%2FY29tLm5vb2RsZWNha2UuYXN0cm9wYXJ0eV9zY3JlZW5fMF8xNTY0NTQwNTg1XzA3Ng%2Fscreen-0.jpg%3Ffakeurl%3D1%26type%3D.jpg&f=1&nofb=1&ipt=7a92a55334b7ed0ec8b0fe76a95a340cf54fab096f8420e7239a54f02128e3b2&ipo=images). Basically a online multiplayer shooter game where you run around in space and try to kill each other, collecting perks along the way!

    -   The online part of this shooter game was neglected as I really did not have the time to work on it, bit more than I can chew as I said [here](#what-ive-learnt)

-   Objectives: Kill everyone else to win!

-   Mechanics:

    -   Movement: Like the actual game, the movement controls are very simplified, just a button to turn. In this case, its a key!
    -   Backspace: Unfortunately, since its not online anymore, I can't actually use backspace. Instead I used a key to represent it, and it moves you BACK through SPACE time! Basically, if you hold down your "backspace key" for x seconds, your player will be reverted to the state he was at min(10, x) seconds ago.
    -   Perks: Laser, Jouster, and Bomb [elaborated in the app]
        _[There was plans to include asteroids, which could be destroyed to drop perks, but I am unable to include it because of time constraints :(]_
    -   Walls: You can't go through them, duh!

-   Visual Design: I'll try to not steal from the actual game, but also want it to look like those from the game jams. I will mainly use PIXI.js for this, since it can render text and is meant as a game engine anyways.
    _[This ended up being very hard, because PIXI.js wasn't the best for a game engine...]_

## **What I've learnt**

Well... I'm really REALLY bad at game dev, as of now. This is like the first actual game dev project I've embarked on, so the quality of work might not be up to standard. A lot of time was devoted to learning how to do things, reading docs and figuring out the best libraries (including game engines) to use. Anyways, here are some things I have learnt:

-   Physics might not work like how u want it to [for example, if you expect the character to bounce off a wall, and you implement it by literally inverting the velocity, it wouldn't bounce naturally :(]

-   For UI, use tools built for UI, not render it using a game engine :(

-   Don't bite off more than you can chew. For this project, I wanted to implement perks, online multiplayer, different skills for each player etc... which was really too much to ask for in the midst of FEs.

-   And other Game Dev skills!

## **Development Log**

-   23/24 May: I spent a lot of time figuring out my tech stack for this project. Initially I wanted to use PIXI with my usual tech stack, but I realised the react version of PIXI was too hard to integrate in. Then I decided to go with plain html/js/css and p5play. After figuring things out for a while, I realised that the documentation for p5play was quite sad, and was very difficult to work with. So after even more fiddling, I finally settled on a typescript + firebase + pixi-ts build. Quite happy with it. Pixi really does have good docs compared to those in p5play!

-   5 Jun: Got multiplayer hooked up, so the app can use it. Progress is slow... working on FEs first LOL. Hopefully can start work next week

-   13 Jun: Well, I bit off way more than I can chew, I don't think I can afford to do multiplayer, unfortunately. Welp. Its ok, imma focus on the actual project. Alright, got a lot of things sorted, kinda know how to go about doing this now. Hopefully progress will come faster. Anyways, I have built a start button and most of the infrastructure to start working on the meat. I'llD come back tomorrow :D

-   14 & 15 Jun: Got the start screen working, got a instruction and backstory script typed out, everything planned, now I just need to implement the game and the end screen.

-   16 Jun: I decided to use matter.js for the game part. Sure, that means I will be using 2 engines for this project, but matter.js is at least able to handle the physics side of things for me. Plus, I get to work with an actual game engine. So today I basically set it up, got it working, and got the first 4 players out there.

-   17 Jun: I decided to add an info screen right between the introduction and the game itself, to basically act as a guide for this game. Plus, all the physics is working, I am able to move around already. Nothing else is up yet though :(

-   18 Jun: Alright I basically dedicated a whole afternoon to finish this project. Ran into a couple issues here and there, but mostly smooth sailing. The one issue I was not able to fix was the player randomly turning left/right even if u aren't controlling it..., its a bit strange but not a big issue since u can use the controls to override it. Other than that, app up and hosted yay!

# **Hope you enjoyed my project though! It was definitely a journey :D**
