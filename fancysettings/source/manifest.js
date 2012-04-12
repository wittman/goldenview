this.manifest = {
  "name": "Golden View for Google+",
  "icon": "icon.png",
  "settings": [
	{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_features"),
	  "name": "user_mute",
	  "type": "checkbox",
	  "label": chrome.i18n.getMessage("options_user_mute")
	},
	
	/*{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_features"),
	  "name": "default_circle",
	  "type": "checkbox",
	  "label": chrome.i18n.getMessage("options_default_circle")
	},*/
	{
		"tab": chrome.i18n.getMessage("options"),
		"group": chrome.i18n.getMessage("options_features"),
		"name": "hide_comments",
		"type": "radioButtons",
		"label": "Hide Comments",
		"options": [
			[chrome.i18n.getMessage("options_hide_comments_default_show")],
			[chrome.i18n.getMessage("options_hide_comments_default_hide")],
			[chrome.i18n.getMessage("options_hide_comments_disable")]
		]
	},
	{
		"tab": chrome.i18n.getMessage("options"),
		"group": chrome.i18n.getMessage("options_features"),
		"name": "hide_images",
		"type": "radioButtons",
		"label": "Hide Images",
		"options": [
			[chrome.i18n.getMessage("options_hide_images_default_show")],
			[chrome.i18n.getMessage("options_hide_images_default_hide")],
			[chrome.i18n.getMessage("options_hide_images_disable")]
		]
	},
	/*{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_features"),
	  "name": "search_with_google",
	  "type": "checkbox",
	  "label": chrome.i18n.getMessage("options_search_with_google")
	},*/
	{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_resource_update"),
	  "name": "force_selector_map_update",
	  "type": "button",
	  "label": chrome.i18n.getMessage("options_force_selector_map_update"),
	  "text": chrome.i18n.getMessage("options_force_selector_map_update_button")
	},
	{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_bugs"),
	  "name": "report_bug",
	  "type": "button",
	  "label": chrome.i18n.getMessage("options_report_bug"),
	  "text": chrome.i18n.getMessage("options_report_bug_button")
	},
	{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_bugs"),
	  "name": "extension_page",
	  "type": "button",
	  "label": chrome.i18n.getMessage("options_extension_page"),
	  "text": chrome.i18n.getMessage("options_extension_page_button")
	},
	{
	  "tab": chrome.i18n.getMessage("options"),
	  "group": chrome.i18n.getMessage("options_author"),
	  "name": "developer_page",
	  "type": "button",
	  "label": chrome.i18n.getMessage("options_developer_page"),
	  "text": chrome.i18n.getMessage("options_developer_page_button")
	}
  ],
  "alignment": [
	["report_bug", "extension_page", "developer_page"]
  ]
};
