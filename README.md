# Golden View for Google+

***Golden View for Google+*** is a Chrome extension with 5 (optionally enabled) modules:

  1. **User Mute** - Mutes all posts by specific users.
  2. **Default Circle** – Set a circle as default (instead of Stream). [FEATURE SUSPENDED]
  3. **Hide Images** – Hide image: original and all shares.
  4. **Hide Comments** – Hide comments (option hide all by default).
  5. **Search With Google** – Search Google+ with Google Search. [FEATURE SUSPENDED]


Each module is based on a self-contained user script, also authored by Micah Wittman, developed and maintained for cross-platform use (Chrome, Firefox, and Safari). See more information about a module by going to it's code repository as linked to below.


> Discussion on Google+: <https://plus.google.com/111309687695898923996/posts/LeQL1M3MqdP>

> Chrome Web Store Install Page: <https://chrome.google.com/webstore/detail/gijclepbhbekkghfmcdfkpmbkbefcokp>

> (short URL: <http://wittman.org/gv>)

Home page for all the features contained in Golden View for Google+:

> <http://wittman.org/google-plus-extensions/>


Credit and special thanks goes to Matt Mastracci <http://grack.com/+> for his excellent [Replies and more for Google+](https://chrome.google.com/webstore/detail/fgmhgfecnmeljhchgcjlfldjiepcfpea) Chrome extension / [project](http://code.google.com/p/buzz-plus/) which was used as a template to wire-up the original scripts as modules of the Golden View for Google+ extension.

## Modules

---

### User Mute
> SEE <https://github.com/wittman/googleplusplus_user_mute/>  

---

### Default Circle

> SEE <https://github.com/wittman/googleplusplus_default_circle/>  

---

### Hide Comments

> SEE <https://github.com/wittman/googleplusplus_hide_comments/>  

---

### Hide Images

> SEE <https://github.com/wittman/googleplusplus_hide_images/>  

---

### Search with Google

> SEE <https://github.com/wittman/googleplusplus_search_with_google/>  


## Change Log

### Version 1.33

- Google's UI refresh (aka Operation '#whitespace') broke most functionality. Modules: User Mute, Hide Images, and Hide Comments have been restored. Modules Search with Google and Default Circle are not operational and suspended indefinitely. Fixed. FIX

### Version 1.32

- Search with Google - Google+ search input ID changed which made the TOGGLE SEARCH TYPE link disappear. Fixed. FIX

### Version 1.31

- Default Circle redirect was not triggering. Fixed, and clicking Stream itself (just like UNSET star) now unsets the current default circle.  FIX

### Version 1.30

- Default Circle star alignments fixed. Was uneven and disappearing off left margin. Updated bundled CSS map.  FIX

### Version 1.29

- Bandwidth efficiency enhancement: The auto-remapping (self-healing) system now checks a remote file that contains only date string timestamp and based on that requests the full CSS map resource if needed. NEW
- Added the following crowd-sourced language translations <http://go.wittman.org/g592> (for User Mute UI): nb-NO [Norsk bokmål (Norway)], and de-D [Deutsch (Deutschland)]. NEW

### Version 1.28

- Fixed Hide Images module. FIX
- Tweaked Hide Comments back to blue link. FIX
- Updated local mapping resource file to current version. UPDATE

### Version 1.26

- Chrome having XMLHttpRequest/origin problems with an SSL connection for mapping resource. Switched to HTTP request.

### Version 1.25

- Robustness update so Golden View can weather Google+ upgrades, which sometimes interrupt normal extension functioning, better. NEW
- New URL access permission needed (goldenview.wittman.org/*) so Google+ classname mappings can be updated automatically to keep extension working within minutes of a Google+ breaking change. What does this mean? It means if the extension stops working when Google updates the sight design, Golden View can be restored to working condition automatically in an hour or less in most cases (a big improvement from the previous delay of hours or days). NEW


### Version 1.24

- Yes, another set of changes rolled-out by Google. All modules needed updating and are now fixed. FIX

### Version 1.23

- Hide Comments - Fixed display of OLD COMMENTS, comment editor active detection, and scroll-to-plus-1 upon hide comments click. FIX
- Hide Images - Fixed position of SHOW/HIDE button so it floats below the image instead of next to it as it did in some cases. FIX

### Version 1.22

- A new set of changes rolled-out by Google. All modules needed updating and are now fixed. FIX

### Version 1.21

- Hide Comments - fixed problem where in some circumstance comment hiding wasn't functioning correctly. FIX

### Version 1.20

- Yet another set of DOM tree changes made by Google in the last 12 hours which require adjustments. All modules needed updating and are now fixed. FIX

### Version 1.19

- User Mute - 3rd-party [G+Me](https://chrome.google.com/webstore/detail/oacdcllhgpddmlnhajiacfakhlilbicp) extension compatibility update. MUTE USER appearance is now restored in Stream and Circles. FIX
- User Mute - G+Me presence detected and accommodated so a MUTE USER link get removed per post when in G+Me collapsed mode. UPDATE

### Version 1.18

- User Mute - Missing MUTE USER link in the Stream view (mixed reports have come in). I haven't been able to replicate the issue (on latest stable Chromes on OS X and WinXP) but may be subtle difference in effective Javascript interpreter runtime behaviour. A key jQuery selector was changed to a simpler approach which may eliminate the bug. FIX

### Version 1.17

- Default Circle - stars were appearing in stream view but not circle views. FIX
- Hide Images - minor visual adjustment of camera icon background on hover. FIX

### Version 1.16

- Changes made today by Google introduced breaking DOM tree changes. All modules needed updating and are now fixed. FIX

### Version 1.15

- Recent change by Google required an adjustment to detect the user's name and the post ID. User Mute now fully functional again. FIX

### Version 1.13

- Circle Default module - all star characters now converted to images. FIX
- Circle Default module - removed underline style seen while a star was hovered. UPDATE

### Version 1.12

- Hide Comments module - fixed comment editor being hidden unexpectedly in Hide by Default mode. FIX
- Circle Default module - improved compatibility by converting unicode star characters to images. UPDATE
- Circle Default module - added small amount of left padding to stars for small browser window width cases. UPDATE

### Version 1.11

- Fixed Hide Comments module - wasn't, functionally, language-independent. Also wasn't hiding emergent comments and not working in Incoming view. FIX
- Hide Comments hide emergent comments now and updates the Recent and Old comment counts in real-time. NEW


### Version 1.1

- Default Circle module now allows navigation to The Stream by clicking Stream without setting it as default. NEW
- Hide Images module now has option to hide images by default. NEW

### Version 1.0

- Initial Release