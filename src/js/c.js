/**
 * Created by liuc on 2017/1/2.
 */
(function (window) {
    function Iat() {

    }

    $.extend(Iat.prototype, {
        init: function (json) {
            this.json = JSON.parse(json);
            // var str = 'service=' + this.data.service
            //     + ';operation=' + this.data.operation
            //     + ';semantic=' + this.data.semantic
            //     + ';text=' + this.data.text;
            // alert(str);
            $('#result').val(this.json.text);
            this.choose();
        },
        choose: function () {
            if (this.json.service === 'weather') {//如果是天气相关
                this.weather();
            } else if (this.json.service === 'music') {//如果是音乐相关
                this.music();
            } else {
                this.other();
            }
        },
        weather: function () {
            if (this.json.operation === 'QUERY') {//如果是查询天气
                var location = this.json.semantic.slots.location.city + (this.json.semantic.slots.location.area ? this.json.semantic.slots.location.city : ''),//"上海市"||"上海市" + '地区'||"CURRENT_CITY"
                    datetime = this.json.semantic.slots.datetime.date;//"2017-01-04"||"2017-01-04"||"CURRENT_DAY";
                location = (location === "CURRENT_CITY") ? this.json.data.result[0].city : location;//统一为地名，如"上海市"||"上海市" + '地区'
                datetime = (datetime === "CURRENT_DAY") ? this.getDateStr(new Date()) : datetime;//统一为日期，如"2017-01-04"
                var module = new M();
                module.weatherM(location, datetime);
            } else {
                //window.jsm.startTts('抱歉，没有找到相关信息');//TTS语音播报
            }
        },
        music: function () {
            if (this.json.operation === 'PLAY') {//如果是播放音乐
                if (!this.json.semantic.slots) {
                    //window.jsm.startTts('你想听哪个歌手的歌？');//TTS语音播报
                } else {
                    var module = new M();
                    module.musicM({
                        artist: this.json.semantic.slots.artist ? this.json.semantic.slots.artist : '',
                        song: this.json.semantic.slots.song ? this.json.semantic.slots.song : ''
                    });
                }
            } else {
                //window.jsm.startTts('抱歉，没有找到相关信息');//TTS语音播报
            }
        },
        other: function () {
            var _this = this;
            $.post("http://www.tuling123.com/openapi/api",
                {
                    'key': 'e55af5c0aa81408094675bd32a66dcc6',
                    'info': _this.json.text,
                    'loc': '北京市',
                    'userid': ' 123456'
                },
                function (data) {
                    $("#content").html(data.text);
                    //window.jsm.startTts(data.text);//TTS语音播报
                }
            )
        },
        getDateStr: function (d) {//将日期对象转成"2017-01-04"
            return d.getFullYear() + '-' + this.add0(d.getMonth()) + '-' + this.add0(d.getDate()) + '-';
        },
        add0: function (n) {
            return n < 10 ? '0' + n : '' + n;
        }
    });


    //参数json：讯飞返回的语义理解后的json串，拿到后需要提取里面的service、operation、等业务参数
    window.understandResultJson = function (json) {
        var iat = new Iat();
        iat.init(json);
    }


})(window);


//测试语音理解
var j = {
    "webPage": {
        "header": "",
        "url": "http://kcbj.openspeech.cn/service/iss?wuuid=2654fe7dc204e763e9ce2cc1bd5e5100&ver=2.0&method=webPage&uuid=e5f5320121ec870a37ebea7ad92cf75cquery"
    },
    "semantic": {
        "slots": {
            "location": {
                "type": "LOC_POI",
                "city": "CURRENT_CITY",
                "poi": "CURRENT_POI"
            },
            "datetime": {
                "date": "CURRENT_DAY",
                "type": "DT_BASIC"
            }
        }
    },
    "rc": 0,
    "operation": "QUERY",
    "service": "weather",
    "data": {
        "result": [
            {
                "airQuality": "重污染",
                "sourceName": "中国天气网",
                "date": "2017-01-03",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "dateLong": 1483372800,
                "pm25": "295",
                "city": "北京",
                "humidity": "67%",
                "windLevel": 0,
                "weather": "霾",
                "tempRange": "-5℃",
                "wind": "南风微风"
            },
            {
                "airQuality": "",
                "sourceName": "中国天气网",
                "date": "2017-01-04",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "city": "北京",
                "dateLong": 1483459200,
                "windLevel": 0,
                "weather": "霾",
                "tempRange": "-5℃~7℃",
                "wind": "南风微风"
            },
            {
                "airQuality": "",
                "sourceName": "中国天气网",
                "date": "2017-01-05",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "city": "北京",
                "dateLong": 1483545600,
                "windLevel": 0,
                "weather": "霾",
                "tempRange": "-4℃~5℃",
                "wind": "无持续风向微风"
            },
            {
                "airQuality": "",
                "sourceName": "中国天气网",
                "date": "2017-01-06",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "city": "北京",
                "dateLong": 1483632000,
                "windLevel": 0,
                "weather": "霾",
                "tempRange": "-2℃~5℃",
                "wind": "南风微风"
            },
            {
                "airQuality": "",
                "sourceName": "中国天气网",
                "date": "2017-01-07",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "city": "北京",
                "dateLong": 1483718400,
                "windLevel": 0,
                "weather": "霾",
                "tempRange": "-3℃~3℃",
                "wind": "南风微风"
            },
            {
                "airQuality": "",
                "sourceName": "中国天气网",
                "date": "2017-01-08",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "city": "北京",
                "dateLong": 1483804800,
                "windLevel": 0,
                "weather": "多云转晴",
                "tempRange": "-4℃~3℃",
                "wind": "南风微风"
            },
            {
                "airQuality": "",
                "sourceName": "中国天气网",
                "date": "2017-01-09",
                "lastUpdateTime": "2017-01-03 18:00:09",
                "city": "北京",
                "dateLong": 1483891200,
                "windLevel": 1,
                "weather": "晴",
                "tempRange": "-6℃~2℃",
                "wind": "北风3-4级"
            }
        ]
    },
    "text": "天气"
};

// j = {
//     "rc": 0,
//     "text": "你好吗"
// };

// understandResultJson(JSON.stringify(j));

