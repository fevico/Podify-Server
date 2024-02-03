const getById = (id) => {
    return document.getElementById(id);
  };
  
  const password = getById("password");
  const confirmPassword = getById("confirm-password");
  const form = getById("form");
  const container = getById("container");
  const loader = getById("loader");
  const button = getById("submit");
  const error = getById("error");
  const success = getById("success");
  
  error.style.display = "none";
  success.style.display = "none";
  container.style.display = "none";
  
  let token, userId;
  const passRegx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/
  
  window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => {
        return searchParams.get(prop);
      },
    });
    token = params.token;
    userId = params.userId;
  
    const res = await fetch("/auth/verify-pass-reset-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        token,
        userId,
      }),
    });
  
    if (!res.ok) {
      const { error } = await res.json();
      loader.innerText = error;
      return;
    }
  
    loader.style.display = "none";
    container.style.display = "block";
  });

  const displayError = (errorMessage) =>{
    // first remove succes message 
    success.style.display = "none";
    error.innerText = errorMessage
    error.style.display = "block"
  }

  const displaySuccess = (successMessage) =>{
    // first remove error message 
    error.style.display = "none";
    success.innerText = successMessage
    success.style.display = "block"
  }

  const handleSubmit = async(evt) => {
    evt.preventDefault();
    // validate password
    if(!password.value.trim()){
        // render error 
       return displayError("Password is missing!")
    }

    if(!passRegx.test(password.value)){
        // render error 
       return displayError("Password is too simple, we use alpha numeric with special characters!");
    }
 
    if(password.value !== confirmPassword.value){
        // render error 
       return displayError("Password does not match!");
    }

    // handle submit 
    button.disabled = true;
    button.innerHTML = "Please wait..."
    const res = await fetch("/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          token,
          userId,
          password:password.value,
        }),
      });

      button.disabled = false; 
      button.innerHTML = "Reset password"
      
    if (!res.ok) {
        const { error } = await res.json();
      return displayError(error)
      }

    displaySuccess("Your password is updated succesfully!")
    password.value = "";
    confirmPassword.value ="";
  }

    
  form.addEventListener('submit', handleSubmit);