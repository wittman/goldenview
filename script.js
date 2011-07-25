var settings;

var isJsPage = !!window.location.href.match(/_\/apps-static\//);

function hideComments(hide_by_default){ // v0.2.1
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}
	function scrollTo(t){
		$('html,body').animate({
			scrollTop: t.offset().top},
			'slow');
	}
	function editor_present(update){
		return update.find('.a-f-i-Xb .tk3N6e-e-vj[role]').length > 0;
	}
	function remove_red_color_of_number(comment_count_display){
		if(comment_count_display.length > 0){
			comment_count_display.find('.gpp__hide_comments_recent_number').css({color:'#999',fontWeight:'normal'});
		}
	}


	function main_loop(){
		var i = 0;
		
		$("[id^='update']").find(".a-f-i-Xb").each(function(){
			var t = $(this);
			var update = t.parentsUntil("[id^='update']");
			var plust1_and_comments_link = t.parent().find(".a-f-i-bg"); //a-f-i-bg
			var comments = t;

			var old_comment_count_span = comments.find("div.a-f-i-WXPuNd span[role]");

			if( old_comment_count_span.hasClass('gpp__comments_hidden_old_shown') ){
				old_comment_count_span.addClass('gpp__comments_hidden_old_shown');
				remove_red_color_of_number(comment_count_display);
			}
			var old_comment_count = 0;
			var old_comment_count_display = '';
			if(old_comment_count_span.length > 0){
				old_comment_count = old_comment_count_span.text().match(/\d+/);
				old_comment_count_display = '&nbsp;&nbsp;(OLD: <span class="gpp__hide_comments_old_number">' + old_comment_count + '</span>)';
			}

			var recent_comments = update.find('.a-b-f-i-Xb-oa .a-b-f-i-W-r');
			var recent_comment_count = 0;
			if(recent_comments.length > 0){
				recent_comment_count = recent_comments.length;
			}

			var show_hide;
			if( recent_comment_count > 0 ){
				var post = comments.parent().parent();
				var postID = post.attr('id');
				var hiddenPostID = GM_getValue('gpp__hidden_post_id_' + postID, '');
				var hidden_by_default = false;
				if( visibility_default == 'hidden' && !comments.hasClass('gpp__comments_hidden_by_default') ){
					hidden_by_default = true;
				}
				
				
				if( !comments.hasClass('gpp__comments') ){
					comments.addClass('gpp__comments_' + i).addClass('gpp__comments');
					button_html = '<br><span role="button" class="d-h a-b-f-i-gc-cf-Xb-h gpp__comment_show_hide gpp__comment_show_hide_' + i + '" tabindex="0">Hide Comments</span> <span style="font-size:10pt;color:#999" class="gpp__comment_count_container"></span><br><br>';
					comments.after(button_html);

					//console.log('editor_present:'+editor_present);
					var show_hide = comments.parent().find('.gpp__comment_show_hide_' + i);
					show_hide.click(function(e){
						var t = $(this);
						comments.addClass('gpp__comments_hidden_by_default');
						if( t.text().indexOf('Hide Comments') > -1 ){
							if(editor_present(update)){
								//console.log('editor_present:'+editor_present);
								if( t.parent().find('.gpp__hide_comments_close_editor_tip').length == 0 ){
									//console.log('need tip');
									t.parent().find('.gpp__comment_count_container').append(' <span style="color:darkorange;font-size:9pt" class="gpp__hide_comments_close_editor_tip"><br>Comment Editor must be closed before hiding comments.</span>');
								}
							}else{
								t.parent().find('.gpp__hide_comments_close_editor_tip').remove();
							}
							
							comments.removeClass('gpp__comments_shown');
							comments.hide();
							GM_setValue('gpp__hidden_post_id_' + postID, postID);
							t.text('Show Comments');
							scrollTo(plust1_and_comments_link);
						}else{
							//console.log('click_show');
							comments.addClass('gpp__comments_shown');
							comments.show();
							GM_removeItem('gpp__hidden_post_id_' + postID);
							t.text('Hide Comments');
							remove_red_color_of_number(comment_count_display);
							if(editor_present(update)){
								comments.hide();
								comments.removeClass('gpp__comments_shown');
							}
							scrollTo(plust1_and_comments_link);
						}
						e.preventDefault();
					});
				}else{
					show_hide = t.parent().find('.gpp__comment_show_hide');
				}
				if(hiddenPostID != '' || hidden_by_default){
					if( !editor_present(update) && !comments.hasClass('gpp__comments_shown') ){ //don't hide if comment editor in DOM
						comments.hide();
						show_hide.text('Show Comments');						
					}
				}
				
				var comment_count_display = show_hide.parent().find('.gpp__comment_count_container');
				if(editor_present(update)){
					show_hide.text('Hide Comments'); //also set link to Hide Comments if editor present
					comments.show();
					comments.addClass('gpp__comments_shown');
					remove_red_color_of_number(comment_count_display);
				}
				if(recent_comment_count > 0 || old_comment_count > 0){
					
					var display_recent = comment_count_display.find('.gpp__hide_comments_recent_number');
					var display_recent_number = 0;
					var display_old = comment_count_display.find('.gpp__hide_comments_old_number');
					var display_old_number = 0;
					if(display_recent.length > 0 && display_recent.text().length > 0){
						display_recent_number = display_recent.text();
					}
					if(display_old.length > 0 && display_old.text().length > 0){
						display_old_number = display_old.text();
					}

					var recent_number_html = '<span class="gpp__hide_comments_recent_number">' + recent_comment_count + '</span>';
					if(loop_count > 0 && show_hide.text().indexOf('Show Comments') > -1 ){
						try{
							if(parseInt(recent_comment_count, 10) != parseInt(display_recent_number,10)){
								recent_number_html = '<span class="gpp__hide_comments_recent_number" style="color:red;font-weight:bold">' + recent_comment_count + '</span>';
							}
						}catch(e){}
					}
					var comment_count_html = '<span style="font-size:8pt;color:#999">(RECENT: ' + recent_number_html + ')' + old_comment_count_display + '</span> ';
					
					if( (recent_comment_count != display_recent_number) || (old_comment_count != display_old_number) ){
						comment_count_display.empty().append(comment_count_html);
					}
				}
				i++;
			}
		});
		loop_count++;
		url_current = window.location.href;
		if( url_current != url_prev){
			$('.gpp__hide_comments_recent_number').css({color:'#999',fontWeight:'normal'});
			loop_count = 0; //reset to clear rea numbers
		}
		url_prev = url_current;
	}
	
	/****** Before Loop Variables ******/
	/*** Options ***/
	//Set to 'hidden' to hide all comments by default, or 'shown' to show by default.
	var visibility_default = 'shown'; /*___hidden*/
	var loop_count = 0;
	var url_current = window.location.href;
	var url_prev = url_current;
	
	if(hide_by_default)
		visibility_default = 'hidden';
	
	/****** Start main_loop ******/
	setInterval(main_loop, 2000);
}

function defaultCircle(){ // v0.1.7
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}
	function empty_star_inserts(that){
		var t = $(that);
		var circle_link = t;
		if(t.parent().find('.gpp__default_circle').length == 0){
			t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">' + STAR_OUTLINE + '</a>');
			var set_button = t.parent().find('.gpp__default_circle:first');
			set_button.click(function(){
				var t = $(this);
				circle_link_url = circle_link.attr('href');
				GM_setValue('gpp__default_circle_url', circle_link.attr('href'));
				allow_stream = false;
				window.location.href = circle_link_url;
				return false;
			})
			.hover(
				function(){
					$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-70px'});
				},
				function(){
					$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-32px'});
				}
			);
		}
	}
	function process_circles(t, default_circle_url, circle_link){
		//Process Circles
		if( default_circle_url == circle_link.attr('href') && t.find('.gpp__default_circle').length == 0 ){
			t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">★</a>');
			var set_button = t.parent().find('.gpp__default_circle:first');
			set_button.click(function(){
				var t = $(this);
				circle_link_url = circle_link.attr('href');
				GM_removeItem('gpp__default_circle_url');
				window.location.href = './';
				return false;
			})
			.hover(
				function(){
					$(this).empty().append('UN-SET ' + STAR_HOVER_OUTLINE).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-97px'});
				},
				function(){
					$(this).empty().append(STAR_SOLID).css({'fontSize':'9px','color':'#36C','marginLeft':'-32px'});
				}
			);
		}else{
			empty_star_inserts(t);
		}
	}
	function main_loop(){
		var circle_links_container = $("#content .a-b-la-A :first");
		var circle_links = $("#content .a-b-la-A a[href*='stream/']");
		var default_circle_url = GM_getValue('gpp__default_circle_url', '');
		
		circle_links_container.css('margin-left','8px');
				
		//OFF <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH ">Stream</a>
		//ON  <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH  a-la-h-Pa">Stream</a>
		
		//Always add star to Stream 
		var stream =  $("#content .a-b-la-A a[href='/stream']:first");
		if(default_circle_url == '/stream'){
			if(stream.parent().find('.gpp__default_circle').length == 0){
				stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">' + STAR_SOLID + '</a>');
				var set_button = stream.parent().find('.gpp__default_circle:first');
				set_button.click(function(){
					GM_removeItem('gpp__default_circle_url');
					window.location.href = '/stream';
					return false;
				})
				.hover(
					function(){
						$(this).empty().append('UN-SET ' + STAR_HOVER_OUTLINE).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-66px','paddingTop':'3px'});
					},
					function(){
						$(this).empty().append(STAR_SOLID).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
					}
				);
			}
		}else{
			if(stream.parent().find('.gpp__default_circle').length == 0){
				stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">' + STAR_OUTLINE + '</a>');
				var set_button = stream.parent().find('.gpp__default_circle:first');
				set_button.click(function(){
					GM_setValue('gpp__default_circle_url', '/stream');
					window.location.href = '/stream';
					return false;
				})
				.hover(
					function(){
						//$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-40px','paddingTop':'2px'});
						$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-38px','paddingTop':'3px'});
					},
					function(){
						$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
					}
				);
				stream.click(function(){
					allow_stream = true;
				});
				
			}
		}
		
		var stream_active =  $("#content .a-b-la-A a[href='/stream'].a-la-h-Pa:first");
		
		if( stream_active.length > 0 ){ 
			//Stream is current view
			if( circle_links.find('.gpp__default_circle').length == 0 ){
				circle_links.each(function(){
					var t = $(this);
					var circle_link = t;
					if(allow_stream){
						process_circles(t, default_circle_url, circle_link);
					}else{
						empty_star_inserts(this);
					}
				});
				if( default_circle_url != '' && default_circle_url != '/stream'){
					if( !allow_stream ){
						window.location.href = default_circle_url;
					}else{
						allow_stream = false;
					}
				}
			}
		}else{
			//Circle is current view
			if(default_circle_url != ''){
				circle_links.each(function(){
					var t = $(this);
					var circle_link = t;
					//Process Stream
					if(stream.parent().find('.gpp__default_circle').length == 0){
						stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">☆</a>');
						var set_button = stream.parent().find('.gpp__default_circle:first');
						set_button.click(function(){
							GM_setValue('gpp__default_circle_url', '/stream');
							window.location.href = '/stream';
							return false;
						})
						.hover(
							function(){
								//$(this).empty().append('SET ★').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
								$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
							},
							function(){
								//$(this).empty().append('☆').css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
								$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
							}
						);
					}
					//Process Circles
					process_circles(t, default_circle_url, circle_link);
				});
			}
		}
		
	}
	var allow_stream = false;
	var STAR_SOLID = '<img alt="current default" src="' + chrome.extension.getURL('star-solid.png') + '">';
	var STAR_OUTLINE = '<img alt="non-default" src="' + chrome.extension.getURL('star-outline.png') + '">';
	var STAR_HOVER_SOLID = '<img alt="set default" src="' + chrome.extension.getURL('star-hover-solid.png') + '">';
	var STAR_HOVER_OUTLINE = '<img alt="unset default" src="' + chrome.extension.getURL('star-hover-outline.png') + '">';
	
	/****** Start main_loop ******/
	setInterval(main_loop, 3000);
}

function userMute(){ // v0.1.3
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}

	function normalize_language(code){
		var r;
		var c = code;

		c = c.replace(/_/, '-').toLowerCase();
		if(c.length > 3){
			c = c.substring(0, 3) + c.substring(3).toUpperCase();
		}

		if(c=='xx-XX'){ r = c }
		else if(c=='sv-SE'){ r = c } //Swedish (Sweden)
		else if(c=='sv'){ r = 'sv-SE' } //Swedish (Sweden)
		else{
			//Default to English US
			r = 'en-US';
		}

		return r;
	}
	function language_dictionary(){
		var lang = {
			'unmute' : {
				'en-US' : 'UNMUTE',
				'sv-SE' : 'VISA MEDDELANDEN',
				'xx-XX' : '_____'
			},
			'muted_share' : {
				'en-US' : 'MUTED SHARE',
				'sv-SE' : 'DOLT DELAT MEDDELANDE',
				'xx-XX' : '_____'
			},
			'see_original' : {
				'en-US' : 'SEE ORIGINAL POSTER TO UNMUTE',
				'sv-SE' : 'VISA ORIGINALSKRIBENTEN FÖR DET DOLDA MEDDELANDET',
				'xx-XX' : '_____'
			},
			'mute_user' : {
				'en-US' : 'MUTE USER',
				'sv-SE' : 'DÖLJ ANVÄNDAREN',
				'xx-XX' : '_____'
			}
		}
		return lang;
	}
	function t(key){
		return LANGUAGE[key][NORMALIZED_LANGUAGE_CODE];
	}
	function insert_unmute_button(th, id, share_id, name){
		var unmute_html = '<div>' + name + ' <a style="font-size:10px" class="gpp_user_mute_unmute">' + t('unmute') + '</a></div>';
		if( id_match(id, share_id) == 'share' ){
			unmute_html = '<div>' + name + ' &nbsp;(<span style="font-size:10px" class="gpp_user_mute_unmute">' + t('muted_share') + ' &ndash; <a style="font-size:10px" href="https://plus.google.com/' + share_id + '">' + t('see_original') + '</a>' + '</span>)</div>'
		}
		th.after(unmute_html);
		th.parent().find('.gpp_user_mute_unmute:first').click(function(){
			if( !th.is(':visible') ){
				th.fadeIn();
			}
			$(this).parent().hide();
			GM_removeItem('gpp__user_mute_id_' + id);
		});
	}
	function id_match(id, share_id){
		if( id != '' && GM_getValue('gpp__user_mute_id_' + id, '') != '' ){
			return 'post';
		}else if( share_id != '' && GM_getValue('gpp__user_mute_id_' + share_id, '') != '' ){
			return 'share';
		}
		return false;
	}
	function main_loop(){

		var posts = $('#content .a-f-i-p').each(function(){ 
			var th = $(this);
			var user_link = th.find('.a-f-i-do');
			var share_link = th.find('.a-f-i-u-go a');
			var name = user_link.attr('title');
			var share_id = typeof share_link.attr('oid') != 'undefined' ? share_link.attr('oid') : '';
			var id = typeof user_link.attr('oid') != 'undefined' ? user_link.attr('oid') : '';

			//GM_removeItem('gpp__user_mute_id_' + id); return;

			//Set click handlers
			if( th.find('.gpp_user_mute_mute:first').length == 0 ){
				th.find('.a-b-f-i-aGdrWb:first').after(' &nbsp;<a style="font-size:10px" class="gpp_user_mute_mute">' + t('mute_user') + '</a>');
				th.parent().find('.gpp_user_mute_mute:first').click(function(){
					//Mute
					th.fadeOut();
					GM_setValue('gpp__user_mute_id_' + id, '1');
					//Muted, so insert unmute button
					if( th.parent().find('.gpp_user_mute_unmute:first').length == 0 ){
						insert_unmute_button(th, id, share_id, name);
					}
					th.parent().find('.gpp_user_mute_unmute').parent().show();
				});
			}

			//Check storage to find out if state == muted
			if( id_match(id, share_id) ){
				if( th.is(':visible') ){
					th.hide();
				}
				if( !th.is(':visible') ){
					th.parent().find('.gpp_user_mute_unmute:first').parent().show();
				}
				if( th.parent().find('.gpp_user_mute_unmute:first').length == 0 ){
					insert_unmute_button(th, id, share_id, name);
				}
			}else{
				if( !th.is(':visible') ){
					th.show();
					th.parent().find('.gpp_user_mute_unmute:first').parent().hide();
				}
			}
		});
	}

	/****** Before main_loop ******/
	/*** Constants ***/
	var NORMALIZED_LANGUAGE_CODE = normalize_language(navigator.language);
	var LANGUAGE = language_dictionary();

	/****** Start main_loop ******/
	setInterval(main_loop, 2000);
}

function searchWithGoogle(){ // v0.1.1
	var search_box_new_html = '<form style="display:none" id="ggp__search_with_google" method="get" action="http://www.google.com/search?" target="_blank"><input type="hidden" name="hl" value="en-GB"><input type="hidden" name="q" value="site:plus.google.com -buzz -&quot;google reader&quot;"><input class="a-b-fi-O a-fi-O a-G-O wa-O-wa" id="gpp__search-box" autocomplete="off" type="text" maxlength="2048" name="q" value="Search with Google" placeholder="Search with Google"></form> <a style="float:right;font-weight:bold;font-size:9px" id="gpp__search_with_google_swap">TOGGLE SEARCH TYPE</a>';

	var sbox = $('#search-box').after(search_box_new_html);
	var sbox_new = $('#ggp__search_with_google');

	$('#gpp__search-box').focus(function(){
		var t = $(this);
		if( t.val() == 'Search with Google' ){
			t.val('');
		}
	});

	$('#gpp__search_with_google_swap').click(function(){
		sbox.toggle();
		sbox_new.toggle();
	});
}

function hideImages(hide_images_by_default){ // v0.1.2
	
	/****** Utility functions ******/
	function log(txt) {
		if(logging) {
			 console.log(txt);
		}
	}

	/*
	* Add integers, wrapping at 2^32. This uses 16-bit operations internally
	* to work around bugs in some JS interpreters.
	*/
	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF),
		msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	* Bitwise rotate a 32-bit number to the left.
	*/
	function bit_rol(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}

	/*
	* These functions implement the four basic operations the algorithm uses.
	*/
	function md5_cmn(q, a, b, x, s, t) {
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	* Calculate the MD5 of an array of little-endian words, and a bit length.
	*/
	function binl_md5(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var i, olda, oldb, oldc, oldd,
		a =  1732584193,
		b = -271733879,
		c = -1732584194,
		d =  271733878;

		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;

			a = md5_ff(a, b, c, d, x[i],       7, -680876936);
			d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
			b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
			d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
			c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
			d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
			d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

			a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
			d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
			c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
			b = md5_gg(b, c, d, a, x[i],      20, -373897302);
			a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
			d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
			c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
			d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
			c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
			a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
			d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
			c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
			b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
			d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
			b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
			d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
			c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
			d = md5_hh(d, a, b, c, x[i],      11, -358537222);
			c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
			a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
			d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
			b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

			a = md5_ii(a, b, c, d, x[i],       6, -198630844);
			d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
			c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
			d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
			d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
			a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
			d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
			b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}

	/*
	* Convert an array of little-endian words to a string
	*/
	function binl2rstr(input) {
		var i,
		output = '';
		for (i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		}
		return output;
	}

	/*
	* Convert a raw string to an array of little-endian words
	* Characters >255 have their high-byte silently ignored.
	*/
	function rstr2binl(input) {
		var i,
		output = [];
		output[(input.length >> 2) - 1] = undefined;
		for (i = 0; i < output.length; i += 1) {
			output[i] = 0;
		}
		for (i = 0; i < input.length * 8; i += 8) {
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		}
		return output;
	}

	/*
	* Calculate the MD5 of a raw string
	*/
	function rstr_md5(s) {
		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	}

	/*
	* Calculate the HMAC-MD5, of a key and some data (raw strings)
	*/
	function rstr_hmac_md5(key, data) {
		var i,
		bkey = rstr2binl(key),
		ipad = [],
		opad = [],
		hash;
		ipad[15] = opad[15] = undefined;                        
		if (bkey.length > 16) {
			bkey = binl_md5(bkey, key.length * 8);
		}
		for (i = 0; i < 16; i += 1) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	}

	/*
	* Convert a raw string to a hex string
	*/
	function rstr2hex(input) {
		var hex_tab = '0123456789abcdef',
		output = '',
		x,
		i;
		for (i = 0; i < input.length; i += 1) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) +
			hex_tab.charAt(x & 0x0F);
		}
		return output;
	}

	/*
	* Encode a string as utf-8
	*/
	function str2rstr_utf8(input) {
		return unescape(encodeURIComponent(input));
	}

	/*
	* Take string arguments and return either raw or hex encoded strings
	*/
	function raw_md5(s) {
		return rstr_md5(str2rstr_utf8(s));
	}
	function hex_md5(s) {
		return rstr2hex(raw_md5(s));
	}
	function raw_hmac_md5(k, d) {
		return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	}
	function hex_hmac_md5(k, d) {
		return rstr2hex(raw_hmac_md5(k, d));
	}
	/*
	* jQuery MD5 Plugin 1.2.1
	* https://github.com/blueimp/jQuery-MD5
	*
	* Copyright 2010, Sebastian Tschan
	* https://blueimp.net
	*
	* Licensed under the MIT license:
	* http://creativecommons.org/licenses/MIT/
	* 
	* Based on
	* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	* Digest Algorithm, as defined in RFC 1321.
	* Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	* Distributed under the BSD License
	* See http://pajhome.org.uk/crypt/md5 for more info.
	*/
	function md5(string, key, raw) {
		if (!key) {
			if (!raw) {
				return hex_md5(string);
			} else {
				return raw_md5(string);
			}
		}
		if (!raw) {
			return hex_hmac_md5(key, string);
		} else {
			return raw_hmac_md5(key, string);
		}
	}
	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}

	/****** Helper functions ******/
	function isThumbnail(img){
		return (img.height() == 46);
	}

	/****** Constants ******/
	var logging = false;

	/****** Before Loop Variables ******/
	var i = 0;
	var img_divs = $('#contentPane .a-b-f-S-oa div[data-content-url]');
	
	/****** Loop ******/
	function main_loop(){
		
		img_divs = $('#contentPane .a-b-f-S-oa div[data-content-url]');
		img_count = img_divs.length;
			
		img_divs.each(function(){
			var t = $(this);
			var img_url = t.attr('data-content-url');
			var url_hash;
			if( !t.hasClass('gpp__hide_images_tagged') && !isThumbnail(t) ){
				//Process new images
				url_hash = md5(img_url);
				t.addClass('gpp__hide_images_tagged');
				t.after('<div id="gpp__hide_images_button_' + i + '" style="height: 8px;width: 91%;" class="gpp__hide_images a-f-i-WXPuNd a-b-f-i-W-xb"><span role="button" class="d-h a-b-f-i-gc-cf-Xb-h" tabindex="0"><span style="margin-top:-5px" class="n-Wa-q n-Wa-q-z" title="Hidden image"></span><span style="font-size:9px;margin:0 0 0 4px;position:absolute"><a>SHOW / HIDE</a></span></span></div>');
				var img = t;
				var button = img.parent().find('#gpp__hide_images_button_' + i + ':first');
				button.click(function(){
					if( img.is(':visible') ){
						//Hide
						GM_setValue('gpp__hidden_img_url_' + url_hash, true);
					}else{
						//Show
						GM_removeItem('gpp__hidden_img_url_' + url_hash);
					}
					//Toggle show/hide
					img.toggle();
				});
				i++;
			}else{
				//Process existing images
				if( t.is(':visible') ){
					if(hide_images_by_default){
						if(!t.hasClass('gpp__hide_images_tagged_shown')){
							t.addClass('gpp__hide_images_tagged_shown');
							t.hide();
						}
					}else{
						url_hash = md5(img_url);
						var hidden_img_url = GM_getValue('gpp__hidden_img_url_' + url_hash, false);
						if(hidden_img_url){
							t.hide();
						}
					}
				}
			}
			
		});
	}
	
	/****** Start Loop ******/
	main_loop();
	setInterval(main_loop, 2000);	

}

function onLoad() {
	//console.log("Loaded Google+: " + window.location.href);
	if (!settings) {
	﻿  chrome.extension.sendRequest({'name' : 'settings'}, function(theSettings) {
		//console.log(settings);
			if (!settings) {
			 ﻿  settings = theSettings;
				//console.log(settings);
			 ﻿  if (settings.user_mute)
					userMute();
				if (settings.default_circle)
					defaultCircle();
					
				var hide_comments_by_default = false;
				if (settings.hide_comments == chrome.i18n.getMessage("options_hide_comments_default_show")
					|| settings.hide_comments == chrome.i18n.getMessage("options_hide_comments_default_hide")) {
					if (settings.hide_comments == chrome.i18n.getMessage("options_hide_comments_default_hide")){
						hide_comments_by_default = true;
					}
					hideComments(hide_comments_by_default);
				}
				
				var hide_images_by_default = false;
				if (settings.hide_images == chrome.i18n.getMessage("options_hide_images_default_show")
					|| settings.hide_images == chrome.i18n.getMessage("options_hide_images_default_hide")) {
					if (settings.hide_images == chrome.i18n.getMessage("options_hide_images_default_hide")){
						hide_images_by_default = true;
					}
					hideImages(hide_images_by_default);
				}
					
				if (settings.search_with_google)
					searchWithGoogle();
			}
	﻿  });
	}
}

if (!isJsPage) {
	document.addEventListener("DOMContentLoaded", onLoad);
}
