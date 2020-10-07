const TRACK_INFO = [
  {
    name: 'LOOPY ONE',
    preview_file: 'assets/tracks/1/preview.png',
    background: 'assets/tracks/1/bg.png',
    pieces: [
      // s is the only supported start piece
      's', 's',
      'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2',
      's4', 'c1', 'c2',
      'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2', 'r2',
      'c1', 'c2', 's', 's',
    ],
    scale: 0.8,
    x: 1100,
    y: 250,
    laps: 10,
    lightsPosition: [-50, 350],
    music: 'assets/audio/music/ohyeah.mp3',
  },
  {
    name: 'LOOPER TWO',
    preview_file: 'assets/tracks/2/preview.png',
    pieces: ['s', 'ss', 'ss', 'ss', 'ss', 'ss', 'ss', 'ss', 's4', 'r4', 'r3', 'r2', 'r1', 's', 's', 'l2', 'l2', 'l1', 'l1', 'l1', 'l1', 'ss', 'ss', 'c1', 'c2', 's', 's', 'l2', 'l2', 'l2', 'ss', 's', 's', 's', 'l1', 'l1', 'l1', 's4', 's4', 's', 'l2', 'l2', 'ss', 'r1', 'r1', 's4', 'l1', 'l1', 'l1', 'l1', 's', 'ss', 'c1', 'c2', 's', 's', 'r3', 'r2', 'r2', 'r1', 'r1', 'ss', 'ss', 'ss', 'r2', 'r1', 'r1', 'ss', 'ss', 'ss', 'ss', 'ss', 'ss', 'r1', 'r1', 'r1', 'r1', 's', 's', 'ss'],
    scale: 0.3,
    x: 600,
    y: 450,
    lightsPosition: [850, 350],
    laps: 3,
    music: 'assets/audio/music/ohyeah.mp3',
    background: 'assets/tracks/2/bg_floor.png',
  },
  {
    name: 'LOOPTY TREE',
    preview_file: 'assets/tracks/3/preview.png',
    pieces: ['s', 's', 's', 's', 'r3', 'r3', 'r2', 'r2', 'r2', 'r2', 'r2', 'r3', 'r3', 'r4', 's', 's', 'l2', 'l2', 'l2', 'l2', 'l2', 'l2', 'l3', 'l3', 'l3', 'l3', 's4', 'c1', 'c2', 's4', 's4', 's', 's', 'l3', 'l3', 'l3', 'l3', 's4', 's', 'l2', 'l2', 'l2', 'l1', 'l1', 'l2', 'l2', 'l2', 'l2', 'r3', 'r2', 'r2', 'r2', 'r2', 'c1', 'c2', 's4', 'r4', 'ss', 's4', 'r3', 'r2', 'r2', 'r2', 'r2', 'r3', 'r4', 's', 'ss'],
    scale: 0.4,
    x: 700,
    y: 275,
    lightsPosition: [350, 350],
    laps: 3,
    music: 'assets/audio/music/ohyeah.mp3',
    background: 'assets/tracks/3/bg.png',
  },
];

export default TRACK_INFO;
