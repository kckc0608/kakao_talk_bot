const scriptName = "test";
const manager = "커맨드봇";
const master = "이름";
const bot_name = '버듀(가명)';
//DataBase.setDataBase("dict/"+"words_helo");
//var
let date;
let msg_send;
let msg_introduce = "안녕하세요! 저는 "+ master + "님의 봇 '" + bot_name + "' 입니다." + '\n' + "앞으로 " + master + "님이 답장하실 수 없을 때는 제가 대신 답장을 하니 너무 놀라지 말아주세요 :)";
let msg_sleep = "지금은 "+ master + "님이 자고 있습니다. 아침에 다시 연락해주시거나 메세지를 남겨주세요.";
let msg_study;
let now_year; let now_month; let now_date; let now_day; let now_hour; let now_min; let now_sec; let now_milsec;
let study;
let timer_set = new Object();
let timer_time = 1000*60*30;
let send_delay = 5;
let sleep_start = 0;
let sleep_end = 9;
let user_meet = {};
let user_meet_data = DataBase.getDataBase("user_meet").split('\n');
let dict_word_data = DataBase.getDataBase("dict_word").split('\n');
for (var i = 0; i < user_meet_data.length-1; i++)
{user_meet[user_meet_data[i].trim()] = 1;}
let dict_word = {};
for (var i = 0; i < dict_word_data.length-1; i++)
{
  dict_word[dict_word_data[i].trim()] = new Object;
  var file_name = "dict/words_" + dict_word_data[i].trim();
  var data = DataBase.getDataBase(file_name).split('\n');
  for (var j = 0; j < data.length-1; j++)
  {dict_word[dict_word_data[i].trim()][data[j].trim()] = 1;}
}

let study_time = { '0' : {}, '1' : {}, '2' : {}, '3' : {}, '4' : {}, '5' : {}, '6' : {} };
let send_time = {'year'  : 0, 'month' : 0, 'date'  : 0, 'hour'  : 0, 'minute': 0, 'second': 0, 'milsec': 0};

//TODO
let situation = {'who' : {}, 'what' : {}, 'when' : {}, 'where' : {}, 'how' : {}, 'why' : {} };
let emotion = {'happy' : false, 'sad' : false, 'upset' : false };

//일정 세팅
set_study(1, 13, 16);
set_study(2,  9, 11);
set_study(2, 14, 17);
set_study(2, 19, 20);
set_study(3, 11, 18);
set_study(3, 19, 20);
set_study(4,  9, 14);
set_study(5, 11, 12);
set_study(6, 12, 13);

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  DataBase.appendDataBase("testDB", msg + '\n');

  //auto setting
  set_now_time();
  set_send_time(now_year, now_month, now_date, now_hour, now_min, now_sec, now_milsec);

  //DANGEROUS TEST :: 단톡방으로 채팅이 갈 수 있으니 주의!!!
  //replier.reply(room + ' ' + sender)

  if (sender == master) // 내가 커맨드봇에게 메세지 보낸 경우
  {
    let msg_recv = msg.split(' ');
    if (msg_recv.length == 2 && msg_recv[1].trim() == "확인")
    {
      if (msg_recv[0] != "타이머")
      {
        if (msg_recv[0] == "모두")
        {
          var key = Object.keys(timer_set);
          for (var i in key)
          {timer_set[key[i]] = false;}
        }
        else
        {timer_set[msg_recv[0].trim()] = false;}
        replier.reply("타이머를 해제했습니다.");
      }
      var rest = "[타이머 목록]" + '\n';
      rest += show_value(timer_set);
      replier.reply(rest.trim());
    }
    else if (msg_recv == "야")
    {replier.reply("네?");}
    else if (msg_recv == "세션줘")
    {
      replier.reply("5초 뒤에 세션 드리겠습니다.");
      java.lang.Thread.sleep(1000*5);
      replier.reply("세션메세지");
    }
    else if (msg == "나 잔다")
    {
      sleep_start = now_hour;
      replier.reply("지금부터 " + sleep_end +"시 까지 취침시간으로 설정했습니다.");
    }
    else if (msg == "지금 일어났어")
    {
      sleep_end = now_hour;
      replier.reply(sleep_start + "시부터 지금까지 취침시간으로 설정하였습니다.");
    }
    else if (msg == "취침시간 초기화해줘")
    {
      sleep_end = 9;
      sleep_start = 0;
      replier.reply(sleep_start+ "시부터 " + sleep_end + "시까지 취침시간으로 초기화하였습니다.");
    }
    else
    {
      replier.reply("악!!")
      //replier.reply("[deic_word]\n"+show_value(dict_word))
      //replier.reply("[answer]\n"+show_value(dict_word['answer']))
      //replier.reply("[hello]\n"+show_value(dict_word['hello']))
      //replier.reply(show_value(user_meet));
      ///*
      //set_now_time();
      //replier.reply(show_value(send_time));
      //java.lang.Thread.sleep(1000*send_delay);
      //replier.reply(set_now_time());
      //replier.reply(now_hour + ' ' + now_min + ' ' + now_sec + ' '+ now_milsec);
      //*/
    }
  }
  else if (sender == manager)  // 관리자봇이 톡을 보낸경우 (세션확인용)
  {
    if (msg == "세션메세지")
    {
      if (Api.canReply(manager))
      {replier.reply("세션을 열었습니다.");}
      else
      {replier.reply("세션이 닫혀있습니다.");}
    }
  }

  else if (!isGroupChat && (sender != manager) &&(sender != "은주") ) // 본 계정으로 톡이 온 경우
  {
    if (!(room in timer_set))
    { timer_set[room] = false; }

    java.lang.Thread.sleep(1000*send_delay);

    if (set_now_time())
    {
      if (!(sender in user_meet))  /** 만난적 없는 사람의 경우, 인사말 추가 */
      {
        DataBase.appendDataBase("user_meet",sender+'\n');
        user_meet[sender] = 1;
        replier.reply(msg_introduce);
      }

      set_reply(msg)

      //test
      //replier.reply("testing");
      //replier.reply(file_name);
      //test

      if (check_sleep())
      {replier.reply(msg_sleep);}

      else if (check_study())
      {replier.reply(msg_study);}

      else  // free now
      {
        if (!timer_set[room])
        {
          timer_set[room] = true;
          //replier.reply("testing now");
          replier.reply(manager, room + " 에서 " + sender + " 에게 카톡이 왔습니다.");
          replier.reply(manager, "[타이머 현황]\n" + show_value(timer_set));
          java.lang.Thread.sleep(timer_time);
          if (timer_set[room])
          {
            replier.reply(msg_send);
            timer_set[room] = false;
          }
        }
      }
    }
  }
}

//function
function set_reply(recv_msg)
{
  msg_send = "일정시간 경과 후 자동응답 테스트 중입니다. :: 메세지를 수신 후 30분 경과했습니다.";
}

/* 오브젝트 내용을 key : value 쌍으로 만들어 문자열로 반환 */
function show_value(obj)
{
  var str = "";
  var key = Object.keys(obj);
  for (var a in key)
  {str += (key[a] + ' : ' + obj[key[a]] + '\n');}
  return str.trim();
}

/* 현재 시간을 저장, 현재 시간이 send_time 이후라면 true 반환 */
function set_now_time()
{
  date = new Date();
  now_year = date.getFullYear();
  now_month = date.getMonth();
  now_date = date.getDate();
  now_hour = date.getHours();
  now_min = date.getMinutes();
  now_sec = date.getSeconds();
  now_day = date.getDay();
  now_milsec = date.getMilliseconds();

  if (now_year > send_time['year'])
  {return true;}
  else if (now_month > send_time['month'])
  {return true;}
  else if (now_date > send_time['date'])
  {return true;}
  else if (now_hour > send_time['hour'])
  {return true;}
  else if (now_min > send_time['minute'])
  {
    if (now_hour < send_time['hour'])
    return true;
  }
  else if (now_sec > send_time['second'])
  {
    if (now_min < send_time['minute']) {return false;}
    else {return true;}
  }
  else if (now_milsec > send_time['milsec'])
  {
    if (now_sec < send_time['second']) {return false;}
    else {return true;}
  }
  else
  {return false;}
}

/* study_time 객체에 수업시간 저장 */
function set_study(day, start, end) {
  for (var i = start; i < end; i++)
  {study_time[day][i] = end;}
}

/* 현재 시간이 수업시간인지 체크 true / false 반환 */
function check_study() {
  if (now_hour in study_time[now_day])
  {
    msg_study = master + "님은 지금 수업중입니다." + '\n' + study_time[now_day][now_hour] + "시에 수업이 끝나니 그때 연락주시거나 메세지를 남겨주세요.";
    return true;
  }
  else
  {return false;}

}

/* 현재 시간이 수면시간인지 체크 true / false 반환 */
function check_sleep() {
  if (sleep_start > sleep_end)
  {
    if ((sleep_start <= now_hour && now_hour < 24) || (0 <= now_hour && sleep_end))
    {return true;}
    else
    {return false;}
  }
  else
  {
    if (sleep_start <= now_hour && now_hour < sleep_end)
    {return true;}
    else
    {return false;}
  }
}

/* 메세지를 수신했을 때, send_delay초 후의 시간을 send_time 객체에 저장
   현재 시간이 send_time 이후일 때만 메세지를 보내게 된다.
   즉, 메세지를 수신하고나서 send_delay초 이내로 메세지를 또 수신한 경우,
   마지막에 수신한 메세지에 대해서만 답장을 보낸다.
*/
function set_send_time(year, month, date, hour, min, sec, milsec)
{
  sec += send_delay;

  if (sec > 59)
  {
    sec %= 60;
    min += 1;
  }

  if (min > 59)
  {
    min %= 60;
    hour += 1;
  }

  if (hour > 23)
  {
    hour %= 24;
    date += 1;
  }

  if (month == 4 || month == 6 || month == 9 || month == 11) // to 30
  {
    if(date > 30)
    {
      date = 1;
      month += 1;
    }
  }
  else if(month == 2)
  {
    if ((year%4 == 0 && year%100 != 0) || year%400 == 0) // 윤년이면
    {
      if (date > 29)
      {
        date = 1;
        month += 1;
      }
    }
    else
    {
      if (date > 28)
      {
        date = 1;
        month += 1;
      }
    }
  }
  else
  {
    if (date >31)
    {
      date = 1;
      month += 1;
    }
  }

  if (month > 11)
  {
    month = 0;
    year += 1;
  }

  send_time['year'] = year;
  send_time['month'] = month;
  send_time['date'] = date;
  send_time['hour'] = hour;
  send_time['minute'] = min;
  send_time['second'] = sec;
  send_time['milsec'] = milsec;
}
