/*const madeRandomWords = [
  "Melbourne is the coastal capital of the southeastern Australian state of Victoria. At the city's centre is the modern Federation Square development, with plazas, bars, and restaurants by the Yarra River. In the Southbank area, the Melbourne Arts Precinct is the site of Arts Centre Melbourne – a performing arts complex – and the National Gallery of Victoria, with Australian and indigenous art.",
];
*/

export interface WikiAriticle {
  title: string;
  revision: string;
}

export interface Socket {
  connected: boolean;
  disconnected: boolean;
  on: (EventName: string, CallBack: Function) => void;
  off: (EventName: string, CallBack: Function) => void;
  emit: (EventName: string, ...args: any) => void;
}

const madeRandomWords: WikiAriticle[] = [
  {
    title: "Steam",
    revision:
      "Steam is a video game digital distribution service by Valve. It was launched as a standalone software client in September 2003 as a way for Valve to provide automatic updates for their games, and expanded to include games from third-party publishers.",
  },
  {
    title: "Fortnite",
    revision:
      "Fortnite is an online video game developed by Epic Games and released in 2017. It is available in three distinct game mode versions that otherwise share the same general gameplay and game engine",
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
];
export default madeRandomWords;
