const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUsers = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId))
    users.push({ userId, socketId });
};

const removeUsers = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // console.log("A user Connected...");
  socket.on("addUser", (userId) => {
    addUsers(userId, socket.id);
    io.emit("getUsers", users);
  });

  //get and send msges

  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    // console.log(users);
    const user = getUser(recieverId);
    // console.log(text);
    io.to(user?.socketId).emit("getMessage", { senderId, text });
  });

  // socket.emit("getUsers", users);
  socket.on("disconnect", () => {
    removeUsers(socket.id);
    io.emit("getUsers", users);
    console.log("A user disconnected");
  });
});
