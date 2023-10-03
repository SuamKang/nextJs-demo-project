import Layout from "../components/layout/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

// 렌더링 해주어야 하는 페이지는 3개
// 1. 밋업목록페이지 2. 특정 상세페이지 3.밋업 추가 페이지

// _app.js 파일을 유용하게 사용하는 법
// 애플리케이션 페이지 수가 많아지게 되면 내가 설정한 레이아웃 컴포넌트(Layout.js)를 페이지 혹은 컴포넌트 마다 일일이 적용해주어야하는 귀찮음이 존재하게 된다.
// 이 때, 이 _page.js파일이 아주 유용하게 쓰인다.

// _page.js는 최상위 컴포넌트같은 존재이다.
// nextJs가 자동으로 props 프로퍼티({Componet, pageProps})를 MyApp에 보내주게 된다. -> Component라는 특수 컴포넌트를 통해서 모든 렌더링 될 실제 페이지 컨텐츠를 저장하고 있는 프로퍼티로써 사용되며 페이지를 전환할때마다 그 컴포넌트로 변하게 된다. 그리고 pageProps는 변환되는 페이지들이 받는 특수 프로퍼티이고 이 또한 컴포넌트가 렌더링 될때 적용되어진다.
// 즉, _app.js파일의 Component 컴포넌트가 여러 페이지에 해당하는 실제 페이지 컨텐츠가 된다. 그렇기 때문에 이 컴포넌트를 Layout이나 원하는 컴포넌트 안에 넣어주면 되겠다.(그럼 일일이 다른페이지 컴포넌트에서 감싸줄 필요 X)
