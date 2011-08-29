var settings;

var isJsPage = !!window.location.href.match(/_\/apps-static\//);

function re_map(mappings){
	var m = mappings;
	SEL = {
		'post' : "[id^='update-']", //"[id^='update-']"
		'posts' : m['XVDd7kiawTA9Z68I'], //".tn"
		'comments_wrap' : m['nqBp6N6dKqueig2R'], //".Ij"
		'comment_editor_cancel' : m['KGafpX8THW0zZ9Jq'], //'.b-n-l'
		'plust1_and_comments_link_wrap' : m['YAnwDHrlMoy67el9'], //".Bl"
		'old_comment_count_span' : m['9Iug6cv5o3NgTEEv'], //".Gw"
		'recent_comments_wrap' : m['CgYb1dbCZGVfpUAj'], //'.mf'
		'circle_links_wrap' : '#content ' + m['tZ7bxNTZEoVrcPyj'] + ' + div', //"#content .a-ud-B + div"		
		'circle_links' : "#content " + m['NCQTv2BvLd3MFT9q'].replace(':hover','') + " a[href*='stream/']", //"#content .a-ob-j-X a[href*='stream/']"
		'stream_link' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']:first", //"#content .a-ob-Fd a[href='/stream']:first"
		'stream_link_active' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']" + m['oL8HuLz0SCCVwtPK'] + ":first", //"#content .a-f-ob-B a[href='/stream'].a-ob-j-ia:first"
		'user_link' : m['tuVm7xq63YKbjl9u'] + ' a:first', //'.Nw a:first'
		'share_link' : m['xG7OYDQoYoP4QS0R'] + ' a:first', //'.gx a:first'
		'permalink_wrap' : m['tuVm7xq63YKbjl9u'], //'.Nw'
		'search_input_classes' : m['ikY6QG1yVApfM0ib'].replace('.','') + ' ' + m['9WbMI68ODRm5sxgV'].replace('.','') + ' ' + m['QvnLjkPdyzwsVmEq'].replace('.',''), //'a-pu-z a-x-z Ka-z-Ka'
		'___' : ''
	};
}

function set_selector_mappings(){
	var mappings = {};
	try{
		//console.log(SEL);
		/*stor_del('GPlus CSS Map');
		stor_del('Last Got GPlus CSS Map Date');
		stor_del('GPlus CSS Map Date');
		return;*/
		
		//var now = new Date("August 25, 2011 22:27:00"); //new Date();
		var now = new Date();

		var stored_mappings;
		var stored_last_check_for_map_update;
		var stored_map_date;

		//Check for resume flag
		var uncheckable_dom_litmus_location = false;
		var path = window.location.pathname;
		if( path !=  '/' && path.indexOf('/stream/') == -1 && path.indexOf('/posts') == -1 ){
			uncheckable_dom_litmus_location = true;
		}
		
		//Set mappings if first time upon page load
		if( !SET_SELECTOR_MAPPINGS_DONE_ONCE ){
			stored_mappings = $.parseJSON(stor_get('GPlus CSS Map', null));
			stored_last_check_for_map_update = stor_get('Last Got GPlus CSS Map Date', 0);
			stored_map_date = stor_get('GPlus CSS Map Date', '');

			//User stored mapping if newer than default mappings
			if((stored_last_check_for_map_update != 0) && (stored_mappings) && (stored_map_date > default_selector_map['mapping date right'])){
				mappings = stored_mappings; //local storage copy of map
			}else{
				mappings = default_selector_map.mappings; //included default map file
			}

			//console.log('mappings_before_remap:');
			//console.log(default_selector_map.mappings);
			re_map(mappings);
			//console.log(SEL);
		}else{
			SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
		}
		
		//Check if resume mode is needed
		if(uncheckable_dom_litmus_location){
			RESUME_MAP_CHECK_UPON_ROOT_PATH = true; //flag to re-run when at root URL
			return;
		}
		
		RESUME_MAP_CHECK_UPON_ROOT_PATH = false; //unset flag
		
		//Check remote mappings in case of update
		var timediff = now.getTime() - stored_last_check_for_map_update;
		//console.log('timediff:');
		//console.log(timediff/60*1000*60);
		//console.log('stored_last:');
		//console.log(stored_last_check_for_map_update);
		//console.log('stored_map:');
		//console.log(stored_map_date + ' and ' + stored_map_date);
		//console.log('stored_last:' + stored_last_check_for_map_update); console.log('timediff:' + (timediff > 30*60*1000)); console.log('force:' + SET_SELECTOR_MAPPINGS_FORCED);
		if((stored_last_check_for_map_update == 0) || (timediff > 30*60*1000) || (SET_SELECTOR_MAPPINGS_FORCED)){ /* 30*60*1000 = 0.5 hour interval*/
			SET_SELECTOR_MAPPINGS_FORCED = false; //unset flag
			//console.log('past interval');
			$.getJSON('https://goldenview.wittman.org/map/current_gplus_mappings.json', function(data){
				//console.log('ajax map pull:'); console.log(data);
				var date_right = typeof data['mapping date right'] == 'undefined' ? default_selector_map['mapping date right'] : data['mapping date right'];	
				var mappings_length = Object.keys(data.mappings).length;
				//console.log('date_right, default_date');
				//console.log(date_right); console.log(default_selector_map['mapping date right']);
				if(date_right > default_selector_map['mapping date right'] && mappings_length > 999 && (!$(SEL.posts).length || !$(SEL.comments_wrap).length || !$(SEL.circle_links).length)){
					mappings = data.mappings;
					re_map(mappings);
					stor_set('GPlus CSS Map', JSON.stringify(mappings));
					stor_set('GPlus CSS Map Date', date_right);
					//console.log('update local from remote');
					//console.log(mappings);
				}
			});
			stor_set('Last Got GPlus CSS Map Date', now.getTime());
			//console.log('stored:'+now.getTime());
		}
		//console.log(mappings);
	}catch(e){
		SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
		mappings = default_selector_map.mappings; //If all else fails, use included default map file
		re_map(mappings);
		//console.log('exception caught, using default');
		//console.log(e.message);
		//console.log(mappings);
	}
}

var SEL = {};
var RESUME_MAP_CHECK_UPON_ROOT_PATH = false;
var SET_SELECTOR_MAPPINGS_DONE_ONCE = false;
var SET_SELECTOR_MAPPINGS_FORCED = false;
var SET_SELECTOR_MAPPINGS_FORCED_ONCE = false;

set_selector_mappings();

//console.log('SEL:')
//console.log(SEL);

function hideComments(hide_by_default){ // v0.2.7
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
		//return update.find('.a-f-i-Xb .tk3N6e-e-vj[role]').length > 0; OLD
		//return update.find('.l-e-O[role]').length > 0; //OLD
		//return update.find('.c-m-l[role]').length > 0; //OLD
        return update.find(SEL.comment_editor_cancel).length > 0; //NEW
	}
	function remove_red_color_of_number(comment_count_display){
		if(comment_count_display.length > 0){
			comment_count_display.find('.gpp__hide_comments_recent_number').css({color:'#999',fontWeight:'normal'});
		}
	}


	function main_loop(){
		var i = 0;
		
		//$("[id^='update']").find(".a-f-i-Xb").each(function(){ OLD
		//$("[id^='update'] > .Wh .Oq").each(function(){ //OLD
		//$("[id^='update'] .Gq").each(function(){ //OLD
		//$("[id^='update'] .Ol").each(function(){ //OLD
		//$("[id^='update'] .Vg").each(function(){ //OLD
		//$("[id^='update'] .Ag").each(function(){ //NEW
		$(SEL.comments_wrap).each(function(){ //TMP
			var t = $(this);
			var update = t.parentsUntil(SEL.post);
			//var plust1_and_comments_link = t.parent().find(".a-f-i-bg"); //OLD
			//var plust1_and_comments_link = update.find(".Xn"); //OLD
			//var plust1_and_comments_link = update.find(".Jn"); //OLD
			//var plust1_and_comments_link = update.find(".ol"); //OLD
            var plust1_and_comments_link = update.find(SEL.plust1_and_comments_link_wrap); //NEW
			//var comments = update.find('.em');
			var comments = t; //.find('.Ly');

			//var old_comment_count_span = comments.find("div.a-f-i-WXPuNd span[role]"); //OLD
			//var old_comment_count_span = comments.find("div.Lt span[role]"); //OLD
			//var old_comment_count_span = comments.find("div.Ft span[role]"); //OLD
			//var old_comment_count_span = comments.find(".xx[role]"); //OLD
            var old_comment_count_span = comments.find(SEL.old_comment_count_span); //NEW
			
			if( old_comment_count_span.hasClass('gpp__comments_hidden_old_shown') ){
				old_comment_count_span.addClass('gpp__comments_hidden_old_shown');
				remove_red_color_of_number(comment_count_display);
			}
			var old_comment_count = 0;
			var old_comment_count_display = '';
			if(old_comment_count_span.length > 0){
				old_comment_count = old_comment_count_span.text().match(/\d+/);
				if(old_comment_count > 0){
					old_comment_count_display = '&nbsp;&nbsp;(OLD: <span class="gpp__hide_comments_old_number">' + old_comment_count + '</span>)';
				}
			}

			//var recent_comments = update.find('.a-b-f-i-Xb-oa .a-b-f-i-W-r'); //OLD
			//var recent_comments = update.find('.Gq .Ly'); //OLD
			//var recent_comments = update.find('.sx'); //OLD
            var recent_comments = update.find(SEL.recent_comments_wrap); //NEW
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
					comments.addClass('gpp__comments');
					button_html = '<br><span role="button" class="b-j gpp__comment_show_hide" tabindex="0">Hide Comments</span> <span style="font-size:10pt;color:#999" class="gpp__comment_count_container"></span><br><br>';
					comments.after(button_html);

					//console.log('editor_present:'+editor_present);
					var show_hide = comments.parent().find('.gpp__comment_show_hide:first');
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

function defaultCircle(){ // v0.2.5
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
	function img_star(filename){
		return '<img alt="*" src="' + chrome.extension.getURL(filename) + '">';
	}
	function add_css(){
		$('head').append('<style>'
			+ 'a.gpp__default_circle { text-decoration:none; }'
			+ 'a.gpp__default_circle img { border:none; }'
		+'</style>'
		);
	}
	function process_circles(t, default_circle_url, circle_link){
		//Process Circles
		if( default_circle_url == circle_link.attr('href') && t.find('.gpp__default_circle').length == 0 ){
			t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">' + STAR_SOLID + '</a>');
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
		//var circle_links_container = $("#content .a-b-la-A :first"); OLD
		//var circle_links_container = $("#content .a-b-sb-z:first"); //OLD
		//var circle_links_container = $("#content .a-c-mb-S:first"); //OLD
		//var circle_links_container = $("#content .a-e-nb-B:first"); //OLD
        var circle_links_container = $(SEL.circle_links_wrap); //NEW

		//var circle_links = $("#content .a-b-sb-z a[href*='stream/']"); //OLD
		//var circle_links = $("#content .a-mb-k-da a[href*='stream/']"); //OLD
		//var circle_links = $("#content .a-nb-j-T a[href*='stream/']"); //OLD
        var circle_links = $(SEL.circle_links); //NEW
		
		var default_circle_url = GM_getValue('gpp__default_circle_url', '');
		
		circle_links_container.css('margin-left','8px');
				
		//OFF <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH ">Stream</a>
		//ON  <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH  a-la-h-Pa">Stream</a>
		
		//Always add star to Stream 
		//var stream =  $("#content .a-c-mb-S a[href='/stream']:first"); //OLD
		//var stream =  $("#content .a-e-nb-B a[href='/stream']:first"); //OLD
        var stream =  $(SEL.stream_link); //NEW
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
		
		//var stream_active =  $("#content .a-b-la-A a[href='/stream'].a-la-h-Pa:first"); OLD 
		//var stream_active =  $("#content .a-b-sb-z a[href='/stream'].a-sb-k-Ea:first"); //OLD
		//var stream_active =  $("#content .a-c-mb-C a[href='/stream'].a-mb-k-ua:first"); //OLD
		//var stream_active =  $("#content .a-e-nb-B a[href='/stream'].a-nb-j-ma:first"); //OLD
        var stream_active =  $(SEL.stream_link_active); //NEW
		

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
			circle_links.each(function(){
				var t = $(this);
				var circle_link = t;
				//Process Stream
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
							//$(this).empty().append('SET Ã¢Ëœâ€¦').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
							$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
						},
						function(){
							//$(this).empty().append('Ã¢Ëœâ€ ').css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
							$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
						}
					);
				}
				//Process Circles
				process_circles(t, default_circle_url, circle_link);
			});
		}
	}
	var allow_stream = false;
	var STAR_SOLID = img_star('star-solid.png');
	var STAR_OUTLINE = img_star('star-outline.png');
	var STAR_HOVER_SOLID = img_star('star-hover-solid.png');
	var STAR_HOVER_OUTLINE = img_star('star-hover-outline.png');
	
	/****** Execute before main_loop ******/
	add_css();
	
	/****** Start main_loop ******/
	setInterval(main_loop, 2000);
}

function userMute(){ // v0.2.3
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
				'sv-SE' : 'VISA ORIGINALSKRIBENTEN FÃƒâ€“R DET DOLDA MEDDELANDET',
				'xx-XX' : '_____'
			},
			'mute_user' : {
				'en-US' : 'MUTE USER',
				'sv-SE' : 'DÃƒâ€“LJ ANVÃƒâ€žNDAREN',
				'xx-XX' : '_____'
			}
		}
		return lang;
	}
	function t(key){
		return LANGUAGE[key][NORMALIZED_LANGUAGE_CODE];
	}
	function insert_unmute_button(th, id, share_id, name){
		var unmute_html = '<div>' + name + ' <a style="font-size:10px" class="gpp__user_mute_unmute">' + t('unmute') + '</a></div>';
		if( id_match(id, share_id) == 'share' ){
			unmute_html = '<div>' + name + ' &nbsp;(<span style="font-size:10px" class="gpp__user_mute_unmute">' + t('muted_share') + ' &ndash; <a style="font-size:10px" href="https://plus.google.com/' + share_id + '">' + t('see_original') + '</a>' + '</span>)</div>'
		}
		th.after(unmute_html);
		th.parent().find('.gpp__user_mute_unmute:first').click(function(){
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

		//if($("[id^='update']:first .IE:first a[oid]:first").length == 0) //Avoid implementing User Mute on Sparks view
		if(window.location.href.indexOf('/sparks/') > -1) //Avoid implementing User Mute on Sparks view
			return;
			
		//var posts = $('#content .a-f-i-p').each(function(){ //OLD
		//var posts = $("[id^='update'] .Wh").each(function(){ //OLD
		//var posts = $("[id^='update'] .zh").each(function(){ //OLD
        //var posts = $("[id^='update'] .tg").each(function(){ //OLD
        var posts = $(SEL.posts).each(function(){ //NEW
			var th = $(this);
			//var user_link = th.find('.Xy .rE a:first'); //OLD
			//var user_link = th.find('.IE a:first'); //OLD
			//var user_link = th.find('.CC a:first'); //OLD
            var user_link = th.find(SEL.user_link); //NEW
			//var share_link = th.find('.Mt .vz a:first'); //OLD
			//var share_link = th.find('.Gt .sz a:first'); //OLD
			//var share_link = th.find('.Wx a:first'); //OLD 
            var share_link = th.find(SEL.share_link); //NEW
			var name = user_link.text();
			var share_id = typeof share_link.attr('oid') != 'undefined' ? share_link.attr('oid') : '';
			var id = typeof user_link.attr('oid') != 'undefined' ? user_link.attr('oid') : '';

			//GM_removeItem('gpp__user_mute_id_' + id); return;

			//Set click handlers
			if( th.find('.gpp__user_mute_mute:first').length == 0 && th.parent().find('.gpme-comment-count-container').length == 0 ){
				//th.find('.Xy .ao').children(':last').after(' &nbsp;<a style="font-size:10px" class="gpp__user_mute_mute">' + t('mute_user') + '</a>');
				//<div class="gpme-comment-count-container" style="display: none; "><span class="gpme-comment-count-bg gpme-comment-count-nohilite"></span><span class="gpme-comment-count-fg gpme-comment-count-nohilite"></span></div>)
				
				//th.find('.Xy .ao').after(' &nbsp;<a style="font-size:10px" class="gpp__user_mute_mute">' + t('mute_user') + '</a>'); //OLD
				//th.find('.Uy').append(' &nbsp;<a style="font-size:10px" class="gpp__user_mute_mute">' + t('mute_user') + '</a>'); //OLD
				//th.find('.Ex').append(' &nbsp;<a style="font-size:10px" class="gpp__user_mute_mute">' + t('mute_user') + '</a>'); //OLD
                th.find(SEL.permalink_wrap).append(' &nbsp;<a style="font-size:10px" class="gpp__user_mute_mute">' + t('mute_user') + '</a>'); //NEW
				th.parent().find('.gpp__user_mute_mute:first').click(function(){
					//Mute
					th.fadeOut();
					GM_setValue('gpp__user_mute_id_' + id, '1');
					//Muted, so insert unmute button
					if( th.parent().find('.gpp__user_mute_unmute:first').length == 0 ){
						insert_unmute_button(th, id, share_id, name);
					}
					th.parent().find('.gpp__user_mute_unmute').parent().show();
				});
			}
			
			//Check storage to find out if state == muted
			if( id_match(id, share_id) ){
				if( th.is(':visible') ){
					th.hide();
				}
				if( !th.is(':visible') ){
					th.parent().find('.gpp__user_mute_unmute:first').parent().show();
				}
				if( th.parent().find('.gpp__user_mute_unmute:first').length == 0 ){
					insert_unmute_button(th, id, share_id, name);
				}
			}else{
				if( !th.is(':visible') ){
					th.show();
					th.parent().find('.gpp__user_mute_unmute:first').parent().hide();
				}
			}
	
			// G+Me extension compatibility - Better handling of User Mute module - remove MUTE USER link when collapsed
			if(G_PLUS_ME_EXTENSION_PRESENT){
				var cloned_mute = $('#contentPane .gpme-titlebar .gpp__user_mute_mute');
				if(cloned_mute.length){
					cloned_mute.remove();
				}
			}
				
		});
	
	}

	/****** Before main_loop ******/
	/*** Constants ***/
	var NORMALIZED_LANGUAGE_CODE = normalize_language(navigator.language);
	var LANGUAGE = language_dictionary();
	var G_PLUS_ME_EXTENSION_PRESENT = false;
	
	/*** 3rd-party extension compatibility - G+Me ***/
	if( $('.gpme-titlebar:first').length ){
		G_PLUS_ME_EXTENSION_PRESENT = true;
	}

	/****** Start main_loop ******/
	setInterval(main_loop, 2000);
}

function searchWithGoogle(){ // v0.1.7
	var search_box_new_html = '<form style="display:none" id="ggp__search_with_google" method="get" action="http://www.google.com/search?" target="_blank"><input type="hidden" name="hl" value="en-GB"><input type="hidden" name="q" value="site:plus.google.com -buzz -&quot;google reader&quot;"><input class="' + SEL.search_input_classes + '" id="gpp__search-box" autocomplete="off" type="text" maxlength="2048" name="q" value="Search with Google" placeholder="Search with Google"></form> <a style="float:right;font-weight:bold;font-size:9px" id="gpp__search_with_google_swap">TOGGLE SEARCH TYPE</a>'; //NEW

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

function hideImages(hide_images_by_default){ // v0.1.8
	
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
		return (img.height() <= 62 || img.width() <= 62);
	}

	/****** Constants ******/
	var logging = false;

	/****** Before Loop Variables ******/
	var i = 0;
	//var img_divs = $('#contentPane .P-I-ba[data-content-url]'); //OLD
	//var img_divs = $('#contentPane .O-F-X[data-content-url]'); //OLD
	//var img_divs = $('#contentPane .H-y-qa[data-content-url]'); //OLD
    var img_divs = $('#contentPane .F-y-Ia[data-content-url]'); //NEW
	
	/****** Loop ******/
	function main_loop(){
		
		//img_divs = $('#contentPane .O-F-X[data-content-url]'); //OLD
		//img_divs = $('#contentPane .H-y-qa[data-content-url]'); //OLD
        img_divs = $('#contentPane .F-y-Ia[data-content-url]'); //NEW

		img_count = img_divs.length;
			
		img_divs.each(function(){
			var t = $(this);
			var img_url = t.attr('data-content-url');
			var url_hash;
			if( !t.hasClass('gpp__hide_images_tagged') && !isThumbnail(t) ){
				//Process new images
				url_hash = md5(img_url);
				t.addClass('gpp__hide_images_tagged');
				//t.after('<div id="gpp__hide_images_button_' + i + '" style="margin:7px 9px; height: 5px;width: 91%;" class="gpp__hide_images Ah Ft h-na-o-z"><span role="button" tabindex="0"><span style="margin-top:-5px" class="" title="Hidden image"></span><span style="font-size:9px; margin:-3px 0 0 20px;position:absolute"><a>SHOW / HIDE</a></span></span></div>'); //OLD
				//t.after('<div id="gpp__hide_images_button_' + i + '" style="margin:7px 9px; height:auto;width: 91%;background-position-y:-201px;float:left" class="gpp__hide_images ns yx Fv h-ga-o-v"><span role="button" tabindex="0"><span style="margin-top:-5px" class="" title="Hidden image"></span><span style="font-size:9px; margin:-5px 0 0 22px;position:absolute"><a>SHOW / HIDE</a></span></span></div>'); //OLD
				t.after('<div id="gpp__hide_images_button_' + i + '" style="margin:7px 9px; height:auto;width: 91%;background-position-y:-201px;float:left" class="gpp__hide_images Lr9 Hw i-wa-m-v"><span role="button" tabindex="0"><span style="margin-top:-5px" class="" title="Hidden image"></span><span style="font-size:9px; margin:-5px 0 0 22px;position:absolute"><a>SHOW / HIDE</a></span></span></div>'); //NEW
				var img = t;
				var button = img.parent().find('#gpp__hide_images_button_' + i + ':first');
				button.hover(function(){
					$(this).css('background-color', 'whiteSmoke');
				},
				function(){
					$(this).css('background-color', 'inherit');
				});
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

function mapUpdateCheck(){
	chrome.extension.sendRequest({'name' : 'force_selector_map_update_once'}, function(skip){
		//console.log('force_selector_map_update_once__skip:'); console.log(skip);
		if( !skip ){ // && !SET_SELECTOR_MAPPINGS_FORCED_ONCE ){
			//console.log('past skip');
			RESUME_MAP_CHECK_UPON_ROOT_PATH = true;
			SET_SELECTOR_MAPPINGS_FORCED = true;
			SET_SELECTOR_MAPPINGS_FORCED_ONCE = true;
		}
	});

	if(RESUME_MAP_CHECK_UPON_ROOT_PATH){
		set_selector_mappings();
	}
}

function onLoad() {
	//console.log("Loaded Google+: " + window.location.href);
	if (!settings) {
		  chrome.extension.sendRequest({'name' : 'settings'}, function(theSettings) {
		//console.log(settings);
			if (!settings) {
			 	  settings = theSettings;
				//console.log(settings);
			 	  if (settings.user_mute)
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
					
				setInterval(mapUpdateCheck, 30000); //always run every 30 seconds)
			}
		  });
	}
}

if (!isJsPage) {
	document.addEventListener("DOMContentLoaded", onLoad);
}