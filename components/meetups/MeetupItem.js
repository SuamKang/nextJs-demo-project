import { useRouter } from "next/router";

import Card from "../ui/Card";

import classes from "./MeetupItem.module.css";

function MeetupItem(props) {
  const router = useRouter();

  const showHandler = () => {
    // router객체를 활용하여 탐색하고자하는 경로 push === Link컴포넌트와 활용 비슷함 => 프로그래밍적인 방법
    router.push(`/${props.id}`);
  };
  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showHandler}>Show Details</button>
        </div>
      </Card>
    </li>
  );
}

export default MeetupItem;
