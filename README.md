# kakao_talk_bot
## TODO 리스트
### situation 객체
####
- 대화 상황 판단 변수
- 보통 잡답은 '사건'과 '반응'으로 이루어진다.
> Ex) 오늘 서울에서 시위를 했대 => 누가 = ?, 무엇을 = 시위를, 언제 = 오늘, 어디서 = 서울에서, 어떻게 = (시위를)하다, 왜 = ?
>   - 여기에서 나올 수 있는 반응은 적어도 2가지다. (상황 객체의 속성중 비어있는 값)
>   - 누가했는데? / 왜 했는데?
- 이런 식으로 봇과 자연스러운 잡담을 나눌 때 상황을 판단하는데 쓰일 변수이다. (TODO)
- 정확히 어디서 했는데? 정확히 어떤 시위였는데? 와 같은 정보의 구체화 요구는 "시위", "서울" 이라는 단어에 하위 속성을 부여해서 하위 속성이 비어있을 경우 반응이 나올 수 있도록한다.

### emotion 객체
- 봇의 감정상태에 따라 말투, 반응이 달라질 수 있도록 한다. (TODO)
- 봇이 공감능력을 가질 수 있도록 역지사지에 대입하는 용도의 감정객체를 별도로 만든다. (TODO)

### intent 객체
- 분석한 문장 성분을 토대로 발화 의도 체크

## 진행된 것
### kakao_link_test
- 카카오링크 자동 전송 모듈을 활용하여 상대방에게 카카오링크를 전송.
- 테스트로 http://ncov.mohw.go.kr/ 의 코로나현황을 크롤링하여 카카오링크로 전송하는 기능을 넣음.

### sentence 객체
- 조사를 활용하여 분석한 문장성분을 sentence 객체에 넣음
