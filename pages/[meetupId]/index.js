import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

import { MongoClient, ObjectId } from "mongodb";

const DetailPage = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetup.title}</title>
        <meta name="description" content={props.meetup.description}></meta>
      </Head>
      <MeetupDetail
        image={props.meetup.image}
        title={props.meetup.title}
        address={props.meetup.address}
        description={props.meetup.description}
      />
    </>
  );
};

// 동적 세그먼트 라우터 경로 설정하기
export async function getStaticPaths() {
  // 동적 경로 설정을 위해 몽고db 접근하여 id값만 추출해 오는 작업 로직 만들기
  const client = await MongoClient.connect(
    "mongodb+srv://SuamKang:Suamy1452@cluster0.p9kse3c.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // find메소드로 컬렉션에서 모든 meetups 데이터들의 id값만 추출하기 위해서 find메소드 첫번째 매개변수에 빈객체로 모든 객체들을 가지고 오고, 두번째 매개변수에 추출되어야하는 필드 설정을 객체 값으로 해줄 수 있다. -> _id:1은 id값만 필드에 포함되고 다른것은 포함되지 않은 상태로 가져오게 한다는 의미이다
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    // 경로 배열 동적 생성하기
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

// SSG 데이터 패칭
export async function getStaticProps(context) {
  // getStaticProps에선 매개변수로 주어진 context에 요청객체 응답객체에 접근하는것이 아닌 params에 접근한다.
  // []안에 들어간 식별자 이름이 id로 접근할 수 있다.
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://SuamKang:Suamy1452@cluster0.p9kse3c.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // 단일 meetup데이터 추출 -> findOne메소드를 사용해서 id값으로 구분되서 검색하게 필드 구성하여 전달해준다. -> 접근해야하는 id는 context의 파라미터 매개변수로 전달된 id값이다.
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  }); // 현재 비교해야할 meetupId가 문자열인 파라미터이기 때문에 몽고db에 저장된 객체형태로 비교하기 위해 ObjectId메소드를 활용해서 래핑 해주도록 해야한다. -> 그리고 나서 추후 리턴해주는 객체값안에 props로 전달할때는 반대로 직렬화 가능 값으로 변형도 해야한다는 점 잊으면 안된다!

  client.close();

  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default DetailPage;
