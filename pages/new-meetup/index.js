// www.domain.com/new-meetup
import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import Head from "next/head";

const NewMeetupPage = () => {
  const router = useRouter();

  const addMeetupHandler = async (newMeetupData) => {
    // nextJs 내부 api(/api/new-meetup)사용해서 해당 파일 http 함수 트리거 시키기
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(newMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    router.push("/"); // 글 추가 후 경로 이동
  };

  return (
    <>
      <Head>
        <title>New meetup page</title>
        <meta
          name="description"
          content="새로운 밋업을 추가할 수 있는 페이지 입니다."
        ></meta>
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </>
  );
};

export default NewMeetupPage;
