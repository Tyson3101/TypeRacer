import madeRandomWords, {
  Socket,
  WikiAriticle,
} from "./util/madeRandomWords.js";
//@ts-ignore
const socket: Socket = io();
const searchURL =
  "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=";
const contentURL =
  "https://en.wikipedia.org/w/api.php?action=query&&prop=extracts&exintro&explaintext&format=json&origin=*&titles=";

socket.on("connection", (connection: boolean) => {
  console.log(`Socket IO Connected: ${connection}!`);
});

const button: HTMLButtonElement = document.createElement("button");

document.body.appendChild(button);

button.addEventListener("click", (e) => {
  e.preventDefault();
  const textAreas: HTMLCollection | undefined = document.querySelector(".game")
    ?.children;
});

async function getRandomWikiArticle(): Promise<WikiAriticle> {
  const randomWords: string[] = await fetch(
    "https://random-word-api.herokuapp.com/word?number=30&swear=0"
  ).then((res) => res.json() as Promise<string[]>);

  let sentence: string | undefined;
  for await (let word of randomWords) {
    const data: string[][] = await fetch(searchURL + word).then((res) =>
      res.json()
    );
    if (!data[2].length || !data[3].length) {
      continue;
    } else {
      sentence = data[3][Math.floor(Math.random() * data[3].length)];
      break;
    }
  }

  return getRandomSentence(sentence ?? null);
}

function getRandomSentence(wikiLink: string | null): Promise<WikiAriticle> {
  return new Promise((resolve, reject) => {
    if (wikiLink == null)
      resolve({
        revision:
          madeRandomWords[Math.floor(Math.random() * madeRandomWords.length)]
            .revision,
        title:
          madeRandomWords[Math.floor(Math.random() * madeRandomWords.length)]
            .title,
      });
    else {
      const wiki = wikiLink.trim().split("https://en.wikipedia.org/wiki/")[1];
      fetch(contentURL + wiki)
        .then((res) => res.json())
        .then((data) => {
          const pageNumber = Object.keys(data.query.pages)[0];
          const wikiInfo: { title: string; extract: string } =
            data.query.pages[pageNumber];
          let splited = wikiInfo.extract
            .split(/ +/g)
            .join(" ")
            .split(/\.( |\n)+?/g)
            .slice(0, 1);
          if (!splited[0] || splited[0] === ".")
            splited = wikiInfo.extract
              .split(/ +/g)
              .join(" ")
              .split(/\.( |\n|.)+/g)
              .slice(0, 2);
          const revision = splited[0] && splited[0].replace(".", "") + ".";
          let title = wikiInfo.title;
          if (!revision) {
            resolve({
              revision:
                madeRandomWords[
                  Math.floor(Math.random() * madeRandomWords.length)
                ].revision,
              title:
                madeRandomWords[
                  Math.floor(Math.random() * madeRandomWords.length)
                ].title,
            });
          } else resolve({ revision, title });
        });
    }
  });
}

getRandomWikiArticle()
  .then(({ revision }) => console.log(revision))
  .catch(console.error);
