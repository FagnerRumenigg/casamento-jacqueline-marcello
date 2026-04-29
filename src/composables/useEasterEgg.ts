import { computed, ref, watch, type Ref } from 'vue';

interface TriggerKey {
  h: string;
  w: number;
}

interface EggDef {
  k: TriggerKey[];
  i: string;
}

function getAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const defs: EggDef[] = [
  {
    i: getAsset('images/memes/quiama.jpg'),
    k: [
      {
        w: 2,
        h: '2e9152526cf67ff495491960d8072d1f00156131cc74d120e04182316b72e365',
      },
      {
        w: 1,
        h: 'c5048cb86d78ab992d767b9dbeac84d8859c762ec037752e8c5df453e427cac0',
      },
      {
        w: 2,
        h: '3ef773145f83b3ca4eb29fad6de50f273d13c1431c70544650c021ccf68d8545',
      },
    ],
  },
  {
    i: getAsset('images/memes/verdade-bilete.webp'),
    k: [
      {
        w: 4,
        h: '20bf1859a110be907d038becce154fdeb60308212c925324d8d066cb2f2f4f9b',
      },
      {
        w: 3,
        h: '2a149e6f6bcdf3e2391bb430f1e8b8244f567e860cebe982eaebec41143bbac7',
      },
      {
        w: 3,
        h: '05efafee934e305e3af3521aa1c5685a60d25dbaafdd29ae8d8d712d45a40730',
      },
    ],
  },
  {
    i: getAsset('images/memes/nazare.jpg'),
    k: [
      {
        w: 2,
        h: '4795cab2d2d27533ebaa7c539d7f0c4648ae2e18bc7678620962002826117d9a',
      },
      {
        w: 1,
        h: '94f85d534ff923e7f351f74913db83b226705dbd49ae7391a7238b588363997b',
      },
      {
        w: 2,
        h: '406714d45233e28fdcc9aee9ab882367d5d3233af52334d491555881b631de5b',
      },
    ],
  },
  {
    i: getAsset('images/memes/opinar.png'),
    k: [
      {
        w: 5,
        h: '41103de96e787a780b2e770019384c40bf601ccb138963327f50a7202508f778',
      },
      {
        w: 2,
        h: '0dcd8727e3e60c3d3d28bc4bbf0a96a67a1614c157596f487f7000ca9e9b192e',
      },
      {
        w: 5,
        h: '94b5a1876024b0470e6c4d76fb60a0a312d934bd34db4df1eaab66386780f01a',
      },
    ],
  },
  {
    i: getAsset('images/memes/quero_cafe.jpg'),
    k: [
      {
        w: 2,
        h: '4950a6797a9981ff27f177150bc46a14cd9abb585ecee5f06bf3468492fb00df',
      },
      {
        w: 1,
        h: 'a860b858265b22dad3aaf1165cfc2936daf1d3d86e0b7b77e3cc07f59f96858f',
      },
      {
        w: 1,
        h: '10f7602778f6e1f44d31fc1d17871f131f3511939f63c90022cea7a77fcc454e',
      },
    ],
  },
  {
    i: getAsset('images/memes/cinco_reais.png'),
    k: [
      {
        w: 4,
        h: 'e5692976b990f2530e7e16485e689831105b57a9525f655bac0b507321101c2b',
      },
      {
        w: 2,
        h: '68fffc6baaf631cd5c4a7595a98bf2ac694491458cab584f9ebc6aed5f9c6874',
      },
    ],
  },
  {
    i: getAsset('images/memes/natasha_caldeirao.jpg'),
    k: [
      {
        w: 4,
        h: 'aec4527a582650eddfa1e7fab823cc8cb2b83b9900bff82a6bb936d374dfa7db',
      },
      {
        w: 1,
        h: '1e967de59329061dde3fdf6ce9e8b9aa1d81b2b8f620196fac23aa8339167301',
      },
      {
        w: 3,
        h: '0edd914036468074745fce0e75c6d66e043f83432edc9dfbf9882981429e59ce',
      },
    ],
  },
];

const maxWords = defs
  .flatMap((d) => d.k.map((t) => t.w))
  .reduce((a, b) => Math.max(a, b), 1);

async function sha(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const raw = await crypto.subtle.digest('SHA-256', bytes);
  const arr = Array.from(new Uint8Array(raw));
  return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function gramsFrom(msg: string, maxLen: number): string[] {
  if (!msg) return [];
  const tokens = msg.split(' ').filter(Boolean);
  const out = new Set<string>();
  for (let len = 1; len <= maxLen; len += 1) {
    for (let i = 0; i + len <= tokens.length; i += 1) {
      out.add(tokens.slice(i, i + len).join(' '));
    }
  }
  return Array.from(out);
}

async function hashSetFor(msg: string): Promise<Set<string>> {
  const cands = gramsFrom(msg, maxWords);
  const hashes = await Promise.all(cands.map((c) => sha(c)));
  return new Set(hashes);
}

export function useEasterEgg(message: Ref<string>) {
  const normalizedMessage = computed(() => normalize(message.value));
  const easterEggImages = ref<string[]>([]);
  const isUnlocked = computed(() => easterEggImages.value.length > 0);
  let runId = 0;

  watch(
    normalizedMessage,
    async (msg) => {
      const currentRun = ++runId;
      if (!msg) {
        easterEggImages.value = [];
        return;
      }

      const hashes = await hashSetFor(msg);
      if (currentRun !== runId) return;

      easterEggImages.value = defs
        .filter((d) => d.k.some((t) => hashes.has(t.h)))
        .map((d) => d.i);
    },
    { immediate: true },
  );

  return {
    easterEggImages,
    isUnlocked,
  };
}
