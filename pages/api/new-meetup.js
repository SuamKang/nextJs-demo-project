import { MongoClient } from "mongodb";

// 요청을 받는 서버사이드 로직 함수(클라이언트에서는 확인할 수 없음)
// 이 함수가 몽고db 연결하면서 promise를 반환하므로 async await으로 설정
const handler = async (req, res) => {
  // req : 들어오는 요청에 관한 데이터 객체
  // res : 보내는 응답에 설정하는 객체

  if (req.method === "POST") {
    const data = req.body; // 요청 보낸 바디에서 데이터 추출

    const client = await MongoClient.connect(
      "mongodb+srv://SuamKang:Suamy1452@cluster0.p9kse3c.mongodb.net/meetups?retryWrites=true&w=majority"
    ); // 설정한 몽고db 연결(꺽쇠괄호 대신username과 password입력), 그리고 데이터베이스 이름도 변경 -> 'net/' 다음으로 오는 부분에 meetups지정
    const db = client.db(); // 현재 "meetups"에 연결중인 db확보(없다면 새로 생성됨)
    // collection(tables) > document(항목) : 객체형식 -> meetup은 여러 meetups중 하나의 document가 될것이다. => 여러개의 문서들이 모여 하나의 컬렉션이 구성됨

    const meetupsCollection = db.collection("meetups"); // 해당 이름으로 컬렉션 보관 -> meetup관련 데이터가 모인 문서들 컬렉션이 저장된다.

    const result = await meetupsCollection.insertOne(data); // 컬렉션에 새 문서(객체 하나)를 삽입하기 위한 query명령중 하나인 메소드
    console.log(result);

    client.close(); // db작업 후 연결 차단

    res.status(201).json({ message: "New Meetup inserted!" });
  }
};

export default handler;

// api 라우트 hanlder 로직 플로우
// 1. 요청들어오면 해당 api함수 트리거
// 2. 요청객체로 받은 data를 몽고db에 새로 저장
// 3. res객체로 응답 보내기
