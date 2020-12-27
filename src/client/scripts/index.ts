import madeRandomWords, {
  Socket,
  WikiAriticle,
} from "./util/madeRandomWords.js";
//@ts-ignore
const socket: Socket = io();
const LOCALSTORAGE_PREVWORDS = "TYPERACER_GAME_PREVWORDS";
const searchURL =
  "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=";
const contentURL =
  "https://en.wikipedia.org/w/api.php?action=query&&prop=extracts&exintro&explaintext&format=json&origin=*&titles=";

socket.on("connection", (connection: boolean) => {
  console.log(`Socket IO Connected: ${connection}!`);
});

let prevwords: WikiAriticle[] = (() => {
  if (!window.localStorage.getItem(LOCALSTORAGE_PREVWORDS))
    window.localStorage.setItem(LOCALSTORAGE_PREVWORDS, JSON.stringify([]));
  return JSON.parse(
    window.localStorage.getItem(LOCALSTORAGE_PREVWORDS) as string
  );
})();

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
    if (wikiLink == null) resolve(giveMadeWord());
    else {
      const wiki = wikiLink.trim().split("https://en.wikipedia.org/wiki/")[1];
      fetch(contentURL + wiki)
        .then((res) => res.json())
        .then((data) => {
          const pageNumber = Object.keys(data.query.pages)[0];
          const wikiInfo: { title: string; extract: string } =
            data.query.pages[pageNumber];
          let revision =
            wikiInfo.extract
              .split(".")
              .slice(0, 2)
              .map((str) => str.trim().normalize())
              .join(". ") + ".";
          console.log(wikiInfo.extract);
          let title = wikiInfo.title;
          if (!revision || revision === ".") {
            resolve(giveMadeWord());
          } else resolve({ revision, title });
        });
    }
  });
}

getRandomWikiArticle()
  .then(({ revision }) => console.log(revision, prevwords))
  .catch(console.error);

function giveMadeWord(): WikiAriticle {
  const randomWords = madeRandomWords;
  let randomWord: WikiAriticle | undefined;
  if (!prevwords[0]) {
    let word = randomWords[Math.floor(Math.random() * randomWords.length)];
    prevwords.push(word);
    window.localStorage.setItem(
      LOCALSTORAGE_PREVWORDS,
      JSON.stringify(prevwords)
    );
    prevwords = JSON.parse(
      window.localStorage.getItem(LOCALSTORAGE_PREVWORDS)!
    );
    return word;
  }
  if (prevwords.length === randomWords.length) prevwords.shift();
  if (
    randomWords.some(
      ({ title }) => !prevwords.map((s) => s.title).includes(title)
    )
  ) {
    randomWord = randomWords.find(
      ({ title }) => !prevwords.map((s) => s.title).includes(title)
    );
    randomWord && prevwords.push(randomWord);
  }
  window.localStorage.setItem(
    LOCALSTORAGE_PREVWORDS,
    JSON.stringify(prevwords)
  );
  prevwords = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREVWORDS)!);
  return randomWord as WikiAriticle;
}
