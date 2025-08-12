# Sprint Reflection Template
## Enter your answers below each question.

## 🎯 Sprint Goal Review
**What was the main learning objective or goal for this assignment?**

To familiarize ourselves with the React frame work and rebuild the functionality of our 
previous assignment using the React paradigm.


**Did you achieve this goal? Why or why not?**

Yes, I believe I did. I not only rebuilt the functionality of the Vanilla JS app but added
to it using the geolocation API. I also improved on the CSS, making the appearence more streamlined
and professional. 


## 📋 What We Delivered
**What specific work did you complete this sprint?**

I built an app that, upon loading, calls the google maps API and serves a map to the user. The app contains event listeners that respond to click events on the map, both recentering the map on the click location and saving the latitude/longitude coordinates. Upon clicking the submit button, those coordinates are then fed to the NWS API and the returned data displayed within an HTML div element. A similar work flow occurs when clicking on the 'use my location' button. On submission, the 'use my location' button makes a call to the geolocation API and, assuming the user has granted appropriate permissions, the returned coordinates are similarly fed to the NWS call. 

I also created fairly robust error handeling for a lot of different edge cases with visually appealing error messages that 'bounce in' to sceen and fun emojis. For instance, not having proper permission for geolocation will trigger an error message with a little cartoon lock. There are similar error messages for inappropriate coordinates or if grid data simply can't be found. 

**What deliverables are you most proud of?**
 I've been following along with a Udemy React class for about the past two months and studying it with Codecademy. Though this is the first real and complete React App I've made that could actually be served as a public site. I'm actually pretty proud of being able to migrate all the functionality from the vanilla version over to the React paradigm as well as add some new functions. 

 I spent a lot (probably too much) time on the CSS. I think it looks a lot nicer and more professional now, the map has a border now and feels more interactive as it recenters with each click. I found myself running into competition problems between different CSS statements with certain parts of my CSS silencing other. I spent a fair amount of time diagnosing and fixing these sorts of problems. 

## 📚 Key Learnings
**What new concepts, skills, or knowledge did you gain?**
Making a functional React app has helped build my confidence with React in general but I think this week has also just generally help
further solidify my understanding of how to use API in my code. 

**What was the most challenging part of this sprint?**
I had trouble at first getting the geolocation function working. Really though I think it was just figuring out exactly where I should start and how much of the original program was salvagable and reusable for this one. In a lot of ways it felt easier to just start over completely, using the vanilla JS functions as a guide for converting them into JSX component functions. 

JSX still feels awkward to me. Ultimately it's a lot more efficient and useful but the traditional paradigm of cleanly separating JS from HTML and using the former to reference the latter through element IDs feels a lot more natural. 

**How did you overcome obstacles or roadblocks?**
 The lectures as well as my Udemy course and my codecadmy lessons we're extremely useful. Just like in previous projects I also used chat GPT to help make sense of errors or the program not functioning the way I thought it should. 
## 🔄 Process Reflection
**What worked well in your approach this week?**
   I was glad we focused on React specifically this week. There's a lot of JS frameworks that could have supported this project but I've been wanting to get more practice with React for a while.  

**What would you do differently next time?**
    

**How effectively did you manage your time?**
- [X] Very well - stayed on schedule
- [ ] Fairly well - minor delays
- [ ] Struggled - fell behind schedule
- [ ] Poorly - significant time management issues

---

## 🤝 Collaboration & Resources
**What resources were most helpful? (textbook, online materials, classmates, office hours, lecture, etc.)**
 Youtube videos, course slides, chat GPT conversations, Udemy, Codecademy

**If you worked with others, how did collaboration go?**


---

## 🎯 Looking Forward
**What questions do you still have about this topic?**


**What would you like to focus on or improve in the next sprint?**
 

**One thing you'll carry forward from this experience:**


---

## 📊 Sprint Rating
**Overall, how would you rate this sprint?**
- [X] Excellent (5/5) - Exceeded expectations
- [ ] Good (4/5) - Met most goals effectively  
- [ ] Satisfactory (3/5) - Met basic requirements
- [ ] Needs Improvement (2/5) - Struggled but learned
- [ ] Poor (1/5) - Significant challenges

**Brief explanation of your rating:**


---

*Submit this reflection along with your assignment deliverables.*