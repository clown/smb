/* ------------------------------------------------------------------------- */
/*
 *  smb.js
 *
 *  Copyright (c) 2011, clown.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *    - Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    - No names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/* ------------------------------------------------------------------------- */
var smb = new function() {
    /* --------------------------------------------------------------------- */
    //  variables
    /* --------------------------------------------------------------------- */
    var horizontal  = 7; // ソーシャルボタン間の水平方向のマージン
    var vertical    = 2; // 小さなボタンを上下中央に揃えるためのマージン
    
    /* --------------------------------------------------------------------- */
    //  kinds
    /* --------------------------------------------------------------------- */
    var kinds = {
        twitter      : 0x0001, // http://twitter.com/
        facebook     : 0x0002, // http://www.facebook.com/
        hatena       : 0x0004, // http://b.hatena.ne.jp/
        hatena_old   : 0x0008, // http://b.hatena.ne.jp/
        delicious    : 0x0010, // http://www.delicious.com/
        livedoor     : 0x0020, // http://clip.livedoor.com/
        yahoo        : 0x0040, // http://bookmarks.yahoo.co.jp/
        buzzurl      : 0x0080, // http://buzzurl.jp/
        evernote     : 0x0100, // http://www.evernote.com/
        newsing      : 0x0200, // http://newsing.jp/
        gree         : 0x0400, // http://gree.jp/
        nifty        : 0x0800, // サービス終了
        atode        : 0x1000, // http://news.atode.cc/
        google       : 0x2000, // http://www.google.com/bookmarks/
        tumblr       : 0x4000, // http://www.tumblr.com/
        google_plus1 : 0x8000, // http://www.google.com/webmasters/+1/button/
    };
    
    /* --------------------------------------------------------------------- */
    //  options
    /* --------------------------------------------------------------------- */
    var options = {
        detail     : 0x0001, // カウント値も併せて表示
        showentry  : 0x0002  // クリック時に該当サービスのエントリーページを開く
    };
    
    /* --------------------------------------------------------------------- */
    //  escape
    /* --------------------------------------------------------------------- */
    var escape = function(str) {
        return str.replace(/<|>|&|'|"|\s/g, function(s){
            var map = {"<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&#39;", "\"":"&quot;", " ":"&nbsp;"};
            return map[s];
        });
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  md5
     *
     *  CybozuLabs.MD5 を利用して MD5 ハッシュ値を計算する．
     *  ロードされなかった場合は，空文字列を返す．
     *  http://labs.cybozu.co.jp/blog/mitsunari/2007/07/md5js_1.html
     */
    /* --------------------------------------------------------------------- */
    var md5 = function(str) {
        var defined = (typeof CybozuLabs != "undefined") && (typeof CybozuLabs.MD5 != "undefined") && (typeof CybozuLabs.MD5.calc != "undefined");
        return defined ? CybozuLabs.MD5.calc(str) : "";
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_google_plus1
     */
    /* --------------------------------------------------------------------- */
    var show_google_plus1 = function(option) {
        var count = ((option & options.detail) != 0) ? "true" : "false";
        document.write('<script type="text/javascript" src="http://apis.google.com/js/plusone.js">');
        document.write('{lang: "ja"}');
        document.write('</script>');
        document.write('<g:plusone size="medium" count="' + count + '"></g:plusone>');
        document.write('<script type="text/javascript">gapi.plusone.go();</script>');
        
        if ((option & options.detail) == 0) document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_twitter
     *
     *  Twitter のソーシャルボタンを表示する．
     *  http://twitter.com/goodies/tweetbutton
     */
    /* --------------------------------------------------------------------- */
    var show_twitter = function(option) {
        var count = ((option & options.detail) != 0) ? "horizontal" : "none";
        document.write('<a href="http://twitter.com/share"');
        document.write(' class="twitter-share-button"');
        document.write(' data-count="' + count + '"');
        document.write(' data-lang="ja"');
        document.write('>Tweet</a>');
        document.write('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>');
        
        if ((option & options.detail) == 0) document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_tumblr
     *
     *  Tumblr のソーシャルボタン（「いいね！」ボタン）を表示する．
     *  NOTE: Tumblr はカウントの非表示が効かない．
     *  http://www.tumblr.com/docs/ja/share_button
     */
    /* --------------------------------------------------------------------- */
    var show_tumblr = function(option) {
        var image = ((option & options.detail) != 0) ? 'share_2.png' : 'share_4.png';
        var width = ((option & options.detail) != 0) ? 62 : 20;
        
        document.write('<a href="http://www.tumblr.com/share"');
        document.write(' title="Share on Tumblr"');
        document.write(' style="display:inline-block; overflow:hidden;');
        document.write(' width:' + width + 'px; height:20px;');
        document.write(' background:url(\'http://platform.tumblr.com/v1/' + image + '\') top left no-repeat transparent;"');
        document.write('> </a>');
        document.write('<script type="text/javascript" src="http://platform.tumblr.com/v1/share.js"></script>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    }
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_facebook
     *
     *  Facebook のソーシャルボタン（「いいね！」ボタン）を表示する．
     *  NOTE: Facebook はカウントの非表示が効かない．
     *  http://developers.facebook.com/docs/reference/plugins/like/
     */
    /* --------------------------------------------------------------------- */
    var show_facebook = function(option) {
        document.write('<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(location.href));
        document.write('&amp;layout=button_count');
        document.write('&amp;show_faces=true');
        document.write('&amp;width=100');
        document.write('&amp;action=like');
        document.write('&amp;colorscheme=light');
        document.write('&amp;height=21"');
        document.write(' scrolling="no" frameborder="0" allowTransparency="true"');
        document.write(' style="border:none; overflow:hidden; width:100px; height:21px; position:relative; top:1px;"');
        document.write('></iframe>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_gree
     *
     *  GREE の Social Feedback ボタンを表示する．
     *  NOTE: GREE はカウントの表示機能が存在しない？
     *  http://developer.gree.co.jp/connect/plugins/sf
     */
    /* --------------------------------------------------------------------- */
    var show_gree = function(option) {
        var type   = ((option & options.detail) != 0) ? 0 : 4;
        var width  = ((option & options.detail) != 0) ? 70 : 16;
        var height = ((option & options.detail) != 0) ? 20 : 16;
        var bottom = ((option & options.detail) != 0) ? 0 : 2;
        
        document.write('<iframe src="http://share.gree.jp/share?url=' + encodeURIComponent(location.href));
        document.write('&amp;type=' + type);
        document.write('&amp;height=' + height + '"');
        document.write(' scrolling="no" frameborder="0" marginwidth="0" marginheight="0" allowTransparency="true"');
        document.write(' style="border:none; overflow:hidden; width:' + width + 'px; height:' + height + 'px; margin-bottom:' + bottom + 'px;"');
        document.write('></iframe>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_google
     *
     *  Google ブックマークボタンを表示する．
     */
    /* --------------------------------------------------------------------- */
    var show_google = function(option) {
        document.write('<a href="https://www.google.com/bookmarks/mark?op=edit&amp;bkmk=' + encodeURIComponent(location.href));
        document.write('&amp;title=' + encodeURIComponent(document.title) + '"');
        document.write(' target="_blank"');
        document.write('>');
        
        document.write('<img src="http://www.google.com/favicon.ico"');
        document.write(' alt="このエントリーを Google ブックマークに追加"');
        document.write(' width="16" height="16"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        
        document.write('</a>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    }
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_hatena
     *
     *  はてなブックマークボタンを表示する．
     *  http://b.hatena.ne.jp/guide/bbutton
     */
    /* --------------------------------------------------------------------- */
    var show_hatena = function(option) {
        var count   = ((option & options.detail) != 0) ? "standard" : "simple";
        var link    = ((option & options.showentry) != 0) ?
                        "http://b.hatena.ne.jp/entry/" :
                        "http://b.hatena.ne.jp/entry/add/";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含むはてブックマーク" :
                        "このエントリーをはてなブックマークに追加";
        
        document.write('<a href="' + link + escape(location.href) + '"');
        document.write(' class="hatena-bookmark-button"');
        document.write(' data-hatena-bookmark-layout="' + count + '"');
        document.write('>');
        
        document.write('<img src="http://b.st-hatena.com/images/entry-button/button-only.gif"');
        document.write(' alt="' + title + '"');
        document.write(' width="20" height="20"');
        document.write(' style="border:none;"');
        document.write(' />');
        
        document.write('</a>');
        
        document.write('<script type="text/javascript" src="http://b.st-hatena.com/js/bookmark_button_wo_al.js"');
        document.write(' charset="utf-8" async="async"');
        document.write('></script>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_hatena_old
     *
     *  旧タイプのはてなブックマークボタンを表示する．
     */
    /* --------------------------------------------------------------------- */
    var show_hatena_old = function(option) {
        var uri     = escape(location.href);
        var link    = ((option & options.showentry) != 0) ?
                        "http://b.hatena.ne.jp/entry/" + uri:
                        "http://b.hatena.ne.jp/entry/add/" + uri;
        var image   = ((option & options.showentry) != 0) ?
                        "http://b.hatena.ne.jp/images/entry.gif" :
                        "http://b.hatena.ne.jp/images/append.gif";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含むはてブックマーク" :
                        "このエントリーをはてなブックマークに追加";
        
        document.write('<a href="' + link + '" target="_blank">');
        document.write('<img src="' + image + '" alt="' + title + '"');
        document.write(' width="16" height="12"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        document.write('</a>');
        
        if ((option & options.detail) != 0) {
            document.write('<span style="margin-left:2px;"></span>');
            
            document.write('<a href="http://b.hatena.ne.jp/entry/' + uri + '"');
            document.write(' target="_blank"');
            document.write('>');
            
            document.write('<img src="http://b.hatena.ne.jp/entry/image/' + uri + '"');
            document.write(' alt="このエントリーのはてブックマーク数"');
            document.write(' style="border:none; margin-bottom:' + vertical + 'px"');
            document.write(' />');
            
            document.write('</a>');
        }
        
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_evernote
     *
     *  Evernote のソーシャルボタンを表示する．
     *  NOTE: Evernote はカウントの表示機能が存在しない．
     *  http://www.evernote.com/about/developer/sitememory/
     */
    /* --------------------------------------------------------------------- */
    var show_evernote = function(option) {
        document.write('<script type="text/javascript" src="http://static.evernote.com/noteit.js"></script>');
        document.write('<a href="#" onclick="Evernote.doClip({}); return false;">');
        
        if ((option & options.detail) != 0) document.write('<img src="http://static.evernote.com/article-clipper-jp.png"');
        else document.write('<img src="http://static.evernote.com/site-mem-16.png"');
        document.write(' alt="このエントリーを Evernote に追加"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        
        document.write('</a>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_delicious
     *
     *  Delicious のブックマークボタンを表示する．
     *  NOTE: Delicious はカウントの表示機能が存在しない．
     */
    /* --------------------------------------------------------------------- */
    var show_delicious = function(option) {
        if ((option & options.showentry) != 0) {
            document.write('<a href="http://www.delicious.com/url/' + md5(location.href) + '"');
            document.write(' target="_blank"');
            document.write('>');
        }
        else {
            document.write('<a href="http://www.delicious.com/save?v=5');
            document.write('&amp;url=' + encodeURIComponent(location.href));
            document.write('&amp;title=' + encodeURIComponent(document.title) + '"');
            document.write(' target="_blank"');
            document.write('>');
        }
        
        var image   = "http://l.yimg.com/hr/img/delicious16.gif";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含む delicious ブックマーク" :
                        "このエントリーを delicious に追加";
        
        document.write('<img src="' + image + '" alt="' + title + '"');
        document.write(' width="16" height="16"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        
        document.write('</a>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_livedoor
     *
     *  livedoor クリップのクリップボタンを表示する．
     */
    /* --------------------------------------------------------------------- */
    var show_livedoor = function(option) {
        var uri     = escape(location.href);
        var link    = ((option & options.showentry) != 0) ?
                        "http://clip.livedoor.com/page/" + uri :
                        "http://clip.livedoor.com/clip/add?link=" + encodeURIComponent(location.href);
        var image   = "http://parts.blog.livedoor.jp/img/cmn/clip_16_16_w.gif";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含む livedoor クリップ" :
                        "このエントリーを livedoor クリップに追加";
        
        document.write('<a href="' + link + '" target="_blank">');
        document.write('<img src="' + image + '" alt="' + title + '"');
        document.write(' width="16" height="16"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        document.write('</a>');
        
        if ((option & options.detail) != 0) {
            document.write('<span style="margin-left:2px;"></span>');
            
            document.write('<a href="http://clip.livedoor.com/page/' + uri + '"');
            document.write(' target="_blank"');
            document.write('>');
            
            document.write('<img src="http://image.clip.livedoor.com/counter/medium/' + uri + '"');
            document.write(' alt="このエントリーの livedoor クリップ数"');
            document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
            document.write(' />');
            
            document.write('</a>');
        }
        
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_buzzurl
     *
     *  Buzzurl のブックマークボタンを表示する．
     */
    /* --------------------------------------------------------------------- */
    var show_buzzurl = function(option) {
        var uri     = escape(location.href);
        var link    = ((option & options.showentry) != 0) ?
                        "http://buzzurl.jp/entry/" + uri :
                        "http://buzzurl.jp/config/add/confirm?url=" + encodeURIComponent(location.href);
        var image   = ((option & options.showentry) != 0) ?
                        "http://buzzurl.jp/favicon.ico" :
                        "http://buzzurl.jp.eimg.jp/static/image/api/icon/add_icon_mini_08.gif";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含む Buzzurl ブックマーク" :
                        "このエントリーを Buzzurl に追加";
        
        document.write('<a href="' + link + '" target="_blank">');
        document.write('<img src="' + image + '" alt="' + title + '"');
        document.write(' width="16" height="16"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        document.write('</a>');
        
        if ((option & options.detail) != 0) {
            document.write('<span style="margin-left:2px;"></span>');
            
            document.write('<a href="http://buzzurl.jp/entry/' + uri + '"');
            document.write(' target="_blank"');
            document.write('>');
            
            document.write('<img src="http://api.buzzurl.jp/api/counter/' + uri + '"');
            document.write(' alt="このエントリーの Buzzurl 登録数"');
            document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
            document.write(' />');
            
            document.write('</a>');
        }
        
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_yahoo
     *
     *  Yahoo! ブックマークのブックマークボタンを表示する．
     */
    /* --------------------------------------------------------------------- */
    var show_yahoo = function(option) {
        var uri = escape(location.href);
        
        if ((option & options.showentry) != 0) {
            document.write('<a href="http://bookmarks.yahoo.co.jp/url?url=' + uri);
            document.write('&amp;opener=bm&amp;ei=UTF-8"');
            document.write(' target="_blank"');
            document.write('>');
        }
        else {
            document.write('<a href="http://bookmarks.yahoo.co.jp/action/bookmark?');
            document.write('u=' + encodeURIComponent(location.href));
            document.write('&amp;t=' + encodeURIComponent(document.title));
            document.write('&amp;opener=bm&amp;ei=UTF-8"');
            document.write(' target="_blank"');
            document.write('>');
        }
        
        var image   = "http://i.yimg.jp/images/sicons/ybm16.gif";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含む Yahoo! ブックマーク" :
                        "このエントリーを Yahoo! ブックマークに追加";
        
        document.write('<img src="' + image + '" alt="' + title + '"');
        document.write(' width="16" height="16"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        
        document.write('</a>');
        
        if ((option & options.detail) != 0) {
            document.write('<span style="margin-left:2px;"></span>');
            
            document.write('<a href="http://bookmarks.yahoo.co.jp/url?url=' + uri);
            document.write('&amp;opener=bm&amp;ei=UTF-8"');
            document.write(' target="_blank"');
            document.write('>');
            
            document.write('<img src="http://num.bookmarks.yahoo.co.jp/image/small/' + uri + '"');
            document.write(' alt="このエントリーの Yahoo! ブックマーク登録数"');
            document.write(' style="border:none; margin-bottom:' + vertical + 'px;"')
            document.write(' />');
            
            document.write('</a>');
        }
        
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_newsing
     *
     *  Delicious のピックアップボタンを表示する．
     *  NOTE: newsing はカウントの表示機能が存在しない？
     */
    /* --------------------------------------------------------------------- */
    var show_newsing = function(option) {
        var uri = encodeURIComponent(location.href);
        
        if ((option & options.showentry) != 0) {
            document.write('<a href="http://newsing.jp/entry?url=' + uri + '"');
            document.write(' target="_blank"');
            document.write('>');
        }
        else {
            document.write('<a href="http://newsing.jp/nbutton?title=' + encodeURIComponent(document.title));
            document.write('&amp;url=' + uri + '"');
            document.write(' target="_blank"');
            document.write('>');
        }
        
        //var image = "http://image.newsing.jp/common/images/newsingit/newsingit_s.gif";
        var image   = "http://image.newsing.jp/common/images/newsingit/newsing_button_16.gif";
        var title   = ((option & options.showentry) != 0) ?
                        "このエントリーを含む newsing" :
                        "このエントリーを newsing でピックアップ";
        
        document.write('<img src="' + image + '" alt="' + title + '"');
        document.write(' width="16" height="16"');
        document.write(' style="border:none; margin-bottom:' + vertical + 'px;"');
        document.write(' />');
        
        document.write('</a>');
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    /*
     *  show_atode
     *
     *  あとで新聞のブックマークボタンを表示する．
     *  NOTE: あとで新聞用のボタン画像を取りあえず favicon.ico から取得
     *  している．正式なボタン画像を探す．
     */
    /* --------------------------------------------------------------------- */
    var show_atode = function(option) {
        if ((option & options.showentry) != 0) {
            document.write('<a href="http://news.atode.cc/bar.php?u=' + encodeURIComponent(location.href) + '"');
            document.write(' target="_blank"');
            document.write('>');
            
            document.write('<img src="http://news.atode.cc/favicon.ico"');
            document.write(' alt="このエントリーを含むあとで新聞" width="16" height="16"');
            document.write(' style="border:none; margin-bottom:' + vertical + 'px"');
            document.write(' />');
            
            document.write('</a>');
        }
        else {
            document.write('<a href="http://atode.cc/"');
            document.write(' onclick=\'javascript:(function(){');
            document.write('var s=document.createElement("scr"+"ipt");');
            document.write('s.charset="UTF-8";');
            document.write('s.language="javascr"+"ipt";');
            document.write('s.type="text/javascr"+"ipt";');
            document.write('var d=new Date;');
            document.write('s.src="http://atode.cc/bjs.php?d="+d.getMilliseconds();');
            document.write('document.body.appendChild(s)');
            document.write('})();');
            document.write('return false;\'');
            document.write('>');
            
            var image   = ((option & options.detail) != 0) ?
                            "http://atode.cc/img/iconnja.gif" :
                            "http://atode.cc/img/iconsja.gif";
            var title   = "このエントリーをあとで読む";
            var width   = ((option & options.detail) != 0) ? 66 : 16;
            var height  = ((option & options.detail) != 0) ? 20 : 16;
            var bottom  = ((option & options.detail) != 0) ? 0 : vertical;
            
            document.write('<img src="' + image + '" alt="' + title + '"');
            document.write(' width="' + width + '" height="' + height + '"');
            document.write(' style="border:none; margin-bottom:' + bottom + 'px"');
            document.write(' />');
            
            document.write('</a>');
        }
        document.write('<span style="margin-left:' + horizontal + 'px;"></span>');
    };
    
    /* --------------------------------------------------------------------- */
    //  public variables/functions
    /* --------------------------------------------------------------------- */
    var public = {
        /* ----------------------------------------------------------------- */
        //  version
        /* ----------------------------------------------------------------- */
        version    : "0.1.3",
        
        /* ----------------------------------------------------------------- */
        //  kinds
        /* ----------------------------------------------------------------- */
        twitter      : kinds.twitter,
        facebook     : kinds.facebook,
        google       : kinds.google,
        hatena       : kinds.hatena,
        hatena_old   : kinds.hatena_old,
        delicious    : kinds.delicious,
        livedoor     : kinds.livedoor,
        yahoo        : kinds.yahoo,
        buzzurl      : kinds.buzzurl,
        nifty        : kinds.nifty,
        newsing      : kinds.newsing,
        atode        : kinds.atode,
        evernote     : kinds.evernote,
        gree         : kinds.gree,
        tumblr       : kinds.tumblr,
        google_plus1 : kinds.google_plus1,
        
        /* ----------------------------------------------------------------- */
        //  options
        /* ----------------------------------------------------------------- */
        detail     : options.detail,
        showentry  : options.showentry,
        
        /* ----------------------------------------------------------------- */
        /*
         *  show
         *
         *  メイン関数．
         *
         *  引数 kind には twitter, facebook, hatena, hatena_old,
         *  delicious, livedoor, yahoo, buzzurl, evernote, newsing,
         *  gree のうち，表示したいものを | 演算子で繋げて指定する．
         */
        /* ----------------------------------------------------------------- */
        show : function(kind, option) {
            var tmp = 0;
            if (arguments.length == 2) {
                // version 0.0.* との互換性を保つため．
                if (typeof option == "boolean" && option == true) tmp = options.detail;
                else tmp = option;
            }
            
            if ((kind & kinds.hatena_old) != 0) show_hatena_old(tmp);
            if ((kind & kinds.google) != 0) show_google(tmp);
            if ((kind & kinds.delicious) != 0) show_delicious(tmp);
            if ((kind & kinds.livedoor) != 0) show_livedoor(tmp);
            if ((kind & kinds.yahoo) != 0) show_yahoo(tmp);
            if ((kind & kinds.buzzurl) != 0) show_buzzurl(tmp);
            if ((kind & kinds.newsing) != 0) show_newsing(tmp);
            if ((kind & kinds.atode) != 0 && ((tmp & options.detail) == 0 || (tmp & options.showentry) != 0)) show_atode(tmp);
            if ((kind & kinds.evernote) != 0) show_evernote(tmp);
            if ((kind & kinds.gree) != 0 && (tmp & options.detail) == 0) show_gree(tmp);
            if ((kind & kinds.atode) != 0 && ((tmp & options.detail) != 0 && (tmp & options.showentry) == 0)) show_atode(tmp);
            if ((kind & kinds.tumblr) != 0) show_tumblr(tmp);
            if ((kind & kinds.hatena) != 0) show_hatena(tmp);
            if ((kind & kinds.google_plus1) != 0) show_google_plus1(tmp);
            if ((kind & kinds.twitter) != 0) show_twitter(tmp);
            if ((kind & kinds.gree) != 0 && (tmp & options.detail) != 0) show_gree(tmp);
            if ((kind & kinds.facebook) != 0) show_facebook(tmp);
        }
    };
    
    return public;
}
