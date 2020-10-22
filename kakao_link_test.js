const scriptName = "kakao_link_test";
const kalingModule = require('kaling').Kakao();
const Kakao = new kalingModule();
importClass(org.jsoup.Jsoup);

Kakao.init('');
Kakao.login('', '');

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  if(msg=='테스트'){
  Kakao.send(room,
                  { "link_ver": "4.0",
                    "template_object": { "object_type" : "feed",
                                         "button_title": "테스트",
                                         "content"     : { "title": "테스트1",
                                                           "image_url": '',
                                                           "link": { "web_url": "",
                                                                     "mobile_web_url": "" },
                                                           "description": "테스트2" },
                                         "buttons"     : [{ "title": "버튼",
                                                            "link" : { "web_url": "",
                                                                       "mobile_web_url": "" }
                                                         }]
                                       }
                  }
            );
  }
  else if (msg == "test")
  {
    Kakao.send(room, {"link_ver"      : "4.0",
                      "template_id"   : 38890,
                      "template_args" : {}
                                            },"custom");
  }

  else if (msg == "코로나 테스트")
  {
    let url = "http://ncov.mohw.go.kr";
    let html = Jsoup.connect(url).get();
    let data_all      = html.select("#mapAll > div > ul > li:nth-child(1) > div:nth-child(2) > span").text();
    let data_all_ch   = html.select("#mapAll > div > ul > li:nth-child(2) > div:nth-child(2) > span").text();
    let data_non_ex   = html.select("body > div > div.mainlive_container > div.container > div > div.liveboard_layout > div.liveNumOuter > div.liveNum_today_new > div > ul > li:nth-child(1) > span.data").text();
    let data_ex       = html.select("body > div > div.mainlive_container > div.container > div > div.liveboard_layout > div.liveNumOuter > div.liveNum_today_new > div > ul > li:nth-child(2) > span.data").text();
    let data_dead     = html.select("#mapAll > div > ul > li:nth-child(5) > div:nth-child(2) > span").text();
    let data_dead_ch  = html.select("body > div > div.mainlive_container > div.container > div > div.liveboard_layout > div.liveNumOuter > div.liveNum > ul > li:nth-child(4) > span.before").text();
    let data_care     = html.select("#mapAll > div > ul > li:nth-child(3) > div:nth-child(2) > span").text();
    let data_healty   = html.select("#mapAll > div > ul > li:nth-child(4) > div:nth-child(2) > span").text();
    let data_seoul    = html.select("#main_maplayout > button:nth-child(1) > span.num").text();
    let data_seoul_ch = html.select("#main_maplayout > button:nth-child(1) > span.before").text();
    let data_gg_do    = html.select("#main_maplayout > button:nth-child(9) > span.num").text();
    let data_gg_do_ch = html.select("#main_maplayout > button:nth-child(9) > span.before").text();

    Kakao.send(room, {"link_ver"      : "4.0",
                      "template_id"   : 39072,
                      "template_args" : {"new_out"     : data_ex,
                                         "new_in"      : data_non_ex,
                                         "new"         : data_all,
                                         "new_before"  : data_all_ch,
                                         "dead"        : data_dead,
                                         "dead_before" : data_dead_ch,
                                         "care"        : data_care,
                                         "healthy"     : data_healty,
                                         "seoul"       : data_seoul,
                                         "seoul_before": data_seoul_ch,
                                         "ggdo"        : data_gg_do,
                                         "ggdo_before" : data_gg_do_ch
                                        }
                                                                      }, "custom");
  }
}




getImg = search => {

  parse = Jsoup.connect("https://m.search.naver.com/search.naver?where=m_image&sm=mtb_jum&query=" + search).get().select("img[alt=" + search + "]");

  if (parse.size()) {

    img = parse.get(Math.random() * parse.size() | 0).attr("data-source");

    return img;

  }

  return "";

};
