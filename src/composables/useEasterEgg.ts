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
    i: getAsset('images/memes/6.jpg'),
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
    i: getAsset('images/memes/7.webp'),
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
    i: getAsset('images/memes/2.jpg'),
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
    i: getAsset('images/memes/3.png'),
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
    i: getAsset('images/memes/4.jpg'),
    k: [
      {
        w: 2,
        h: '4950a6797a9981ff27f177150bc46a14cd9abb585ecee5f06bf3468492fb00df',
      },
      {
        w: 2,
        h: '8957b5ea2cae27a3e21e45c959e00c6d501888eea04ed22fd5b8f8fee82c1a14',
      },
    ],
  },
  {
    i: getAsset('images/memes/5.png'),
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
    i: getAsset('images/memes/1.jpg'),
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
  {
    i: getAsset('images/memes/8.jpg'),
    k: [
      {
        w: 3,
        h: '9a7d14c2970c7d1eb5658aaae3d6e13b4ffdb3b78b16a62516b5f608522a6a06',
      },
      {
        w: 1,
        h: '0d5879ae8d601c9825ef2af6e3bfcf4173879171292645d3894dcfee02449191',
      },
      {
        w: 2,
        h: '3f45148c193192a5df4ab5c7ceaf422dffb1b5c4acf35a63f882bf11496f04bd',
      },
      {
        w: 2,
        h: 'e6ce099f782c95071e69de951297e256de36d09120f965008872348adb575be6',
      },
    ],
  },
  {
    i: getAsset('images/memes/9.jpg'),
    k: [
      {
        w: 2,
        h: '7a2c1831dbaccfd9f32418ee6dcdd2c0fad9516f75d43a40d9673f40753ec688',
      },
      {
        w: 1,
        h: '1926c745e3b4d83365e0096c9c1380c14161389bf68d7b6ffa828070b0b3e038',
      },
      {
        w: 2,
        h: '3e555a92dd526339e216e4f7cd489207058c66f1d86d3325a95786f33041eb0f',
      },
    ],
  },
  {
    i: getAsset('images/memes/10.jpg'),
    k: [
      {
        w: 3,
        h: 'aecda2cc22157524728684611001278f2f49a896cc8aae925972639f8c905cfe',
      },
      {
        w: 2,
        h: '0e383cf26b1516a2f32519ba6012468f8dc14fd908aeee38a6bf9dc027009642',
      },
      {
        w: 1,
        h: 'cc4082c626f8772f9e6853ddae7de56213369bf24e7ab10b9fc54c8ccee04cfd',
      },
    ],
  },
  {
    i: getAsset('images/memes/11.jpg'),
    k: [
      {
        w: 3,
        h: 'e9828c8505d1cb90344313952df0ed38a0be061f469edfe4413c320a2436b42c',
      },
      {
        w: 3,
        h: 'b8a95ed190365c94f983e7fef1e5d53f0d47c631ecc4d68403cc799e5d89d4c2',
      },
      {
        w: 3,
        h: 'b1a2e2625137480fec1756fd2db28c699c8f84e8a1c0bf2f0ae5e955bb46dcf1',
      },
      {
        w: 1,
        h: 'eb2e3437cfd175c57c3dfc70891c4f456fc0964f151754f3ce51a8f45c94e67d',
      },
    ],
  },
  {
    i: getAsset('images/memes/12.jpg'),
    k: [
      {
        w: 1,
        h: '0adb6210148ccc08617eb23099977de8c34c034dde71d3959281ecc47dcc3531',
      },
      {
        w: 2,
        h: '293b2a45328fbe46a9fdb3d1a826fea4f193fa15857dae33570b9cbfe58ce450',
      },
    ],
  },
  {
    i: getAsset('images/memes/13.jpg'),
    k: [
      {
        w: 3,
        h: 'c52cd38624cb2e89dfa70643a8e937ca78178f034f3a86f1edbdebf7c7a35617',
      },
      {
        w: 3,
        h: '4fd4452c0f19d7c4a337e61d938d25759c5ff56f9114b0f9e1d8af7e3de06831',
      },
      {
        w: 2,
        h: '60d9d51800b11cb1d26a6af46dad698de2525b303c4387c8fea5e929b96b54fd',
      },
      {
        w: 2,
        h: '92a07b9c0cfe4bbbfb08bee910281c1b6d97d0f37cd2f57b180cf572195a7a0e',
      },
    ],
  },
  {
    i: getAsset('images/memes/14.jpg'),
    k: [
      {
        w: 2,
        h: '410b6c41fa2fd55ad99cb0cdd3690962274d1dca8471d34160aab2d24981024f',
      },
      {
        w: 3,
        h: '9caf69bad28d21cc1e3bd127baa919072c02882d105ec4861de9121c20b85c6d',
      },
      {
        w: 2,
        h: '9fccad38dfbb77c1d0c173be4568cb0650b85568181e9193499922697956f33e',
      },
      {
        w: 1,
        h: '39e18a493b913441c12fac89a09f24958e5da0ff6f3300c80c5359f36e3223aa',
      },
    ],
  },
  {
    i: getAsset('images/memes/15.jpg'),
    k: [
      {
        w: 4,
        h: '7843880b6c9226de80430c761eb81fc11e7728f8672f1b093c2c364ccc93b1de',
      },
      {
        w: 1,
        h: '01b96c24da5590f85ec09e0d4853e6f68a31c2cdbf0209ba6379febdf099b1f4',
      },
      {
        w: 3,
        h: 'ab7f41f42184c9c52b34fd700ef6253f0beddcdf3a5039c6044e84a0d7bd3416',
      },
      {
        w: 3,
        h: '7a05caa3027cfc1f18903e42d75ce4c88de7a0de6e59c5f8290525c0086d1930',
      },
    ],
  },
  {
    i: getAsset('images/memes/16.jpg'),
    k: [
      {
        w: 5,
        h: 'ba70e5801931951a514f17c2eeaa8e32e869a230471f513d31e19d724930e1a2',
      },
      {
        w: 3,
        h: '06d863eff314cd82015e76baeb0e71bdb061f81e62011518648f8f5c3967e3ba',
      },
      {
        w: 2,
        h: '8ea9399e0f894f75b74deeeb493a3b403af2e17464e8118b3df9af8c874dc7f7',
      },
      {
        w: 1,
        h: '14d002066c4c378ecd98a0c27e8ad08a09fa2f4500ac3a40c268b3691630fe76',
      },
      {
        w: 1,
        h: '73199a5eaf1de7313fbdaf6645055582cbf9b177e83737af315d70d6b030b8ed',
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
