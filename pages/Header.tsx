import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
export default function Header(props) {
  const router = useRouter();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button
            onClick={() => {
              router.push("/");
            }}
          >
            <Typography variant="h6" style={{ color: "white" }}>
              {props.name}
            </Typography>
          </Button>
          <div className="flex-grow"></div>
          <Typography style={{ marginRight: "175px" }} variant="h6">
            {props.title}
          </Typography>
          <div className="flex-grow"></div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
