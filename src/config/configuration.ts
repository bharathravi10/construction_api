export default () => ({
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/nest-boilerplate',
  PORT: process.env.PORT || 3000,
});
