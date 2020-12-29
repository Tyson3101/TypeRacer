import getRandomWikiArticle from "./util/randomWords.js";
import { Socket } from "./util/interfaces";
//@ts-ignore
const socket: Socket = io();

socket.on("connection", (connection: boolean) => {
  console.log(`Socket IO Connected: ${connection}!`);
});

const button: HTMLButtonElement = document.createElement("button");

button.style.height = "100px";
button.style.width = "100px";

document.body.append(button);

button.addEventListener("click", async () => {
  const Wikipage = await getRandomWikiArticle();
  const textArea = document.querySelector(".start") as HTMLTextAreaElement;

  textArea.value = Wikipage.revision;
});
