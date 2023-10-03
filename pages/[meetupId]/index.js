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
    fallback: false,
    // 경로 배열 동적 생성하기
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),

    // [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
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
      // {
      //   id: meetupId,
      //   title: "첫번째 밋업 입니다.",
      //   image:
      //     "https://cdn.pixabay.com/photo/2016/11/21/17/44/arches-national-park-1846759_1280.jpg",
      //   address: "미국 로스엔젤레스",
      //   desciprtion: "첫번째 밋업 장소입니다.",
      // },
    },
  };
}

// 정리 코멘트
// 이렇게 해서 디테일 페이지에서 보여줘야하는 단일 데이터들을 패칭해오는것까지 해봤다.
// 디테일 페이지는 코드가 활성화된 상태에서 서버에서 동적으로 사전 렌더링되고, db연결을 설정해서 데이터를 가져왔다.

export default DetailPage;

// "getStaticPaths"함수

// 이 함수는 nextJs안에 내장된 또다른 메소드이며 getStatic과 getServerSideProps함수를 사용하는게 아니라면, getStaticPaths함수를 추가해주어야한다.

// 이건 언제 사용할까?

// 페이지가 빌드 프로세스중에 프리 제너레이트 된다는건 nextJs가 동적페이지들의 모든 버전의 프리 제너리이트가 필요하다는 의미이다.
// 쉽게말해, 지원되는 모든 id(동적페이지)에서 서버로 부터 html를 제공받아야한다는 얘기이다.
// 그리고 이는 동적이기에 어떤 id값이 렌더링 되어야하는 페이지인지 알아야한다. 사용자가 url의 특정 id 페이지로 방문했을 때 그 값으로 렌더링 되는게 아니다. 빌드 프로세스에서 되는것이기때문에  모든 url에서 프리 제너레이트 해야한다.(모든 [meetupId]동적 페이지 경로에서)
// 그렇지 않은 상태에서 사용자가 방문하면 404에러를 접하게 된다.

// 따라서 이 문제를 해결하기 위해 "getStaticPaths"함수를 추가해 주어야하는 이유다.

// 이 함수는 모든 동적 id값이 있는 객채를 반환해준다. 그리고 그 객체안에는 "paths"라는 키가 있어야하고 동적 페이지 세그먼트가 객체형태로 여러개 있을것이기에 배열타입이 들어간다.

// ** getStaticPaths 코드 추가

// 그리고 각각 객체는 "params"키를 가지고 있고 키값 쌍의 형태이다.
// 만약 동적 페이지 세그먼트가 여러개라면 params 키가 포함된 id를 여러개 추가해 주면된다.

// ** 에러 사진 추가

// 하지만 이렇게 설정해도 폴백에러가 발생하는데, getStaticPaths함수 자체의 문제는 아니고 추가적인 설정이 필요하다.

// 바로 반환되는 객체의 또다른 필드로 "fallback"키를 추가해주어야한다.

// 이 키가 nextJs에게 paths 배열이 지원되는 모든 params 매개변수를 저장할지 아님 일부만 저장할지를 알려준다.
// false : 모든 id값을 paths에 포함해라 / true: 포함되지 않는 id값도 동적으로 생성되게 하라
// 즉 지원되는 파리미터만 생성해서 사용자에게 내가 지정해놓은 id값들로 접근할때만 페이지를 보여줄수 있게 하려면 false를 사용한다.

// false일 때, 만약 지원하지 않는 meetupId 값을 포함하게 되면 404에러를 발생시킨다.

// 따라서 이 "fallback" 프로퍼티는 특정 id값에 관해서 페이지 중 일부를 프리 제너레이트 하게끔 해준다는 점에서 매우 훌륭하다.

// fallback은 특정 paths를 정의할 때 사용한다고 이해하자.

// 따라서 이 "getStaticPaths"함수는 동적 페이지에서 필요한 함수이고, nextJs에게 어떤 동적 매개변수 밸류의 어떤 페이지가 프리 제너레이트되어야 하는지 알려주는 역할을 한다.
