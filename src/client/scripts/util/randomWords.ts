import { WikiAriticle } from "./interfaces";

const searchURL =
  "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=";
const contentURL =
  "https://en.wikipedia.org/w/api.php?action=query&&prop=extracts&exintro&explaintext&format=json&origin=*&titles=";

const LOCALSTORAGE_PREVWORDS = "TYPERACER_GAME_PREVWORDS";
let prevwords: WikiAriticle[] = (() => {
  if (!window.localStorage.getItem(LOCALSTORAGE_PREVWORDS))
    window.localStorage.setItem(LOCALSTORAGE_PREVWORDS, JSON.stringify([]));
  return JSON.parse(
    window.localStorage.getItem(LOCALSTORAGE_PREVWORDS) as string
  );
})();

export const madeRandomWords: WikiAriticle[] = [
  {
    title: "Steam",
    revision:
      "Steam is a video game digital distribution service by Valve. It was launched as a standalone software client in September 2003 as a way for Valve to provide automatic updates for their games, and expanded to include games from third-party publishers.",
  },
  {
    title: "Fortnite",
    revision:
      "Fortnite is an online video game developed by Epic Games and released in 2017. It is available in three distinct game mode versions that otherwise share the same general gameplay and game engine.",
  },
  {
    title: "Apple",
    revision:
      "Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops and sells consumer electronics, computer software, and online services.",
  },
  {
    title: "Rocket League",
    revision:
      "Rocket League is a vehicular soccer video game developed and published by Psyonix. The game was first released for Microsoft Windows and PlayStation 4 in July 2015, with ports for Xbox One and Nintendo Switch being released later on.",
  },
  {
    title: "Microsoft",
    revision:
      "Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
  },
  {
    title: "Minecraft",
    revision:
      'Minecraft is a sandbox video game developed by Mojang. The game was created by Markus "Notch" Persson in the Java programming language.',
  },
  {
    title: "Australia",
    revision:
      "Australia, officially the Commonwealth of Australia, is a sovereign country comprising the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands. It is the largest country in Oceania and the world's sixth-largest country by total area.",
  },
  {
    title: "Melbourne",
    revision:
      "Melbourne is the coastal capital of the southeastern Australian state of Victoria. At the city's centre is the modern Federation Square development, with plazas, bars, and restaurants by the Yarra River. In the Southbank area, the Melbourne Arts Precinct is the site of Arts Centre Melbourne – a performing arts complex – and the National Gallery of Victoria, with Australian and indigenous art.",
  },
  {
    title: "JavaScript",
    revision:
      "JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.",
  },
  {
    title: "HTML",
    revision:
      "Hypertext Markup Language is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets and scripting languages such as JavaScript.",
  },
  {
    title: "CSS",
    revision:
      "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.",
  },
  {
    title: "Python",
    revision:
      "Python is an interpreted, high-level and general-purpose programming language. Python's design philosophy emphasizes code readability with its notable use of significant whitespace.",
  },
  {
    title: "YouTube",
    revision:
      "YouTube is an American online video-sharing platform headquartered in San Bruno, California. Three former PayPal employees—Chad Hurley, Steve Chen, and Jawed Karim—created the service in February 2005. Google bought the site in November 2006 for US$1.65 billion; YouTube now operates as one of Google's subsidiaries.",
  },
  {
    title: "Vevo LLC",
    revision: `VEVO LLC distributes music videos and entertainment services. The Company, through its proprietary website "VEVO.com", offers music videos, behind the scenes footage, live performances and interviews with artists. VEVO LLC is a subscription based service that is accessible globally by customers.`,
  },
  {
    title: "PayPal",
    revision:
      "PayPal Holdings, Inc. is an American company operating an online payments system in majority of countries that supports online money transfers and serves as an electronic alternative to traditional paper methods like checks and money orders",
  },
  {
    title: "Discord",
    revision:
      'Discord is an American VoIP, instant messaging and digital distribution platform designed for creating communities. Users communicate with voice calls, video calls, text messaging, media and files in private chats or as part of communities called "servers."',
  },
  {
    title: "Roblox",
    revision:
      "Roblox is an online game platform and game creation system that allows users to program games and play games created by other users. Founded by David Baszucki and Erik Cassel in 2004 and released in 2006, the platform hosts user-created games of multiple genres coded in the programming language Lua.",
  },
];
export default async function getRandomWikiArticle(): Promise<WikiAriticle> {
  const randomWords: string[] = await fetch(
    "https://random-word-api.herokuapp.com/word?number=30&swear=0"
  ).then((res) => res.json() as Promise<string[]>);

  let sentence: string[] = [];
  for await (let word of randomWords) {
    const data: string[][] = await fetch(searchURL + word).then((res) =>
      res.json()
    );
    if (!data[2].length || !data[3].length) {
      continue;
    } else {
      data[3].forEach((wiki) => sentence.push(wiki));
      break;
    }
  }

  return getRandomSentence(sentence.length ? sentence : null);
}

export function getRandomSentence(
  wikiLinks: string[] | null
): Promise<WikiAriticle> {
  return new Promise((resolve, _reject) => {
    if (wikiLinks == null) resolve(giveMadeWord());
    else {
      wikiLinks.forEach(async (wikiLink) => {
        const wiki = wikiLink.trim().split("https://en.wikipedia.org/wiki/")[1];
        const data = await fetch(contentURL + wiki).then((res) => res.json());
        const pageNumber = Object.keys(data.query.pages)[0];
        const wikiInfo: { title: string; extract: string } =
          data.query.pages[pageNumber];
        const revisionRAW = wikiInfo.extract.split(/(\w{2,}|\s+)[\.\:\?\!]/gm);
        const revisions: string[] = [];

        revisionRAW.forEach((string, i, arr) => {
          if (i % 2 === 0 && i !== arr.length - 1)
            revisions.push(
              (string.trim() + ` ${arr[i + 1].trim()}` + ".").trim()
            );
        });
        const revision = revisions.join(" ").trim();
        if (!revision) return;
        if (
          revision.match(/[^\x00-\x7F]/g) ||
          revision.length < 100 ||
          revision.length > 427
        )
          return;
        let title = wikiInfo.title;
        if (!revision || revision === ".") {
          resolve(giveMadeWord());
        } else resolve({ revision, title });
      });
    }
  });
}

export function giveMadeWord(): WikiAriticle {
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
