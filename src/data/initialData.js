// Comprehensive initial dataset and legitimate metadata catalog for WatchTogether

export const INITIAL_MOVIES = [
  {
    id: "mv-avengers-endgame",
    title: "Avengers: Endgame",
    tagline: "Part of the journey is the end.",
    year: 2019,
    rating: 8.4,
    runtime: "3h 01m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    ageRating: "PG-13",
    director: "Anthony Russo, Joe Russo",
    overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop",
    trailerId: "TcMBFSGVi1c",
    cast: [
      { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
      { name: "Chris Evans", role: "Steve Rogers / Captain America", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
      { name: "Mark Ruffalo", role: "Bruce Banner / Hulk", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
      { name: "Chris Hemsworth", role: "Thor", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" },
      { name: "Scarlett Johansson", role: "Natasha Romanoff / Black Widow", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Disney+", logo: "🏰", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.disneyplus.com", note: "Host logs into Disney+ and shares screen via browser." },
      { name: "YouTube Movies", logo: "▶️", playbackMode: "EMBEDDED", officialUrl: "https://www.youtube.com", note: "Direct preview trailer or screen share available." },
      { name: "Prime Video", logo: "📦", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.primevideo.com", note: "Screen sharing supported through browser tab." },
      { name: "Apple TV", logo: "🍎", playbackMode: "EXTERNAL", officialUrl: "https://tv.apple.com", note: "Opens official Apple TV service." }
    ]
  },
  {
    id: "mv-the-avengers",
    title: "The Avengers",
    tagline: "Some assembly required.",
    year: 2012,
    rating: 8.0,
    runtime: "2h 23m",
    genres: ["Action", "Sci-Fi"],
    ageRating: "PG-13",
    director: "Joss Whedon",
    overview: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    poster: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    trailerId: "eOrNdBpGMv8",
    cast: [
      { name: "Robert Downey Jr.", role: "Tony Stark", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
      { name: "Chris Evans", role: "Steve Rogers", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Disney+", logo: "🏰", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.disneyplus.com" }
    ]
  },
  {
    id: "mv-avengers-infinity-war",
    title: "Avengers: Infinity War",
    tagline: "An entire universe. Once and for all.",
    year: 2018,
    rating: 8.4,
    runtime: "2h 29m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    ageRating: "PG-13",
    director: "Anthony Russo, Joe Russo",
    overview: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
    trailerId: "6ZfuNTqbHE8",
    cast: [
      { name: "Josh Brolin", role: "Thanos", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Disney+", logo: "🏰", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.disneyplus.com" }
    ]
  },
  {
    id: "mv-stranger-things",
    title: "Stranger Things",
    tagline: "Every ending has a beginning.",
    year: 2022,
    rating: 8.7,
    runtime: "4 Seasons",
    genres: ["Drama", "Fantasy", "Horror", "Sci-Fi"],
    ageRating: "TV-14",
    director: "The Duffer Brothers",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    trailerId: "b9EkMc79ZSU",
    cast: [
      { name: "Millie Bobby Brown", role: "Eleven", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
      { name: "Finn Wolfhard", role: "Mike Wheeler", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Netflix", logo: "🔴", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.netflix.com", note: "Host shares Netflix playback via browser tab." }
    ]
  },
  {
    id: "mv-dune-2",
    title: "Dune: Part Two",
    tagline: "Long live the fighters.",
    year: 2024,
    rating: 8.6,
    runtime: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    ageRating: "PG-13",
    director: "Denis Villeneuve",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop",
    trailerId: "Way9Dexny3w",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
      { name: "Zendaya", role: "Chani", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Max", logo: "🟣", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.max.com" }
    ]
  },
  {
    id: "mv-interstellar",
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    year: 2014,
    rating: 8.7,
    runtime: "2h 49m",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    ageRating: "PG-13",
    director: "Christopher Nolan",
    overview: "When Earth becomes uninhabitable, a farmer and ex-NASA pilot is tasked to pilot a spacecraft to find a new habitable world.",
    poster: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop",
    trailerId: "zSWdZVtXT7E",
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Prime Video", logo: "📦", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.primevideo.com" }
    ]
  },
  {
    id: "mv-spider-verse",
    title: "Spider-Man: Across the Spider-Verse",
    tagline: "It's how you wear the mask that matters.",
    year: 2023,
    rating: 8.7,
    runtime: "2h 20m",
    genres: ["Animation", "Action", "Adventure"],
    ageRating: "PG",
    director: "Joaquim Dos Santos",
    overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop",
    trailerId: "cqGjhVJWtEg",
    cast: [
      { name: "Shameik Moore", role: "Miles Morales", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }
    ],
    providers: [
      { name: "Netflix", logo: "🔴", playbackMode: "SCREEN_SHARE", officialUrl: "https://www.netflix.com" }
    ]
  }
];

export const INITIAL_ROOMS = [
  {
    id: "room-friday-night",
    code: "FRIDAY-9821",
    name: "Friday Movie Night 🍿",
    host: {
      id: "u-rahul",
      displayName: "Rahul Sharma",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop"
    },
    privacy: "PUBLIC",
    maxParticipants: 50,
    participantCount: 8,
    isLocked: false,
    isActive: true,
    isScreenSharing: true,
    movie: {
      id: "mv-avengers-endgame",
      title: "Avengers: Endgame",
      poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop",
      year: 2019,
      genre: "Action • Sci-Fi",
      provider: "Disney+"
    },
    participants: [
      { id: "u-rahul", displayName: "Rahul (Host)", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop", role: "HOST", isSpeaking: true, isMuted: false },
      { id: "u-anu", displayName: "Anu", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop", role: "MEMBER", isSpeaking: false, isMuted: false },
      { id: "u-sruthi", displayName: "Sruthi", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop", role: "MEMBER", isSpeaking: false, isMuted: false },
      { id: "u-ravi", displayName: "Ravi", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop", role: "MEMBER", isSpeaking: false, isMuted: true },
      { id: "u-alex", displayName: "Alex", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop", role: "MEMBER", isSpeaking: false, isMuted: false }
    ],
    messages: [
      { id: "m1", userId: "u-rahul", userName: "Rahul", text: "Welcome everyone! Ready for the portal scene? 🍿", time: "14:10", type: "TEXT" },
      { id: "m2", userId: "u-anu", userName: "Anu", text: "OMG YES! Turn up the volume!", time: "14:11", type: "TEXT" },
      { id: "m3", userId: "u-sruthi", userName: "Sruthi", text: "On your left! ❤️🔥", time: "14:12", type: "TEXT" }
    ]
  },
  {
    id: "room-scifi-sundays",
    code: "SCIFI-4412",
    name: "Sci-Fi Sundays: Dune 2 Marathon 🌌",
    host: {
      id: "u-elena",
      displayName: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop"
    },
    privacy: "PUBLIC",
    maxParticipants: 25,
    participantCount: 5,
    isLocked: false,
    isActive: true,
    isScreenSharing: true,
    movie: {
      id: "mv-dune-2",
      title: "Dune: Part Two",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      year: 2024,
      genre: "Sci-Fi • Adventure",
      provider: "Max"
    },
    participants: [
      { id: "u-elena", displayName: "Elena (Host)", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop", role: "HOST", isSpeaking: false, isMuted: false },
      { id: "u-marcus", displayName: "Marcus", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=120&auto=format&fit=crop", role: "MEMBER", isSpeaking: true, isMuted: false }
    ],
    messages: [
      { id: "m4", userId: "u-elena", userName: "Elena", text: "The worm riding scene is legendary.", time: "14:05", type: "TEXT" }
    ]
  }
];

export const INITIAL_FRIENDS = [
  {
    id: "u-rahul",
    displayName: "Rahul Sharma",
    username: "rahul",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
    status: "WATCHING",
    activeRoom: { id: "room-friday-night", name: "Friday Movie Night 🍿", movie: "Avengers: Endgame" }
  },
  {
    id: "u-anu",
    displayName: "Anu Patel",
    username: "anu",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
    status: "WATCHING",
    activeRoom: { id: "room-friday-night", name: "Friday Movie Night 🍿", movie: "Avengers: Endgame" }
  },
  {
    id: "u-sruthi",
    displayName: "Sruthi Jamparangi",
    username: "sruthi",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
    status: "ONLINE",
    activeRoom: null
  },
  {
    id: "u-ravi",
    displayName: "Ravi Teja",
    username: "ravi",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    status: "OFFLINE",
    activeRoom: null
  }
];

export const TRIVIA_QUESTIONS = [
  {
    id: "t1",
    question: "What iconic phrase does Captain America say before leading the army in Endgame?",
    options: ["Avengers, Assemble!", "To the end of the line!", "I can do this all day!", "Let's win this!"],
    correctAnswer: 0
  },
  {
    id: "t2",
    question: "Who directed the sci-fi epic Dune: Part Two?",
    options: ["Christopher Nolan", "Denis Villeneuve", "James Cameron", "Ridley Scott"],
    correctAnswer: 1
  },
  {
    id: "t3",
    question: "In Stranger Things, what is Eleven's favorite snack?",
    options: ["Popcorn", "Eggo Waffles", "Pizza", "Ice Cream"],
    correctAnswer: 1
  }
];
