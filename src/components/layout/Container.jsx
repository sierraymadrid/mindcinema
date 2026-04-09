function Container({ children, className = "" }) {
  const classes = ["mx-auto w-full max-w-6xl px-6 sm:px-10", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

export default Container;
