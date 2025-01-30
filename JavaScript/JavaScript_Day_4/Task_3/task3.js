const spinnerContainer = document.getElementById("spinner-container");
const response = document.getElementById("response");
const methodDropDown = document.getElementById("method");
methodDropDown.addEventListener("change", () => {
  const method = methodDropDown.value;
  response.innerHTML = "";
  if (method == "POST" || method == "PATCH" || method == "PUT") {
    document.getElementById("box").style.display = "block";
  } else {
    document.getElementById("box").style.display = "none";
  }
});

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  response.innerHTML = "";
  spinnerContainer.style.display = "flex";
  const url = document.getElementById("url").value;
  const method = document.getElementById("method").value;
  const body = document.getElementById("body").value;
  const header = document.getElementById("header").value;

  if (method == "POST" || method == "PATCH" || method == "PUT") {
    if (!body) {
      response.innerHTML = "Body is required for POST, PATCH and PUT methods.";
      return;
    }
  }
  let data,headers;
  try {
    data = body ? JSON.parse(body) : null;
    headers = header ? JSON.parse(header) : {};
  } catch (error) {
    document.getElementById("response").innerHTML =
      "Invalid JSON format in body or headers.";
    spinnerContainer.style.display = "none";
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  for (const key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }

  xhr.onload = async function () {
    const responseContainer = document.getElementById("response");
    const statusCode = xhr.status;

    let responseText = `Status Code: ${statusCode}\n`;

    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const jsonResponse = JSON.parse(xhr.responseText);
        responseText += JSON.stringify(jsonResponse, null, 2);
      } catch (error) {
        responseText += xhr.responseText;
      }
    } else {
      responseText += `Error: ${xhr.status}`;
    }

    responseContainer.innerHTML = `<pre>${responseText}</pre>`;
    spinnerContainer.style.display = "none";
  };

  xhr.onerror = function () {
    document.getElementById("response").innerHTML = "Request failed!!";
    spinnerContainer.style.display = "none";
  };
  xhr.send(JSON.stringify(data));
});
