const scriptName = "test";
const manager = "커맨드봇";
const master = "없음";
const bot_name = '버듀(가명)';

//var
let date;
let msg_send;
let msg_introduce = "안녕하세요! 저는 "+ master + "님의 봇 '" + bot_name + "' 입니다." + '\n' + "앞으로 " + master + "님이 답장하실 수 없을 때는 제가 대신 답장을 하니 너무 놀라지 말아주세요 :)";
let msg_sleep = "지금은 "+ master + "님이 자고 있습니다. 아침에 다시 연락해주세요.";
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
for (var i = 0; i < user_meet_data.length; i++)
{user_meet[user_meet_data[i].trim()] = 1;}

let study_time = { '0' : {}, '1' : {}, '2' : {}, '3' : {}, '4' : {}, '5' : {}, '6' : {} };
let send_time = {'year'  : 0, 'month' : 0, 'date'  : 0, 'hour'  : 0, 'minute': 0, 'second': 0, 'milsec': 0};
let situation = {'who' : {}, 'what' : {}, 'when' : {}, 'where' : {}, 'how' : {}, 'why' : {} }

//일정 세팅
set_study(1, 13, 16);
set_study(2, 9, 11);
set_study(2, 14, 17);
set_study(2, 19, 20);
set_study(3, 11, 18);
set_study(3, 19, 20);
set_study(4, 9, 14);
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
        timer_set[msg_recv[0].trim()] = false;
        replier.reply("타이머를 해제했습니다.");
      }
      var key = Object.keys(timer_set);
      var rest = "[타이머 목록]" + '\n';
      rest += show_value(timer_set);
      replier.reply(rest);
    }
    else if (msg_recv == "야")
    {replier.reply("네?");}
    else
    {
      replier.reply("확인하였습니다.")
      //replier.reply()
      //replier.reply(show_value(user_meet));
      //set_now_time();
      //replier.reply(show_value(send_time));
      //java.lang.Thread.sleep(1000*5);
      //replier.reply(set_now_time());
      //replier.reply(now_hour + ' ' + now_min + ' ' + now_sec + ' '+ now_milsec);
      //replier.reply(show_value(send_time));

    }
  }

  else if (!isGroupChat && (sender != "은주") && (sender != manager))  // 본 계정으로 톡이 온 경우
  {
    if (!(room in timer_set))
    { timer_set[room] = false; }

    java.lang.Thread.sleep(5000);

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
      //replier.reply(now_day + ' ' + now_hour + ' ' + study );
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
          replier.reply(manager,"[notice] " + room + " 에서 " + sender + " 에게 카톡이 왔습니다.");
          replier.reply(manager, show_value(timer_set));
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


function show_value(obj)
{
  var str = "";
  var key = Object.keys(obj);
  for (var a in key)
  {str += (key[a] + ' : ' + obj[key[a]] + '\n');}
  return str.trim();
}

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
  {return true;}
  else if (now_sec > send_time['second'])
  {return true;}
  else
  {
    if (now_sec < send_time['second'])
    {return false;}

    else if (now_milsec > send_time['milsec'])
    {return true;}

    else
    {return false;}
  }
}

function set_study(day, start, end) {
  for (var i = start; i < end; i++)
  {study_time[day][i] = end;}
}

function check_study() {
  if (now_hour in study_time[now_day])
  {
    msg_study = master + "님은 지금 수업중입니다." + '\n' + study_time[now_day][now_hour] + "시에 수업이 끝나니 그때 연락주세요.";
    return true;
  }
  else
  {return false;}

}

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
