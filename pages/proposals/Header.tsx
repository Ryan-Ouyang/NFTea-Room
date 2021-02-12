import { AppBar, Toolbar, Typography } from "@material-ui/core";

export default function Header() {
  const displayDesktop = () => {
    return <Toolbar>{femmecubatorLogo}</Toolbar>;
  };

  const femmecubatorLogo = (
    <Typography
      variant="h6"
      component="h1"
      style={{
        margin: "auto",
      }}
    >
      Submit Price Suggestion
    </Typography>
  );

  return (
    <header
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        backgroundColor: "#CD5C5C",
      }}
    >
      <AppBar>{displayDesktop()}</AppBar>
    </header>
  );
}
