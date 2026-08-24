import { getTodayData, fetchUser } from "./utilities.js";

class Task {
  constructor() {
    this.user = JSON.parse(localStorage.getItem("user")) || {};

    this.allTasks = [];
    this.currentTask = null;
    this.selectedTask = null;
    this.selectedTaskForSession = null;

    this.taskTitle = document.querySelector(".title");
    this.estimatedSessions = document.querySelector(".pomo-input");

    this.addTaskButton = document.querySelector(".add-task-button");
    this.addTaskModal = document.querySelector(".add-task");

    this.addSessionBtn = document.querySelector(".addSession");
    this.subtractSessionBtn = document.querySelector(".subtractSession");

    this.saveBtn = document.querySelector(".save-task-btn");
    this.cancelBtn = document.querySelector(".cancel-btn");

    this.tasks = document.querySelector(".tasks");

    this.init();
  }

  async init() {
    await fetchUser();

    this.addEventListeners();
    await this.fetchTasks();
  }

  addEventListeners() {
    this.addTaskButton.addEventListener("click", () => {
      this.openAddTaskModal();
    });

    this.addSessionBtn.addEventListener("click", () => {
      this.increaseSession(this.estimatedSessions);
    });

    this.subtractSessionBtn.addEventListener("click", () => {
      this.decreaseSession(this.estimatedSessions);
    });

    this.saveBtn.addEventListener("click", async () => {
      await this.createTask();
    });

    this.cancelBtn.addEventListener("click", () => {
      this.cancelAddTask();
    });

    this.tasks.addEventListener("click", async (event) => {
      const editBtn = event.target.closest(".editTaskBtn");

      if (editBtn) {
        await this.openEditTask(editBtn);
        return;
      }

      const addEditSession = event.target.closest(".edit-add-session");

      if (addEditSession) {
        const editForm = addEditSession.closest(".edit-task");
        const input = editForm.querySelector(".edit-estimate");

        this.increaseSession(input);
        return;
      }

      const subtractEditSession = event.target.closest(
        ".edit-subtract-session",
      );

      if (subtractEditSession) {
        const editForm = subtractEditSession.closest(".edit-task");

        const input = editForm.querySelector(".edit-estimate");

        this.decreaseSession(input);
        return;
      }

      const cancelEdit = event.target.closest(".cancel-edit-btn");

      if (cancelEdit) {
        this.cancelEdit(cancelEdit);
        return;
      }

      const saveEdit = event.target.closest(".save-edit-btn");

      if (saveEdit) {
        await this.saveEdit(saveEdit);
        return;
      }

      const deleteBtn = event.target.closest(".delete-task-btn");

      if (deleteBtn) {
        await this.deleteTask();
        return;
      }

      const completeBtn = event.target.closest(".completeTask");

      if (completeBtn) {
        await this.toggleCompleteTask(completeBtn);
        return;
      }

      const taskCard = event.target.closest(".task-card");

      if (taskCard) {
        this.selectTask(taskCard);
      }
    });
  }

  openAddTaskModal() {
    document.querySelector(".edit-task")?.remove();

    this.addTaskModal.classList.remove("d-none");

    this.addTaskButton.classList.add("d-none");
  }

  async createTask() {
    const title = this.taskTitle.value.trim();

    const estimate = Number(this.estimatedSessions.value);

    if (!title) {
      alert("Please enter the title of the task!");
      return;
    }

    if (!estimate || estimate < 1) {
      alert("Estimate must be at least 1.");
      return;
    }

    const task = {
      title: title,

      estimate: estimate,

      createdOn: new Date().toISOString(),

      completed: 0,

      status: "pending",

      userId: this.user.id,
    };

    try {
      await fetch("http://localhost:3000/tasks", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(task),
      });

      this.resetAddTaskForm();

      await this.fetchTasks();
    } catch (error) {
      console.log(error);
    }
  }

  cancelAddTask() {
    this.resetAddTaskForm();
  }

  resetAddTaskForm() {
    this.taskTitle.value = "";

    this.estimatedSessions.value = 1;

    this.addTaskModal.classList.add("d-none");

    this.addTaskButton.classList.remove("d-none");
  }

  increaseSession(input) {
    input.value = Number(input.value) + 1;
  }

  decreaseSession(input) {
    if (Number(input.value) > 1) {
      input.value = Number(input.value) - 1;
    }
  }

  async fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks");

      let tasks = await response.json();

      this.allTasks = tasks.filter(
        (task) => String(task.userId) === String(this.user.id),
      );

      this.renderTasks();
    } catch (error) {
      console.log(error);
    }
  }

  renderTasks() {
    this.tasks.innerHTML = "";

    if (this.allTasks.length === 0) {
      this.tasks.innerHTML = `

                <div class="empty-tasks">

                    <p>No tasks yet</p>

                    <span>
                        Add a task and start focusing.
                    </span>

                </div>
            `;

      return;
    }

    this.allTasks.forEach((task) => {
      this.tasks.innerHTML += `

                <div
                    class="task-card ${
                      task.status === "completed" ? "selected" : ""
                    }"

                    data-id="${task.id}"

                    data-status="${task.status}"
                >

                    <div class="task-card-left">

                        <button
                            class="
                                task-check
                                completeTask
                                ${
                                  task.status === "completed"
                                    ? "btnSelected"
                                    : ""
                                }
                            "

                            data-id="${task.id}"

                            data-status="${task.status}"

                            type="button"
                        >

                            <i
                                class="
                                    fa-solid
                                    fa-check
                                    text-dark
                                    tick

                                    ${
                                      task.status === "completed"
                                        ? "fs-5 bg-none btnSelected"
                                        : ""
                                    }
                                "
                            ></i>

                        </button>


                        <div class="task-info">

                            <p
                                class="
                                    task-title
                                    ${
                                      task.status === "completed"
                                        ? "strike"
                                        : ""
                                    }
                                "
                            >
                                ${task.title}
                            </p>


                            <p
                                class="
                                    task-progress
                                    ${
                                      task.status === "completed"
                                        ? "strike"
                                        : ""
                                    }
                                "
                            >

                                ${task.completed ? task.completed : 0}

                                /

                                ${task.estimate}

                                sessions

                            </p>

                        </div>

                    </div>


                    <button
                        class="task-options editTaskBtn"

                        data-id="${task.id}"

                        type="button"
                    >

                        <i
                            class="
                                fa-solid
                                fa-ellipsis-vertical
                                text-dark
                            "
                        ></i>

                    </button>

                </div>
            `;
    });
  }

  async openEditTask(editBtn) {
    this.currentTask = editBtn.dataset.id;

    const task = this.allTasks.find(
      (task) => String(task.id) === String(this.currentTask),
    );

    if (!task) return;

    document.querySelector(".edit-task")?.remove();

    this.addTaskModal.classList.add("d-none");

    this.addTaskButton.classList.remove("d-none");

    const editForm = document.createElement("div");

    editForm.classList.add("add-task", "edit-task");

    editForm.innerHTML = `

            <input
                type="text"

                class="title edit-title"

                value="${task.title}"

                placeholder="What are you working on?"
            >


            <p class="session-label">
                Estimate sessions
            </p>


            <div class="session-controls">

                <input
                    type="number"

                    class="pomo-input edit-estimate"

                    value="${task.estimate}"

                    min="1"
                >


                <button
                    class="edit-subtract-session"
                    type="button"
                >
                    −
                </button>


                <button
                    class="edit-add-session"
                    type="button"
                >
                    +
                </button>

            </div>


            <div class="add-task-footer">

                <div class="edit-task-footer">

                    <button
                        class="delete-task-btn"
                        type="button"
                    >
                        Delete
                    </button>


                    <div class="edit-actions">

                        <button
                            class="cancel-edit-btn"
                            type="button"
                        >
                            Cancel
                        </button>


                        <button
                            class="save-edit-btn"
                            type="button"
                        >
                            Save
                        </button>

                    </div>

                </div>

            </div>
        `;

    const taskCard = editBtn.closest(".task-card");

    taskCard.after(editForm);

    editForm.scrollIntoView({
      behavior: "smooth",

      block: "nearest",
    });
  }

  async saveEdit(saveBtn) {
    const editForm = saveBtn.closest(".edit-task");

    const title = editForm.querySelector(".edit-title").value.trim();

    const estimate = Number(editForm.querySelector(".edit-estimate").value);

    if (!title) {
      alert("Please enter the task title!");

      return;
    }

    if (!estimate || estimate < 1) {
      alert("Estimate must be at least 1.");

      return;
    }

    try {
      await fetch(
        `http://localhost:3000/tasks/${this.currentTask}`,

        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: title,

            estimate: estimate,
          }),
        },
      );

      this.currentTask = null;

      await this.fetchTasks();
    } catch (error) {
      console.log(error);
    }
  }

  cancelEdit(cancelBtn) {
    cancelBtn.closest(".edit-task").remove();

    this.currentTask = null;
  }

  async deleteTask() {
    const result = await Swal.fire({
      title: "Are you sure?",

      text: "Do you want to delete this task!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#3085d6",

      cancelButtonColor: "#d33",

      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await fetch(
        `http://localhost:3000/tasks/${this.currentTask}`,

        {
          method: "DELETE",
        },
      );

      this.currentTask = null;

      await this.fetchTasks();

      await Swal.fire({
        title: "Deleted!",

        text: "Your Task has been deleted.",

        icon: "success",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async toggleCompleteTask(button) {
    const taskId = button.dataset.id;

    const taskCard = button.closest(".task-card");

    const icon = button.querySelector(".tick");

    const title = taskCard.querySelector(".task-title");

    const progress = taskCard.querySelector(".task-progress");

    const userResponse = await fetch(
      `http://localhost:3000/users/${this.user.id}`,
    );

    const user = await userResponse.json();

    const todayData = getTodayData(user);

    const isCompleted = button.dataset.status === "completed";

    if (isCompleted) {
      taskCard.classList.remove("selected");

      button.classList.remove("btnSelected");

      icon.classList.remove("btnSelected", "bg-none", "fs-5");

      icon.classList.add("text-dark");

      title.classList.remove("strike");

      progress.classList.remove("strike");

      button.dataset.status = "pending";

      user.completedTasks = Math.max(0, (user.completedTasks || 0) - 1);

      todayData.completedTasks = Math.max(
        0,
        (todayData.completedTasks || 0) - 1,
      );

      await this.updateTaskStatus(taskId, "pending");
    } else {
      taskCard.classList.add("selected");

      button.classList.add("btnSelected");

      button.dataset.status = "completed";

      icon.classList.add("btnSelected", "bg-none", "fs-5");

      icon.classList.remove("text-dark");

      title.classList.add("strike");

      progress.classList.add("strike");

      user.completedTasks = (user.completedTasks || 0) + 1;

      todayData.completedTasks = (todayData.completedTasks || 0) + 1;

      await this.updateTaskStatus(taskId, "completed");
    }

    await this.updateUserStats(user);
  }

  async updateTaskStatus(taskId, status) {
    await fetch(
      `http://localhost:3000/tasks/${taskId}`,

      {
        method: "PATCH",

        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify({
          status: status,
        }),
      },
    );
  }

  async updateUserStats(user) {
    await fetch(
      `http://localhost:3000/users/${user.id}`,

      {
        method: "PATCH",

        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify({
          completedTasks: user.completedTasks,

          heatmapData: user.heatmapData,
        }),
      },
    );
  }

  selectTask(taskCard) {
    this.selectedTaskForSession = taskCard.dataset.id;

    this.tasks.querySelectorAll(".task-card").forEach((task) => {
      task.classList.remove("task-selected");
    });

    taskCard.classList.add("task-selected");

    localStorage.setItem("selectedTask", this.selectedTaskForSession);
  }

  completeTask(taskData) {
    this.tasks.querySelectorAll(".task-card").forEach((task) => {
      if (task.dataset.id == taskData.id) {
        task.classList.add("selected");
      }
    });
  }
}

const taskManager = new Task();
