const logout = document.getElementById("google_signout");
logout.addEventListener("click", async () => {
  const res = await fetch("https://chatnodejs-production-3e03.up.railway.app/api/v1/logout", {
    method: "Get",
  });
  console.log(res.ok, res.status);
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
});

function handleCredentialResponse(response) {
  //Google token
  //console.log("token : " + response.credential)
  const body = { id_token: response.credential };
  fetch("https://chatnodejs-production-3e03.up.railway.app/api/v1/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then(({ token, correo }) => {
      //console.log(token, correo);
      localStorage.setItem("token", token);
      localStorage.setItem("email", correo);
      window.location="socket.html";
    })
    .catch(console.warn);
}

const miFormulario = document.querySelector("form");

miFormulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {};
  for (const el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }
  fetch("https://chatnodejs-production-3e03.up.railway.app/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({errors, token, msg}) => {
      if(errors) return console.error(errors)
      localStorage.setItem("token", token)
      window.location="socket.html";
      //console.log(msg)
    })
    .catch((err) => console.log(err));
});
