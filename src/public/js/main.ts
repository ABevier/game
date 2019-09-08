import io from 'socket.io-client';

const socket = io();

console.log("HELLLLLLLLO WOOOOOOORLD!");

socket.on("message", (data: string) => {
    console.log(data);
});

function sendMsg() {
    socket.emit("message", "HELLO WORLD");
}