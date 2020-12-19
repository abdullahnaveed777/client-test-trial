import React, {useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

function Home() {
  const { register, handleSubmit } = useForm();

  const [userData, setUserData] = useState({});

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUserData();
  }, []);

  const getUserData = () => {
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      setIsRedirect(true);
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      token: userToken,
    };
    axios
      .get("https://node-test-trial2.herokuapp.com/user/me", {
        headers,
      })
      .then((res) => {
        console.log({ res });
        setUserData(res?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(error?.response?.data?.message);
        setIsLoading(false);
      });
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      setIsRedirect(true);
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      token: userToken,
    };
    axios
      .put(`https://node-test-trial2.herokuapp.com/user/update-profile`, data, {
        headers,
      })
      .then((res) => {
        getUserData();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(error?.response?.data?.message);
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    getUserData();
  };

  if (isRedirect) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        // className="logout"
        style={{ position: "absolute", right: 20, top: 20 }}
      >
        Logout
      </Button>
      <div className="main">
        {!!isLoading && <CircularProgress color="secondary" />}
        {userData?.username && (
          <h1 className="person_name">{`Welcome, ${userData?.username}`}</h1>
        )}
        {!!isError && <Alert severity="error">{isError}</Alert>}
        {!!isEditable && (
          <Grid item xs={12} style={{margin: 15}}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="uname"
              name="username"
              autoComplete="username"
              defaultValue={userData.username}
              inputRef={register({ required: true })}
            />
          </Grid>
        )}
        {!!isEditable ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "10px" }}
            onClick={() => setIsEditable(true)}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
export default Home;
