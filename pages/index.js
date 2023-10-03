import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

import { MongoClient } from "mongodb";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>수암이의 NextJs 모뎀 프로젝트</title>
        <meta
          name="description"
          content="밋업 커뮤니티를 위한 훌륭한 웹 서비스 입니다."
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// 정적 사이트(SSG) 데이터 패칭
export async function getStaticProps() {
  // 더미 meetups데이터 대신 몽고db에 있는 데이터 패칭해오기

  // 바로 몽고db 접근
  const client = await MongoClient.connect(
    "mongodb+srv://SuamKang:Suamy1452@cluster0.p9kse3c.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // find메소드로 컬렉션에서 모든 문서 찾기
  const meetups = await meetupsCollection.find().toArray(); // 해당 데이터 문서를 배열로 받는 방법

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(), // id 직렬화
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
      })),
    },
    revalidate: 1,
  };
}

// // 서버 사이드 렌더링(SSR) 데이터 패칭
// export async function getServerSideProps(context) {
//   const request = context.req;
//   // const response = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
