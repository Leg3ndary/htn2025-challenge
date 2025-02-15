# Final Write Up

### 1. Walk us through your development process as you worked on this project. How did you plan out the structure and design of it? How did decide on the tools you've used? Did you encounter any problems? And if so, how did you solve them? Are there any areas of your code that you're particularly proud of or want to point out?

To start, I decided to just use Next.js, I use this for work, for personal projects, for hackathons, for literally everything I do. It has it's on built in API system (so I don't have to setup anything with express or flask for example), is similar to React, and is very standard in that most web developers will know what I'm doing. I also remember looking at Hack the North's codebase before and seeing that they used React so I figured this would be a good choice. I am currently learning Svelte but I'm nowhere near good enough to do the same while using React.

Another thing was I wasn't sure if I would actually need to implement anything for the backend super quickly but turns out I was fine so technically I could've probably gotten away with just React.

I also decided to use Tailwind, I've been using this pretty extensively now and I just really love the fact I can quickly type out the classnames and instantly get the applied CSS. It does get in the way when classesnames are super long but I thought for this quick project it wouldn't be an issue.

In terms of problems everything went pretty smoothly up until the end as I couldn't figure out one final issue with toast. I took around 20 minutes to try and figure it out but I just couldn't so I decided to just leave it as is. It's not a huge issue, just when a signed in user shares a private event to an anonymous user it doesn't tell them what happens and just doesn't open the event. I tried to have a toast notification pop up instead but for the life of me I couldn't get it to work. I think given another hour I could probably figure it out but I'm tired and I think it's not a huge deal.

Another smaller issue I went through was getting localStorage to properly store the filters. I forgot that I couldn't just shove everything in without stringifying it first and I was a bit confused at first but after 5 minutes of quickly looking it up, I eventually figured it out.

Finally there isn't too much I would want to point out, I think the beauty of my design comes in its simplicity, it shows you everything you need and doesn't complicate it. During my Co-op at SAP, I worked with some graphic designers and UI/UX engineers and their number 1 takeaway was to keep it simple. If a child can't figure it out, it's too complex. Obviously in some cases this isn't true, but for the most part, I tried to have all the features needed while still keeping it simple and elegant.

Just to list the features I added:
- Full animations for the cards and modals
- Toast notifications for shared links
- A filter system that saves to localStorage so that it persists
- Shareable event links
- Labels and links that coloured based on properties such as permissions and event type
- A simple authentication system that persists through refreshes and also hides private events
- A simple search bar and simpler clickable sorting options with ascending and descending toggles
- Clickable cards that open up modals and update the URL with query params
- Accessibility shortcuts with the escape button
- Related events clickability and viewability.

### 2. Given additional time, how would you extend your application to become a fully functional product that thousands of hackers and the general public would use at Hackathon Global Inc.™'s next event? Would you add more features and performance metrics? If so, what would they be?
I think one really cool thing that would be fun to do is add live data or reactions for events. Similar to discord or slack channels, users could vote or react to posts/events which would make it seem a lot less static. I was thinking for example if there was a game event, you could vote for what game you would want to play, or if there was a speaker, give them a thumbs up or a star emoji. It would make the site feel a lot more alive and reactive, of course this would be a bit more of a backend task, but I think it would still be a cool feature for the frontend team to implement as well.

I think another cool feature would be just simply adding more filters, I think I did a good job covering most of everything, but perhaps someone would want a more advanced systems. On that note I think also an admin dashboard would be fun to do. Especially since as of now it seems like you just have to manually add everything to the database? I'm not entirely sure but that would also be really fun to implement.

Finally I could do some simple optimization which I didn't do, I was thinking of also storing events in localStorage and then just setting them to expire in like 5-30 minutes, if it isn't in cache or needs to be re-requested, then it would automatically do that, alternatively, if the user is signed in, I could just have a button that says "refresh" and it would just re-fetch all the events. I think this would be a good way to keep the site fast and responsive.

### 3. Any other thoughts you have (not limited to the previous questions).
Not really, I think I did cover everything, I think performance metrics would be cool, but unlike the other things I mentioned, I do feel it would be more of a backend task, whereas we would just display the data (which is still fun don't get me wrong), but I think that it would be more fun to implement some of the other tasks.

In any case, I had a lot of fun working on this projects and building the UI, hope you'll consider me!
