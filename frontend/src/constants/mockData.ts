import Locker from "../types/locker.type";
import Link from "../types/link.type";

export function generateUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString()
  );
}

export function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

const useMockData = true;
const useMockUser = false;
const mockUserUUID = generateRandomNumber();

const mockLockers: Array<Locker> = [
  {
    id: generateRandomNumber(),
    uid: mockUserUUID,
    name: "Search Engines",
    locked: false,
  },
  {
    id: generateRandomNumber(),
    uid: mockUserUUID,
    name: "Dumb Engines",
    locked: false,
  },
];

const mockLinks: { [k: number]: Array<Link> } = {
  [mockLockers[0].id]: [
    {
      id: generateRandomNumber(),
      url: "https://www.google.com",
      name: "Google",
      tags: ["search", "faang"],
    },
    {
      id: generateRandomNumber(),
      url: "https://www.reddit.com",
      name: "Reddit",
      tags: ["reddit", "good-google"],
    },
    {
      id: generateRandomNumber(),
      url: "https://www.google.com",
      name: "Evil Google",
      tags: ["search", "faang"],
    },
    {
      id: generateRandomNumber(),
      url: "https://www.reddit.com",
      name: "Evil Reddit",
      tags: ["evil-reddit", "evil-good-google"],
    },
    {
      id: generateRandomNumber(),
      url: "https://github.com",
      name: "GitHub",
      tags: [
        "code",
        "git",
        "not-mercurial",
        "prs",
        "how-to-undo-pushed-commit",
        "green-checkers",
      ],
    },
  ],
  [mockLockers[1].id]: [
    {
      id: generateRandomNumber(),
      url: "https://www.bing.com",
      name: "Bing!",
      tags: ["bing", "wallpapers"],
    },
    {
      id: generateRandomNumber(),
      url: "https://www.x.com",
      name: "Twitter",
      tags: ["never-x", "tweets", "twitter"],
    },
  ],
};

const mockLockedLockers: Array<Locker> = [
  {
    id: generateRandomNumber(),
    uid: mockUserUUID,
    name: "Gifts",
    locked: true,
    combination: "1234",
  },
  {
    id: generateRandomNumber(),
    uid: mockUserUUID,
    name: "Non-Gifts",
    locked: true,
    combination: "5678",
  },
];

const mockLockedLinks: { [k: number]: Array<Link> } = {
  [mockLockedLockers[0].id]: [
    {
      id: generateRandomNumber(),
      url: "https://www.amazon.com",
      name: "Amazon",
      tags: ["credit-card", "shopping"],
    },
    {
      id: generateRandomNumber(),
      url: "https://www.amazon.com/in",
      name: "Amazon India",
      tags: ["india", "amazon"],
    },
  ],
  [mockLockedLockers[1].id]: [
    {
      id: generateRandomNumber(),
      url: "https://www.tesla.com",
      name: "Tesla",
      tags: ["tesla", "car", "guilty"],
    },
  ],
};

const mockData = {
  use: useMockData,
  useMockUser: useMockUser,
  uid: mockUserUUID,
  open: {
    lockers: mockLockers,
    links: mockLinks,
  },
  locked: {
    lockers: mockLockedLockers,
    links: mockLockedLinks,
  },
};
export default mockData;
