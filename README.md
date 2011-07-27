# Golden View for Google+

***Golden View for Google+*** is a Chrome extension with 5 (optionally enabled) modules:

  1. **User Mute** - Mutes all posts by specific users.
  2. **Default Circle** – Set a circle as default (instead of Stream).
  3. **Hide Images** – Hide image: original and all shares.
  4. **Hide Comments** – Hide comments (option hide all by default).
  5. **Search With Google** – Search Google+ with Google Search.


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

### Version 1.14

- Star images replaced with transparency versions for better meshing with background. Thanks goes to extension user John (theiconmaster.com) for fixing the images. FIX

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