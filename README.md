# Hack the North 2025 FrontEnd Challenge

This is my submission for the 2025 Hack the North FrontEnd Challenge.

## Installation

As with any standard Next.js project, you can simply clone the repo, install packages, and run the project like so:

```bash
git clone https://github.com/Leg3ndary/htn2025-challenge
cd htn2025-challenge
npm install
npm run dev
```

## Thought Process

I know later I do have to do a writeup so here I'll track some thoughts as I go along the project should I need to refer back to it later.

1. I want to go for a dark mode ish site, I know for 2024 at least it was a brighter theme so I want to go for something different.
- I want to start with static cards and just overall design while not worrying about filling it with data. That can come later.
- I want to use a grid layout for the cards, I don't think I need to implement an actual calendar thing since nothing in the requirements actually says that so I'll start with something easier and move on if I have the time.
- I'm going to use axios and framer-motion so I'll start installing those as well.
- Actually, I think it might be better to first pull in all events and display them instead of using static data, I'll have to do it later anyways.
2. I now have all the basic data and some pretty ugly cards, let's make it look better.
- Let's add some icons using lucide react
- Also add dates, title, description, etc
- Add some light colours for each event
- Add little tags indicating what type of event it is
- Add both kinds of links for now, we can deal with hiding it later
- Also add the workshop leaders
3. Now that I have presentable cards lets add a little more functionality, I honestly think this is the bulk of the project, so I'll spend a bit more time on this, and then look to add some of the other features recommended.
- Clicking on cards, I think the cards look really cool and honestly would expect clicking on them to do something, so lets add that using a modal, this also allows us to make use of the related events
- For the related events I'll just have it open the other card
- I could've probably also made like a pill label component but I that could be for later
- I mimicked the card layout and just removed line clamps, since that's all they really need.
4. Blah blah blah

## Requirements

The functionality of the app is split into multiple portions:

1. DONE Display the information for all events provided when visiting the app
2. Sort these events in order by start_time
3. Hide the ability to view `private` events behind a login screen. Specifically, users who haven't logged in can only view `public` events, while logged in users can view both `public` and `private` events
    - Login details can be hard-coded, please use the following credentials if you are hard-coding the login:
        - Username: `hacker`
        - Password: `htn2025`
4. Provide a way to link to and view each related event

> If you feel you are strapped for time, it's okay to choose not to implement the latter portions of the challenge. We would rather see a partially implemented but well-crafted submission. However, do note that a complete submission should have all the functionality listed above.
> 

If you have completed your implementation of the above points, you may want to consider adding additional functionality.

**Some possibilities, for your inspiration:**

- Allowing the user to search for a specific event
- Add the ability to filter based on the event type
- Add the ability to re-order events and persist the order of events across refreshes