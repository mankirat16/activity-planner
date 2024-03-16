const btn = document.getElementById("btn");
const list = document.getElementById("list");
const input = document.getElementById("input");
input.addEventListener("keydown", (e) => {
  console.log(input.value);
  if (e.key === "Enter") {
    const task = {
      text: input.value,
      id: Date.now(),
    };
    addTask(task);
  }
});

function addTask(task) {
  const container = document.createElement("div");
  container.setAttribute("id", "container");
  const li = document.createElement("li");
  li.setAttribute("id", "li");
  li.innerHTML = task.text;
  const checkbox = document.createElement("input");
  checkbox.setAttribute("id", "checkbox");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      li.style.textDecoration = "line-through";
    } else {
      li.style.textDecoration = "none";
    }
  });
  container.appendChild(li);
  container.appendChild(checkbox);

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("id", "deleteBtn");
  deleteBtn.innerHTML = "X";
  container.appendChild(deleteBtn);
  const updatebtn = document.createElement("button");
  updatebtn.innerHTML = "Update";
  updatebtn.addEventListener("click", () => {
    let promptText = prompt("Enter your updated text here ");
    task.text = promptText;
    if (promptText != null) {
      li.innerText = promptText;
    }
    fetch("http://localhost:6090/updateTask", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("error occured");
          return;
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  container.appendChild(updatebtn);
  deleteBtn.addEventListener("click", () => {
    fetch("http://localhost:6090/delTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("an error occured from server");
          return;
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    container.remove();
  });
  list.appendChild(container);
  input.value = "";
}
btn.addEventListener("click", () => {
  const task = {
    text: input.value,
    id: Date.now(),
  };
  if (task.text === "") {
    return;
  }
  addTask(task);
  fetch("http://localhost:6090/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
    .then((response) => {
      if (!response.ok) {
        return;
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
function addFromServer() {
  fetch("http://localhost:6090/getTasks", {
    method: "GET",
    headers: { "Content-Type": "text/plain" },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("An error occured while fetching tasks from server");
        return;
      }
      return response.text();
    })
    .then((tasks) => {
      let allTasks = JSON.parse(tasks);
      allTasks.forEach((task) => {
        addTask(task);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
addFromServer();
