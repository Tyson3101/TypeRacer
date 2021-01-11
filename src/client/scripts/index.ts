import getRandomWikiArticle from "./util/randomWords.js";
import { Socket, WikiAriticle } from "./util/interfaces";
//@ts-ignore
const socket: Socket = io();

socket.on("connection", (connection: boolean) => {
  console.log(`Socket IO Connected: ${connection}!`);
});

const button: HTMLButtonElement = document.createElement("button");

button.style.height = "100px";
button.style.width = "100px";

document.body.append(button);

test();

button.addEventListener("click", async () => {
  console.log("Clicked!");
  let Wikipage: WikiAriticle;
  try {
    Wikipage = await getRandomWikiArticle();
    console.log(Wikipage);
    const textArea = document.querySelector(".start") as HTMLTextAreaElement;

    textArea.innerText = Wikipage.revision;
  } catch (e) {
    console.log(e);
  }
});

function test() {
  const wikiInfo = `Piece work U. S. A (or piecework) is any type of employment in which a worker is paid a fixed piece rate for each unit produced or destroyed. While they worked very hard. Some couldnt handle it. and some decieded it was enough. King Ja decied to go.`;
  const revision = wikiInfo.split(/(\w{2,}|\s+)[\.\:\?\!]/gm);
  const revisions: string[] = [];

  revision.forEach((string, i, arr) => {
    if (i % 2 === 0 && i !== arr.length - 1)
      revisions.push((string.trim() + ` ${arr[i + 1].trim()}` + ".").trim());
  });

  console.log(
    "-------------------------\n",
    revisions.join(" ").trim() + "\n",
    wikiInfo + "\n",
    "-------------------------"
  );

  console.log(
    "Revisions Array:",
    revisions,
    "\n",
    "Revisions Joined:",
    revisions.join(" ").trim(),
    "\n",
    "WikiInfo Raw:",
    wikiInfo,
    "\n",
    "\n",
    "\n",
    "Revisions compared to WikiInfo raw:" + revisions.join(" ").trim() ===
      wikiInfo.trim()
  );
  const textArea = document.querySelector(".start") as HTMLTextAreaElement;

  textArea.innerText = `${revisions.join(" ").trim()}\n${wikiInfo.trim()}`;
}
