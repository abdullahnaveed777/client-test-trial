import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import MatLink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn() {
  const classes = useStyles();
  const { register, errors, handleSubmit } = useForm();

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (values) => {
    setIsLoading(true);
    axios
      .post(`https://node-test-trial2.herokuapp.com/user/login`, values)
      .then((res) => {
        localStorage.setItem("user_token", res?.data?.token);
        setIsLoading(false);
        setIsSuccess(true);
      })
      .catch((error) => {
        setIsError(error?.response?.data?.message);
        setIsLoading(false);
      });
  };

  if (isSuccess) {
    return <Redirect to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {!!isError && <Alert severity="error">{isError}</Alert>}
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={register({
              required: true,
              pattern: {
                message: "Please enter valid email",
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              },
            })}
          />
          {!!errors?.email?.message && (
            <h1 className="error_message">{errors?.email?.message}</h1>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register({ required: true })}
          />
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {`${isLoading ? "Signing In..." : "Sign In"}`}
          </Button>
          <Grid container>
            <Link to="/sign-up">
              <MatLink variant="body2">
                {"Don't have an account? Sign Up"}
              </MatLink>
            </Link>
          </Grid>
        </form>
      </div>
      <Box mt={8}></Box>
    </Container>
  );
}
export default SignIn;
