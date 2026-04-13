### 🔴 Priority: High

* [ ] **Offline-safe Pro checkout fallback:** Add robust retry/fallback UX when payment init fails due to backend cold start or network jitter.

---

### 🟡 Priority: Medium

* [ ] **Local Vault Page:** Specialized offline-only view.
* [ ] **PWA Shell:** Installable app with asset caching.
* [ ] **IndexedDB Engine:** Local vault for notes/categories.
* [ ] **Note Downloader:** Download as md is already there but need "Save for Offline" functionality for logged-in users.

---

### 🟢 Priority: Low

* [ ] **Changelog hygiene automation:** Auto-sync `latestChanges.md` from conventional commit history.


---

### 📅 Recently Completed (April 13, 2026)
* [x] **Premium Toasts:** Glassmorphic notification system.
* [x] **Canceling membership popup:** Replaced native confirm with reusable alert modal (20% faded backdrop).
* [x] **Button system alignment:** Unified button text alignment in shared button components and sidebar usage.
* [x] **Pro gating UX change:** Category Pro actions now route directly to Upgrade page instead of showing unlock modal.

---

### Things done:
* [x] **code block:** in code block on notes it needs to detect the language and shoe insted of `code` and it should stick to top right no matter if the code is scrolling
* [x] **if not logged in:** if not logged in they can see the notes but it will be visible partially..like it will show a 10 second count down on top after finsinging count down it will show to not authenticated page
* [x] **Route to login:** if someone is not logged in. in locked not authenticated page for note page redirect to login insted home
* [x] **Remove the fading efffect from note page if not logged in...countdown is fine** 
* [x] **Dismissable Announcement** make theannouncement part dismissable with cross
* [x] **Notification:** add a constant notification popup that backend is connecting and once connected it sayasbackend connected with greenand give a option to dismiss , after dismissing it goes away
* [x] **Home page refreshment:** tweak homepage for mobile, no need for community thing.
* [x] **Live Community Feed:** in Live Community Feed make the notes clickable and rename it to Live Notes
* [x] **remove `The Community`** remove user/community part from home
* [x] **Better hero:** in hero remove the emojies or use something more professional maybe an svg or a icon?also for mobile make them smaller
* [x] **not logged in prevention:** if not logged in ..remove "Download .md" from noe page or hide the things need to be hideen from category 
* [x] **matrics:** also in hero show total number of notes so far, total tags,total categoris, total users, all real data, store that in a new schema..,make a new model with Total staus for everything...a route and a controller function..call it inital page ...and show that data in hero...and if the backend is still off..show that number qncyripting like cyper text..moving and changingcyper text  in hero
* [x] **pro info** add pro and free comparing feature in home on the bootom top of "Engineered With"
* [x] **Engineered With** make the Engineered With option smaller in size all of it
* [x] **get pro feature fix:** remove the email concept to get pro instead use razorpay `RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx,RAZORPAY_KEY_SECRET=xxxxxxxxxxxx`
* [x] **Live Note Preview (While Editing)** *(moved to high priority & placed after Mermaid integration)*
* [x] **Cover image implementation** on profile, category, note and slidenavbar
* [x] **Mermaid.js:** Diagram rendering in markdown.
* [x] **Canceling membership:** Are you sure you want to cancel your Pro membership? needs a proper popup..and it will be a separate component that is being used in other places specually for alerts..the style will be extreamly similar as ErrorState.jsx but it will be a popup with 20% faded background
