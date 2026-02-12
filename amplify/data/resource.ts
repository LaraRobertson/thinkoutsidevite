import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a.model({
        content: a.string(),
      }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated().to(['create', 'update', 'delete'])]),

  User: a.model({
    userName: a.string(),
    description: a.string(),
    location: a.string(),
    email: a.string().required(),
    gameScore: a.hasMany('GameScore', 'userID'),
    game: a.hasMany('Game', 'userID'),
    userGamePlay: a.hasMany('UserGamePlay', 'userId'),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated().to(['create', 'update', 'delete'])]),

  Game: a.model({
    gameName: a.string().required(),
    gameDescription: a.string(),
    gameLogisticInfo: a.string(),
    gameSummary: a.string(),
    gameLocationPlace: a.string(),
    latitude: a.string(),
    longitude: a.string(),
    gameLocationPlaceDetails: a.string(),
    gameLocationCity: a.string().required(),
    gameDesigner: a.string(),
    gameLevel: a.string(),
    walkingDistance: a.string(),
    playZones: a.string(),
    gameImage: a.string(),
    gameType: a.string(),
    gameWinMessage: a.string(),
    gameWinImage: a.string(),
    gameGoals: a.string(),
    gameIntro: a.string(),
    gameMap: a.string(),
    gamePlayZone: a.hasMany('GamePlayZone', 'gameID'),
    gameHint: a.hasMany('GameHint', 'gameID'),
    type: a.string().required(),
    gameClue: a.hasMany('GameClue', 'gameID'),
    gamePuzzle: a.hasMany('GamePuzzle', 'gameID'),
    gameScore: a.hasMany('GameScore', 'gameID'),
    userGamePlay: a.hasMany('UserGamePlay', 'gameId'),
    order: a.integer().required(),
    disabled: a.boolean(),
    userID: a.id(),
    user: a.belongsTo('User', 'userID'),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  GamePuzzle: a.model({
    gameID: a.id().required(),
    game: a.belongsTo('Game', 'gameID'),
    gamePlayZoneID: a.string(),
    puzzleName: a.string(),
    puzzleImage: a.string(),
    textField: a.hasMany('TextField', 'puzzleID'),
    puzzleClueText: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  TextField: a.model({
    puzzleID: a.id().required(),
    puzzle: a.belongsTo('GamePuzzle', 'puzzleID'),
    name: a.string(),
    label: a.string(),
    answer: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  GameStats: a.model({
    gameID: a.string().required(),
    userEmail: a.string().required(),
    gameLocationCity: a.string(),
    gameName: a.string().required(),
    gameStates: a.string(),
    gameScore: a.hasMany('GameScore', 'gameStatsID'),
    type: a.string().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  GameScore: a.model({
    gameStatsID: a.id().required(),
    gameStats: a.belongsTo('GameStats', 'gameStatsID'),
    gameID: a.id().required(),
    game: a.belongsTo('Game', 'gameID'),
    numberOfPlayers: a.string(),
    teamName: a.string(),
    teamLocation: a.string(),
    gameComments: a.string(),
    gameTotalTime: a.float().required(),
    completed: a.boolean(),
    firstTime: a.boolean(),
    gameHintTime: a.float().required(),
    disabled: a.boolean(),
    userID: a.id(),
    user: a.belongsTo('User', 'userID'),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  GameHint: a.model({
    gameID: a.id().required(),
    game: a.belongsTo('Game', 'gameID'),
    gamePlayZoneID: a.string(),
    gameHintName: a.string(),
    gameHintDescription: a.string(),
    gameHintType: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  GameClue: a.model({
    gameID: a.id().required(),
    game: a.belongsTo('Game', 'gameID'),
    gamePlayZoneID: a.string(),
    gameClueName: a.string(),
    gameClueIcon: a.string(),
    gameClueImage: a.string(),
    gameClueText: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  GamePlayZone: a.model({
    gameID: a.id().required(),
    game: a.belongsTo('Game', 'gameID'),
    gameZoneName: a.string(),
    gameZoneImage: a.string(),
    gameZoneDescription: a.string(),
    longitude: a.string(),
    latitude: a.string(),
    gameZoneIcon: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  City: a.model({
    cityName: a.string(),
    cityDescription: a.string(),
    cityState: a.string(),
    cityCountry: a.string(),
    cityMap: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  Icon: a.model({
    iconName: a.string(),
    iconText: a.string(),
    order: a.integer().required(),
    disabled: a.boolean(),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),

  UserGamePlay: a.model({
    userId: a.id().required(),
    user: a.belongsTo('User', 'userId'),
    gameId: a.id().required(),
    game: a.belongsTo('Game', 'gameId'),
  }).authorization(allow => [allow.publicApiKey().to(['read']), allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
