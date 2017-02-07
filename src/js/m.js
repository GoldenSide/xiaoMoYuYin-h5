/**
 * Created by liuc on 2017/1/2.
 */
(function (window) {

    function M() {
        this.li = null;
        this.a = null;
        this.isMove = false;
        this.isChange = false;
    }

    $.extend(M.prototype, {
        weatherM: function (area, day) {//天气的数据
            var _this = this;
            $.ajax({
                url: 'http://route.showapi.com/9-2',
                data: {
                    area: area,
                    showapi_appid: '28554',
                    showapi_sign: '0b31e5ac70e2490599af87a4a5b22f35'
                },
                dataType: 'json',
                success: function (json) {
                    _this.weatherSucc(area, day, json);
                }
            });
        },
        weatherSucc: function (area, day, json) {
            this.weatherData(json);//对天气数据进行加工
            $('#wrapCss').attr('href', 'css/weather.css');  //加载css
            // $('#load').hide();//去掉加载动画
            // $('#content').show();//显示天气
            var str = area + day + json.showapi_res_body.f1.tq;//播放某天的天气
            try {
                window.jsm.startTts(str);
            } catch (e) {
                console.log(e);
            }
            this.creatHtml('../htm/tq.html', 'html', json, function () {//请求模板，渲染页面

            });
        },
        weatherData: function (json) {
            var date = new Date();//设置今天的时间
            json.date = '今天 ' + date.getFullYear() + '-' + this.add0(date.getMonth() + 1) + '-' + this.add0(date.getDate());

            var dateArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];//设置三天的星期
            var xq = date.getDay();
            var arr = [json.showapi_res_body.f1, json.showapi_res_body.f2, json.showapi_res_body.f3];//设置三天的天气
            arr.forEach(function (e, i) {
                e.tq = (e.day_weather === e.night_weather) ? e.day_weather : e.day_weather + '转' + e.night_weather;
                e.xq = dateArr[xq + i];
            });
            var time = json.showapi_res_body.time;//设置发布时间
            json.showapi_res_body.time = '发布时间：' + time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + +time.substr(8, 2) + '：' + time.substr(10, 2) + '：' + time.substr(12, 2);
        },
        musicM: function (json) {//音乐的数据
            var _this = this;
            $.ajax({//根据歌曲名和作者,通过kw查询歌曲
                url: 'http://route.showapi.com/213-1',
                data: {
                    keyword: json.artist + json.song,
                    showapi_appid: '28554',
                    showapi_sign: '0b31e5ac70e2490599af87a4a5b22f35',
                    page: '2',
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    if (data.showapi_res_code !== 0) {
                        alert('出错了');
                    } else {
                        _this.musicSucc(data);
                    }
                }
            });
        },
        musicSucc: function (data) {
            var _this = this;
            $('#wrapCss').attr('href', 'css/music.css');  //加载css
            // $('#load').hide();//去掉加载动画
            // $('#content').show();//显示天气
            var str = '为您找到以下音乐';//播放某天的天气
            try {
                window.jsm.startTts(str);
            } catch (e) {
                console.log(e);
            }
            this.creatHtml('../htm/music.html', 'html', data, function () {//请求模板，渲染页面
                _this.musicEvent();
            });
        },
        musicEvent: function () {
            var _this = this;
            this.li = $('.songList li').eq(0);
            this.a = $('#musicAudio')[0];
            this.changeMusic();
            $('.songList li').on('touchstart', function (e) { //用jq的on/bind来绑定事件的话，e.target可能是li或者li的子元素
                _this.start(e);
            });
        },
        start: function (e) {
            var _this = this;
            this.isMove = false;
            this.isChange = false;
            var li = e.target.tagName === 'LI' ? $(e.target) : $(e.target).closest('li');
            if (this.li.attr('index') != li.attr('index')) {
                this.isChange = true;
                this.li = li;
            }
            this.init = {
                sx: e.targetTouches[0].pageX,
                sy: e.targetTouches[0].pageY
            };

            this.li.addClass('hover');
            this.li.on('touchmove', function (e) {
                _this.move(e);
            });
            this.li.on('touchend', function (e) {
                _this.end(e);
            });
            e.stopPropagation();
        },
        move: function (e) {
            var change = {
                sx: e.targetTouches[0].pageX,
                sy: e.targetTouches[0].pageY
            };
            if (Math.pow(this.init.sx - change.sx, 2) + Math.pow(this.init.sy - change.sy, 2) > 10) {
                this.isMove = true;
                this.li.removeClass('hover');
            }
        },
        end: function (e) {
            if (!this.isMove) {//如果是点击事件
                this.li.removeClass('hover');
                if (this.isChange) {//如果不是同一首歌
                    $('.songList').find('li').removeClass('active');
                    this.a.pause();
                    this.changeMusic();
                } else {//如果是同一首歌
                    if (this.a.paused) {//如果是暂停
                        this.changeMusic();
                    } else {//如果是播放
                        this.li.removeClass('active');
                        this.a.pause();
                    }
                }
            }
            this.li.off('touchmove');
            this.li.off('touchend');
            this.li.removeClass('hover');
        },
        changeMusic: function () {
            var _this = this;
            this.li.addClass('active');
            this.a.setAttribute('src', this.li.attr('src'));
            this.a.play();
            $(this.a).off('timeupdate').on('timeupdate', function () {
                _this.timedate();
            });

            $(this.a).off('progress').on('progress', function () {
                _this.progress();
            });
        },
        timedate: function () {//播放进度
            var _this = this;
            this.li.find('.now').html(getNow(this.a.currentTime) + '/' + getNow(this.a.duration));
            this.li.find('.playing').width(this.a.currentTime / this.a.duration * this.li.find('.progress').width());

            function getNow(n) {
                return _this.add0(parseInt(n / 60)) + ':' + _this.add0(parseInt(n % 60));
            }
        },
        progress: function () {//缓冲进度
            if (this.a.buffered.length) {
                this.li.find('.buffer').width(this.a.buffered.end(0) / this.a.duration * this.li.find('.progress').width());
            }
        },
        // musicDetailM: function () {
        //     this.creatHtml('../htm/musicDetail.html', 'html', null, function () {//请求模板，渲染页面
        //     });
        // },
        add0: function (n) {
            return n > 10 ? '' + n : '0' + n;
        },
        creatHtml: function (url, type, json, callBack) {//请求模板，渲染页面
            $.ajax({
                url: url,
                dataType: type,
                success: function (data) {
                    $('#temp').html(data);
                    var htmlStr = template('temp', json);
                    $('#content').html(htmlStr);
                    callBack && callBack();
                }
            });
        }
    });

    window.M = M;


    //测试音乐
    // var module = new M();
    // module.musicM({
    //     artist: '薛之谦',
    //     song: ''
    // });

    //测试音乐详情
    // var module = new M();
    // module.musicDetailM();




})(window);