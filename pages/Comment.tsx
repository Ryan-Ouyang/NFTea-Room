import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export interface CommentProps {
  identity: string;
  content: string;
}

function Comment({ identity, content }: CommentProps) {
  const classes = useStyles();

  return (
    <Box>
      <Card
        className={classes.root}
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          width: "100%",
        }}
        variant="outlined"
      >
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {identity}
          </Typography>
          <Typography variant="body2" component="p">
            {content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Comment;
